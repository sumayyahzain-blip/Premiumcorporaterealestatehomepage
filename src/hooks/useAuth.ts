/**
 * GRADE A REALTY - Authentication Hook
 * React hook for authentication operations
 * Phase 2 Implementation (Connected to API)
 */

import { useCallback, useEffect, useRef } from 'react';
import { useAuthStore, showSuccessToast, showErrorToast } from '../store';
import { useNotificationStore } from '../store/notificationStore';
import type {
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    Verify2FARequest,
} from '../types/auth';
import { UserRole } from '../types';
import { api } from '../services/api';

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
    const refreshTimerRef = useRef<any>(null);

    // ---------------------------------------------------------------------------
    // TOKEN REFRESH LOGIC
    // ---------------------------------------------------------------------------

    const refreshTokens = useCallback(async (): Promise<void> => {
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await api.auth.refresh({ refreshToken });

            if (response.success && response.data) {
                const { accessToken: newAccess, refreshToken: newRefresh, expiresIn } = response.data;
                setTokens(newAccess, newRefresh, expiresIn);
                scheduleTokenRefresh();
            } else {
                throw new Error('Token refresh failed');
            }
        } catch (error) {
            throw error;
        }
    }, [refreshToken, setTokens]); // Added refreshTokens to dependency if needed, but it uses setTokens which is stable

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
                // Must call the function derived from store/component logic
                await refreshTokens();
            } catch (error) {
                console.error('Token refresh failed:', error);
                storeLogout();
            }
        }, refreshIn);
    }, [getTimeUntilExpiry, refreshTokens, storeLogout]);


    // ---------------------------------------------------------------------------
    // INITIALIZE SESSION
    // ---------------------------------------------------------------------------

    const fetchCurrentUser = useCallback(async (): Promise<void> => {
        try {
            const response = await api.auth.me();
            if (response.success && response.data) {
                const apiUser = response.data;
                // Map roles for AuthUser (UserRole[])
                const authUserRoles: UserRole[] = apiUser.roles?.map(r => r.role) || [];
                updateUser({ ...apiUser, roles: authUserRoles });
            } else {
                storeLogout();
            }
        } catch (error) {
            // storeLogout(); // Only logout on auth error?
        }
    }, [updateUser, storeLogout]);

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
    }, [accessToken, refreshToken, isTokenExpired, refreshTokens, fetchCurrentUser, scheduleTokenRefresh, storeLogout, setLoading]);

    // Run on mount
    useEffect(() => {
        initializeSession();

        return () => {
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }
        };
    }, []); // Check deps? initializeSession changes if auth state changes... might be cyclic. 
    // Typically init session runs once on mount.

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
            const response = await api.auth.login(data);

            if (response.success && response.data) {
                const { user, accessToken, refreshToken, expiresIn, requires2FA: is2FARequired } = response.data;

                if (is2FARequired) {
                    // Assuming user.id or similar acts as session identifier for now
                    set2FARequired(true, user.id);
                    setLoading(false);
                    return true;
                }

                if (user && accessToken && refreshToken) {
                    storeLogin(user, accessToken, refreshToken, expiresIn);
                    scheduleTokenRefresh();
                    showSuccessToast('Welcome back!', `Logged in as ${user.email}`);
                    return true;
                }
            }

            setError({
                code: response.error?.code || 'LOGIN_ERROR',
                message: response.error?.message || 'Login failed',
            });
            return false;

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
            const response = await api.auth.verify2FA({ code: data.code });

            if (response.success && response.data) {
                const { user, accessToken, refreshToken, expiresIn } = response.data;
                storeLogin(user, accessToken, refreshToken, expiresIn);
                scheduleTokenRefresh();
                set2FARequired(false);
                showSuccessToast('Verification successful');
                return true;
            }

            setError({
                code: response.error?.code || 'INVALID_2FA_CODE',
                message: response.error?.message || 'Invalid verification code',
            });
            return false;
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
            const response = await api.auth.register(data);

            if (response.success && response.data) {
                const { user, accessToken, refreshToken, expiresIn } = response.data;
                storeLogin(user, accessToken, refreshToken, expiresIn);
                scheduleTokenRefresh();
                showSuccessToast(
                    'Account created!',
                    'Please check your email to verify your account'
                );
                return true;
            }

            setError({
                code: response.error?.code || 'REGISTER_ERROR',
                message: response.error?.message || 'Registration failed',
                field: response.error?.details?.field
            });
            return false;

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

            await api.auth.logout();

            storeLogout();
            showInfoToast('Logged out', 'You have been logged out successfully');
        } catch (error) {
            // Still logout locally even if server call fails
            storeLogout();
        }
    };

    /**
     * Request password reset
     */
    const forgotPassword = async (data: ForgotPasswordRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.auth.forgotPassword(data);
            if (response.success) {
                showSuccessToast(
                    'Reset email sent',
                    'If an account exists with this email, you will receive password reset instructions'
                );
                return true;
            }
            setError({
                code: response.error?.code || 'FORGOT_PASSWORD_ERROR',
                message: response.error?.message || 'Failed to send reset email',
            });
            return false;
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
            const response = await api.auth.resetPassword(data);
            if (response.success) {
                showSuccessToast(
                    'Password reset successful',
                    'You can now log in with your new password'
                );
                return true;
            }
            setError({
                code: response.error?.code || 'RESET_PASSWORD_ERROR',
                message: response.error?.message || 'Failed to reset password',
            });
            return false;
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
            const response = await api.auth.changePassword(data);
            if (response.success) {
                showSuccessToast('Password changed', 'Your password has been updated');
                return true;
            }
            setError({
                code: response.error?.code || 'CHANGE_PASSWORD_ERROR',
                message: response.error?.message || 'Failed to change password',
            });
            return false;
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
            await api.auth.resendVerification();
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
            await api.auth.verifyEmail(token);
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
