import React, { useState } from 'react';
import { Heart, Bed, Bath, Maximize, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

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
  className = ''
}: PropertyCardProps) {
  const [saved, setSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group ${className}`}>
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--gray-100)]">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[var(--gray-100)] animate-pulse" />
        )}
        <img
          src={image}
          alt={address}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSaved(!saved);
          }}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all"
        >
          <Heart
            size={20}
            className={`transition-colors ${saved ? 'fill-red-500 text-red-500' : 'text-[var(--gray-700)]'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Price */}
        <div className="mb-3">
          <div className="text-2xl font-semibold text-[var(--gray-900)]">
            {type === 'rent' && monthlyRent ? monthlyRent : price}
            {type === 'rent' && <span className="text-base font-normal text-[var(--gray-600)]">/month</span>}
          </div>
        </div>

        {/* Address */}
        <div className="text-[var(--gray-700)] mb-4">{address}</div>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-[var(--gray-600)] mb-4 pb-4 border-b border-[var(--gray-200)]">
          <div className="flex items-center gap-1.5">
            <Bed size={18} />
            <span>{beds} bed{beds !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath size={18} />
            <span>{baths} bath{baths !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize size={18} />
            <span>{sqft.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Type-specific Details */}
        {type === 'buy' && (estRent || capRate) && (
          <div className="mb-4 text-sm text-[var(--gray-600)]">
            {estRent && <div>Est. Rent: <span className="font-medium text-[var(--gray-700)]">{estRent}/mo</span></div>}
            {capRate && <div>Cap Rate: <span className="font-medium text-[var(--emerald-700)]">{capRate}</span></div>}
          </div>
        )}

        {type === 'rent' && (leaseTerm || availability) && (
          <div className="mb-4 space-y-2">
            {leaseTerm && (
              <div className="text-sm text-[var(--gray-600)]">
                Lease Term: <span className="font-medium text-[var(--gray-700)]">{leaseTerm}</span>
              </div>
            )}
            {availability && (
              <div className="text-sm text-[var(--gray-600)]">
                Availability: <span className="font-medium text-[var(--gray-700)]">{availability}</span>
              </div>
            )}
          </div>
        )}

        {/* Rental Income Estimate */}
        {type === 'rent' && estYearIncome && (
          <>
            <div className="pt-4 border-t border-[var(--gray-200)] mb-4">
              <TooltipProvider>
                <Tooltip>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--gray-900)]">
                      Est. 1-Year Income: {estYearIncome}
                    </span>
                    <TooltipTrigger asChild>
                      <button className="text-[var(--gray-500)] hover:text-[var(--gray-700)] transition-colors">
                        <Info size={16} />
                      </button>
                    </TooltipTrigger>
                  </div>
                  <TooltipContent>
                    <p className="text-sm max-w-xs">
                      Based on listed monthly rent. Excludes expenses and vacancies.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}

        {/* CTA Button */}
        <button
          onClick={onClick}
          className="w-full bg-[var(--emerald-700)] hover:bg-[var(--emerald-800)] text-white py-3 rounded-lg transition-all font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
