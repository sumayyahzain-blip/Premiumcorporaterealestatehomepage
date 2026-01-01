/**
 * GRADE A REALTY - API Index
 * Central export for API layer
 * Phase 1 Implementation
 */

// API Client
export {
    apiClient,
    get,
    post,
    put,
    patch,
    del,
    upload,
    request,
    ApiClientError,
    NetworkError,
    TimeoutError,
} from './client';

export type { RequestConfig, ApiClientConfig } from './client';

// API Routes
export { API_ROUTES, API_BASE, buildUrl, buildPaginationParams } from './routes';
