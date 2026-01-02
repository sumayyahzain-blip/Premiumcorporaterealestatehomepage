import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: String(icon),
    shadowUrl: String(iconShadow),
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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
        if (!val) return 'Price on Request';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    const getStatusColor = (statusVal: string) => {
        const s = statusVal.toLowerCase();
        if (s === 'active' || s === 'for sale' || s === 'for rent') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        if (s === 'sold' || s === 'rented') return 'bg-red-100 text-red-800 border-red-200';
        if (s === 'pending') return 'bg-amber-100 text-amber-800 border-amber-200';
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const formatStatus = (s: string) => {
        return s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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

    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative z-0">
            <MapContainer
                center={[latitude as number, longitude as number]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude as number, longitude as number]}>
                    <Tooltip
                        permanent
                        direction="top"
                        offset={[0, -36]}
                        className="!p-0 !bg-transparent !border-none !shadow-none"
                    >
                        <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100 relative min-w-[180px]">
                            {/* Triangle Arrow */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-gray-100"></div>

                            <div className="relative z-10 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider ${getStatusColor(status)}`}>
                                        {status}
                                    </span>
                                </div>
                                <div className="font-bold text-gray-900 text-lg mb-0.5">
                                    {formatPrice(price)}
                                </div>
                                <div className="text-xs text-gray-500 font-medium leading-tight px-2">
                                    {address}
                                </div>
                            </div>
                        </div>
                    </Tooltip>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default PropertyMap;
