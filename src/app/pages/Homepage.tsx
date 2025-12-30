import React from 'react';
import PremiumHero from '../components/PremiumHero';
import NewFeaturedListings from '../components/NewFeaturedListings';
import WhyChooseUs from '../components/WhyChooseUs';
import NewTestimonials from '../components/NewTestimonials';
import TeamSection from '../components/TeamSection';
import NewFooter from '../components/NewFooter';

export default function Homepage() {
    return (
        <div className="relative">
            {/* Hero Section - Fixed in place, doesn't scroll */}
            <div className="fixed inset-0 h-screen z-0">
                <PremiumHero />
            </div>

            {/* Spacer to push content below the fixed hero */}
            <div className="h-screen"></div>

            {/* Content sections that scroll OVER the fixed hero like stacked cards */}
            <div className="relative z-10">
                {/* Featured Listings - First card with rounded top */}
                <div className="relative">
                    <NewFeaturedListings />
                </div>

                {/* Why Choose Us - Stacks over previous */}
                <div className="relative">
                    <WhyChooseUs />
                </div>

                {/* Testimonials - Stacks over previous */}
                <div className="relative">
                    <NewTestimonials />
                </div>

                {/* Team Section - Stacks over previous */}
                <div className="relative">
                    <TeamSection />
                </div>

                {/* Footer */}
                <div className="relative">
                    <NewFooter />
                </div>
            </div>
        </div>
    );
}
