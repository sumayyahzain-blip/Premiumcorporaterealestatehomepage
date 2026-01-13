/**
 * GRADE A REALTY - Role-Based Access Control (RBAC) Configuration
 * Defines Roles, Permissions, and Access Policies.
 */

import { User } from '../types';

// =============================================================================
// ROLES
// =============================================================================

export const ROLES = {
    // Customer Roles
    BUYER: 'buyer',
    RENTER: 'renter',
    OWNER: 'owner',
    INVESTOR: 'investor',

    // Admin Roles
    SUPER_ADMIN: 'super_admin',
    OPS_ADMIN: 'operations_admin',
    FINANCE_ADMIN: 'finance_admin',
    COMPLIANCE_ADMIN: 'compliance_admin',
    MAINTENANCE_ADMIN: 'maintenance_admin',
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];

// =============================================================================
// PERMISSIONS
// =============================================================================

export const PERMISSIONS = {
    // Public / Common
    VIEW_PUBLIC_PROPERTIES: 'view:public_properties',

    // Customer Scope
    MANAGE_OWN_PROFILE: 'manage:own_profile',
    SAVE_PROPERTY: 'property:save',
    CREATE_APPLICATION: 'application:create',
    CREATE_OFFER: 'offer:create',

    // Owner Scope
    CREATE_PROPERTY: 'property:create',
    EDIT_OWN_PROPERTY: 'property:edit_own',
    VIEW_OWN_ANALYTICS: 'analytics:view_own',
    MANAGE_OWN_APPLICATIONS: 'application:manage_own',

    // Admin Scope - Operations
    VIEW_ALL_USERS: 'users:view_all',
    MANAGE_USERS: 'users:manage',
    APPROVE_PROPERTY: 'property:approve',
    EDIT_ANY_PROPERTY: 'property:edit_any',
    VIEW_ALL_APPLICATIONS: 'application:view_all',

    // Admin Scope - Finance
    VIEW_FINANCIALS: 'financials:view',
    PROCESS_REFUNDS: 'financials:refund',
    MANAGE_FEES: 'financials:fees',

    // Admin Scope - System
    VIEW_AUDIT_LOGS: 'system:audit_logs',
    MANAGE_SYSTEM_SETTINGS: 'system:settings',
    DELETE_DATA: 'system:delete_data',
} as const;

export type PermissionType = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// =============================================================================
// ROLE -> PERMISSION MAPPING
// =============================================================================

/**
 * Defines which permissions are granted to each role.
 * This is the source of truth for Role-Based Access.
 */
export const ROLE_PERMISSIONS: Record<RoleType, PermissionType[]> = {
    [ROLES.BUYER]: [
        PERMISSIONS.VIEW_PUBLIC_PROPERTIES,
        PERMISSIONS.MANAGE_OWN_PROFILE,
        PERMISSIONS.SAVE_PROPERTY,
        PERMISSIONS.CREATE_APPLICATION,
        PERMISSIONS.CREATE_OFFER,
    ],
    [ROLES.RENTER]: [
        PERMISSIONS.VIEW_PUBLIC_PROPERTIES,
        PERMISSIONS.MANAGE_OWN_PROFILE,
        PERMISSIONS.SAVE_PROPERTY,
        PERMISSIONS.CREATE_APPLICATION,
    ],
    [ROLES.OWNER]: [
        PERMISSIONS.VIEW_PUBLIC_PROPERTIES,
        PERMISSIONS.MANAGE_OWN_PROFILE,
        PERMISSIONS.CREATE_PROPERTY,
        PERMISSIONS.EDIT_OWN_PROPERTY,
        PERMISSIONS.VIEW_OWN_ANALYTICS,
        PERMISSIONS.MANAGE_OWN_APPLICATIONS,
    ],
    [ROLES.INVESTOR]: [
        PERMISSIONS.VIEW_PUBLIC_PROPERTIES,
        PERMISSIONS.MANAGE_OWN_PROFILE,
        PERMISSIONS.SAVE_PROPERTY,
        PERMISSIONS.CREATE_OFFER, // Investors buy
        PERMISSIONS.CREATE_PROPERTY, // Investors can also sell/flip
        PERMISSIONS.EDIT_OWN_PROPERTY,
        PERMISSIONS.VIEW_OWN_ANALYTICS,
    ],

    [ROLES.OPS_ADMIN]: [
        PERMISSIONS.VIEW_PUBLIC_PROPERTIES,
        PERMISSIONS.VIEW_ALL_USERS,
        PERMISSIONS.MANAGE_USERS,
        PERMISSIONS.APPROVE_PROPERTY,
        PERMISSIONS.EDIT_ANY_PROPERTY,
        PERMISSIONS.VIEW_ALL_APPLICATIONS,
        PERMISSIONS.VIEW_AUDIT_LOGS,
    ],
    [ROLES.FINANCE_ADMIN]: [
        PERMISSIONS.VIEW_FINANCIALS,
        PERMISSIONS.PROCESS_REFUNDS,
        PERMISSIONS.MANAGE_FEES,
        PERMISSIONS.VIEW_AUDIT_LOGS,
    ],
    [ROLES.COMPLIANCE_ADMIN]: [
        PERMISSIONS.VIEW_ALL_USERS,
        PERMISSIONS.VIEW_AUDIT_LOGS,
        // Can view but usually not edit properties/users directly without audit
    ],
    [ROLES.MAINTENANCE_ADMIN]: [
        // To be defined if maintenance module expands
    ],
    [ROLES.SUPER_ADMIN]: [
        // Super admin has ALL permissions
        ...Object.values(PERMISSIONS),
    ],
};

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Checks if a user has a specific permission.
 * Handles multiple roles (union of permissions).
 */
export function hasPermission(user: User | null, permission: PermissionType): boolean {
    if (!user || !user.roles || user.roles.length === 0) {
        return false; // Guest has no permissions by default (except public view if we allowed it, but strict here)
    }

    // Iterate over user's roles and check if ANY of them grants the permission
    // In our Type definition, roles is UserRoleAssignment[], but sometimes simplified to string[].
    // We need to handle both if legacy code exists, but TypeScript expects object.
    // Based on current types/index.ts, roles is UserRoleAssignment[].

    // NOTE: If the User object structure changes (string[] vs object[]), update this.
    // Assuming strict `UserRoleAssignment` structure:
    const userRoleNames = user.roles.map(r => r.role);

    return userRoleNames.some(roleName => {
        // Cast string to RoleType to lookup
        const permissionsForRole = ROLE_PERMISSIONS[roleName as RoleType];
        return permissionsForRole?.includes(permission);
    });
}

/**
 * Checks if a user has ANY of the required roles.
 * (Simpler check used for Routing usually)
 */
export function hasAnyRole(user: User | null, allowedRoles: string[]): boolean {
    if (!user || !user.roles) return false;
    const userRoleNames = user.roles.map(r => r.role);
    return userRoleNames.some(role => allowedRoles.includes(role));
}
