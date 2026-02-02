import React, { useState, useEffect } from 'react';
import { MapPin, Search, CheckCircle2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icons issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map view updates
const RecenterMap = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const center = [17.4875, 78.4404];

const serviceAreas = [
    { id: 1, name: 'Maisammaguda', lat: 17.555, lng: 78.435 },
    { id: 2, name: 'Bahadurpally', lat: 17.561, lng: 78.430 },
    { id: 3, name: 'Gandimaisamma', lat: 17.583, lng: 78.440 },
    { id: 4, name: 'Suraram', lat: 17.525, lng: 78.448 },
    { id: 5, name: 'Dulapally', lat: 17.545, lng: 78.460 }
];

const DeliveryAreas = () => {
    const [search, setSearch] = useState('');
    const [hoveredArea, setHoveredArea] = useState(null);

    const filteredAreas = serviceAreas.filter(area =>
        area.name.toLowerCase().includes(search.toLowerCase())
    );

    const customIcon = (isActive) => L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-inner ${isActive ? 'bg-orange-500' : 'bg-orange-400'}">
                <div class="${isActive ? 'marker-pulse bg-orange-500' : ''}"></div>
              </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    return (
        <section className="bg-slate-50 py-32 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-[100px] -ml-48 -mb-48" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    <div className="flex-1 w-full lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Delivery Available</span>
                        </div>

                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-6">
                            We Deliver To <br />
                            <span className="text-grad-primary">Your Neighborhood.</span>
                        </h2>

                        <p className="text-slate-500 text-lg font-medium italic mb-10 max-w-lg">
                            Fast, reliable delivery across these key locations. Check if you're in our zone.
                        </p>

                        <div className="relative max-w-sm mb-12">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                            <input
                                type="text"
                                placeholder="Check your area..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-14 pl-14 pr-6 bg-white rounded-2xl border-2 border-slate-100 focus:border-orange-500/20 focus:bg-white transition-all outline-none font-bold text-slate-900 shadow-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                            {filteredAreas.length > 0 ? (
                                filteredAreas.map(area => (
                                    <div
                                        key={area.id}
                                        onMouseEnter={() => setHoveredArea(area)}
                                        onMouseLeave={() => setHoveredArea(null)}
                                        className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-orange-100 hover:translate-y-[-2px] transition-all cursor-default flex items-center gap-4"
                                    >
                                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                                            <MapPin size={18} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{area.name}</h4>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1">
                                                <CheckCircle2 size={10} /> Active
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-8 bg-white/50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-sm font-bold text-slate-400">Area not found yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 h-[500px] relative">
                        <div className="absolute inset-0 bg-white p-2 rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-700">
                            <div className="h-full w-full rounded-[24px] overflow-hidden relative">
                                <MapContainer
                                    center={center}
                                    zoom={12}
                                    scrollWheelZoom={false}
                                    className="h-full w-full"
                                    zoomControl={false}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    />
                                    <RecenterMap
                                        center={hoveredArea ? [hoveredArea.lat, hoveredArea.lng] : center}
                                        zoom={hoveredArea ? 13 : 12}
                                    />

                                    {serviceAreas.map(area => (
                                        <React.Fragment key={area.id}>
                                            <Marker
                                                position={[area.lat, area.lng]}
                                                icon={customIcon(hoveredArea?.id === area.id)}
                                            />
                                            {hoveredArea?.id === area.id && (
                                                <Circle
                                                    center={[area.lat, area.lng]}
                                                    radius={2000}
                                                    pathOptions={{ fillColor: '#F97316', color: '#F97316', opacity: 0.2, fillOpacity: 0.1 }}
                                                />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </MapContainer>

                                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-white shadow-lg z-[1000]">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <p className="text-xs font-bold text-slate-600">Live Delivery Zones</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DeliveryAreas;
