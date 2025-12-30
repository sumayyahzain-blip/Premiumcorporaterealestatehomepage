import React from 'react';
import { Home, Building, Key, Briefcase, TrendingUp, Info } from 'lucide-react';
import { IntentCard } from '../IntentCard';
import { PropertyCard } from '../PropertyCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export function ComponentsPage() {
  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <h1 className="text-4xl font-semibold text-[var(--gray-900)] mb-12">Component Library</h1>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[var(--gray-900)] mb-6">Buttons</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="space-y-6">
              <div>
                <div className="text-sm text-[var(--gray-600)] mb-3">Primary Button (Gold CTA)</div>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-[var(--gold-500)] hover:bg-[var(--gold-600)] text-white px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md font-medium">
                    Get Started
                  </button>
                  <button className="bg-[var(--gold-500)] hover:bg-[var(--gold-600)] text-white px-8 py-4 rounded-lg transition-all shadow-md hover:shadow-lg font-medium text-lg">
                    Get Started (Large)
                  </button>
                </div>
              </div>

              <div>
                <div className="text-sm text-[var(--gray-600)] mb-3">Secondary Button (Emerald)</div>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-[var(--emerald-700)] hover:bg-[var(--emerald-800)] text-white px-6 py-3 rounded-lg transition-all font-medium">
                    View Details
                  </button>
                  <button className="bg-[var(--emerald-600)] hover:bg-[var(--emerald-700)] text-white px-6 py-3 rounded-lg transition-all font-medium">
                    Explore Homes
                  </button>
                </div>
              </div>

              <div>
                <div className="text-sm text-[var(--gray-600)] mb-3">Ghost Button</div>
                <div className="flex flex-wrap gap-4">
                  <button className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors px-4 py-2 font-medium">
                    Login
                  </button>
                  <button className="text-[var(--gray-700)] hover:bg-[var(--gray-100)] px-4 py-2 rounded-lg transition-all font-medium">
                    Cancel
                  </button>
                </div>
              </div>

              <div>
                <div className="text-sm text-[var(--gray-600)] mb-3">Outline Button</div>
                <div className="flex flex-wrap gap-4">
                  <button className="border-2 border-[var(--emerald-700)] text-[var(--emerald-700)] hover:bg-[var(--emerald-700)] hover:text-white px-6 py-3 rounded-lg transition-all font-medium">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Intent Cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[var(--gray-900)] mb-6">Intent Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <IntentCard
              icon={<Home size={40} />}
              title="Buy a Home"
              action="Explore Homes"
            />
            <IntentCard
              icon={<Building size={40} />}
              title="Rent a Home"
              action="View Rentals"
            />
            <IntentCard
              icon={<Key size={40} />}
              title="Sell a Property"
              action="Start Selling"
            />
            <IntentCard
              icon={<Briefcase size={40} />}
              title="Manage My Property"
              action="Owner Services"
            />
            <IntentCard
              icon={<TrendingUp size={40} />}
              title="Invest in Real Estate"
              action="Explore Investments"
            />
          </div>
        </section>

        {/* Property Cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[var(--gray-900)] mb-6">Property Cards - Buy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PropertyCard
              type="buy"
              image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
              price="$725,000"
              address="1234 Oak Street, San Francisco, CA"
              beds={3}
              baths={2}
              sqft={2100}
              estRent="$3,200"
              capRate="5.3%"
            />
            <PropertyCard
              type="buy"
              image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
              price="$890,000"
              address="567 Pine Avenue, Seattle, WA"
              beds={4}
              baths={3}
              sqft={2800}
              estRent="$4,100"
              capRate="5.5%"
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[var(--gray-900)] mb-6">Property Cards - Rent</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PropertyCard
              type="rent"
              image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
              price="$2,800"
              monthlyRent="$2,800"
              address="890 Maple Drive, Austin, TX"
              beds={2}
              baths={2}
              sqft={1500}
              leaseTerm="12 months"
              availability="Available Now"
              estYearIncome="$33,600"
            />
            <PropertyCard
              type="rent"
              image="https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80"
              price="$3,500"
              monthlyRent="$3,500"
              address="234 Elm Street, Portland, OR"
              beds={3}
              baths={2.5}
              sqft={1900}
              leaseTerm="12-24 months"
              availability="Jan 15, 2025"
              estYearIncome="$42,000"
            />
          </div>
        </section>

        {/* Form Elements */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[var(--gray-900)] mb-6">Form Elements</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm max-w-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                  Property Type
                </label>
                <select className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--emerald-600)] focus:border-transparent transition-all">
                  <option>Select property type</option>
                  <option>Single Family Home</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                  <option>Multi-family</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter city or zip code"
                  className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--emerald-600)] focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    Min Price
                  </label>
                  <input
                    type="text"
                    placeholder="$0"
                    className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--emerald-600)] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    Max Price
                  </label>
                  <input
                    type="text"
                    placeholder="No max"
                    className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--emerald-600)] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                  Bedrooms
                </label>
                <div className="flex gap-2">
                  {['1', '2', '3', '4', '5+'].map((num) => (
                    <button
                      key={num}
                      className="flex-1 px-4 py-3 border border-[var(--gray-300)] rounded-lg hover:border-[var(--emerald-600)] hover:bg-[var(--emerald-50)] transition-all"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full bg-[var(--emerald-700)] hover:bg-[var(--emerald-800)] text-white py-3 rounded-lg transition-all font-medium">
                Search Properties
              </button>
            </div>
          </div>
        </section>

        {/* Navigation Example */}
        <section>
          <h2 className="text-2xl font-semibold text-[var(--gray-900)] mb-6">Navigation</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-semibold text-[var(--emerald-800)]">Estate</div>
              <div className="flex items-center space-x-8">
                <a href="#" className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors">
                  Buy
                </a>
                <a href="#" className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors">
                  Rent
                </a>
                <a href="#" className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors">
                  Sell
                </a>
                <button className="bg-[var(--gold-500)] hover:bg-[var(--gold-600)] text-white px-6 py-2 rounded-lg transition-all">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
