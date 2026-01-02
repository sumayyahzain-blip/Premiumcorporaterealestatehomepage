
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyCard } from '../../components/PropertyCard';
import { Filter, ChevronDown, Map, List, Grid3X3, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';
import type { Property } from '../../../types';

export default function BuyListing() {
    const navigate = useNavigate();
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    useEffect(() => {
        let ismounted = true;

        const fetchProperties = async () => {
            setLoading(true);
            try {
                const response = await api.properties.list({
                    listingType: 'sale',
                    page: currentPage,
                    pageSize: ITEMS_PER_PAGE
                });

                if (ismounted && response.success && response.data) {
                    setProperties(response.data.data);
                    setTotalItems(response.data.pagination.totalItems);
                }
            } catch (error) {
                console.error('Failed to fetch properties', error);
            } finally {
                if (ismounted) setLoading(false);
            }
        };

        fetchProperties();

        return () => { ismounted = false; };
    }, [currentPage]);

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

    return (
        <div className="pt-24 pb-12 min-h-screen bg-gray-50">
            <div className="max-w-[1440px] mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Homes for Sale</h1>
                        <p className="text-gray-500 mt-1">
                            {loading ? 'Loading...' : `${totalItems} properties available`}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                        {/* Sort/Layout controls remain static for now */}
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                            <span className="text-sm font-medium">Sort: Recommended</span>
                            <ChevronDown size={16} />
                        </button>
                        <div className="flex bg-white border border-gray-200 rounded-lg p-1">
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
                        <button className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 md:hidden">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar Filter (Static for now) */}
                    <div className="hidden md:block w-72 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-28">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900">Filters</h3>
                                <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Clear All</button>
                            </div>

                            {/* Location */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                <div className="relative">
                                    <Map size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="City, State, or ZIP"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Min" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
                                    <input type="text" placeholder="Max" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
                                </div>
                            </div>

                            {/* Bedrooms */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                                <div className="flex gap-2">
                                    {['Any', '1+', '2+', '3+', '4+'].map((opt, i) => (
                                        <button key={i} className={`flex-1 py-1.5 text-sm border rounded-md hover:border-emerald-500 hover:text-emerald-600 ${i === 2 ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-medium' : 'border-gray-200 text-gray-600'}`}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Property Type */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Property Type</label>
                                <div className="space-y-2.5">
                                    {['Single Family', 'Condo', 'Townhouse', 'Multi-family'].map((type) => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                            <span className="text-gray-600 group-hover:text-gray-900">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors">
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                                <Loader2 size={48} className="animate-spin mb-4 text-emerald-500" />
                                <p className="text-lg">Loading properties...</p>
                            </div>
                        ) : (
                            <>
                                <div className={`grid ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                                    {properties.map((property) => (
                                        <PropertyCard
                                            key={property.id}
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
                                        />
                                    ))}
                                    {properties.length === 0 && (
                                        <div className="col-span-full py-12 text-center text-gray-500">
                                            No properties found matching your criteria.
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                {totalItems > ITEMS_PER_PAGE && (
                                    <div className="flex justify-center mt-12 gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <span className="flex items-center px-4 font-medium text-gray-900">
                                            Page {currentPage}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => p + 1)}
                                            disabled={currentPage * ITEMS_PER_PAGE >= totalItems}
                                            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Next
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
