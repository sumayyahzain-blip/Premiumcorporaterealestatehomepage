/**
 * GRADE A REALTY - Property Details Page
 * Phase 2 Implementation (Connected to API)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Share2, Heart, Calendar, TrendingUp, ArrowLeft, Home, Loader2, AlertCircle } from 'lucide-react';
import { showInfoToast, showSuccessToast } from '../../components/ToastContainer';
import { api } from '../../../services/api';
import type { Property } from '../../../types';
import PropertyMap from '../../components/ui/PropertyMap';

export default function PropertyDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // State
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI State
    const [isSaved, setIsSaved] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    // Fetch Property
    useEffect(() => {
        let ismounted = true;
        const fetchProperty = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);

            try {
                const response = await api.properties.get(id);
                if (ismounted) {
                    if (response.success && response.data) {
                        setProperty(response.data);
                    } else {
                        setError(response.error?.message || 'Property not found');
                    }
                }
            } catch (err) {
                if (ismounted) setError('Failed to load property details');
            } finally {
                if (ismounted) setLoading(false);
            }
        };

        fetchProperty();
        return () => { ismounted = false; };
    }, [id]);

    const handleShare = () => {
        navigator.clipboard?.writeText(window.location.href);
        showSuccessToast('Link Copied', 'Property link copied to clipboard!');
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
        if (!isSaved) {
            showSuccessToast('Saved', 'Property added to your saved list');
        } else {
            showInfoToast('Removed', 'Property removed from saved list');
        }
    };

    const handleScheduleViewing = (e: React.FormEvent) => {
        e.preventDefault();
        showSuccessToast('Request Sent', 'Your viewing request has been submitted. An agent will contact you soon.');
    };

    const handleContactAgent = () => {
        showInfoToast('Contact Agent', 'Opening contact options...');
    };

    // Helper functions
    const formatCurrency = (val: number | null | undefined) => {
        if (!val) return 'N/A';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    const getPrice = (p: Property) => {
        if (p.listingType === 'rent') return `${formatCurrency(p.rentPrice)}/mo`;
        return formatCurrency(p.salePrice);
    };

    const getImages = (p: Property) => {
        // Mock fallback images if none exist
        const fallbackImages = [
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
        ];

        // If property has images (from API), use them. 
        // Note: Property type in API mock currently has 'images' property in interface but mock data service didn't populate it fully in all cases.
        // We'll trust the interface.
        if (p.images && p.images.length > 0) {
            return p.images.map(img => img.url);
        }

        // If primaryImageUrl exists (legacy mock), put it first
        const primary = (p as any).primaryImageUrl;
        if (primary) {
            return [primary, ...fallbackImages.slice(1)];
        }

        return fallbackImages;
    };

    if (loading) {
        return (
            <div className="pt-24 pb-12 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin mx-auto mb-4 text-emerald-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Loading Property...</h2>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="pt-24 pb-12 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "We couldn't find the property you're looking for."}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const images = getImages(property);

    return (
        <div className="pt-24 pb-12 min-h-screen bg-gray-50">
            <div className="max-w-[1440px] mx-auto px-6">

                {/* Back Navigation */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to listings
                    </button>
                </div>

                {/* Header / Gallery */}
                <div className="space-y-6 mb-8">
                    {/* Title & Actions */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{getPrice(property)}</h1>
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin size={18} />
                                <span>{property.addressLine1}, {property.city}, {property.state} {property.postalCode}</span>
                            </div>
                            <h2 className="text-xl text-gray-700 mt-2">{property.title}</h2>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                            >
                                <Share2 size={18} />
                                Share
                            </button>
                            <button
                                onClick={handleSave}
                                className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${isSaved
                                    ? 'bg-red-50 border-red-200 text-red-600'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Heart size={18} className={isSaved ? 'fill-current' : ''} />
                                {isSaved ? 'Saved' : 'Save'}
                            </button>
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
                        {/* Main Large Image */}
                        <div className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group">
                            <img
                                src={images[activeImage]}
                                alt={property.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Side Images */}
                        {images.slice(1, 5).map((img, idx) => (
                            <div
                                key={idx}
                                onClick={() => setActiveImage(idx + 1)}
                                className="relative rounded-2xl overflow-hidden group hidden md:block cursor-pointer"
                            >
                                <img
                                    src={img}
                                    alt={`${property.title} - Image ${idx + 2}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                {idx === 3 && images.length > 5 && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/50 transition-colors">
                                        <span className="text-white font-semibold text-lg">+{images.length - 5} Photos</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Quick Stats Strip */}
                    <div className="flex flex-wrap gap-8 py-6 border-y border-gray-200">
                        <div className="flex items-center gap-2">
                            <Bed className="text-emerald-600" size={24} />
                            <div>
                                <span className="font-bold text-gray-900 block">{property.bedrooms} Beds</span>
                                <span className="text-sm text-gray-500">Bedroom</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Bath className="text-emerald-600" size={24} />
                            <div>
                                <span className="font-bold text-gray-900 block">{property.bathrooms} Baths</span>
                                <span className="text-sm text-gray-500">Bathroom</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Maximize className="text-emerald-600" size={24} />
                            <div>
                                <span className="font-bold text-gray-900 block">{property.squareFeet?.toLocaleString()} sqft</span>
                                <span className="text-sm text-gray-500">Living Area</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Home className="text-emerald-600" size={24} />
                            <div>
                                <span className="font-bold text-gray-900 block capitalize">{property.propertyType}</span>
                                <span className="text-sm text-gray-500">Property Type</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Investment Analysis */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <TrendingUp className="text-emerald-600" />
                                Investment Analysis
                            </h2>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-emerald-50 rounded-xl p-4">
                                    <div className="text-sm text-emerald-800 font-medium mb-1">Est. Annual Income</div>
                                    <div className="text-2xl font-bold text-emerald-900">{formatCurrency(property.estimatedAnnualIncome)}</div>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-4">
                                    <div className="text-sm text-emerald-800 font-medium mb-1">Cap Rate</div>
                                    <div className="text-2xl font-bold text-emerald-900">{property.capRate ? `${property.capRate}%` : 'N/A'}</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="text-sm text-gray-600 font-medium mb-1">ROI</div>
                                    <div className="text-2xl font-bold text-gray-900">{property.estimatedRoi ? `${property.estimatedRoi}%` : 'N/A'}</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="text-sm text-gray-600 font-medium mb-1">Monthly HOA</div>
                                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(property.hoaFees)}</div>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Property</h2>
                            <div className="prose prose-slate max-w-none text-gray-600">
                                <p>{property.description}</p>
                            </div>
                        </div>

                        {/* Map Section */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Location</h2>
                        <PropertyMap
                            latitude={property.latitude}
                            longitude={property.longitude}
                            address={`${property.addressLine1 || ''}, ${property.city || ''}`}
                            price={property.listingType === 'rent' ? property.rentPrice : property.salePrice}
                            status={property.status}
                        />
                    </div>

                    {/* Right Sidebar - Contact Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-28">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Schedule a Viewing</h3>

                            <form onSubmit={handleScheduleViewing} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input type="tel" placeholder="(555) 123-4567" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                                    <div className="relative">
                                        <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-500" />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                                    <textarea rows={4} placeholder="Tell us about your interests..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"></textarea>
                                </div>

                                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30">
                                    Schedule Viewing
                                </button>
                                <button
                                    type="button"
                                    onClick={handleContactAgent}
                                    className="w-full bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold py-3.5 rounded-xl transition-colors"
                                >
                                    Contact Agent
                                </button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full overflow-hidden flex items-center justify-center">
                                    <span className="text-emerald-600 font-bold text-lg">SJ</span>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">Sarah Johnson</div>
                                    <div className="text-sm text-gray-500">Licensed Agent</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
