import React, { useState } from 'react';
import { Heart, Bed, Bath, Maximize, Info, Check, TrendingUp, Car, GraduationCap, Calculator } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useSupabaseAuth } from '../../lib/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useComparison } from '../context/ComparisonContext';
import type { Property } from '../../types';

interface PropertyCardProps {
  type: 'buy' | 'rent';
  image: string;
  price: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  estRent?: string;
  capRate?: string;
  monthlyRent?: string;
  leaseTerm?: string;
  availability?: string;
  estYearIncome?: string;
  onClick?: () => void;
  className?: string;
  // Optional Comparison Data
  id?: string | number;
  data?: Property;
}

export function PropertyCard({
  type,
  image,
  price,
  address,
  beds,
  baths,
  sqft,
  estRent,
  capRate,
  monthlyRent,
  leaseTerm,
  availability,
  estYearIncome,
  onClick,
  className = '',
  id,
  data
}: PropertyCardProps) {
  const { user } = useSupabaseAuth();
  const [saved, setSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Comparison Context
  const { addToCompare, removeFromCompare, isInComparison, selectedProperties } = useComparison();
  const isCompared = id ? isInComparison(id) : false;

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert("Please sign in to save properties.");
      return;
    }

    // Optimistic Update
    const nextState = !saved;
    setSaved(nextState);

    try {
      if (nextState) {
        const { error } = await supabase
          .from('saved_properties')
          .insert([{ user_id: user.id, property_id: String(id) }]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', String(id));
        if (error) throw error;
      }
    } catch (err) {
      console.error("Error saving property:", err);
      setSaved(!nextState); // Revert
      alert("Failed to update saved property.");
    }
  };

  // Mortgage Calculation for "Buy" Context
  const calculateMortgage = (priceStr: string) => {
    const numericPrice = Number(priceStr.replace(/[^0-9.-]+/g, ""));
    if (isNaN(numericPrice)) return null;
    const monthly = numericPrice * 0.005; // 0.5% rule of thumb
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(monthly);
  };

  const estMortgage = type === 'buy' ? calculateMortgage(price) : null;

  return (
    <div className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full ${className}`}>
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--gray-100)]">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[var(--gray-100)] animate-pulse" />
        )}
        <img
          src={image}
          alt={address}
          loading="lazy"
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Status Badges */}
        {(data?.status === 'active' || data?.status === 'sold') && (
          <div className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-md pointer-events-none ${data.status === 'sold' ? 'bg-red-600 text-white' : 'bg-[#0f172a] text-white'
            }`}>
            {data.status === 'sold' ? (
              <span className="text-[10px] font-bold tracking-wider leading-none uppercase pt-0.5">SOLD</span>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-[10px] font-bold tracking-wider leading-none uppercase pt-0.5">
                  Active
                </span>
              </>
            )}
          </div>
        )}


        {/* Listing Type Badge */}
        <div className={`absolute top-12 left-3 z-10 px-3 py-1.5 rounded-lg shadow-md pointer-events-none text-white text-[10px] font-bold tracking-wider uppercase ${type === 'buy' ? 'bg-emerald-600' : 'bg-blue-600'
          }`}>
          {type === 'buy' ? 'For Sale' : 'For Rent'}
        </div>

        {/* Top Right - Actions Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          {/* COMPARE CHECKBOX */}
          {data && (
            <label className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm cursor-pointer hover:bg-white transition hover:scale-105">
              <input
                type="checkbox"
                checked={isCompared}
                className="w-4 h-4 text-[#D4AF37] rounded border-gray-300 focus:ring-[#D4AF37]"
                onChange={(e) => {
                  e.stopPropagation();
                  if (!data) return;
                  if (e.target.checked) {
                    if (selectedProperties.length >= 3) {
                      alert("You can compare max 3 properties");
                      return;
                    }
                    addToCompare(data);
                  } else {
                    if (id) removeFromCompare(id);
                  }
                }}
              />
              <span className="text-xs font-bold text-[#003366] uppercase tracking-wide">Compare</span>
            </label>
          )}

          {/* Save Button */}
          <button
            onClick={handleToggleSave}
            className="self-end p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-sm hover:scale-110"
          >
            <Heart
              size={18}
              className={`transition-colors ${saved ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
            />
          </button>
        </div>

        {/* Smart Badges (Bottom Left of Image) - REFINED PALETTE */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 pointer-events-none">
          {/* Investment Badge - GOLD */}
          {(data?.capRate && Number(data.capRate) >= 4) && (
            <div className="bg-yellow-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 shadow-sm">
              <TrendingUp size={12} className="stroke-[3]" />
              Great Value
            </div>
          )}
          {/* School Badge - Navy Blue */}
          {data && (Number(data.id) % 2 === 0) && (
            <div className="bg-[#003366]/90 backdrop-blur-md text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 shadow-sm">
              <GraduationCap size={12} className="stroke-[3]" />
              Top Schools
            </div>
          )}
          {/* Commuter Badge - Slate */}
          {data && (Number(data.id) % 3 === 0) && (
            <div className="bg-slate-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 shadow-sm">
              <Car size={12} className="stroke-[3]" />
              Commuter Pick
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Price */}
        <div className="mb-3">
          <div className="text-2xl font-bold text-[var(--gray-900)]">
            {type === 'rent' && monthlyRent ? monthlyRent : price}
            {type === 'rent' && <span className="text-base font-normal text-[var(--gray-600)]">/month</span>}
          </div>
        </div>

        {/* Address */}
        <div className="text-[var(--gray-700)] mb-4 truncate font-medium">{address}</div>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-[var(--gray-600)] mb-5 pb-5 border-b border-[var(--gray-200)]">
          <div className="flex items-center gap-1.5">
            <Bed size={18} strokeWidth={2} />
            <span className="font-semibold">{beds}</span> <span className="text-xs uppercase tracking-wide">Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath size={18} strokeWidth={2} />
            <span className="font-semibold">{baths}</span> <span className="text-xs uppercase tracking-wide">Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize size={18} strokeWidth={2} />
            <span className="font-semibold">{sqft.toLocaleString()}</span> <span className="text-xs uppercase tracking-wide">Sqft</span>
          </div>
        </div>

        {/* Type-specific Details (The Swap) */}
        <div className="mb-2">
          {type === 'buy' && estMortgage && (
            <div className="flex items-center gap-2 text-sm text-[var(--gray-600)]">
              <div className="p-1.5 bg-[#D4AF37]/10 rounded-full text-[#b5952f]">
                <Calculator size={14} />
              </div>
              <span>Est. Mortgage: <span className="font-bold text-[#0f172a]">{estMortgage}/mo</span></span>
            </div>
          )}

          {type === 'rent' && (
            <div className="flex items-center gap-2 text-sm text-[var(--gray-600)]">
              <div className="p-1.5 bg-emerald-100 rounded-full text-emerald-600">
                <Check size={14} />
              </div>
              <span>
                Available: <span className="font-bold text-emerald-700">{availability?.includes('/') ? 'Soon' : (availability || 'Now')}</span>
              </span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="mt-auto pt-4">
          <button
            onClick={onClick}
            className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-[#0f172a] font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg uppercase tracking-wider text-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
