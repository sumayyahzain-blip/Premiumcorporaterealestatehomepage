import React, { useState } from 'react';
import { Navigation } from '../Navigation';
import { PropertyCard } from '../PropertyCard';
import { ChevronDown, Filter, MapPin, Grid, List, Bell, Lock } from 'lucide-react';
import { UpgradeModal } from '../UpgradeModal';

export function BuyListingPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [upgradeModal, setUpgradeModal] = useState<'yield' | 'alerts' | 'export' | null>(null);

  const properties = [
    {
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      price: '$725,000',
      address: '1234 Oak Street, San Francisco, CA 94102',
      beds: 3,
      baths: 2,
      sqft: 2100,
      estRent: '$3,200',
      capRate: '5.3%'
    },
    {
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      price: '$890,000',
      address: '567 Pine Avenue, Seattle, WA 98101',
      beds: 4,
      baths: 3,
      sqft: 2800,
      estRent: '$4,100',
      capRate: '5.5%'
    },
    {
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      price: '$650,000',
      address: '890 Maple Drive, Austin, TX 78701',
      beds: 3,
      baths: 2.5,
      sqft: 2300,
      estRent: '$2,900',
      capRate: '5.4%'
    },
    {
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
      price: '$1,150,000',
      address: '234 Elm Street, Portland, OR 97201',
      beds: 4,
      baths: 3.5,
      sqft: 3200,
      estRent: '$5,200',
      capRate: '5.4%'
    },
    {
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      price: '$825,000',
      address: '456 Birch Lane, Denver, CO 80202',
      beds: 3,
      baths: 2.5,
      sqft: 2500,
      estRent: '$3,800',
      capRate: '5.5%'
    },
    {
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
      price: '$975,000',
      address: '789 Cedar Court, Boston, MA 02108',
      beds: 4,
      baths: 3,
      sqft: 2900,
      estRent: '$4,500',
      capRate: '5.5%'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <Navigation />

      {/* Header */}
      <div className="bg-white border-b border-[var(--gray-200)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
          <h1 className="text-3xl font-semibold text-[var(--gray-900)] mb-2">
            Homes for Sale
          </h1>
          <p className="text-[var(--gray-600)]">
            {properties.length} properties available
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--gray-900)]">Filters</h2>
                <button className="text-sm text-[var(--emerald-700)] hover:text-[var(--emerald-800)]">
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City, State, or ZIP"
                    className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--emerald-600)]"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Min"
                      className="px-4 py-2 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--emerald-600)]"
                    />
                    <input
                      type="text"
                      placeholder="Max"
                      className="px-4 py-2 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--emerald-600)]"
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    Bedrooms
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['1', '2', '3', '4+'].map((num) => (
                      <button
                        key={num}
                        className="px-3 py-2 border border-[var(--gray-300)] rounded-lg hover:border-[var(--emerald-600)] hover:bg-[var(--emerald-50)] transition-all text-sm"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    Bathrooms
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['1', '2', '3', '4+'].map((num) => (
                      <button
                        key={num}
                        className="px-3 py-2 border border-[var(--gray-300)] rounded-lg hover:border-[var(--emerald-600)] hover:bg-[var(--emerald-50)] transition-all text-sm"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    Property Type
                  </label>
                  <div className="space-y-2">
                    {['Single Family', 'Condo', 'Townhouse', 'Multi-family'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[var(--emerald-700)] rounded focus:ring-[var(--emerald-600)]"
                        />
                        <span className="ml-2 text-sm text-[var(--gray-700)]">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-[var(--emerald-700)] hover:bg-[var(--emerald-800)] text-white py-3 rounded-lg transition-all font-medium">
                  Apply Filters
                </button>
              </div>
              
              {/* Track Area Alerts Upgrade */}
              <div className="mt-6 p-4 bg-gradient-to-br from-[var(--emerald-50)] to-[var(--gold-50)] rounded-xl border border-[var(--emerald-200)]">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Bell size={20} className="text-[var(--emerald-600)]" />
                  </div>
                  <div>
                    <div className="font-medium text-[var(--gray-900)] mb-1">Get Instant Alerts</div>
                    <div className="text-sm text-[var(--gray-600)]">
                      Save your search and receive notifications for new listings
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setUpgradeModal('alerts')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--emerald-600)] hover:bg-[var(--emerald-700)] text-white rounded-lg transition-colors text-sm"
                >
                  <Lock size={14} />
                  Enable Alerts
                </button>
              </div>
            </div>
          </aside>

          {/* Listings */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 border border-[var(--gray-300)] rounded-lg hover:border-[var(--emerald-600)] transition-all">
                  <Filter size={18} />
                  Sort
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[var(--emerald-700)] text-white'
                      : 'text-[var(--gray-600)] hover:bg-[var(--gray-100)]'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-[var(--emerald-700)] text-white'
                      : 'text-[var(--gray-600)] hover:bg-[var(--gray-100)]'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Property Grid */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              {properties.map((property, index) => (
                <PropertyCard
                  key={index}
                  type="buy"
                  image={property.image}
                  price={property.price}
                  address={property.address}
                  beds={property.beds}
                  baths={property.baths}
                  sqft={property.sqft}
                  estRent={property.estRent}
                  capRate={property.capRate}
                  onClick={() => console.log('View property', index)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-[var(--gray-300)] rounded-lg hover:bg-[var(--gray-100)] transition-all">
                  Previous
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      page === 1
                        ? 'bg-[var(--emerald-700)] text-white'
                        : 'border border-[var(--gray-300)] hover:bg-[var(--gray-100)]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-4 py-2 border border-[var(--gray-300)] rounded-lg hover:bg-[var(--gray-100)] transition-all">
                  Next
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModal !== null}
        onClose={() => setUpgradeModal(null)}
        feature={upgradeModal}
      />
    </div>
  );
}
