/**
 * 앱 전역 라우트 경로 상수.
 */
export const ROUTES = {
  COLLECTION: "/",
  CREATE: "/create",
  PLAY: "/play/:tapeId",
  EDIT: "/edit/:tapeId",
  SETTINGS: "/settings",
};

export const buildRoute = {
  play: (tapeId) => `/play/${tapeId}`,
  edit: (tapeId) => `/edit/${tapeId}`,
};
