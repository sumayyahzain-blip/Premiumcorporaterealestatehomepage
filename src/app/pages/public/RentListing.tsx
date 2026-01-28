import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyCard } from '../../components/PropertyCard';
import MapEngine from '../../components/MapEngine';
import { ChevronDown, Search, Grid3X3, List, Loader2, AlertCircle, Map as MapIcon, X } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import type { Property } from '../../../types';

export default function RentListing() {
    const navigate = useNavigate();
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [showMap, setShowMap] = useState(true);
    const [listingType, setListingType] = useState<'sale' | 'rent'>('rent'); // Default to Rent

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
                const { data, error } = await supabase
                    .from('properties')
                    .select('*')
                    .eq('listing_type', listingType);

                if (error) {
                    console.error('Supabase Error:', error);
                    throw error;
                }

                if (data) {
                    const mappedProperties: any[] = data.map(p => ({
                        id: p.id,
                        title: p.title,
                        salePrice: p.price,
                        rentPrice: p.price,
                        addressLine1: p.address,
                        city: '',
                        state: '',
                        postalCode: '',
                        bedrooms: p.beds,
                        bathrooms: p.baths,
                        squareFeet: p.sqft,
                        listingType: p.listing_type,
                        listing_type: p.listing_type,
                        propertyType: 'house',
                        status: p.status,
                        latitude: p.latitude,
                        longitude: p.longitude,
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
    }, [listingType]);

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

    const filteredProperties = properties.filter(p => {
        if (!activeQuery) return true;
        const q = activeQuery.toLowerCase();
        return (
            p.title?.toLowerCase().includes(q) ||
            (p.addressLine1?.toLowerCase().includes(q))
        );
    }).sort((a, b) => {
        if (a.status === 'sold' && b.status !== 'sold') return 1;
        if (a.status !== 'sold' && b.status === 'sold') return -1;
        return 0;
    });

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
        <div className="pt-24 pb-12 min-h-screen bg-[#0f172a] font-sans relative overflow-hidden">
            {/* Premium Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none"></div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 relative z-10">
                {/* Header & Hero Search */}
                <div className="flex flex-col items-center justify-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">Find your next rental home</h1>

                    {/* Buy / Rent Toggle */}
                    <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-full mb-6 border border-white/20">
                        <button
                            onClick={() => setListingType('sale')}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${listingType === 'sale'
                                ? 'bg-[#D4AF37] text-white shadow-md transform scale-105'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            Buy
                        </button>
                        <button
                            onClick={() => setListingType('rent')}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${listingType === 'rent'
                                ? 'bg-[#D4AF37] text-white shadow-md transform scale-105'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            Rent
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-full shadow-2xl border border-white/20 p-2 flex items-center transition-shadow hover:shadow-[0_0_40px_rgba(212,175,55,0.2)]">
                        <div className="flex-1 px-6 border-r border-white/20">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</label>
                            <input
                                type="text"
                                placeholder="City, Zip, or Address"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full text-white placeholder-gray-500 font-medium focus:outline-none bg-transparent text-lg truncate"
                            />
                        </div>

                        <div className="w-48 px-6 relative">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Type</label>
                            <div className="relative">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full text-white font-medium appearance-none bg-transparent focus:outline-none cursor-pointer text-lg pr-8"
                                >
                                    <option value="All Types" className="bg-[#0f172a]">All Types</option>
                                    <option value="House" className="bg-[#0f172a]">House</option>
                                    <option value="Condo" className="bg-[#0f172a]">Condo</option>
                                    <option value="Land" className="bg-[#0f172a]">Land</option>
                                </select>
                                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSearch}
                            className="bg-[#D4AF37] text-white p-3 rounded-full hover:bg-[#b5952f] transition shadow-lg cursor-pointer flex-shrink-0"
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
                        <p className="text-gray-400 font-medium">
                            {filteredProperties.length} results
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowMap(!showMap)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${showMap
                                    ? 'bg-[#D4AF37] text-white shadow-md'
                                    : 'bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 hover:bg-white/20'
                                    }`}
                            >
                                <MapIcon size={18} />
                                <span className="hidden sm:inline">{showMap ? 'Hide Map' : 'Show Map'}</span>
                            </button>

                            <div className="flex bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-1 shadow-sm">
                                <button
                                    onClick={() => setView('grid')}
                                    className={`p-2 rounded-md transition-all ${view === 'grid' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <Grid3X3 size={20} />
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className={`p-2 rounded-md transition-all ${view === 'list' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RESULTS CONTENT AREA */}
                    <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
                        {/* LEFT: Property List */}
                        <div className={`transition-all duration-300 ${showMap ? 'lg:w-3/5' : 'w-full'}`}>
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                                    <Loader2 size={48} className="animate-spin mb-4 text-[#D4AF37]" />
                                    <p className="text-lg text-white">Loading Properties...</p>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center h-96 text-gray-400 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                                    <AlertCircle size={48} className="mb-4 text-red-400" />
                                    <h3 className="text-xl font-semibold text-white mb-2">Failed to load properties</h3>
                                    <p className="max-w-md text-center mb-6 text-gray-400">{error}</p>
                                </div>
                            ) : (
                                <>
                                    <div className={`grid ${view === 'grid'
                                        ? showMap ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                                        : 'grid-cols-1'
                                        } gap-6`}>
                                        {filteredProperties.map((property) => (
                                            <div key={property.id} className="relative group">
                                                <PropertyCard
                                                    type={listingType === 'sale' ? 'buy' : 'rent'}
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
                                        <div className="col-span-full py-24 text-center text-gray-400 flex flex-col items-center justify-center">
                                            <div className="mb-6">
                                                <Search size={48} className="text-gray-600 mx-auto" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">No homes found</h3>
                                            <button
                                                onClick={resetFilters}
                                                className="px-8 py-3 bg-[#D4AF37] text-white font-semibold rounded-lg hover:bg-[#b5952f] transition-colors shadow-lg mt-4"
                                            >
                                                Clear Filters
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* RIGHT: Sticky Map Engine */}
                        {showMap && (
                            <div className="hidden lg:block lg:w-2/5 h-[calc(100vh-140px)] sticky top-24 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                                <MapEngine
                                    properties={filteredProperties}
                                    className="h-full w-full"
                                    center={[40.7128, -74.0060]}
                                    zoom={12}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}