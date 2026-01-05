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
        const fallbackImages = [
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
        ];

        let validImages = p.images?.map(img => img.url) || [];

        // Handle legacy primaryImageUrl
        if (validImages.length === 0 && (p as any).primaryImageUrl) {
            validImages = [(p as any).primaryImageUrl];
        }

        // Pad with fallbacks if needed to ensure we have enough for the grid (5 images)
        if (validImages.length < 5) {
            return [...validImages, ...fallbackImages.slice(0, 5 - validImages.length)];
        }

        return validImages;
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

    // Mock Amenities and Schools if not present
    const amenities = property.amenities && property.amenities.length > 0 ? property.amenities : [
        'Central Air', 'Hardwood Floors', 'Dishwasher', 'Washer/Dryer', 'Garage Parking', 'Swimming Pool', 'Smart Home', 'Fireplace'
    ];

    const schools = [
        { name: 'Lincoln Elementary', type: 'Public', grade: 'K-5', rating: 9 },
        { name: 'Washington Middle', type: 'Public', grade: '6-8', rating: 8 },
        { name: 'Roosevelt High', type: 'Public', grade: '9-12', rating: 9 },
    ];

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

                    {/* World Class Bento Grid Gallery */}
                    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[550px] rounded-[2rem] overflow-hidden">
                        {/* Main Hero Image */}
                        <div
                            onClick={() => console.log("Open Full Screen Gallery")}
                            className="col-span-2 row-span-2 relative group cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
                            <img
                                src={images[0]}
                                alt={property.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        {/* Side Quads */}
                        {images.slice(1, 5).map((img, idx) => (
                            <div
                                key={idx}
                                onClick={() => console.log("Open Full Screen Gallery")}
                                className="relative group cursor-pointer overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
                                <img
                                    src={img}
                                    alt={`View ${idx + 2}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {idx === 3 && (
                                    <button className="absolute bottom-4 right-4 z-20 bg-white hover:bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg transition-all flex items-center gap-2">
                                        <Maximize size={16} />
                                        Show all photos
                                    </button>
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
                    {/* Left Content (66%) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About Section */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Property</h2>
                            <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed">
                                <p>{property.description}</p>
                            </div>
                        </div>

                        {/* Amenities Section */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                                {amenities.map((amenity, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-gray-700">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

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

                        {/* Schools Section (Mock) */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Schools</h2>
                            <div className="space-y-4">
                                {schools.map((school, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <div className="font-bold text-gray-900">{school.name}</div>
                                            <div className="text-sm text-gray-500">{school.type} • Grades {school.grade}</div>
                                        </div>
                                        <div className="bg-white px-3 py-1 rounded-lg border border-gray-200 font-bold text-gray-900 shadow-sm">
                                            {school.rating}/10
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map Section */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
                            <PropertyMap
                                latitude={property.latitude}
                                longitude={property.longitude}
                                address={`${property.addressLine1 || ''}, ${property.city || ''}`}
                                price={property.listingType === 'rent' ? property.rentPrice : property.salePrice}
                                status={property.status}
                            />
                        </div>
                    </div>

                    {/* Right Sidebar - Sticky Agent Card (33%) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 sticky top-24">

                            {/* Agent Header */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
                                        alt="Agent Sarah"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Sarah Johnson</h3>
                                    <p className="text-emerald-600 font-medium text-sm">Premier Agent</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className="flex text-amber-400 text-xs">★★★★★</div>
                                        <span className="text-xs text-gray-500">(128 reviews)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Call to Action */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Schedule a Tour</h4>
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {['Today', 'Tomorrow', 'Weekend'].map((day) => (
                                        <button key={day} className="px-2 py-2 text-sm border border-gray-200 rounded-lg hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all text-center">
                                            {day}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 text-gray-900 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Primary Actions */}
                            <div className="space-y-3">
                                <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl">
                                    Request Info
                                </button>
                                <button className="w-full bg-white border border-slate-900 text-slate-900 hover:bg-gray-50 font-bold py-3.5 rounded-xl transition-all">
                                    Message Agent
                                </button>
                            </div>

                            {/* Micro-text security */}
                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-400">
                                    By clicking request, you agree to our Terms.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
