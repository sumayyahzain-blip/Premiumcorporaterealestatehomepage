import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyCard } from '../../components/PropertyCard';
import { ChevronDown, Search, Grid3X3, List, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../../../services/api';
import type { Property } from '../../../types';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';

export default function BuyListing() {
    const navigate = useNavigate();
    const [view, setView] = useState<'grid' | 'list'>('grid');

    // Data State
    const [properties, setProperties] = useState<Property[]>([]);

    // Pagination State
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 9;

    // Loading & Error States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter Logic State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All Types');

    // Applied Filters (to trigger search only on button click or explicit action if desired, 
    // but typically infinite scroll works best with a single 'active' filter state used by the fetcher)
    const [activeQuery, setActiveQuery] = useState('');
    const [activeType, setActiveType] = useState('All Types');

    const fetchProperties = useCallback(async (pageNum: number, isNewSearch: boolean = false) => {
        setLoading(true);
        if (isNewSearch) {
            setError(null);
        }

        try {
            // Map UI type to API propertyType
            let propTypeFilter: string[] | undefined = undefined;
            if (activeType !== 'All Types') {
                const map: Record<string, string> = { 'House': 'single_family', 'Condo': 'condo', 'Land': 'land' };
                if (map[activeType]) propTypeFilter = [map[activeType]];
            }

            const response = await api.properties.list({
                listingType: 'sale',
                page: pageNum,
                pageSize: pageSize,
                query: activeQuery || undefined,
                propertyType: propTypeFilter as any // Cast because mock client types might be strict
            });

            if (response.success && response.data) {
                const newItems = response.data.data;
                const pagination = response.data.pagination;

                if (isNewSearch) {
                    setProperties(newItems);
                } else {
                    setProperties(prev => [...prev, ...newItems]);
                }

                setHasMore(pagination.hasNext);
            } else {
                setError(response.error?.message || 'Failed to load properties');
            }
        } catch (err) {
            console.error('Failed to fetch properties', err);
            setError('An unexpected error occurred while loading properties.');
        } finally {
            setLoading(false);
        }
    }, [activeQuery, activeType]);

    // Initial Load & On Active Filter Change
    useEffect(() => {
        setPage(1);
        fetchProperties(1, true);
    }, [activeQuery, activeType, fetchProperties]);

    // Infinite Scroll Callback
    const loadMore = () => {
        if (!hasMore || loading) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProperties(nextPage, false);
    };

    const scrollRef = useInfiniteScroll(loadMore, hasMore, loading);

    // Handlers
    const handleSearch = () => {
        // Trigger fetch by updating active filters
        setActiveQuery(searchQuery);
        setActiveType(filterType);
        // Page reset is handled in the useEffect
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const resetFilters = () => {
        setSearchQuery('');
        setFilterType('All Types');
        setActiveQuery('');
        setActiveType('All Types');
    };

    // Helpers
    const getImage = (p: Property) => {
        return (p as any).primaryImageUrl || (p.images && p.images?.[0]?.url) || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';
    };

    const formatPrice = (price: number | null) => {
        if (!price) return 'Price on Request';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
    };

    const getAddress = (p: Property) => {
        return `${p.addressLine1 || ''}, ${p.city || ''}, ${p.state || ''} ${p.postalCode || ''}`;
    };

    const getStatusColor = (statusVal: string) => {
        const s = statusVal?.toLowerCase() || '';
        if (s === 'active' || s === 'for sale' || s === 'for rent') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        if (s === 'sold' || s === 'rented') return 'bg-red-100 text-red-800 border-red-200';
        if (s === 'pending') return 'bg-amber-100 text-amber-800 border-amber-200';
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const formatStatus = (s: string) => {
        if (!s) return '';
        return s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="pt-24 pb-12 min-h-screen bg-gray-50 font-sans">
            <div className="max-w-[1440px] mx-auto px-6">
                {/* Header & Hero Search */}
                <div className="flex flex-col items-center justify-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">Find your next dream home</h1>

                    {/* Zillow-Style Search Pill */}
                    <div className="w-full max-w-4xl bg-white rounded-full shadow-lg border border-gray-200 p-2 flex items-center transition-shadow hover:shadow-xl">

                        {/* Location Input Section */}
                        <div className="flex-1 px-6 border-r border-gray-200">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</label>
                            <input
                                type="text"
                                placeholder="City, Zip, or Address"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full text-gray-900 placeholder-gray-400 font-medium focus:outline-none bg-transparent text-lg truncate"
                            />
                        </div>

                        {/* Type Dropdown Section */}
                        <div className="w-48 px-6 relative">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Type</label>
                            <div className="relative">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full text-gray-900 font-medium appearance-none bg-transparent focus:outline-none cursor-pointer text-lg pr-8"
                                >
                                    <option value="All Types">All Types</option>
                                    <option value="House">House</option>
                                    <option value="Condo">Condo</option>
                                    <option value="Land">Land</option>
                                </select>
                                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        {/* Active Search Button */}
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="bg-blue-900 text-white p-3 rounded-full hover:bg-blue-800 transition shadow-lg cursor-pointer flex-shrink-0"
                            aria-label="Search"
                        >
                            <Search size={24} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col gap-8">

                    {/* Results Info & View Toggle */}
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500 font-medium">
                            {properties.length} results
                        </p>

                        <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                            <button
                                onClick={() => setView('grid')}
                                className={`p-2 rounded-md transition-all ${view === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Grid3X3 size={20} />
                            </button>
                            <button
                                onClick={() => setView('list')}
                                className={`p-2 rounded-md transition-all ${view === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>


                    {/* Results Grid */}
                    <div className="min-h-[500px]">
                        {loading && properties.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                                <Loader2 size={48} className="animate-spin mb-4 text-blue-900" />
                                <p className="text-lg">Loading properties...</p>
                            </div>
                        ) : error && properties.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-96 text-gray-500 bg-white rounded-xl border border-gray-200">
                                <AlertCircle size={48} className="mb-4 text-red-500" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load properties</h3>
                                <p className="max-w-md text-center mb-6">{error}</p>
                                <button
                                    onClick={() => fetchProperties(1, true)}
                                    className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={`grid ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-8`}>
                                    {properties.map((property) => (
                                        <div key={property.id} className="relative group">


                                            <PropertyCard
                                                type="buy"
                                                image={getImage(property)}
                                                price={formatPrice(property.salePrice)}
                                                address={getAddress(property)}
                                                beds={property.bedrooms || 0}
                                                baths={property.bathrooms || 0}
                                                sqft={property.squareFeet || 0}
                                                estRent={property.estimatedAnnualIncome ? formatPrice(property.estimatedAnnualIncome / 12) : undefined}
                                                capRate={property.capRate ? `${property.capRate}%` : undefined}
                                                className={view === 'list' ? 'flex flex-row' : ''}
                                                onClick={() => navigate(`/property/${property.id}`)}
                                                id={property.id}
                                                data={property}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Smart Empty State (Airbnb Standard) */}
                                {properties.length === 0 && !loading && (
                                    <div className="col-span-full py-24 text-center text-gray-500 flex flex-col items-center justify-center">
                                        <div className="mb-6">
                                            <Search size={48} className="text-gray-300 mx-auto" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {activeQuery ? `No homes found in "${activeQuery}"` : 'No homes found'}
                                        </h3>
                                        <p className="max-w-sm mx-auto text-gray-500 mb-8">
                                            We couldn't find any properties matching your search. Try checking your spelling or broadening your search.
                                        </p>
                                        <button
                                            onClick={resetFilters}
                                            className="px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                                        >
                                            Clear Filters & Show All
                                        </button>
                                    </div>
                                )}

                                {/* Loading Spinner / Infinite Scroll Trigger */}
                                {hasMore && (
                                    <div ref={scrollRef} className="py-12 flex justify-center">
                                        {loading ? (
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Loader2 size={24} className="animate-spin text-blue-900" />
                                                <span>Loading more homes...</span>
                                            </div>
                                        ) : (
                                            <div className="h-8" />
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
