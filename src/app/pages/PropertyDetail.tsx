import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Share2, Heart, Calendar, CheckCircle2, TrendingUp, ArrowLeft, Home } from 'lucide-react';
import { showInfoToast, showSuccessToast } from '../components/ToastContainer';

// Property data that matches the Featured Listings
const propertyData: Record<string, PropertyInfo> = {
    '1': {
        id: '1',
        title: 'Modern Villa Estate',
        price: '$3,450,000',
        address: '1234 Beverly Drive, Beverly Hills, CA 90210',
        beds: 5,
        baths: 4,
        sqft: '4,200',
        propertyType: 'Single Family',
        estRent: '$15,000',
        capRate: '5.2%',
        annualIncome: '$180,000',
        grossYield: '5.2%',
        images: [
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
        ],
        description: `Stunning modern villa in the heart of Beverly Hills. This architectural masterpiece features floor-to-ceiling windows, an infinity pool, and panoramic city views. The open-concept living spaces are perfect for entertaining, while the private primary suite offers a spa-like retreat.`,
    },
    '2': {
        id: '2',
        title: 'Luxury Penthouse',
        price: '$5,200,000',
        address: '432 Park Avenue, Manhattan, NY 10022',
        beds: 4,
        baths: 3,
        sqft: '3,800',
        propertyType: 'Penthouse',
        estRent: '$22,000',
        capRate: '5.1%',
        annualIncome: '$264,000',
        grossYield: '5.1%',
        images: [
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
        ],
        description: `Exquisite penthouse with breathtaking Manhattan skyline views. This residence features double-height ceilings, a chef's kitchen with top-of-the-line appliances, and a private rooftop terrace. Building amenities include 24-hour concierge, fitness center, and resident lounge.`,
    },
    '3': {
        id: '3',
        title: 'Oceanfront Mansion',
        price: '$7,800,000',
        address: '789 Ocean Drive, Miami Beach, FL 33139',
        beds: 6,
        baths: 7,
        sqft: '8,500',
        propertyType: 'Mansion',
        estRent: '$35,000',
        capRate: '5.4%',
        annualIncome: '$420,000',
        grossYield: '5.4%',
        images: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        ],
        description: `Spectacular oceanfront estate with direct beach access. This magnificent property features a resort-style pool, outdoor kitchen, and multiple entertainment areas. The interior boasts marble floors, a wine cellar, and a home theater. Staff quarters and 6-car garage included.`,
    },
    '4': {
        id: '4',
        title: 'Contemporary Loft',
        price: '$2,500/mo',
        address: '567 Mission Street, San Francisco, CA 94105',
        beds: 2,
        baths: 2,
        sqft: '1,800',
        propertyType: 'Loft',
        estRent: '$2,500',
        capRate: 'N/A',
        annualIncome: '$30,000',
        grossYield: 'Rental',
        images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
            'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
        ],
        description: `Stunning industrial loft in SOMA district with exposed brick, high ceilings, and oversized windows. Modern kitchen with stainless steel appliances, in-unit washer/dryer, and one parking space included. Walking distance to restaurants, shops, and public transit.`,
    },
    '5': {
        id: '5',
        title: 'Mountain Retreat',
        price: '$4,500,000',
        address: '234 Aspen Grove Lane, Aspen, CO 81611',
        beds: 5,
        baths: 4,
        sqft: '5,200',
        propertyType: 'Chalet',
        estRent: '$18,000',
        capRate: '4.8%',
        annualIncome: '$216,000',
        grossYield: '4.8%',
        images: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
        ],
        description: `Luxurious ski-in/ski-out mountain retreat with stunning views of the Rockies. Features include a gourmet kitchen, spa-like bathrooms, heated floors, and a hot tub on the deck. Perfect for year-round enjoyment with proximity to world-class skiing and hiking trails.`,
    },
    '6': {
        id: '6',
        title: 'Urban Smart Home',
        price: '$3,200/mo',
        address: '890 Pike Street, Seattle, WA 98101',
        beds: 3,
        baths: 3,
        sqft: '2,400',
        propertyType: 'Smart Home',
        estRent: '$3,200',
        capRate: 'N/A',
        annualIncome: '$38,400',
        grossYield: 'Rental',
        images: [
            'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        ],
        description: `State-of-the-art smart home with integrated home automation system. Control lighting, climate, security, and entertainment from your phone. Features include a rooftop deck, electric car charging, and stunning city views. Pet-friendly with nearby parks.`,
    },
    '7': {
        id: '7',
        title: 'Downtown Condo',
        price: '$1,850,000',
        address: '555 Michigan Avenue, Chicago, IL 60611',
        beds: 3,
        baths: 2,
        sqft: '2,100',
        propertyType: 'Condo',
        estRent: '$7,500',
        capRate: '4.9%',
        annualIncome: '$90,000',
        grossYield: '4.9%',
        images: [
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1600',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        ],
        description: `Elegant downtown condo with spectacular lake views. Recently renovated with high-end finishes, hardwood floors, and floor-to-ceiling windows. Building offers doorman, fitness center, pool, and direct access to the Magnificent Mile shopping district.`,
    },
    '8': {
        id: '8',
        title: 'Beachside Bungalow',
        price: '$4,200/mo',
        address: '123 Pacific Coast Hwy, Malibu, CA 90265',
        beds: 4,
        baths: 3,
        sqft: '2,800',
        propertyType: 'Bungalow',
        estRent: '$4,200',
        capRate: 'N/A',
        annualIncome: '$50,400',
        grossYield: 'Rental',
        images: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        ],
        description: `Charming beachside bungalow steps from the sand. Features include an open floor plan, gourmet kitchen, and multiple outdoor living spaces. Watch sunsets from the private deck while listening to the waves. Furnished rental available.`,
    },
    '9': {
        id: '9',
        title: 'Historic Brownstone',
        price: '$2,950,000',
        address: '456 Beacon Street, Boston, MA 02116',
        beds: 4,
        baths: 3,
        sqft: '3,200',
        propertyType: 'Brownstone',
        estRent: '$10,000',
        capRate: '4.1%',
        annualIncome: '$120,000',
        grossYield: '4.1%',
        images: [
            'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1600',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        ],
        description: `Meticulously restored Back Bay brownstone with original architectural details preserved. Features include marble fireplaces, crown moldings, and a chef's kitchen. Private garden, wine cellar, and garage parking. Walking distance to the Public Garden.`,
    },
};

// Default property for unknown IDs
const defaultProperty: PropertyInfo = {
    id: '0',
    title: 'Beautiful Property',
    price: '$725,000',
    address: '1234 Oak Street, San Francisco, CA 94102',
    beds: 3,
    baths: 2,
    sqft: '2,100',
    propertyType: 'Single Family',
    estRent: '$3,200',
    capRate: '5.3%',
    annualIncome: '$38,400',
    grossYield: '5.3%',
    images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
    ],
    description: `Beautiful single-family home in a prime location. This well-maintained property features spacious bedrooms, modern bathrooms, and an open-concept living area perfect for entertaining. Located in a quiet, family-friendly neighborhood with excellent schools.`,
};

interface PropertyInfo {
    id: string;
    title: string;
    price: string;
    address: string;
    beds: number;
    baths: number;
    sqft: string;
    propertyType: string;
    estRent: string;
    capRate: string;
    annualIncome: string;
    grossYield: string;
    images: string[];
    description: string;
}

export default function PropertyDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    // Get property data based on ID
    const property = id ? (propertyData[id] || defaultProperty) : defaultProperty;

    const handleShare = () => {
        navigator.clipboard?.writeText(window.location.href);
        showSuccessToast('Link Copied', 'Property link copied to clipboard!');
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
        if (!isSaved) {
            showSuccessToast('Saved', 'Property added to your saved list');
        } else {
            showInfoToast('Removed', 'Property removed from saved list');
        }
    };

    const handleScheduleViewing = (e: React.FormEvent) => {
        e.preventDefault();
        showSuccessToast('Request Sent', 'Your viewing request has been submitted. An agent will contact you soon.');
    };

    const handleContactAgent = () => {
        showInfoToast('Contact Agent', 'Opening contact options...');
    };

    return (
        <div className="pt-24 pb-12 min-h-screen bg-gray-50">
            <div className="max-w-[1440px] mx-auto px-6">

                {/* Back Navigation */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
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
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{property.price}</h1>
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin size={18} />
                                <span>{property.address}</span>
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

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
                        {/* Main Large Image */}
                        <div className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group">
                            <img
                                src={property.images[activeImage]}
                                alt={property.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Side Images */}
                        {property.images.slice(1, 5).map((img, idx) => (
                            <div
                                key={idx}
                                onClick={() => setActiveImage(idx + 1)}
                                className="relative rounded-2xl overflow-hidden group hidden md:block cursor-pointer"
                            >
                                <img
                                    src={img}
                                    alt={`${property.title} - Image ${idx + 2}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                {idx === 3 && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/50 transition-colors">
                                        <span className="text-white font-semibold text-lg">+{property.images.length - 4} Photos</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Quick Stats Strip */}
                    <div className="flex flex-wrap gap-8 py-6 border-y border-gray-200">
                        <div className="flex items-center gap-2">
                            <Bed className="text-emerald-600" size={24} />
                            <div>
                                <span className="font-bold text-gray-900 block">{property.beds} Beds</span>
                                <span className="text-sm text-gray-500">Bedroom</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Bath className="text-emerald-600" size={24} />
                            <div>
                                <span className="font-bold text-gray-900 block">{property.baths} Baths</span>
                                <span className="text-sm text-gray-500">Bathroom</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Maximize className="text-emerald-600" size={24} />
                            <div>
                                <span className="font-bold text-gray-900 block">{property.sqft} sqft</span>
                                <span className="text-sm text-gray-500">Living Area</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Home className="text-emerald-600" size={24} />
                            <div>
                                <span className="font-bold text-gray-900 block">{property.propertyType}</span>
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
                                    <div className="text-2xl font-bold text-emerald-900">{property.estRent}</div>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-4">
                                    <div className="text-sm text-emerald-800 font-medium mb-1">Cap Rate</div>
                                    <div className="text-2xl font-bold text-emerald-900">{property.capRate}</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="text-sm text-gray-600 font-medium mb-1">Annual Income</div>
                                    <div className="text-2xl font-bold text-gray-900">{property.annualIncome}</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="text-sm text-gray-600 font-medium mb-1">Gross Yield</div>
                                    <div className="text-2xl font-bold text-gray-900">{property.grossYield}</div>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Property</h2>
                            <div className="prose prose-slate max-w-none text-gray-600">
                                <p>{property.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Contact Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-28">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Schedule a Viewing</h3>

                            <form onSubmit={handleScheduleViewing} className="space-y-4">
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
                                <button
                                    type="button"
                                    onClick={handleContactAgent}
                                    className="w-full bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold py-3.5 rounded-xl transition-colors"
                                >
                                    Contact Agent
                                </button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full overflow-hidden flex items-center justify-center">
                                    <span className="text-emerald-600 font-bold text-lg">SJ</span>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">Sarah Johnson</div>
                                    <div className="text-sm text-gray-500">Licensed Agent</div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    sarah.j@gradea.realty
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
