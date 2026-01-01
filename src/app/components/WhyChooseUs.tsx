import React from 'react';

const features = [
    {
        icon: (
            // Shield with star - Trust & Premium Quality
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: 'Trusted & Verified',
        description: 'All our properties are thoroughly verified and inspected to ensure quality and authenticity.'
    },
    {
        icon: (
            // Diamond/Gem - Premium Value
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3L2 9l10 13 10-13-10-6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 9h20" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v6" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 9l5 13 5-13" />
            </svg>
        ),
        title: 'Best Price Guarantee',
        description: 'We ensure competitive pricing with transparent deals and no hidden fees.'
    },
    {
        icon: (
            // Award/Trophy - Expert Recognition
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3h14a1 1 0 011 1v3a7 7 0 01-7 7 7 7 0 01-7-7V4a1 1 0 011-1z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14v4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21h8" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 6H3a1 1 0 00-1 1v1a4 4 0 004 4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 6h2a1 1 0 011 1v1a4 4 0 01-4 4" />
            </svg>
        ),
        title: 'Expert Agents',
        description: 'Our certified agents bring decades of experience to guide you through every step.'
    },
    {
        icon: (
            // Rocket - Speed & Efficiency
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
        ),
        title: 'Fast Process',
        description: 'Streamlined buying and selling process with digital paperwork and quick closings.'
    },
    {
        icon: (
            // Building/Cityscape - Wide Selection
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        title: 'Wide Selection',
        description: 'Access to thousands of premium properties across major cities and exclusive neighborhoods.'
    },
    {
        icon: (
            // Headset/Support - 24/7 Support
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        title: '24/7 Support',
        description: 'Round-the-clock customer support to answer your questions and address concerns.'
    }
];


export default function WhyChooseUs() {
    return (
        <section id="about" className="py-24 bg-slate-900 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-amber-500/20 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                        Why Grade A Realty
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Why Choose Us
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        We're committed to providing exceptional real estate services that exceed your expectations
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Banner - Elegant design matching the dark theme */}
            <div className="mt-20 relative overflow-hidden">
                {/* Same dark navy background as the section for seamless elegance */}
                <div className="absolute inset-0 bg-slate-900"></div>

                {/* Subtle amber accent glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-amber-500/15 blur-3xl rounded-full"></div>

                {/* Elegant border accents */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>

                <div className="relative z-10 py-16 md:py-20 text-center max-w-4xl mx-auto px-6">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Find Your Dream Home?
                    </h3>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                        Let our expert team guide you through the journey of finding the perfect property
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 px-8 py-4 rounded-full font-bold transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
                            Schedule a Consultation
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                        <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 px-8 py-4 rounded-full font-bold transition-all duration-300">
                            Browse Properties
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
