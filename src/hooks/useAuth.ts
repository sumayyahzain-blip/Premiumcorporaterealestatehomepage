/**
 * GRADE A REALTY - Authentication Hook
 * React hook for authentication operations
 * Phase 1 Implementation
 */

import { useCallback, useEffect, useRef } from 'react';
import { useAuthStore, showSuccessToast, showErrorToast } from '../store';
import type {
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    Verify2FARequest,
    AuthUser,
} from '../types/auth';
import { getPermissionsForRoles } from '../types/permissions';

// =============================================================================
// MOCK API (Will be replaced with real API calls)
// =============================================================================

// Simulated API delay
const apiDelay = (ms: number = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user database
const mockUsers: Record<string, { user: AuthUser; password: string }> = {
    'admin@gradea.realty': {
        user: {
            id: 'a0000000-0000-0000-0000-000000000001',
            email: 'admin@gradea.realty',
            firstName: 'System',
            lastName: 'Administrator',
            phone: null,
            avatarUrl: null,
            emailVerified: true,
            phoneVerified: false,
            kycStatus: 'verified',
            twoFactorEnabled: false,
            status: 'active',
            roles: ['super_admin'],
            permissions: [],
            createdAt: new Date().toISOString(),
            lastLoginAt: null,
        },
        password: 'SuperAdmin123!',
    },
    'owner@example.com': {
        user: {
            id: 'b0000000-0000-0000-0000-000000000002',
            email: 'owner@example.com',
            firstName: 'John',
            lastName: 'Owner',
            phone: '+1234567890',
            avatarUrl: null,
            emailVerified: true,
            phoneVerified: true,
            kycStatus: 'verified',
            twoFactorEnabled: false,
            status: 'active',
            roles: ['owner', 'investor'],
            permissions: [],
            createdAt: new Date().toISOString(),
            lastLoginAt: null,
        },
        password: 'OwnerPass123!',
    },
    'renter@example.com': {
        user: {
            id: 'c0000000-0000-0000-0000-000000000003',
            email: 'renter@example.com',
            firstName: 'Jane',
            lastName: 'Renter',
            phone: '+1234567891',
            avatarUrl: null,
            emailVerified: true,
            phoneVerified: false,
            kycStatus: 'verified',
            twoFactorEnabled: false,
            status: 'active',
            roles: ['renter'],
            permissions: [],
            createdAt: new Date().toISOString(),
            lastLoginAt: null,
        },
        password: 'RenterPass123!',
    },
};

// =============================================================================
// HOOK
// =============================================================================

export function useAuthHook() {
    const {
        user,
        isAuthenticated,
        isLoading,
        error,
        requires2FA,
        accessToken,
        refreshToken,
        login: storeLogin,
        logout: storeLogout,
        updateUser,
        setLoading,
        setError,
        set2FARequired,
        setTokens,
        isTokenExpired,
        getTimeUntilExpiry,
    } = useAuthStore();

    // Token refresh timer ref
    const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

    // ---------------------------------------------------------------------------
    // TOKEN REFRESH LOGIC
    // ---------------------------------------------------------------------------

    const scheduleTokenRefresh = useCallback(() => {
        // Clear existing timer
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }

        const timeUntilExpiry = getTimeUntilExpiry();
        if (timeUntilExpiry <= 0) return;

        // Refresh 1 minute before expiry
        const refreshIn = Math.max(0, timeUntilExpiry - 60000);

        refreshTimerRef.current = setTimeout(async () => {
            try {
                await refreshTokens();
            } catch (error) {
                console.error('Token refresh failed:', error);
                storeLogout();
            }
        }, refreshIn);
    }, [getTimeUntilExpiry]);

    // ---------------------------------------------------------------------------
    // INITIALIZE SESSION
    // ---------------------------------------------------------------------------

    const initializeSession = useCallback(async () => {
        setLoading(true);

        try {
            if (!accessToken || isTokenExpired()) {
                if (refreshToken) {
                    await refreshTokens();
                } else {
                    storeLogout();
                }
            } else {
                // Validate token and fetch user
                await fetchCurrentUser();
                scheduleTokenRefresh();
            }
        } catch (error) {
            storeLogout();
        } finally {
            setLoading(false);
        }
    }, [accessToken, refreshToken, isTokenExpired]);

    // Run on mount
    useEffect(() => {
        initializeSession();

        return () => {
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }
        };
    }, []);

    // ---------------------------------------------------------------------------
    // AUTH METHODS
    // ---------------------------------------------------------------------------

    /**
     * Log in with email and password
     */
    const login = async (data: LoginRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await apiDelay(800);

            // Mock validation
            const mockUser = mockUsers[data.email.toLowerCase()];

            if (!mockUser || mockUser.password !== data.password) {
                setError({
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid email or password',
                });
                setLoading(false);
                return false;
            }

            if (mockUser.user.status === 'suspended') {
                setError({
                    code: 'ACCOUNT_SUSPENDED',
                    message: 'Your account has been suspended. Please contact support.',
                });
                setLoading(false);
                return false;
            }

            // Check if 2FA required
            if (mockUser.user.twoFactorEnabled) {
                set2FARequired(true, mockUser.user.id);
                setLoading(false);
                return true;
            }

            // Generate mock tokens
            const accessToken = `mock-access-token-${Date.now()}`;
            const refreshToken = `mock-refresh-token-${Date.now()}`;
            const expiresIn = 3600; // 1 hour

            // Update user with permissions
            const userWithPermissions: AuthUser = {
                ...mockUser.user,
                permissions: getPermissionsForRoles(mockUser.user.roles),
                lastLoginAt: new Date().toISOString(),
            };

            storeLogin(userWithPermissions, accessToken, refreshToken, expiresIn);
            scheduleTokenRefresh();

            showSuccessToast('Welcome back!', `Logged in as ${userWithPermissions.email}`);

            return true;
        } catch (error) {
            setError({
                code: 'LOGIN_ERROR',
                message: 'An error occurred during login. Please try again.',
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Verify 2FA code
     */
    const verify2FA = async (data: Verify2FARequest): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await apiDelay(500);

            // Mock 2FA verification (any 6-digit code works)
            if (!/^\d{6}$/.test(data.code)) {
                setError({
                    code: 'INVALID_2FA_CODE',
                    message: 'Invalid verification code',
                });
                setLoading(false);
                return false;
            }

            // In real implementation, validate code and return tokens
            set2FARequired(false);
            showSuccessToast('Verification successful');

            return true;
        } catch (error) {
            setError({
                code: '2FA_ERROR',
                message: 'An error occurred during verification',
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Register a new user
     */
    const register = async (data: RegisterRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await apiDelay(1200);

            // Check if email already exists
            if (mockUsers[data.email.toLowerCase()]) {
                setError({
                    code: 'EMAIL_EXISTS',
                    message: 'An account with this email already exists',
                    field: 'email',
                });
                setLoading(false);
                return false;
            }

            // Validate passwords match
            if (data.password !== data.confirmPassword) {
                setError({
                    code: 'PASSWORD_MISMATCH',
                    message: 'Passwords do not match',
                    field: 'confirmPassword',
                });
                setLoading(false);
                return false;
            }

            // Create mock user
            const newUser: AuthUser = {
                id: `user-${Date.now()}`,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone || null,
                avatarUrl: null,
                emailVerified: false,
                phoneVerified: false,
                kycStatus: 'pending',
                twoFactorEnabled: false,
                status: 'active',
                roles: [], // No roles until verified
                permissions: [],
                createdAt: new Date().toISOString(),
                lastLoginAt: null,
            };

            // Generate mock tokens
            const accessToken = `mock-access-token-${Date.now()}`;
            const refreshToken = `mock-refresh-token-${Date.now()}`;
            const expiresIn = 3600;

            storeLogin(newUser, accessToken, refreshToken, expiresIn);
            scheduleTokenRefresh();

            showSuccessToast(
                'Account created!',
                'Please check your email to verify your account'
            );

            return true;
        } catch (error) {
            setError({
                code: 'REGISTER_ERROR',
                message: 'An error occurred during registration',
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Log out
     */
    const logout = async (): Promise<void> => {
        try {
            // Clear refresh timer
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }

            // In real implementation, invalidate tokens on server
            await apiDelay(300);

            storeLogout();
            showInfoToast('Logged out', 'You have been logged out successfully');
        } catch (error) {
            // Still logout locally even if server call fails
            storeLogout();
        }
    };

    /**
     * Refresh access token
     */
    const refreshTokens = async (): Promise<void> => {
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            await apiDelay(300);

            // Generate new tokens
            const newAccessToken = `mock-access-token-${Date.now()}`;
            const newRefreshToken = `mock-refresh-token-${Date.now()}`;
            const expiresIn = 3600;

            setTokens(newAccessToken, newRefreshToken, expiresIn);
            scheduleTokenRefresh();
        } catch (error) {
            throw new Error('Token refresh failed');
        }
    };

    /**
     * Fetch current user data
     */
    const fetchCurrentUser = async (): Promise<void> => {
        // In real implementation, call /api/auth/me
        await apiDelay(300);
        // User data would be fetched and updated here
    };

    /**
     * Request password reset
     */
    const forgotPassword = async (data: ForgotPasswordRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await apiDelay(1000);

            // Always show success to prevent email enumeration
            showSuccessToast(
                'Reset email sent',
                'If an account exists with this email, you will receive password reset instructions'
            );

            return true;
        } catch (error) {
            setError({
                code: 'FORGOT_PASSWORD_ERROR',
                message: 'An error occurred. Please try again.',
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Reset password with token
     */
    const resetPassword = async (data: ResetPasswordRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await apiDelay(1000);

            if (data.password !== data.confirmPassword) {
                setError({
                    code: 'PASSWORD_MISMATCH',
                    message: 'Passwords do not match',
                    field: 'confirmPassword',
                });
                setLoading(false);
                return false;
            }

            showSuccessToast(
                'Password reset successful',
                'You can now log in with your new password'
            );

            return true;
        } catch (error) {
            setError({
                code: 'RESET_PASSWORD_ERROR',
                message: 'Invalid or expired reset token',
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Change password (while logged in)
     */
    const changePassword = async (data: ChangePasswordRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await apiDelay(800);

            if (data.newPassword !== data.confirmNewPassword) {
                setError({
                    code: 'PASSWORD_MISMATCH',
                    message: 'New passwords do not match',
                    field: 'confirmNewPassword',
                });
                setLoading(false);
                return false;
            }

            showSuccessToast('Password changed', 'Your password has been updated');

            return true;
        } catch (error) {
            setError({
                code: 'CHANGE_PASSWORD_ERROR',
                message: 'Failed to change password. Please check your current password.',
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Resend email verification
     */
    const resendVerificationEmail = async (): Promise<boolean> => {
        setLoading(true);

        try {
            await apiDelay(500);

            showSuccessToast(
                'Verification email sent',
                'Please check your inbox'
            );

            return true;
        } catch (error) {
            showErrorToast('Failed to send verification email');
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Verify email with token
     */
    const verifyEmail = async (token: string): Promise<boolean> => {
        setLoading(true);

        try {
            await apiDelay(800);

            if (user) {
                updateUser({ emailVerified: true });
            }

            showSuccessToast('Email verified', 'Your email has been verified');

            return true;
        } catch (error) {
            showErrorToast('Invalid or expired verification link');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------------------------------------------------------
    // RETURN
    // ---------------------------------------------------------------------------

    return {
        // State
        user,
        isAuthenticated,
        isLoading,
        error,
        requires2FA,

        // Methods
        login,
        verify2FA,
        register,
        logout,
        forgotPassword,
        resetPassword,
        changePassword,
        resendVerificationEmail,
        verifyEmail,
        refreshTokens,

        // Helpers
        clearError: () => setError(null),
    };
}

// Helper for toast (will be imported from store)
const showInfoToast = (title: string, message?: string) => {
    useNotificationStore.getState().addToast({
        type: 'info',
        title,
        message,
    });
};

// Import at top level for the helper
import { useNotificationStore } from '../store/notificationStore';
