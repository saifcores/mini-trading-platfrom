import { getApiBaseUrl } from "../env";

export class ApiError extends Error {
  status: number;
  body?: string;

  constructor(message: string, status: number, body?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function getAuthToken(): string | null {
  if (typeof globalThis.localStorage === "undefined") return null;
  const raw = globalThis.localStorage.getItem("auth_token");
  return raw?.trim() || null;
}

export function setAuthToken(token: string | null): void {
  if (typeof globalThis.localStorage === "undefined") return;
  if (token) {
    globalThis.localStorage.setItem("auth_token", token);
  } else {
    globalThis.localStorage.removeItem("auth_token");
  }
}

function readAuthToken(): string | null {
  return getAuthToken();
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const base = getApiBaseUrl();
  if (base === null) {
    throw new Error(
      "API base URL is not configured (set VITE_API_URL or VITE_API_RELATIVE=1).",
    );
  }
  const pathPart = path.startsWith("/") ? path : `/${path}`;
  const url = base === "" ? pathPart : `${base}${pathPart}`;
  const headers = new Headers(init?.headers);
  const token = readAuthToken();
  const isAuthEndpoint = pathPart.startsWith("/api/auth/");
  if (token && !isAuthEndpoint) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (
    init?.body !== undefined &&
    !headers.has("Content-Type") &&
    !(init.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...init, headers });

  if (!res.ok) {
    const text = await res.text();
    let message = text || res.statusText || "Request failed";
    try {
      const j = JSON.parse(text) as { message?: string; code?: string };
      if (typeof j.message === "string") {
        message = j.code ? `${j.code}: ${j.message}` : j.message;
      }
    } catch {
      /* keep body as message */
    }
    throw new ApiError(message, res.status, text);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const ct = res.headers.get("content-type");
  if (ct?.includes("application/json")) {
    return (await res.json()) as T;
  }

  return (await res.text()) as T;
}
