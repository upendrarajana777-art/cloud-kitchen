import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { MapPin, Navigation } from 'lucide-react';
import Button from '../ui/Button';

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '24px'
};

// Default to Hyderabad or a relevant central location if no prop provided
const defaultCenter = {
    lat: 17.3850,
    lng: 78.4867
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: [
        {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [{ "visibility": "off" }]
        }
    ]
};

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
    const [markerPosition, setMarkerPosition] = useState(initialLocation || defaultCenter);
    const [map, setMap] = useState(null);
    const mapRef = useRef(null);

    const onLoad = useCallback(function callback(map) {
        mapRef.current = map;
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
        mapRef.current = null;
    }, []);

    const handleMapClick = (e) => {
        const newPos = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        };
        setMarkerPosition(newPos);
        onLocationSelect(newPos);
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setMarkerPosition(pos);
                    onLocationSelect(pos);
                    if (mapRef.current) {
                        mapRef.current.panTo(pos);
                        mapRef.current.setZoom(16);
                    }
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

            <div className="relative h-[350px] w-full rounded-[24px] overflow-hidden shadow-lg border-4 border-white">
                <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_KEY}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={markerPosition}
                        zoom={14}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        onClick={handleMapClick}
                        options={mapOptions}
                    >
                        <Marker
                            position={markerPosition}
                            draggable={true}
                            onDragEnd={handleMapClick}
                            animation={typeof window !== 'undefined' && window.google?.maps?.Animation ? window.google.maps.Animation.DROP : undefined}
                        />
                    </GoogleMap>
                </LoadScript>

                {/* Overlay Hint */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg pointer-events-none">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        Tap map to adjust pin
                    </p>
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse bg-emerald-400" />
                <p className="text-xs font-bold text-slate-500">
                    Selected: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
                </p>
            </div>
        </div>
    );
};

export default LocationPicker;
