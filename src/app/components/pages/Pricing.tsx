import React from 'react';
import { Navigation } from '../Navigation';
import { Check } from 'lucide-react';

export function PricingPage() {
  const tiers = [
    {
      name: 'Discovery',
      subtitle: 'FREE',
      price: '$0',
      period: 'forever',
      description: 'Explore listings and properties with essential tools',
      features: [
        'Browse all buy & rent listings',
        'Interactive map view',
        'Property detail pages',
        'Est. 1-Year Income calculations',
        'Basic search and filters',
        'Save favorite properties'
      ],
      cta: 'Get Started',
      featured: false
    },
    {
      name: 'Owner',
      subtitle: 'MANAGEMENT',
      price: 'Custom',
      period: 'per property',
      description: 'Professional property management for owners',
      features: [
        'Everything in Discovery',
        'Property management dashboard',
        'Rent collection & tracking',
        'Maintenance request system',
        'Financial reporting',
        'Tenant screening',
        'Lease management',
        'Dedicated property manager'
      ],
      cta: 'Contact Sales',
      featured: true
    },
    {
      name: 'Investor Pro',
      subtitle: 'SUBSCRIPTION',
      price: '$49',
      period: 'per month',
      description: 'Advanced analytics and insights for investors',
      features: [
        'Everything in Discovery',
        'Advanced yield calculations',
        'Market insights & trends',
        'Portfolio analytics',
        'Area tracking & alerts',
        'Export financial data',
        'Investment comparisons',
        'Priority support'
      ],
      cta: 'Start Free Trial',
      featured: false
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">Simple, Transparent Pricing That Grows With You</h1>
            <p className="text-[var(--gray-600)] max-w-2xl mx-auto">
              Choose the plan that fits your needs. No hidden fees, no surprises. 
              Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 transition-all ${
                  tier.featured
                    ? 'ring-2 ring-[var(--emerald-600)] shadow-xl scale-105'
                    : 'shadow-md hover:shadow-lg'
                }`}
              >
                {tier.featured && (
                  <div className="inline-block px-4 py-1 bg-[var(--emerald-100)] text-[var(--emerald-700)] rounded-full text-sm mb-4">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <div className="text-xs text-[var(--gray-500)] mb-1">
                    {tier.subtitle}
                  </div>
                  <h3 className="mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-semibold text-[var(--gray-900)]">
                      {tier.price}
                    </span>
                    <span className="text-[var(--gray-500)]">
                      {tier.period}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--gray-600)]">
                    {tier.description}
                  </p>
                </div>

                <button
                  className={`w-full py-3 px-6 rounded-xl mb-8 transition-all ${
                    tier.featured
                      ? 'bg-[var(--gold-500)] hover:bg-[var(--gold-600)] text-white'
                      : 'bg-[var(--gray-100)] hover:bg-[var(--gray-200)] text-[var(--gray-900)]'
                  }`}
                >
                  {tier.cta}
                </button>

                <div className="space-y-4">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[var(--emerald-600)] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[var(--gray-700)]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-center mb-12">Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--gray-200)]">
                  <th className="text-left py-4 px-4 text-[var(--gray-900)]">
                    Feature
                  </th>
                  {tiers.map((tier, index) => (
                    <th key={index} className="text-center py-4 px-4">
                      <div className="text-[var(--gray-900)]">{tier.name}</div>
                      <div className="text-sm text-[var(--gray-500)] font-normal mt-1">
                        {tier.price}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Listing Discovery', values: [true, true, true] },
                  { name: 'Interactive Maps', values: [true, true, true] },
                  { name: 'Est. 1-Year Income', values: [true, true, true] },
                  { name: 'Save Properties', values: [true, true, true] },
                  { name: 'Property Management', values: [false, true, false] },
                  { name: 'Rent Collection', values: [false, true, false] },
                  { name: 'Maintenance Tracking', values: [false, true, false] },
                  { name: 'Advanced Yield', values: [false, false, true] },
                  { name: 'Market Insights', values: [false, false, true] },
                  { name: 'Portfolio Analytics', values: [false, false, true] },
                  { name: 'Export Data', values: [false, true, true] }
                ].map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-[var(--gray-100)]">
                    <td className="py-4 px-4 text-[var(--gray-700)]">
                      {row.name}
                    </td>
                    {row.values.map((value, colIndex) => (
                      <td key={colIndex} className="py-4 px-4 text-center">
                        {value ? (
                          <Check className="w-5 h-5 text-[var(--emerald-600)] mx-auto" />
                        ) : (
                          <span className="text-[var(--gray-300)]">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                question: 'Can I switch plans anytime?',
                answer: 'Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of your next billing cycle.'
              },
              {
                question: 'Is there a free trial for Investor Pro?',
                answer: 'Yes, we offer a 14-day free trial for Investor Pro. No credit card required to start.'
              },
              {
                question: 'How does property management pricing work?',
                answer: 'Owner tier pricing is customized based on your property portfolio size and management needs. Contact our sales team for a personalized quote.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, bank transfers, and ACH payments for management services.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="mb-3 text-[var(--gray-900)]">{faq.question}</h4>
                <p className="text-[var(--gray-600)]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[var(--emerald-900)] text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="mb-6 text-white">Ready to get started?</h2>
          <p className="mb-8 text-[var(--emerald-100)] max-w-2xl mx-auto">
            Join thousands of property owners and investors who trust our platform 
            for their real estate needs.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-[var(--gold-500)] hover:bg-[var(--gold-600)] text-white rounded-xl transition-all">
              Start Free Trial
            </button>
            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
