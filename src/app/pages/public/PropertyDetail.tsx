
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Share2, Heart, TrendingUp, ArrowLeft, Home, Loader2, AlertCircle, MessageCircle } from 'lucide-react';
import { showInfoToast, showSuccessToast } from '../../components/ToastContainer';
import { supabase } from '../../../lib/supabaseClient';
import type { Property } from '../../../types';
import MapEngine from '../../components/MapEngine';
import { InvestmentCalculator } from '../../components/InvestmentCalculator';

import { useSupabaseAuth } from '../../../lib/AuthContext';

// Inside component
export default function PropertyDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useSupabaseAuth(); // Use new auth context

    // State
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI State
    const [isSaved, setIsSaved] = useState(false);

    // Check Saved Status
    useEffect(() => {
        let ismounted = true;
        const checkSaved = async () => {
            if (!user || !id) {
                if (ismounted) setIsSaved(false);
                return;
            }
            // Check if this property is in saved_properties for this user
            const { data, error } = await supabase
                .from('saved_properties')
                .select('id')
                .eq('user_id', user.id)
                .eq('property_id', id)
                .single();

            if (ismounted) setIsSaved(!!data);
        };
        checkSaved();
        return () => { ismounted = false; };
    }, [user, id]);

    // Fetch Property (Direct Supabase)
    useEffect(() => {
        // ... (existing fetch logic remains same)
        let ismounted = true;
        const fetchProperty = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);

            try {
                // Fetch single property by ID
                const { data, error } = await supabase
                    .from('properties')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (ismounted && data) {
                    // Map Simple DB Schema to Frontend Property Model
                    const mappedProperty: any = {
                        id: data.id,
                        title: data.title,
                        salePrice: data.price, // Mapping 'price' to salePrice
                        rentPrice: null,
                        addressLine1: data.address,
                        city: 'New York', // Default/Mock for now
                        state: 'NY',
                        postalCode: '10001',
                        bedrooms: data.beds,
                        bathrooms: data.baths,
                        squareFeet: data.sqft,
                        listingType: data.type,
                        propertyType: 'house', // Default
                        status: 'active',
                        // Enhance with Defaults for UI
                        amenities: ['Central Air', 'Hardwood Floors', 'Dishwasher', 'Washer/Dryer'],
                        description: `A beautiful ${data.sqft} sqft ${data.type === 'buy' ? 'home for sale' : 'rental property'} located at ${data.address}. Features ${data.beds} bedrooms and ${data.baths} bathrooms.`,
                        // Image Handling
                        primaryImageUrl: data.image_url,
                        images: [{ url: data.image_url, isPrimary: true }],
                        // Financial Mocks
                        estimatedAnnualIncome: data.price * 0.08,
                        capRate: 5.5,
                        estimatedRoi: 7.2,
                        hoaFees: 350,
                        // Location Mocks (Default to NYC if no geocoding)
                        latitude: data.latitude || 40.7128,
                        longitude: data.longitude || -74.0060
                    };

                    setProperty(mappedProperty);
                }
            } catch (err: any) {
                console.error('Error fetching property:', err);
                if (ismounted) setError('Failed to load property details. It may not exist.');
            } finally {
                if (ismounted) setLoading(false);
            }
        };

        fetchProperty();
        return () => { ismounted = false; };
    }, [id]);

    // Track View Count
    useEffect(() => {
        const trackView = async () => {
            if (!id) return;
            try {
                const { data } = await supabase.from('properties').select('view_count').eq('id', id).single();
                const currentViews = data?.view_count || 0;
                await supabase.from('properties').update({ view_count: currentViews + 1 }).eq('id', id);
            } catch (err) {
                console.error("Failed to track view", err);
            }
        };
        trackView();
    }, [id]);

    const handleShare = () => {
        navigator.clipboard?.writeText(window.location.href);
        showSuccessToast('Link Copied', 'Property link copied to clipboard!');
    };

    const handleSave = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        const previousState = isSaved;
        setIsSaved(!isSaved); // Optimistic

        try {
            if (previousState) {
                // Remove
                const { error } = await supabase
                    .from('saved_properties')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('property_id', id);

                if (error) throw error;
                showInfoToast('Removed', 'Property removed from saved list');
            } else {
                // Add
                const { error } = await supabase
                    .from('saved_properties')
                    .insert({ user_id: user.id, property_id: id });

                if (error) throw error;
                showSuccessToast('Saved', 'Property added to your saved list');
            }
        } catch (err) {
            console.error('Save error:', err);
            setIsSaved(previousState); // Revert
            showInfoToast('Error', 'Could not update saved status');
        }
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
        // Just return the one image repeated to fill the grid (UI polish)
        const mainImg = (p as any).primaryImageUrl || (p.images && p.images[0]?.url);
        if (mainImg) {
            // Return array of 5 identical images to make the bento grid look full
            return Array(5).fill(mainImg);
        }
        return ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'];
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
                        onClick={() => navigate('/buy')}
                        className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                    >
                        Back to Listings
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
                        onClick={() => navigate('/buy')}
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
                                <span>{property.addressLine1}</span>
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
                        {images.slice(1, 5).map((img: string, idx: number) => (
                            <div
                                key={idx}
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
                                {property.amenities?.map((amenity, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-gray-700">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map Section - REORDERED: Above Investment Calculator */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Explore the Neighborhood</h2>
                                    <p className="text-gray-500 mt-1">{property.addressLine1}</p>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${property.latitude || 40.7128},${property.longitude || -74.0060}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-5 py-2.5 border-2 border-slate-900 text-slate-900 font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm justify-center"
                                >
                                    <MapPin size={16} />
                                    Get Directions
                                </a>
                            </div>

                            <div className="h-96 rounded-xl overflow-hidden border border-gray-100">
                                <MapEngine
                                    properties={[property]}
                                    center={[property.latitude || 40.7128, property.longitude || -74.0060]}
                                    zoom={14}
                                    className="h-full w-full"
                                />
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

                        {/* Investment Calculator (Only for Sale) */}
                        {property.listingType === 'sale' && property.salePrice && (
                            <InvestmentCalculator propertyPrice={property.salePrice} />
                        )}


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

                                {property.contact_phone ? (
                                    <button
                                        onClick={async () => {
                                            // 1. Track Lead
                                            if (id) {
                                                const { data } = await supabase.from('properties').select('lead_count').eq('id', id).single();
                                                const currentLeads = data?.lead_count || 0;
                                                await supabase.from('properties').update({ lead_count: currentLeads + 1 }).eq('id', id);
                                            }

                                            // 2. Open WhatsApp
                                            const phone = property.contact_phone?.replace(/[^\d]/g, '');
                                            const text = encodeURIComponent(`Hi, I'm interested in ${property.title} located at ${property.addressLine1}.`);
                                            window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                                        }}
                                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                    >
                                        <MessageCircle size={20} />
                                        WhatsApp Agent
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => window.location.href = 'mailto:support@gradea.com'}
                                        className="w-full bg-white border border-slate-900 text-slate-900 hover:bg-gray-50 font-bold py-3.5 rounded-xl transition-all"
                                    >
                                        Contact Support
                                    </button>
                                )}
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
