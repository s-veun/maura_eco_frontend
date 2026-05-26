export type AuthenticatedRequest = (path: string, init?: RequestInit) => Promise<Response>;

type ApiErrorPayload = {
  message?: string;
  error?: string;
  success?: boolean;
};

const FORBIDDEN_ENDPOINT_PREFIXES = ["/admin", "/api/v1/admin"];
const FORBIDDEN_EXACT_ENDPOINTS = [
  "/users/all",
  "/admin/dashboard",
  "/admin/orders",
  "/admin/products",
  "/admin/analytics",
];

export class UserApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "UserApiError";
    this.status = status;
  }
}

function ensureUserSafeEndpoint(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (FORBIDDEN_ENDPOINT_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
    throw new Error(`Blocked admin endpoint: ${normalized}`);
  }

  if (FORBIDDEN_EXACT_ENDPOINTS.includes(normalized)) {
    throw new Error(`Blocked admin endpoint: ${normalized}`);
  }
}

async function readErrorMessage(response: Response) {
  const text = await response.text();
  if (!text) {
    return `Request failed with status ${response.status}`;
  }

  try {
    const parsed = JSON.parse(text) as ApiErrorPayload;
    return parsed.message || parsed.error || `Request failed with status ${response.status}`;
  } catch {
    return text;
  }
}

export async function requestJson<T>(
  request: AuthenticatedRequest,
  path: string,
  init?: RequestInit,
): Promise<T> {
  ensureUserSafeEndpoint(path);

  const response = await request(path, init);
  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new UserApiError(message, response.status);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

