
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyCard } from '../../components/PropertyCard';
import { ChevronDown, Search, Grid3X3, List, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import type { Property } from '../../../types';

export default function BuyListing() {
    const navigate = useNavigate();
    const [view, setView] = useState<'grid' | 'list'>('grid');

    // Data State
    const [properties, setProperties] = useState<Property[]>([]);

    // Loading & Error States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter Logic State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All Types');
    const [activeQuery, setActiveQuery] = useState('');

    // Fetch Properties from Supabase
    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            setError(null);

            try {
                // Query properties table (Simple Schema)
                const { data, error } = await supabase
                    .from('properties')
                    .select('*')
                    .eq('type', 'buy'); // Assuming 'buy' is the value for sale items

                if (error) {
                    console.error('Supabase Error:', error);
                    throw error;
                }

                if (data) {
                    // Map simple schema to Frontend Property type
                    const mappedProperties: any[] = data.map(p => ({
                        id: p.id,
                        title: p.title,
                        salePrice: p.price,
                        rentPrice: null,
                        addressLine1: p.address,
                        city: '', // Extracted from address if needed, or left blank
                        state: '',
                        postalCode: '',
                        bedrooms: p.beds,
                        bathrooms: p.baths,
                        squareFeet: p.sqft,
                        listingType: p.type,
                        propertyType: 'house', // Default
                        status: 'active',
                        primaryImageUrl: p.image_url,
                        images: [{ url: p.image_url, isPrimary: true }]
                    }));
                    setProperties(mappedProperties);
                }
            } catch (err: any) {
                console.error('Full connection error:', err);
                setError(err.message || 'Unknown error occurred while fetching properties');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    // Handlers
    const handleSearch = () => {
        setActiveQuery(searchQuery);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const resetFilters = () => {
        setSearchQuery('');
        setFilterType('All Types');
        setActiveQuery('');
    };

    // Client-side Filtering
    const filteredProperties = properties.filter(p => {
        if (!activeQuery) return true;
        const q = activeQuery.toLowerCase();
        // Check title or address
        return (
            p.title?.toLowerCase().includes(q) ||
            (p.addressLine1?.toLowerCase().includes(q))
        );
    });

    // Helpers
    const getImage = (p: Property) => {
        return (p as any).primaryImageUrl || (p.images && p.images[0]?.url) || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';
    };

    const formatPrice = (price: number | null | undefined) => {
        if (!price) return 'Price on Request';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
    };

    const getAddress = (p: Property) => {
        return p.addressLine1 || 'Address Hidden';
    };

    return (
        <div className="pt-24 pb-12 min-h-screen bg-gray-50 font-sans">
            <div className="max-w-[1440px] mx-auto px-6">
                {/* Header & Hero Search */}
                <div className="flex flex-col items-center justify-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">Find your next dream home</h1>

                    {/* Search Bar */}
                    <div className="w-full max-w-4xl bg-white rounded-full shadow-lg border border-gray-200 p-2 flex items-center transition-shadow hover:shadow-xl">
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
                            {filteredProperties.length} results
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
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                                <Loader2 size={48} className="animate-spin mb-4 text-blue-900" />
                                <p className="text-lg">Loading Properties...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-96 text-gray-500 bg-white rounded-xl border border-gray-200">
                                <AlertCircle size={48} className="mb-4 text-red-500" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load properties</h3>
                                <p className="max-w-md text-center mb-6">{error}</p>
                            </div>
                        ) : (
                            <>
                                <div className={`grid ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-8`}>
                                    {filteredProperties.map((property) => (
                                        <div key={property.id} className="relative group">
                                            <PropertyCard
                                                type="buy"
                                                image={getImage(property)}
                                                price={formatPrice(property.salePrice)}
                                                address={getAddress(property)}
                                                beds={property.bedrooms || 0}
                                                baths={property.bathrooms || 0}
                                                sqft={property.squareFeet || 0}
                                                className={view === 'list' ? 'flex flex-row' : ''}
                                                onClick={() => navigate(`/property/${property.id}`)}
                                                id={property.id}
                                                data={property}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {filteredProperties.length === 0 && !loading && (
                                    <div className="col-span-full py-24 text-center text-gray-500 flex flex-col items-center justify-center">
                                        <div className="mb-6">
                                            <Search size={48} className="text-gray-300 mx-auto" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No homes found</h3>
                                        <button
                                            onClick={resetFilters}
                                            className="px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-sm mt-4"
                                        >
                                            Clear Filters
                                        </button>
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
