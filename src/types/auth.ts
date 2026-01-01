/**
 * GRADE A REALTY - Authentication Types
 * Phase 1 Implementation
 */

import type { User, UserRole } from './index';

// =============================================================================
// AUTH REQUEST/RESPONSE TYPES
// =============================================================================

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    requires2FA?: boolean;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone?: string;
    acceptTerms: boolean;
}

export interface RegisterResponse {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    emailVerificationSent: boolean;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
    emailSent: boolean;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface VerifyEmailRequest {
    token: string;
}

export interface VerifyEmailResponse {
    success: boolean;
    message: string;
}

export interface Enable2FAResponse {
    secret: string;
    qrCodeUrl: string;
    backupCodes: string[];
}

export interface Verify2FARequest {
    code: string;
    secret?: string;
}

export interface Verify2FAResponse {
    success: boolean;
    backupCodes?: string[];
}

// =============================================================================
// AUTH USER TYPE
// =============================================================================

/**
 * Authenticated user with roles and permissions
 */
export interface AuthUser {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    avatarUrl: string | null;
    emailVerified: boolean;
    phoneVerified: boolean;
    kycStatus: 'pending' | 'submitted' | 'verified' | 'rejected';
    twoFactorEnabled: boolean;
    status: 'active' | 'suspended' | 'deactivated';
    roles: UserRole[];
    permissions: string[];
    createdAt: string;
    lastLoginAt: string | null;
}

// =============================================================================
// AUTH STATE
// =============================================================================

export interface AuthState {
    // User data
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Tokens
    accessToken: string | null;
    refreshToken: string | null;
    tokenExpiresAt: number | null;

    // 2FA state
    requires2FA: boolean;
    pending2FAUserId: string | null;

    // Error state
    error: AuthError | null;
}

export interface AuthError {
    code: string;
    message: string;
    field?: string;
}

// =============================================================================
// JWT PAYLOAD
// =============================================================================

export interface JWTPayload {
    sub: string;          // User ID
    email: string;
    roles: UserRole[];
    iat: number;          // Issued at
    exp: number;          // Expiration
    jti: string;          // JWT ID
}

// =============================================================================
// SESSION
// =============================================================================

export interface Session {
    id: string;
    userId: string;
    deviceInfo: DeviceInfo;
    ipAddress: string;
    createdAt: string;
    lastActivityAt: string;
    expiresAt: string;
    isCurrent: boolean;
}

export interface DeviceInfo {
    browser: string;
    os: string;
    device: string;
    isMobile: boolean;
}

// =============================================================================
// PASSWORD VALIDATION
// =============================================================================

export interface PasswordValidation {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'fair' | 'good' | 'strong';
}

export const PASSWORD_REQUIREMENTS = {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    maxLength: 128,
} as const;

/**
 * Validate password against requirements
 */
export function validatePassword(password: string): PasswordValidation {
    const errors: string[] = [];

    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
        errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`);
    }

    if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
        errors.push(`Password must be no more than ${PASSWORD_REQUIREMENTS.maxLength} characters`);
    }

    if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (PASSWORD_REQUIREMENTS.requireNumber && !/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (PASSWORD_REQUIREMENTS.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    // Calculate strength
    let strength: PasswordValidation['strength'] = 'weak';
    const score = [
        password.length >= 12,
        password.length >= 16,
        /[A-Z]/.test(password),
        /[a-z]/.test(password),
        /\d/.test(password),
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        password.length >= 20,
    ].filter(Boolean).length;

    if (score >= 6) strength = 'strong';
    else if (score >= 4) strength = 'good';
    else if (score >= 3) strength = 'fair';

    return {
        isValid: errors.length === 0,
        errors,
        strength,
    };
}

// =============================================================================
// RATE LIMITING
// =============================================================================

export const AUTH_RATE_LIMITS = {
    LOGIN_ATTEMPTS: 5,
    LOGIN_LOCKOUT_MINUTES: 15,
    PASSWORD_RESET_ATTEMPTS: 3,
    PASSWORD_RESET_COOLDOWN_MINUTES: 60,
    EMAIL_VERIFICATION_ATTEMPTS: 3,
    TWO_FA_ATTEMPTS: 3,
} as const;
