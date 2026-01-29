import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartBar = () => {
    const { cartItems, cartTotal } = useCart();
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (count === 0) return null;

    return (
        <div className="fixed bottom-8 left-0 right-0 z-40 px-6 pointer-events-none">
            <Link
                to="/cart"
                className="pointer-events-auto block max-w-lg mx-auto bg-slate-900 rounded-[32px] p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-white/50 uppercase tracking-[0.2em]">Your Basket</p>
                            <p className="text-sm font-black text-white">{count} Items • ${cartTotal.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-grad-primary px-6 py-3 rounded-2xl shadow-lg">
                        <span className="text-xs font-black text-white uppercase tracking-widest leading-none">View Cart</span>
                        <ArrowRight size={16} className="text-white" />
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default CartBar;
