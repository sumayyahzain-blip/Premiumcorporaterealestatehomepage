/**
 * GRADE A REALTY - Hooks Index
 * Central export for all custom hooks
 * Phase 1 Implementation
 */

// Authentication
export { useAuthHook } from './useAuth';

// Permissions
export {
    usePermissionsHook,
    useRequirePermission,
    useRequireRole,
    useRequireAdmin,
    useRequireKYC,
} from './usePermissions';

// Properties
export { useProperties, useDashboardStats } from './useProperties';

// Re-export store hooks for convenience
export {
    useAuth,
    usePermissions,
    useAuthActions,
} from '../store';

export {
    usePropertyList,
    usePropertyFilters,
    useSelectedProperty,
} from '../store';

export {
    useNotifications,
    useToasts,
    useNotificationPanel,
} from '../store';
