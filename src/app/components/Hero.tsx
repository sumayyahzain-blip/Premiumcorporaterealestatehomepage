import React from 'react';

interface HeroProps {
  className?: string;
}

export function Hero({ className = '' }: HeroProps) {
  return (
    <div className={`relative bg-gradient-to-br from-[var(--emerald-50)] to-white py-20 lg:py-32 ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[var(--gray-900)] mb-6 leading-tight">
            A Smarter Way to Own, Rent, and Grow Real Estate
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-[var(--gray-600)] mb-12 max-w-3xl mx-auto leading-relaxed">
            A unified platform trusted by homeowners, investors, and tenants to manage every stage of the real estate lifecycle.
          </p>

          {/* Optional CTA */}
          <button className="bg-[var(--gold-500)] hover:bg-[var(--gold-600)] text-white px-8 py-4 rounded-lg text-lg font-medium transition-all shadow-md hover:shadow-lg">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
}
