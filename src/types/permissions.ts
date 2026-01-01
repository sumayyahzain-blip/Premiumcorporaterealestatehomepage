/**
 * GRADE A REALTY - Permission System
 * Role-Based Access Control (RBAC) Definitions
 * Phase 1 Implementation
 */

import type { UserRole, AdminRole } from './index';

// =============================================================================
// PERMISSION DEFINITIONS
// =============================================================================

/**
 * All possible permissions in the system
 */
export const PERMISSIONS = {
    // -------------------------------------------------------------------------
    // Property Permissions
    // -------------------------------------------------------------------------
    'property:create': ['owner', 'investor', 'operations_admin', 'super_admin'],
    'property:read': ['*'], // All authenticated users
    'property:read_own': ['owner', 'investor'],
    'property:update': ['owner', 'operations_admin', 'super_admin'],
    'property:update_own': ['owner', 'investor'],
    'property:delete': ['super_admin'],
    'property:approve': ['operations_admin', 'super_admin'],
    'property:reject': ['operations_admin', 'super_admin'],

    // -------------------------------------------------------------------------
    // Offer Permissions
    // -------------------------------------------------------------------------
    'offer:create': ['buyer'],
    'offer:read_own': ['buyer'],
    'offer:read_received': ['owner', 'investor'],
    'offer:read_all': ['operations_admin', 'super_admin'],
    'offer:respond': ['owner', 'investor'],
    'offer:withdraw': ['buyer'],

    // -------------------------------------------------------------------------
    // Application Permissions
    // -------------------------------------------------------------------------
    'application:create': ['buyer', 'renter'],
    'application:read_own': ['buyer', 'renter'],
    'application:read_property': ['owner', 'investor'],
    'application:read_all': ['operations_admin', 'super_admin'],
    'application:update_own': ['buyer', 'renter'],
    'application:review': ['operations_admin', 'super_admin'],
    'application:approve': ['operations_admin', 'super_admin'],
    'application:reject': ['operations_admin', 'super_admin'],
    'application:withdraw': ['buyer', 'renter'],

    // -------------------------------------------------------------------------
    // Transaction Permissions
    // -------------------------------------------------------------------------
    'transaction:read_own': ['buyer', 'renter', 'owner', 'investor'],
    'transaction:read_all': ['operations_admin', 'finance_admin', 'super_admin'],
    'transaction:update': ['operations_admin', 'super_admin'],
    'transaction:sign_contract': ['buyer', 'renter', 'owner', 'investor'],
    'transaction:cancel': ['operations_admin', 'super_admin'],

    // -------------------------------------------------------------------------
    // Payment Permissions
    // -------------------------------------------------------------------------
    'payment:make': ['buyer', 'renter'],
    'payment:receive': ['owner', 'investor'],
    'payment:read_own': ['buyer', 'renter', 'owner', 'investor'],
    'payment:read_all': ['finance_admin', 'super_admin'],
    'payment:process': ['finance_admin', 'super_admin'],
    'payment:refund': ['finance_admin', 'super_admin'],
    'payment:waive_late_fee': ['finance_admin', 'super_admin'],

    // -------------------------------------------------------------------------
    // Maintenance Permissions
    // -------------------------------------------------------------------------
    'maintenance:create': ['renter', 'owner', 'investor'],
    'maintenance:read_own': ['renter'],
    'maintenance:read_property': ['owner', 'investor'],
    'maintenance:read_all': ['maintenance_admin', 'operations_admin', 'super_admin'],
    'maintenance:assign': ['maintenance_admin', 'super_admin'],
    'maintenance:approve_cost': ['maintenance_admin', 'finance_admin', 'super_admin'],
    'maintenance:complete': ['maintenance_admin', 'super_admin'],

    // -------------------------------------------------------------------------
    // Vendor Permissions
    // -------------------------------------------------------------------------
    'vendor:create': ['maintenance_admin', 'super_admin'],
    'vendor:read': ['maintenance_admin', 'operations_admin', 'super_admin'],
    'vendor:update': ['maintenance_admin', 'super_admin'],
    'vendor:delete': ['super_admin'],
    'vendor:verify': ['maintenance_admin', 'super_admin'],

    // -------------------------------------------------------------------------
    // User Management Permissions
    // -------------------------------------------------------------------------
    'user:read_own': ['*'],
    'user:update_own': ['*'],
    'user:read_all': ['operations_admin', 'compliance_admin', 'super_admin'],
    'user:update': ['operations_admin', 'super_admin'],
    'user:suspend': ['compliance_admin', 'super_admin'],
    'user:delete': ['super_admin'],
    'user:assign_role': ['super_admin'],

    // -------------------------------------------------------------------------
    // KYC/Compliance Permissions
    // -------------------------------------------------------------------------
    'kyc:submit': ['*'],
    'kyc:read_own': ['*'],
    'kyc:review': ['compliance_admin', 'super_admin'],
    'kyc:approve': ['compliance_admin', 'super_admin'],
    'kyc:reject': ['compliance_admin', 'super_admin'],

    // -------------------------------------------------------------------------
    // Document Permissions
    // -------------------------------------------------------------------------
    'document:upload': ['*'],
    'document:read_own': ['*'],
    'document:read_shared': ['*'],
    'document:read_all': ['compliance_admin', 'super_admin'],
    'document:delete_own': ['*'],
    'document:delete_any': ['super_admin'],

    // -------------------------------------------------------------------------
    // Notification Permissions
    // -------------------------------------------------------------------------
    'notification:read_own': ['*'],
    'notification:send': ['operations_admin', 'finance_admin', 'maintenance_admin', 'compliance_admin', 'super_admin'],
    'notification:send_broadcast': ['super_admin'],

    // -------------------------------------------------------------------------
    // Audit Permissions
    // -------------------------------------------------------------------------
    'audit:read': ['compliance_admin', 'super_admin'],
    'audit:export': ['super_admin'],

    // -------------------------------------------------------------------------
    // Report Permissions
    // -------------------------------------------------------------------------
    'reports:portfolio': ['owner', 'investor'],
    'reports:financial': ['finance_admin', 'super_admin'],
    'reports:operations': ['operations_admin', 'super_admin'],
    'reports:compliance': ['compliance_admin', 'super_admin'],
    'reports:maintenance': ['maintenance_admin', 'super_admin'],

    // -------------------------------------------------------------------------
    // System Permissions
    // -------------------------------------------------------------------------
    'system:configure': ['super_admin'],
    'system:backup': ['super_admin'],
    'system:maintenance_mode': ['super_admin'],

    // -------------------------------------------------------------------------
    // Admin Dashboard Permissions
    // -------------------------------------------------------------------------
    'admin:dashboard': ['operations_admin', 'finance_admin', 'compliance_admin', 'maintenance_admin', 'super_admin'],
    'admin:full_access': ['super_admin'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

// =============================================================================
// ROLE HIERARCHY
// =============================================================================

/**
 * Role hierarchy for inheritance
 * Higher level roles inherit permissions from lower levels
 */
export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
    // Customer roles don't inherit from each other
    buyer: [],
    renter: [],
    owner: [],
    investor: ['owner'], // Investor inherits all Owner permissions

    // Admin roles
    operations_admin: [],
    finance_admin: [],
    compliance_admin: [],
    maintenance_admin: [],
    super_admin: ['operations_admin', 'finance_admin', 'compliance_admin', 'maintenance_admin'],
};

// =============================================================================
// APPROVAL THRESHOLDS
// =============================================================================

/**
 * Listing value approval thresholds
 */
export const LISTING_APPROVAL_THRESHOLDS = {
    STANDARD: 500_000,      // < $500K: Operations Admin only
    SENIOR: 2_000_000,      // $500K - $2M: Operations Admin + Senior Review
    SUPER: Infinity,        // > $2M: Operations Admin + Super Admin
} as const;

/**
 * Refund approval thresholds
 */
export const REFUND_APPROVAL_THRESHOLDS = {
    FINANCE_ADMIN: 5_000,    // < $5K: Finance Admin only
    SUPER_ADMIN: Infinity,   // > $5K: Finance Admin + Super Admin
} as const;

/**
 * Maintenance cost approval thresholds
 */
export const MAINTENANCE_COST_THRESHOLDS = {
    AUTO_APPROVE: 200,       // < $200: Auto-approved
    MAINTENANCE_ADMIN: 1_000, // $200 - $1K: Maintenance Admin
    FINANCE_REQUIRED: 5_000,  // $1K - $5K: Maintenance + Finance Admin
    SUPER_REQUIRED: Infinity, // > $5K: Maintenance + Finance + Super Admin
} as const;

// =============================================================================
// PERMISSION HELPER FUNCTIONS
// =============================================================================

/**
 * Get all effective roles for a user including inherited roles
 */
export function getEffectiveRoles(userRoles: UserRole[]): UserRole[] {
    const effectiveRoles = new Set<UserRole>(userRoles);

    for (const role of userRoles) {
        const inheritedRoles = ROLE_HIERARCHY[role] || [];
        for (const inheritedRole of inheritedRoles) {
            effectiveRoles.add(inheritedRole);
            // Recursively add inherited roles
            const deepInherited = getEffectiveRoles([inheritedRole]);
            for (const deepRole of deepInherited) {
                effectiveRoles.add(deepRole);
            }
        }
    }

    return Array.from(effectiveRoles);
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
    userRoles: UserRole[],
    permission: Permission
): boolean {
    const allowedRoles = PERMISSIONS[permission];

    // '*' means all authenticated users
    if (allowedRoles.includes('*' as UserRole)) {
        return true;
    }

    // Get effective roles (including inherited)
    const effectiveRoles = getEffectiveRoles(userRoles);

    // Check if any of the user's effective roles is in the allowed list
    return effectiveRoles.some(role => allowedRoles.includes(role));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(
    userRoles: UserRole[],
    permissions: Permission[]
): boolean {
    return permissions.every(permission => hasPermission(userRoles, permission));
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(
    userRoles: UserRole[],
    permissions: Permission[]
): boolean {
    return permissions.some(permission => hasPermission(userRoles, permission));
}

/**
 * Get all permissions for a set of roles
 */
export function getPermissionsForRoles(userRoles: UserRole[]): Permission[] {
    const effectiveRoles = getEffectiveRoles(userRoles);
    const permissions: Permission[] = [];

    for (const [permission, allowedRoles] of Object.entries(PERMISSIONS)) {
        if (allowedRoles.includes('*' as UserRole) ||
            effectiveRoles.some(role => allowedRoles.includes(role))) {
            permissions.push(permission as Permission);
        }
    }

    return permissions;
}

/**
 * Check if user is an admin
 */
export function isAdmin(userRoles: UserRole[]): boolean {
    const adminRoles: AdminRole[] = [
        'super_admin',
        'operations_admin',
        'finance_admin',
        'compliance_admin',
        'maintenance_admin'
    ];

    return userRoles.some(role => adminRoles.includes(role as AdminRole));
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(userRoles: UserRole[]): boolean {
    return userRoles.includes('super_admin');
}

/**
 * Get required approvers for a listing based on value
 */
export function getListingApprovers(listingValue: number): AdminRole[] {
    if (listingValue < LISTING_APPROVAL_THRESHOLDS.STANDARD) {
        return ['operations_admin'];
    } else if (listingValue < LISTING_APPROVAL_THRESHOLDS.SENIOR) {
        return ['operations_admin']; // + senior review flag
    } else {
        return ['operations_admin', 'super_admin'];
    }
}

/**
 * Get required approvers for a refund based on amount
 */
export function getRefundApprovers(refundAmount: number): AdminRole[] {
    if (refundAmount <= REFUND_APPROVAL_THRESHOLDS.FINANCE_ADMIN) {
        return ['finance_admin'];
    } else {
        return ['finance_admin', 'super_admin'];
    }
}

/**
 * Get required approvers for maintenance cost
 */
export function getMaintenanceCostApprovers(cost: number): AdminRole[] {
    if (cost < MAINTENANCE_COST_THRESHOLDS.AUTO_APPROVE) {
        return []; // Auto-approved
    } else if (cost < MAINTENANCE_COST_THRESHOLDS.MAINTENANCE_ADMIN) {
        return ['maintenance_admin'];
    } else if (cost < MAINTENANCE_COST_THRESHOLDS.FINANCE_REQUIRED) {
        return ['maintenance_admin', 'finance_admin'];
    } else {
        return ['maintenance_admin', 'finance_admin', 'super_admin'];
    }
}

// =============================================================================
// SLA DEFINITIONS
// =============================================================================

export const SLA_HOURS = {
    // Application review
    APPLICATION_REVIEW: 48,

    // KYC verification
    KYC_VERIFICATION: 24,

    // Listing approval
    LISTING_APPROVAL: 48,

    // Maintenance by priority
    MAINTENANCE_EMERGENCY: 4,
    MAINTENANCE_HIGH: 24,
    MAINTENANCE_MEDIUM: 72,
    MAINTENANCE_LOW: 168, // 7 days

    // Payment reminders
    RENT_REMINDER_BEFORE_DUE: 72, // 3 days before

    // Lease renewal notice
    LEASE_RENEWAL_NOTICE: 2160, // 90 days
} as const;

/**
 * Get SLA deadline for maintenance based on priority
 */
export function getMaintenanceSLA(priority: 'emergency' | 'high' | 'medium' | 'low'): number {
    const slaMap = {
        emergency: SLA_HOURS.MAINTENANCE_EMERGENCY,
        high: SLA_HOURS.MAINTENANCE_HIGH,
        medium: SLA_HOURS.MAINTENANCE_MEDIUM,
        low: SLA_HOURS.MAINTENANCE_LOW,
    };
    return slaMap[priority];
}
