/**
 * GRADE A REALTY - Constants
 * Application-wide constants
 * Phase 1 Implementation
 */

// =============================================================================
// PROPERTY CONSTANTS
// =============================================================================

export const PROPERTY_TYPES = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condominium' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' },
] as const;

export const LISTING_TYPES = [
    { value: 'sale', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' },
    { value: 'both', label: 'Sale or Rent' },
] as const;

export const PROPERTY_STATUSES = [
    { value: 'draft', label: 'Draft', color: 'gray' },
    { value: 'pending_approval', label: 'Pending Approval', color: 'yellow' },
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'under_contract', label: 'Under Contract', color: 'blue' },
    { value: 'sold', label: 'Sold', color: 'purple' },
    { value: 'rented', label: 'Rented', color: 'purple' },
    { value: 'off_market', label: 'Off Market', color: 'gray' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
] as const;

export const RENT_PERIODS = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'yearly', label: 'Yearly' },
] as const;

export const AMENITIES = [
    // Interior
    'Air Conditioning',
    'Heating',
    'Hardwood Floors',
    'Carpet',
    'Fireplace',
    'Walk-in Closet',
    'Laundry In-Unit',
    'Dishwasher',
    'Microwave',
    'Refrigerator',
    'Stove/Oven',

    // Exterior
    'Balcony',
    'Patio',
    'Deck',
    'Garage',
    'Carport',
    'Driveway',
    'Fenced Yard',
    'Garden',
    'Swimming Pool',
    'Hot Tub',

    // Building
    'Elevator',
    'Doorman',
    'Concierge',
    'Gym',
    'Rooftop Access',
    'Storage',
    'Bike Storage',
    'Package Room',

    // Utilities
    'Central AC',
    'Central Heat',
    'Pet Friendly',
    'Smoke Free',
    'Wheelchair Accessible',
    'Smart Home',
    'EV Charging',
    'Solar Panels',
] as const;

// =============================================================================
// APPLICATION CONSTANTS
// =============================================================================

export const APPLICATION_STATUSES = [
    { value: 'draft', label: 'Draft', color: 'gray' },
    { value: 'submitted', label: 'Submitted', color: 'blue' },
    { value: 'screening', label: 'Screening', color: 'yellow' },
    { value: 'under_review', label: 'Under Review', color: 'orange' },
    { value: 'approved', label: 'Approved', color: 'green' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
    { value: 'conditional', label: 'Conditional', color: 'purple' },
    { value: 'fulfilled', label: 'Fulfilled', color: 'green' },
    { value: 'withdrawn', label: 'Withdrawn', color: 'gray' },
] as const;

export const CREDIT_SCORE_RANGES = [
    { value: '300-579', label: 'Poor (300-579)' },
    { value: '580-669', label: 'Fair (580-669)' },
    { value: '670-739', label: 'Good (670-739)' },
    { value: '740-799', label: 'Very Good (740-799)' },
    { value: '800-850', label: 'Excellent (800-850)' },
] as const;

export const EMPLOYMENT_STATUSES = [
    { value: 'employed', label: 'Employed Full-Time' },
    { value: 'employed_part_time', label: 'Employed Part-Time' },
    { value: 'self_employed', label: 'Self-Employed' },
    { value: 'retired', label: 'Retired' },
    { value: 'student', label: 'Student' },
    { value: 'unemployed', label: 'Unemployed' },
] as const;

// =============================================================================
// TRANSACTION CONSTANTS
// =============================================================================

export const TRANSACTION_STATUSES = [
    { value: 'initiated', label: 'Initiated', color: 'blue' },
    { value: 'contract_pending', label: 'Contract Pending', color: 'yellow' },
    { value: 'contract_signed', label: 'Contract Signed', color: 'green' },
    { value: 'payment_pending', label: 'Payment Pending', color: 'orange' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
] as const;

// =============================================================================
// PAYMENT CONSTANTS
// =============================================================================

export const PAYMENT_TYPES = [
    { value: 'rent', label: 'Rent' },
    { value: 'purchase', label: 'Purchase' },
    { value: 'deposit', label: 'Security Deposit' },
    { value: 'platform_fee', label: 'Platform Fee' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'refund', label: 'Refund' },
    { value: 'late_fee', label: 'Late Fee' },
    { value: 'application_fee', label: 'Application Fee' },
] as const;

export const PAYMENT_STATUSES = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'processing', label: 'Processing', color: 'blue' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'failed', label: 'Failed', color: 'red' },
    { value: 'refunded', label: 'Refunded', color: 'purple' },
    { value: 'cancelled', label: 'Cancelled', color: 'gray' },
] as const;

// =============================================================================
// MAINTENANCE CONSTANTS
// =============================================================================

export const MAINTENANCE_PRIORITIES = [
    { value: 'emergency', label: 'Emergency', color: 'red', slaHours: 4 },
    { value: 'high', label: 'High', color: 'orange', slaHours: 24 },
    { value: 'medium', label: 'Medium', color: 'yellow', slaHours: 72 },
    { value: 'low', label: 'Low', color: 'green', slaHours: 168 },
] as const;

export const MAINTENANCE_CATEGORIES = [
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'appliance', label: 'Appliance' },
    { value: 'structural', label: 'Structural' },
    { value: 'landscaping', label: 'Landscaping' },
    { value: 'pest_control', label: 'Pest Control' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'other', label: 'Other' },
] as const;

export const MAINTENANCE_STATUSES = [
    { value: 'open', label: 'Open', color: 'blue' },
    { value: 'assigned', label: 'Assigned', color: 'yellow' },
    { value: 'in_progress', label: 'In Progress', color: 'orange' },
    { value: 'pending_approval', label: 'Pending Approval', color: 'purple' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'gray' },
] as const;

// =============================================================================
// USER & ROLE CONSTANTS
// =============================================================================

export const CUSTOMER_ROLES = [
    { value: 'buyer', label: 'Buyer', description: 'Purchase properties' },
    { value: 'renter', label: 'Renter', description: 'Rent properties' },
    { value: 'owner', label: 'Owner', description: 'List and manage properties' },
    { value: 'investor', label: 'Investor', description: 'Multi-property portfolio management' },
] as const;

export const ADMIN_ROLES = [
    { value: 'super_admin', label: 'Super Admin', description: 'Full system control' },
    { value: 'operations_admin', label: 'Operations Admin', description: 'Day-to-day operations' },
    { value: 'finance_admin', label: 'Finance Admin', description: 'Financial operations' },
    { value: 'compliance_admin', label: 'Compliance Admin', description: 'KYC and compliance' },
    { value: 'maintenance_admin', label: 'Maintenance Admin', description: 'Maintenance operations' },
] as const;

export const KYC_STATUSES = [
    { value: 'pending', label: 'Pending', color: 'gray' },
    { value: 'submitted', label: 'Submitted', color: 'blue' },
    { value: 'verified', label: 'Verified', color: 'green' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
] as const;

export const USER_STATUSES = [
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'suspended', label: 'Suspended', color: 'red' },
    { value: 'deactivated', label: 'Deactivated', color: 'gray' },
] as const;

// =============================================================================
// PLATFORM CONSTANTS
// =============================================================================

export const PLATFORM_FEE_PERCENTAGE = 8;
export const LATE_FEE_PERCENTAGE = 5;
export const LATE_FEE_MINIMUM = 50;
export const GRACE_PERIOD_DAYS = 5;

export const APPLICATION_FEE = 50;

export const MAX_COUNTER_OFFERS = 5;
export const OFFER_EXPIRY_HOURS = 48;
export const LEASE_RENEWAL_NOTICE_DAYS = 90;

// =============================================================================
// PAGINATION CONSTANTS
// =============================================================================

export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [12, 24, 48, 96] as const;

// =============================================================================
// SORT OPTIONS
// =============================================================================

export const PROPERTY_SORT_OPTIONS = [
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'sqft_asc', label: 'Size: Small to Large' },
    { value: 'sqft_desc', label: 'Size: Large to Small' },
] as const;

// =============================================================================
// US STATES
// =============================================================================

export const US_STATES = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' },
    { value: 'DC', label: 'District of Columbia' },
] as const;
