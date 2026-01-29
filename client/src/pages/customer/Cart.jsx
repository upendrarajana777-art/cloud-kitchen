import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, Plus, Minus, Trash2, MapPin, Phone, User, CreditCard, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Navbar from '../../components/layout/Navbar';
import LocationPicker from '../../components/common/LocationPicker';
import { createOrder } from '../../lib/db';
import { cn } from '../../lib/utils';

const Cart = () => {
    const { cartItems, cartTotal, updateQuantity, removeItem, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Cart, 2: Checkout

    // Guest Checkout State
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        address: '',
        notes: ''
    });

    const handleCheckout = async (e) => {
        e.preventDefault();

        // Validate Location
        if (!customerInfo.location || !customerInfo.location.lat || !customerInfo.location.lng) {
            alert("Please select your delivery location on the map.");
            const locationSection = document.getElementById('location-picker-section');
            if (locationSection) locationSection.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        setLoading(true);
        try {
            const orderId = await createOrder(
                'GUEST',
                cartItems,
                cartTotal, // Total only, no extra fees
                {
                    customerName: customerInfo.name,
                    phoneNumber: customerInfo.phone,
                    deliveryAddress: customerInfo.address,
                    notes: customerInfo.notes,
                    location: customerInfo.location
                }
            );
            clearCart();
            navigate(`/orders?id=${orderId}`);
        } catch (error) {
            console.error("Order failed", error);
            alert("Order failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAFAFA]">
                <Navbar />
                <div className="container mx-auto px-6 py-40 flex flex-col items-center justify-center text-center">
                    <div className="h-40 w-40 bg-white rounded-full flex items-center justify-center text-6xl mb-8 shadow-2xl animate-bounce">🛒</div>
                    <h2 className="text-4xl font-black text-slate-900 mb-4">Your basket is empty.</h2>
                    <p className="text-slate-400 font-medium italic mb-12">Looks like you haven't added any magic to your cart yet.</p>
                    <Link to="/">
                        <Button size="lg">Start Ordering</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-24">
            <Navbar />

            <main className="container mx-auto px-6 md:px-12 pt-36">
                <div className="flex flex-col xl:flex-row gap-16 items-start">

                    {/* Left Side: Cart Items or Form */}
                    <div className="flex-1 w-full space-y-12">
                        {step === 1 ? (
                            <section className="animate-in slide-in-from-left-10 duration-700">
                                <div className="flex items-center justify-between mb-12">
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your <span className="text-orange-500">Choice.</span></h1>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">{cartItems.length} Dishes Selected</p>
                                </div>

                                <div className="space-y-6">
                                    {cartItems.map(item => (
                                        <div key={item._id} className="group bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col sm:flex-row items-center gap-8">
                                            <div className="h-28 w-28 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                                                <img src={item.imageUrl} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                                            </div>
                                            <div className="flex-1 text-center sm:text-left">
                                                <h3 className="text-xl font-black text-slate-900 mb-1">{item.name}</h3>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Premium Quality</p>
                                            </div>
                                            <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl gap-4">
                                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all"><Minus size={16} /></button>
                                                <span className="text-sm font-black text-slate-900 w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all"><Plus size={16} /></button>
                                            </div>
                                            <div className="text-2xl font-black text-slate-900 tracking-tighter sm:w-24 text-right">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </div>
                                            <button onClick={() => removeItem(item._id)} className="h-12 w-12 flex items-center justify-center text-white bg-red-500 hover:bg-red-600 rounded-2xl transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105"><Trash2 size={20} /></button>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => navigate('/')} className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-colors">
                                    <ArrowLeft size={16} /> Continue Exploring
                                </button>
                            </section>
                        ) : (
                            <section className="animate-in slide-in-from-left-10 duration-700">
                                <div className="flex items-center gap-4 mb-12">
                                    <button onClick={() => setStep(1)} className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors">
                                        <ArrowLeft size={24} />
                                    </button>
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Delivery <span className="text-orange-500">Details.</span></h1>
                                </div>

                                <form id="checkout-form" onSubmit={handleCheckout} className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/30 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Your Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="John Doe"
                                                    className="w-full h-16 pl-14 pr-6 bg-slate-50 rounded-[24px] border-2 border-transparent focus:border-orange-500/20 focus:bg-white transition-all outline-none font-bold text-slate-900"
                                                    value={customerInfo.name}
                                                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Number</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                                                <input
                                                    required
                                                    type="tel"
                                                    placeholder="+91 98765 43210"
                                                    className="w-full h-16 pl-14 pr-6 bg-slate-50 rounded-[24px] border-2 border-transparent focus:border-orange-500/20 focus:bg-white transition-all outline-none font-bold text-slate-900"
                                                    value={customerInfo.phone}
                                                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Delivery Address</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-5 top-8 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                                            <textarea
                                                required
                                                placeholder="Where should we send your hot meal?"
                                                className="w-full h-40 pl-14 pr-6 pt-6 bg-slate-50 rounded-[32px] border-2 border-transparent focus:border-orange-500/20 focus:bg-white transition-all outline-none font-bold text-slate-900 resize-none"
                                                value={customerInfo.address}
                                                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div id="location-picker-section">
                                        <LocationPicker
                                            onLocationSelect={(loc) => setCustomerInfo(prev => ({ ...prev, location: loc }))}
                                            initialLocation={customerInfo.location}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Special Notes (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="Extra spicy, no onions, leave at door..."
                                            className="w-full h-16 px-8 bg-slate-50 rounded-[24px] border-2 border-transparent focus:border-orange-500/20 focus:bg-white transition-all outline-none font-bold text-slate-900"
                                            value={customerInfo.notes}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                                        />
                                    </div>
                                </form>
                            </section>
                        )}
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="w-full xl:w-[450px] sticky top-36">
                        <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-orange-500/20 transition-all duration-1000" />

                            <h2 className="text-2xl font-black mb-10 flex items-center justify-between">
                                Complete Order
                                <div className="h-px bg-white/10 flex-1 ml-6" />
                            </h2>

                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between items-center text-sm font-bold text-white/50 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-white">₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-white/50 uppercase tracking-widest">
                                    <span>Delivery Fee</span>
                                    <span className="text-emerald-400">Free</span>
                                </div>
                                <div className="h-px bg-white/10 w-full" />
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-1">Total Amount</p>
                                        <p className="text-5xl font-black tracking-tighter">₹{cartTotal.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                                        <CreditCard size={18} className="text-orange-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Pay on Delivery</span>
                                    </div>
                                </div>
                            </div>

                            {step === 1 ? (
                                <Button
                                    onClick={() => setStep(2)}
                                    className="w-full h-20 rounded-[30px] text-lg font-black shadow-none bg-white text-slate-900 hover:bg-orange-50 hover:text-orange-600 transition-all group/btn"
                                >
                                    Proceed to Delivery <ArrowRight size={20} className="ml-2 group-hover/btn:translate-x-2 transition-transform" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    form="checkout-form"
                                    className="w-full h-20 rounded-[30px] text-lg font-black shadow-none bg-grad-primary border-0"
                                    isLoading={loading}
                                >
                                    Place Secure Order <CheckCircle2 size={24} className="ml-2" />
                                </Button>
                            )}

                            <div className="mt-10 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20">
                                <CheckCircle2 size={14} /> 100% Secure Transaction
                            </div>
                        </div>

                        {/* Order Timeline Visual (Micro-interaction) */}
                        <div className="mt-8 bg-white border border-slate-100 rounded-[32px] p-8 hidden xl:block">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">How it works</h4>
                            <div className="space-y-6">
                                {[
                                    { icon: ShoppingBag, label: 'Order Confirmed', color: 'bg-orange-100 text-orange-600' },
                                    { icon: User, label: 'Chef Assigns Order', color: 'bg-emerald-100 text-emerald-600' },
                                    { icon: MapPin, label: 'Swift Delivery', color: 'bg-blue-100 text-blue-600' }
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", step.color)}>
                                            <step.icon size={18} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">{step.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Cart;
