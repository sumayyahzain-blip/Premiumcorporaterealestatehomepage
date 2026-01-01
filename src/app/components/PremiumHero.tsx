import React, { useState } from 'react';

export default function PremiumHero() {
    const [propertyType, setPropertyType] = useState('Buy');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const propertyTypes = ['Buy', 'Rent', 'Sell', 'Invest'];

    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden">
            {/* Background Image - Modern white villa with pool */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')"
                }}
            >
                {/* Elegant gradient overlay - darker at top for nav visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a2744]/90 via-[#1a2744]/30 to-[#1a2744]/50"></div>
            </div>

            {/* Hero Content - Centered */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-20">
                {/* Main Headline - Elegant serif italic style with enhanced visibility */}
                <h1
                    className="text-5xl md:text-7xl text-center mb-6 tracking-tight"
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        textShadow: '2px 2px 8px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)'
                    }}
                >
                    <span className="text-white font-light italic">
                        Grade A
                    </span>
                    <span className="text-amber-400 font-semibold italic ml-3">
                        Realty
                    </span>
                </h1>

                {/* Subheadline - Elegant and refined with enhanced visibility */}
                <p
                    className="text-lg md:text-xl text-white text-center max-w-xl mb-12 font-light tracking-wide"
                    style={{
                        textShadow: '1px 1px 6px rgba(0,0,0,0.5)',
                        fontFamily: "'Inter', sans-serif"
                    }}
                >
                    Experience the finest service for your property journey.
                </p>

                {/* Elegant Search Bar with Location and Type */}
                <div className="w-full max-w-2xl">
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-full shadow-2xl shadow-black/20 flex items-center overflow-hidden">
                        {/* Location Input */}
                        <div className="flex-1 px-6 py-4 border-r border-gray-200">
                            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Location</label>
                            <input
                                type="text"
                                placeholder="City, Zip, or Address"
                                className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-base"
                            />
                        </div>

                        {/* Property Type Dropdown */}
                        <div className="relative px-6 py-4">
                            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Type</label>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 text-gray-800 text-base font-medium"
                            >
                                {propertyType}
                                <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                                    {propertyTypes.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => {
                                                setPropertyType(type);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${propertyType === type ? 'bg-gray-50 text-[#1a2744] font-medium' : 'text-gray-700'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search Button */}
                        <button className="bg-[#1a2744] hover:bg-[#0f1a2e] text-white p-4 m-2 rounded-full transition-all shadow-lg hover:shadow-xl">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="flex items-center gap-8 mt-10">
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-white">47M+</div>
                        <div className="text-xs text-amber-400 uppercase tracking-widest mt-1">Sold</div>
                    </div>
                    <div className="w-px h-12 bg-white/20"></div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-white">500+</div>
                        <div className="text-xs text-white/60 uppercase tracking-widest mt-1">Listings</div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="relative z-10 pb-8 flex flex-col items-center gap-2 animate-bounce">
                <span className="text-white/40 text-xs tracking-wider">SCROLL</span>
                <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}

