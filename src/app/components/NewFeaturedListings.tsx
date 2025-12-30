import React from 'react';

const listings = [
    {
        id: 1,
        title: 'Modern Villa Estate',
        location: 'Beverly Hills, CA',
        price: '$3,450,000',
        beds: 5,
        baths: 4,
        sqft: '4,200',
        image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
        tag: 'Featured',
        tagColor: 'from-amber-400 to-orange-500'
    },
    {
        id: 2,
        title: 'Luxury Penthouse',
        location: 'Manhattan, NY',
        price: '$5,200,000',
        beds: 4,
        baths: 3,
        sqft: '3,800',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        tag: 'New',
        tagColor: 'from-emerald-400 to-teal-500'
    },
    {
        id: 3,
        title: 'Oceanfront Mansion',
        location: 'Miami Beach, FL',
        price: '$7,800,000',
        beds: 6,
        baths: 7,
        sqft: '8,500',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        tag: 'Exclusive',
        tagColor: 'from-purple-400 to-pink-500'
    },
    {
        id: 4,
        title: 'Contemporary Loft',
        location: 'San Francisco, CA',
        price: '$1,890,000',
        beds: 2,
        baths: 2,
        sqft: '1,800',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        tag: 'Hot',
        tagColor: 'from-red-400 to-rose-500'
    },
    {
        id: 5,
        title: 'Mountain Retreat',
        location: 'Aspen, CO',
        price: '$4,500,000',
        beds: 5,
        baths: 4,
        sqft: '5,200',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        tag: 'Premium',
        tagColor: 'from-blue-400 to-indigo-500'
    },
    {
        id: 6,
        title: 'Urban Smart Home',
        location: 'Seattle, WA',
        price: '$2,100,000',
        beds: 3,
        baths: 3,
        sqft: '2,400',
        image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
        tag: 'Smart Home',
        tagColor: 'from-cyan-400 to-blue-500'
    }
];

export default function NewFeaturedListings() {
    return (
        <section id="listings" className="py-24 bg-gradient-to-b from-slate-50 to-white rounded-t-[60px] overflow-hidden shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                        Our Properties
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Featured Listings
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Explore our handpicked selection of premium properties that define luxury living
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {['All Properties', 'For Sale', 'For Rent', 'New Listings', 'Luxury'].map((tab, idx) => (
                        <button
                            key={tab}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${idx === 0
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Listings Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.map((listing) => (
                        <div
                            key={listing.id}
                            className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                        >
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={listing.image}
                                    alt={listing.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Tag */}
                                <div className={`absolute top-4 left-4 bg-gradient-to-r ${listing.tagColor} text-white text-xs font-bold px-3 py-1.5 rounded-full`}>
                                    {listing.tag}
                                </div>

                                {/* Favorite button */}
                                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
                                    <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    {listing.location}
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                    {listing.title}
                                </h3>

                                <div className="flex items-center gap-4 text-slate-600 text-sm mb-4">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <span>{listing.beds} Beds</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                        </svg>
                                        <span>{listing.baths} Baths</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        </svg>
                                        <span>{listing.sqft} sqft</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                        {listing.price}
                                    </div>
                                    <button className="bg-slate-900 hover:bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <button className="inline-flex items-center gap-2 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-4 rounded-full font-bold transition-all duration-300">
                        View All Properties
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
