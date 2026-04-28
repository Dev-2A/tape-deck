import { useLiveQuery } from "dexie-react-hooks";
import { tapesTable } from "../db/tapeDb";

/**
 * 모든 테이프를 최근 업데이트순으로 구독한다.
 * IndexedDB가 변경되면 자동 리렌더.
 *
 * @returns {Array|undefined} - 로딩 중일 땐 undefined, 이후 배열
 */
export function useTapes() {
  return useLiveQuery(
    () => tapesTable.orderBy("updatedAt").reverse().toArray(),
    [],
  );
}

/**
 * 단일 테이프 구독.
 *
 * @param {string} id
 * @returns {object|undefined}
 */
export function useTape(id) {
  return useLiveQuery(() => (id ? tapesTable.get(id) : undefined), [id]);
}
