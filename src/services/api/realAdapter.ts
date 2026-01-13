
import {
    ApiClientInterface,
    LoginRequest, LoginResponse,
    RegisterRequest, RegisterResponse,
    RefreshTokenRequest, RefreshTokenResponse,
    ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest, VerifyEmailRequest,
    GetPropertiesRequest, GetPropertiesResponse, GetPropertyResponse, CreatePropertyRequest, CreatePropertyResponse, UpdatePropertyRequest, UpdatePropertyResponse,
    GetUsersRequest, GetUsersResponse, UpdateUserRequest,
    DashboardStatsResponse,
    SendMessageRequest, SendMessageResponse
} from '../../types/api';
import { ApiResponse, User, Property } from '../../types';

const API_BASE_url = '/api'; // Proxied by Vite to localhost:3000

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = getAccessToken();

    const headers: any = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_url}${endpoint}`, {
            ...options,
            headers
        });

        const text = await response.text();
        let data;
        try {
            data = text ? JSON.parse(text) : {};
        } catch (e) {
            console.error('Failed to parse JSON response:', text);
            return {
                success: false,
                error: { code: 'PARSE_ERROR', message: `Invalid JSON response: ${text.substring(0, 100)}...` }
            };
        }

        if (!response.ok) {
            return {
                success: false,
                error: data.error || { code: 'HTTP_ERROR', message: data.message || `Request failed with status ${response.status}` }
            };
        }

        // If backend returns { success: true, data: ... }
        if (data.success !== undefined) {
            return data;
        }

        // If backend returns raw data (legacy or strict), wrap it
        return { success: true, data };

    } catch (error: any) {
        return {
            success: false,
            error: { code: 'NETWORK_ERROR', message: error.message || 'Network request failed' }
        };
    }
}

// Helper to get token from storage (matching zustand persistence)
function getAccessToken(): string | null {
    try {
        const storage = localStorage.getItem('grade-a-auth');
        if (!storage) return null;
        const parsed = JSON.parse(storage);
        return parsed.state?.accessToken || null;
    } catch {
        return null;
    }
}

export const realApiAdapter: ApiClientInterface = {
    auth: {
        async login(data: LoginRequest) {
            return request<LoginResponse>('/auth/login', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        async register(data: RegisterRequest) {
            return request<RegisterResponse>('/auth/register', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        async logout() {
            // Client-side cleanup handled by store, but we can notify server if needed
            // return request<void>('/auth/logout', { method: 'POST' });
            return { success: true };
        },
        async refresh(data: RefreshTokenRequest) {
            return request<RefreshTokenResponse>('/auth/refresh', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        async me() {
            return request<User>('/auth/me');
        },

        // Placeholder implementations for Phase 2.2
        async forgotPassword(data: ForgotPasswordRequest) {
            return request<void>('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) });
        },
        async resetPassword(data: ResetPasswordRequest) {
            return request<void>('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) });
        },
        async changePassword(data: ChangePasswordRequest) {
            return request<void>('/auth/change-password', { method: 'POST', body: JSON.stringify(data) });
        },
        async verify2FA(data) {
            return request<LoginResponse>('/auth/verify-2fa', { method: 'POST', body: JSON.stringify(data) });
        },
        async verifyEmail(token: string) {
            return request<void>('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) });
        },
        async resendVerification() {
            return request<void>('/auth/resend-verification', { method: 'POST' });
        }
    },

    properties: {
        async list(params: GetPropertiesRequest) {
            const query = new URLSearchParams(params as any).toString();
            return request<GetPropertiesResponse>(`/properties?${query}`);
        },
        async get(id: string) {
            return request<GetPropertyResponse>(`/properties/${id}`);
        },
        async create(data: CreatePropertyRequest) {
            return request<CreatePropertyResponse>('/properties', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        async update(id: string, data: UpdatePropertyRequest) {
            return request<UpdatePropertyResponse>(`/properties/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data)
            });
        },
        async delete(id: string) {
            return request<void>(`/properties/${id}`, { method: 'DELETE' });
        },
        async getFeatured() {
            return request<Property[]>('/properties/featured');
        }
    },

    users: {
        async list(params: GetUsersRequest = {}) {
            const query = new URLSearchParams(params as any).toString();
            return request<GetUsersResponse>(`/users?${query}`);
        },
        async get(id: string) {
            return request<User>(`/users/${id}`);
        },
        async update(id: string, data: UpdateUserRequest) {
            return request<User>(`/users/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data)
            });
        }
    },

    dashboard: {
        async getStats() {
            return request<DashboardStatsResponse>('/dashboard/stats');
        }
    },

    chat: {
        async send(data: SendMessageRequest) {
            const result = await request<SendMessageResponse>('/chat/message', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            // Unwrap the nested data structure from the controller
            if (result.success && result.data && (result.data as any).data) {
                return { success: true, data: (result.data as any).data };
            }
            return result as any;
        }
    }
};
