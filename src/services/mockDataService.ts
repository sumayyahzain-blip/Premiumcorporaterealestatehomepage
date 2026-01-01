/**
 * GRADE A REALTY - Mock Data Service
 * Provides mock data for development and testing
 * Phase 1 Implementation
 */

import type { Property, PropertyStatus, ListingType, PropertyType } from '../types';

// =============================================================================
// MOCK PROPERTIES
// =============================================================================

export const MOCK_PROPERTIES: Property[] = [
    {
        id: 'prop-001',
        ownerId: 'user-001',
        title: 'Modern Luxury Villa with Ocean Views',
        description: 'Stunning 5-bedroom villa offering breathtaking panoramic ocean views. Features include a gourmet kitchen with top-of-the-line appliances, infinity pool, private beach access, smart home technology throughout, and a spacious outdoor entertainment area.',
        propertyType: 'house' as PropertyType,
        listingType: 'sale' as ListingType,
        status: 'active' as PropertyStatus,
        salePrice: 2450000,
        rentPrice: null,
        rentPeriod: null,
        addressLine1: '1234 Ocean View Drive',
        addressLine2: null,
        city: 'Malibu',
        state: 'CA',
        postalCode: '90265',
        latitude: 34.0259,
        longitude: -118.7798,
        bedrooms: 5,
        bathrooms: 4.5,
        squareFeet: 4200,
        lotSize: 12000,
        yearBuilt: 2021,
        parkingSpaces: 3,
        amenities: ['Pool', 'Ocean View', 'Smart Home', 'Gourmet Kitchen', 'Fireplace', 'Wine Cellar'],
        primaryImageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        viewCount: 1243,
        createdAt: '2024-12-15T10:30:00Z',
        updatedAt: '2024-12-28T14:20:00Z',
    },
    {
        id: 'prop-002',
        ownerId: 'user-001',
        title: 'Downtown Luxury Penthouse',
        description: 'Exclusive penthouse in the heart of downtown with floor-to-ceiling windows, private rooftop terrace, and unobstructed city skyline views. Chef\'s kitchen, custom finishes, and 24/7 concierge service.',
        propertyType: 'condo' as PropertyType,
        listingType: 'rent' as ListingType,
        status: 'active' as PropertyStatus,
        salePrice: null,
        rentPrice: 8500,
        rentPeriod: 'monthly',
        addressLine1: '1 Skyline Tower, Unit PH1',
        addressLine2: null,
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        latitude: 37.7749,
        longitude: -122.4194,
        bedrooms: 3,
        bathrooms: 3,
        squareFeet: 2800,
        lotSize: null,
        yearBuilt: 2019,
        parkingSpaces: 2,
        amenities: ['Gym', 'Concierge', 'Rooftop', 'City View', 'Smart Home', 'Doorman'],
        primaryImageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        viewCount: 892,
        createdAt: '2024-12-20T08:00:00Z',
        updatedAt: '2024-12-30T16:45:00Z',
    },
    {
        id: 'prop-003',
        ownerId: 'user-002',
        title: 'Charming Craftsman Bungalow',
        description: 'Beautifully restored 1920s Craftsman with original hardwood floors, built-in cabinetry, and a wrap-around porch. Modern updates include a renovated kitchen, updated electrical, and new HVAC system.',
        propertyType: 'house' as PropertyType,
        listingType: 'sale' as ListingType,
        status: 'active' as PropertyStatus,
        salePrice: 875000,
        rentPrice: null,
        rentPeriod: null,
        addressLine1: '567 Oak Street',
        addressLine2: null,
        city: 'Portland',
        state: 'OR',
        postalCode: '97205',
        latitude: 45.5152,
        longitude: -122.6784,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1850,
        lotSize: 6000,
        yearBuilt: 1925,
        parkingSpaces: 1,
        amenities: ['Hardwood Floors', 'Porch', 'Garden', 'Fireplace', 'Updated Kitchen'],
        primaryImageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        viewCount: 456,
        createdAt: '2024-12-22T11:15:00Z',
        updatedAt: '2024-12-29T09:30:00Z',
    },
    {
        id: 'prop-004',
        ownerId: 'user-001',
        title: 'Sleek Urban Loft in Arts District',
        description: 'Industrial-chic loft in a converted warehouse featuring 14-foot ceilings, exposed brick walls, polished concrete floors, and an open floor plan perfect for entertaining.',
        propertyType: 'apartment' as PropertyType,
        listingType: 'rent' as ListingType,
        status: 'active' as PropertyStatus,
        salePrice: null,
        rentPrice: 3200,
        rentPeriod: 'monthly',
        addressLine1: '888 Factory Lane, Unit 4B',
        addressLine2: null,
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90013',
        latitude: 34.0395,
        longitude: -118.2421,
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 1100,
        lotSize: null,
        yearBuilt: 1935,
        parkingSpaces: 1,
        amenities: ['High Ceilings', 'Exposed Brick', 'Open Floor Plan', 'Rooftop Access'],
        primaryImageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        viewCount: 678,
        createdAt: '2024-12-18T14:00:00Z',
        updatedAt: '2024-12-27T11:00:00Z',
    },
    {
        id: 'prop-005',
        ownerId: 'user-002',
        title: 'Mountain Retreat with Ski Access',
        description: 'Cozy mountain home with direct ski-in/ski-out access. Features a stone fireplace, hot tub, game room, and stunning mountain views from every window.',
        propertyType: 'house' as PropertyType,
        listingType: 'both' as ListingType,
        status: 'active' as PropertyStatus,
        salePrice: 1250000,
        rentPrice: 4500,
        rentPeriod: 'weekly',
        addressLine1: '100 Powder Ridge Road',
        addressLine2: null,
        city: 'Park City',
        state: 'UT',
        postalCode: '84060',
        latitude: 40.6461,
        longitude: -111.4980,
        bedrooms: 4,
        bathrooms: 3.5,
        squareFeet: 3100,
        lotSize: 8500,
        yearBuilt: 2015,
        parkingSpaces: 2,
        amenities: ['Hot Tub', 'Ski Access', 'Fireplace', 'Mountain View', 'Game Room', 'Heated Garage'],
        primaryImageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
        viewCount: 1567,
        createdAt: '2024-12-10T09:00:00Z',
        updatedAt: '2024-12-31T08:00:00Z',
    },
    {
        id: 'prop-006',
        ownerId: 'user-003',
        title: 'Modern Townhouse in Quiet Neighborhood',
        description: 'Recently built townhouse with modern finishes, attached garage, and a private backyard patio. Energy-efficient design with solar panels and smart home features.',
        propertyType: 'townhouse' as PropertyType,
        listingType: 'sale' as ListingType,
        status: 'pending_approval' as PropertyStatus,
        salePrice: 625000,
        rentPrice: null,
        rentPeriod: null,
        addressLine1: '234 Maple Court',
        addressLine2: 'Unit B',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        latitude: 30.2672,
        longitude: -97.7431,
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 2100,
        lotSize: 2500,
        yearBuilt: 2023,
        parkingSpaces: 2,
        amenities: ['Solar Panels', 'Smart Home', 'Patio', 'Energy Efficient', 'New Construction'],
        primaryImageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
        viewCount: 234,
        createdAt: '2024-12-28T16:00:00Z',
        updatedAt: '2024-12-30T10:00:00Z',
    },
    {
        id: 'prop-007',
        ownerId: 'user-001',
        title: 'Beachfront Condo with Private Balcony',
        description: 'Wake up to the sound of waves in this direct beachfront condo. Floor-to-ceiling windows, updated interiors, and a spacious balcony overlooking the Gulf.',
        propertyType: 'condo' as PropertyType,
        listingType: 'rent' as ListingType,
        status: 'rented' as PropertyStatus,
        salePrice: null,
        rentPrice: 3800,
        rentPeriod: 'monthly',
        addressLine1: '500 Gulf Shore Boulevard',
        addressLine2: 'Unit 12A',
        city: 'Naples',
        state: 'FL',
        postalCode: '34102',
        latitude: 26.1420,
        longitude: -81.7948,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1450,
        lotSize: null,
        yearBuilt: 2010,
        parkingSpaces: 1,
        amenities: ['Beach Access', 'Balcony', 'Ocean View', 'Pool', 'Gym', 'Gated'],
        primaryImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        viewCount: 923,
        createdAt: '2024-11-15T12:00:00Z',
        updatedAt: '2024-12-15T14:00:00Z',
    },
    {
        id: 'prop-008',
        ownerId: 'user-002',
        title: 'Historic Brownstone in Prime Location',
        description: 'Elegant 4-story brownstone with original architectural details, modern updates, and a private garden. Walking distance to shops, restaurants, and public transit.',
        propertyType: 'townhouse' as PropertyType,
        listingType: 'sale' as ListingType,
        status: 'under_contract' as PropertyStatus,
        salePrice: 3200000,
        rentPrice: null,
        rentPeriod: null,
        addressLine1: '45 Commonwealth Avenue',
        addressLine2: null,
        city: 'Boston',
        state: 'MA',
        postalCode: '02116',
        latitude: 42.3519,
        longitude: -71.0773,
        bedrooms: 5,
        bathrooms: 4,
        squareFeet: 4500,
        lotSize: 2000,
        yearBuilt: 1890,
        parkingSpaces: 0,
        amenities: ['Garden', 'Historic', 'Original Details', 'Wine Cellar', 'Fireplace', 'Library'],
        primaryImageUrl: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800',
        viewCount: 1876,
        createdAt: '2024-10-01T09:00:00Z',
        updatedAt: '2024-12-20T11:00:00Z',
    },
];

// =============================================================================
// MOCK DATA SERVICE
// =============================================================================

export interface PropertySearchParams {
    query?: string;
    listingType?: string;
    propertyTypes?: string[];
    priceMin?: number;
    priceMax?: number;
    bedroomsMin?: number;
    bathroomsMin?: number;
    sqftMin?: number;
    sqftMax?: number;
    city?: string;
    state?: string;
    status?: string;
    ownerId?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
}

export interface PropertySearchResult {
    properties: Property[];
    total: number;
    page: number;
    totalPages: number;
}

export const mockDataService = {
    /**
     * Search properties with filters
     */
    searchProperties: async (params: PropertySearchParams = {}): Promise<PropertySearchResult> => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

        let filtered = [...MOCK_PROPERTIES];

        // Apply filters
        if (params.query) {
            const query = params.query.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.title.toLowerCase().includes(query) ||
                    p.description.toLowerCase().includes(query) ||
                    p.city.toLowerCase().includes(query) ||
                    p.state.toLowerCase().includes(query) ||
                    p.addressLine1.toLowerCase().includes(query)
            );
        }

        if (params.listingType) {
            filtered = filtered.filter(
                (p) => p.listingType === params.listingType || p.listingType === 'both'
            );
        }

        if (params.propertyTypes && params.propertyTypes.length > 0) {
            filtered = filtered.filter((p) => params.propertyTypes!.includes(p.propertyType));
        }

        if (params.priceMin !== undefined) {
            filtered = filtered.filter((p) => {
                const price = p.salePrice || p.rentPrice || 0;
                return price >= params.priceMin!;
            });
        }

        if (params.priceMax !== undefined) {
            filtered = filtered.filter((p) => {
                const price = p.salePrice || p.rentPrice || 0;
                return price <= params.priceMax!;
            });
        }

        if (params.bedroomsMin !== undefined) {
            filtered = filtered.filter((p) => p.bedrooms >= params.bedroomsMin!);
        }

        if (params.bathroomsMin !== undefined) {
            filtered = filtered.filter((p) => p.bathrooms >= params.bathroomsMin!);
        }

        if (params.sqftMin !== undefined) {
            filtered = filtered.filter((p) => p.squareFeet >= params.sqftMin!);
        }

        if (params.sqftMax !== undefined) {
            filtered = filtered.filter((p) => p.squareFeet <= params.sqftMax!);
        }

        if (params.city) {
            filtered = filtered.filter((p) =>
                p.city.toLowerCase().includes(params.city!.toLowerCase())
            );
        }

        if (params.state) {
            filtered = filtered.filter((p) => p.state === params.state);
        }

        if (params.status) {
            filtered = filtered.filter((p) => p.status === params.status);
        }

        if (params.ownerId) {
            filtered = filtered.filter((p) => p.ownerId === params.ownerId);
        }

        // Apply sorting
        const sortBy = params.sortBy || 'date_desc';
        switch (sortBy) {
            case 'price_asc':
                filtered.sort((a, b) => (a.salePrice || a.rentPrice || 0) - (b.salePrice || b.rentPrice || 0));
                break;
            case 'price_desc':
                filtered.sort((a, b) => (b.salePrice || b.rentPrice || 0) - (a.salePrice || a.rentPrice || 0));
                break;
            case 'date_asc':
                filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case 'date_desc':
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'sqft_asc':
                filtered.sort((a, b) => a.squareFeet - b.squareFeet);
                break;
            case 'sqft_desc':
                filtered.sort((a, b) => b.squareFeet - a.squareFeet);
                break;
            case 'views_desc':
                filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
                break;
        }

        // Pagination
        const page = params.page || 1;
        const limit = params.limit || 12;
        const total = filtered.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const paginated = filtered.slice(start, start + limit);

        return {
            properties: paginated,
            total,
            page,
            totalPages,
        };
    },

    /**
     * Get a single property by ID
     */
    getPropertyById: async (id: string): Promise<Property | null> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return MOCK_PROPERTIES.find((p) => p.id === id) || null;
    },

    /**
     * Get featured properties
     */
    getFeaturedProperties: async (limit: number = 6): Promise<Property[]> => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return MOCK_PROPERTIES.filter((p) => p.status === 'active')
            .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
            .slice(0, limit);
    },

    /**
     * Get properties by owner ID
     */
    getPropertiesByOwner: async (ownerId: string): Promise<Property[]> => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return MOCK_PROPERTIES.filter((p) => p.ownerId === ownerId);
    },

    /**
     * Get dashboard stats
     */
    getDashboardStats: async (ownerId?: string): Promise<{
        totalProperties: number;
        activeListings: number;
        totalViews: number;
        monthlyIncome: number;
        occupancyRate: number;
        pendingApprovals: number;
    }> => {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const properties = ownerId
            ? MOCK_PROPERTIES.filter((p) => p.ownerId === ownerId)
            : MOCK_PROPERTIES;

        const activeListings = properties.filter((p) => p.status === 'active').length;
        const rentedProperties = properties.filter((p) => p.status === 'rented').length;
        const totalViews = properties.reduce((sum, p) => sum + (p.viewCount || 0), 0);
        const monthlyIncome = properties
            .filter((p) => p.status === 'rented' && p.rentPrice)
            .reduce((sum, p) => sum + (p.rentPrice || 0), 0);
        const pendingApprovals = properties.filter((p) => p.status === 'pending_approval').length;

        return {
            totalProperties: properties.length,
            activeListings,
            totalViews,
            monthlyIncome,
            occupancyRate: properties.length > 0 ? (rentedProperties / properties.length) * 100 : 0,
            pendingApprovals,
        };
    },
};

export default mockDataService;
