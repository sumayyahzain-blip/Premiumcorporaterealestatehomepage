import React from 'react';

export default function HomepageDiagram() {
    return (
        <div className="min-h-screen bg-slate-100 py-12 px-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 text-center mb-8">Homepage Structure Diagram</h1>

                <div className="space-y-4">
                    {[
                        { name: 'PremiumHero', desc: 'Hero section with navigation, search, and stats', color: 'bg-emerald-500' },
                        { name: 'NewFeaturedListings', desc: 'Property listings grid with filters', color: 'bg-blue-500' },
                        { name: 'WhyChooseUs', desc: 'Features grid with CTA banner', color: 'bg-purple-500' },
                        { name: 'NewTestimonials', desc: 'Client reviews and trust badges', color: 'bg-amber-500' },
                        { name: 'TeamSection', desc: 'Team member cards', color: 'bg-rose-500' },
                        { name: 'NewFooter', desc: 'Footer with links and contact', color: 'bg-slate-700' }
                    ].map((section, i) => (
                        <div key={i} className="flex items-stretch gap-4">
                            <div className={`${section.color} w-2 rounded-full`}></div>
                            <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                                <h3 className="font-bold text-lg text-slate-900">{section.name}</h3>
                                <p className="text-slate-600">{section.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                    <h2 className="font-bold text-xl text-slate-900 mb-4">Component Dependencies</h2>
                    <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg text-sm overflow-x-auto">
                        {`App.tsx
├── PremiumHero.tsx
├── NewFeaturedListings.tsx
├── WhyChooseUs.tsx
├── NewTestimonials.tsx
├── TeamSection.tsx
├── NewFooter.tsx
└── HomepageDiagram.tsx (this view)`}
                    </pre>
                </div>
            </div>
        </div>
    );
}
