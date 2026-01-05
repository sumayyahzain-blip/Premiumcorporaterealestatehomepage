import React from 'react';
import { X, Check, Bed, Bath, Maximize, Home } from 'lucide-react';
import { useComparison } from '../context/ComparisonContext';
import type { Property } from '../../types';

interface ComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ComparisonModal({ isOpen, onClose }: ComparisonModalProps) {
    const { selectedProperties } = useComparison();

    if (!isOpen) return null;

    // Helper to get price value for comparison
    const getPriceValue = (p: Property) => {
        return p.listingType === 'rent' ? (p.rentPrice || 0) : (p.salePrice || 0);
    };

    // Helper to format price
    const formatPrice = (p: Property) => {
        const price = getPriceValue(p);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(price) + (p.listingType === 'rent' ? '/mo' : '');
    };

    // Find Best Value Metrics
    const prices = selectedProperties.map(p => getPriceValue(p)).filter(v => v > 0);
    const minPrice = prices.length > 1 ? Math.min(...prices) : null;

    const sqfts = selectedProperties.map(p => p.squareFeet || 0).filter(v => v > 0);
    const maxSqFt = sqfts.length > 1 ? Math.max(...sqfts) : null;

    // Grid columns class based on number of properties
    // The requirement says "3 Columns (one for each house)", but if we have fewer, we might want to center them or still use 3 slots.
    // We'll use a flexible grid that handles up to 3.
    const gridCols = selectedProperties.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
        selectedProperties.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
            'grid-cols-1 md:grid-cols-3';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Compare Properties</h2>
                        <p className="text-gray-500 text-sm mt-1">Comparing {selectedProperties.length} select{selectedProperties.length !== 1 ? 'ions' : 'ion'}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Grid */}
                <div className={`p-6 grid gap-6 ${gridCols}`}>
                    {selectedProperties.map((property) => {
                        const priceVal = getPriceValue(property);
                        const isLowestPrice = minPrice !== null && priceVal === minPrice;
                        const isLargestSqFt = maxSqFt !== null && (property.squareFeet || 0) === maxSqFt;

                        return (
                            <div key={property.id} className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">

                                {/* Image */}
                                <div className="relative aspect-[16/9] bg-gray-100 group">
                                    <img
                                        src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80'}
                                        alt={property.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Status Badge */}
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded uppercase tracking-wide">
                                        {property.listingType}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1 divide-y divide-gray-100">

                                    {/* Price & Address */}
                                    <div className="pb-4">
                                        <div className={`text-2xl font-bold mb-1 ${isLowestPrice ? 'text-green-600' : 'text-gray-900'}`}>
                                            {formatPrice(property)}
                                            {isLowestPrice && <span className="ml-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wide align-middle inline-block">Best Price</span>}
                                        </div>
                                        <div className="text-gray-600 font-medium line-clamp-2 h-12">
                                            {property.addressLine1 ? (
                                                <>
                                                    {property.addressLine1}
                                                    <br />
                                                    <span className="text-gray-500 font-normal text-sm">
                                                        {property.city}, {property.state} {property.postalCode}
                                                    </span>
                                                </>
                                            ) : (
                                                property.title
                                            )}
                                        </div>
                                    </div>

                                    {/* Specs */}
                                    <div className="py-4 grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1 flex items-center gap-1">
                                                <Bed size={14} /> Beds
                                            </span>
                                            <span className="text-gray-900 font-semibold">{property.bedrooms || '-'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1 flex items-center gap-1">
                                                <Bath size={14} /> Baths
                                            </span>
                                            <span className="text-gray-900 font-semibold">{property.bathrooms || '-'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1 flex items-center gap-1">
                                                <Maximize size={14} /> Sq Ft
                                            </span>
                                            <span className={`font-semibold ${isLargestSqFt ? 'text-green-600' : 'text-gray-900'}`}>
                                                {property.squareFeet?.toLocaleString() || '-'}
                                            </span>
                                            {isLargestSqFt && <span className="text-[10px] text-green-600 font-medium">Largest</span>}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1 flex items-center gap-1">
                                                <Home size={14} /> Type
                                            </span>
                                            <span className="text-gray-900 font-semibold capitalize">{property.propertyType}</span>
                                        </div>
                                    </div>

                                    {/* Amenities / Description excerpt */}
                                    <div className="pt-4 mt-auto">
                                        <h4 className="text-xs text-gray-500 font-semibold uppercase mb-2">Highlights</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {property.amenities?.slice(0, 3).map(amenity => (
                                                <span key={amenity} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100">
                                                    {amenity}
                                                </span>
                                            ))}
                                            {(property.amenities?.length || 0) > 3 && (
                                                <span className="text-xs text-gray-400 px-1 py-1">+{(property.amenities?.length || 0) - 3} more</span>
                                            )}
                                            {(!property.amenities || property.amenities.length === 0) && (
                                                <span className="text-xs text-gray-400 italic">No specific highlights listed</span>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer (Empty for now, could have clear button) */}
                {selectedProperties.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No properties selected for comparison.
                    </div>
                )}
            </div>
        </div>
    );
}
