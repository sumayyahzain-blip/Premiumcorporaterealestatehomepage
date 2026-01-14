
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';
import { useSupabaseAuth } from '../../../lib/AuthContext';
import { showSuccessToast, showErrorToast } from '../../components/ToastContainer';
import { Home, DollarSign, MapPin, Layout, Image as ImageIcon, Loader2, Phone } from 'lucide-react';

export default function AddProperty() {
    const navigate = useNavigate();
    const { user } = useSupabaseAuth();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        listing_type: 'sale', // 'sale' | 'rent'
        price: '',
        address: '',
        beds: '',
        baths: '',
        sqft: '',
        imageUrl: '',
        contactPhone: '',
        description: '',
        latitude: '',
        longitude: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            showErrorToast("Error", "You must be logged in to list a property.");
            return;
        }

        if (!formData.title || !formData.price || !formData.address || !formData.imageUrl) {
            showErrorToast("Validation Error", "Please fill in all required fields.");
            return;
        }

        setLoading(true);

        try {
            const dbData = {
                title: formData.title,
                listing_type: formData.listing_type,
                price: Number(formData.price),
                address: formData.address,
                beds: Number(formData.beds) || 0,
                baths: Number(formData.baths) || 0,
                sqft: Number(formData.sqft) || 0,
                image_url: formData.imageUrl,
                contact_phone: formData.contactPhone,
                owner_id: user.id,
                latitude: formData.latitude ? Number(formData.latitude) : null,
                longitude: formData.longitude ? Number(formData.longitude) : null,
                // description: formData.description // Assuming DB has this column, if not, omit
            };

            const { error } = await supabase.from('properties').insert([dbData]);

            if (error) throw error;

            showSuccessToast("Success", "Property listed successfully!");
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Error creating property:', err);
            showErrorToast('Error', err.message || 'Failed to create property.');
        } finally {
            setLoading(false);
        }
    };

    // Shared Input Styles
    const inputClasses = "w-full px-4 py-3 bg-[#1e293b] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all";

    return (
        <div className="min-h-screen bg-[#0f172a] pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">List Your Property</h1>
                    <p className="text-gray-400">Fill in the details below to publish your listing.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#1e293b]/50 border border-gray-700/50 rounded-2xl p-6 md:p-8 space-y-6">

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Listing Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Modern Luxury Villa"
                                className={inputClasses}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Listing Type</label>
                            <div className="flex bg-[#1e293b] p-1 rounded-xl border border-gray-700 h-[50px]">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, listing_type: 'sale' }))}
                                    className={`flex-1 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 ${formData.listing_type === 'sale'
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    For Sale
                                </button>
                                <div className="w-2" />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, listing_type: 'rent' }))}
                                    className={`flex-1 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 ${formData.listing_type === 'rent'
                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    For Rent
                                </button>
                            </div>
                        </div>

                        {/* Contact Phone - NEW FIELD */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Contact Phone (WhatsApp)</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 890" // Example
                                    className={`${inputClasses} pl-12`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Price *</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className={`${inputClasses} pl-12`}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Address *</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="123 Main St, City, State"
                                    className={`${inputClasses} pl-12`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* GEOLOCATION - NEW SECTION */}
                    <div className="md:col-span-2 grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Latitude</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="number"
                                    step="any"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    placeholder="40.7128"
                                    className={`${inputClasses} pl-12`}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Longitude</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="number"
                                    step="any"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    placeholder="-74.0060"
                                    className={`${inputClasses} pl-12`}
                                />
                            </div>
                        </div>
                        <p className="col-span-2 text-xs text-gray-500 italic">
                            * Tip: You can get these value from Google Maps by right-clicking a location.
                        </p>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Beds</label>
                            <input
                                type="number"
                                name="beds"
                                value={formData.beds}
                                onChange={handleChange}
                                placeholder="3"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Baths</label>
                            <input
                                type="number"
                                name="baths"
                                value={formData.baths}
                                onChange={handleChange}
                                placeholder="2"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Sqft</label>
                            <input
                                type="number"
                                name="sqft"
                                value={formData.sqft}
                                onChange={handleChange}
                                placeholder="1500"
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    {/* Image URL Section (Visual Fix) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Image URL *</label>
                        <div className="relative mb-4">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className={`${inputClasses} pl-12`}
                            />
                        </div>

                        {/* Image Preview */}
                        <div className="w-full h-64 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex items-center justify-center relative group">
                            {formData.imageUrl ? (
                                <>
                                    <img
                                        src={formData.imageUrl}
                                        alt="Property Preview"
                                        className="w-full h-full object-cover transition-opacity duration-300"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-medium">Image Preview</p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-500">
                                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                    <p>Enter a URL to preview image</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-amber-500/20 transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'List Property'}
                        </button>
                    </div>

                </form >
            </div >
        </div >
    );
}
