/**
 * GRADE A REALTY - Protected Route Component
 * Route guard for authenticated/authorized access
 * Phase 1 Implementation
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { useAuth, usePermissions } from '../../store';
import type { Permission } from '../../types/permissions';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
    children: React.ReactNode;

    // Access requirements (any one of these can be used)
    requireAuth?: boolean;
    requireRoles?: UserRole[];
    requireAnyRole?: UserRole[];
    requirePermission?: Permission;
    requireAnyPermission?: Permission[];
    requireAllPermissions?: Permission[];
    requireKYC?: boolean;
    requireAdmin?: boolean;

    // Redirect paths
    redirectTo?: string;
    unauthorizedRedirect?: string;

    // Custom loading/error components
    loadingComponent?: React.ReactNode;
    unauthorizedComponent?: React.ReactNode;
}

export default function ProtectedRoute({
    children,
    requireAuth = true,
    requireRoles,
    requireAnyRole,
    requirePermission,
    requireAnyPermission,
    requireAllPermissions,
    requireKYC = false,
    requireAdmin = false,
    redirectTo = '/login',
    unauthorizedRedirect,
    loadingComponent,
    unauthorizedComponent,
}: ProtectedRouteProps) {
    const location = useLocation();
    const { user, isAuthenticated, isLoading } = useAuth();
    const {
        hasRole,
        hasAnyRole,
        hasPermission,
        hasAnyPermission,
        isAdmin,
        isKYCVerified,
    } = usePermissions();

    // Loading state
    if (isLoading) {
        return loadingComponent || (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto" />
                    <p className="text-gray-400 mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    // Check authentication
    if (requireAuth && !isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check roles
    if (requireRoles && requireRoles.length > 0) {
        const hasAllRoles = requireRoles.every((role) => hasRole(role));
        if (!hasAllRoles) {
            return renderUnauthorized('Required roles not found');
        }
    }

    if (requireAnyRole && requireAnyRole.length > 0) {
        if (!hasAnyRole(requireAnyRole)) {
            return renderUnauthorized('Required role not found');
        }
    }

    // Check permissions
    if (requirePermission && !hasPermission(requirePermission)) {
        return renderUnauthorized('Permission denied');
    }

    if (requireAnyPermission && requireAnyPermission.length > 0) {
        if (!hasAnyPermission(requireAnyPermission)) {
            return renderUnauthorized('Permission denied');
        }
    }

    if (requireAllPermissions && requireAllPermissions.length > 0) {
        const hasAll = requireAllPermissions.every((p) => hasPermission(p));
        if (!hasAll) {
            return renderUnauthorized('Insufficient permissions');
        }
    }

    // Check KYC
    if (requireKYC && !isKYCVerified()) {
        return renderKYCRequired();
    }

    // Check admin
    if (requireAdmin && !isAdmin()) {
        return renderUnauthorized('Admin access required');
    }

    // All checks passed
    return <>{children}</>;

    // Helper function for unauthorized rendering
    function renderUnauthorized(message: string) {
        if (unauthorizedRedirect) {
            return <Navigate to={unauthorizedRedirect} replace />;
        }

        if (unauthorizedComponent) {
            return <>{unauthorizedComponent}</>;
        }

        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-10 h-10 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Access Denied</h1>
                    <p className="text-gray-400 mb-6">{message}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.history.back()}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all"
                        >
                            Go Back
                        </button>
                        <a
                            href="/"
                            className="block w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl text-center transition-all"
                        >
                            Go to Homepage
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    function renderKYCRequired() {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-10 h-10 text-amber-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Verification Required</h1>
                    <p className="text-gray-400 mb-6">
                        To access this feature, you need to complete identity verification (KYC).
                    </p>
                    <div className="space-y-3">
                        <a
                            href="/settings/verification"
                            className="block w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl text-center transition-all"
                        >
                            Complete Verification
                        </a>
                        <button
                            onClick={() => window.history.back()}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * HOC for protecting components
 */
export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    options?: Omit<ProtectedRouteProps, 'children'>
): React.FC<P> {
    return function AuthenticatedComponent(props: P) {
        return (
            <ProtectedRoute {...options}>
                <Component {...props} />
            </ProtectedRoute>
        );
    };
}

/**
 * Component that renders children only if user has permission
 */
export function RequirePermission({
    permission,
    children,
    fallback = null,
}: {
    permission: Permission;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    const { hasPermission } = usePermissions();

    if (!hasPermission(permission)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

/**
 * Component that renders children only if user has role
 */
export function RequireRole({
    role,
    children,
    fallback = null,
}: {
    role: UserRole;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    const { hasRole } = usePermissions();

    if (!hasRole(role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

/**
 * Component that renders children only if user is admin
 */
export function RequireAdmin({
    children,
    fallback = null,
}: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    const { isAdmin } = usePermissions();

    if (!isAdmin()) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

/**
 * Component that renders children only if user is authenticated
 */
export function RequireAuth({
    children,
    fallback = null,
}: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
