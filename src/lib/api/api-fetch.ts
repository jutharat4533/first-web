import { ApiError } from "@/lib/api/api-error";

export type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: Record<string, unknown> | FormData;
  token?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:10000";

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { body, headers, token, ...init } = options;

  const newHeaders = new Headers(headers);
  if (token) {
    newHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (body !== undefined && !(body instanceof FormData)) {
    newHeaders.set("Content-Type", "application/json");
  }

  let newBody = undefined;
  if (!(body instanceof FormData)) {
    newBody = JSON.stringify(body);
  } else {
    newBody = body;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      body: newBody,
      headers: newHeaders,
    });
  } catch {
    throw new Error(
      `เชื่อมต่อ API ไม่สำเร็จ กรุณาตรวจสอบ API_URL และ CORS (${API_URL})`,
    );
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody && typeof errorBody.message === "string"
        ? errorBody.message
        : `API request failed (${response.status})`;
    throw new ApiError(response.status, message);
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}
