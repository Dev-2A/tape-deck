import Dexie from "dexie";

/**
 * Tape Deck IndexedDB 스키마.
 *
 * tapes 테이블 — 카세트테이프 한 권 = 한 row.
 *   primary key: id (uuid)
 *   index: createdAt (정렬용), updatedAt, title (검색용 보조)
 */
class TapeDeckDB extends Dexie {
  constructor() {
    super("TapeDeckDB");

    this.version(1).stores({
      // &id : unique primary key
      // 그 외에는 인덱스 (정렬/검색용)
      tapes: "&id, createdAt, updatedAt, title",
    });
  }
}

export const db = new TapeDeckDB();

/**
 * 테이블 단축 참조.
 */
export const tapesTable = db.tapes;
