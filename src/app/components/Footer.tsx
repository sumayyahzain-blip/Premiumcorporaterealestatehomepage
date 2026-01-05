import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Send, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0f172a] text-white pt-20 pb-10 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6">

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Column 1: Brand & Identity */}
                    <div className="flex flex-col gap-6">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-[#101A2C] font-bold text-xl">G</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-light text-xs tracking-[0.3em]">GRADE A</span>
                                <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent font-bold text-lg tracking-wide">REALTY</span>
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Experience the finest service for your property journey. We provide premium corporate real estate solutions tailored to your unique needs.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all duration-300">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all duration-300">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Discover */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white tracking-wide">Discover</h3>
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link to="/buy" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2">
                                    Buy a Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/rent" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2">
                                    Rent a Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/pricing" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2">
                                    Sell Your Property
                                </Link>
                            </li>
                            <li>
                                <Link to="/agents" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2">
                                    Meet Our Agents
                                </Link>
                            </li>
                            <li>
                                <Link to="/career" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2">
                                    Career
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Locations */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white tracking-wide">Popular Locations</h3>
                        <ul className="flex flex-col gap-4">
                            {['New York', 'Los Angeles', 'Miami', 'Chicago'].map((city) => (
                                <li key={city}>
                                    <Link to="/properties" state={{ globalSearch: city }} className="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2">
                                        <MapPin size={14} className="text-gray-600" />
                                        {city}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex items-center gap-3 text-gray-400 mb-3">
                                <Phone size={16} className="text-amber-500" />
                                <span>(555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <Mail size={16} className="text-amber-500" />
                                <span>contact@gradea.realty</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white tracking-wide">Market Updates</h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Subscribe to get the latest market updates, new listings, and expert real estate advice.
                        </p>

                        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-[#0f172a] font-bold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-amber-500/20 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Subscribe
                                <Send size={18} />
                            </button>
                        </form>
                    </div>

                </div>

                {/* Copyright Row */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Grade A Realty. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <Link to="/privacy" className="hover:text-amber-500 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-amber-500 transition-colors">Terms of Service</Link>
                        <Link to="/sitemap" className="hover:text-amber-500 transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
