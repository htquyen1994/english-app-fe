// ============================================================
// API CLIENT — Wrapper cho fetch() gọi đến Spring Boot backend
//
// Angular analogue: HttpClient + Interceptor
// Ở đây ta tự build interceptor logic bằng fetch wrapper
// ============================================================

// Base URL của Spring Boot backend
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

// ============================================================
// TYPES
// ============================================================

interface RequestConfig extends RequestInit {
    params?: Record<string, string | number | boolean>;
}

// Lỗi tùy chỉnh từ API — giúp error handling nhất quán
export class ApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly code: string,
        message: string,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// ============================================================
// TOKEN MANAGEMENT (sẽ tích hợp với auth store sau)
// ============================================================

function getAccessToken(): string | null {
    // Trong thực tế sẽ lấy từ Zustand store hoặc sessionStorage
    if (typeof window === 'undefined') return null; // Server-side: không có token
    return sessionStorage.getItem('accessToken');
}

// ============================================================
// CORE FETCH WRAPPER
// ============================================================

async function request<T>(
    endpoint: string,
    config: RequestConfig = {},
): Promise<T> {
    const { params, ...fetchConfig } = config;

    // Append query params nếu có: /vocabulary?page=1&limit=20
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, String(value));
        });
    }

    // Merge headers mặc định
    const token = getAccessToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...fetchConfig.headers,
    };

    const response = await fetch(url.toString(), {
        ...fetchConfig,
        headers,
    });

    // Handle lỗi HTTP
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new ApiError(
            response.status,
            errorBody.code ?? 'UNKNOWN_ERROR',
            errorBody.message ?? `HTTP ${response.status}`,
        );
    }

    // 204 No Content — không có body
    if (response.status === 204) return undefined as T;

    return response.json() as Promise<T>;
}

// ============================================================
// HTTP METHODS — API đơn giản, quen thuộc
// ============================================================

export const apiClient = {
    get<T>(endpoint: string, params?: RequestConfig['params']): Promise<T> {
        return request<T>(endpoint, { method: 'GET', params });
    },

    post<T>(endpoint: string, body: unknown): Promise<T> {
        return request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    put<T>(endpoint: string, body: unknown): Promise<T> {
        return request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    },

    patch<T>(endpoint: string, body: unknown): Promise<T> {
        return request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    },

    delete<T>(endpoint: string): Promise<T> {
        return request<T>(endpoint, { method: 'DELETE' });
    },
};
