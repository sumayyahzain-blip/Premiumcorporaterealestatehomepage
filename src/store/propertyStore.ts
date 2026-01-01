/**
 * GRADE A REALTY - Property Store
 * Zustand-based state management for properties
 * Phase 1 Implementation
 */

import { create } from 'zustand';
import type { Property, PropertySearchFilters, PropertyImage, PaginatedResponse } from '../types';

// =============================================================================
// STORE INTERFACE
// =============================================================================

interface PropertyState {
    // Property list state
    properties: Property[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;

    // Single property state
    selectedProperty: Property | null;

    // Search/filter state
    filters: PropertySearchFilters;

    // Loading states
    isLoading: boolean;
    isLoadingDetails: boolean;

    // Error state
    error: string | null;

    // UI state
    viewMode: 'grid' | 'list' | 'map';
}

interface PropertyStore extends PropertyState {
    // Actions - Property list
    setProperties: (response: PaginatedResponse<Property>) => void;
    appendProperties: (properties: Property[]) => void;
    clearProperties: () => void;

    // Actions - Single property
    setSelectedProperty: (property: Property | null) => void;
    updateSelectedProperty: (updates: Partial<Property>) => void;

    // Actions - Filters
    setFilters: (filters: Partial<PropertySearchFilters>) => void;
    resetFilters: () => void;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;

    // Actions - Loading/Error
    setLoading: (isLoading: boolean) => void;
    setLoadingDetails: (isLoading: boolean) => void;
    setError: (error: string | null) => void;

    // Actions - UI
    setViewMode: (mode: 'grid' | 'list' | 'map') => void;

    // Actions - Property mutations
    addProperty: (property: Property) => void;
    updateProperty: (id: string, updates: Partial<Property>) => void;
    removeProperty: (id: string) => void;

    // Actions - Images
    addPropertyImage: (propertyId: string, image: PropertyImage) => void;
    removePropertyImage: (propertyId: string, imageId: string) => void;
    setPropertyPrimaryImage: (propertyId: string, imageId: string) => void;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const defaultFilters: PropertySearchFilters = {
    page: 1,
    pageSize: 12,
    sortBy: 'date_desc',
};

const initialState: PropertyState = {
    properties: [],
    totalCount: 0,
    currentPage: 1,
    pageSize: 12,
    totalPages: 0,
    selectedProperty: null,
    filters: defaultFilters,
    isLoading: false,
    isLoadingDetails: false,
    error: null,
    viewMode: 'grid',
};

// =============================================================================
// PROPERTY STORE
// =============================================================================

export const usePropertyStore = create<PropertyStore>((set, get) => ({
    ...initialState,

    // ---------------------------------------------------------------------------
    // PROPERTY LIST ACTIONS
    // ---------------------------------------------------------------------------

    setProperties: (response) => set({
        properties: response.data,
        totalCount: response.pagination.totalItems,
        currentPage: response.pagination.page,
        pageSize: response.pagination.pageSize,
        totalPages: response.pagination.totalPages,
        isLoading: false,
        error: null,
    }),

    appendProperties: (newProperties) => set((state) => ({
        properties: [...state.properties, ...newProperties],
    })),

    clearProperties: () => set({
        properties: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 0,
    }),

    // ---------------------------------------------------------------------------
    // SINGLE PROPERTY ACTIONS
    // ---------------------------------------------------------------------------

    setSelectedProperty: (property) => set({
        selectedProperty: property,
        isLoadingDetails: false,
    }),

    updateSelectedProperty: (updates) => set((state) => ({
        selectedProperty: state.selectedProperty
            ? { ...state.selectedProperty, ...updates }
            : null,
    })),

    // ---------------------------------------------------------------------------
    // FILTER ACTIONS
    // ---------------------------------------------------------------------------

    setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
        currentPage: 1, // Reset to first page when filters change
    })),

    resetFilters: () => set({
        filters: defaultFilters,
        currentPage: 1,
    }),

    setPage: (page) => set((state) => ({
        currentPage: page,
        filters: { ...state.filters, page },
    })),

    setPageSize: (size) => set((state) => ({
        pageSize: size,
        currentPage: 1,
        filters: { ...state.filters, pageSize: size, page: 1 },
    })),

    // ---------------------------------------------------------------------------
    // LOADING/ERROR ACTIONS
    // ---------------------------------------------------------------------------

    setLoading: (isLoading) => set({ isLoading }),

    setLoadingDetails: (isLoadingDetails) => set({ isLoadingDetails }),

    setError: (error) => set({ error, isLoading: false, isLoadingDetails: false }),

    // ---------------------------------------------------------------------------
    // UI ACTIONS
    // ---------------------------------------------------------------------------

    setViewMode: (viewMode) => set({ viewMode }),

    // ---------------------------------------------------------------------------
    // PROPERTY MUTATION ACTIONS
    // ---------------------------------------------------------------------------

    addProperty: (property) => set((state) => ({
        properties: [property, ...state.properties],
        totalCount: state.totalCount + 1,
    })),

    updateProperty: (id, updates) => set((state) => ({
        properties: state.properties.map((p) =>
            p.id === id ? { ...p, ...updates } : p
        ),
        selectedProperty:
            state.selectedProperty?.id === id
                ? { ...state.selectedProperty, ...updates }
                : state.selectedProperty,
    })),

    removeProperty: (id) => set((state) => ({
        properties: state.properties.filter((p) => p.id !== id),
        totalCount: state.totalCount - 1,
        selectedProperty:
            state.selectedProperty?.id === id ? null : state.selectedProperty,
    })),

    // ---------------------------------------------------------------------------
    // IMAGE ACTIONS
    // ---------------------------------------------------------------------------

    addPropertyImage: (propertyId, image) => set((state) => {
        const updateImages = (prop: Property) => ({
            ...prop,
            images: [...(prop.images || []), image],
        });

        return {
            properties: state.properties.map((p) =>
                p.id === propertyId ? updateImages(p) : p
            ),
            selectedProperty:
                state.selectedProperty?.id === propertyId
                    ? updateImages(state.selectedProperty)
                    : state.selectedProperty,
        };
    }),

    removePropertyImage: (propertyId, imageId) => set((state) => {
        const updateImages = (prop: Property) => ({
            ...prop,
            images: (prop.images || []).filter((img) => img.id !== imageId),
        });

        return {
            properties: state.properties.map((p) =>
                p.id === propertyId ? updateImages(p) : p
            ),
            selectedProperty:
                state.selectedProperty?.id === propertyId
                    ? updateImages(state.selectedProperty)
                    : state.selectedProperty,
        };
    }),

    setPropertyPrimaryImage: (propertyId, imageId) => set((state) => {
        const updateImages = (prop: Property) => ({
            ...prop,
            images: (prop.images || []).map((img) => ({
                ...img,
                isPrimary: img.id === imageId,
            })),
        });

        return {
            properties: state.properties.map((p) =>
                p.id === propertyId ? updateImages(p) : p
            ),
            selectedProperty:
                state.selectedProperty?.id === propertyId
                    ? updateImages(state.selectedProperty)
                    : state.selectedProperty,
        };
    }),
}));

// =============================================================================
// SELECTORS
// =============================================================================

export const selectProperties = (state: PropertyStore) => state.properties;
export const selectSelectedProperty = (state: PropertyStore) => state.selectedProperty;
export const selectFilters = (state: PropertyStore) => state.filters;
export const selectIsLoading = (state: PropertyStore) => state.isLoading;
export const selectPagination = (state: PropertyStore) => ({
    page: state.currentPage,
    pageSize: state.pageSize,
    totalItems: state.totalCount,
    totalPages: state.totalPages,
});

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook for property list
 */
export const usePropertyList = () => {
    const properties = usePropertyStore(selectProperties);
    const isLoading = usePropertyStore(selectIsLoading);
    const pagination = usePropertyStore(selectPagination);

    return { properties, isLoading, pagination };
};

/**
 * Hook for property filters
 */
export const usePropertyFilters = () => {
    const filters = usePropertyStore(selectFilters);
    const setFilters = usePropertyStore((state) => state.setFilters);
    const resetFilters = usePropertyStore((state) => state.resetFilters);
    const setPage = usePropertyStore((state) => state.setPage);

    return { filters, setFilters, resetFilters, setPage };
};

/**
 * Hook for selected property
 */
export const useSelectedProperty = () => {
    const property = usePropertyStore(selectSelectedProperty);
    const isLoading = usePropertyStore((state) => state.isLoadingDetails);
    const setProperty = usePropertyStore((state) => state.setSelectedProperty);

    return { property, isLoading, setProperty };
};
