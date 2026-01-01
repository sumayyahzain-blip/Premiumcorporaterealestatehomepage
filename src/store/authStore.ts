/**
 * GRADE A REALTY - Authentication Store
 * Zustand-based state management for authentication
 * Phase 1 Implementation
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser, AuthState, AuthError } from '../types/auth';
import type { UserRole } from '../types';
import { hasPermission, hasAnyPermission, isAdmin, isSuperAdmin, getPermissionsForRoles } from '../types/permissions';
import type { Permission } from '../types/permissions';

// =============================================================================
// STORE INTERFACE
// =============================================================================

interface AuthStore extends AuthState {
    // Actions
    setUser: (user: AuthUser | null) => void;
    setTokens: (accessToken: string, refreshToken: string, expiresIn: number) => void;
    clearTokens: () => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: AuthError | null) => void;
    set2FARequired: (required: boolean, userId?: string) => void;

    // Auth lifecycle
    login: (user: AuthUser, accessToken: string, refreshToken: string, expiresIn: number) => void;
    logout: () => void;
    updateUser: (updates: Partial<AuthUser>) => void;

    // Permission checks
    hasRole: (role: UserRole) => boolean;
    hasAnyRole: (roles: UserRole[]) => boolean;
    hasPermission: (permission: Permission) => boolean;
    hasAnyPermission: (permissions: Permission[]) => boolean;
    isAdmin: () => boolean;
    isSuperAdmin: () => boolean;
    isKYCVerified: () => boolean;

    // Token management
    isTokenExpired: () => boolean;
    getTimeUntilExpiry: () => number;

    // Computed
    getFullName: () => string;
    getInitials: () => string;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start as loading to check for existing session
    accessToken: null,
    refreshToken: null,
    tokenExpiresAt: null,
    requires2FA: false,
    pending2FAUserId: null,
    error: null,
};

// =============================================================================
// AUTH STORE
// =============================================================================

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            // -----------------------------------------------------------------------
            // SETTERS
            // -----------------------------------------------------------------------

            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                isLoading: false,
            }),

            setTokens: (accessToken, refreshToken, expiresIn) => set({
                accessToken,
                refreshToken,
                tokenExpiresAt: Date.now() + (expiresIn * 1000),
            }),

            clearTokens: () => set({
                accessToken: null,
                refreshToken: null,
                tokenExpiresAt: null,
            }),

            setLoading: (isLoading) => set({ isLoading }),

            setError: (error) => set({ error }),

            set2FARequired: (required, userId) => set({
                requires2FA: required,
                pending2FAUserId: userId || null,
            }),

            // -----------------------------------------------------------------------
            // AUTH LIFECYCLE
            // -----------------------------------------------------------------------

            login: (user, accessToken, refreshToken, expiresIn) => {
                set({
                    user,
                    accessToken,
                    refreshToken,
                    tokenExpiresAt: Date.now() + (expiresIn * 1000),
                    isAuthenticated: true,
                    isLoading: false,
                    requires2FA: false,
                    pending2FAUserId: null,
                    error: null,
                });
            },

            logout: () => {
                set({
                    ...initialState,
                    isLoading: false,
                });
            },

            updateUser: (updates) => {
                const { user } = get();
                if (user) {
                    set({
                        user: { ...user, ...updates },
                    });
                }
            },

            // -----------------------------------------------------------------------
            // PERMISSION CHECKS
            // -----------------------------------------------------------------------

            hasRole: (role) => {
                const { user } = get();
                return user?.roles.includes(role) ?? false;
            },

            hasAnyRole: (roles) => {
                const { user } = get();
                return roles.some(role => user?.roles.includes(role)) ?? false;
            },

            hasPermission: (permission) => {
                const { user } = get();
                if (!user) return false;
                return hasPermission(user.roles, permission);
            },

            hasAnyPermission: (permissions) => {
                const { user } = get();
                if (!user) return false;
                return hasAnyPermission(user.roles, permissions);
            },

            isAdmin: () => {
                const { user } = get();
                if (!user) return false;
                return isAdmin(user.roles);
            },

            isSuperAdmin: () => {
                const { user } = get();
                if (!user) return false;
                return isSuperAdmin(user.roles);
            },

            isKYCVerified: () => {
                const { user } = get();
                return user?.kycStatus === 'verified';
            },

            // -----------------------------------------------------------------------
            // TOKEN MANAGEMENT
            // -----------------------------------------------------------------------

            isTokenExpired: () => {
                const { tokenExpiresAt } = get();
                if (!tokenExpiresAt) return true;
                // Consider expired 30 seconds before actual expiry
                return Date.now() >= (tokenExpiresAt - 30000);
            },

            getTimeUntilExpiry: () => {
                const { tokenExpiresAt } = get();
                if (!tokenExpiresAt) return 0;
                return Math.max(0, tokenExpiresAt - Date.now());
            },

            // -----------------------------------------------------------------------
            // COMPUTED
            // -----------------------------------------------------------------------

            getFullName: () => {
                const { user } = get();
                if (!user) return '';
                const parts = [user.firstName, user.lastName].filter(Boolean);
                return parts.length > 0 ? parts.join(' ') : user.email;
            },

            getInitials: () => {
                const { user } = get();
                if (!user) return '';
                if (user.firstName && user.lastName) {
                    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
                }
                return user.email[0].toUpperCase();
            },
        }),
        {
            name: 'grade-a-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Only persist tokens, not the full user object
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                tokenExpiresAt: state.tokenExpiresAt,
            }),
        }
    )
);

// =============================================================================
// SELECTORS
// =============================================================================

/**
 * Get current user
 */
export const selectUser = (state: AuthStore) => state.user;

/**
 * Get authentication status
 */
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;

/**
 * Get loading status
 */
export const selectIsLoading = (state: AuthStore) => state.isLoading;

/**
 * Get current error
 */
export const selectError = (state: AuthStore) => state.error;

/**
 * Get 2FA requirement status
 */
export const selectRequires2FA = (state: AuthStore) => state.requires2FA;

/**
 * Get user roles
 */
export const selectUserRoles = (state: AuthStore) => state.user?.roles ?? [];

/**
 * Get user permissions
 */
export const selectUserPermissions = (state: AuthStore) =>
    state.user ? getPermissionsForRoles(state.user.roles) : [];

// =============================================================================
// HOOKS SHORTCUTS
// =============================================================================

/**
 * Hook to get only auth-related data
 */
export const useAuth = () => {
    const user = useAuthStore(selectUser);
    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const isLoading = useAuthStore(selectIsLoading);
    const error = useAuthStore(selectError);

    return { user, isAuthenticated, isLoading, error };
};

/**
 * Hook to get permission checking functions
 */
export const usePermissions = () => {
    const hasRole = useAuthStore((state) => state.hasRole);
    const hasAnyRole = useAuthStore((state) => state.hasAnyRole);
    const hasPerm = useAuthStore((state) => state.hasPermission);
    const hasAnyPerm = useAuthStore((state) => state.hasAnyPermission);
    const isAdminUser = useAuthStore((state) => state.isAdmin);
    const isSuperAdminUser = useAuthStore((state) => state.isSuperAdmin);
    const isKYCVerified = useAuthStore((state) => state.isKYCVerified);

    return {
        hasRole,
        hasAnyRole,
        hasPermission: hasPerm,
        hasAnyPermission: hasAnyPerm,
        isAdmin: isAdminUser,
        isSuperAdmin: isSuperAdminUser,
        isKYCVerified,
    };
};

/**
 * Hook to get auth actions
 */
export const useAuthActions = () => {
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);
    const updateUser = useAuthStore((state) => state.updateUser);
    const setError = useAuthStore((state) => state.setError);
    const setLoading = useAuthStore((state) => state.setLoading);

    return { login, logout, updateUser, setError, setLoading };
};
