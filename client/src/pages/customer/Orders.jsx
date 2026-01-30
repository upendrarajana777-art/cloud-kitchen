import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, ShoppingBag, Loader2, ChefHat, MapPin, Phone, ArrowLeft, ArrowRight, Star, ExternalLink, Flame, Trash2 } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getOrders, getUserOrders, deleteOrder } from '../../lib/db';
import { getGuestId } from '../../lib/guest';
import Button from '../../components/ui/Button';
import Navbar from '../../components/layout/Navbar';
import socket from '../../services/socket';
import { cn } from '../../lib/utils';

const OrderTracking = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const orderIdToTrack = searchParams.get('id');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Fetch orders for unique guest
                const guestId = getGuestId();
                const data = await getUserOrders(guestId);
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        socket.on('order-status-updated', (updatedOrder) => {
            setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
        });

        return () => socket.off('order-status-updated');
    }, []);

    const handleCancelOrder = async (order) => {
        if (!['pending', 'accepted'].includes(order.status)) return;

        if (window.confirm("Do you want to cancel this order? It will be removed.")) {
            try {
                // If it's pending or accepted, we treat it as a cancellation which deletes it
                await deleteOrder(order._id);
                setOrders(prev => prev.filter(o => o._id !== order._id));
                if (order._id === trackedOrder?._id) {
                    navigate('/my-orders'); // Redirect if deleting currently viewed order
                }
            } catch (error) {
                console.error("Failed to cancel order", error);
                alert("Failed to cancel order. Please try again.");
            }
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending': return { icon: Clock, color: 'bg-orange-500', label: 'Order Confirmed', description: 'Our chef is viewing your order', progress: 15 };
            case 'accepted': return { icon: ChefHat, color: 'bg-indigo-500', label: 'Accepted', description: 'Your order is being queued', progress: 30 };
            case 'preparing': return { icon: Flame, color: 'bg-yellow-500', label: 'In the Kitchen', description: 'Sizzling flavors in progress', progress: 50 };
            case 'ready': return { icon: Package, color: 'bg-indigo-400', label: 'Ready for Home', description: 'Fresh and packed for you', progress: 70 };
            case 'out_for_delivery': return { icon: MapPin, color: 'bg-blue-600', label: 'Out for Delivery', description: 'Our rider is on the way!', progress: 85 };
            case 'completed': return { icon: CheckCircle2, color: 'bg-emerald-500', label: 'Delivered', description: 'Bon appétit! See you soon', progress: 100 };
            case 'cancelled': return { icon: Trash2, color: 'bg-red-500', label: 'Cancelled', description: 'Order was cancelled', progress: 0 };
            default: return { icon: Clock, color: 'bg-slate-400', label: status, description: 'Processing...', progress: 0 };
        }
    };

    const trackedOrder = orderIdToTrack
        ? orders.find(o => o._id === orderIdToTrack)
        : orders[0];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="h-20 w-20 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin" />
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Syncing with Kitchen...</p>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAFAFA]">
                <Navbar />
                <div className="container mx-auto px-6 py-40 flex flex-col items-center justify-center text-center">
                    <div className="h-40 w-40 bg-white rounded-[40px] flex items-center justify-center text-6xl mb-8 shadow-2xl">🍱</div>
                    <h2 className="text-4xl font-black text-slate-900 mb-4">No Active Orders.</h2>
                    <p className="text-slate-400 font-medium italic mb-12">Haven't ordered yet? Treat yourself today!</p>
                    <Link to="/">
                        <Button size="lg">View Our Menu</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const { icon: StatusIcon, color, label, description, progress } = getStatusConfig(trackedOrder?.status || 'pending');

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-24">
            <Navbar />

            <main className="container mx-auto px-6 md:px-12 pt-36">
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Live Tracking Timeline */}
                    <div className="flex-1 w-full scale-in-center">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Track Your <span className="text-orange-500">Magic.</span></h1>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2">Order ID: #{trackedOrder?._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <StatusBadge isOpen={trackedOrder?.status !== 'completed'} className="h-10" />
                        </div>

                        {/* Premium Status Board */}
                        <div className="bg-white rounded-[48px] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8">
                                <StatusIcon size={64} className={cn("opacity-5", color.replace('bg-', 'text-'))} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className={cn("h-20 w-20 rounded-3xl flex items-center justify-center text-white shadow-2xl", color)}>
                                        <StatusIcon size={40} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{label}</h3>
                                        <p className="text-slate-400 font-medium italic text-lg">{description}</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="relative h-4 bg-slate-100 rounded-full mb-12 overflow-hidden">
                                    <div
                                        className={cn("absolute inset-y-0 left-0 transition-all duration-1000 ease-out rounded-full", color)}
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 shimmer" />
                                    </div>
                                </div>

                                {/* Steps Visual */}
                                <div className="grid grid-cols-5 gap-2">
                                    {['pending', 'preparing', 'ready', 'out_for_delivery', 'completed'].map((s, i) => {
                                        const progressMarkers = [15, 50, 70, 85, 100];
                                        const isActive = progress >= progressMarkers[i];
                                        return (
                                            <div key={s} className="flex flex-col items-center gap-3">
                                                <div className={cn(
                                                    "h-3 w-3 rounded-full transition-all duration-700",
                                                    isActive ? color : "bg-slate-200"
                                                )} />
                                                <span className={cn(
                                                    "text-[8px] font-black uppercase tracking-widest text-center",
                                                    isActive ? "text-slate-900" : "text-slate-200"
                                                )}>{s}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Recent History */}
                        <div className="mt-16">
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 px-2">Order History</h4>
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <button
                                        key={order._id}
                                        onClick={() => navigate(`/my-orders?id=${order._id}`)}
                                        className={cn(
                                            "w-full bg-white p-6 rounded-[32px] border transition-all duration-300 flex items-center justify-between hover:shadow-xl hover:translate-x-2",
                                            order._id === trackedOrder?._id ? "border-orange-500 shadow-xl shadow-orange-500/5" : "border-slate-50 shadow-sm"
                                        )}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                                                <ShoppingBag size={24} className="text-slate-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-black text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                                                    {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} Items
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={cn(
                                                "px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                                                order.status === 'completed' ? "bg-slate-100 text-slate-400" : "bg-orange-50 text-orange-500"
                                            )}>
                                                {order.status}
                                            </span>
                                            <ArrowRight size={18} className="text-slate-200" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Details Panel */}
                    <div className="w-full lg:w-[400px] sticky top-36">
                        <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -ml-32 -mb-32 group-hover:bg-emerald-500/20 transition-all duration-1000" />

                            <h2 className="text-2xl font-black mb-10 flex items-center justify-between">
                                Summary
                                <div className="h-px bg-white/10 flex-1 ml-6" />
                            </h2>

                            <div className="space-y-8 mb-12 max-h-[300px] overflow-y-auto no-scrollbar">
                                {trackedOrder?.items.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="text-xs font-black h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-orange-400">{item.quantity}x</div>
                                            <span className="text-sm font-bold text-white/90 line-clamp-1">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-black text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-white/10 w-full mb-8" />

                            <div className="space-y-4 mb-10">
                                <div className="flex items-start gap-4">
                                    <MapPin size={18} className="text-orange-500 mt-1 shrink-0" />
                                    <div className="text-xs font-medium text-white/60 leading-relaxed italic line-clamp-2">
                                        {trackedOrder?.address?.deliveryAddress || 'Loading address...'}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Phone size={18} className="text-emerald-500 shrink-0" />
                                    <span className="text-xs font-black tracking-widest text-white/90">{trackedOrder?.address?.phoneNumber || 'No phone'}</span>
                                </div>
                            </div>

                            <Link to="/support">
                                <Button
                                    variant="outline"
                                    className="w-full h-16 rounded-[24px] bg-white/5 border-white/10 text-white hover:bg-white hover:text-slate-900 shadow-none font-black"
                                >
                                    <Phone size={18} className="mr-2" /> Support Center
                                </Button>
                            </Link>

                            {['pending', 'accepted'].includes(trackedOrder?.status) && (
                                <Button
                                    onClick={() => handleCancelOrder(trackedOrder)}
                                    className="w-full h-16 mt-4 rounded-[24px] bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 font-black shadow-none transition-all"
                                >
                                    <Trash2 size={18} className="mr-2" /> Cancel Order
                                </Button>
                            )}

                            <Link to="/" className="block text-center mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">
                                Back to Flavors
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const StatusBadge = ({ isOpen, className }) => (
    <div className={cn(
        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest",
        isOpen ? "bg-orange-50 border-orange-100 text-orange-600" : "bg-slate-100 border-slate-200 text-slate-400",
        className
    )}>
        <span className={cn("flex h-2 w-2 rounded-full", isOpen ? "bg-orange-500 animate-pulse" : "bg-slate-300")} />
        {isOpen ? 'Order Active' : 'Order Finished'}
    </div>
);

export default OrderTracking;
