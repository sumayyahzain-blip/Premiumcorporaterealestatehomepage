import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// FIX: Use CDN icons to guarantee visibility
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

// Helper component to auto-fit bounds based on properties
function MapUpdater({ properties, center, zoom }: { properties: any[], center: [number, number], zoom: number }) {
    const map = useMap();

    useEffect(() => {
        if (properties && properties.length > 0) {
            // Calculate bounds
            const bounds = L.latLngBounds(properties.map((p: any) => {
                const lat = p.latitude || p.lat || (p.location && p.location.lat);
                const lng = p.longitude || p.lng || (p.location && p.location.lng);
                if (lat && lng) return [lat, lng];
                return null;
            }).filter(Boolean) as L.LatLngExpression[]);

            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
            }
        } else {
            // Fallback to center if no properties
            map.setView(center, zoom);
        }
    }, [properties, center, zoom, map]);

    return null;
}

// Click Handler for AddProperty (Preserved functionality)
function LocationSelector({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
    const map = useMap();
    useEffect(() => {
        map.on('click', (e) => {
            onSelect(e.latlng.lat, e.latlng.lng);
        });
        return () => { map.off('click'); };
    }, [map, onSelect]);
    return null;
}

interface MapEngineProps {
    properties?: any[]; // Allow optional
    className?: string; // Allow external styling
    center?: [number, number];
    zoom?: number;
    // AddProperty props
    onLocationSelect?: (lat: number, lng: number) => void;
    interactiveMarker?: { lat: number, lng: number } | null;
}

export default function MapEngine({
    properties = [],
    className = "",
    center = [40.7128, -74.0060], // Default NYC
    zoom = 13,
    onLocationSelect,
    interactiveMarker
}: MapEngineProps) {

    // Filter valid properties (Handle lat/lng vs latitude/longitude)
    const validProps = properties.filter(p => {
        const lat = p.latitude || p.lat || (p.location && p.location.lat);
        const lng = p.longitude || p.lng || (p.location && p.location.lng);
        return lat && lng;
    });

    return (
        <div className={`rounded-xl overflow-hidden border-2 border-slate-100 shadow-lg relative z-0 ${className} ${!className.includes('h-') ? 'h-96' : ''}`}>
            <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <MapUpdater properties={validProps} center={center} zoom={zoom} />

                {onLocationSelect && <LocationSelector onSelect={onLocationSelect} />}

                {validProps.map((property) => {
                    const lat = property.latitude || property.lat || property.location?.lat;
                    const lng = property.longitude || property.lng || property.location?.lng;
                    return (
                        <Marker key={property.id} position={[lat, lng]} icon={icon}>
                            <Popup>
                                <div className="w-48 text-center p-1">
                                    <div className="w-full h-28 bg-gray-100 rounded mb-2 overflow-hidden">
                                        <img
                                            src={property.primaryImageUrl || property.image_url || property.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                            alt="Home"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p className="font-bold text-slate-800 text-lg">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(property.salePrice || property.price || 0)}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-2 truncate">{property.addressLine1 || property.address}</p>
                                    <a
                                        href={`/property/${property.id}`}
                                        className="block w-full py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors no-underline"
                                    >
                                        View Details
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {interactiveMarker && (
                    <Marker position={[interactiveMarker.lat, interactiveMarker.lng]} icon={icon}>
                        <Popup>Selected Location</Popup>
                    </Marker>
                )}

            </MapContainer>
        </div>
    );
}
