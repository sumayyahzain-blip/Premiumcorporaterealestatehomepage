/**
 * GRADE A REALTY - Search Filters Component
 * Advanced property search filters
 * Phase 1 Implementation
 */

import React, { useState, useEffect } from 'react';
import {
    Search,
    SlidersHorizontal,
    X,
    ChevronDown,
    MapPin,
    DollarSign,
    BedDouble,
    Bath,
    Home,
    Building,
    Building2,
    Store,
    Mountain,
} from 'lucide-react';
import { usePropertyFilters } from '../../store';
import {
    PROPERTY_TYPES,
    LISTING_TYPES,
    PROPERTY_SORT_OPTIONS,
    US_STATES,
} from '../../utils/constants';
import { formatCurrency, debounce } from '../../utils';

interface SearchFiltersProps {
    variant?: 'horizontal' | 'sidebar';
    showAdvanced?: boolean;
    onSearch?: () => void;
}

const PRICE_RANGES = [
    { min: 0, max: 100000, label: 'Under $100K' },
    { min: 100000, max: 250000, label: '$100K - $250K' },
    { min: 250000, max: 500000, label: '$250K - $500K' },
    { min: 500000, max: 750000, label: '$500K - $750K' },
    { min: 750000, max: 1000000, label: '$750K - $1M' },
    { min: 1000000, max: 2000000, label: '$1M - $2M' },
    { min: 2000000, max: null, label: '$2M+' },
];

const BEDROOM_OPTIONS = ['Any', '1+', '2+', '3+', '4+', '5+'];
const BATHROOM_OPTIONS = ['Any', '1+', '2+', '3+', '4+'];

const PROPERTY_TYPE_ICONS: Record<string, React.ReactNode> = {
    house: <Home className="w-4 h-4" />,
    apartment: <Building className="w-4 h-4" />,
    condo: <Building2 className="w-4 h-4" />,
    townhouse: <Building className="w-4 h-4" />,
    commercial: <Store className="w-4 h-4" />,
    land: <Mountain className="w-4 h-4" />,
};

export default function SearchFilters({
    variant = 'horizontal',
    showAdvanced = true,
    onSearch,
}: SearchFiltersProps) {
    const { filters, setFilters, resetFilters } = usePropertyFilters();
    const [isExpanded, setIsExpanded] = useState(false);
    const [localSearch, setLocalSearch] = useState(filters.query || '');

    // Debounced search
    const debouncedSetSearch = debounce((value: string) => {
        setFilters({ query: value });
        onSearch?.();
    }, 300);

    useEffect(() => {
        debouncedSetSearch(localSearch);
    }, [localSearch]);

    const handlePriceRangeSelect = (min: number, max: number | null) => {
        setFilters({ priceMin: min, priceMax: max || undefined });
        onSearch?.();
    };

    const handleBedroomSelect = (option: string) => {
        const value = option === 'Any' ? undefined : parseInt(option);
        setFilters({ bedroomsMin: value });
        onSearch?.();
    };

    const handleBathroomSelect = (option: string) => {
        const value = option === 'Any' ? undefined : parseInt(option);
        setFilters({ bathroomsMin: value });
        onSearch?.();
    };

    const handlePropertyTypeToggle = (type: string) => {
        const current = filters.propertyTypes || [];
        const updated = current.includes(type)
            ? current.filter((t) => t !== type)
            : [...current, type];
        setFilters({ propertyTypes: updated.length > 0 ? updated : undefined });
        onSearch?.();
    };

    const handleReset = () => {
        resetFilters();
        setLocalSearch('');
        onSearch?.();
    };

    const activeFilterCount = [
        filters.query,
        filters.priceMin || filters.priceMax,
        filters.bedroomsMin,
        filters.bathroomsMin,
        filters.propertyTypes?.length,
        filters.listingType,
        filters.state,
    ].filter(Boolean).length;

    // Horizontal variant (for pages)
    if (variant === 'horizontal') {
        return (
            <div className="space-y-4">
                {/* Main Search Bar */}
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            placeholder="Search by location, address, or keyword..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                        />
                    </div>

                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`px-5 py-3.5 rounded-xl border font-medium transition-all flex items-center gap-2 ${isExpanded || activeFilterCount > 0
                                ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                            }`}
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="ml-1 w-5 h-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {activeFilterCount > 0 && (
                        <button
                            onClick={handleReset}
                            className="px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/30 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-3">
                    {/* Listing Type */}
                    <div className="flex bg-white/5 rounded-lg p-1">
                        {LISTING_TYPES.map((type) => (
                            <button
                                key={type.value}
                                onClick={() => {
                                    setFilters({ listingType: filters.listingType === type.value ? undefined : type.value });
                                    onSearch?.();
                                }}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filters.listingType === type.value
                                        ? 'bg-amber-500 text-white'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <select
                        value={filters.sortBy || 'date_desc'}
                        onChange={(e) => {
                            setFilters({ sortBy: e.target.value });
                            onSearch?.();
                        }}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    >
                        {PROPERTY_SORT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Expanded Filters */}
                {isExpanded && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-6">
                        {/* Property Types */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Property Type
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {PROPERTY_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => handlePropertyTypeToggle(type.value)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${filters.propertyTypes?.includes(type.value)
                                                ? 'bg-amber-500 text-white'
                                                : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                            }`}
                                    >
                                        {PROPERTY_TYPE_ICONS[type.value]}
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Price Range
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.priceMin || ''}
                                            onChange={(e) => {
                                                setFilters({ priceMin: e.target.value ? Number(e.target.value) : undefined });
                                                onSearch?.();
                                            }}
                                            className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        />
                                    </div>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.priceMax || ''}
                                            onChange={(e) => {
                                                setFilters({ priceMax: e.target.value ? Number(e.target.value) : undefined });
                                                onSearch?.();
                                            }}
                                            className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bedrooms */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Bedrooms
                                </label>
                                <div className="flex gap-1">
                                    {BEDROOM_OPTIONS.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => handleBedroomSelect(option)}
                                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${(option === 'Any' && !filters.bedroomsMin) ||
                                                    (option !== 'Any' && filters.bedroomsMin === parseInt(option))
                                                    ? 'bg-amber-500 text-white'
                                                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Bathrooms */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Bathrooms
                                </label>
                                <div className="flex gap-1">
                                    {BATHROOM_OPTIONS.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => handleBathroomSelect(option)}
                                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${(option === 'Any' && !filters.bathroomsMin) ||
                                                    (option !== 'Any' && filters.bathroomsMin === parseInt(option))
                                                    ? 'bg-amber-500 text-white'
                                                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    City
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Any city"
                                        value={filters.city || ''}
                                        onChange={(e) => {
                                            setFilters({ city: e.target.value || undefined });
                                            onSearch?.();
                                        }}
                                        className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    State
                                </label>
                                <select
                                    value={filters.state || ''}
                                    onChange={(e) => {
                                        setFilters({ state: e.target.value || undefined });
                                        onSearch?.();
                                    }}
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                >
                                    <option value="">Any State</option>
                                    {US_STATES.map((state) => (
                                        <option key={state.value} value={state.value}>
                                            {state.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Square Feet */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Square Feet
                            </label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="number"
                                    placeholder="Min sqft"
                                    value={filters.sqftMin || ''}
                                    onChange={(e) => {
                                        setFilters({ sqftMin: e.target.value ? Number(e.target.value) : undefined });
                                        onSearch?.();
                                    }}
                                    className="w-32 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                    type="number"
                                    placeholder="Max sqft"
                                    value={filters.sqftMax || ''}
                                    onChange={(e) => {
                                        setFilters({ sqftMax: e.target.value ? Number(e.target.value) : undefined });
                                        onSearch?.();
                                    }}
                                    className="w-32 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between pt-4 border-t border-white/10">
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Reset All
                            </button>
                            <button
                                onClick={() => {
                                    onSearch?.();
                                    setIsExpanded(false);
                                }}
                                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Sidebar variant would go here...
    return null;
}
