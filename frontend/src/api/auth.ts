import { apiFetch, setAuthToken } from "../lib/api/client";
import { num } from "../lib/jsonNumbers";
import { API_PATHS } from "./paths";

const AUTH_EMAIL_KEY = "auth_email";

function notifyAuthChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-changed"));
  }
}

export function getAuthEmail(): string | null {
  if (typeof globalThis.localStorage === "undefined") return null;
  return globalThis.localStorage.getItem(AUTH_EMAIL_KEY)?.trim() || null;
}

/** Mirrors backend `AuthResponse` record */
export type AuthResponse = {
  accessToken: string;
  tokenType: string;
  expiresInMs: number;
  userId: number;
  email: string;
};

export type RegisterBody = { email: string; password: string };
export type LoginBody = RegisterBody;

function mapAuthResponse(raw: AuthResponse): AuthResponse {
  const uid = raw.userId == null ? Number.NaN : num(raw.userId);
  return {
    accessToken: raw.accessToken,
    tokenType: raw.tokenType,
    expiresInMs: Number.isFinite(num(raw.expiresInMs))
      ? num(raw.expiresInMs)
      : 0,
    userId: Number.isFinite(uid) ? uid : 0,
    email: raw.email,
  };
}

/** POST /api/auth/register — `AuthController` */
export async function registerAndSignIn(
  body: RegisterBody,
): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>(API_PATHS.authRegister, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const mapped = mapAuthResponse(res);
  setAuthToken(mapped.accessToken);
  globalThis.localStorage?.setItem(AUTH_EMAIL_KEY, mapped.email);
  notifyAuthChanged();
  return mapped;
}

/** POST /api/auth/login */
export async function login(body: LoginBody): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>(API_PATHS.authLogin, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const mapped = mapAuthResponse(res);
  setAuthToken(mapped.accessToken);
  globalThis.localStorage?.setItem(AUTH_EMAIL_KEY, mapped.email);
  notifyAuthChanged();
  return mapped;
}

export function logout(): void {
  setAuthToken(null);
  globalThis.localStorage?.removeItem(AUTH_EMAIL_KEY);
  notifyAuthChanged();
}
