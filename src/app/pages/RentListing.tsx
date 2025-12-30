import React, { useState } from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { Filter, ChevronDown, Map, List, Grid3X3, Calendar } from 'lucide-react';

const rentProperties = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1513584685908-7818a715ef56?w=800',
        price: '$2,800',
        monthlyRent: '$2,800',
        address: '890 Maple Drive, Austin, TX 78701',
        beds: 2,
        baths: 2,
        sqft: 1500,
        leaseTerm: '12 months',
        availability: 'Available Now',
        estYearIncome: '$33,600'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        price: '$3,500',
        monthlyRent: '$3,500',
        address: '234 Elm Street, Portland, OR 97201',
        beds: 3,
        baths: 2.5,
        sqft: 1900,
        leaseTerm: '12-24 months',
        availability: 'Jan 15, 2025',
        estYearIncome: '$42,000'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
        price: '$3,200',
        monthlyRent: '$3,200',
        address: '456 Birch Lane, Denver, CO 80202',
        beds: 2,
        baths: 2,
        sqft: 1600,
        leaseTerm: '12 months',
        availability: 'Available Now',
        estYearIncome: '$38,400'
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800',
        price: '$4,200',
        monthlyRent: '$4,200',
        address: '789 Cedar Court, Boston, MA 02108',
        beds: 3,
        baths: 2.5,
        sqft: 2100,
        leaseTerm: '12-24 months',
        availability: 'Feb 1, 2025',
        estYearIncome: '$50,400'
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800',
        price: '$2,600',
        monthlyRent: '$2,600',
        address: '321 Willow Way, Phoenix, AZ 85001',
        beds: 2,
        baths: 2,
        sqft: 1400,
        leaseTerm: '12 months',
        availability: 'Available Now',
        estYearIncome: '$31,200'
    }
];

export default function RentListing() {
    const [view, setView] = useState<'grid' | 'list'>('grid');

    return (
        <div className="pt-24 pb-12 min-h-screen bg-gray-50">
            <div className="max-w-[1440px] mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Homes for Rent</h1>
                        <p className="text-gray-500 mt-1">{rentProperties.length} rentals available</p>
                    </div>

                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                            <span className="text-sm font-medium">Sort: Newest</span>
                            <ChevronDown size={16} />
                        </button>
                        <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                            <button
                                onClick={() => setView('grid')}
                                className={`p-2 rounded-md transition-all ${view === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Grid3X3 size={20} />
                            </button>
                            <button
                                onClick={() => setView('list')}
                                className={`p-2 rounded-md transition-all ${view === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <List size={20} />
                            </button>
                        </div>
                        <button className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 md:hidden">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar Filter */}
                    <div className="hidden md:block w-72 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-28">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900">Filters</h3>
                                <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Clear All</button>
                            </div>

                            {/* Location */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                <div className="relative">
                                    <Map size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="City, State, or ZIP"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Monthly Rent */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Rent</label>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Min" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
                                    <input type="text" placeholder="Max" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
                                </div>
                            </div>

                            {/* Bedrooms */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                                <div className="flex gap-2">
                                    {['1', '2', '3', '4+'].map((opt, i) => (
                                        <button key={i} className={`flex-1 py-1.5 text-sm border rounded-md hover:border-emerald-500 hover:text-emerald-600 ${i === 0 ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-medium' : 'border-gray-200 text-gray-600'}`}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Availability */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                                <div className="relative">
                                    <select className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-emerald-500 text-gray-600">
                                        <option>Any time</option>
                                        <option>Available Now</option>
                                        <option>Next Month</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Lease Term */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Lease Term</label>
                                <div className="space-y-2.5">
                                    {['Short-term (1-6 months)', 'Long-term (12+ months)', 'Flexible'].map((option) => (
                                        <label key={option} className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                            <span className="text-gray-600 group-hover:text-gray-900 text-sm">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Amenities</label>
                                <div className="space-y-2.5">
                                    {['Pet Friendly', 'Parking', 'In-unit Laundry', 'Gym'].map((amenity) => (
                                        <label key={amenity} className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                            <span className="text-gray-600 group-hover:text-gray-900 text-sm">{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors">
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="flex-1">
                        <div className={`grid ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                            {rentProperties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    type="rent"
                                    {...property}
                                    className={view === 'list' ? 'flex flex-row' : ''}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center mt-12 gap-2">
                            <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Previous</button>
                            <button className="w-10 h-10 bg-emerald-600 text-white rounded-lg font-medium">1</button>
                            <button className="w-10 h-10 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">2</button>
                            <button className="w-10 h-10 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">3</button>
                            <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
