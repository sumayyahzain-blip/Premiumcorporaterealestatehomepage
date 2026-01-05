import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';

export default function SearchBar() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'buy' | 'rent'>('buy');
    const [propertyType, setPropertyType] = useState('All');
    const [location, setLocation] = useState('');

    const handleSearch = () => {
        const queryParams = new URLSearchParams();
        if (location) queryParams.set('query', location);
        if (propertyType !== 'All') queryParams.set('type', propertyType.toLowerCase().replace('-', '_'));

        // Navigate to the correct page based on status
        const targetPath = status === 'buy' ? '/buy' : '/rent';
        navigate(`${targetPath}?${queryParams.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="w-full max-w-4xl flex flex-col items-center">
            {/* Status Switcher Tabs */}
            {/* Status Switcher Tabs (Glass Pill) */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-full px-8 py-2.5 mb-8 flex gap-8 border border-white/10 shadow-lg">
                <button
                    onClick={() => setStatus('buy')}
                    className={`text-lg font-semibold transition-all ${status === 'buy'
                        ? 'text-yellow-500'
                        : 'text-white/70 hover:text-white'
                        }`}
                >
                    Buy
                </button>
                <button
                    onClick={() => setStatus('rent')}
                    className={`text-lg font-semibold transition-all ${status === 'rent'
                        ? 'text-yellow-500'
                        : 'text-white/70 hover:text-white'
                        }`}
                >
                    Rent
                </button>
            </div>

            {/* Search Pill */}
            <div className="w-full bg-white rounded-full p-2 pl-8 flex items-center shadow-2xl">
                {/* Location Input */}
                <div className="flex-1 flex flex-col justify-center">
                    <label className="text-[10px] font-extrabold tracking-[0.15em] text-gray-400 uppercase mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="City, Zip, or Address"
                        className="w-full bg-transparent text-gray-900 font-semibold text-sm placeholder-gray-400 focus:outline-none truncate"
                    />
                </div>

                {/* Vertical Divider */}
                <div className="w-px h-10 bg-gray-200 mx-6"></div>

                {/* Property Type Dropdown */}
                <div className="w-48 relative flex flex-col justify-center border-r border-transparent pr-4">
                    <label className="text-[10px] font-extrabold tracking-[0.15em] text-gray-400 uppercase mb-1">
                        Property Type
                    </label>
                    <div className="relative">
                        <select
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                            className="w-full bg-transparent text-gray-900 font-semibold text-sm appearance-none focus:outline-none cursor-pointer"
                        >
                            <option>All</option>
                            <option>House</option>
                            <option>Condo</option>
                            <option>Land</option>
                            <option>Multi-family</option>
                        </select>
                        <ChevronDown
                            size={16}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="bg-[#0f172a] hover:bg-slate-800 text-white rounded-full p-3.5 ml-2 transition-colors shadow-md flex items-center justify-center group"
                >
                    <Search size={20} strokeWidth={2.5} className="text-white" />
                </button>
            </div>
        </div>
    );
}
