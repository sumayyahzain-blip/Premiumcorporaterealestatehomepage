/**
 * GRADE A REALTY - API Client
 * HTTP client with authentication and error handling
 * Phase 1 Implementation
 */

import { useAuthStore } from '../store';
import type { ApiResponse, ApiError } from '../types';

// =============================================================================
// TYPES
// =============================================================================

export interface RequestConfig extends Omit<RequestInit, 'body'> {
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined | null>;
    timeout?: number;
    skipAuth?: boolean;
}

export interface ApiClientConfig {
    baseUrl?: string;
    defaultTimeout?: number;
    onUnauthorized?: () => void;
    onForbidden?: () => void;
}

// =============================================================================
// ERROR CLASSES
// =============================================================================

export class ApiClientError extends Error {
    public code: string;
    public status: number;
    public details?: Record<string, string[]>;

    constructor(
        message: string,
        code: string = 'API_ERROR',
        status: number = 500,
        details?: Record<string, string[]>
    ) {
        super(message);
        this.name = 'ApiClientError';
        this.code = code;
        this.status = status;
        this.details = details;
    }

    static fromApiError(error: ApiError, status: number): ApiClientError {
        return new ApiClientError(error.message, error.code, status, error.details);
    }
}

export class NetworkError extends Error {
    constructor(message: string = 'Network error occurred') {
        super(message);
        this.name = 'NetworkError';
    }
}

export class TimeoutError extends Error {
    constructor(message: string = 'Request timeout') {
        super(message);
        this.name = 'TimeoutError';
    }
}

// =============================================================================
// API CLIENT CLASS
// =============================================================================

class ApiClient {
    private baseUrl: string;
    private defaultTimeout: number;
    private onUnauthorized?: () => void;
    private onForbidden?: () => void;

    constructor(config: ApiClientConfig = {}) {
        this.baseUrl = config.baseUrl || '';
        this.defaultTimeout = config.defaultTimeout || 30000;
        this.onUnauthorized = config.onUnauthorized;
        this.onForbidden = config.onForbidden;
    }

    /**
     * Get authentication headers
     */
    private getAuthHeaders(): Record<string, string> {
        const { accessToken } = useAuthStore.getState();

        if (accessToken) {
            return { Authorization: `Bearer ${accessToken}` };
        }

        return {};
    }

    /**
     * Build URL with query parameters
     */
    private buildUrl(
        endpoint: string,
        params?: Record<string, string | number | boolean | undefined | null>
    ): string {
        const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

        if (!params) return url;

        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, String(value));
            }
        }

        const queryString = searchParams.toString();
        return queryString ? `${url}?${queryString}` : url;
    }

    /**
     * Create abort controller with timeout
     */
    private createAbortController(timeout: number): {
        controller: AbortController;
        timeoutId: NodeJS.Timeout;
    } {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        return { controller, timeoutId };
    }

    /**
     * Handle response
     */
    private async handleResponse<T>(response: Response): Promise<T> {
        // Handle 204 No Content
        if (response.status === 204) {
            return undefined as T;
        }

        // Parse response body
        let data: ApiResponse<T>;
        try {
            data = await response.json();
        } catch {
            throw new ApiClientError(
                'Invalid response format',
                'INVALID_RESPONSE',
                response.status
            );
        }

        // Handle error responses
        if (!response.ok) {
            const error = data.error || {
                code: 'UNKNOWN_ERROR',
                message: 'An unknown error occurred',
            };

            throw ApiClientError.fromApiError(error, response.status);
        }

        // Return data
        return data.data as T;
    }

    /**
     * Make HTTP request
     */
    async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const {
            body,
            params,
            timeout = this.defaultTimeout,
            skipAuth = false,
            headers: customHeaders = {},
            ...fetchConfig
        } = config;

        const url = this.buildUrl(endpoint, params);
        const { controller, timeoutId } = this.createAbortController(timeout);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(!skipAuth ? this.getAuthHeaders() : {}),
            ...(customHeaders as Record<string, string>),
        };

        const requestConfig: RequestInit = {
            ...fetchConfig,
            headers,
            signal: controller.signal,
        };

        if (body !== undefined) {
            requestConfig.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, requestConfig);

            // Handle auth errors
            if (response.status === 401) {
                this.onUnauthorized?.();
                throw new ApiClientError('Unauthorized', 'UNAUTHORIZED', 401);
            }

            if (response.status === 403) {
                this.onForbidden?.();
                throw new ApiClientError('Forbidden', 'FORBIDDEN', 403);
            }

            return await this.handleResponse<T>(response);
        } catch (error) {
            if (error instanceof ApiClientError) {
                throw error;
            }

            if (error instanceof DOMException && error.name === 'AbortError') {
                throw new TimeoutError();
            }

            if (error instanceof TypeError) {
                throw new NetworkError();
            }

            throw new ApiClientError('Request failed', 'REQUEST_FAILED', 500);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    /**
     * GET request
     */
    async get<T>(
        endpoint: string,
        params?: Record<string, string | number | boolean | undefined | null>,
        config?: Omit<RequestConfig, 'params' | 'method' | 'body'>
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'GET',
            params,
        });
    }

    /**
     * POST request
     */
    async post<T>(
        endpoint: string,
        body?: unknown,
        config?: Omit<RequestConfig, 'body' | 'method'>
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'POST',
            body,
        });
    }

    /**
     * PUT request
     */
    async put<T>(
        endpoint: string,
        body?: unknown,
        config?: Omit<RequestConfig, 'body' | 'method'>
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PUT',
            body,
        });
    }

    /**
     * PATCH request
     */
    async patch<T>(
        endpoint: string,
        body?: unknown,
        config?: Omit<RequestConfig, 'body' | 'method'>
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PATCH',
            body,
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(
        endpoint: string,
        config?: Omit<RequestConfig, 'method'>
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'DELETE',
        });
    }

    /**
     * Upload file
     */
    async upload<T>(
        endpoint: string,
        file: File | FormData,
        config?: Omit<RequestConfig, 'body' | 'method'>
    ): Promise<T> {
        const formData = file instanceof FormData ? file : (() => {
            const fd = new FormData();
            fd.append('file', file);
            return fd;
        })();

        const { accessToken } = useAuthStore.getState();

        return this.request<T>(endpoint, {
            ...config,
            method: 'POST',
            body: formData,
            headers: {
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                // Don't set Content-Type for FormData - browser will set it with boundary
            },
        });
    }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

export const apiClient = new ApiClient({
    baseUrl: import.meta.env.VITE_API_URL || '/api',
    defaultTimeout: 30000,
    onUnauthorized: () => {
        // Attempt token refresh or logout
        const { logout, refreshToken } = useAuthStore.getState();
        if (!refreshToken) {
            logout();
        }
    },
});

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================

export const { get, post, put, patch, delete: del, upload, request } = apiClient;
