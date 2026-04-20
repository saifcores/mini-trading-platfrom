/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /** Set to "1" to call `/api/...` on the same origin (pair with Vite dev proxy to Spring Boot). */
  readonly VITE_API_RELATIVE?: string;
  readonly VITE_DEV_PROXY_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
