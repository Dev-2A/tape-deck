import { tapesTable } from "./tapeDb";
import { uuid } from "../utils/uuid";

/**
 * 새 테이프의 기본 골격을 만든다.
 * 컬러·이모지·트랙 목록은 비어 있는 상태로 시작.
 */
export function createBlankTape(overrides = {}) {
  const now = Date.now();
  return {
    id: uuid(),
    title: overrides.title || "제목 없는 테이프",
    artist: overrides.artist || "",
    cover: overrides.cover || {
      bgColor: "#8fb8d9", // 시그니처 파스텔 블루
      accentColor: "#d4a574", // 빈티지 앰버
      emoji: "📼",
      pattern: "solid",
    },
    sideA: overrides.sideA || [],
    sideB: overrides.sideB || [],
    createdAt: now,
    updatedAt: now,
    playCount: 0,
  };
}

/**
 * 테이프 추가.
 * @param {object} tape - 전체 tape 객체 (id 포함)
 * @returns {Promise<string>} 추가된 tape.id
 */
export async function addTape(tape) {
  await tapesTable.add(tape);
  return tape.id;
}

/**
 * 테이프 단건 조회.
 * @param {string} id
 * @returns {Promise<object|undefined>}
 */
export async function getTape(id) {
  return await tapesTable.get(id);
}

/**
 * 모든 테이프 조회 — 최근 업데이트순.
 * @returns {Promise<Array>}
 */
export async function getAllTapes() {
  return await tapesTable.orderBy("updatedAt").reverse().toArray();
}

/**
 * 테이프 부분 수정.
 * @param {string} id
 * @param {object} patch - 변경할 필드만
 */
export async function updateTape(id, patch) {
  await tapesTable.update(id, {
    ...patch,
    updatedAt: Date.now(),
  });
}

/**
 * 테이프 삭제.
 */
export async function deleteTape(id) {
  await tapesTable.delete(id);
}

/**
 * 재생 카운트 증가 — 재생 시작 시 호출.
 */
export async function incrementPlayCount(id) {
  const tape = await getTape(id);
  if (!tape) return;
  await tapesTable.update(id, {
    playCount: (tape.playCount || 0) + 1,
  });
}

/**
 * 모든 테이프 삭제 — 가져오기 시 덮어쓰기 등에 사용.
 * Step 13(가져오기/내보내기)에서 사용 예정.
 */
export async function clearAllTapes() {
  await tapesTable.clear();
}
