/**
 * GRADE A REALTY - Use Properties Hook
 * React hook for fetching and managing property data
 * Phase 2 Implementation (Connected to API)
 */

import { useState, useEffect, useCallback } from 'react';
import { usePropertyStore, usePropertyFilters } from '../store';
import { api } from '../services/api';
import type { Property } from '../types';
import type { GetPropertiesRequest } from '../types/api';

interface UsePropertiesOptions {
    autoFetch?: boolean;
    ownerId?: string;
}

interface UsePropertiesReturn {
    // Data
    properties: Property[];
    selectedProperty: Property | null;
    total: number;
    page: number;
    totalPages: number;

    // Loading states
    isLoading: boolean;
    isLoadingMore: boolean;

    // Error
    error: string | null;

    // Actions
    fetchProperties: (params?: Partial<GetPropertiesRequest>) => Promise<void>;
    fetchPropertyById: (id: string) => Promise<Property | null>;
    fetchFeatured: (limit?: number) => Promise<Property[]>;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    clearError: () => void;
}

export function useProperties(options: UsePropertiesOptions = {}): UsePropertiesReturn {
    const { autoFetch = true, ownerId } = options;

    const { filters } = usePropertyFilters();

    // Store access
    const properties = usePropertyStore(state => state.properties);
    const totalCount = usePropertyStore(state => state.totalCount);
    const currentPage = usePropertyStore(state => state.currentPage);
    const totalPages = usePropertyStore(state => state.totalPages);
    const pageSize = usePropertyStore(state => state.pageSize);
    const selectedProperty = usePropertyStore(state => state.selectedProperty);
    const isLoading = usePropertyStore(state => state.isLoading);
    const error = usePropertyStore(state => state.error);

    const setProperties = usePropertyStore(state => state.setProperties);
    const appendProperties = usePropertyStore(state => state.appendProperties);
    const setSelectedProperty = usePropertyStore(state => state.setSelectedProperty);
    const setLoading = usePropertyStore(state => state.setLoading);
    const setError = usePropertyStore(state => state.setError);
    const setPage = usePropertyStore(state => state.setPage);

    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Build search params from store filters
    const buildSearchParams = useCallback(
        (overrides?: Partial<GetPropertiesRequest>): GetPropertiesRequest => {
            // Base params
            const params: GetPropertiesRequest = {
                page: currentPage,
                pageSize: pageSize,
                ownerId,
                ...overrides
            };

            // Map store filters to request params
            if (filters.query) params.query = filters.query;
            if (filters.listingType) params.listingType = filters.listingType;
            if (filters.propertyType) params.propertyType = filters.propertyType;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            if (filters.minBedrooms) params.minBedrooms = filters.minBedrooms;
            if (filters.minBathrooms) params.minBathrooms = filters.minBathrooms;
            if (filters.minSquareFeet) params.minSquareFeet = filters.minSquareFeet;
            if (filters.maxSquareFeet) params.maxSquareFeet = filters.maxSquareFeet;
            if (filters.city) params.city = filters.city;
            if (filters.state) params.state = filters.state;
            if (filters.sortBy) params.sortBy = filters.sortBy;

            return params;
        },
        [filters, currentPage, pageSize, ownerId]
    );

    // Fetch properties
    const fetchProperties = useCallback(
        async (params?: Partial<GetPropertiesRequest>) => {
            setLoading(true);
            setError(null);

            try {
                const searchParams = buildSearchParams({ ...params, page: 1 });
                const response = await api.properties.list(searchParams);

                if (response.success && response.data) {
                    setProperties(response.data);
                } else {
                    throw new Error(response.error?.message || 'Failed to fetch properties');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch properties');
            } finally {
                setLoading(false);
            }
        },
        [buildSearchParams, setProperties, setLoading, setError]
    );

    // Load more (pagination)
    const loadMore = useCallback(async () => {
        if (isLoadingMore || currentPage >= totalPages) return;

        setIsLoadingMore(true);

        try {
            const searchParams = buildSearchParams({ page: currentPage + 1 });
            const response = await api.properties.list(searchParams);

            if (response.success && response.data) {
                appendProperties(response.data.data);
                setPage(response.data.pagination.page);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load more properties');
        } finally {
            setIsLoadingMore(false);
        }
    }, [
        isLoadingMore,
        currentPage,
        totalPages,
        buildSearchParams,
        appendProperties,
        setPage,
        setError,
    ]);

    // Refresh
    const refresh = useCallback(() => fetchProperties(), [fetchProperties]);

    // Fetch single property
    const fetchPropertyById = useCallback(
        async (id: string): Promise<Property | null> => {
            setLoading(true);

            try {
                const response = await api.properties.get(id);
                if (response.success && response.data) {
                    setSelectedProperty(response.data);
                    return response.data;
                }
                throw new Error(response.error?.message || 'Property not found');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch property');
                return null;
            } finally {
                setLoading(false);
            }
        },
        [setSelectedProperty, setLoading, setError]
    );

    // Fetch featured properties
    const fetchFeatured = useCallback(
        async (limit?: number): Promise<Property[]> => {
            try {
                const response = await api.properties.list({ pageSize: limit || 4, sortBy: 'date_desc' });
                if (response.success && response.data) {
                    return response.data.data;
                }
                return [];
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch featured properties');
                return [];
            }
        },
        [setError]
    );

    // Clear error
    const clearError = useCallback(() => setError(null), [setError]);

    // Auto-fetch on mount and filter changes
    useEffect(() => {
        if (autoFetch) {
            fetchProperties();
        }
    }, [autoFetch, filters]);

    return {
        properties,
        selectedProperty,
        total: totalCount,
        page: currentPage,
        totalPages,
        isLoading,
        isLoadingMore,
        error,
        fetchProperties,
        fetchPropertyById,
        fetchFeatured,
        loadMore,
        refresh,
        clearError,
    };
}

/**
 * Hook for dashboard stats
 */
export function useDashboardStats(ownerId?: string) {
    const [stats, setStats] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.dashboard.getStats();
            if (response.success && response.data) {
                setStats(response.data);
            } else {
                throw new Error(response.error?.message || 'Failed to fetch stats');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        } finally {
            setIsLoading(false);
        }
    }, [ownerId]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, isLoading, error, refresh: fetchStats };
}

export default useProperties;
