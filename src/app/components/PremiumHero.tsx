import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function PremiumHero() {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden">
            {/* Background Image - Bright luxury home at golden hour */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920')"
                }}
            >
                {/* Lighter overlay for brighter, clearer look */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/80 via-[#0a1628]/40 to-[#0a1628]/70"></div>
                {/* Subtle golden glow at top for luxury feel */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-400/10 blur-3xl rounded-full"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-50 px-6 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo - Gold/Bronze style */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-[#101A2C] font-bold text-2xl">G</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-light text-sm tracking-[0.3em]">GRADE A</span>
                            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent font-bold text-xl tracking-wide">REALTY</span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="relative text-white font-medium hover:text-amber-400 transition-colors group">
                            HOME
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400"></span>
                        </Link>
                        <Link to="/buy" className="text-white/80 font-medium hover:text-white transition-colors">BUY</Link>
                        <Link to="/rent" className="text-white/80 font-medium hover:text-white transition-colors">RENT</Link>
                        <Link to="/pricing" className="text-white/80 font-medium hover:text-white transition-colors">PRICING</Link>
                        <Link to="/dashboard" className="text-white/80 font-medium hover:text-white transition-colors">DASHBOARD</Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/dashboard" className="text-white/80 hover:text-white font-medium transition-colors">
                            Register
                        </Link>
                        <Link to="/dashboard" className="border border-white/30 hover:border-amber-400 hover:text-amber-400 text-white px-6 py-2 rounded-lg font-medium transition-all">
                            Sign In
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Hero Content - Centered */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 -mt-16">
                {/* Main Headline with luxury gold accent */}
                <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 tracking-tight">
                    <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">Grade A</span>
                    <span className="text-white"> Realty</span>
                </h1>

                {/* Subheadline */}
                <p className="text-xl md:text-2xl text-white/80 text-center max-w-2xl mb-12 font-light">
                    We are here to serve all of your real estate needs!
                </p>

                {/* Search Bar - Clean white design */}
                <div className="w-full max-w-2xl">
                    <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/20">
                        <input
                            type="text"
                            placeholder="Search by City, County, Subdivision..."
                            className="w-full bg-transparent rounded-2xl px-6 py-5 text-gray-800 placeholder-gray-400 outline-none text-lg"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white p-3.5 rounded-xl transition-all shadow-lg hover:shadow-amber-500/30">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                    <span className="text-white/50 text-sm">Popular:</span>
                    <a href="#" className="text-white/70 hover:text-amber-400 text-sm transition-colors">Beverly Hills</a>
                    <a href="#" className="text-white/70 hover:text-amber-400 text-sm transition-colors">Manhattan</a>
                    <a href="#" className="text-white/70 hover:text-amber-400 text-sm transition-colors">Miami Beach</a>
                    <a href="#" className="text-white/70 hover:text-amber-400 text-sm transition-colors">San Francisco</a>
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

