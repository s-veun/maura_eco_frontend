export interface ApiErrorShape {
  status?: number | string;
  data?: { message?: string; error?: string } | string;
  error?: string;
  response?: {
    data?: { message?: string; error?: string } | string;
  };
  message?: string;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== "object") return fallback;

  const e = error as ApiErrorShape;

  if (e.response?.data && typeof e.response.data === "object") {
    if (typeof e.response.data.error === "string" && e.response.data.error.trim()) return e.response.data.error;
    if (typeof e.response.data.message === "string" && e.response.data.message.trim()) return e.response.data.message;
  }
  if (typeof e.response?.data === "string" && e.response.data.trim()) return e.response.data;

  if (typeof e.data === "string" && e.data.trim()) return e.data;
  if (e.data && typeof e.data === "object" && typeof e.data.message === "string") {
    return e.data.message;
  }
  if (e.data && typeof e.data === "object" && typeof e.data.error === "string" && e.data.error.trim()) {
    return e.data.error;
  }
  if (typeof e.error === "string" && e.error.trim()) return e.error;
  if (typeof e.message === "string" && e.message.trim()) return e.message;

  return fallback;
}
