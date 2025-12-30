import React from 'react';
import { Home, Building, Key, Briefcase, TrendingUp, Check } from 'lucide-react';

export function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <h1 className="text-4xl font-semibold text-[var(--gray-900)] mb-12">Style Guide</h1>

        {/* Colors */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[var(--gray-900)] mb-6">Color Palette</h2>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-[var(--gray-700)] mb-4">Primary - Deep Emerald</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[var(--emerald-50)] border border-[var(--gray-200)]"></div>
                <div className="text-sm text-[var(--gray-600)]">Emerald 50</div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[var(--emerald-100)] border border-[var(--gray-200)]"></div>
                <div className="text-sm text-[var(--gray-600)]">Emerald 100</div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[var(--emerald-600)]"></div>
                <div className="text-sm text-[var(--gray-600)]">Emerald 600</div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[var(--emerald-700)]"></div>
                <div className="text-sm text-[var(--gray-600)]">Emerald 700</div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[var(--emerald-800)]"></div>
                <div className="text-sm text-[var(--gray-600)]">Emerald 800</div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[var(--emerald-900)]"></div>
                <div className="text-sm text-[var(--gray-600)]">Emerald 900</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-[var(--gray-700)] mb-4">Accent - Subtle Gold</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[var(--gold-400)]"></div>
                <div className="text-sm text-[var(--gray-600)]">Gold 400</div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[var(--gold-500)]"></div>
                <div className="text-sm text-[var(--gray-600)]">Gold 500</div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[var(--gold-600)]"></div>
                <div className="text-sm text-[var(--gray-600)]">Gold 600</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[var(--gray-700)] mb-4">Neutral - Grays</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={shade} className="space-y-2">
                  <div className={`h-20 rounded-lg bg-[var(--gray-${shade})]`}></div>
                  <div className="text-sm text-[var(--gray-600)]">Gray {shade}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[var(--gray-900)] mb-6">Typography</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
            <div>
              <div className="text-sm text-[var(--gray-500)] mb-2">Display / 48px</div>
              <div className="text-5xl font-semibold text-[var(--gray-900)]">
                Premium Real Estate Platform
              </div>
            </div>
            <div>
              <div className="text-sm text-[var(--gray-500)] mb-2">Heading 1 / 36px</div>
              <h1 className="text-4xl font-semibold text-[var(--gray-900)]">
                Find Your Dream Property
              </h1>
            </div>
            <div>
              <div className="text-sm text-[var(--gray-500)] mb-2">Heading 2 / 30px</div>
              <h2 className="text-3xl font-semibold text-[var(--gray-900)]">
                Featured Listings
              </h2>
            </div>
            <div>
              <div className="text-sm text-[var(--gray-500)] mb-2">Heading 3 / 24px</div>
              <h3 className="text-2xl font-semibold text-[var(--gray-900)]">
                Property Details
              </h3>
            </div>
            <div>
              <div className="text-sm text-[var(--gray-500)] mb-2">Body / 16px Regular</div>
              <p className="text-base text-[var(--gray-700)]">
                A unified platform trusted by homeowners, investors, and tenants to manage every stage of the real estate lifecycle.
              </p>
            </div>
            <div>
              <div className="text-sm text-[var(--gray-500)] mb-2">Body / 16px Medium</div>
              <p className="text-base font-medium text-[var(--gray-700)]">
                Premium corporate spacing and calm aesthetic
              </p>
            </div>
            <div>
              <div className="text-sm text-[var(--gray-500)] mb-2">Small / 14px</div>
              <p className="text-sm text-[var(--gray-600)]">
                Based on listed monthly rent. Excludes expenses and vacancies.
              </p>
            </div>
          </div>
        </section>

        {/* Icons */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[var(--gray-900)] mb-6">Icon System</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-4 bg-[var(--emerald-50)] rounded-xl text-[var(--emerald-700)]">
                  <Home size={32} />
                </div>
                <span className="text-sm text-[var(--gray-600)]">Buy a Home</span>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="p-4 bg-[var(--emerald-50)] rounded-xl text-[var(--emerald-700)]">
                  <Building size={32} />
                </div>
                <span className="text-sm text-[var(--gray-600)]">Rent a Home</span>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="p-4 bg-[var(--emerald-50)] rounded-xl text-[var(--emerald-700)]">
                  <Key size={32} />
                </div>
                <span className="text-sm text-[var(--gray-600)]">Sell Property</span>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="p-4 bg-[var(--emerald-50)] rounded-xl text-[var(--emerald-700)]">
                  <Briefcase size={32} />
                </div>
                <span className="text-sm text-[var(--gray-600)]">Manage</span>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="p-4 bg-[var(--emerald-50)] rounded-xl text-[var(--emerald-700)]">
                  <TrendingUp size={32} />
                </div>
                <span className="text-sm text-[var(--gray-600)]">Invest</span>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section>
          <h2 className="text-2xl font-semibold text-[var(--gray-900)] mb-6">Spacing Scale</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-[var(--gray-600)]">4px</div>
              <div className="h-8 w-1 bg-[var(--emerald-700)]"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-[var(--gray-600)]">8px</div>
              <div className="h-8 w-2 bg-[var(--emerald-700)]"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-[var(--gray-600)]">12px</div>
              <div className="h-8 w-3 bg-[var(--emerald-700)]"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-[var(--gray-600)]">16px</div>
              <div className="h-8 w-4 bg-[var(--emerald-700)]"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-[var(--gray-600)]">24px</div>
              <div className="h-8 w-6 bg-[var(--emerald-700)]"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-[var(--gray-600)]">32px</div>
              <div className="h-8 w-8 bg-[var(--emerald-700)]"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-[var(--gray-600)]">48px</div>
              <div className="h-8 w-12 bg-[var(--emerald-700)]"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-[var(--gray-600)]">64px</div>
              <div className="h-8 w-16 bg-[var(--emerald-700)]"></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
