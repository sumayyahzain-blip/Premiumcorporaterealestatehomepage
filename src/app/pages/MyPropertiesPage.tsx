/**
 * GRADE A REALTY - My Properties Page
 * Property management for owners/investors with full CRUD
 * Phase 1 Implementation
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, MoreVertical, Search, Filter, Building2 } from 'lucide-react';
import { PageHeader, EmptyState, LoadingState } from '../components/PageHeader';
import { useAuth } from '../../hooks';
import { mockDataService, MOCK_PROPERTIES } from '../../services/mockDataService';
import { showSuccessToast, showErrorToast, showInfoToast } from '../components/ToastContainer';
import type { Property } from '../../types';

export default function MyPropertiesPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // Load properties
    useEffect(() => {
        const loadProperties = async () => {
            setIsLoading(true);
            try {
                // Simulate API call - in production, filter by owner
                await new Promise(resolve => setTimeout(resolve, 800));
                // For demo, show first 4 properties as "owned" by current user
                setProperties(MOCK_PROPERTIES.slice(0, 4));
            } catch (error) {
                showErrorToast('Error', 'Failed to load properties');
            } finally {
                setIsLoading(false);
            }
        };
        loadProperties();
    }, [user?.id]);

    // Filter properties
    const filteredProperties = properties.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.city.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleEdit = (propertyId: string) => {
        showInfoToast('Edit Property', 'Navigating to edit form...');
        // In production: navigate(`/properties/${propertyId}/edit`);
        navigate('/properties/new'); // For demo, reuse create form
    };

    const handleDelete = (propertyId: string) => {
        if (confirm('Are you sure you want to delete this property?')) {
            setProperties(prev => prev.filter(p => p.id !== propertyId));
            showSuccessToast('Deleted', 'Property has been removed');
        }
    };

    const handleView = (propertyId: string) => {
        navigate(`/property/${propertyId}`);
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            active: 'bg-green-100 text-green-800',
            pending_approval: 'bg-amber-100 text-amber-800',
            rented: 'bg-blue-100 text-blue-800',
            sold: 'bg-purple-100 text-purple-800',
            under_contract: 'bg-orange-100 text-orange-800',
            draft: 'bg-gray-100 text-gray-800',
        };
        const labels: Record<string, string> = {
            active: 'Active',
            pending_approval: 'Pending',
            rented: 'Rented',
            sold: 'Sold',
            under_contract: 'Under Contract',
            draft: 'Draft',
        };
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
                {labels[status] || status}
            </span>
        );
    };

    const formatCurrency = (value: number | null) => {
        if (!value) return '-';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
    };

    return (
        <div className="pt-24 pb-12 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <PageHeader
                    title="My Properties"
                    description="Manage your property listings. Add, edit, or remove properties from your portfolio."
                    actions={[
                        {
                            label: 'Add Property',
                            href: '/properties/new',
                            icon: Plus,
                            variant: 'primary',
                        },
                    ]}
                />

                {/* Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search properties..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="pending_approval">Pending Approval</option>
                            <option value="rented">Rented</option>
                            <option value="under_contract">Under Contract</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <LoadingState message="Loading your properties..." />
                ) : filteredProperties.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200">
                        <EmptyState
                            icon={Building2}
                            title={properties.length === 0 ? "No Properties Yet" : "No Matching Properties"}
                            description={properties.length === 0
                                ? "Start building your portfolio by adding your first property listing."
                                : "Try adjusting your search or filter criteria."
                            }
                            action={properties.length === 0 ? {
                                label: "Add Your First Property",
                                href: "/properties/new"
                            } : undefined}
                        />
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                            <div className="col-span-4">Property</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Price</div>
                            <div className="col-span-2">Views</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        {/* Property Rows */}
                        <div className="divide-y divide-gray-100">
                            {filteredProperties.map((property) => (
                                <div
                                    key={property.id}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors items-center"
                                >
                                    {/* Property Info */}
                                    <div className="md:col-span-4 flex items-center gap-4">
                                        <img
                                            src={property.primaryImageUrl || 'https://via.placeholder.com/80'}
                                            alt={property.title}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                                            <p className="text-sm text-gray-500 truncate">{property.city}, {property.state}</p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="md:col-span-2">
                                        <span className="md:hidden text-sm text-gray-500 mr-2">Status:</span>
                                        {getStatusBadge(property.status)}
                                    </div>

                                    {/* Price */}
                                    <div className="md:col-span-2">
                                        <span className="md:hidden text-sm text-gray-500 mr-2">Price:</span>
                                        <span className="font-semibold text-gray-900">
                                            {property.salePrice ? formatCurrency(property.salePrice) :
                                                property.rentPrice ? `${formatCurrency(property.rentPrice)}/mo` : '-'}
                                        </span>
                                    </div>

                                    {/* Views */}
                                    <div className="md:col-span-2">
                                        <span className="md:hidden text-sm text-gray-500 mr-2">Views:</span>
                                        <span className="text-gray-600">{property.viewCount?.toLocaleString() || 0}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="md:col-span-2 flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleView(property.id)}
                                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                                            title="View"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(property.id)}
                                            className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 hover:text-blue-700"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(property.id)}
                                            className="p-2 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Summary */}
                {!isLoading && properties.length > 0 && (
                    <div className="mt-6 text-sm text-gray-500 text-center">
                        Showing {filteredProperties.length} of {properties.length} properties
                    </div>
                )}
            </div>
        </div>
    );
}
