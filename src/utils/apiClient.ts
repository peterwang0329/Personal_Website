/**
 * API 請求工具
 * 封裝 fetch 請求，自動附加 JWT Token 和處理錯誤
 */

const TOKEN_KEY = "auth_token";

/** 從 localStorage 取得 Token */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** 儲存 Token 到 localStorage */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** 移除 Token */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/** API 請求錯誤類別 */
export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: any) {
    let parsedDetail = "發生未知錯誤";
    if (typeof detail === "string") {
      parsedDetail = detail;
    } else if (Array.isArray(detail) && detail.length > 0) {
      // 處理 FastAPI Pydantic 的 422 驗證錯誤陣列
      const firstError = detail[0];
      if (firstError.msg) {
        // FastAPI 預設會加上 "Value error, " 前綴，這裡試著將其移除讓顯示更簡潔
        parsedDetail = firstError.msg.replace("Value error, ", "");
      }
    }

    super(parsedDetail);
    this.status = status;
    this.detail = parsedDetail;
  }
}

/**
 * 封裝的 fetch 函式
 * - 自動附加 Authorization header
 * - 自動解析 JSON 回應
 * - 401 錯誤時自動清除 Token
 */
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    cache: "no-store",
    ...options,
    headers,
  });

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    // 401 表示 Token 無效，清除 Token
    if (response.status === 401) {
      removeToken();
    }

    const detail = data?.detail || "發生未知錯誤";
    throw new ApiError(response.status, detail);
  }

  return data as T;
}

/**
 * 專門用於上傳檔案的 fetch 函式 (multipart/form-data)
 */
export async function apiFetchUpload<T>(
  url: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    method: options.method || "POST",
    headers,
    body: formData, // fetch 會自動處理 boundary
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
    }
    const detail = data?.detail || "發生未知錯誤";
    throw new ApiError(response.status, detail);
  }

  return data as T;
}
