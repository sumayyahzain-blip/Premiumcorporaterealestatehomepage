/**
 * GRADE A REALTY - TypeScript Type Definitions
 * Version: 1.0.0
 * Phase 1 Implementation
 */

// =============================================================================
// ENUMS
// =============================================================================

export type UserStatus = 'active' | 'suspended' | 'deactivated';
export type KYCStatus = 'pending' | 'submitted' | 'verified' | 'rejected';

export type CustomerRole = 'buyer' | 'renter' | 'owner' | 'investor';
export type AdminRole = 'super_admin' | 'operations_admin' | 'finance_admin' | 'compliance_admin' | 'maintenance_admin';
export type UserRole = CustomerRole | AdminRole;

export type PropertyType = 'house' | 'apartment' | 'condo' | 'townhouse' | 'commercial' | 'land';
export type ListingType = 'sale' | 'rent' | 'both';
export type PropertyStatus = 'draft' | 'pending_approval' | 'active' | 'under_contract' | 'sold' | 'rented' | 'off_market' | 'rejected';
export type RentPeriod = 'monthly' | 'weekly' | 'yearly';

export type OfferStatus = 'draft' | 'submitted' | 'countered' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';

export type ApplicationStatus = 'draft' | 'submitted' | 'screening' | 'under_review' | 'approved' | 'rejected' | 'conditional' | 'fulfilled' | 'withdrawn';
export type ApplicationType = 'buy' | 'rent';

export type TransactionType = 'purchase' | 'lease';
export type TransactionStatus = 'initiated' | 'contract_pending' | 'contract_signed' | 'payment_pending' | 'completed' | 'cancelled';

export type PaymentType = 'rent' | 'purchase' | 'deposit' | 'platform_fee' | 'maintenance' | 'refund' | 'late_fee' | 'application_fee';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'emergency';
export type MaintenanceCategory = 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'landscaping' | 'pest_control' | 'cleaning' | 'other';
export type MaintenanceStatus = 'open' | 'assigned' | 'in_progress' | 'pending_approval' | 'completed' | 'cancelled';

export type VendorStatus = 'active' | 'inactive' | 'suspended';

export type DocumentType = 'lease' | 'contract' | 'deed' | 'id_verification' | 'income_proof' | 'insurance' | 'inspection' | 'tax_document' | 'disclosure' | 'addendum' | 'other';
export type DocumentAccessLevel = 'private' | 'shared' | 'public';
export type DocumentEntityType = 'user' | 'property' | 'application' | 'transaction' | 'maintenance' | 'vendor';

export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'push';

// =============================================================================
// CORE INTERFACES
// =============================================================================

export interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    avatarUrl: string | null;
    emailVerified: boolean;
    phoneVerified: boolean;
    kycStatus: KYCStatus;
    kycVerifiedAt: string | null;
    twoFactorEnabled: boolean;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
    lastLoginAt: string | null;
    roles?: UserRoleAssignment[];
}

export interface UserRoleAssignment {
    id: string;
    userId: string;
    role: UserRole;
    grantedAt: string;
    grantedBy: string | null;
    isActive: boolean;
}

export interface Property {
    id: string;
    title: string;
    description: string | null;
    propertyType: PropertyType;
    listingType: ListingType;
    status: PropertyStatus;

    // Location
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    state: string | null;
    country: string;
    postalCode: string | null;
    latitude: number | null;
    longitude: number | null;

    // Pricing
    salePrice: number | null;
    rentPrice: number | null;
    rentPeriod: RentPeriod | null;
    depositAmount: number | null;

    // Features
    bedrooms: number | null;
    bathrooms: number | null;
    squareFeet: number | null;
    lotSize: number | null;
    yearBuilt: number | null;
    parkingSpaces: number | null;
    amenities: string[];

    // Financial
    estimatedAnnualIncome: number | null;
    estimatedExpenses: number | null;
    capRate: number | null;
    estimatedRoi: number | null;
    hoaFees: number | null;
    propertyTax: number | null;

    // Ownership
    ownerId: string;
    owner?: User;

    // Availability
    availableFrom: string | null;
    leaseTermMonths: number | null;
    instantBooking: boolean;

    // Approval
    approvedAt: string | null;
    approvedBy: string | null;
    rejectionReason: string | null;

    // Timestamps
    createdAt: string;
    updatedAt: string;

    // Relations
    images?: PropertyImage[];
}

export interface PropertyImage {
    id: string;
    propertyId: string;
    url: string;
    thumbnailUrl: string | null;
    displayOrder: number;
    isPrimary: boolean;
    caption: string | null;
    width: number | null;
    height: number | null;
    fileSize: number | null;
    mimeType: string | null;
    uploadedAt: string;
}

export interface Offer {
    id: string;
    propertyId: string;
    buyerId: string;

    offerAmount: number;
    earnestMoney: number | null;
    contingencies: string[];
    proposedClosingDate: string | null;
    expiryDate: string | null;
    notes: string | null;

    status: OfferStatus;

    parentOfferId: string | null;
    counterAmount: number | null;
    counterCount: number;

    respondedAt: string | null;
    respondedBy: string | null;

    createdAt: string;
    updatedAt: string;

    // Relations
    property?: Property;
    buyer?: User;
}

export interface Application {
    id: string;
    propertyId: string;
    applicantId: string;
    applicationType: ApplicationType;
    status: ApplicationStatus;

    offeredPrice: number | null;
    proposedMoveIn: string | null;
    leaseTermMonths: number | null;

    employmentStatus: string | null;
    employerName: string | null;
    employerContact: string | null;
    annualIncome: number | null;
    creditScoreRange: string | null;

    rentalHistory: RentalHistoryEntry[];
    occupants: Occupant[];
    pets: Pet[];

    backgroundCheckStatus: string | null;
    creditCheckStatus: string | null;
    screeningCompletedAt: string | null;
    screeningResults: ScreeningResults | null;

    conditions: ApplicationCondition[] | null;

    reviewedBy: string | null;
    reviewedAt: string | null;
    rejectionReason: string | null;

    applicationFeePaid: boolean;
    applicationFeeAmount: number | null;

    createdAt: string;
    updatedAt: string;

    // Relations
    property?: Property;
    applicant?: User;
}

export interface RentalHistoryEntry {
    address: string;
    landlordName: string;
    landlordPhone: string;
    moveInDate: string;
    moveOutDate: string;
    reasonForLeaving: string;
}

export interface Occupant {
    name: string;
    relationship: string;
    age: number;
}

export interface Pet {
    type: string;
    breed: string;
    weight: number;
    age: number;
}

export interface ScreeningResults {
    backgroundCheck: {
        passed: boolean;
        details: string;
    };
    creditCheck: {
        passed: boolean;
        score: number;
        details: string;
    };
    employmentVerified: boolean;
    incomeVerified: boolean;
}

export interface ApplicationCondition {
    type: 'co-signer' | 'extra_deposit' | 'guarantor' | 'other';
    description: string;
    fulfilled: boolean;
    fulfilledAt: string | null;
}

export interface Transaction {
    id: string;
    applicationId: string | null;
    offerId: string | null;
    propertyId: string;
    buyerRenterId: string;
    sellerOwnerId: string;

    transactionType: TransactionType;
    status: TransactionStatus;

    totalAmount: number;
    platformFee: number | null;
    platformFeePercentage: number;
    depositAmount: number | null;

    contractDocumentId: string | null;
    contractSignedAt: string | null;

    moveInDate: string | null;
    leaseStartDate: string | null;
    leaseEndDate: string | null;
    monthlyRent: number | null;

    renewalOf: string | null;
    isRenewal: boolean;

    paymentCompletedAt: string | null;

    cancelledAt: string | null;
    cancelledBy: string | null;
    cancellationReason: string | null;

    createdAt: string;
    updatedAt: string;

    // Relations
    property?: Property;
    buyerRenter?: User;
    sellerOwner?: User;
}

export interface Payment {
    id: string;
    transactionId: string | null;
    payerId: string;
    payeeId: string | null;

    paymentType: PaymentType;
    amount: number;
    status: PaymentStatus;

    paymentMethod: string | null;
    stripePaymentId: string | null;
    stripePaymentIntentId: string | null;

    dueDate: string | null;
    paidAt: string | null;

    isLate: boolean;
    lateFeeApplied: boolean;
    lateFeeAmount: number | null;
    gracePeriodEnd: string | null;

    refundOf: string | null;
    refundReason: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface Vendor {
    id: string;
    companyName: string;
    contactName: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;

    categories: MaintenanceCategory[];
    serviceAreas: string[];

    rating: number;
    totalJobs: number;
    completedJobs: number;
    avgResponseTimeHours: number | null;

    status: VendorStatus;
    verified: boolean;
    insuranceVerified: boolean;
    licenseVerified: boolean;

    insuranceDocumentUrl: string | null;
    licenseDocumentUrl: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface MaintenanceRequest {
    id: string;
    propertyId: string;
    reportedBy: string;
    assignedVendorId: string | null;

    title: string;
    description: string | null;
    priority: MaintenancePriority;
    category: MaintenanceCategory;
    status: MaintenanceStatus;

    photos: string[];

    estimatedCost: number | null;
    actualCost: number | null;
    costApproved: boolean;
    costApprovedBy: string | null;
    costApprovedAt: string | null;

    slaDeadline: string | null;
    slaMet: boolean | null;

    completedAt: string | null;
    completionNotes: string | null;
    completionPhotos: string[];

    tenantRating: number | null;
    tenantFeedback: string | null;

    createdAt: string;
    updatedAt: string;

    // Relations
    property?: Property;
    reporter?: User;
    vendor?: Vendor;
}

export interface Document {
    id: string;
    ownerId: string;

    relatedEntityType: DocumentEntityType;
    relatedEntityId: string;

    documentType: DocumentType;
    fileName: string;
    fileUrl: string;
    fileSize: number | null;
    mimeType: string | null;

    isEncrypted: boolean;
    accessLevel: DocumentAccessLevel;

    requiresSignature: boolean;
    signedBy: DocumentSignature[];
    fullyExecuted: boolean;

    uploadedAt: string;
    expiresAt: string | null;
}

export interface DocumentSignature {
    userId: string;
    signedAt: string;
    ipAddress: string;
}

export interface AuditLog {
    id: string;
    userId: string | null;

    action: string;
    entityType: string | null;
    entityId: string | null;

    oldValues: Record<string, unknown> | null;
    newValues: Record<string, unknown> | null;

    ipAddress: string | null;
    userAgent: string | null;
    requestId: string | null;

    approvalChain: ApprovalChainEntry[] | null;

    result: 'success' | 'failure';
    failureReason: string | null;

    createdAt: string;
}

export interface ApprovalChainEntry {
    level: number;
    approverId: string;
    approvedAt: string;
    role: AdminRole;
}

export interface Notification {
    id: string;
    userId: string;

    type: string;
    title: string;
    message: string | null;

    relatedEntityType: string | null;
    relatedEntityId: string | null;

    channels: NotificationChannel[];

    read: boolean;
    readAt: string | null;

    actionUrl: string | null;

    createdAt: string;
}

export interface SavedProperty {
    id: string;
    userId: string;
    propertyId: string;

    priceAlertEnabled: boolean;
    alertPriceThreshold: number | null;

    notes: string | null;

    createdAt: string;

    property?: Property;
}

// =============================================================================
// API TYPES
// =============================================================================

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, string[]>;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
}

// =============================================================================
// SEARCH & FILTER TYPES
// =============================================================================

export interface PropertySearchFilters {
    query?: string;
    listingType?: ListingType;
    propertyType?: PropertyType[];
    status?: PropertyStatus;
    ownerId?: string;

    city?: string;
    state?: string;
    postalCode?: string;

    minPrice?: number;
    maxPrice?: number;

    minBedrooms?: number;
    maxBedrooms?: number;
    minBathrooms?: number;
    maxBathrooms?: number;
    minSquareFeet?: number;
    maxSquareFeet?: number;

    amenities?: string[];

    availableFrom?: string;

    sortBy?: 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | 'sqft_asc' | 'sqft_desc';

    page?: number;
    pageSize?: number;
}

// =============================================================================
// FORM TYPES
// =============================================================================

export interface PropertyFormData {
    title: string;
    description: string;
    propertyType: PropertyType;
    listingType: ListingType;

    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;

    salePrice?: number;
    rentPrice?: number;
    rentPeriod?: RentPeriod;
    depositAmount?: number;

    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    lotSize?: number;
    yearBuilt?: number;
    parkingSpaces?: number;
    amenities?: string[];

    hoaFees?: number;
    propertyTax?: number;

    availableFrom?: string;
    leaseTermMonths?: number;
    instantBooking?: boolean;
}

export interface ApplicationFormData {
    propertyId: string;
    applicationType: ApplicationType;

    offeredPrice?: number;
    proposedMoveIn?: string;
    leaseTermMonths?: number;

    employmentStatus: string;
    employerName?: string;
    employerContact?: string;
    annualIncome: number;

    rentalHistory: RentalHistoryEntry[];
    occupants: Occupant[];
    pets: Pet[];

    authorizeBackgroundCheck: boolean;
    authorizeCreditCheck: boolean;
    acceptTerms: boolean;
}

export interface OfferFormData {
    propertyId: string;
    offerAmount: number;
    earnestMoney?: number;
    contingencies?: string[];
    proposedClosingDate?: string;
    notes?: string;
}
