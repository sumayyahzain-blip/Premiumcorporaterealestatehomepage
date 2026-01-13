/**
 * GRADE A REALTY - API Client
 * Entry point for all API interactions.
 */

import { ApiClientInterface } from '../../types/api';
import { mockApiAdapter } from './mockAdapter';
import { realApiAdapter } from './realAdapter';

// Configuration to switch between Mock and Real API
// Phase 2: Switching to Real API (make sure backend is running)
const USE_MOCK_API = false;

/**
 * The main API client instance.
 * All application code should import 'api' from here, NOT the specific adapters.
 */
export const api: ApiClientInterface = USE_MOCK_API
    ? mockApiAdapter
    : realApiAdapter;

export default api;
