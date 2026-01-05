import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Search, ArrowRight } from 'lucide-react';
import { parseSmartQuery } from '../../utils/searchParser';

export function SmartSearchBar() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = () => {
        if (!query.trim()) return;

        // "AI" Parsing
        const parsedFilters = parseSmartQuery(query);

        // Navigate with state
        navigate('/properties', {
            state: {
                globalSearch: query,
                smartFilters: parsedFilters
            }
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto relative z-20">
            {/* Main Container with Glassmorphism */}
            <div
                className={`
                    relative bg-white/10 backdrop-blur-xl border border-white/20 
                    rounded-[2rem] overflow-hidden transition-all duration-300
                    ${isFocused ? 'shadow-[0_0_40px_rgba(255,255,255,0.2)] bg-white/20 scale-[1.02]' : 'shadow-2xl shadow-black/30'}
                `}
            >
                <div className="flex flex-col md:flex-row items-stretch">

                    {/* Input Area */}
                    <div className="flex-1 relative group">
                        <div className="absolute top-5 left-6 text-white/60">
                            <Sparkles size={20} className={isFocused ? "text-amber-400 animate-pulse" : ""} />
                        </div>
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onKeyDown={handleKeyDown}
                            placeholder="Describe your dream home... (e.g. 'Modern 3 bed condo with a pool under $2M')"
                            className="w-full h-full bg-transparent text-white placeholder-white/60 text-lg md:text-xl px-14 py-5 outline-none resize-none border-none focus:ring-0 leading-relaxed min-h-[80px] md:min-h-[60px] flex items-center pt-5"
                        />
                    </div>

                    {/* Action Area */}
                    <div className="p-2 flex items-center justify-end md:border-l border-white/10 bg-black/10 md:bg-transparent">
                        <button
                            onClick={handleSearch}
                            disabled={!query.trim()}
                            className={`
                                flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white transition-all
                                ${query.trim()
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30'
                                    : 'bg-white/10 text-white/40 cursor-not-allowed'}
                            `}
                        >
                            <span>Search</span>
                            {query.trim() ? <ArrowRight size={18} /> : <Search size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Helper Tags (Optional suggestions) */}
            {isFocused && (
                <div className="absolute top-full left-0 right-0 mt-4 flex flex-wrap gap-2 justify-center animate-in fade-in slide-in-from-top-2">
                    {['Waterfront views', 'Penthouse', 'Backyard for dog', 'Near schools', 'Under $1M'].map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setQuery(prev => prev + (prev ? ' ' : '') + tag)}
                            className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 text-sm hover:bg-white/10 hover:border-white/30 transition-all"
                        >
                            + {tag}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
