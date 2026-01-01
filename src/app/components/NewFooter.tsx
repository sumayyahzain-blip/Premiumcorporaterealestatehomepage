import React from 'react';

export default function NewFooter() {
    return (
        <footer className="bg-slate-900 text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">G</span>
                            </div>
                            <span className="font-bold text-2xl">Grade A Realty</span>
                        </div>
                        <p className="text-slate-400 mb-6">Your trusted partner in finding exceptional properties that match your lifestyle and investment goals.</p>
                        <div className="flex gap-4">
                            {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                                <a key={social} href="#" className="w-10 h-10 bg-white/10 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors">
                                    <span className="text-xs uppercase">{social[0]}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {['Home', 'About Us', 'Properties', 'Agents', 'Blog', 'Contact'].map((link) => (
                                <li key={link}><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Services</h4>
                        <ul className="space-y-3">
                            {['Buy Property', 'Sell Property', 'Rent Property', 'Property Management', 'Investment Consulting'].map((link) => (
                                <li key={link}><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Contact Us</h4>
                        <ul className="space-y-3 text-slate-400">
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 mt-0.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                123 Luxury Lane, Beverly Hills, CA 90210
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                +1 (555) 123-4567
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                info@gradearealty.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">© 2025 Grade A Realty. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
