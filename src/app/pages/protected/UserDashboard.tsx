// Redeploy Fix 1 // Vercel deployment fix
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Home, Loader2, AlertCircle, LogOut } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useSupabaseAuth } from '../../../lib/AuthContext';
import { PropertyCard } from '../../components/PropertyCard';
import type { Property } from '../../../types';
import { showSuccessToast } from '../../components/ToastContainer';

export default function UserDashboard() {
    const { user, signOut } = useSupabaseAuth();
    const navigate = useNavigate();

    const [savedProperties, setSavedProperties] = useState<Property[]>([]);
    const [myProperties, setMyProperties] = useState<Property[]>([]);
    const [activeTab, setActiveTab] = useState<'saved' | 'listings'>('saved');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let ismounted = true;

        const fetchData = async () => {
            if (!user) return;
            setLoading(true);

            try {
                // 1. Fetch Saved Properties
                const { data: savedData, error: savedError } = await supabase
                    .from('saved_properties')
                    .select(`id, property:properties ( * )`)
                    .eq('user_id', user.id);

                if (savedError) throw savedError;

                // 2. Fetch My Listings
                const { data: listingsData, error: listingsError } = await supabase
                    .from('properties')
                    .select('*')
                    .eq('owner_id', user.id);

                if (listingsError) throw listingsError;

                if (ismounted) {
                    // Map Saved Data relative to join
                    if (savedData) {
                        const mappedSaved: Property[] = savedData.map((item: any) => {
                            const p = item.property;
                            return {
                                id: p.id,
                                title: p.title,
                                salePrice: p.price,
                                addressLine1: p.address,
                                bedrooms: p.beds || 0,
                                bathrooms: p.baths || 0,
                                squareFeet: p.sqft || 0,
                                listingType: p.type || 'sale',
                                images: [{ url: p.image_url }]
                            } as unknown as Property;
                        });
                        setSavedProperties(mappedSaved);
                    }

                    // Map Listings Data (direct select)
                    if (listingsData) {
                        const mappedListings: Property[] = listingsData.map((p: any) => ({
                            id: p.id,
                            title: p.title,
                            salePrice: p.price,
                            addressLine1: p.address,
                            bedrooms: p.beds || 0,
                            bathrooms: p.baths || 0,
                            squareFeet: p.sqft || 0,
                            listingType: p.type || 'sale',
                            images: [{ url: p.image_url }]
                        } as unknown as Property));
                        setMyProperties(mappedListings);
                    }
                }
            } catch (err: any) {
                console.error('Error loading dashboard data:', err);
                if (ismounted) setError(err.message);
            } finally {
                if (ismounted) setLoading(false);
            }
        };

        fetchData();
        return () => { ismounted = false; };
    }, [user]);

    const handleDeleteListing = async (id: string) => {
        try {
            const { error } = await supabase.from('properties').delete().eq('id', id);
            if (error) throw error;

            // Update UI
            setMyProperties(prev => prev.filter(p => String(p.id) !== id));
            showSuccessToast('Deleted', 'Property removed successfully');
        } catch (err: any) {
            console.error('Error deleting property:', err);
            // In a real app, I'd show a toast here
            alert('Failed to delete property: ' + err.message);
        }
    };

    const handleLogout = async () => {
        await signOut();
        showSuccessToast('Logged out', 'See you soon!');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12 min-h-screen bg-gray-50">
            <div className="max-w-[1440px] mx-auto px-6">

                {/* Header */}
                <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Saved Homes</h1>
                        <p className="text-gray-600 mt-2">
                            Welcome back, {user?.email}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`pb-4 px-2 font-medium transition-all relative ${activeTab === 'saved' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Saved Homes
                        {activeTab === 'saved' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600"></span>}
                    </button>
                    <button
                        onClick={() => navigate('/my-properties')}
                        className={`pb-4 px-2 font-medium transition-all relative ${activeTab === 'listings' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Seller Command Center
                        <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">NEW</span>
                    </button>
                </div>

                {/* Content */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-6">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {activeTab === 'saved' ? (
                    savedProperties.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="text-gray-300" size={32} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">No saved homes yet</h2>
                            <p className="text-gray-500 mt-2 mb-6">Start exploring properties and tap the heart to save them!</p>
                            <button
                                onClick={() => navigate('/buy')}
                                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
                            >
                                <Home size={18} />
                                Browse Properties
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedProperties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    id={property.id}
                                    type={property.listingType === 'rent' ? 'rent' : 'buy'}
                                    image={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-27b88e57e609?auto=format&fit=crop&w=800&q=80'}
                                    price={property.salePrice ? `$${property.salePrice.toLocaleString()}` : '$0'}
                                    address={property.addressLine1 || ''}
                                    beds={property.bedrooms || 0}
                                    baths={property.bathrooms || 0}
                                    sqft={property.squareFeet || 0}
                                    data={property}
                                    onClick={() => navigate(`/property/${property.id}`)}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    // My Listings Tab
                    <div>
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={() => navigate('/my-properties')}
                                className="bg-[#D4AF37] hover:bg-[#b5952f] text-[#0f172a] px-5 py-2.5 rounded-lg font-bold shadow-sm transition-all flex items-center gap-2"
                            >
                                <Home size={18} />
                                List Property
                            </button>
                        </div>

                        {myProperties.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Home className="text-gray-300" size={32} />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">No listings yet</h2>
                                <p className="text-gray-500 mt-2 mb-6">You haven't listed any properties for sale or rent yet.</p>
                                <button
                                    onClick={() => navigate('/add-property')}
                                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
                                >
                                    List Your Home
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myProperties.map((property) => (
                                    <div key={property.id} className="relative group">
                                        <PropertyCard
                                            id={property.id}
                                            type={property.listingType === 'rent' ? 'rent' : 'buy'}
                                            image={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-27b88e57e609?auto=format&fit=crop&w=800&q=80'}
                                            price={property.salePrice ? `$${property.salePrice.toLocaleString()}` : '$0'}
                                            address={property.addressLine1 || ''}
                                            beds={property.bedrooms || 0}
                                            baths={property.bathrooms || 0}
                                            sqft={property.squareFeet || 0}
                                            data={property}
                                            onClick={() => navigate(`/property/${property.id}`)}
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Delete this listing?')) handleDeleteListing(String(property.id));
                                            }}
                                            className="absolute top-3 left-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition z-30"
                                            title="Delete Listing"
                                        >
                                            <AlertCircle size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
