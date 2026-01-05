import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Create a custom hook to update the map view when props change
function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 15);
    }, [center, map]);
    return null;
}

// 1. CUSTOM MARKER (Gold)
const createGoldIcon = () => {
    return L.divIcon({
        className: 'custom-gold-pin',
        html: `
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3));">
        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" fill="#D4AF37" stroke="white" stroke-width="1.5"/>
        <circle cx="12" cy="10" r="3" fill="#0f172a"/>
      </svg>
    `,
        iconSize: [40, 40],
        iconAnchor: [20, 40], // Tip of the pin (bottom center)
        popupAnchor: [0, -40] // Top of the pin
    });
};

interface PropertyMapProps {
    latitude: number | null;
    longitude: number | null;
    address: string;
    price: number | null | undefined;
    status: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ latitude, longitude, address, price, status }) => {
    // Safety check for invalid coordinates
    const isValidLocation = latitude !== null && longitude !== null && latitude !== 0 && longitude !== 0;

    const formatPrice = (val: number | null | undefined) => {
        if (!val) return 'Req';
        // Shorten price for map pin (e.g. $1.2M)
        if (val >= 1000000) {
            return `$${(val / 1000000).toFixed(1)}M`;
        }
        if (val >= 1000) {
            return `$${(val / 1000).toFixed(0)}k`;
        }
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    const detailsPrice = (val: number | null | undefined) => {
        if (!val) return 'Price on Request';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    }

    // 2. LUXURY BADGE STYLES (Popup)
    const getStatusStyle = (statusVal: string) => {
        const s = statusVal.toLowerCase();
        if (s === 'active' || s === 'for sale' || s === 'for rent') return 'bg-[#0f172a] text-white border border-white/20';
        if (s === 'sold' || s === 'rented') return 'bg-gray-100 text-gray-800 border-gray-200';
        if (s === 'pending') return 'bg-amber-100 text-amber-900 border-amber-200';
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    if (!isValidLocation) {
        return (
            <div className="h-[400px] w-full bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-gray-500 border border-gray-200">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                    <MapPin size={32} className="text-slate-400" />
                </div>
                <p className="font-medium text-lg text-slate-600">Location map unavailable</p>
                <p className="text-sm text-slate-400 max-w-xs text-center mt-1">
                    Coordinates for this property have not been set.
                </p>
            </div>
        );
    }

    const goldIcon = createGoldIcon();

    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 relative z-0">
            <style>{`
                /* 2. PREMIUM TOOLTIP STYLING */
                .price-tooltip {
                    background-color: #0f172a;
                    border: none;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
                    color: white;
                    font-weight: 700;
                    font-size: 12px;
                    padding: 4px 8px;
                    border-radius: 6px;
                    opacity: 1 !important; /* Force visible */
                }
                /* Tail/Flagpole Coloring */
                .leaflet-tooltip-top.price-tooltip::before {
                    border-top-color: #0f172a;
                    opacity: 1;
                }
                
                /* Popup Styling Fixes */
                .leaflet-popup-content-wrapper {
                    padding: 0;
                    border-radius: 12px;
                    overflow: visible;
                }
                .leaflet-popup-content {
                    margin: 0;
                    width: auto !important;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .leaflet-popup-tip {
                    background: white;
                }
            `}</style>

            <MapContainer
                center={[latitude as number, longitude as number]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <MapUpdater center={[latitude as number, longitude as number]} />

                {/* CARTO TILES */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                <Marker
                    position={[latitude as number, longitude as number]}
                    icon={goldIcon}
                >
                    {/* 1. PERMANENT PRICE TOOLTIP */}
                    <Tooltip
                        permanent
                        direction="top"
                        offset={[0, -42]}
                        className="price-tooltip"
                    >
                        {formatPrice(price)}
                    </Tooltip>

                    {/* DETAILED CLICK POPUP */}
                    <Popup
                        closeButton={false}
                        minWidth={200}
                        maxWidth={240}
                    >
                        <div className="font-sans bg-white pb-1">
                            {/* Header: Dark Navy */}
                            <div className="bg-[#0f172a] px-4 py-3 flex items-center justify-between border-b border-white/10">
                                <span className="text-white font-serif font-medium tracking-wide text-xs">
                                    Grade A
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusStyle(status)}`}>
                                    {status}
                                </span>
                            </div>

                            {/* Body */}
                            <div className="p-4 bg-white text-left">
                                <div className="font-serif font-bold text-gray-900 text-lg mb-1">
                                    {detailsPrice(price)}
                                </div>
                                <div className="text-xs text-gray-500 font-medium leading-relaxed uppercase tracking-wide">
                                    {address}
                                </div>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default PropertyMap;
