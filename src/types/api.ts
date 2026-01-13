/**
 * GRADE A REALTY - API Data Contracts
 * Phase 2.1 Implementation
 * 
 * This file defines the strict data contracts for the API Endpoints.
 * It serves as the single source of truth for communication between Frontend and Backend.
 */

import {
    User,
    Property,
    PropertySearchFilters,
    PropertyFormData,
    ApplicationFormData,
    OfferFormData,
    Transaction,
    Notification,
    MaintenanceRequest,
    Vendor,
    ApiResponse,
    PaginatedResponse,
    Application,
    Offer
} from './index';

import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest
} from './auth';

// =============================================================================
// API ROUTES ENUM
// =============================================================================

export enum ApiRoutes {
    // Auth
    AUTH_LOGIN = '/auth/login',
    AUTH_REGISTER = '/auth/register',
    AUTH_REFRESH = '/auth/refresh',
    AUTH_LOGOUT = '/auth/logout',
    AUTH_ME = '/auth/me',
    AUTH_FORGOT_PASSWORD = '/auth/forgot-password',
    AUTH_RESET_PASSWORD = '/auth/reset-password',
    AUTH_VERIFY_EMAIL = '/auth/verify-email',
    AUTH_CHANGE_PASSWORD = '/auth/change-password',

    // Users
    USERS_LIST = '/users',
    USERS_GET = '/users/:id',
    USERS_UPDATE = '/users/:id',
    USERS_DELETE = '/users/:id',

    // Properties
    PROPERTIES_LIST = '/properties',
    PROPERTIES_GET = '/properties/:id',
    PROPERTIES_CREATE = '/properties',
    PROPERTIES_UPDATE = '/properties/:id',
    PROPERTIES_DELETE = '/properties/:id',
    PROPERTIES_UPLOAD_IMAGE = '/properties/:id/images',
    PROPERTIES_FEATURED = '/properties/featured',
    PROPERTIES_MY_LISTINGS = '/properties/my-listings',

    // Dashboard
    DASHBOARD_STATS = '/dashboard/stats',

    // Applications
    APPLICATIONS_LIST = '/applications',
    APPLICATIONS_GET = '/applications/:id',
    APPLICATIONS_CREATE = '/applications',
    APPLICATIONS_UPDATE = '/applications/:id',

    // Offers
    OFFERS_LIST = '/offers',
    OFFERS_CREATE = '/offers',
    OFFERS_GET = '/offers/:id',
    OFFERS_RESPOND = '/offers/:id/respond',
}

// =============================================================================
// AUTH CONTRACTS
// =============================================================================

// Re-exporting from auth.ts for completeness
export type {
    LoginRequest, LoginResponse,
    RegisterRequest, RegisterResponse,
    RefreshTokenRequest, RefreshTokenResponse,
    ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest, VerifyEmailRequest
};

// =============================================================================
// DASHBOARD CONTRACTS
// =============================================================================

export interface DashboardStatsResponse {
    totalProperties: number;
    activeListings: number;
    totalUsers: number;
    activeOwners: number;
    activeRenters: number;
    monthlyRevenue: number;
    platformFees: number;
    pendingPayments: number;
    maintenanceRequests: number;
    pendingApprovals: number;

    // Trends (vs previous month)
    viewsTrend: number; // percentage change
    incomeTrend: number; // percentage change
}

// =============================================================================
// PROPERTY CONTRACTS
// =============================================================================

export interface GetPropertiesRequest extends PropertySearchFilters {
    // Inherits query, pagination, and filter fields from PropertySearchFilters
}

export type GetPropertiesResponse = PaginatedResponse<Property>;

export type GetPropertyResponse = Property;

export type CreatePropertyRequest = PropertyFormData;
export type CreatePropertyResponse = Property;

export type UpdatePropertyRequest = Partial<PropertyFormData>;
export type UpdatePropertyResponse = Property;

export interface UploadImageResponse {
    url: string;
    thumbnailUrl: string;
    fileId: string;
}

// =============================================================================
// USER CONTRACTS
// =============================================================================

export interface GetUsersRequest {
    page?: number;
    pageSize?: number;
    role?: string;
    status?: string;
    query?: string;
}

export type GetUsersResponse = PaginatedResponse<User>;

export type UpdateUserRequest = Partial<User>;

// =============================================================================
// APPLICATION & OFFER CONTRACTS
// =============================================================================

export type CreateApplicationRequest = ApplicationFormData;
export type CreateApplicationResponse = Application;

export type CreateOfferRequest = OfferFormData;
export type CreateOfferResponse = Offer;

export interface RespondToOfferRequest {
    status: 'accepted' | 'rejected' | 'countered';
    counterAmount?: number;
    message?: string;
}

// =============================================================================
// CHAT CONTRACTS
// =============================================================================

export interface ChatMessage {
    senderInfo: {
        role: 'user' | 'system' | 'assistant';
        userId?: string;
    };
    content: string;
    timestamp: string;
    context?: {
        pageUrl?: string;
        selectedPropertyId?: string;
    };
}

export interface SendMessageRequest {
    message: string;
    context?: any;
}

export interface SendMessageResponse {
    success: boolean;
    data: ChatMessage;
}

// =============================================================================
// GENERIC API CLIENT INTERFACE
// =============================================================================

/**
 * Interface that the API Client Service must implement.
 * This ensures the frontend is decoupled from the actual HTTP implementation.
 */
export interface ApiClientInterface {
    auth: {
        login(data: LoginRequest): Promise<ApiResponse<LoginResponse>>;
        register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>>;
        logout(): Promise<ApiResponse<void>>;
        refresh(data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>>;
        me(): Promise<ApiResponse<User>>;
        forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<void>>;
        resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>>;
        changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>>;
        verify2FA(data: { code: string; sessionId?: string }): Promise<ApiResponse<LoginResponse>>;
        verifyEmail(token: string): Promise<ApiResponse<void>>;
        resendVerification(): Promise<ApiResponse<void>>;
    };
    properties: {
        list(params: GetPropertiesRequest): Promise<ApiResponse<GetPropertiesResponse>>;
        get(id: string): Promise<ApiResponse<GetPropertyResponse>>;
        create(data: CreatePropertyRequest): Promise<ApiResponse<CreatePropertyResponse>>;
        update(id: string, data: UpdatePropertyRequest): Promise<ApiResponse<UpdatePropertyResponse>>;
        delete(id: string): Promise<ApiResponse<void>>;
        getFeatured(): Promise<ApiResponse<Property[]>>;
    };
    users: {
        list(params?: GetUsersRequest): Promise<ApiResponse<GetUsersResponse>>;
        get(id: string): Promise<ApiResponse<User>>;
        update(id: string, data: UpdateUserRequest): Promise<ApiResponse<User>>;
    };
    dashboard: {
        getStats(): Promise<ApiResponse<DashboardStatsResponse>>;
    };
    chat: {
        send(data: SendMessageRequest): Promise<ApiResponse<ChatMessage>>;
    };
}
