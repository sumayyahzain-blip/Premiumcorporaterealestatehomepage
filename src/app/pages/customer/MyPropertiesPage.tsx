
/**
 * GRADE A REALTY - Seller Command Center
 * Advanced property management and analytics dashboard.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, Search, Building2, Loader2, Phone, TrendingUp, MoreHorizontal, CheckCircle } from 'lucide-react';
import { PageHeader, EmptyState } from '../../components/PageHeader';
import { useAuth } from '../../../hooks';
import { showSuccessToast, showErrorToast, showInfoToast } from '../../components/ToastContainer';
import { api } from '../../../services/api';
import { supabase } from '../../../lib/supabaseClient';
import type { Property } from '../../../types';

export default function MyPropertiesPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Load properties
    useEffect(() => {
        let ismounted = true;
        const loadProperties = async () => {
            // Fallback for dev if user.id is not set, use a known test ID or just don't filter strict if empty
            if (!user?.id) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // Fetch directly from supabase for flexibility with counters
                const { data, error } = await supabase
                    .from('properties')
                    .select('*')
                    .eq('owner_id', user.id)
                    .order('created_at', { ascending: false });

                if (ismounted) {
                    if (!error && data) {
                        // Map DB to Frontend Type (ensuring counts exist)
                        const mapped: any[] = data.map(p => ({
                            ...p,
                            // Map DB columns to TS Interface
                            viewCount: p.view_count || 0,
                            leadCount: p.lead_count || 0,
                            listingType: p.listing_type,
                            salePrice: p.price,
                            rentPrice: p.price, // simple map
                            addressLine1: p.address,
                            city: p.city || '',
                            state: p.state || '',
                            primaryImageUrl: p.image_url
                        }));
                        setProperties(mapped);
                    } else {
                        console.error(error);
                        showErrorToast('Error', 'Failed to load properties');
                    }
                }
            } catch (error) {
                if (ismounted) showErrorToast('Error', 'Failed to load properties');
            } finally {
                if (ismounted) setIsLoading(false);
            }
        };

        loadProperties();
        return () => { ismounted = false; };
    }, [user?.id]);

    const handleStatusChange = async (propertyId: string, newStatus: string) => {
        // Optimistic UI Update
        setProperties(prev => prev.map(p =>
            p.id === propertyId ? { ...p, status: newStatus as any } : p
        ));

        try {
            const { error } = await supabase
                .from('properties')
                .update({ status: newStatus })
                .eq('id', propertyId);

            if (error) throw error;
            showSuccessToast('Status Updated', `Property marked as ${newStatus.replace('_', ' ')}`);
        } catch (err) {
            console.error('Status update failed:', err);
            showErrorToast('Error', 'Failed to update status');
            // Revert on error could be added here
        }
    };

    const handleDelete = async (propertyId: string) => {
        if (confirm('Are you sure you want to delete this property?')) {
            try {
                const { error } = await supabase.from('properties').delete().eq('id', propertyId);
                if (!error) {
                    setProperties(prev => prev.filter(p => p.id !== propertyId));
                    showSuccessToast('Deleted', 'Property has been removed');
                } else {
                    throw error;
                }
            } catch (err) {
                showErrorToast('Error', 'Failed to delete property');
            }
        }
    };

    // Client-side filtering
    const filteredProperties = properties.filter(p => {
        const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.addressLine1?.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'sold': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'rented': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <div className="pt-24 pb-12 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <PageHeader
                    title="Seller Command Center"
                    description="Track performance, manage leads, and update your property portfolio."
                    actions={[
                        {
                            label: 'List New Property',
                            href: '/properties/new',
                            icon: Plus,
                            variant: 'primary',
                        },
                    ]}
                />

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative w-full">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title or address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="sold">Sold</option>
                            <option value="rented">Rented</option>
                        </select>
                    </div>
                </div>

                {/* Content Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Loader2 size={32} className="animate-spin mb-2" />
                        <p>Loading analytics...</p>
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12">
                        <EmptyState
                            icon={Building2} // Using Building2 as requested/consistent
                            title={properties.length === 0 ? "No Properties Listed" : "No Matching Properties"}
                            description="Your portfolio is currently empty or no properties match your search."
                            action={properties.length === 0 ? {
                                label: "Create First Listing",
                                href: "/properties/new"
                            } : undefined}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map((property) => (
                            <div
                                key={property.id}
                                className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all group ${property.status === 'sold' ? 'opacity-75 grayscale-[0.5]' : ''
                                    }`}
                            >
                                {/* Image & Status Overlay */}
                                <div className="relative h-48 bg-gray-100">
                                    <img
                                        src={(property as any).primaryImageUrl || 'https://via.placeholder.com/400'}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(property.status)}`}>
                                            {property.status}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                        <h3 className="text-white font-bold text-lg truncate">{property.title}</h3>
                                        <p className="text-white/80 text-sm truncate">{property.addressLine1}</p>
                                    </div>
                                </div>

                                {/* Analytics Dashboard */}
                                <div className="p-4 grid grid-cols-2 gap-4 border-b border-gray-100 bg-gray-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                            <Eye size={18} />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-gray-900">{(property as any).viewCount}</div>
                                            <div className="text-xs text-gray-500 font-medium uppercase">Views</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-gray-900">{(property as any).leadCount}</div>
                                            <div className="text-xs text-gray-500 font-medium uppercase">Leads</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions & Controls */}
                                <div className="p-4 space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Update Status</label>
                                        <select
                                            value={property.status}
                                            onChange={(e) => handleStatusChange(property.id, e.target.value)}
                                            className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            <option value="active">🟢 Active</option>
                                            <option value="pending">🟡 Pending</option>
                                            <option value="sold">⚫ Sold</option>
                                            <option value="rented">🔵 Rented</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/property/${property.id}`)}
                                            className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => navigate(`/properties/new?edit=${property.id}`)} // Demo Edit
                                            className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-bold transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(property.id)}
                                            className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
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
