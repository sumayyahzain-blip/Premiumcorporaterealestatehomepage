import React, { useState } from 'react';
import { DollarSign, Zap, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

export default function SellLandingPage() {
    const [address, setAddress] = useState('');
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        phone: '',
        propertyAddress: ''
    });

    const handleEstimateSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Redirect focus to the consultation form and pre-fill address
        const formElement = document.getElementById('consultation-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
            setFormState(prev => ({ ...prev, propertyAddress: address }));
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you! An agent will contact you shortly.');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* HERO SECTION */}
            <section className="relative bg-[#0f172a] pt-32 pb-24 px-6 overflow-hidden">
                {/* Abstract Background Effect */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#D4AF37]/5 to-transparent pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Sell for more. <br className="hidden md:block" />
                        <span className="text-[#D4AF37]">Pay less fees.</span>
                    </h1>

                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Experience a luxury home selling process that puts more money in your pocket.
                        Get a data-backed valuation instantly.
                    </p>

                    {/* Interactive Entry Point */}
                    <form onSubmit={handleEstimateSearch} className="max-w-xl mx-auto relative group">
                        <div className="relative flex items-center">
                            <MapPin className="absolute left-4 text-gray-400 z-10" />
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your property address"
                                className="w-full pl-12 pr-36 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white/20 transition-all text-lg shadow-xl"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-2 bottom-2 bg-[#D4AF37] hover:bg-[#b5952f] text-[#0f172a] px-6 rounded-full font-bold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
                            >
                                <span className="hidden sm:inline">Get Free Estimate</span>
                                <span className="sm:hidden">Estimate</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* VALUE PROPOSITION SECTION */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12 text-center">

                        {/* Prop 1 */}
                        <div className="flex flex-col items-center group">
                            <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                <DollarSign size={32} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0f172a] mb-3">More Profit</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our sophisticated marketing and negotiation strategies help sellers earn
                                <span className="font-semibold text-[#0f172a]"> $15k more on average</span> per transaction.
                            </p>
                        </div>

                        {/* Prop 2 */}
                        <div className="flex flex-col items-center group">
                            <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                <Zap size={32} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0f172a] mb-3">Fast Sale</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Don’t let your property sit. We leverage our network of pre-approved buyers to sell your home in days, not months.
                            </p>
                        </div>

                        {/* Prop 3 */}
                        <div className="flex flex-col items-center group">
                            <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                <ShieldCheck size={32} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0f172a] mb-3">Grade A Agents</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Work exclusively with the top 1% of local experts who understand the luxury market nuances.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* LEAD FORM SECTION (THE CLOSER) */}
            <section id="consultation-form" className="py-24 bg-gray-50 flex justify-center">
                <div className="max-w-2xl w-full mx-6 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-[#0f172a] mb-3">Schedule Your Consultation</h2>
                        <p className="text-gray-500">
                            Speak with a Grade A expert today. No pressure, just strategy.
                        </p>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#0f172a] uppercase tracking-wide">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formState.name}
                                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#0f172a] uppercase tracking-wide">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formState.email}
                                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#0f172a] uppercase tracking-wide">Phone Number</label>
                            <input
                                type="tel"
                                required
                                value={formState.phone}
                                onChange={e => setFormState({ ...formState, phone: e.target.value })}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all"
                                placeholder="(555) 123-4567"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#0f172a] uppercase tracking-wide">Property Address</label>
                            <input
                                type="text"
                                required
                                value={formState.propertyAddress}
                                onChange={e => setFormState({ ...formState, propertyAddress: e.target.value })}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all"
                                placeholder="123 Main St, New York, NY"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 bg-[#D4AF37] hover:bg-[#b5952f] text-[#0f172a] font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1 mt-4"
                        >
                            Schedule Consultation
                        </button>

                        <p className="text-center text-gray-400 text-xs mt-4">
                            By submitting this form, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
}
