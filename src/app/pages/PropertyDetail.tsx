import React from 'react';
import { MapPin, Bed, Bath, Maximize, Share2, Heart, Calendar, CheckCircle2, DollarSign, TrendingUp } from 'lucide-react';

export default function PropertyDetail() {
    return (
        <div className="pt-24 pb-12 min-h-screen bg-gray-50">
            <div className="max-w-[1440px] mx-auto px-6">

                {/* Header / Gallery */}
                <div className="space-y-6 mb-8">
                    {/* Title & Actions */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">$725,000</h1>
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin size={18} />
                                <span>1234 Oak Street, San Francisco, CA 94102</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                                <Share2 size={18} />
                                Share
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                                <Heart size={18} />
                                Save
                            </button>
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
                        {/* Main Large Image */}
                        <div className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600"
                                alt="Property Main"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Side Images */}
                        <div className="relative rounded-2xl overflow-hidden group hidden md:block">
                            <img
                                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
                                alt="Interior 1"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden group hidden md:block">
                            <img
                                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
                                alt="Interior 2"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden group hidden md:block">
                            <img
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
                                alt="Interior 3"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden group hidden md:block">
                            <img
                                src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800"
                                alt="Interior 4"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
                                <span className="text-white font-semibold text-lg">+12 Photos</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Strip */}
                    <div className="flex gap-8 py-6 border-y border-gray-200">
                        <div className="flex items-center gap-2">
                            <Bed className="text-emerald-600" size={24} />
                            <div>
                                <span className="font-bold text-gray-900 block">3 Beds</span>
                                <span className="text-sm text-gray-500">Bedroom</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Bath className="text-emerald-600" size={24} />
                            <div>
                                <span className="font-bold text-gray-900 block">2 Baths</span>
                                <span className="text-sm text-gray-500">Bathroom</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Maximize className="text-emerald-600" size={24} />
                            <div>
                                <span className="font-bold text-gray-900 block">2,100 sqft</span>
                                <span className="text-sm text-gray-500">Living Area</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="text-emerald-600" size={24} />
                            <div>
                                <span className="font-bold text-gray-900 block">Single Family</span>
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
                                    <div className="text-sm text-emerald-800 font-medium mb-1">Est. Monthly Rent</div>
                                    <div className="text-2xl font-bold text-emerald-900">$3,200</div>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-4">
                                    <div className="text-sm text-emerald-800 font-medium mb-1">Cap Rate</div>
                                    <div className="text-2xl font-bold text-emerald-900">5.3%</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="text-sm text-gray-600 font-medium mb-1">Annual Income</div>
                                    <div className="text-2xl font-bold text-gray-900">$38,400</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="text-sm text-gray-600 font-medium mb-1">Gross Yield</div>
                                    <div className="text-2xl font-bold text-gray-900">5.3%</div>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Property</h2>
                            <div className="prose prose-slate max-w-none text-gray-600">
                                <p className="mb-4">
                                    Beautiful single-family home in a prime San Francisco location. This well-maintained property features 3 spacious bedrooms, 2 modern bathrooms, and an open-concept living area perfect for entertaining.
                                </p>
                                <p className="mb-4">
                                    The home boasts hardwood floors throughout, a recently renovated kitchen with stainless steel appliances, and a private backyard ideal for outdoor gatherings. Located in a quiet, family-friendly neighborhood with excellent schools and convenient access to public transportation.
                                </p>
                                <p>
                                    This property presents an excellent investment opportunity with strong rental potential and appreciation prospects in one of San Francisco's most desirable areas.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Contact Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-28">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Schedule a Viewing</h3>

                            <form className="space-y-4">
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
                                <button type="button" className="w-full bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold py-3.5 rounded-xl transition-colors">
                                    Contact Agent
                                </button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                    {/* Placeholder Avatar */}
                                    <svg className="w-full h-full text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">Sarah Johnson</div>
                                    <div className="text-sm text-gray-500">Licensed Agent</div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    sarah.j@estate.com
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    (555) 987-6543
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
