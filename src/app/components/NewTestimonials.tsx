import React from 'react';

const testimonials = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Homeowner',
        location: 'Beverly Hills, CA',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        rating: 5,
        text: 'Grade A Realty made finding our dream home an absolute pleasure. Their team was professional, attentive, and truly understood what we were looking for. We couldn\'t be happier!'
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Property Investor',
        location: 'San Francisco, CA',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        rating: 5,
        text: 'As an investor, I\'ve worked with many agencies. Grade A Realty stands out for their market knowledge and exceptional service. They\'ve helped me build a profitable portfolio.'
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        role: 'First-time Buyer',
        location: 'Miami, FL',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        rating: 5,
        text: 'Being a first-time buyer was intimidating, but the team at Grade A Realty guided me through every step. They found me the perfect condo within my budget. Highly recommend!'
    },
    {
        id: 4,
        name: 'David Thompson',
        role: 'Business Owner',
        location: 'New York, NY',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        rating: 5,
        text: 'The commercial property search was made seamless by Grade A Realty. Their understanding of business needs and location strategy is unmatched. Outstanding service!'
    }
];

export default function NewTestimonials() {
    return (
        <section id="testimonials" className="py-24 bg-gradient-to-b from-white to-slate-50 rounded-t-[60px] overflow-hidden shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                        Testimonials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        What Our Clients Say
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Real stories from real clients who found their perfect property with us
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100"
                        >
                            {/* Quote icon */}
                            <div className="mb-6">
                                <svg className="w-12 h-12 text-emerald-200" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Text */}
                            <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-14 h-14 rounded-full object-cover ring-4 ring-emerald-100"
                                />
                                <div>
                                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                                    <div className="text-slate-500 text-sm">{testimonial.role}</div>
                                    <div className="text-emerald-600 text-sm flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        {testimonial.location}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-20 text-center">
                    <p className="text-slate-500 text-sm mb-8">Trusted by leading organizations</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
                        {['Forbes', 'Bloomberg', 'WSJ', 'Reuters', 'CNBC'].map((brand) => (
                            <div key={brand} className="text-2xl font-bold text-slate-400">
                                {brand}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
