import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] bg-[#0a1628]/95 backdrop-blur-md border-b border-white/10 shadow-lg">
            <nav className="px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo - Gold/Bronze style */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-[#101A2C] font-bold text-xl">G</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-light text-xs tracking-[0.3em]">GRADE A</span>
                            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent font-bold text-lg tracking-wide">REALTY</span>
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
        </header>
    );
}
