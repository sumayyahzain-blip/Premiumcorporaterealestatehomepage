import React, { useState } from 'react';
import { Navigation } from '../Navigation';
import { Heart, Share2, MapPin, Bed, Bath, Maximize, Calendar, DollarSign, TrendingUp, Home, Lock, Info } from 'lucide-react';
import { UpgradeModal } from '../UpgradeModal';

export function PropertyDetailPage() {
  const [saved, setSaved] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState<'yield' | 'alerts' | 'export' | null>(null);

  const images = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80'
  ];

  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <Navigation />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-[var(--gray-200)] mb-4">
            <img
              src={images[currentImage]}
              alt="Property"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 right-6 flex gap-2">
              <button
                onClick={() => setSaved(!saved)}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-all shadow-lg"
              >
                <Heart
                  size={24}
                  className={`transition-colors ${saved ? 'fill-red-500 text-red-500' : 'text-[var(--gray-700)]'}`}
                />
              </button>
              <button className="p-3 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-all shadow-lg">
                <Share2 size={24} className="text-[var(--gray-700)]" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`aspect-[16/9] rounded-lg overflow-hidden ${
                  currentImage === index ? 'ring-4 ring-[var(--emerald-600)]' : ''
                }`}
              >
                <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="text-4xl font-semibold text-[var(--gray-900)] mb-4">
                $725,000
              </div>
              <div className="flex items-start gap-2 text-[var(--gray-700)] mb-6">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span>1234 Oak Street, San Francisco, CA 94102</span>
              </div>
              <div className="flex items-center gap-8 text-[var(--gray-700)]">
                <div className="flex items-center gap-2">
                  <Bed size={24} />
                  <span>3 Beds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath size={24} />
                  <span>2 Baths</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize size={24} />
                  <span>2,100 sqft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home size={24} />
                  <span>Single Family</span>
                </div>
              </div>
            </div>

            {/* Investment Metrics */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[var(--gray-900)] mb-6">
                Investment Analysis
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-[var(--emerald-50)] rounded-xl">
                  <div className="flex items-center gap-2 text-[var(--emerald-700)] mb-2">
                    <DollarSign size={20} />
                    <span className="text-sm">Est. Monthly Rent</span>
                  </div>
                  <div className="text-2xl font-semibold text-[var(--gray-900)]">
                    $3,200
                  </div>
                </div>
                <div className="p-4 bg-[var(--emerald-50)] rounded-xl">
                  <div className="flex items-center gap-2 text-[var(--emerald-700)] mb-2">
                    <TrendingUp size={20} />
                    <span className="text-sm">Cap Rate</span>
                  </div>
                  <div className="text-2xl font-semibold text-[var(--gray-900)]">
                    5.3%
                  </div>
                </div>
                <div className="p-4 bg-[var(--gray-50)] rounded-xl">
                  <div className="text-sm text-[var(--gray-600)] mb-2">Annual Income</div>
                  <div className="text-xl font-semibold text-[var(--gray-900)]">
                    $38,400
                  </div>
                </div>
                <div className="p-4 bg-[var(--gray-50)] rounded-xl relative group">
                  <div className="flex items-center gap-2 text-sm text-[var(--gray-600)] mb-2">
                    <span>Gross Yield</span>
                    <Info size={14} className="text-[var(--gray-400)]" />
                  </div>
                  <div className="text-xl font-semibold text-[var(--gray-900)]">
                    5.3%
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[var(--gray-900)] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                    Annual rent ÷ Purchase price
                  </div>
                </div>
              </div>
              
              {/* Unlock Advanced Analytics */}
              <div className="mt-6 p-4 bg-gradient-to-r from-[var(--emerald-50)] to-[var(--gold-50)] rounded-xl border border-[var(--emerald-200)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Lock size={20} className="text-[var(--emerald-600)]" />
                    </div>
                    <div>
                      <div className="font-medium text-[var(--gray-900)]">Advanced Yield Analytics</div>
                      <div className="text-sm text-[var(--gray-600)]">Cash flow, ROI projections, and market comparisons</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setUpgradeModal('yield')}
                    className="px-6 py-2 bg-[var(--emerald-600)] hover:bg-[var(--emerald-700)] text-white rounded-lg transition-colors"
                  >
                    Unlock Now
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[var(--gray-900)] mb-4">
                About This Property
              </h2>
              <p className="text-[var(--gray-700)] leading-relaxed mb-4">
                Beautiful single-family home in a prime San Francisco location. This well-maintained property features 3 spacious bedrooms, 2 modern bathrooms, and an open-concept living area perfect for entertaining.
              </p>
              <p className="text-[var(--gray-700)] leading-relaxed mb-4">
                The home boasts hardwood floors throughout, a recently renovated kitchen with stainless steel appliances, and a private backyard ideal for outdoor gatherings. Located in a quiet, family-friendly neighborhood with excellent schools and convenient access to public transportation.
              </p>
              <p className="text-[var(--gray-700)] leading-relaxed">
                This property presents an excellent investment opportunity with strong rental potential and appreciation prospects in one of San Francisco's most desirable areas.
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[var(--gray-900)] mb-6">
                Features & Amenities
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-[var(--gray-700)]">
                  <div className="w-2 h-2 bg-[var(--emerald-600)] rounded-full"></div>
                  <span>Central Air Conditioning</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--gray-700)]">
                  <div className="w-2 h-2 bg-[var(--emerald-600)] rounded-full"></div>
                  <span>Hardwood Floors</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--gray-700)]">
                  <div className="w-2 h-2 bg-[var(--emerald-600)] rounded-full"></div>
                  <span>Renovated Kitchen</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--gray-700)]">
                  <div className="w-2 h-2 bg-[var(--emerald-600)] rounded-full"></div>
                  <span>Private Backyard</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--gray-700)]">
                  <div className="w-2 h-2 bg-[var(--emerald-600)] rounded-full"></div>
                  <span>Garage Parking</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--gray-700)]">
                  <div className="w-2 h-2 bg-[var(--emerald-600)] rounded-full"></div>
                  <span>In-unit Laundry</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--gray-700)]">
                  <div className="w-2 h-2 bg-[var(--emerald-600)] rounded-full"></div>
                  <span>Smart Home Features</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--gray-700)]">
                  <div className="w-2 h-2 bg-[var(--emerald-600)] rounded-full"></div>
                  <span>Security System</span>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[var(--gray-900)] mb-6">
                Property Details
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-[var(--gray-600)] mb-1">Property Type</div>
                  <div className="text-[var(--gray-900)]">Single Family Home</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--gray-600)] mb-1">Year Built</div>
                  <div className="text-[var(--gray-900)]">2015</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--gray-600)] mb-1">Lot Size</div>
                  <div className="text-[var(--gray-900)]">5,000 sqft</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--gray-600)] mb-1">HOA Fees</div>
                  <div className="text-[var(--gray-900)]">$150/month</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--gray-600)] mb-1">Property Tax</div>
                  <div className="text-[var(--gray-900)]">$8,700/year</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--gray-600)] mb-1">Heating</div>
                  <div className="text-[var(--gray-900)]">Central Gas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-sm sticky top-24">
              <h3 className="text-xl font-semibold text-[var(--gray-900)] mb-6">
                Schedule a Viewing
              </h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--emerald-600)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--emerald-600)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--emerald-600)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--emerald-600)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your interests..."
                    className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--emerald-600)] resize-none"
                  />
                </div>
              </div>
              <button className="w-full bg-[var(--gold-500)] hover:bg-[var(--gold-600)] text-white py-3 rounded-lg transition-all font-medium mb-3">
                Schedule Viewing
              </button>
              <button className="w-full border-2 border-[var(--emerald-700)] text-[var(--emerald-700)] hover:bg-[var(--emerald-700)] hover:text-white py-3 rounded-lg transition-all font-medium">
                Contact Agent
              </button>

              <div className="mt-8 pt-8 border-t border-[var(--gray-200)]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-[var(--gray-200)] rounded-full"></div>
                  <div>
                    <div className="font-semibold text-[var(--gray-900)]">Sarah Johnson</div>
                    <div className="text-sm text-[var(--gray-600)]">Licensed Agent</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-[var(--gray-700)]">
                  <div>📧 sarah.j@estate.com</div>
                  <div>📱 (555) 987-6543</div>
                </div>
              </div>
            </div>
          </div>
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
