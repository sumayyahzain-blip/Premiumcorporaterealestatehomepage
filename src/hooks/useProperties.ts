/**
 * GRADE A REALTY - Use Properties Hook
 * React hook for fetching and managing property data
 * Phase 1 Implementation
 */

import { useState, useEffect, useCallback } from 'react';
import { usePropertyStore, usePropertyFilters } from '../store';
import { mockDataService, type PropertySearchParams } from '../services/mockDataService';
import type { Property } from '../types';

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
    fetchProperties: (params?: Partial<PropertySearchParams>) => Promise<void>;
    fetchPropertyById: (id: string) => Promise<Property | null>;
    fetchFeatured: (limit?: number) => Promise<Property[]>;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    clearError: () => void;
}

export function useProperties(options: UsePropertiesOptions = {}): UsePropertiesReturn {
    const { autoFetch = true, ownerId } = options;

    const { filters } = usePropertyFilters();
    const {
        properties,
        setProperties,
        addProperties,
        selectedProperty,
        setSelectedProperty,
        pagination,
        setPagination,
        isLoading,
        setLoading,
        error,
        setError,
    } = usePropertyStore();

    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Build search params from store filters
    const buildSearchParams = useCallback(
        (overrides?: Partial<PropertySearchParams>): PropertySearchParams => ({
            query: filters.query,
            listingType: filters.listingType,
            propertyTypes: filters.propertyTypes,
            priceMin: filters.priceMin,
            priceMax: filters.priceMax,
            bedroomsMin: filters.bedroomsMin,
            bathroomsMin: filters.bathroomsMin,
            sqftMin: filters.sqftMin,
            sqftMax: filters.sqftMax,
            city: filters.city,
            state: filters.state,
            sortBy: filters.sortBy,
            ownerId,
            page: pagination.page,
            limit: pagination.limit,
            ...overrides,
        }),
        [filters, pagination, ownerId]
    );

    // Fetch properties
    const fetchProperties = useCallback(
        async (params?: Partial<PropertySearchParams>) => {
            setLoading(true);
            setError(null);

            try {
                const searchParams = buildSearchParams({ ...params, page: 1 });
                const result = await mockDataService.searchProperties(searchParams);

                setProperties(result.properties);
                setPagination({
                    page: result.page,
                    total: result.total,
                    totalPages: result.totalPages,
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch properties');
            } finally {
                setLoading(false);
            }
        },
        [buildSearchParams, setProperties, setPagination, setLoading, setError]
    );

    // Load more (pagination)
    const loadMore = useCallback(async () => {
        if (isLoadingMore || pagination.page >= pagination.totalPages) return;

        setIsLoadingMore(true);

        try {
            const searchParams = buildSearchParams({ page: pagination.page + 1 });
            const result = await mockDataService.searchProperties(searchParams);

            addProperties(result.properties);
            setPagination({
                page: result.page,
                total: result.total,
                totalPages: result.totalPages,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load more properties');
        } finally {
            setIsLoadingMore(false);
        }
    }, [
        isLoadingMore,
        pagination,
        buildSearchParams,
        addProperties,
        setPagination,
        setError,
    ]);

    // Refresh
    const refresh = useCallback(() => fetchProperties(), [fetchProperties]);

    // Fetch single property
    const fetchPropertyById = useCallback(
        async (id: string): Promise<Property | null> => {
            setLoading(true);

            try {
                const property = await mockDataService.getPropertyById(id);
                if (property) {
                    setSelectedProperty(property);
                }
                return property;
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
                return await mockDataService.getFeaturedProperties(limit);
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
        total: pagination.total,
        page: pagination.page,
        totalPages: pagination.totalPages,
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
    const [stats, setStats] = useState<{
        totalProperties: number;
        activeListings: number;
        totalViews: number;
        monthlyIncome: number;
        occupancyRate: number;
        pendingApprovals: number;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await mockDataService.getDashboardStats(ownerId);
            setStats(data);
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
