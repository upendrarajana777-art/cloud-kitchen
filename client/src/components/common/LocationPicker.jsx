import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { MapPin, Navigation } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const defaultCenter = [17.3850, 78.4867];

const MapEvents = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
};

const MapController = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
    const [position, setPosition] = useState(
        initialLocation ? [initialLocation.lat, initialLocation.lng] : defaultCenter
    );

    const handleMapClick = useCallback((latlng) => {
        const newPos = [latlng.lat, latlng.lng];
        setPosition(newPos);
        onLocationSelect({ lat: latlng.lat, lng: latlng.lng });
    }, [onLocationSelect]);

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const newPos = [pos.coords.latitude, pos.coords.longitude];
                    setPosition(newPos);
                    onLocationSelect({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                },
                (error) => {
                    console.error("Error getting location: ", error);
                    alert("Could not get your location. Please ensure location services are enabled.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-inner bg-orange-500">
                <div class="marker-pulse bg-orange-500"></div>
              </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                    <MapPin size={14} className="text-orange-500" />
                    Pin Delivery Location
                </label>
                <button
                    type="button"
                    onClick={handleCurrentLocation}
                    className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
                >
                    <Navigation size={12} /> Use My Location
                </button>
            </div>

            <div className="relative h-[350px] w-full rounded-[24px] overflow-hidden shadow-lg border-4 border-white z-0">
                <MapContainer
                    center={position}
                    zoom={15}
                    className="h-full w-full"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <MapController center={position} />
                    <MapEvents onMapClick={handleMapClick} />
                    <Marker position={position} icon={customIcon} />
                </MapContainer>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg pointer-events-none z-[1000]">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        Tap map to adjust pin
                    </p>
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-bold text-slate-500">
                    Selected: {position[0].toFixed(6)}, {position[1].toFixed(6)}
                </p>
            </div>
        </div>
    );
};

export default LocationPicker;
