
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, MessageSquare, Search, Plus, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useSupabaseAuth } from '../../../lib/AuthContext';
import { showSuccessToast, showErrorToast } from '../../components/ToastContainer';
import { PageHeader } from '../../components/PageHeader';

// Interface for what we specifically need here
interface MyListing {
    id: string;
    title: string;
    image_url: string;
    status: 'active' | 'pending' | 'sold';
    view_count: number;
    lead_count: number;
    price: number;
    listing_type: 'sale' | 'rent';
    address: string;
}

export default function MyListings() {
    const navigate = useNavigate();
    const { user } = useSupabaseAuth();
    const [listings, setListings] = useState<MyListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchListings = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('properties')
                    .select('*')
                    .eq('owner_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    const mapped: MyListing[] = data.map(p => ({
                        id: p.id,
                        title: p.title,
                        image_url: p.image_url,
                        status: p.status || 'active',
                        view_count: p.view_count || 0,
                        lead_count: p.lead_count || 0,
                        price: p.price,
                        listing_type: p.listing_type || 'sale',
                        address: p.address
                    }));
                    setListings(mapped);
                }
            } catch (err) {
                console.error("Error fetching listings:", err);
                showErrorToast("Error", "Could not load your properties.");
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [user]);

    const handleStatusChange = async (id: string, newStatus: MyListing['status']) => {
        // 1. Optimistic Update
        setListings(prev => prev.map(item =>
            item.id === id ? { ...item, status: newStatus } : item
        ));

        // 2. Database Update
        try {
            const { error } = await supabase
                .from('properties')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            showSuccessToast("Updated", `Property marked as ${newStatus.toUpperCase()}`);
        } catch (err) {
            console.error("Update failed:", err);
            showErrorToast("Error", "Failed to update property status.");
            // Revert would go here in a production app
        }
    };

    const filteredListings = listings.filter(l =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Seller Command Center"
                    description="Manage your inventory and track performance metrics."
                    actions={[
                        {
                            label: 'List New Property',
                            href: '/add-property', // Or whatever your add route is
                            icon: Plus,
                            variant: 'primary',
                        },
                    ]}
                />

                {/* Search Bar */}
                <div className="mb-8 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search your listings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                ) : filteredListings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                        <AlertCircle className="mx-auto text-gray-300 mb-3" size={48} />
                        <h3 className="text-lg font-bold text-gray-900">No Listings Found</h3>
                        <p className="text-gray-500">Get started by listing your first property.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredListings.map(item => (
                            <div
                                key={item.id}
                                className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md ${item.status === 'sold' ? 'opacity-75 grayscale-[0.8]' : ''
                                    }`}
                            >
                                {/* 1. Image & Title */}
                                <div className="p-4 flex gap-4 items-center border-b border-gray-100">
                                    <img
                                        src={item.image_url || 'https://via.placeholder.com/100'}
                                        alt={item.title}
                                        className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-gray-900 truncate" title={item.title}>
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">{item.address}</p>
                                        <p className="text-xs font-semibold text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded mt-1 uppercase">
                                            {item.listing_type}
                                        </p>
                                    </div>
                                </div>

                                {/* 2. Metrics Row */}
                                <div className="p-4 bg-gray-50/50">
                                    <div className="flex gap-4 p-3 bg-gray-100/80 rounded-lg border border-gray-200/60 justify-around">
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-1.5 text-gray-500 text-xs uppercase font-semibold mb-0.5">
                                                <Eye size={14} /> Views
                                            </div>
                                            <span className="text-lg font-bold text-gray-900">{item.view_count}</span>
                                        </div>
                                        <div className="w-px bg-gray-300"></div>
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-1.5 text-gray-500 text-xs uppercase font-semibold mb-0.5">
                                                <MessageSquare size={14} /> Leads
                                            </div>
                                            <span className="text-lg font-bold text-gray-900">{item.lead_count}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Control Row (Inventory Mgmt) */}
                                <div className="p-4 pt-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                                        Status Management
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={item.status}
                                            onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                                            className={`w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg text-sm font-bold border-2 outline-none cursor-pointer transition-colors ${item.status === 'active' ? 'border-green-100 bg-green-50 text-green-700 focus:border-green-500' :
                                                    item.status === 'pending' ? 'border-yellow-100 bg-yellow-50 text-yellow-700 focus:border-yellow-500' :
                                                        'border-gray-200 bg-gray-50 text-gray-600 focus:border-gray-500'
                                                }`}
                                        >
                                            <option value="active">🟢 Active Listing</option>
                                            <option value="pending">🟡 Pending Offer</option>
                                            <option value="sold">🔴 Sold / Closed</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => navigate(`/property/${item.id}`)}
                                            className="flex-1 py-2 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                                        >
                                            Preview
                                        </button>
                                        {/* Edit functionality could go here */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
