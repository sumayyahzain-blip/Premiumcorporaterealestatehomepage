/**
 * GRADE A REALTY - Mock API Adapter
 * Phase 2.2 Implementation
 * 
 * This adapter implements the ApiClientInterface using in-memory mock data.
 * It simulates network latency and potential errors.
 */

import {
    ApiClientInterface,
    LoginRequest, LoginResponse,
    RegisterRequest, RegisterResponse,
    RefreshTokenRequest, RefreshTokenResponse,
    GetPropertiesRequest, GetPropertiesResponse,
    GetPropertyResponse, CreatePropertyRequest, CreatePropertyResponse,
    UpdatePropertyRequest, UpdatePropertyResponse,
    DashboardStatsResponse,
    GetUsersRequest, GetUsersResponse,
    UpdateUserRequest
} from '../../types/api';

import {
    User, Property, ApiResponse, ApiError,
    PropertyStatus, ListingType, PropertyType
} from '../../types';

import { MOCK_PROPERTIES, MOCK_USERS } from './mockData';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const SIMULATED_LATENCY_MS = 600;

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function success<T>(data: T): ApiResponse<T> {
    return { success: true, data };
}

function error<T>(code: string, message: string): ApiResponse<T> {
    return {
        success: false,
        error: { code, message }
    };
}

// =============================================================================
// MOCK STATE - Mutable state for the session
// =============================================================================

let properties = [...MOCK_PROPERTIES];
// We need to map the partial mock users to full User objects for type safety
// For now, we'll cast them, but in a real app we'd have full data
let users = [...MOCK_USERS].map(u => ({
    ...u,
    phone: null,
    avatarUrl: null,
    emailVerified: true,
    phoneVerified: false,
    kycStatus: 'verified',
    kycVerifiedAt: null,
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    roles: u.roles.map(r => ({ id: 'role-1', userId: u.id, role: r as any, grantedAt: new Date().toISOString(), grantedBy: null, isActive: true }))
})) as unknown as User[];

let currentUser: User | null = users[0]; // Default to first user for dev convenience if needed, or null

// =============================================================================
// MOCK ADAPTER IMPLEMENTATION
// =============================================================================

export const mockApiAdapter: ApiClientInterface = {

    // -------------------------------------------------------------------------
    // AUTHENTICATION
    // -------------------------------------------------------------------------
    auth: {
        async login(req: LoginRequest): Promise<ApiResponse<LoginResponse>> {
            await sleep(SIMULATED_LATENCY_MS);

            const user = users.find(u => u.email === req.email);

            // Simple mock password check (in reality, we'd hash)
            if (!user || req.password === 'wrong') {
                return error('AUTH_INVALID_CREDENTIALS', 'Invalid email or password');
            }

            currentUser = user;

            return success({
                user: {
                    ...user,
                    roles: user.roles?.map(r => r.role) || [],
                    permissions: [] // Mock permissions
                },
                accessToken: 'mock-access-token-' + Date.now(),
                refreshToken: 'mock-refresh-token-' + Date.now(),
                expiresIn: 3600
            });
        },

        async register(req: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
            await sleep(SIMULATED_LATENCY_MS);

            if (users.find(u => u.email === req.email)) {
                return error('AUTH_EMAIL_EXISTS', 'Email already in use');
            }

            const newUser: User = {
                id: `user-${Date.now()}`,
                email: req.email,
                firstName: req.firstName,
                lastName: req.lastName,
                phone: req.phone || null,
                avatarUrl: null,
                emailVerified: false,
                phoneVerified: false,
                kycStatus: 'pending',
                kycVerifiedAt: null,
                twoFactorEnabled: false,
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
                roles: [] // Default role would be assigned here
            };

            users.push(newUser);
            currentUser = newUser;

            return success({
                user: {
                    ...newUser,
                    roles: [],
                    permissions: []
                },
                accessToken: 'mock-access-token-' + Date.now(),
                refreshToken: 'mock-refresh-token-' + Date.now(),
                expiresIn: 3600,
                emailVerificationSent: true
            });
        },

        async logout(): Promise<ApiResponse<void>> {
            await sleep(SIMULATED_LATENCY_MS / 2);
            currentUser = null;
            return success(undefined);
        },

        async refresh(req: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
            await sleep(SIMULATED_LATENCY_MS);
            // In a real app, verify the refresh token
            if (req.refreshToken.includes('invalid')) {
                return error('AUTH_INVALID_TOKEN', 'Invalid refresh token');
            }
            return success({
                accessToken: 'mock-access-token-refreshed-' + Date.now(),
                refreshToken: 'mock-refresh-token-new-' + Date.now(),
                expiresIn: 3600
            });
        },

        async me(): Promise<ApiResponse<User>> {
            await sleep(SIMULATED_LATENCY_MS);
            if (!currentUser) {
                return error('AUTH_UNAUTHORIZED', 'Not authenticated');
            }
            return success(currentUser);
        },
        async forgotPassword(): Promise<ApiResponse<void>> {
            await sleep(SIMULATED_LATENCY_MS);
            return success(undefined);
        },
        async resetPassword(): Promise<ApiResponse<void>> {
            await sleep(SIMULATED_LATENCY_MS);
            return success(undefined);
        },
        async changePassword(): Promise<ApiResponse<void>> {
            await sleep(SIMULATED_LATENCY_MS);
            return success(undefined);
        },
        async verify2FA(): Promise<ApiResponse<LoginResponse>> {
            await sleep(SIMULATED_LATENCY_MS);
            if (!currentUser) return error('AUTH_UNAUTHORIZED', 'No pending session');
            return success({
                user: { ...currentUser, roles: [], permissions: [] },
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
                expiresIn: 3600
            });
        },
        async verifyEmail(): Promise<ApiResponse<void>> {
            await sleep(SIMULATED_LATENCY_MS);
            return success(undefined);
        },
        async resendVerification(): Promise<ApiResponse<void>> {
            await sleep(SIMULATED_LATENCY_MS);
            return success(undefined);
        }
    },

    // -------------------------------------------------------------------------
    // PROPERTIES
    // -------------------------------------------------------------------------
    properties: {
        async list(params: GetPropertiesRequest): Promise<ApiResponse<GetPropertiesResponse>> {
            await sleep(SIMULATED_LATENCY_MS);

            let filtered = [...properties];

            // 1. Filter by Search Query (Title, Description, Address)
            if (params.query) {
                const q = params.query.toLowerCase();
                filtered = filtered.filter(p =>
                    p.title.toLowerCase().includes(q) ||
                    (p.description && p.description.toLowerCase().includes(q)) ||
                    (p.city && p.city.toLowerCase().includes(q)) ||
                    (p.addressLine1 && p.addressLine1.toLowerCase().includes(q))
                );
            }

            // 2. Filter by Filters
            if (params.listingType) {
                filtered = filtered.filter(p => p.listingType === params.listingType || p.listingType === 'both');
            }
            if (params.propertyType && params.propertyType.length > 0) {
                filtered = filtered.filter(p => params.propertyType?.includes(p.propertyType));
            }
            if (params.status) {
                filtered = filtered.filter(p => p.status === params.status);
            }
            if (params.ownerId) {
                filtered = filtered.filter(p => p.ownerId === params.ownerId);
            }
            if (params.minPrice) {
                filtered = filtered.filter(p => {
                    const price = p.listingType === 'rent' ? p.rentPrice : p.salePrice;
                    return (price || 0) >= params.minPrice!;
                });
            }
            if (params.maxPrice) {
                filtered = filtered.filter(p => {
                    const price = p.listingType === 'rent' ? p.rentPrice : p.salePrice;
                    return (price || 0) <= params.maxPrice!;
                });
            }

            // 3. Sorting
            if (params.sortBy) {
                // Implementation of sort logic
                if (params.sortBy === 'price_asc') {
                    filtered.sort((a, b) => ((a.salePrice || a.rentPrice || 0) - (b.salePrice || b.rentPrice || 0)));
                } else if (params.sortBy === 'price_desc') {
                    filtered.sort((a, b) => ((b.salePrice || b.rentPrice || 0) - (a.salePrice || a.rentPrice || 0)));
                } else if (params.sortBy === 'date_desc') {
                    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                }
            }

            // 4. Pagination
            const page = params.page || 1;
            const pageSize = params.pageSize || 10;
            const totalItems = filtered.length;
            const totalPages = Math.ceil(totalItems / pageSize);
            const data = filtered.slice((page - 1) * pageSize, page * pageSize);

            return success({
                data,
                pagination: {
                    page,
                    pageSize,
                    totalItems,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });
        },

        async get(id: string): Promise<ApiResponse<GetPropertyResponse>> {
            await sleep(SIMULATED_LATENCY_MS);
            const property = properties.find(p => p.id === id);
            if (!property) return error('NOT_FOUND', 'Property not found');
            return success(property);
        },

        async create(data: CreatePropertyRequest): Promise<ApiResponse<CreatePropertyResponse>> {
            await sleep(SIMULATED_LATENCY_MS);

            const newProperty: Property = {
                id: `prop-${Date.now()}`,
                ownerId: currentUser?.id || 'unknown',
                ...data,
                status: 'pending_approval',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                // Fill default nulls for optional fields
                addressLine2: data.addressLine2 || null,
                postalCode: data.postalCode || null,
                latitude: null,
                longitude: null,
                salePrice: data.salePrice || null,
                rentPrice: data.rentPrice || null,
                rentPeriod: data.rentPeriod || null,
                depositAmount: data.depositAmount || null,
                bedrooms: data.bedrooms || null,
                bathrooms: data.bathrooms || null,
                squareFeet: data.squareFeet || null,
                lotSize: data.lotSize || null,
                yearBuilt: data.yearBuilt || null,
                parkingSpaces: data.parkingSpaces || null,
                amenities: data.amenities || [],
                estimatedAnnualIncome: null,
                estimatedExpenses: null,
                capRate: null,
                estimatedRoi: null,
                hoaFees: data.hoaFees || null,
                propertyTax: data.propertyTax || null,
                availableFrom: data.availableFrom || null,
                leaseTermMonths: data.leaseTermMonths || null,
                instantBooking: data.instantBooking || false,
                approvedAt: null,
                approvedBy: null,
                rejectionReason: null,
            };

            properties.unshift(newProperty);
            return success(newProperty);
        },

        async update(id: string, data: UpdatePropertyRequest): Promise<ApiResponse<UpdatePropertyResponse>> {
            await sleep(SIMULATED_LATENCY_MS);
            const index = properties.findIndex(p => p.id === id);
            if (index === -1) return error('NOT_FOUND', 'Property not found');

            properties[index] = { ...properties[index], ...data, updatedAt: new Date().toISOString() };
            return success(properties[index]);
        },

        async delete(id: string): Promise<ApiResponse<void>> {
            await sleep(SIMULATED_LATENCY_MS);
            const index = properties.findIndex(p => p.id === id);
            if (index === -1) return error('NOT_FOUND', 'Property not found');

            properties.splice(index, 1);
            return success(undefined);
        },

        async getFeatured(): Promise<ApiResponse<Property[]>> {
            await sleep(SIMULATED_LATENCY_MS);
            // Return top 6 active properties
            const featured = properties
                .filter(p => p.status === 'active')
                .slice(0, 6);
            return success(featured);
        }
    },

    // -------------------------------------------------------------------------
    // USERS
    // -------------------------------------------------------------------------
    users: {
        async list(params: GetUsersRequest = {}): Promise<ApiResponse<GetUsersResponse>> {
            await sleep(SIMULATED_LATENCY_MS);

            let filtered = [...users];

            if (params.query) {
                const q = params.query.toLowerCase();
                filtered = filtered.filter(u =>
                    u.email.toLowerCase().includes(q) ||
                    (u.firstName && u.firstName.toLowerCase().includes(q)) ||
                    (u.lastName && u.lastName.toLowerCase().includes(q))
                );
            }

            if (params.role) {
                filtered = filtered.filter(u => u.roles?.some(r => r.role === params.role));
            }

            if (params.status) {
                filtered = filtered.filter(u => u.status === params.status);
            }

            const page = params.page || 1;
            const pageSize = params.pageSize || 10;
            const total = filtered.length;
            const totalPages = Math.ceil(total / pageSize);
            const data = filtered.slice((page - 1) * pageSize, page * pageSize);

            return success({
                data,
                pagination: {
                    page, pageSize, totalItems: total, totalPages,
                    hasNext: page < totalPages, hasPrev: page > 1
                }
            });
        },

        async get(id: string): Promise<ApiResponse<User>> {
            await sleep(SIMULATED_LATENCY_MS);
            const user = users.find(u => u.id === id);
            if (!user) return error('NOT_FOUND', 'User not found');
            return success(user);
        },

        async update(id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
            await sleep(SIMULATED_LATENCY_MS);
            const index = users.findIndex(u => u.id === id);
            if (index === -1) return error('NOT_FOUND', 'User not found');

            users[index] = { ...users[index], ...data, updatedAt: new Date().toISOString() };
            return success(users[index]);
        }
    },

    // -------------------------------------------------------------------------
    // DASHBOARD
    // -------------------------------------------------------------------------
    dashboard: {
        async getStats(): Promise<ApiResponse<DashboardStatsResponse>> {
            await sleep(SIMULATED_LATENCY_MS);

            const activeListings = properties.filter(p => p.status === 'active').length;
            const pendingApprovals = properties.filter(p => p.status === 'pending_approval').length;

            // Calculate user stats
            const totalUsers = users.length;
            const activeOwners = users.filter(u => u.roles?.some(r => r.role === 'owner')).length;
            const activeRenters = users.filter(u => u.roles?.some(r => r.role === 'renter')).length;

            return success({
                totalProperties: properties.length,
                activeListings,
                totalUsers,
                activeOwners,
                activeRenters,
                monthlyRevenue: 45600, // Mock
                platformFees: 2280, // Mock
                pendingPayments: 12, // Mock 
                maintenanceRequests: 5, // Mock
                pendingApprovals,
                viewsTrend: 12.5,
                incomeTrend: 8.4
            });
        }
    },

    chat: {
        async send(data) {
            await sleep(SIMULATED_LATENCY_MS);
            return success({
                senderInfo: { role: 'assistant' },
                content: "I'm a mock AI assistant. I see you said: " + data.message,
                timestamp: new Date().toISOString()
            });
        }
    }
};
