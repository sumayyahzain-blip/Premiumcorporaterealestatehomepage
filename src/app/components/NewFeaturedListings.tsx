/**
 * GRADE A REALTY - Featured Listings Component
 * Phase 2 Implementation (Connected to API)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Loader2 } from 'lucide-react';
import { showSuccessToast } from './ToastContainer';
import { api } from '../../services/api';
import type { Property } from '../../types';

const ITEMS_PER_PAGE = 6;

const RECCOMENDATION_TABS = [
    { id: 'all', label: 'All Properties' },
    { id: 'sale', label: 'For Sale' },
    { id: 'rent', label: 'For Rent' },
    { id: 'new', label: 'New Listings' },
    { id: 'luxury', label: 'Luxury' },
];

export default function NewFeaturedListings() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');

    // Server State
    const [listings, setListings] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // Local State
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        let ismounted = true;

        const fetchProperties = async () => {
            setLoading(true);
            try {
                // Map tabs to API filters
                const filters: any = {
                    page: currentPage,
                    pageSize: ITEMS_PER_PAGE,
                };

                switch (activeTab) {
                    case 'sale':
                        filters.listingType = 'sale';
                        break;
                    case 'rent':
                        filters.listingType = 'rent';
                        break;
                    case 'new':
                        filters.sortBy = 'date_desc';
                        break;
                    case 'luxury':
                        filters.minPrice = 1000000; // Arbitrary luxury threshold
                        break;
                    default:
                        // 'all' - no specific filter
                        break;
                }

                const response = await api.properties.list(filters);

                if (ismounted) {
                    if (response.success && response.data) {
                        setListings(response.data.data); // data.data is the array in PaginatedResponse
                        setTotalItems(response.data.pagination.totalItems);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch properties", err);
            } finally {
                if (ismounted) setLoading(false);
            }
        };

        fetchProperties();

        return () => { ismounted = false; };
    }, [activeTab, currentPage]);

    // Reset page when tab changes
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setCurrentPage(1);
    };

    const handleViewDetails = (listingId: string) => {
        navigate(`/property/${listingId}`);
    };

    const handleViewAll = () => {
        if (activeTab === 'rent') {
            navigate('/rent');
        } else {
            navigate('/buy');
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(p => p - 1);
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        if (currentPage < totalPages) setCurrentPage(p => p + 1);
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    const toggleFavorite = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (favorites.includes(id)) {
            setFavorites(favorites.filter(f => f !== id));
        } else {
            setFavorites([...favorites, id]);
            showSuccessToast('Saved', 'Property added to favorites');
        }
    };

    // Helper to format currency
    const formatPrice = (p: Property) => {
        const price = p.listingType === 'sale' ? p.salePrice : p.rentPrice;
        if (!price) return 'Price on Request';

        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(price);

        return p.listingType === 'rent' ? `${formatted}/mo` : formatted;
    };

    // Helper to derive tag
    const getTag = (p: Property) => {
        if (p.listingType === 'rent') return { text: 'For Rent', color: 'from-blue-400 to-indigo-500' };
        if (p.status === 'sold') return { text: 'Sold', color: 'from-gray-400 to-gray-500' };
        return { text: 'For Sale', color: 'from-amber-400 to-orange-500' };
    };

    // Helper to get image
    const getImage = (p: Property) => {
        // Fallback or use PropertyImage if available
        // Use primaryImageUrl from mock data (injected via any) or fallback
        return (p as any).primaryImageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';
    };

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return (
        <section id="listings" className="py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                        Our Properties
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Featured Listings
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Explore our handpicked selection of premium properties that define luxury living
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {RECCOMENDATION_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                        <Loader2 size={48} className="animate-spin mb-4 text-amber-500" />
                        <p className="text-lg">Finding your dream home...</p>
                    </div>
                ) : (
                    <>
                        {/* Results count */}
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-slate-600">
                                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} properties
                            </p>
                        </div>

                        {/* Listings Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
                            {listings.map((listing) => {
                                const tag = getTag(listing);
                                return (
                                    <div
                                        key={listing.id}
                                        className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
                                    >
                                        {/* Image */}
                                        <div className="relative h-56 overflow-hidden flex-shrink-0">
                                            <img
                                                src={getImage(listing)}
                                                alt={listing.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            {/* Tag */}
                                            <div className={`absolute top-4 left-4 bg-gradient-to-r ${tag.color} text-white text-xs font-bold px-3 py-1.5 rounded-full`}>
                                                {tag.text}
                                            </div>

                                            {/* Favorite button */}
                                            <button
                                                onClick={(e) => toggleFavorite(listing.id, e)}
                                                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                                            >
                                                <Heart
                                                    size={20}
                                                    className={`transition-colors ${favorites.includes(listing.id)
                                                        ? 'fill-rose-500 text-rose-500'
                                                        : 'text-rose-500'
                                                        }`}
                                                />
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-grow">
                                            {/* Location */}
                                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                <span className="truncate">{listing.city}, {listing.state}</span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-1">
                                                {listing.title}
                                            </h3>

                                            {/* Details */}
                                            <div className="flex items-center gap-4 text-slate-600 text-sm mb-4">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                    </svg>
                                                    <span>{listing.bedrooms} Beds</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                                    </svg>
                                                    <span>{listing.bathrooms} Baths</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                                    </svg>
                                                    <span>{listing.squareFeet} sqft</span>
                                                </div>
                                            </div>

                                            {/* Price and Button */}
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                                <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                                                    {formatPrice(listing)}
                                                </div>
                                                <button
                                                    onClick={() => handleViewDetails(listing.id)}
                                                    className="bg-slate-900 hover:bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                >
                                    <ChevronLeft size={18} />
                                    Previous
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageClick(page)}
                                            className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === page
                                                ? 'bg-slate-900 text-white shadow-lg'
                                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all ${currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                >
                                    Next
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* View All Button */}
                <div className="text-center mt-12">
                    <button
                        onClick={handleViewAll}
                        className="inline-flex items-center gap-2 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-4 rounded-full font-bold transition-all duration-300"
                    >
                        View All Properties
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
