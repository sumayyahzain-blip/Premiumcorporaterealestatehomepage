import React, { useState } from 'react';
import { Navigation } from '../Navigation';
import { Home, DollarSign, TrendingUp, Calendar, Users, FileText, Bell, Settings, Lock, Download } from 'lucide-react';
import { UpgradeModal } from '../UpgradeModal';

export function OwnerDashboardPage() {
  const [upgradeModal, setUpgradeModal] = useState<'yield' | 'alerts' | 'export' | null>(null);
  const properties = [
    {
      address: '1234 Oak Street, SF',
      tenant: 'John Smith',
      rent: '$3,200',
      status: 'Occupied',
      nextPayment: 'Jan 1, 2025'
    },
    {
      address: '567 Pine Ave, Seattle',
      tenant: 'Emma Davis',
      rent: '$4,100',
      status: 'Occupied',
      nextPayment: 'Jan 1, 2025'
    },
    {
      address: '890 Maple Dr, Austin',
      tenant: 'Vacant',
      rent: '$2,800',
      status: 'Vacant',
      nextPayment: '-'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <Navigation />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[var(--gray-900)] mb-2">
              Owner Dashboard
            </h1>
            <p className="text-[var(--gray-600)]">
              Welcome back, manage your properties and track performance
            </p>
          </div>
          <div className="flex gap-3">
            <button className="p-3 border border-[var(--gray-300)] rounded-lg hover:bg-[var(--gray-100)] transition-all">
              <Bell size={20} className="text-[var(--gray-700)]" />
            </button>
            <button className="p-3 border border-[var(--gray-300)] rounded-lg hover:bg-[var(--gray-100)] transition-all">
              <Settings size={20} className="text-[var(--gray-700)]" />
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[var(--emerald-100)] rounded-xl text-[var(--emerald-700)]">
                <Home size={24} />
              </div>
              <div className="text-sm text-[var(--gray-600)]">Total Properties</div>
            </div>
            <div className="text-3xl font-semibold text-[var(--gray-900)]">3</div>
            <div className="text-sm text-[var(--gray-600)] mt-2">2 Occupied, 1 Vacant</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[var(--emerald-100)] rounded-xl text-[var(--emerald-700)]">
                <DollarSign size={24} />
              </div>
              <div className="text-sm text-[var(--gray-600)]">Monthly Income</div>
            </div>
            <div className="text-3xl font-semibold text-[var(--gray-900)]">$7,300</div>
            <div className="text-sm text-[var(--emerald-700)] mt-2">+5.2% from last month</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[var(--emerald-100)] rounded-xl text-[var(--emerald-700)]">
                <TrendingUp size={24} />
              </div>
              <div className="text-sm text-[var(--gray-600)]">Annual Yield</div>
            </div>
            <div className="text-3xl font-semibold text-[var(--gray-900)]">5.4%</div>
            <div className="text-sm text-[var(--gray-600)] mt-2">Portfolio average</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[var(--emerald-100)] rounded-xl text-[var(--emerald-700)]">
                <Calendar size={24} />
              </div>
              <div className="text-sm text-[var(--gray-600)]">Occupancy Rate</div>
            </div>
            <div className="text-3xl font-semibold text-[var(--gray-900)]">66.7%</div>
            <div className="text-sm text-[var(--gray-600)] mt-2">2 of 3 properties</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Properties List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[var(--gray-900)]">
                  My Properties
                </h2>
                <button className="text-[var(--emerald-700)] hover:text-[var(--emerald-800)] font-medium">
                  + Add Property
                </button>
              </div>

              <div className="space-y-4">
                {properties.map((property, index) => (
                  <div
                    key={index}
                    className="border border-[var(--gray-200)] rounded-xl p-6 hover:border-[var(--emerald-600)] transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-[var(--gray-900)] mb-1">
                          {property.address}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              property.status === 'Occupied'
                                ? 'bg-[var(--emerald-100)] text-[var(--emerald-700)]'
                                : 'bg-[var(--gray-200)] text-[var(--gray-700)]'
                            }`}
                          >
                            {property.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-semibold text-[var(--gray-900)]">
                          {property.rent}
                        </div>
                        <div className="text-sm text-[var(--gray-600)]">per month</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--gray-200)]">
                      <div>
                        <div className="text-sm text-[var(--gray-600)] mb-1">Tenant</div>
                        <div className="text-[var(--gray-900)]">{property.tenant}</div>
                      </div>
                      <div>
                        <div className="text-sm text-[var(--gray-600)] mb-1">Next Payment</div>
                        <div className="text-[var(--gray-900)]">{property.nextPayment}</div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 py-2 border border-[var(--gray-300)] rounded-lg hover:bg-[var(--gray-50)] transition-all text-sm">
                        View Details
                      </button>
                      <button className="flex-1 py-2 bg-[var(--emerald-700)] text-white rounded-lg hover:bg-[var(--emerald-800)] transition-all text-sm">
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-8 shadow-sm mt-8">
              <h2 className="text-xl font-semibold text-[var(--gray-900)] mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-[var(--gray-200)]">
                  <div className="w-10 h-10 bg-[var(--emerald-100)] rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign size={20} className="text-[var(--emerald-700)]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-[var(--gray-900)]">Payment Received</div>
                    <div className="text-sm text-[var(--gray-600)]">
                      $3,200 from John Smith - 1234 Oak Street
                    </div>
                    <div className="text-xs text-[var(--gray-500)] mt-1">Dec 28, 2024</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-[var(--gray-200)]">
                  <div className="w-10 h-10 bg-[var(--emerald-100)] rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={20} className="text-[var(--emerald-700)]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-[var(--gray-900)]">Maintenance Request</div>
                    <div className="text-sm text-[var(--gray-600)]">
                      New request from Emma Davis - HVAC inspection
                    </div>
                    <div className="text-xs text-[var(--gray-500)] mt-1">Dec 27, 2024</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-[var(--gray-200)]">
                  <div className="w-10 h-10 bg-[var(--emerald-100)] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users size={20} className="text-[var(--emerald-700)]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-[var(--gray-900)]">Showing Scheduled</div>
                    <div className="text-sm text-[var(--gray-600)]">
                      890 Maple Dr - Potential tenant viewing on Dec 30
                    </div>
                    <div className="text-xs text-[var(--gray-500)] mt-1">Dec 26, 2024</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--emerald-100)] rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign size={20} className="text-[var(--emerald-700)]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-[var(--gray-900)]">Payment Received</div>
                    <div className="text-sm text-[var(--gray-600)]">
                      $4,100 from Emma Davis - 567 Pine Avenue
                    </div>
                    <div className="text-xs text-[var(--gray-500)] mt-1">Dec 25, 2024</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[var(--gray-900)] mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-[var(--emerald-50)] text-[var(--emerald-700)] rounded-lg hover:bg-[var(--emerald-100)] transition-all">
                  Add New Property
                </button>
                <button className="w-full text-left px-4 py-3 bg-[var(--gray-50)] text-[var(--gray-700)] rounded-lg hover:bg-[var(--gray-100)] transition-all">
                  Record Payment
                </button>
                <button className="w-full text-left px-4 py-3 bg-[var(--gray-50)] text-[var(--gray-700)] rounded-lg hover:bg-[var(--gray-100)] transition-all">
                  Schedule Maintenance
                </button>
                <button className="w-full text-left px-4 py-3 bg-[var(--gray-50)] text-[var(--gray-700)] rounded-lg hover:bg-[var(--gray-100)] transition-all">
                  Generate Report
                </button>
                <button
                  onClick={() => setUpgradeModal('export')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[var(--gold-50)] to-[var(--emerald-50)] text-[var(--gray-700)] rounded-lg hover:from-[var(--gold-100)] hover:to-[var(--emerald-100)] transition-all border border-[var(--gold-200)]"
                >
                  <span className="flex items-center gap-2">
                    <Download size={18} />
                    Export Financials
                  </span>
                  <Lock size={14} className="text-[var(--gray-500)]" />
                </button>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[var(--gray-900)] mb-4">Upcoming Tasks</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[var(--gold-500)] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="text-sm font-medium text-[var(--gray-900)]">
                      Rent Collection
                    </div>
                    <div className="text-xs text-[var(--gray-600)]">Due in 2 days</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[var(--emerald-600)] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="text-sm font-medium text-[var(--gray-900)]">
                      Property Inspection
                    </div>
                    <div className="text-xs text-[var(--gray-600)]">Due in 5 days</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[var(--gray-400)] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="text-sm font-medium text-[var(--gray-900)]">
                      Annual Tax Filing
                    </div>
                    <div className="text-xs text-[var(--gray-600)]">Due in 30 days</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-gradient-to-br from-[var(--emerald-700)] to-[var(--emerald-800)] rounded-2xl p-6 shadow-sm text-white">
              <h3 className="font-semibold mb-4">Portfolio Performance</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm opacity-90">Total Value</div>
                  <div className="text-2xl font-semibold">$2,265,000</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Annual Income</div>
                  <div className="text-2xl font-semibold">$87,600</div>
                </div>
                <div className="pt-3 border-t border-white/20">
                  <div className="text-sm opacity-90">YoY Growth</div>
                  <div className="text-xl font-semibold">+12.3%</div>
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
