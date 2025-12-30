import React from 'react';
import { Navigation } from '../Navigation';
import { Hero } from '../Hero';
import { IntentCard } from '../IntentCard';
import { TrustStrip } from '../TrustStrip';
import { Home, Building, Key, Briefcase, TrendingUp } from 'lucide-react';

export function Homepage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      
      {/* Intent Cards Section */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <IntentCard
            icon={<Home size={40} />}
            title="Buy a Home"
            action="Explore Homes"
            onClick={() => console.log('Navigate to Buy')}
          />
          <IntentCard
            icon={<Building size={40} />}
            title="Rent a Home"
            action="View Rentals"
            onClick={() => console.log('Navigate to Rent')}
          />
          <IntentCard
            icon={<Key size={40} />}
            title="Sell a Property"
            action="Start Selling"
            onClick={() => console.log('Navigate to Sell')}
          />
          <IntentCard
            icon={<Briefcase size={40} />}
            title="Manage My Property"
            action="Owner Services"
            onClick={() => console.log('Navigate to Manage')}
          />
          <IntentCard
            icon={<TrendingUp size={40} />}
            title="Invest in Real Estate"
            action="Explore Investments"
            onClick={() => console.log('Navigate to Invest')}
          />
        </div>
      </div>

      <TrustStrip />

      {/* Additional Content Section */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-semibold text-[var(--gray-900)] mb-4">
            Why Choose Estate Platform
          </h2>
          <p className="text-lg text-[var(--gray-600)] max-w-2xl mx-auto">
            The most comprehensive real estate solution for modern property management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[var(--gray-50)] rounded-2xl p-8">
            <div className="w-12 h-12 bg-[var(--emerald-100)] rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-[var(--emerald-700)] rounded"></div>
            </div>
            <h3 className="text-xl font-semibold text-[var(--gray-900)] mb-3">
              Trusted Platform
            </h3>
            <p className="text-[var(--gray-600)]">
              Industry-leading security and compliance standards protect your transactions and data.
            </p>
          </div>

          <div className="bg-[var(--gray-50)] rounded-2xl p-8">
            <div className="w-12 h-12 bg-[var(--emerald-100)] rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-[var(--emerald-700)] rounded"></div>
            </div>
            <h3 className="text-xl font-semibold text-[var(--gray-900)] mb-3">
              Expert Support
            </h3>
            <p className="text-[var(--gray-600)]">
              Dedicated real estate professionals available 24/7 to guide you through every step.
            </p>
          </div>

          <div className="bg-[var(--gray-50)] rounded-2xl p-8">
            <div className="w-12 h-12 bg-[var(--emerald-100)] rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-[var(--emerald-700)] rounded"></div>
            </div>
            <h3 className="text-xl font-semibold text-[var(--gray-900)] mb-3">
              Smart Analytics
            </h3>
            <p className="text-[var(--gray-600)]">
              Data-driven insights help you make informed decisions and maximize returns.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[var(--gray-900)] text-white py-12">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-semibold text-[var(--emerald-400)] mb-4">Estate</div>
              <p className="text-[var(--gray-400)]">
                Your trusted partner in real estate.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-[var(--gray-400)]">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-[var(--gray-400)]">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Market Reports</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-[var(--gray-400)]">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--gray-800)] pt-8 text-center text-[var(--gray-400)]">
            <p>&copy; 2025 Estate Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
