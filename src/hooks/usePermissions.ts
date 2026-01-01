/**
 * GRADE A REALTY - Permissions Hook
 * React hook for permission-based access control
 * Phase 1 Implementation
 */

import { useMemo, useCallback } from 'react';
import { useAuthStore } from '../store';
import {
    Permission,
    PERMISSIONS,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    getPermissionsForRoles,
    isAdmin,
    isSuperAdmin,
    getEffectiveRoles,
    getListingApprovers,
    getRefundApprovers,
    getMaintenanceCostApprovers,
    SLA_HOURS,
    getMaintenanceSLA,
} from '../types/permissions';
import type { UserRole, AdminRole } from '../types';

// =============================================================================
// HOOK
// =============================================================================

export function usePermissionsHook() {
    const user = useAuthStore((state) => state.user);
    const userRoles = useMemo(() => user?.roles ?? [], [user]);

    // ---------------------------------------------------------------------------
    // EFFECTIVE ROLES
    // ---------------------------------------------------------------------------

    /**
     * Get all effective roles including inherited roles
     */
    const effectiveRoles = useMemo(
        () => getEffectiveRoles(userRoles),
        [userRoles]
    );

    // ---------------------------------------------------------------------------
    // USER PERMISSIONS
    // ---------------------------------------------------------------------------

    /**
     * Get all permissions for current user
     */
    const permissions = useMemo(
        () => getPermissionsForRoles(userRoles),
        [userRoles]
    );

    // ---------------------------------------------------------------------------
    // PERMISSION CHECKS
    // ---------------------------------------------------------------------------

    /**
     * Check if user has a specific permission
     */
    const can = useCallback(
        (permission: Permission): boolean => {
            return hasPermission(userRoles, permission);
        },
        [userRoles]
    );

    /**
     * Check if user has all specified permissions
     */
    const canAll = useCallback(
        (permissionList: Permission[]): boolean => {
            return hasAllPermissions(userRoles, permissionList);
        },
        [userRoles]
    );

    /**
     * Check if user has any of the specified permissions
     */
    const canAny = useCallback(
        (permissionList: Permission[]): boolean => {
            return hasAnyPermission(userRoles, permissionList);
        },
        [userRoles]
    );

    /**
     * Check if user cannot perform an action
     */
    const cannot = useCallback(
        (permission: Permission): boolean => {
            return !hasPermission(userRoles, permission);
        },
        [userRoles]
    );

    // ---------------------------------------------------------------------------
    // ROLE CHECKS
    // ---------------------------------------------------------------------------

    /**
     * Check if user has a specific role
     */
    const hasRole = useCallback(
        (role: UserRole): boolean => {
            return userRoles.includes(role);
        },
        [userRoles]
    );

    /**
     * Check if user has any of the specified roles
     */
    const hasAnyRole = useCallback(
        (roles: UserRole[]): boolean => {
            return roles.some((role) => userRoles.includes(role));
        },
        [userRoles]
    );

    /**
     * Check if user has all specified roles
     */
    const hasAllRoles = useCallback(
        (roles: UserRole[]): boolean => {
            return roles.every((role) => userRoles.includes(role));
        },
        [userRoles]
    );

    /**
     * Check if user is an admin (any admin role)
     */
    const isUserAdmin = useMemo(
        () => isAdmin(userRoles),
        [userRoles]
    );

    /**
     * Check if user is super admin
     */
    const isUserSuperAdmin = useMemo(
        () => isSuperAdmin(userRoles),
        [userRoles]
    );

    /**
     * Check if user is a customer (buyer, renter, owner, investor)
     */
    const isCustomer = useMemo(
        () => hasAnyRole(['buyer', 'renter', 'owner', 'investor']),
        [hasAnyRole]
    );

    /**
     * Check if user is an owner or investor
     */
    const isPropertyOwner = useMemo(
        () => hasAnyRole(['owner', 'investor']),
        [hasAnyRole]
    );

    // ---------------------------------------------------------------------------
    // KYC CHECKS
    // ---------------------------------------------------------------------------

    /**
     * Check if user's KYC is verified
     */
    const isKYCVerified = useMemo(
        () => user?.kycStatus === 'verified',
        [user]
    );

    /**
     * Check if user's KYC is pending
     */
    const isKYCPending = useMemo(
        () => user?.kycStatus === 'pending' || user?.kycStatus === 'submitted',
        [user]
    );

    /**
     * Check if user can perform KYC-protected actions
     */
    const canPerformKYCProtectedAction = useCallback(
        (action: 'submit_offer' | 'submit_application' | 'list_property'): boolean => {
            if (!isKYCVerified) return false;

            switch (action) {
                case 'submit_offer':
                    return can('offer:create');
                case 'submit_application':
                    return can('application:create');
                case 'list_property':
                    return can('property:create');
                default:
                    return false;
            }
        },
        [isKYCVerified, can]
    );

    // ---------------------------------------------------------------------------
    // APPROVAL CHECKS
    // ---------------------------------------------------------------------------

    /**
     * Check if user can approve a listing of given value
     */
    const canApproveListing = useCallback(
        (listingValue: number): boolean => {
            if (!isUserAdmin) return false;

            const requiredApprovers = getListingApprovers(listingValue);
            return requiredApprovers.some((role) => userRoles.includes(role));
        },
        [isUserAdmin, userRoles]
    );

    /**
     * Check if user can approve a refund of given amount
     */
    const canApproveRefund = useCallback(
        (refundAmount: number): boolean => {
            if (!isUserAdmin) return false;

            const requiredApprovers = getRefundApprovers(refundAmount);
            return requiredApprovers.some((role) => userRoles.includes(role));
        },
        [isUserAdmin, userRoles]
    );

    /**
     * Check if user can approve maintenance cost
     */
    const canApproveMaintenanceCost = useCallback(
        (cost: number): boolean => {
            if (!isUserAdmin) return false;

            const requiredApprovers = getMaintenanceCostApprovers(cost);
            if (requiredApprovers.length === 0) return true; // Auto-approved

            return requiredApprovers.some((role) => userRoles.includes(role));
        },
        [isUserAdmin, userRoles]
    );

    /**
     * Get list of approvers required for an action
     */
    const getRequiredApprovers = useCallback(
        (
            type: 'listing' | 'refund' | 'maintenance',
            value: number
        ): AdminRole[] => {
            switch (type) {
                case 'listing':
                    return getListingApprovers(value);
                case 'refund':
                    return getRefundApprovers(value);
                case 'maintenance':
                    return getMaintenanceCostApprovers(value);
                default:
                    return [];
            }
        },
        []
    );

    // ---------------------------------------------------------------------------
    // RETURN
    // ---------------------------------------------------------------------------

    return {
        // User info
        user,
        roles: userRoles,
        effectiveRoles,
        permissions,

        // Permission checks
        can,
        canAll,
        canAny,
        cannot,

        // Role checks
        hasRole,
        hasAnyRole,
        hasAllRoles,
        isAdmin: isUserAdmin,
        isSuperAdmin: isUserSuperAdmin,
        isCustomer,
        isPropertyOwner,

        // KYC checks
        isKYCVerified,
        isKYCPending,
        canPerformKYCProtectedAction,

        // Approval checks
        canApproveListing,
        canApproveRefund,
        canApproveMaintenanceCost,
        getRequiredApprovers,

        // Constants
        SLA_HOURS,
        getMaintenanceSLA,
    };
}

// =============================================================================
// COMPONENT HELPERS
// =============================================================================

/**
 * Require permission - returns null if user doesn't have permission
 */
export function useRequirePermission(permission: Permission) {
    const { can } = usePermissionsHook();
    return can(permission);
}

/**
 * Require role - returns null if user doesn't have role
 */
export function useRequireRole(role: UserRole) {
    const { hasRole } = usePermissionsHook();
    return hasRole(role);
}

/**
 * Require admin - returns false if user is not admin
 */
export function useRequireAdmin() {
    const { isAdmin } = usePermissionsHook();
    return isAdmin;
}

/**
 * Require KYC - returns false if user's KYC is not verified
 */
export function useRequireKYC() {
    const { isKYCVerified } = usePermissionsHook();
    return isKYCVerified;
}
