import React, { useEffect, useState } from 'react';
import { subscribeToOrders, updateOrderStatus, deleteOrder } from '../../lib/db';
import socket from '../../services/socket';
import { Clock, CheckCircle2, Flame, Utensils, XCircle, ArrowRight, PackageCheck, MapPin, Trash2, Ban } from 'lucide-react';
import Button from '../../components/ui/Button';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { cn } from '../../lib/utils';
import { useAlerts } from '../../context/AlertContext';

const Orders = () => {
    const { newOrders, stopSound, markAsSeen } = useAlerts();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Initial fetch via polling subscription
        const unsubscribe = subscribeToOrders((data) => {
            setOrders(data);
            setLoading(false);
        });

        // Real-time socket listener
        socket.on('new-order', (newOrder) => {
            setOrders(prev => [newOrder, ...prev]);
        });

        socket.on('admin-order-update', (updatedOrder) => {
            setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
        });

        socket.on('order-deleted', (deletedId) => {
            setOrders(prev => prev.filter(o => o._id !== deletedId));
        });

        return () => {
            unsubscribe();
            socket.off('new-order');
            socket.off('admin-order-update');
            socket.off('order-deleted');
        };
    }, []);

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        orderId: null,
        type: 'danger',
        title: '',
        message: '',
        confirmText: '',
        onConfirm: () => { },
        icon: Trash2
    });

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            // If it was a new order, mark it as seen
            if (newOrders.includes(orderId)) {
                markAsSeen(orderId);
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const confirmRejectOrder = (orderId) => {
        setConfirmModal({
            isOpen: true,
            orderId,
            type: 'danger',
            title: 'Reject Order?',
            message: 'Are you sure you want to reject this customer order? This will notify the customer immediately.',
            confirmText: 'Reject Order',
            icon: Ban,
            onConfirm: () => handleStatusUpdate(orderId, 'cancelled')
        });
    };

    const confirmDeleteOrder = (orderId) => {
        setConfirmModal({
            isOpen: true,
            orderId,
            type: 'danger',
            title: 'Delete Order History?',
            message: 'This will permanently remove the order record. This action cannot be undone.',
            confirmText: 'Delete Permanently',
            icon: Trash2,
            onConfirm: async () => {
                try {
                    await deleteOrder(orderId);
                    setOrders(prev => prev.filter(o => o._id !== orderId));
                } catch (error) {
                    console.error("Failed to delete order", error);
                }
            }
        });
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending': return { color: 'text-orange-600 bg-orange-100', icon: Clock, label: 'New' };
            case 'accepted': return { color: 'text-blue-600 bg-blue-100', icon: CheckCircle2, label: 'Accepted' };
            case 'preparing': return { color: 'text-purple-600 bg-purple-100', icon: Flame, label: 'Cooking' };
            case 'ready': return { color: 'text-yellow-600 bg-yellow-100', icon: Utensils, label: 'Ready' };
            case 'out_for_delivery': return { color: 'text-blue-600 bg-blue-100', icon: MapPin, label: 'Out for Delivery' };
            case 'completed': return { color: 'text-green-600 bg-green-100', icon: PackageCheck, label: 'Done' };
            case 'cancelled': return { color: 'text-red-600 bg-red-100', icon: XCircle, label: 'Rejected' };
            default: return { color: 'text-gray-600 bg-gray-100', icon: Clock, label: 'Unknown' };
        }
    };

    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Live Kitchen Console</h1>
                    <p className="text-gray-500 font-medium">Managing {orders.filter(o => o.status !== 'completed').length} active orders.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'accepted', 'preparing', 'ready', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm",
                                filter === f
                                    ? "bg-primary text-white scale-105"
                                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-white rounded-3xl border border-gray-100 animate-pulse" />
                    ))
                ) : filteredOrders.map(order => {
                    const config = getStatusConfig(order.status);
                    const Icon = config.icon;
                    const isNew = newOrders.includes(order._id);

                    return (
                        <div
                            key={order._id}
                            className={cn(
                                "group bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-8 transition-all duration-500",
                                isNew
                                    ? "ring-4 ring-orange-500/20 border-orange-200 shadow-[0_20px_60px_-15px_rgba(249,115,22,0.15)] animate-pulse-subtle bg-orange-50/10"
                                    : "hover:shadow-2xl hover:shadow-gray-200/50"
                            )}
                        >
                            <div className="flex items-center gap-6 w-full lg:w-auto">
                                <div className={cn(
                                    "h-20 w-20 rounded-3xl flex items-center justify-center shrink-0 shadow-lg relative",
                                    config.color,
                                    isNew && "animate-bounce"
                                )}>
                                    <Icon size={32} />
                                    {isNew && (
                                        <span className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full border-4 border-white animate-ping" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <h3 className="font-black text-gray-900 text-2xl tracking-tight uppercase">#{order._id.slice(-6)}</h3>
                                        <span className={cn(
                                            "text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-tighter",
                                            config.color,
                                            isNew && "ring-2 ring-orange-300 animate-pulse"
                                        )}>
                                            {isNew ? 'New Order' : config.label}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {order.items?.map((item, i) => (
                                            <span key={i} className="text-xs font-bold bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-100">
                                                {item.quantity}x {item.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-1 mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Customer Details</p>
                                        <div className="flex flex-col gap-1 text-sm text-gray-700 font-medium">
                                            <span className="font-bold text-gray-900">{order.address?.customerName || 'Guest'}</span>
                                            <span>{order.address?.deliveryAddress}</span>
                                            {order.address?.location && (
                                                <a
                                                    href={`https://www.openstreetmap.org/?mlat=${order.address.location.lat}&mlon=${order.address.location.lng}#map=17/${order.address.location.lat}/${order.address.location.lng}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700 underline text-xs font-bold mt-1"
                                                >
                                                    <MapPin size={12} /> View on Map
                                                </a>
                                            )}
                                            <span>{order.address?.phoneNumber}</span>
                                            {order.address?.notes && (
                                                <span className="text-xs italic text-orange-600 bg-orange-50 px-2 py-1 rounded-lg self-start mt-1">
                                                    Note: {order.address.notes}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-xs font-medium italic mt-2">Ordered {new Date(order.createdAt).toLocaleTimeString()} • ₹{order.total}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                                {order.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => confirmRejectOrder(order._id)}
                                            className="px-6 py-4 rounded-2xl text-sm font-black text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(order._id, 'accepted')}
                                            className="px-8 py-4 rounded-2xl text-sm font-black text-white bg-primary hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all flex items-center gap-2"
                                        >
                                            Accept Order <ArrowRight size={18} />
                                        </button>
                                    </>
                                )}
                                {order.status === 'accepted' && (
                                    <button
                                        onClick={() => handleStatusUpdate(order._id, 'preparing')}
                                        className="w-full lg:w-auto px-8 py-4 rounded-2xl text-sm font-black text-white bg-purple-500 hover:bg-purple-600 shadow-xl shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        Start Cooking <Flame size={18} />
                                    </button>
                                )}
                                {order.status === 'preparing' && (
                                    <button
                                        onClick={() => handleStatusUpdate(order._id, 'ready')}
                                        className="w-full lg:w-auto px-8 py-4 rounded-2xl text-sm font-black text-white bg-yellow-400 hover:bg-yellow-500 shadow-xl shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        Mark as Ready <Utensils size={18} />
                                    </button>
                                )}
                                {order.status === 'ready' && (
                                    <button
                                        onClick={() => handleStatusUpdate(order._id, 'out_for_delivery')}
                                        className="w-full lg:w-auto px-8 py-4 rounded-2xl text-sm font-black text-white bg-blue-500 hover:bg-blue-600 shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        Dispatch for Delivery <ArrowRight size={18} />
                                    </button>
                                )}
                                {order.status === 'out_for_delivery' && (
                                    <button
                                        onClick={() => handleStatusUpdate(order._id, 'completed')}
                                        className="w-full lg:w-auto px-8 py-4 rounded-2xl text-sm font-black text-white bg-green-500 hover:bg-green-600 shadow-xl shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        Mark as Delivered <CheckCircle2 size={18} />
                                    </button>
                                )}
                                {order.status === 'completed' && (
                                    <div className="flex flex-col gap-2">
                                        <span className="flex items-center gap-2 text-green-500 font-black uppercase tracking-widest text-xs px-4 py-2 bg-green-50 rounded-full">
                                            <PackageCheck size={18} /> Delivered Successfully
                                        </span>
                                        <button onClick={() => confirmDeleteOrder(order._id)} className="text-[10px] font-bold text-red-400 hover:text-red-600 underline text-center">
                                            Remove from History
                                        </button>
                                    </div>
                                )}
                                {(order.status === 'cancelled' || order.status === 'rejected') && (
                                    <div className="flex flex-col gap-2">
                                        <span className="text-red-400 font-black uppercase tracking-widest text-xs px-4 py-2 bg-red-50 rounded-full">
                                            Order Rejected
                                        </span>
                                        <button onClick={() => confirmDeleteOrder(order._id)} className="text-[10px] font-bold text-red-400 hover:text-red-600 underline text-center">
                                            Remove from History
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {!loading && filteredOrders.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[40px] border border-gray-100 flex flex-col items-center">
                        <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
                            🕵️‍♂️
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">No matching orders</h3>
                        <p className="text-gray-400 font-medium">The kitchen is currently quiet in this category.</p>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                type={confirmModal.type}
                icon={confirmModal.icon}
            />
        </div>
    );
};

export default Orders;
