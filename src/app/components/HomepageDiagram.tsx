import React from 'react';

export default function HomepageDiagram() {
    return (
        <div className="min-h-screen bg-slate-100 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 text-center mb-8">Application Architecture</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Router Layer */}
                    <div className="space-y-4">
                        <h2 className="font-bold text-xl text-slate-800">1. Routing (App.tsx)</h2>
                        <div className="bg-slate-800 text-white p-4 rounded-xl">
                            <ul className="space-y-2 font-mono text-sm">
                                <li className="text-emerald-400">/ &rarr; Homepage.tsx</li>
                                <li className="text-blue-400">/buy &rarr; BuyListing.tsx</li>
                                <li className="text-purple-400">/rent &rarr; RentListing.tsx</li>
                                <li className="text-amber-400">/property/:id &rarr; PropertyDetail.tsx</li>
                                <li className="text-rose-400">/dashboard &rarr; OwnerDashboard.tsx</li>
                                <li className="text-cyan-400">/pricing &rarr; Pricing.tsx</li>
                            </ul>
                        </div>
                    </div>

                    {/* Component Reuse */}
                    <div className="space-y-4">
                        <h2 className="font-bold text-xl text-slate-800">2. Key Components</h2>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                             <div className="flex items-center gap-2">
                                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">PremiumHero</span>
                                <span className="text-sm text-slate-600">Main navigation & Hero visuals (used in Homepage)</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">PropertyCard</span>
                                <span className="text-sm text-slate-600">Reusable card for Buy/Rent grids</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2 py-1 rounded">NewFooter</span>
                                <span className="text-sm text-slate-600">Global footer component</span>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                    <h2 className="font-bold text-xl text-slate-900 mb-4">Tree Structure</h2>
                    <pre className="bg-slate-900 text-slate-50 p-6 rounded-lg text-sm overflow-x-auto font-mono leading-relaxed">
                        {`App.tsx (Router)
├── Pages
│   ├── Homepage.tsx (Fixed Hero + Scroll Sections)
│   ├── BuyListing.tsx (Sidebar + Grid)
│   ├── RentListing.tsx (Sidebar + Grid)
│   ├── PropertyDetail.tsx (Gallery + Info)
│   ├── OwnerDashboard.tsx (Stats + Management)
│   └── Pricing.tsx (Cards + Table)
└── Components
    ├── PremiumHero.tsx
    ├── PropertyCard.tsx
    └── ... (Sections: Featured, Team, Testimonials, Footer)`}
                    </pre>
                </div>
            </div>
        </div>
    );
}
