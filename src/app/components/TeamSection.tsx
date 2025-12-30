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
        <section id="team" className="py-24 bg-white rounded-t-[60px] overflow-hidden shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">Our Team</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Meet Our Experts</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">Dedicated professionals committed to finding your perfect property</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, index) => (
                        <div key={index} className="group">
                            <div className="relative overflow-hidden rounded-3xl mb-6">
                                <img src={member.image} alt={member.name} className="w-full aspect-[3/4] object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <p className="text-white/80 text-sm">{member.bio}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{member.name}</h3>
                                <p className="text-emerald-600 font-medium">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
