/**
 * GRADE A REALTY - Premium Property Card Component
 * Enhanced property card with multiple variants for dashboard/listings
 * Phase 1 Implementation
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
    Heart,
    BedDouble,
    Bath,
    Ruler,
    MapPin,
    Building2,
    Eye,
    Calendar,
} from 'lucide-react';
import { formatCurrency, formatSquareFeet, formatRelativeTime } from '../../utils';
import { showSuccessToast } from '../../store';

interface PremiumPropertyCardProps {
    id: string;
    title: string;
    addressLine1: string;
    city: string;
    state: string;
    listingType: 'sale' | 'rent' | 'both';
    salePrice?: number;
    rentPrice?: number;
    rentPeriod?: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    propertyType: string;
    imageUrl?: string;
    isFavorite?: boolean;
    status?: string;
    createdAt?: string;
    viewCount?: number;
    onFavoriteToggle?: (id: string) => void;
    variant?: 'default' | 'compact' | 'horizontal';
}

export default function PremiumPropertyCard({
    id,
    title,
    addressLine1,
    city,
    state,
    listingType,
    salePrice,
    rentPrice,
    rentPeriod = 'mo',
    bedrooms,
    bathrooms,
    squareFeet,
    propertyType,
    imageUrl,
    isFavorite = false,
    status,
    createdAt,
    viewCount,
    onFavoriteToggle,
    variant = 'default',
}: PremiumPropertyCardProps) {
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (onFavoriteToggle) {
            onFavoriteToggle(id);
        } else {
            showSuccessToast(
                isFavorite ? 'Removed from favorites' : 'Added to favorites',
                title
            );
        }
    };

    const displayPrice = listingType === 'rent' && rentPrice
        ? `${formatCurrency(rentPrice)}/${rentPeriod}`
        : salePrice
            ? formatCurrency(salePrice)
            : 'Price on request';

    const getStatusBadge = () => {
        if (!status) return null;

        const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
            active: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Active' },
            pending_approval: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Pending' },
            under_contract: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Under Contract' },
            sold: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Sold' },
            rented: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Rented' },
            draft: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Draft' },
        };

        const config = statusConfig[status] || statusConfig.draft;

        return (
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    // Default card layout
    if (variant === 'default') {
        return (
            <Link
                to={`/property/${id}`}
                className="group block bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10"
            >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                            <Building2 className="w-12 h-12 text-gray-600" />
                        </div>
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                        <div className="flex gap-2">
                            {/* Listing Type Badge */}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${listingType === 'rent'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-amber-500 text-white'
                                }`}>
                                {listingType === 'rent' ? 'For Rent' : 'For Sale'}
                            </span>
                            {getStatusBadge()}
                        </div>

                        {/* Favorite Button */}
                        <button
                            onClick={handleFavoriteClick}
                            className={`p-2 rounded-full backdrop-blur-sm transition-all ${isFavorite
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white/20 text-white hover:bg-white/40'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-3 left-3">
                        <div className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg">
                            <span className="text-white font-bold text-lg">{displayPrice}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Title */}
                    <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                        {title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{city}, {state}</span>
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-gray-300 text-sm">
                        <div className="flex items-center gap-1">
                            <BedDouble className="w-4 h-4 text-gray-500" />
                            <span>{bedrooms} bed</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4 text-gray-500" />
                            <span>{bathrooms} bath</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Ruler className="w-4 h-4 text-gray-500" />
                            <span>{formatSquareFeet(squareFeet)}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    {(createdAt || viewCount !== undefined) && (
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-xs text-gray-500">
                            {createdAt && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatRelativeTime(createdAt)}</span>
                                </div>
                            )}
                            {viewCount !== undefined && (
                                <div className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    <span>{viewCount} views</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Link>
        );
    }

    // Compact variant
    if (variant === 'compact') {
        return (
            <Link
                to={`/property/${id}`}
                className="group flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-amber-500/50 transition-all"
            >
                {/* Thumbnail */}
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                    {imageUrl ? (
                        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-gray-600" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
                        {title}
                    </h4>
                    <p className="text-gray-400 text-xs line-clamp-1">{city}, {state}</p>
                    <p className="text-amber-400 font-semibold text-sm mt-1">{displayPrice}</p>
                </div>

                {/* Quick Stats */}
                <div className="text-right">
                    <span className="text-gray-400 text-xs">{bedrooms}bd • {bathrooms}ba</span>
                </div>
            </Link>
        );
    }

    // Horizontal variant
    if (variant === 'horizontal') {
        return (
            <Link
                to={`/property/${id}`}
                className="group flex gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-amber-500/50 transition-all"
            >
                {/* Image */}
                <div className="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    {imageUrl ? (
                        <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-gray-600" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between gap-2">
                            <h4 className="text-white font-semibold line-clamp-1 group-hover:text-amber-400 transition-colors">
                                {title}
                            </h4>
                            {getStatusBadge()}
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{addressLine1}, {city}, {state}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-gray-300 text-sm">
                            <span>{bedrooms} bed</span>
                            <span>{bathrooms} bath</span>
                            <span>{formatSquareFeet(squareFeet)}</span>
                        </div>
                        <span className="text-amber-400 font-bold text-lg">{displayPrice}</span>
                    </div>
                </div>

                {/* Favorite */}
                <button
                    onClick={handleFavoriteClick}
                    className={`self-start p-2 rounded-lg transition-all ${isFavorite
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-white/10 text-gray-400 hover:bg-white/20'
                        }`}
                >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
            </Link>
        );
    }

    return null;
}
