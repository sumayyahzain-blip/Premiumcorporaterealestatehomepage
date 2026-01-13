import React from 'react';
import { useComparison } from '../context/ComparisonContext';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Property } from '../../types';

export default function CompareDock() {
    const { selectedProperties, removeFromCompare, clearComparison } = useComparison();
    const navigate = useNavigate();

    if (selectedProperties.length === 0) return null;

    const getImage = (p: Property) => {
        return (p as any).primaryImageUrl || (p.images && p.images?.[0]?.url) || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';
    };

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#003366]/95 backdrop-blur-md border-t border-[#D4AF37] shadow-2xl animate-in slide-in-from-bottom duration-300`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Left: Info & Thumbnails */}
                <div className="flex items-center gap-6">
                    <div className="text-white">
                        <div className="flex items-baseline gap-1">
                            <span className="text-[#D4AF37] font-bold text-2xl">{selectedProperties.length}</span>
                            <span className="text-sm opacity-80 font-medium">homes selected</span>
                        </div>
                        <p className="text-xs text-gray-400">Max 3 properties</p>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex items-center -space-x-4">
                        {selectedProperties.map((prop) => (
                            <div key={prop.id} className="relative w-16 h-12 rounded-lg border-2 border-[#D4AF37] overflow-hidden shadow-lg transition hover:scale-110 hover:z-10 group">
                                <img
                                    src={getImage(prop)}
                                    alt={prop.title}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => removeFromCompare(prop.id)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex gap-4 items-center">
                    <button
                        onClick={clearComparison}
                        className="text-sm text-gray-300 hover:text-white underline decoration-gray-500 underline-offset-4 transition-colors"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={() => navigate('/compare')}
                        className="bg-[#D4AF37] hover:bg-[#b5952f] text-[#003366] px-8 py-3 rounded-xl font-bold shadow-lg transform transition hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        Compare Now
                        <ArrowRight size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
}
