import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

export default function PremiumHero() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')"
                }}
            >
                {/* 1. STRONGER GRADIENT OVERLAY (Slate-900 for contrast) */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900/95"></div>
            </div>

            {/* Hero Content - Centered */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-20">
                {/* Main Headline */}
                <h1
                    className="text-5xl md:text-7xl text-center mb-6 tracking-tight animate-fade-in-up"
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        textShadow: '0 4px 30px rgba(0,0,0,0.5)'
                    }}
                >
                    <span className="text-white font-light italic">
                        Grade A
                    </span>
                    <span className="text-yellow-500 font-semibold italic ml-3">
                        Realty
                    </span>
                </h1>

                {/* Subheadline */}
                <p
                    className="text-lg md:text-xl text-white text-center max-w-xl mb-12 font-light tracking-wide animate-fade-in-up delay-100"
                    style={{
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                        fontFamily: "'Inter', sans-serif"
                    }}
                >
                    Experience the finest service for your property journey.
                </p>

                {/* Search Module */}
                <div className="w-full max-w-3xl animate-fade-in-up delay-200 flex flex-col items-center">
                    <SearchBar />
                </div>

                {/* 3. STATS ROW (Relocated Below Search for Impact) */}
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mt-16 animate-fade-in-up delay-300">
                    <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
                        <div className="text-3xl md:text-4xl font-serif text-yellow-500 drop-shadow-md font-bold">
                            47M+
                        </div>
                        <div className="text-[10px] md:text-xs text-white/90 uppercase tracking-[0.2em] mt-2 font-medium font-sans">
                            Volume Sold
                        </div>
                    </div>
                    <div className="w-px h-8 bg-white/20 hidden md:block"></div>
                    <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
                        <div className="text-3xl md:text-4xl font-serif text-yellow-500 drop-shadow-md font-bold">
                            500+
                        </div>
                        <div className="text-[10px] md:text-xs text-white/90 uppercase tracking-[0.2em] mt-2 font-medium font-sans">
                            Active Listings
                        </div>
                    </div>
                    <div className="w-px h-8 bg-white/20 hidden md:block"></div>
                    <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
                        <div className="text-3xl md:text-4xl font-serif text-yellow-500 drop-shadow-md font-bold">
                            #1
                        </div>
                        <div className="text-[10px] md:text-xs text-white/90 uppercase tracking-[0.2em] mt-2 font-medium font-sans">
                            Agency
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
