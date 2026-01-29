import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingBag, Star, Loader2, Utensils, Zap, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import { getFoodItems, getKitchenStatus } from '../../lib/db';
import { useCart } from '../../context/CartContext';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import socket from '../../services/socket';

const FoodSkeleton = () => (
    <div className="bg-white p-4 rounded-[40px] border border-gray-100 h-[450px] animate-pulse">
        <div className="h-56 bg-gray-100 rounded-[32px] mb-6" />
        <div className="space-y-4 px-2">
            <div className="h-6 w-3/4 bg-gray-100 rounded-full" />
            <div className="h-4 w-full bg-gray-100 rounded-full" />
            <div className="h-12 w-full bg-gray-100 rounded-2xl" />
        </div>
    </div>
);

const Menu = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [kitchenOpen, setKitchenOpen] = useState(true);

    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const [food, status] = await Promise.all([
                    getFoodItems(""), // Fetch all items
                    getKitchenStatus()
                ]);
                setItems(food);
                setKitchenOpen(status.isOpen);
            } catch (error) {
                console.error("Failed to load menu", error);
            } finally {
                setLoading(false);
            }
        };
        init();

        socket.on('kitchen-status-changed', (isOpen) => {
            setKitchenOpen(isOpen);
        });

        return () => socket.off('kitchen-status-changed');
    }, []);

    const handleAddToCart = (item) => {
        if (!kitchenOpen) return;
        addToCart(item);
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#fffcf9] pb-24">
            {/* Header Section */}
            <div className="bg-white pt-32 pb-16 shadow-sm border-b border-gray-100 rounded-b-[60px]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center px-4 py-2 bg-orange-50 rounded-2xl border border-orange-100">
                                <span className="text-xs font-black text-primary uppercase tracking-widest">Our Selection</span>
                            </div>
                            <h1 className="text-6xl font-black text-gray-900 tracking-tight">The Menu.</h1>
                            <p className="text-gray-500 font-medium italic max-w-md">Every dish is a story of tradition, premium ingredients, and a lot of love.</p>
                        </div>

                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={24} />
                            <input
                                type="text"
                                placeholder="Search our flavors..."
                                className="w-full h-16 pl-14 pr-6 bg-gray-50 rounded-[24px] border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-gray-900 shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Warning if closed */}
            {!kitchenOpen && (
                <div className="container mx-auto px-6 max-w-7xl mt-8">
                    <div className="bg-red-50 border-2 border-red-100 p-6 rounded-[32px] flex items-center gap-6 animate-in slide-in-from-top-4">
                        <div className="h-14 w-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-500 shrink-0">
                            <Clock size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-red-900">Kitchen is Closed</h3>
                            <p className="text-red-700/80 font-medium italic text-sm">We're currently resting and preparing fresh ingredients. Please check back later!</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Menu Grid */}
            <div className="container mx-auto px-6 max-w-7xl mt-16">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <FoodSkeleton key={i} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                        {filteredItems.map(item => (
                            <div key={item._id} className="group bg-white p-5 rounded-[48px] shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-4 transition-all duration-700 border border-gray-100 flex flex-col relative overflow-hidden">
                                <div className="h-64 rounded-[40px] bg-gray-50 mb-6 overflow-hidden relative shrink-0">
                                    <img src={item.imageUrl || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={item.name} />

                                    <button
                                        disabled={!kitchenOpen || !item.available}
                                        className={cn(
                                            "absolute bottom-4 right-4 h-14 w-14 rounded-2xl flex items-center justify-center shadow-2xl active:scale-95 transition-all outline-none",
                                            !kitchenOpen || !item.available ? "bg-gray-100 text-gray-300" : "bg-primary text-white hover:bg-primary-dark"
                                        )}
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        <ShoppingBag size={24} />
                                    </button>

                                    {(!item.available) && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                            <span className="text-white font-black uppercase tracking-widest">Out of Stock</span>
                                        </div>
                                    )}
                                </div>

                                <div className="px-2 flex flex-col flex-1 pb-4">
                                    <div className="flex justify-between items-start gap-4 mb-4">
                                        <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">{item.name}</h3>
                                        <span className="text-2xl font-black text-gray-900 tracking-tighter">${item.price}</span>
                                    </div>
                                    <p className="text-[13px] text-gray-400 font-medium mb-8 leading-relaxed italic line-clamp-3">"{item.description}"</p>

                                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Star size={16} fill="#FFB800" className="text-[#FFB800]" />
                                            <span className="text-sm font-black text-gray-900">4.8</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                                            <Zap size={14} fill="currentColor" /> Premium
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredItems.length === 0 && (
                    <div className="col-span-full flex flex-col items-center py-40 bg-white rounded-[60px] border border-gray-100 shadow-sm">
                        <div className="h-32 w-32 bg-gray-50 rounded-full flex items-center justify-center text-5xl mb-8 shadow-inner grayscale">🍱</div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Taste not found!</h2>
                        <p className="text-gray-500 font-medium">Try searching for something else or explore our other flavors.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
