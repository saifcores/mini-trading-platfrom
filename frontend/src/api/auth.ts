import { apiFetch, setAuthToken } from "../lib/api/client";

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

export type AuthResponse = {
  accessToken: string;
  tokenType: string;
  expiresInMs: number;
  userId: number;
  email: string;
};

export type RegisterBody = { email: string; password: string };
export type LoginBody = RegisterBody;

/** POST /api/auth/register — stores JWT in localStorage on success */
export async function registerAndSignIn(
  body: RegisterBody,
): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
  setAuthToken(res.accessToken);
  globalThis.localStorage?.setItem(AUTH_EMAIL_KEY, res.email);
  notifyAuthChanged();
  return res;
}

/** POST /api/auth/login */
export async function login(body: LoginBody): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
  setAuthToken(res.accessToken);
  globalThis.localStorage?.setItem(AUTH_EMAIL_KEY, res.email);
  notifyAuthChanged();
  return res;
}

export function logout(): void {
  setAuthToken(null);
  globalThis.localStorage?.removeItem(AUTH_EMAIL_KEY);
  notifyAuthChanged();
}
