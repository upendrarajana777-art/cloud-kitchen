import React, { createContext, useContext, useEffect, useState, useReducer } from 'react';
import Toast from '../components/ui/Toast';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItemIndex = state.items.findIndex(item => item._id === action.payload._id);
            if (existingItemIndex > -1) {
                const newItems = [...state.items];
                newItems[existingItemIndex].quantity += 1;
                return { ...state, items: newItems };
            }
            return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
        }
        case 'REMOVE_ITEM':
            return { ...state, items: state.items.filter(item => item._id !== action.payload) };
        case 'UPDATE_QUANTITY': {
            const { id, quantity } = action.payload;
            if (quantity < 1) return { ...state, items: state.items.filter(item => item._id !== id) };
            return {
                ...state,
                items: state.items.map(item => item._id === id ? { ...item, quantity } : item)
            };
        }
        case 'CLEAR_CART':
            return { ...state, items: [] };
        default:
            return state;
    }
};

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] }, (initial) => {
        const persisted = localStorage.getItem('cart');
        try {
            const data = persisted ? JSON.parse(persisted) : initial;
            return (data && Array.isArray(data.items)) ? data : { items: [] };
        } catch (e) {
            return initial;
        }
    });

    const [toast, setToast] = useState(null);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state));
    }, [state]);

    const addItem = (item) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
        setToast({ message: `${item.name} added to basket!`, type: 'success' });
    };

    const removeItem = (id) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
    };

    const updateQuantity = (id, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    };

    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    const cartTotal = state.items.reduce((total, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price;
        return total + (price * item.quantity);
    }, 0);

    const cartCount = state.items.reduce((count, item) => count + item.quantity, 0);

    const value = {
        cartItems: state.items,
        cartTotal,
        cartCount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </CartContext.Provider>
    );
}
