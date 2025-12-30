import React from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-50">
            <div className="max-w-[1440px] mx-auto px-6">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Simple, Transparent Pricing That Grows With You</h1>
                    <p className="text-xl text-gray-600">Choose the plan that fits your needs. No hidden fees, no surprises. Cancel anytime.</p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">

                    {/* Free Tier */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                        <div className="mb-6">
                            <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Free</span>
                            <h2 className="text-2xl font-bold text-gray-900 mt-2">Discovery</h2>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-bold text-gray-900">$0</span>
                                <span className="text-gray-500 ml-2">forever</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-4">Explore listings and properties with essential tools</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                'Browse all buy & rent listings',
                                'Interactive map view',
                                'Property detail pages',
                                'Est. 1-Year Income calculations',
                                'Basic search and filters',
                                'Save favorite properties'
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <Check className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                                    <span className="text-gray-600 text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-colors">
                            Get Started
                        </button>
                    </div>

                    {/* Owner Tier - Featured */}
                    <div className="bg-white rounded-3xl p-8 border-2 border-emerald-500 shadow-2xl relative flex flex-col scale-105 z-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            Most Popular
                        </div>
                        <div className="mb-6">
                            <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase">Management</span>
                            <h2 className="text-2xl font-bold text-gray-900 mt-2">Owner</h2>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-bold text-gray-900">Custom</span>
                                <span className="text-gray-500 ml-2">per property</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-4">Professional property management for owners</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                'Everything in Discovery',
                                'Property management dashboard',
                                'Rent collection & tracking',
                                'Maintenance request system',
                                'Financial reporting',
                                'Tenant screening',
                                'Lease management',
                                'Dedicated property manager'
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <Check className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                                    <span className="text-gray-600 text-sm font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/20">
                            Contact Sales
                        </button>
                    </div>

                    {/* Investor Tier */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                        <div className="mb-6">
                            <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Subscription</span>
                            <h2 className="text-2xl font-bold text-gray-900 mt-2">Investor Pro</h2>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-bold text-gray-900">$49</span>
                                <span className="text-gray-500 ml-2">per month</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-4">Advanced analytics and insights for investors</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                'Everything in Discovery',
                                'Advanced yield calculations',
                                'Market insights & trends',
                                'Portfolio analytics',
                                'Area tracking & alerts',
                                'Export financial data',
                                'Investment comparisons',
                                'Priority support'
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <Check className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                                    <span className="text-gray-600 text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-colors">
                            Start Free Trial
                        </button>
                    </div>

                </div>

                {/* Comparison Table */}
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">Feature Comparison</h3>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 w-1/3">Feature</th>
                                    <th className="text-center py-4 px-6 text-sm font-bold text-gray-900 w-1/5">
                                        <div className="flex flex-col">
                                            <span>Discovery</span>
                                            <span className="text-xs font-normal text-gray-500 mt-1">$0</span>
                                        </div>
                                    </th>
                                    <th className="text-center py-4 px-6 text-sm font-bold text-emerald-600 w-1/5">
                                        <div className="flex flex-col">
                                            <span>Owner</span>
                                            <span className="text-xs font-normal text-gray-500 mt-1">Custom</span>
                                        </div>
                                    </th>
                                    <th className="text-center py-4 px-6 text-sm font-bold text-gray-900 w-1/5">
                                        <div className="flex flex-col">
                                            <span>Investor Pro</span>
                                            <span className="text-xs font-normal text-gray-500 mt-1">$49</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: 'Listing Discovery', free: true, owner: true, investor: true },
                                    { name: 'Interactive Maps', free: true, owner: true, investor: true },
                                    { name: 'Est. 1-Year Income', free: true, owner: true, investor: true },
                                    { name: 'Save Properties', free: true, owner: true, investor: true },
                                    { name: 'Property Management', free: false, owner: true, investor: false },
                                    { name: 'Rent Collection', free: false, owner: true, investor: false },
                                    { name: 'Maintenance Tracking', free: false, owner: true, investor: false },
                                    { name: 'Advanced Yield', free: false, owner: false, investor: true },
                                    { name: 'Market Insights', free: false, owner: false, investor: true },
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                                        <td className="py-4 px-6 text-sm text-gray-600">{row.name}</td>
                                        <td className="py-4 px-6 text-center">
                                            {row.free ? <CheckCircle2 size={18} className="mx-auto text-emerald-500" /> : <span className="text-gray-300">-</span>}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {row.owner ? <CheckCircle2 size={18} className="mx-auto text-emerald-500" /> : <span className="text-gray-300">-</span>}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {row.investor ? <CheckCircle2 size={18} className="mx-auto text-emerald-500" /> : <span className="text-gray-300">-</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
