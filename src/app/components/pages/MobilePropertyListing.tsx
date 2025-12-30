import React, { useState } from 'react';
import { ArrowLeft, Filter, Heart, Bed, Bath, Maximize } from 'lucide-react';

export function MobilePropertyListing() {
  const [saved, setSaved] = useState<{ [key: number]: boolean }>({});

  const properties = [
    {
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      price: '$725,000',
      address: '1234 Oak Street, San Francisco, CA',
      beds: 3,
      baths: 2,
      sqft: 2100
    },
    {
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      price: '$890,000',
      address: '567 Pine Avenue, Seattle, WA',
      beds: 4,
      baths: 3,
      sqft: 2800
    },
    {
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      price: '$650,000',
      address: '890 Maple Drive, Austin, TX',
      beds: 3,
      baths: 2.5,
      sqft: 2300
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--gray-50)] w-full max-w-[430px] mx-auto">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[var(--gray-200)] px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 -ml-2">
            <ArrowLeft size={24} className="text-[var(--gray-700)]" />
          </button>
          <span className="font-semibold text-[var(--gray-900)]">Homes for Sale</span>
          <button className="p-2 -mr-2">
            <Filter size={24} className="text-[var(--gray-700)]" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search location..."
            className="w-full px-4 py-3 bg-[var(--gray-100)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--emerald-600)]"
          />
        </div>
      </header>

      {/* Filter Pills */}
      <div className="px-4 py-4 bg-white border-b border-[var(--gray-200)] overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button className="px-4 py-2 bg-[var(--emerald-700)] text-white rounded-full text-sm whitespace-nowrap">
            All
          </button>
          <button className="px-4 py-2 bg-[var(--gray-100)] text-[var(--gray-700)] rounded-full text-sm whitespace-nowrap hover:bg-[var(--gray-200)]">
            Under $500K
          </button>
          <button className="px-4 py-2 bg-[var(--gray-100)] text-[var(--gray-700)] rounded-full text-sm whitespace-nowrap hover:bg-[var(--gray-200)]">
            3+ Beds
          </button>
          <button className="px-4 py-2 bg-[var(--gray-100)] text-[var(--gray-700)] rounded-full text-sm whitespace-nowrap hover:bg-[var(--gray-200)]">
            New Listings
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 py-3 bg-white">
        <p className="text-sm text-[var(--gray-600)]">{properties.length} properties found</p>
      </div>

      {/* Property List */}
      <div className="px-4 py-4 space-y-4">
        {properties.map((property, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Image */}
            <div className="relative aspect-[16/9]">
              <img
                src={property.image}
                alt={property.address}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSaved({ ...saved, [index]: !saved[index] })}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full"
              >
                <Heart
                  size={20}
                  className={`transition-colors ${
                    saved[index] ? 'fill-red-500 text-red-500' : 'text-[var(--gray-700)]'
                  }`}
                />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="text-xl font-semibold text-[var(--gray-900)] mb-2">
                {property.price}
              </div>
              <div className="text-sm text-[var(--gray-700)] mb-3">
                {property.address}
              </div>
              <div className="flex items-center gap-4 text-sm text-[var(--gray-600)]">
                <div className="flex items-center gap-1">
                  <Bed size={16} />
                  <span>{property.beds}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath size={16} />
                  <span>{property.baths}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Maximize size={16} />
                  <span>{property.sqft.toLocaleString()} sqft</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="px-4 py-6">
        <button className="w-full py-3 border border-[var(--gray-300)] rounded-lg text-[var(--gray-700)] hover:bg-[var(--gray-50)] transition-all">
          Load More Properties
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--gray-200)] px-4 py-3 max-w-[430px] mx-auto">
        <div className="flex items-center justify-between">
          <button className="flex-1 text-center py-2 text-[var(--gray-600)]">
            <div className="text-xs">Search</div>
          </button>
          <button className="flex-1 text-center py-2 text-[var(--emerald-700)]">
            <div className="text-xs font-medium">Browse</div>
          </button>
          <button className="flex-1 text-center py-2 text-[var(--gray-600)]">
            <div className="text-xs">Saved</div>
          </button>
          <button className="flex-1 text-center py-2 text-[var(--gray-600)]">
            <div className="text-xs">Account</div>
          </button>
        </div>
      </div>
    </div>
  );
}
