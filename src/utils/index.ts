/**
 * GRADE A REALTY - Utility Functions
 * Common helper functions
 * Phase 1 Implementation
 */

// =============================================================================
// FORMATTERS
// =============================================================================

/**
 * Format currency
 */
export function formatCurrency(
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format currency with decimals
 */
export function formatCurrencyWithDecimals(
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(
    value: number,
    locale: string = 'en-US'
): string {
    return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(
    value: number,
    decimals: number = 1
): string {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Format date
 */
export function formatDate(
    date: string | Date,
    format: 'short' | 'medium' | 'long' | 'full' = 'medium',
    locale: string = 'en-US'
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const options: Intl.DateTimeFormatOptions = {
        short: { month: 'short', day: 'numeric' },
        medium: { month: 'short', day: 'numeric', year: 'numeric' },
        long: { month: 'long', day: 'numeric', year: 'numeric' },
        full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    }[format];

    return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format date and time
 */
export function formatDateTime(
    date: string | Date,
    locale: string = 'en-US'
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(dateObj);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return formatDate(dateObj, 'medium');
}

/**
 * Format square feet
 */
export function formatSquareFeet(sqft: number): string {
    return `${formatNumber(sqft)} sq ft`;
}

/**
 * Format address
 */
export function formatAddress(
    addressLine1?: string | null,
    addressLine2?: string | null,
    city?: string | null,
    state?: string | null,
    postalCode?: string | null
): string {
    const parts = [
        addressLine1,
        addressLine2,
        [city, state].filter(Boolean).join(', '),
        postalCode,
    ].filter(Boolean);

    return parts.join(', ');
}

/**
 * Format short address (city, state)
 */
export function formatShortAddress(
    city?: string | null,
    state?: string | null
): string {
    return [city, state].filter(Boolean).join(', ');
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX for US numbers
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }

    // For international, just return cleaned with country code
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }

    return phone;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// =============================================================================
// VALIDATORS
// =============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone format
 */
export function isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Validate postal code (US)
 */
export function isValidPostalCode(code: string): boolean {
    const usZipRegex = /^\d{5}(-\d{4})?$/;
    return usZipRegex.test(code);
}

// =============================================================================
// STRING UTILITIES
// =============================================================================

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return `${str.slice(0, maxLength - 3)}...`;
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert to title case
 */
export function toTitleCase(str: string): string {
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => capitalize(word))
        .join(' ');
}

/**
 * Convert snake_case to Title Case
 */
export function snakeToTitleCase(str: string): string {
    return str
        .split('_')
        .map((word) => capitalize(word))
        .join(' ');
}

/**
 * Convert camelCase to Title Case
 */
export function camelToTitleCase(str: string): string {
    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
}

/**
 * Generate initials from name
 */
export function getInitials(
    firstName?: string | null,
    lastName?: string | null
): string {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
}

/**
 * Slugify string (for URLs)
 */
export function slugify(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// =============================================================================
// ARRAY UTILITIES
// =============================================================================

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
        const groupKey = String(item[key]);
        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
    }, {} as Record<string, T[]>);
}

/**
 * Unique array values
 */
export function unique<T>(array: T[]): T[] {
    return [...new Set(array)];
}

/**
 * Unique by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
    const seen = new Set();
    return array.filter((item) => {
        const value = item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
    });
}

// =============================================================================
// DATE UTILITIES
// =============================================================================

/**
 * Add days to date
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Add months to date
 */
export function addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

/**
 * Get days between dates
 */
export function daysBetween(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if date is in the past
 */
export function isDatePast(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj < new Date();
}

/**
 * Check if date is in the future
 */
export function isDateFuture(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj > new Date();
}

// =============================================================================
// MISC UTILITIES
// =============================================================================

/**
 * Generate UUID v4
 */
export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), wait);
    };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Sleep/delay
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: object): boolean {
    return Object.keys(obj).length === 0;
}

/**
 * Pick keys from object
 */
export function pick<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
): Pick<T, K> {
    return keys.reduce((acc, key) => {
        if (key in obj) {
            acc[key] = obj[key];
        }
        return acc;
    }, {} as Pick<T, K>);
}

/**
 * Omit keys from object
 */
export function omit<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> {
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result;
}
