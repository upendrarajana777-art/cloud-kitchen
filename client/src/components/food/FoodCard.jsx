import React from 'react';
import { Plus, Minus, ShoppingBag, Star, Zap } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';
import { useCart } from '../../context/CartContext';

const FoodCard = ({ item, kitchenOpen }) => {
    const { addItem, updateQuantity, cartItems } = useCart();
    const cartItem = cartItems.find(i => i._id === item._id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
        <div className="group bg-white rounded-[40px] p-5 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 border border-slate-50 relative flex flex-col hover:-translate-y-4">
            {/* Image Section */}
            <div className="relative h-64 w-full rounded-[32px] overflow-hidden mb-6">
                <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/50 flex items-center gap-1.5">
                        <Star size={12} className="fill-orange-500 text-orange-500" />
                        <span className="text-[10px] font-black">{item.rating || '4.8'}</span>
                    </div>
                </div>

                <div className="absolute top-4 right-4">
                    <div className="px-3 py-1.5 bg-grad-primary text-white rounded-xl shadow-lg flex items-center gap-1.5">
                        <Zap size={12} fill="currentColor" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Best Seller</span>
                    </div>
                </div>

                {/* Closed Overlay */}
                {!kitchenOpen && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
                        <span className="px-6 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full text-xs font-black uppercase tracking-widest">Tomorrow At 9AM</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="px-2 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-orange-500 transition-colors line-clamp-1">{item.name}</h3>
                    <div className="text-xl font-black text-slate-900 tracking-tighter">₹{item.price}</div>
                </div>

                <p className="text-slate-400 text-sm font-medium mb-8 italic line-clamp-2">
                    "{item.description}"
                </p>

                {/* Action Section */}
                <div className="mt-auto pt-6 border-t border-slate-50">
                    {quantity > 0 ? (
                        <div className="flex items-center justify-between bg-slate-900 rounded-[24px] p-2 animate-in zoom-in duration-300 shadow-xl shadow-slate-900/20">
                            <button
                                onClick={() => updateQuantity(item._id, quantity - 1)}
                                className="h-12 w-12 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                            >
                                <Minus size={20} />
                            </button>
                            <span className="text-base font-black text-white">{quantity}</span>
                            <button
                                onClick={() => updateQuantity(item._id, quantity + 1)}
                                className="h-12 w-12 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    ) : (
                        <Button
                            variant="primary"
                            className="w-full h-16 rounded-[24px] group/btn"
                            disabled={!kitchenOpen}
                            onClick={() => addItem(item)}
                        >
                            <span className="flex items-center gap-2">
                                {kitchenOpen ? (
                                    <>Add to Cart <ShoppingBag size={18} className="group-hover/btn:animate-bounce" /></>
                                ) : 'Kitchen Closed'}
                            </span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
