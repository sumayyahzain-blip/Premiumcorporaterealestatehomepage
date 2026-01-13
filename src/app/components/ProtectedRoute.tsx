
/**
 * GRADE A REALTY - Protected Route Component
 * Route guard for authenticated/authorized access
 * Phase 2 Implementation (Supabase Auth)
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSupabaseAuth } from '../../lib/AuthContext';
import type { Permission } from '../../types/permissions';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireRoles?: UserRole[];
    requireAnyRole?: UserRole[];
    requirePermission?: Permission;
    requireAnyPermission?: Permission[];
    requireAllPermissions?: Permission[];
    requireKYC?: boolean;
    requireAdmin?: boolean;
    redirectTo?: string;
    unauthorizedRedirect?: string;
    loadingComponent?: React.ReactNode;
    unauthorizedComponent?: React.ReactNode;
}

export default function ProtectedRoute({
    children,
    requireAuth = true,
    redirectTo = '/login',
    loadingComponent,
}: ProtectedRouteProps) {
    const location = useLocation();
    const { user, loading } = useSupabaseAuth();

    // Loading state
    if (loading) {
        return loadingComponent || (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
            </div>
        );
    }

    // Check authentication
    if (requireAuth && !user) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Bypass RBAC (Roles/Permissions) for MVP Phase 2 Option B
    // We assume if you are logged in, you can access the User Dashboard.
    // Admin routes might need stricter checks later.

    return <>{children}</>;
}


// --- HOCs and Helpers (Legacy Compatibility) ---

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

export function RequirePermission({ children }: { children: React.ReactNode }) {
    return <>{children}</>; // Bypass
}

export function RequireRole({ children }: { children: React.ReactNode }) {
    return <>{children}</>; // Bypass
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
    return <>{children}</>; // Bypass
}

export function RequireAuth({ children, fallback = null }: { children: React.ReactNode, fallback?: React.ReactNode }) {
    const { user } = useSupabaseAuth();
    if (!user) return <>{fallback}</>;
    return <>{children}</>;
}
