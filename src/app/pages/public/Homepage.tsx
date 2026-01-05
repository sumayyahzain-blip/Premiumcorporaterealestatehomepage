import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import PremiumHero from '../../components/PremiumHero';
import WhyChooseUs from '../../components/WhyChooseUs';
import NewTestimonials from '../../components/NewTestimonials';
import TeamSection from '../../components/TeamSection';
import NewFooter from '../../components/NewFooter';
import { PropertyCard } from '../../components/PropertyCard';
import { api } from '../../../services/api';
import type { Property } from '../../../types';

export default function Homepage() {
    const navigate = useNavigate();
    const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        let ismounted = true;

        async function fetchFeatured() {
            try {
                // Using unified API client to fetch listings
                // Limiting to 3 for 'Featured' section
                const response = await api.properties.list({
                    listingType: 'sale',
                    page: 1,
                    pageSize: 3
                });

                if (ismounted) {
                    if (response.success && response.data) {
                        // Ensure we strictly take 3 just in case pageSize isn't respected by mock
                        setFeaturedProperties(response.data.data.slice(0, 3));
                    } else {
                        setError(true);
                    }
                }
            } catch (err) {
                if (ismounted) setError(true);
                console.error("Failed to fetch featured properties", err);
            } finally {
                if (ismounted) setLoading(false);
            }
        }

        fetchFeatured();
        return () => { ismounted = false; };
    }, []);

    // Helpers (Exact match from Search/BuyListing)
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

    const getStatusColor = (statusVal: string) => {
        const s = statusVal?.toLowerCase() || '';
        if (s === 'active' || s === 'for sale' || s === 'for rent') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        if (s === 'sold' || s === 'rented') return 'bg-red-100 text-red-800 border-red-200';
        if (s === 'pending') return 'bg-amber-100 text-amber-800 border-amber-200';
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const formatStatus = (s: string) => {
        if (!s) return '';
        return s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="relative">
            {/* Hero Section - Fixed in place */}
            <div className="fixed inset-0 h-screen z-0">
                <PremiumHero />
            </div>

            {/* Spacer to push content below the fixed hero */}
            <div className="h-screen"></div>

            {/* Scrolling Content */}
            <div className="relative z-10 bg-white">

                {/* Featured Listings Section */}
                {!error && (
                    <div className="relative bg-white pt-24 pb-20 rounded-t-[3rem] -mt-12 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
                        <div className="max-w-[1440px] mx-auto px-6">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Explore our hand-picked selection of premium properties, offering luxury and comfort in prime locations.
                                </p>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <Loader2 size={40} className="animate-spin text-emerald-600" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {featuredProperties.map((property) => (
                                        <div key={property.id} className="relative group">
                                            {/* Status Badge */}
                                            {property.status && (
                                                <div className="absolute top-4 left-4 z-10">
                                                    <span className={`text-xs px-2.5 py-1 rounded-md border font-bold uppercase tracking-wider shadow-sm ${getStatusColor(property.status)}`}>
                                                        {formatStatus(property.status)}
                                                    </span>
                                                </div>
                                            )}

                                            <PropertyCard
                                                type="buy"
                                                image={getImage(property)}
                                                price={formatPrice(property.salePrice)}
                                                address={getAddress(property)}
                                                beds={property.bedrooms || 0}
                                                baths={property.bathrooms || 0}
                                                sqft={property.squareFeet || 0}
                                                estRent={property.estimatedAnnualIncome ? formatPrice(property.estimatedAnnualIncome / 12) : undefined}
                                                capRate={property.capRate ? `${property.capRate}%` : undefined}
                                                onClick={() => navigate(`/property/${property.id}`)}
                                                id={property.id}
                                                data={property}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* View All Button */}
                            <div className="mt-16 text-center">
                                <button
                                    onClick={() => navigate('/buy')}
                                    className="px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
                                >
                                    View All Properties
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Sections */}
                <div className="relative bg-white">
                    <WhyChooseUs />
                </div>

                <div className="relative bg-white">
                    <NewTestimonials />
                </div>

                <div className="relative bg-white">
                    <TeamSection />
                </div>

                <div className="relative bg-white">
                    <NewFooter />
                </div>
            </div>
        </div>
    );
}
