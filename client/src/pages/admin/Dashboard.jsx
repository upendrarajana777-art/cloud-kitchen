import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { subscribeToOrders, getFoodItems, getKitchenStatus, updateKitchenStatus } from '../../lib/db';
import socket from '../../services/socket';
import OrderMap from '../../components/admin/OrderMap';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100/50 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${color} shadow-lg shadow-opacity-20 text-white`}>
                <Icon size={24} />
            </div>
            {trend && <span className="text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">{trend}</span>}
        </div>
        <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
        <h3 className="text-3xl font-black text-gray-900">{value}</h3>
    </div>
);

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [kitchenOpen, setKitchenOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [liveMetrics, setLiveMetrics] = useState({ activeCustomers: 0, totalVisitorsToday: 0 });

    useEffect(() => {
        // Basic polling subscription for initial load and fallback
        const unsubscribe = subscribeToOrders((data) => {
            setOrders(data);
            setLoading(false);
        });

        getFoodItems("All Items").then(setFoodItems);
        getKitchenStatus().then(status => setKitchenOpen(status.isOpen));

        // Live Socket.io updates
        socket.on('new-order', (newOrder) => {
            setOrders(prev => [newOrder, ...prev]);
        });

        socket.on('admin-order-update', (updatedOrder) => {
            setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
        });

        socket.on('live-metrics', (metrics) => {
            setLiveMetrics(metrics);
        });

        return () => {
            unsubscribe();
            socket.off('new-order');
            socket.off('admin-order-update');
            socket.off('live-metrics');
        };
    }, []);

    const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, order) => sum + (order.total || 0), 0);
    const activeOrders = orders.filter(o => ['pending', 'accepted', 'preparing', 'ready'].includes(o.status));
    const recentOrders = orders.slice(0, 5);

    const toggleKitchen = async () => {
        try {
            const newStatus = !kitchenOpen;
            await updateKitchenStatus(newStatus);
            setKitchenOpen(newStatus);
        } catch (error) {
            console.error("Failed to update kitchen status");
        }
    };

    // Chart Data Calculation
    const getChartData = () => {
        // Initialize an array of 0s for 24 hours
        const hourlyData = new Array(24).fill(0);
        const today = new Date().setHours(0, 0, 0, 0);

        // Filter orders for today only
        const todayOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0);
            return orderDate === today && order.status !== 'cancelled';
        });

        // Sum revenue per hour
        todayOrders.forEach(order => {
            const hour = new Date(order.createdAt).getHours();
            hourlyData[hour] += order.total || 0;
        });

        // Create labels for every 3 hours for simpler display, or use all 24
        // Let's do every 2 hours to keep it clean but detailed
        const labels = Array.from({ length: 12 }, (_, i) => {
            const h = i * 2;
            return h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`;
        });

        // Map the hourly data to match the labels (summing up the 2-hour windows)
        const data = Array.from({ length: 12 }, (_, i) => {
            const h = i * 2;
            return hourlyData[h] + (hourlyData[h + 1] || 0);
        });

        return {
            labels,
            datasets: [{
                label: 'Revenue Today',
                data: data,
                borderColor: '#ff5a1f',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, 'rgba(255, 90, 31, 0.4)');
                    gradient.addColorStop(1, 'rgba(255, 90, 31, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#ff5a1f',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            }]
        };
    };

    const chartData = getChartData();

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Dashboard Overview <span className="text-2xl">🔥</span>
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Your kitchen is serving happiness today.</p>
                </div>

                <div className={`flex items-center gap-4 px-6 py-4 rounded-3xl border-2 transition-all duration-500 ${kitchenOpen ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    <div className="flex flex-col">
                        <span className={`text-xs font-black uppercase tracking-widest ${kitchenOpen ? 'text-green-500' : 'text-red-500'}`}>
                            Store Status
                        </span>
                        <span className="text-lg font-bold text-gray-900">{kitchenOpen ? 'Kitchen Open' : 'Kitchen Closed'}</span>
                    </div>
                    <button
                        onClick={toggleKitchen}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${kitchenOpen ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${kitchenOpen ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Active Customers Card with Pulsing Effect */}
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-orange-100/50 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 bg-green-500 rounded-full animate-ping" />
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Live</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-orange-500 shadow-lg shadow-orange-200 text-white">
                            <Users size={24} />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Active Customers</p>
                    <h3 className="text-3xl font-black text-gray-900 animate-in fade-in zoom-in duration-500" key={liveMetrics.activeCustomers}>
                        {liveMetrics.activeCustomers}
                    </h3>
                </div>

                <StatCard
                    title="Today's Revenue"
                    value={`₹${totalRevenue.toFixed(0)}`}
                    icon={DollarSign}
                    trend={orders.length > 0 ? "+Active" : "Stable"}
                    color="bg-emerald-500"
                />

                <StatCard
                    title="Daily Visitors"
                    value={liveMetrics.totalVisitorsToday}
                    icon={TrendingUp}
                    color="bg-blue-500"
                />

                <StatCard
                    title="Pending Orders"
                    value={activeOrders.length}
                    icon={ShoppingBag}
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Live Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-gray-900">Revenue Performance</h3>
                        <select className="bg-gray-50 border-none rounded-xl text-sm font-bold px-4 py-2 focus:ring-2 focus:ring-primary/20">
                            <option>Today</option>
                            <option>This Week</option>
                        </select>
                    </div>
                    <div className="h-[300px]">
                        <Line
                            data={chartData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: '#1e293b',
                                        padding: 12,
                                        cornerRadius: 12,
                                        titleFont: { family: 'inherit', size: 14 },
                                        bodyFont: { family: 'inherit', size: 14, weight: 'bold' },
                                        prefix: '₹'
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: { color: '#f1f5f9', borderDash: [4, 4] },
                                        ticks: { font: { family: 'inherit', size: 12, weight: '500' }, color: '#94a3b8' }
                                    },
                                    x: {
                                        grid: { display: false },
                                        ticks: { font: { family: 'inherit', size: 12, weight: '500' }, color: '#94a3b8' }
                                    }
                                },
                                interaction: {
                                    mode: 'nearest',
                                    intersect: false,
                                    axis: 'x'
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div className="lg:col-span-1 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-6">Live Activity</h3>
                    <div className="space-y-6">
                        {activeOrders.slice(0, 4).map(order => (
                            <div key={order._id} className="flex gap-4 items-start animate-in slide-in-from-right-4 duration-300">
                                <div className={`h-10 w-10 rounded-xl flex-shrink-0 flex items-center justify-center ${order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                    order.status === 'preparing' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                    {order.status === 'pending' ? <Clock size={20} /> : <ShoppingBag size={20} />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">New Order #{order._id.slice(-6).toUpperCase()}</p>
                                    <p className="text-xs text-gray-400 font-medium">Just now • {order.items.length} items</p>
                                </div>
                                <span className="text-sm font-black text-gray-900">₹{order.total}</span>
                            </div>
                        ))}
                        {activeOrders.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-2 text-gray-200">💤</div>
                                <p className="text-gray-400 font-bold text-sm">No live orders right now</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => window.location.href = '/admin/orders'}
                        className="w-full mt-8 py-4 bg-gray-50 rounded-2xl text-gray-900 font-black text-sm hover:bg-gray-100 transition-all border border-gray-100"
                    >
                        Manage All Orders
                    </button>
                </div>
            </div>

            {/* Live Order Map Section */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Live Delivery Fleet</h3>
                        <p className="text-gray-400 font-medium text-sm italic">Tracking active orders across the neighborhood</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-100">
                        <MapPin size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Real-time Sync</span>
                    </div>
                </div>
                <div className="h-[500px] w-full">
                    <OrderMap orders={orders} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
