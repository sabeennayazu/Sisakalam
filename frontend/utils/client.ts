import { API_BASE_URL, getToken } from "./api";

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | Record<string, unknown> | FormData | null;
  query?: Record<string, string | number | boolean | null | undefined>;
}

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const buildQueryString = (query?: ApiRequestOptions["query"]): string => {
  if (!query) {
    return "";
  }

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    params.append(key, String(value));
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

const parseResponseBody = async (response: Response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  if (response.status === 204) {
    return null;
  }

  try {
    return await response.text();
  } catch {
    return null;
  }
};

export const apiFetch = async <T = unknown>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { body, query, headers, ...requestOptions } = options;
  const url = `${path.startsWith("http") ? "" : API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}${buildQueryString(query)}`;

  const requestHeaders = new Headers(headers);
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (!isFormData && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const finalBody = body === undefined || body === null
    ? undefined
    : isFormData
      ? body as FormData
      : typeof body === "string" || body instanceof Blob || body instanceof ArrayBuffer || ArrayBuffer.isView(body) || body instanceof URLSearchParams
        ? body as BodyInit
        : JSON.stringify(body);

  const response = await fetch(url, {
    ...requestOptions,
    headers: requestHeaders,
    body: finalBody,
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    const detail = typeof data === "object" && data !== null
      ? (data as Record<string, unknown>).detail || (data as Record<string, unknown>).message || data
      : data;

    throw new ApiError(typeof detail === "string" ? detail : "An unexpected error occurred", response.status, data);
  }

  return data as T;
};
