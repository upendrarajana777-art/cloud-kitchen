import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import socket from '../../services/socket';
import { Package, MapPin, ChefHat, Timer, Clock } from 'lucide-react';

// Fix icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const statusColors = {
    pending: '#F97316', // Orange
    accepted: '#6366F1', // Indigo
    preparing: '#A855F7', // Purple
    ready: '#EAB308', // Yellow
    out_for_delivery: '#3B82F6', // Blue
    completed: '#10B981', // Emerald
    cancelled: '#EF4444', // Red
};

const createCustomIcon = (status) => {
    const color = statusColors[status] || '#94A3B8';
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div class="relative flex items-center justify-center">
                <div class="absolute inset-0 h-10 w-10 rounded-full animate-ping opacity-20" style="background-color: ${color}"></div>
                <div class="h-8 w-8 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white" style="background-color: ${color}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    });
};

// Component to auto-fit bounds when markers change
const AutoFitBounds = ({ markers }) => {
    const map = useMap();
    useEffect(() => {
        if (markers.length > 0) {
            const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
    }, [markers, map]);
    return null;
};

const OrderMap = ({ orders: initialOrders }) => {
    const [orders, setOrders] = useState(initialOrders || []);

    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    useEffect(() => {
        // Real-time updates from socket
        const handleNewOrder = (order) => {
            if (order.address?.location) {
                setOrders(prev => [order, ...prev]);
            }
        };

        const handleUpdate = (updatedOrder) => {
            setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
        };

        const handleDelete = (deletedId) => {
            setOrders(prev => prev.filter(o => o._id !== deletedId));
        };

        socket.on('new-order', handleNewOrder);
        socket.on('admin-order-update', handleUpdate);
        socket.on('order-deleted', handleDelete);

        return () => {
            socket.off('new-order', handleNewOrder);
            socket.off('admin-order-update', handleUpdate);
            socket.off('order-deleted', handleDelete);
        };
    }, []);

    const activeOrderMarkers = useMemo(() => {
        return orders
            .filter(o => o.address?.location?.lat && o.status !== 'completed' && o.status !== 'cancelled')
            .map(o => ({
                id: o._id,
                lat: o.address.location.lat,
                lng: o.address.location.lng,
                status: o.status,
                customer: o.address.customerName || 'Guest',
                total: o.total,
                items: o.items?.length || 0,
                time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
    }, [orders]);

    return (
        <div className="h-full w-full rounded-[32px] overflow-hidden border border-slate-100 shadow-inner relative group">
            <MapContainer
                center={[17.4875, 78.4404]}
                zoom={12}
                className="h-full w-full"
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                <AutoFitBounds markers={activeOrderMarkers} />

                {activeOrderMarkers.map(marker => (
                    <React.Fragment key={marker.id}>
                        <Marker
                            position={[marker.lat, marker.lng]}
                            icon={createCustomIcon(marker.status)}
                        >
                            <Popup perspective={true}>
                                <div className="p-4 min-w-[200px] bg-white">
                                    <div className="flex items-center gap-3 mb-3 border-b border-slate-50 pb-3">
                                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 leading-tight">#{marker.id.slice(-6).toUpperCase()}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{marker.customer}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400 font-medium">Status</span>
                                            <span
                                                className="font-black uppercase tracking-tighter px-2 py-0.5 rounded-full text-[9px]"
                                                style={{ backgroundColor: `${statusColors[marker.status]}20`, color: statusColors[marker.status] }}
                                            >
                                                {marker.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                                            <div className="flex items-center gap-1.5">
                                                <Timer size={12} /> {marker.items} Items
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-900">
                                                ₹{marker.total}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-50">
                                            <Clock size={10} /> Placed at {marker.time}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => window.location.href = `/admin/orders?id=${marker.id}`}
                                        className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center justify-center gap-2"
                                    >
                                        View Order Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                        <Circle
                            center={[marker.lat, marker.lng]}
                            radius={500}
                            pathOptions={{ fillColor: statusColors[marker.status], color: statusColors[marker.status], opacity: 0.1, fillOpacity: 0.05 }}
                        />
                    </React.Fragment>
                ))}
            </MapContainer>

            {/* Map Overlay Stats */}
            <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-2">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white shadow-xl flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                        {activeOrderMarkers.length} Live Deliveries
                    </span>
                </div>
            </div>

            {/* Custom Legend */}
            <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-white shadow-xl max-w-[140px]">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Live Status Legend</p>
                <div className="space-y-2">
                    {['pending', 'preparing', 'out_for_delivery'].map(status => (
                        <div key={status} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: statusColors[status] }} />
                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">
                                {status.replace(/_/g, ' ')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderMap;
