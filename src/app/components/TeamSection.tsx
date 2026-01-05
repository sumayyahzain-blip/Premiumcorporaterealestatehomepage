import React from 'react';

const team = [
    {
        name: 'Alexandra Wright',
        role: 'CEO & Founder',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
        bio: 'Over 20 years of luxury real estate experience'
    },
    {
        name: 'Marcus Thompson',
        role: 'Senior Real Estate Agent',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
        bio: 'Specialist in commercial properties'
    },
    {
        name: 'Jennifer Park',
        role: 'Luxury Property Specialist',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
        bio: 'Expert in high-end residential'
    },
    {
        name: 'David Martinez',
        role: 'Property Consultant',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
        bio: 'First-time buyer specialist'
    }
];

export default function TeamSection() {
    return (
        <section id="team" className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    {/* Badge Removed per instructions */}
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Meet Our Experts</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">Dedicated professionals committed to excellence.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {team.map((member, index) => (
                        <div key={index} className="group cursor-pointer">
                            {/* Strict Framing Aspect Ratio 4/5 */}
                            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-100 mb-6 shadow-sm">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                                // Removed grayscale filter - Full Natural Color
                                />
                                {/* removed overlay since we want clean photo look */}
                            </div>

                            <div className="text-center">
                                {/* Typography Update */}
                                <h3 className="font-serif text-2xl text-slate-900 mb-2">{member.name}</h3>
                                <p className="font-sans text-sm uppercase tracking-widest text-[#D4AF37] font-semibold">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
