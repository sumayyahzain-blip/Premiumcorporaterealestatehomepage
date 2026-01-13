
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useComparison } from '../../context/ComparisonContext';
import { ArrowLeft, Check, X, Bed, Bath, Maximize, AlertCircle } from 'lucide-react';
import type { Property } from '../../types';

export default function ComparePage() {
    const { selectedProperties, removeFromCompare, clearComparison } = useComparison();
    const navigate = useNavigate();

    // Helper to format currency
    const formatPrice = (p: Property) => {
        const val = p.listingType === 'rent' ? p.rentPrice : p.salePrice;
        if (!val) return 'N/A';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val) + (p.listingType === 'rent' ? '/mo' : '');
    };

    const getImage = (p: Property) => {
        return (p as any).primaryImageUrl || (p.images && p.images?.[0]?.url) || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';
    };

    if (selectedProperties.length === 0) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="text-blue-500" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">No Properties Selected</h1>
                    <p className="text-gray-500 mb-6">Select up to 3 properties from the listings page to compare them side-by-side.</p>
                    <button
                        onClick={() => navigate('/buy')}
                        className="bg-[#D4AF37] hover:bg-[#b5952f] text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105"
                    >
                        Browse Properties
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={24} className="text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Compare Properties</h1>
                            <p className="text-gray-500 mt-1">Comparing {selectedProperties.length} homes</p>
                        </div>
                    </div>
                    <button
                        onClick={clearComparison}
                        className="text-red-500 hover:text-red-700 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        Clear All
                    </button>
                </div>

                {/* Comparison Grid/Table */}
                <div className="overflow-x-auto pb-8">
                    <div className="min-w-[800px] bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">

                        {/* Table Header: Images & Titles */}
                        <div className="grid grid-cols-4 border-b border-gray-100 bg-gray-50/50">
                            <div className="p-6 flex items-end font-semibold text-gray-400 uppercase tracking-wider text-sm sticky left-0 bg-gray-50/50 backdrop-blur-sm z-10">
                                Feature
                            </div>
                            {selectedProperties.map((prop) => (
                                <div key={prop.id} className="p-6 relative group">
                                    <button
                                        onClick={() => removeFromCompare(prop.id)}
                                        className="absolute top-4 right-4 bg-white/90 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 z-10"
                                        title="Remove"
                                    >
                                        <X size={16} />
                                    </button>
                                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 shadow-md relative">
                                        <img
                                            src={getImage(prop)}
                                            alt={prop.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                            <p className="text-white font-bold text-lg">{formatPrice(prop)}</p>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 leading-tight mb-1">{prop.addressLine1}</h3>
                                    <p className="text-sm text-gray-500 capitalize">{prop.type || 'House'} • {prop.city || 'NY'}</p>

                                    <button
                                        onClick={() => navigate(`/property/${prop.id}`)}
                                        className="mt-4 w-full py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                            {/* Empty Slots */}
                            {[...Array(3 - selectedProperties.length)].map((_, i) => (
                                <div key={`empty-${i}`} className="p-6 flex items-center justify-center border-l border-dashed border-gray-200 bg-gray-50/30">
                                    <div className="text-center">
                                        <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <span className="text-gray-300 text-xl font-bold">+</span>
                                        </div>
                                        <p className="text-sm text-gray-400 font-medium">Add Property</p>
                                        <button
                                            onClick={() => navigate('/buy')}
                                            className="mt-2 text-xs text-[#D4AF37] hover:underline"
                                        >
                                            Browse Listings
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-gray-100">

                            {/* Key Stats Row */}
                            <div className="grid grid-cols-4 group hover:bg-slate-50 transition-colors">
                                <div className="p-5 text-gray-500 font-medium flex items-center gap-2">
                                    Status
                                </div>
                                {selectedProperties.map(p => (
                                    <div key={p.id} className="p-5 font-medium text-gray-900">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                                            {p.status || 'Active'}
                                        </span>
                                    </div>
                                ))}
                                {[...Array(3 - selectedProperties.length)].map((_, i) => <div key={i} className="p-5 border-l border-dashed border-gray-200"></div>)}
                            </div>

                            <div className="grid grid-cols-4 group hover:bg-slate-50 transition-colors">
                                <div className="p-5 text-gray-500 font-medium flex items-center gap-2">
                                    <Bed size={18} /> Bedrooms
                                </div>
                                {selectedProperties.map(p => (
                                    <div key={p.id} className="p-5 font-semibold text-gray-900">{p.bedrooms} Beds</div>
                                ))}
                                {[...Array(3 - selectedProperties.length)].map((_, i) => <div key={i} className="p-5 border-l border-dashed border-gray-200"></div>)}
                            </div>

                            <div className="grid grid-cols-4 group hover:bg-slate-50 transition-colors">
                                <div className="p-5 text-gray-500 font-medium flex items-center gap-2">
                                    <Bath size={18} /> Bathrooms
                                </div>
                                {selectedProperties.map(p => (
                                    <div key={p.id} className="p-5 font-semibold text-gray-900">{p.bathrooms} Baths</div>
                                ))}
                                {[...Array(3 - selectedProperties.length)].map((_, i) => <div key={i} className="p-5 border-l border-dashed border-gray-200"></div>)}
                            </div>

                            <div className="grid grid-cols-4 group hover:bg-slate-50 transition-colors">
                                <div className="p-5 text-gray-500 font-medium flex items-center gap-2">
                                    <Maximize size={18} /> Square Feet
                                </div>
                                {selectedProperties.map(p => (
                                    <div key={p.id} className="p-5 font-semibold text-gray-900">{p.squareFeet?.toLocaleString()} sqft</div>
                                ))}
                                {[...Array(3 - selectedProperties.length)].map((_, i) => <div key={i} className="p-5 border-l border-dashed border-gray-200"></div>)}
                            </div>

                            <div className="grid grid-cols-4 group hover:bg-slate-50 transition-colors">
                                <div className="p-5 text-gray-500 font-medium">Price per Sqft</div>
                                {selectedProperties.map(p => {
                                    const price = p.listingType === 'rent' ? p.rentPrice : p.salePrice;
                                    const pps = (price && p.squareFeet) ? Math.round(price / p.squareFeet) : null;
                                    return (
                                        <div key={p.id} className="p-5 text-gray-900">
                                            {pps ? `$${pps}` : 'N/A'}
                                        </div>
                                    )
                                })}
                                {[...Array(3 - selectedProperties.length)].map((_, i) => <div key={i} className="p-5 border-l border-dashed border-gray-200"></div>)}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
