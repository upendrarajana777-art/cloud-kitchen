import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Utensils, Star, Flame, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import FoodCard from '../../components/food/FoodCard';
import CartBar from '../../components/cart/CartBar';
import Button from '../../components/ui/Button';
import { getFoodItems, getKitchenStatus } from '../../lib/db';
import socket from '../../services/socket';
import { cn } from '../../lib/utils';
import DeliveryAreas from '../../components/sections/DeliveryAreas';

const FoodSkeleton = () => (
    <div className="bg-white p-6 rounded-[48px] border border-slate-50 h-[480px] animate-pulse">
        <div className="h-64 bg-slate-100 rounded-[32px] mb-6 shimmer" />
        <div className="space-y-4 px-2">
            <div className="h-8 w-3/4 bg-slate-100 rounded-full shimmer" />
            <div className="h-4 w-full bg-slate-100 rounded-full shimmer" />
            <div className="h-16 w-full bg-slate-100 rounded-[24px] shimmer mt-8" />
        </div>
    </div>
);

const Landing = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [kitchenOpen, setKitchenOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [priceFilter, setPriceFilter] = useState("all"); // all, low, high

    useEffect(() => {
        const init = async () => {
            try {
                const [items, status] = await Promise.all([
                    getFoodItems("All Items"),
                    getKitchenStatus()
                ]);
                setFoodItems(items);
                setKitchenOpen(status.isOpen);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        init();

        socket.on('kitchen-status-changed', (status) => setKitchenOpen(status));

        socket.on('food-added', (newItem) => {
            setFoodItems(prev => [newItem, ...prev]);
        });

        socket.on('food-updated', (updatedItem) => {
            setFoodItems(prev => prev.map(item => item._id === updatedItem._id ? updatedItem : item));
        });

        socket.on('food-deleted', (deletedId) => {
            setFoodItems(prev => prev.filter(item => item._id !== deletedId));
        });

        return () => {
            socket.off('kitchen-status-changed');
            socket.off('food-added');
            socket.off('food-updated');
            socket.off('food-deleted');
        };
    }, []);

    const filteredFood = foodItems
        .filter(item => item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (priceFilter === 'low') return a.price - b.price;
            if (priceFilter === 'high') return b.price - a.price;
            return 0;
        });

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <header className="relative pt-44 pb-24 overflow-hidden">
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-6 py-2 bg-orange-50 rounded-full border border-orange-100 mb-8 animate-in slide-in-from-bottom-5 duration-700">
                                <Sparkles size={16} className="text-orange-500 fill-orange-500" />
                                <span className="text-xs font-black text-orange-600 uppercase tracking-widest leading-none">Freshly Cooked Daily</span>
                            </div>

                            <h1 className="text-hero text-slate-900 mb-8 animate-in slide-in-from-bottom-5 duration-700 delay-100">
                                Crafting Flavors That <br />
                                <span className="text-grad-primary">Inspire Your Soul.</span>
                            </h1>

                            <p className="text-slate-500 text-lg md:text-xl font-medium italic mb-12 max-w-2xl animate-in slide-in-from-bottom-5 duration-700 delay-200">
                                Experience premium home-cooked meals tailored with love and the finest ingredients, delivered with speed to your doorstep.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-6 animate-in slide-in-from-bottom-5 duration-700 delay-300">
                                <Button
                                    size="lg"
                                    onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
                                >
                                    Order Now <ArrowDown size={20} className="ml-2 animate-bounce" />
                                </Button>
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-12 w-12 rounded-full border-4 border-white overflow-hidden bg-slate-100">
                                            <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                                        </div>
                                    ))}
                                    <div className="h-12 w-12 rounded-full border-4 border-white bg-slate-900 flex items-center justify-center text-white text-[10px] font-black">
                                        5K+
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Happy Customers</p>
                            </div>
                        </div>

                        <div className="flex-1 relative animate-in zoom-in duration-1000 delay-200">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-orange-100/30 rounded-full blur-[120px]" />
                            <div className="relative z-10 animate-float">
                                <img
                                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
                                    alt="Hero Food"
                                    className="rounded-[60px] shadow-2xl shadow-orange-500/20 border-8 border-white transform rotate-3"
                                />
                                <div className="absolute -bottom-10 -left-10 glass p-6 rounded-[32px] premium-shadow animate-in slide-in-from-left-10 duration-1000">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-grad-primary flex items-center justify-center text-white">
                                            <Flame size={28} />
                                        </div>
                                        <div>
                                            <p className="text-xl font-black text-slate-900">4.9/5</p>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Average Rating</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Menu Section */}
            <main id="menu" className="container mx-auto px-6 md:px-12 py-24 pb-48">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-20">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
                            Explore <span className="text-orange-500">The Menu.</span>
                        </h2>
                        <p className="text-slate-400 font-medium italic">Handpicked dishes for every mood and craving.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                        <div className="relative w-full sm:w-80 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search cravings..."
                                className="w-full h-16 pl-16 pr-6 bg-white rounded-[24px] border-2 border-slate-50 focus:border-orange-500/20 focus:bg-white transition-all outline-none font-bold text-slate-900 shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-slate-100 p-2 rounded-[24px] w-full sm:w-auto">
                            {['all', 'low', 'high'].map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setPriceFilter(filter)}
                                    className={cn(
                                        "flex-1 sm:px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all",
                                        priceFilter === filter ? "bg-white text-slate-900 shadow-xl" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {filter === 'all' ? 'All' : filter === 'low' ? 'Cheapest' : 'Premium'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <FoodSkeleton key={i} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                        {filteredFood.map(item => (
                            <FoodCard key={item._id} item={item} kitchenOpen={kitchenOpen} />
                        ))}
                    </div>
                )}

                {!loading && filteredFood.length === 0 && (
                    <div className="py-40 flex flex-col items-center justify-center text-center">
                        <div className="h-40 w-40 bg-slate-50 rounded-full flex items-center justify-center text-6xl mb-8 grayscale opacity-50 shadow-inner">🍜</div>
                        <h3 className="text-3xl font-black text-slate-700">Taste not found!</h3>
                        <p className="text-slate-400 font-medium italic mt-2">Try searching for something else or reset filters.</p>
                        <Button variant="outline" className="mt-10" onClick={() => { setSearchQuery(""); setPriceFilter("all") }}>
                            View All Dishes
                        </Button>
                    </div>
                )}
            </main>

            <DeliveryAreas />

            <CartBar />

            {/* Premium Footer */}
            <footer className="bg-slate-900 text-white py-24 rounded-t-[100px]">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex flex-col lg:flex-row justify-between gap-16 mb-24">
                        <div className="max-w-sm">
                            <Link to="/" className="flex items-center gap-3 mb-8">
                                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                                    <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter">CLOUD<span className="text-orange-500">KITCHEN.</span></span>
                            </Link>
                            <p className="text-slate-400 font-medium italic leading-relaxed">
                                Redefining home delivery with premium ingredients and curated flavors that tell a story in every bite.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-white/30">Explore</h4>
                                <ul className="space-y-4">
                                    <li><Link to="/" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">The Menu</Link></li>
                                    <li><Link to="/orders" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Live Tracking</Link></li>
                                    <li><Link to="/cart" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Your Basket</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-white/30">Support</h4>
                                <ul className="space-y-4">
                                    <li><Link to="/support" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Help Center</Link></li>
                                    <li><Link to="/support" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
                                    <li><Link to="/support" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Terms of Service</Link></li>
                                </ul>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-white/30">Reach Us</h4>
                                <p className="text-sm font-bold text-slate-300 mb-2">support@cloudkitchen.com</p>
                                <p className="text-sm font-bold text-slate-300">9347764310</p>
                                <p className="text-sm font-bold text-slate-300">9642691521</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">© 2026 CloudKitchen Collective • Premium Delivery Services</p>
                        <div className="flex gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-10 w-10 border border-white/10 rounded-xl hover:bg-white/5 cursor-pointer transition-colors" />
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    );
};

export default Landing;
