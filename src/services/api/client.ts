/**
 * GRADE A REALTY - API Client
 * Entry point for all API interactions.
 */

import { ApiClientInterface } from '../../types/api';
import { mockApiAdapter } from './mockAdapter';

// Configuration to switch between Mock and Real API
const USE_MOCK_API = true; // Hardcoded for Phase 2.2 as requested

/**
 * The main API client instance.
 * All application code should import 'api' from here, NOT the specific adapters.
 */
export const api: ApiClientInterface = USE_MOCK_API
    ? mockApiAdapter
    : mockApiAdapter; // Fallback to mock for now until Real adapter is implemented

export default api;
