import {
  getAllTapes,
  addTape,
  updateTape,
  getTape,
} from "../db/tapeRepository";
import { uuid } from "../utils/uuid";

/**
 * 백업 파일 포맷 버전.
 * 스키마가 바뀌면 올리고, importTapes 측에서 마이그레이션 로직 추가.
 */
const FORMAT_VERSION = 1;

const APP_NAME = "tape-deck";

/**
 * 모든 테이프를 단일 JSON 객체로 직렬화.
 * @returns {object} 백업 페이로드
 */
export async function exportTapesToJSON() {
  const tapes = await getAllTapes();
  return {
    app: APP_NAME,
    version: FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    count: tapes.length,
    tapes,
  };
}

/**
 * 백업 페이로드의 형식이 유효한지 확인.
 * 너무 엄격하면 사용자가 손으로 편집한 파일도 거부되니, 핵심 필드만 본다.
 */
export function validateBackup(payload) {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "파일을 읽을 수 없어요." };
  }
  if (payload.app && payload.app !== APP_NAME) {
    return { valid: false, error: "이 앱의 백업 파일이 아니에요." };
  }
  if (!Array.isArray(payload.tapes)) {
    return { valid: false, error: "tapes 배열이 없어요." };
  }
  // 알 수 없는 미래 버전 — 일단 시도는 가능
  if (payload.version && payload.version > FORMAT_VERSION) {
    return {
      valid: true,
      warning: `더 새 버전(v${payload.version})의 백업이에요. 일부 정보가 빠질 수 있어요.`,
    };
  }
  return { valid: true };
}

/**
 * 단일 테이프 객체 정규화 — 가져온 데이터에 누락 필드를 채움.
 */
function normalizeTape(raw) {
  const now = Date.now();
  return {
    id: raw.id || uuid(),
    title: typeof raw.title === "string" ? raw.title : "제목 없는 테이프",
    artist: typeof raw.artist === "string" ? raw.artist : "",
    cover: {
      bgColor: raw.cover?.bgColor || "#8fb8d9",
      accentColor: raw.cover?.accentColor || "#d4a574",
      emoji: raw.cover?.emoji || "📼",
      pattern: raw.cover?.pattern || "solid",
    },
    sideA: Array.isArray(raw.sideA)
      ? raw.sideA.map(normalizeTrack).filter(Boolean)
      : [],
    sideB: Array.isArray(raw.sideB)
      ? raw.sideB.map(normalizeTrack).filter(Boolean)
      : [],
    createdAt: typeof raw.createdAt === "number" ? raw.createdAt : now,
    updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : now,
    playCount: typeof raw.playCount === "number" ? raw.playCount : 0,
  };
}

function normalizeTrack(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (typeof raw.videoId !== "string" || !raw.videoId) return null;
  return {
    id: raw.id || uuid(),
    videoId: raw.videoId,
    title: typeof raw.title === "string" ? raw.title : "",
    duration: typeof raw.duration === "number" ? raw.duration : 0,
  };
}

/**
 * 백업 페이로드를 IndexedDB에 적용한다.
 *
 * @param {object} payload
 * @param {'merge'|'overwrite'|'skip'} mode
 *   - merge:    같은 id면 덮어쓰기, 없으면 추가 (기본)
 *   - overwrite: 같은 id면 덮어쓰기, 없으면 추가 (= merge와 동일)
 *   - skip:     같은 id면 건너뛰기, 없으면 추가
 *
 * @returns {{ added: number, updated: number, skipped: number }}
 */
export async function importTapesFromPayload(payload, mode = "merge") {
  const stats = { added: 0, updated: 0, skipped: 0 };

  for (const raw of payload.tapes) {
    const tape = normalizeTape(raw);
    const existing = await getTape(tape.id);

    if (existing) {
      if (mode === "skip") {
        stats.skipped++;
        continue;
      }
      // merge / overwrite — 그냥 덮어쓰기
      await updateTape(tape.id, {
        title: tape.title,
        artist: tape.artist,
        cover: tape.cover,
        sideA: tape.sideA,
        sideB: tape.sideB,
        playCount: tape.playCount,
      });
      stats.updated++;
    } else {
      await addTape(tape);
      stats.added++;
    }
  }

  return stats;
}

/**
 * 파일 객체 → JSON 페이로드 파싱.
 */
export function parseBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result;
        const json = JSON.parse(text);
        resolve(json);
      } catch (e) {
        reject(
          new Error("JSON 파싱에 실패했어요. 손상된 파일인지 확인해주세요."),
        );
      }
    };
    reader.onerror = () => reject(new Error("파일을 읽을 수 없어요."));
    reader.readAsText(file);
  });
}

/**
 * 백업 파일명 생성.
 * 예: tape-deck-backup-20260428-1430.json
 */
export function buildBackupFilename(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `tape-deck-backup-${y}${m}${d}-${h}${min}.json`;
}
