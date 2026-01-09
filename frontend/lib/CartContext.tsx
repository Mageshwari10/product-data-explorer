'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    id: number;
    title: string;
    price: string | number;
    currency: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to load cart', e);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart((prevCart) => [...prevCart, item]);
    };

    const removeFromCart = (id: number) => {
        setCart((prevCart) => {
            const index = prevCart.findIndex(item => item.id === id);
            if (index !== -1) {
                const newCart = [...prevCart];
                newCart.splice(index, 1);
                return newCart;
            }
            return prevCart;
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.length;

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
