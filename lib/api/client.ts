/**
 * API Client for backend communication
 * All API calls go through this client to the backend API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  private userIdKey = 'auth_user_id';

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const userId = this.getUserId();
    const headers: HeadersInit = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }
    if (userId) {
      (headers as any)['X-User-Id'] = userId;
    }

    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new ApiError(
          data.message || `HTTP error! status: ${response.status}`,
          response.status,
          data
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private getUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.userIdKey);
  }

  setToken(token: string | null): void {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  setUserId(userId: string | null): void {
    if (userId) {
      localStorage.setItem(this.userIdKey, userId);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
