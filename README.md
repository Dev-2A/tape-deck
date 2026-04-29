# 📼 Tape Deck

> YouTube URL을 카세트테이프 한 면씩 담아 재생하는 감성 음악 플레이어.
> 실용성보다 미학에 진지한 프로젝트.

🎧 **라이브 데모**: https://dev-2a.github.io/tape-deck/

---

## ✨ 주요 기능

### 🎵 카세트테이프 UI 음악 플레이어

- YouTube URL을 한 면당 여러 곡 담아 카세트테이프로 만들기
- 진짜 카세트테이프 모양 SVG UI — 재생 중 두 릴이 부드럽게 회전
- 빈티지 다크 테마 + 빛바랜 종이 라벨 + `MIXTAPE · CrO₂ · 90 MIN` 디테일

### 🎚️ 인터랙티브 컨트롤

- 마우스 드래그로 돌리는 SVG 볼륨 노브 (휠·키보드 지원)
- 클릭/드래그로 시킹 가능한 진행 바
- 키보드 단축키: `Space`(재생/정지), `←→`(트랙), `Shift+←→`(시킹), `[ ]`(A/B면), `M`(음소거)

### 📼 A면 / B면 시스템

- 면 토글 시 카세트가 부드럽게 페이드되는 전환 애니메이션
- A면 끝나면 자동으로 B면 재생 (자동 플립)
- 한 곡 반복 / 한 면 반복 / 끄기 (3-state)

### 🎨 케이스 디자이너

- 12종 큐레이션된 색상 프리셋 + 커스텀 색 picker
- 4가지 패턴: 솔리드 / 사선 줄무늬 / 점 / 격자
- 7개 카테고리 이모지 카탈로그 + 직접 입력
- 라이브 미리보기 — 디자인 변경 즉시 반영

### 📚 컬렉션 관리

- 그리드 뷰 / 책장 뷰 (척추 진열) 토글
- 검색 (제목·아티스트·이모지)
- 정렬 (최근순 / 오래된순 / 제목순 / 많이 들은순)
- JSON 백업·복원 (충돌 처리: 덮어쓰기 / 건너뛰기)
- 모든 데이터는 브라우저 IndexedDB에 영구 저장

---

## 🛠️ 기술 스택

- **프론트엔드**: React 18 + Vite 7
- **스타일링**: Tailwind CSS v4
- **라우팅**: React Router v7 (HashRouter)
- **저장소**: IndexedDB (Dexie.js + dexie-react-hooks)
- **재생**: YouTube IFrame Player API
- **메타데이터**: YouTube oEmbed
- **배포**: GitHub Pages (gh-pages 브랜치)

---

## 📦 로컬 실행

```bash
git clone https://github.com/Dev-2A/tape-deck.git
cd tape-deck
npm install
npm run dev
```

http://localhost:5173/tape-deck/ 접속

### 빌드 / 미리보기

```bash
npm run build      # production 빌드
npm run preview    # 빌드 결과 로컬 확인
```

### 배포

```bash
npm run deploy     # gh-pages 브랜치로 자동 배포
```

---

## ⌨️ 키보드 단축키 (재생 페이지)

| 키 | 동작 |
| --- | --- |
| `Space` | 재생 / 일시정지 |
| `←` / `→` | 이전 / 다음 트랙 |
| `Shift` + `←` / `→` | 10초 시킹 |
| `[` | A면으로 |
| `]` | B면으로 |
| `M` | 음소거 토글 |

---

## 📁 프로젝트 구조

```text
src/
├── components/
│   ├── layout/       # Header, Footer, Layout
│   ├── tape/         # CassetteSVG, VolumeKnob, ProgressBar
│   ├── creator/      # CoverDesigner, TrackListInput
│   ├── shelf/        # TapeCard, TapeSpine, Shelf, Toolbar
│   └── common/       # ErrorBoundary
├── pages/            # Collection, Player, Create, Edit, Settings
├── hooks/            # useTapes, useYouTubePlayer, useReelRotation,
│                     # useKnobDrag, useTrackInput, useConfirm, ...
├── db/               # tapeDb (Dexie 스키마), tapeRepository
├── services/         # youtubeMeta, exportImport
├── contexts/         # ToastContext
├── utils/            # formatTime, colorHelpers, tapeFilters, ...
└── constants/        # routes, coverPalette
```

---

## 🔗 시리즈

**감성 UI 시리즈 #1** — "취하미 아카이빙" 시리즈 다음 작품.

- [BookShelf.log](https://github.com/Dev-2A/bookshelf-log) — 독서 기록
- [Backlog Radio](https://github.com/Dev-2A/backlog-radio) — 백로그 라디오 플레이어
- [Diary of Claude](https://github.com/Dev-2A/diary-of-claude) — Claude와의 대화 일기
- **📼 Tape Deck** ← 지금 여기 (UI 미학 자체가 메인인 첫 작품)

---

## 📄 라이선스

MIT © 2026 [Dev-2A](https://github.com/Dev-2A)

Made with 🥤 cola and 💙
