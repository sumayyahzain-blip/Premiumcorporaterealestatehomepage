import React, { useState } from 'react';
import { useComparison } from '../context/ComparisonContext';
import { X, ArrowRight } from 'lucide-react';
// import { useNavigate } from 'react-router-dom'; // No longer needed for modal approach
import type { Property } from '../../types';
import { ComparisonModal } from './ComparisonModal';

export default function CompareDock() {
    const { selectedProperties, removeFromCompare, clearComparison } = useComparison();
    // const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    if (selectedProperties.length === 0) return null;

    const getImage = (p: Property) => {
        return (p as any).primaryImageUrl || (p.images && p.images?.[0]?.url) || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';
    };

    return (
        <>
            <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#003366]/95 backdrop-blur-md border-t border-[#D4AF37] shadow-2xl transition-transform duration-300 ${selectedProperties.length > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    {/* Text Info */}
                    <div className="text-white font-medium flex items-center">
                        <span className="text-[#D4AF37] font-bold text-lg">{selectedProperties.length}</span>
                        <span className="ml-1 text-sm opacity-80">homes selected (Max 3)</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 items-center">
                        <button onClick={clearComparison} className="text-sm text-gray-300 hover:text-white underline">
                            Clear
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-[#D4AF37] hover:bg-[#b5952f] text-[#003366] px-6 py-2 rounded-lg font-bold shadow-lg transform transition hover:scale-105 flex items-center gap-2"
                        >
                            Compare Now
                            <ArrowRight size={16} />
                        </button>
                    </div>

                </div>
            </div>

            <ComparisonModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
}
