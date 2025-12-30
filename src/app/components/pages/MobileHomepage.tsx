import React from 'react';
import { Home, Building, Key, Briefcase, TrendingUp, ChevronRight, Menu } from 'lucide-react';

export function MobileHomepage() {
  return (
    <div className="min-h-screen bg-white w-full max-w-[430px] mx-auto">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[var(--gray-200)] px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-[var(--emerald-800)]">Estate</span>
          <button className="p-2">
            <Menu size={24} className="text-[var(--gray-700)]" />
          </button>
        </div>
      </header>

      {/* Mobile Hero */}
      <div className="px-4 py-8 bg-gradient-to-br from-[var(--emerald-50)] to-white">
        <h1 className="text-3xl font-semibold text-[var(--gray-900)] mb-3 leading-tight">
          A Smarter Way to Own, Rent, and Grow
        </h1>
        <p className="text-base text-[var(--gray-600)] mb-6">
          Manage every stage of the real estate lifecycle.
        </p>
        <button className="w-full bg-[var(--gold-500)] hover:bg-[var(--gold-600)] text-white px-6 py-3 rounded-lg transition-all">
          Get Started
        </button>
      </div>

      {/* Mobile Intent Cards */}
      <div className="px-4 py-8 space-y-3">
        <h2 className="text-xl font-semibold text-[var(--gray-900)] mb-4">What would you like to do?</h2>
        
        <button className="w-full bg-white border border-[var(--gray-200)] rounded-xl p-4 hover:border-[var(--emerald-600)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--emerald-50)] rounded-lg text-[var(--emerald-700)]">
                <Home size={24} />
              </div>
              <div className="text-left">
                <div className="font-medium text-[var(--gray-900)]">Buy a Home</div>
                <div className="text-sm text-[var(--gray-600)]">Explore homes</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-[var(--gray-400)]" />
          </div>
        </button>

        <button className="w-full bg-white border border-[var(--gray-200)] rounded-xl p-4 hover:border-[var(--emerald-600)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--emerald-50)] rounded-lg text-[var(--emerald-700)]">
                <Building size={24} />
              </div>
              <div className="text-left">
                <div className="font-medium text-[var(--gray-900)]">Rent a Home</div>
                <div className="text-sm text-[var(--gray-600)]">View rentals</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-[var(--gray-400)]" />
          </div>
        </button>

        <button className="w-full bg-white border border-[var(--gray-200)] rounded-xl p-4 hover:border-[var(--emerald-600)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--emerald-50)] rounded-lg text-[var(--emerald-700)]">
                <Key size={24} />
              </div>
              <div className="text-left">
                <div className="font-medium text-[var(--gray-900)]">Sell a Property</div>
                <div className="text-sm text-[var(--gray-600)]">Start selling</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-[var(--gray-400)]" />
          </div>
        </button>

        <button className="w-full bg-white border border-[var(--gray-200)] rounded-xl p-4 hover:border-[var(--emerald-600)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--emerald-50)] rounded-lg text-[var(--emerald-700)]">
                <Briefcase size={24} />
              </div>
              <div className="text-left">
                <div className="font-medium text-[var(--gray-900)]">Manage Property</div>
                <div className="text-sm text-[var(--gray-600)]">Owner services</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-[var(--gray-400)]" />
          </div>
        </button>

        <button className="w-full bg-white border border-[var(--gray-200)] rounded-xl p-4 hover:border-[var(--emerald-600)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--emerald-50)] rounded-lg text-[var(--emerald-700)]">
                <TrendingUp size={24} />
              </div>
              <div className="text-left">
                <div className="font-medium text-[var(--gray-900)]">Invest in Real Estate</div>
                <div className="text-sm text-[var(--gray-600)]">Explore investments</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-[var(--gray-400)]" />
          </div>
        </button>
      </div>

      {/* Mobile Trust Strip */}
      <div className="px-4 py-8 bg-[var(--gray-50)]">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-[var(--gray-900)] mb-1">50K+</div>
            <div className="text-sm text-[var(--gray-600)]">Properties</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-[var(--gray-900)] mb-1">100K+</div>
            <div className="text-sm text-[var(--gray-600)]">Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-[var(--gray-900)] mb-1">$2.5B+</div>
            <div className="text-sm text-[var(--gray-600)]">Volume</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-[var(--gray-900)] mb-1">98%</div>
            <div className="text-sm text-[var(--gray-600)]">Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Mobile Features */}
      <div className="px-4 py-8">
        <h2 className="text-xl font-semibold text-[var(--gray-900)] mb-6">Why Choose Estate</h2>
        <div className="space-y-4">
          <div className="bg-[var(--gray-50)] rounded-xl p-6">
            <div className="w-10 h-10 bg-[var(--emerald-100)] rounded-lg flex items-center justify-center mb-3">
              <div className="w-5 h-5 bg-[var(--emerald-700)] rounded"></div>
            </div>
            <h3 className="font-semibold text-[var(--gray-900)] mb-2">
              Trusted Platform
            </h3>
            <p className="text-sm text-[var(--gray-600)]">
              Industry-leading security standards protect your transactions.
            </p>
          </div>

          <div className="bg-[var(--gray-50)] rounded-xl p-6">
            <div className="w-10 h-10 bg-[var(--emerald-100)] rounded-lg flex items-center justify-center mb-3">
              <div className="w-5 h-5 bg-[var(--emerald-700)] rounded"></div>
            </div>
            <h3 className="font-semibold text-[var(--gray-900)] mb-2">
              Expert Support
            </h3>
            <p className="text-sm text-[var(--gray-600)]">
              Real estate professionals available 24/7 to help you.
            </p>
          </div>

          <div className="bg-[var(--gray-50)] rounded-xl p-6">
            <div className="w-10 h-10 bg-[var(--emerald-100)] rounded-lg flex items-center justify-center mb-3">
              <div className="w-5 h-5 bg-[var(--emerald-700)] rounded"></div>
            </div>
            <h3 className="font-semibold text-[var(--gray-900)] mb-2">
              Smart Analytics
            </h3>
            <p className="text-sm text-[var(--gray-600)]">
              Data-driven insights for informed decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <footer className="bg-[var(--gray-900)] text-white px-4 py-8">
        <div className="text-xl font-semibold text-[var(--emerald-400)] mb-4">Estate</div>
        <div className="space-y-6 mb-8">
          <div>
            <h4 className="font-medium mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-[var(--gray-400)]">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-[var(--gray-400)]">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Market Reports</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--gray-800)] pt-6 text-sm text-[var(--gray-400)] text-center">
          <p>&copy; 2025 Estate Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
