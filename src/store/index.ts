/**
 * GRADE A REALTY - Store Index
 * Central export for all stores
 * Phase 1 Implementation
 */

// Auth Store
export {
    useAuthStore,
    useAuth,
    usePermissions,
    useAuthActions,
    selectUser,
    selectIsAuthenticated,
    selectIsLoading,
    selectError,
    selectRequires2FA,
    selectUserRoles,
    selectUserPermissions,
} from './authStore';

// Property Store
export {
    usePropertyStore,
    usePropertyList,
    usePropertyFilters,
    useSelectedProperty,
    selectProperties,
    selectSelectedProperty,
    selectFilters,
    selectPagination,
} from './propertyStore';

// Notification Store
export {
    useNotificationStore,
    useNotifications,
    useToasts,
    useNotificationPanel,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    selectNotifications,
    selectUnreadCount,
    selectToasts,
    selectIsPanelOpen,
} from './notificationStore';

export type { Toast, ToastType } from './notificationStore';
