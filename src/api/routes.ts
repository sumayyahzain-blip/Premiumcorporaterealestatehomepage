/**
 * GRADE A REALTY - API Routes Configuration
 * Centralized API endpoint definitions
 * Phase 1 Implementation
 */

// =============================================================================
// BASE CONFIGURATION
// =============================================================================

const API_VERSION = 'v1';
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const API_BASE = `${BASE_URL}/${API_VERSION}`;

// =============================================================================
// ROUTE DEFINITIONS
// =============================================================================

export const API_ROUTES = {
    // ---------------------------------------------------------------------------
    // Authentication
    // ---------------------------------------------------------------------------
    AUTH: {
        REGISTER: `${API_BASE}/auth/register`,
        LOGIN: `${API_BASE}/auth/login`,
        LOGOUT: `${API_BASE}/auth/logout`,
        REFRESH: `${API_BASE}/auth/refresh`,
        ME: `${API_BASE}/auth/me`,
        FORGOT_PASSWORD: `${API_BASE}/auth/forgot-password`,
        RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
        CHANGE_PASSWORD: `${API_BASE}/auth/change-password`,
        VERIFY_EMAIL: `${API_BASE}/auth/verify-email`,
        RESEND_VERIFICATION: `${API_BASE}/auth/resend-verification`,
        ENABLE_2FA: `${API_BASE}/auth/enable-2fa`,
        VERIFY_2FA: `${API_BASE}/auth/verify-2fa`,
        DISABLE_2FA: `${API_BASE}/auth/disable-2fa`,
        SESSIONS: `${API_BASE}/auth/sessions`,
        REVOKE_SESSION: (id: string) => `${API_BASE}/auth/sessions/${id}/revoke`,
    },

    // ---------------------------------------------------------------------------
    // Users
    // ---------------------------------------------------------------------------
    USERS: {
        LIST: `${API_BASE}/users`,
        GET: (id: string) => `${API_BASE}/users/${id}`,
        UPDATE: (id: string) => `${API_BASE}/users/${id}`,
        DELETE: (id: string) => `${API_BASE}/users/${id}`,
        ROLES: (id: string) => `${API_BASE}/users/${id}/roles`,
        SUSPEND: (id: string) => `${API_BASE}/users/${id}/suspend`,
        ACTIVATE: (id: string) => `${API_BASE}/users/${id}/activate`,
    },

    // ---------------------------------------------------------------------------
    // KYC
    // ---------------------------------------------------------------------------
    KYC: {
        SUBMIT: `${API_BASE}/kyc/submit`,
        STATUS: `${API_BASE}/kyc/status`,
        DOCUMENTS: `${API_BASE}/kyc/documents`,
        ADMIN_LIST: `${API_BASE}/admin/kyc`,
        ADMIN_REVIEW: (id: string) => `${API_BASE}/admin/kyc/${id}`,
        ADMIN_APPROVE: (id: string) => `${API_BASE}/admin/kyc/${id}/approve`,
        ADMIN_REJECT: (id: string) => `${API_BASE}/admin/kyc/${id}/reject`,
    },

    // ---------------------------------------------------------------------------
    // Properties
    // ---------------------------------------------------------------------------
    PROPERTIES: {
        LIST: `${API_BASE}/properties`,
        SEARCH: `${API_BASE}/properties/search`,
        GET: (id: string) => `${API_BASE}/properties/${id}`,
        CREATE: `${API_BASE}/properties`,
        UPDATE: (id: string) => `${API_BASE}/properties/${id}`,
        DELETE: (id: string) => `${API_BASE}/properties/${id}`,
        SUBMIT_FOR_APPROVAL: (id: string) => `${API_BASE}/properties/${id}/submit`,
        APPROVE: (id: string) => `${API_BASE}/properties/${id}/approve`,
        REJECT: (id: string) => `${API_BASE}/properties/${id}/reject`,
        ANALYTICS: (id: string) => `${API_BASE}/properties/${id}/analytics`,
        IMAGES: {
            LIST: (propertyId: string) => `${API_BASE}/properties/${propertyId}/images`,
            UPLOAD: (propertyId: string) => `${API_BASE}/properties/${propertyId}/images`,
            DELETE: (propertyId: string, imageId: string) =>
                `${API_BASE}/properties/${propertyId}/images/${imageId}`,
            SET_PRIMARY: (propertyId: string, imageId: string) =>
                `${API_BASE}/properties/${propertyId}/images/${imageId}/primary`,
            REORDER: (propertyId: string) => `${API_BASE}/properties/${propertyId}/images/reorder`,
        },
    },

    // ---------------------------------------------------------------------------
    // Saved Properties
    // ---------------------------------------------------------------------------
    SAVED_PROPERTIES: {
        LIST: `${API_BASE}/saved-properties`,
        ADD: `${API_BASE}/saved-properties`,
        REMOVE: (propertyId: string) => `${API_BASE}/saved-properties/${propertyId}`,
        UPDATE_ALERT: (propertyId: string) => `${API_BASE}/saved-properties/${propertyId}/alert`,
    },

    // ---------------------------------------------------------------------------
    // Offers (Purchase)
    // ---------------------------------------------------------------------------
    OFFERS: {
        LIST: `${API_BASE}/offers`,
        GET: (id: string) => `${API_BASE}/offers/${id}`,
        CREATE: `${API_BASE}/offers`,
        UPDATE: (id: string) => `${API_BASE}/offers/${id}`,
        SUBMIT: (id: string) => `${API_BASE}/offers/${id}/submit`,
        WITHDRAW: (id: string) => `${API_BASE}/offers/${id}/withdraw`,
        ACCEPT: (id: string) => `${API_BASE}/offers/${id}/accept`,
        REJECT: (id: string) => `${API_BASE}/offers/${id}/reject`,
        COUNTER: (id: string) => `${API_BASE}/offers/${id}/counter`,
        PROPERTY: (propertyId: string) => `${API_BASE}/properties/${propertyId}/offers`,
    },

    // ---------------------------------------------------------------------------
    // Applications (Rental)
    // ---------------------------------------------------------------------------
    APPLICATIONS: {
        LIST: `${API_BASE}/applications`,
        GET: (id: string) => `${API_BASE}/applications/${id}`,
        CREATE: `${API_BASE}/applications`,
        UPDATE: (id: string) => `${API_BASE}/applications/${id}`,
        SUBMIT: (id: string) => `${API_BASE}/applications/${id}/submit`,
        WITHDRAW: (id: string) => `${API_BASE}/applications/${id}/withdraw`,
        APPROVE: (id: string) => `${API_BASE}/applications/${id}/approve`,
        REJECT: (id: string) => `${API_BASE}/applications/${id}/reject`,
        CONDITIONAL: (id: string) => `${API_BASE}/applications/${id}/conditional`,
        FULFILL_CONDITION: (id: string) => `${API_BASE}/applications/${id}/fulfill-condition`,
        PROPERTY: (propertyId: string) => `${API_BASE}/properties/${propertyId}/applications`,
    },

    // ---------------------------------------------------------------------------
    // Transactions
    // ---------------------------------------------------------------------------
    TRANSACTIONS: {
        LIST: `${API_BASE}/transactions`,
        GET: (id: string) => `${API_BASE}/transactions/${id}`,
        SIGN: (id: string) => `${API_BASE}/transactions/${id}/sign`,
        CANCEL: (id: string) => `${API_BASE}/transactions/${id}/cancel`,
        CONTRACT: (id: string) => `${API_BASE}/transactions/${id}/contract`,
        TIMELINE: (id: string) => `${API_BASE}/transactions/${id}/timeline`,
    },

    // ---------------------------------------------------------------------------
    // Payments
    // ---------------------------------------------------------------------------
    PAYMENTS: {
        LIST: `${API_BASE}/payments`,
        GET: (id: string) => `${API_BASE}/payments/${id}`,
        CREATE: `${API_BASE}/payments`,
        SCHEDULE: `${API_BASE}/payments/schedule`,
        UPCOMING: `${API_BASE}/payments/upcoming`,
        REFUND: (id: string) => `${API_BASE}/payments/${id}/refund`,
        WAIVE_LATE_FEE: (id: string) => `${API_BASE}/payments/${id}/waive-late-fee`,
        STRIPE: {
            CREATE_INTENT: `${API_BASE}/payments/stripe/create-intent`,
            CONFIRM: `${API_BASE}/payments/stripe/confirm`,
            WEBHOOK: `${API_BASE}/payments/stripe/webhook`,
        },
    },

    // ---------------------------------------------------------------------------
    // Portfolio (Owner/Investor)
    // ---------------------------------------------------------------------------
    PORTFOLIO: {
        OVERVIEW: `${API_BASE}/portfolio`,
        PROPERTIES: `${API_BASE}/portfolio/properties`,
        ANALYTICS: `${API_BASE}/portfolio/analytics`,
        INCOME: `${API_BASE}/portfolio/income`,
        EXPENSES: `${API_BASE}/portfolio/expenses`,
        CASH_FLOW: `${API_BASE}/portfolio/cash-flow`,
        MARKET_INSIGHTS: `${API_BASE}/portfolio/market-insights`,
        PROPERTY_PERFORMANCE: (id: string) => `${API_BASE}/portfolio/properties/${id}/performance`,
    },

    // ---------------------------------------------------------------------------
    // Maintenance
    // ---------------------------------------------------------------------------
    MAINTENANCE: {
        LIST: `${API_BASE}/maintenance`,
        GET: (id: string) => `${API_BASE}/maintenance/${id}`,
        CREATE: `${API_BASE}/maintenance`,
        UPDATE: (id: string) => `${API_BASE}/maintenance/${id}`,
        CANCEL: (id: string) => `${API_BASE}/maintenance/${id}/cancel`,
        ASSIGN: (id: string) => `${API_BASE}/maintenance/${id}/assign`,
        START: (id: string) => `${API_BASE}/maintenance/${id}/start`,
        COMPLETE: (id: string) => `${API_BASE}/maintenance/${id}/complete`,
        APPROVE_COST: (id: string) => `${API_BASE}/maintenance/${id}/approve-cost`,
        FEEDBACK: (id: string) => `${API_BASE}/maintenance/${id}/feedback`,
        PROPERTY: (propertyId: string) => `${API_BASE}/properties/${propertyId}/maintenance`,
    },

    // ---------------------------------------------------------------------------
    // Vendors
    // ---------------------------------------------------------------------------
    VENDORS: {
        LIST: `${API_BASE}/vendors`,
        GET: (id: string) => `${API_BASE}/vendors/${id}`,
        CREATE: `${API_BASE}/vendors`,
        UPDATE: (id: string) => `${API_BASE}/vendors/${id}`,
        DELETE: (id: string) => `${API_BASE}/vendors/${id}`,
        VERIFY: (id: string) => `${API_BASE}/vendors/${id}/verify`,
        PERFORMANCE: (id: string) => `${API_BASE}/vendors/${id}/performance`,
        JOBS: (id: string) => `${API_BASE}/vendors/${id}/jobs`,
    },

    // ---------------------------------------------------------------------------
    // Documents
    // ---------------------------------------------------------------------------
    DOCUMENTS: {
        LIST: `${API_BASE}/documents`,
        GET: (id: string) => `${API_BASE}/documents/${id}`,
        UPLOAD: `${API_BASE}/documents`,
        DELETE: (id: string) => `${API_BASE}/documents/${id}`,
        DOWNLOAD: (id: string) => `${API_BASE}/documents/${id}/download`,
        SHARE: (id: string) => `${API_BASE}/documents/${id}/share`,
        SIGN: (id: string) => `${API_BASE}/documents/${id}/sign`,
        ENTITY: (entityType: string, entityId: string) =>
            `${API_BASE}/documents/${entityType}/${entityId}`,
    },

    // ---------------------------------------------------------------------------
    // Notifications
    // ---------------------------------------------------------------------------
    NOTIFICATIONS: {
        LIST: `${API_BASE}/notifications`,
        GET: (id: string) => `${API_BASE}/notifications/${id}`,
        MARK_READ: (id: string) => `${API_BASE}/notifications/${id}/read`,
        MARK_ALL_READ: `${API_BASE}/notifications/read-all`,
        DELETE: (id: string) => `${API_BASE}/notifications/${id}`,
        SETTINGS: `${API_BASE}/notifications/settings`,
        UPDATE_SETTINGS: `${API_BASE}/notifications/settings`,
    },

    // ---------------------------------------------------------------------------
    // Admin
    // ---------------------------------------------------------------------------
    ADMIN: {
        DASHBOARD: `${API_BASE}/admin/dashboard`,
        USERS: `${API_BASE}/admin/users`,
        LISTINGS: {
            PENDING: `${API_BASE}/admin/listings/pending`,
            ALL: `${API_BASE}/admin/listings`,
        },
        APPLICATIONS: {
            PENDING: `${API_BASE}/admin/applications/pending`,
            ALL: `${API_BASE}/admin/applications`,
        },
        TRANSACTIONS: `${API_BASE}/admin/transactions`,
        MAINTENANCE: `${API_BASE}/admin/maintenance`,
        PAYMENTS: `${API_BASE}/admin/payments`,
        AUDIT_LOGS: `${API_BASE}/admin/audit-logs`,
        REPORTS: {
            FINANCIAL: `${API_BASE}/admin/reports/financial`,
            OPERATIONS: `${API_BASE}/admin/reports/operations`,
            COMPLIANCE: `${API_BASE}/admin/reports/compliance`,
            MAINTENANCE: `${API_BASE}/admin/reports/maintenance`,
        },
        SETTINGS: `${API_BASE}/admin/settings`,
    },
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Build URL with query parameters
 */
export function buildUrl(
    baseUrl: string,
    params?: Record<string, string | number | boolean | undefined | null>
): string {
    if (!params) return baseUrl;

    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
        }
    }

    const queryString = searchParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Build pagination params
 */
export function buildPaginationParams(
    page: number = 1,
    pageSize: number = 12,
    sortBy?: string
): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page,
        pageSize,
    };

    if (sortBy) {
        params.sortBy = sortBy;
    }

    return params;
}
