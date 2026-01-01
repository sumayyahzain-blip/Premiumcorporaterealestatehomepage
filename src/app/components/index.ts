/**
 * GRADE A REALTY - Components Index
 * Central export for all reusable components
 * Phase 1 Implementation
 */

// Auth
export { default as AuthProvider } from './AuthProvider';
export { default as ProtectedRoute, RequirePermission, RequireRole, RequireAdmin, RequireAuth, withAuth } from './ProtectedRoute';

// Error Handling
export { ErrorBoundary, ErrorFallback, withErrorBoundary, useErrorHandler, AsyncBoundary } from './ErrorBoundary';

// Loading States
export {
    Skeleton,
    PropertyCardSkeleton,
    PropertyGridSkeleton,
    DashboardStatsSkeleton,
    TableSkeleton,
    FormSkeleton,
    PageSkeleton,
    TextSkeleton,
    AvatarSkeleton,
    NotificationSkeleton,
} from './Skeleton';

// Notifications
export { ToastContainer, showSuccessToast, showErrorToast, showWarningToast, showInfoToast } from './ToastContainer';

// Property
export { default as PropertyForm } from './PropertyForm';
export { default as ImageUpload } from './ImageUpload';
export { default as SearchFilters } from './SearchFilters';
export { default as PremiumPropertyCard } from './PremiumPropertyCard';
