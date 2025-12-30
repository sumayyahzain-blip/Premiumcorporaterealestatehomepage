import React, { useState } from 'react';
import { StyleGuidePage } from './components/pages/StyleGuide';
import { ComponentsPage } from './components/pages/Components';
import { Homepage } from './components/pages/Homepage';
import { BuyListingPage } from './components/pages/BuyListing';
import { RentListingPage } from './components/pages/RentListing';
import { PropertyDetailPage } from './components/pages/PropertyDetail';
import { OwnerDashboardPage } from './components/pages/OwnerDashboard';
import { PricingPage } from './components/pages/Pricing';
import { MobileHomepage } from './components/pages/MobileHomepage';
import { MobilePropertyListing } from './components/pages/MobilePropertyListing';

type Page = 'style-guide' | 'components' | 'homepage' | 'buy-listing' | 'rent-listing' | 'property-detail' | 'owner-dashboard' | 'pricing' | 'mobile-home' | 'mobile-listing';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('homepage');

  const renderPage = () => {
    switch (currentPage) {
      case 'style-guide':
        return <StyleGuidePage />;
      case 'components':
        return <ComponentsPage />;
      case 'homepage':
        return <Homepage />;
      case 'buy-listing':
        return <BuyListingPage />;
      case 'rent-listing':
        return <RentListingPage />;
      case 'property-detail':
        return <PropertyDetailPage />;
      case 'owner-dashboard':
        return <OwnerDashboardPage />;
      case 'pricing':
        return <PricingPage />;
      case 'mobile-home':
        return <MobileHomepage />;
      case 'mobile-listing':
        return <MobilePropertyListing />;
      default:
        return <Homepage />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Navigation Menu */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-[var(--gray-900)] text-white rounded-2xl shadow-2xl p-4 max-w-[90vw] overflow-auto max-h-[80vh]">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/20">
            <div className="w-3 h-3 bg-[var(--emerald-500)] rounded-full"></div>
            <span className="text-sm font-medium">Design System Navigator</span>
          </div>
          
          <div className="mb-3">
            <div className="text-xs text-white/60 mb-2">Desktop Screens</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCurrentPage('homepage')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  currentPage === 'homepage'
                    ? 'bg-[var(--emerald-600)] text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                Homepage
              </button>
              <button
                onClick={() => setCurrentPage('buy-listing')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  currentPage === 'buy-listing'
                    ? 'bg-[var(--emerald-600)] text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                Buy Listing
              </button>
              <button
                onClick={() => setCurrentPage('rent-listing')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  currentPage === 'rent-listing'
                    ? 'bg-[var(--emerald-600)] text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                Rent Listing
              </button>
              <button
                onClick={() => setCurrentPage('property-detail')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  currentPage === 'property-detail'
                    ? 'bg-[var(--emerald-600)] text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                Property Detail
              </button>
              <button
                onClick={() => setCurrentPage('owner-dashboard')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  currentPage === 'owner-dashboard'
                    ? 'bg-[var(--emerald-600)] text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                Owner Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('pricing')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  currentPage === 'pricing'
                    ? 'bg-[var(--emerald-600)] text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                Pricing
              </button>
            </div>
          </div>

          <div className="mb-3">
            <div className="text-xs text-white/60 mb-2">Mobile Screens (430px)</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCurrentPage('mobile-home')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  currentPage === 'mobile-home'
                    ? 'bg-[var(--emerald-600)] text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                📱 Mobile Home
              </button>
              <button
                onClick={() => setCurrentPage('mobile-listing')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  currentPage === 'mobile-listing'
                    ? 'bg-[var(--emerald-600)] text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                📱 Mobile Listing
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs text-white/60 mb-2">Design System</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCurrentPage('components')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  currentPage === 'components'
                    ? 'bg-[var(--emerald-600)] text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                Components
              </button>
              <button
                onClick={() => setCurrentPage('style-guide')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  currentPage === 'style-guide'
                    ? 'bg-[var(--emerald-600)] text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                Style Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Current Page */}
      {renderPage()}
    </div>
  );
}

export default App;