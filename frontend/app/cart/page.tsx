'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import { useCart } from '@/lib/CartContext';
import Link from 'next/link';

export default function CartPage() {
    const { cart, removeFromCart, clearCart, cartCount } = useCart();

    const totalPrice = cart.reduce((total, item) => total + Number(item.price), 0);
    const currency = cart.length > 0 ? cart[0].currency : 'USD';

    return (
        <main className="min-h-screen">
            <Navigation />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-10">
                        <h1 className="text-4xl font-black text-slate-900 font-outfit">
                            Your <span className="gradient-text">Emerald</span> Collection
                        </h1>
                        <span className="bg-white border border-emerald-100 px-4 py-1.5 rounded-full text-sm font-bold text-emerald-600 shadow-sm">
                            {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
                        </span>
                    </div>

                    {cart.length === 0 ? (
                        <div className="glass p-16 rounded-[40px] text-center border-dashed border-2 border-emerald-100">
                            <div className="text-6xl mb-6">🏜️</div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2 font-outfit">Your library is empty</h2>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                                Looks like you haven't added any books to your collection yet. Start exploring our intelligent data.
                            </p>
                            <Link href="/category/books" className="btn-premium inline-flex py-4">
                                Browse Categories
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* List Section */}
                            <div className="lg:col-span-2 space-y-4">
                                {cart.map((item, index) => (
                                    <div
                                        key={`${item.id}-${index}`}
                                        className="glass p-6 rounded-3xl flex items-center justify-between group hover:shadow-2xl transition-all duration-300 border-white/70"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-emerald-100/50">
                                                📖
                                            </div>
                                            <div>
                                                <h3 className="font-outfit font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm font-bold text-emerald-600">
                                                    {item.currency} {item.price}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                                            title="Remove Item"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}

                                <button
                                    onClick={clearCart}
                                    className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-lg ml-auto"
                                >
                                    Burn All Records
                                </button>
                            </div>

                            {/* Summary Section */}
                            <div className="lg:col-span-1">
                                <div className="glass p-8 rounded-[32px] sticky top-24 border-white/70 shadow-emerald-900/5">
                                    <h2 className="text-xl font-bold mb-6 font-outfit text-slate-900">Collection Value</h2>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-slate-500 text-sm font-medium">
                                            <span>Subtotal</span>
                                            <span>{currency} {totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500 text-sm font-medium">
                                            <span>Processing</span>
                                            <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest bg-emerald-50 px-2 py-0.5 rounded">Free Access</span>
                                        </div>
                                        <div className="pt-4 border-t border-emerald-100/50 flex justify-between items-end">
                                            <span className="font-bold text-slate-900">Total Asset</span>
                                            <span className="text-3xl font-black gradient-text">
                                                <span className="text-sm font-bold text-slate-400 mr-1">{currency}</span>
                                                {totalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <button className="btn-premium w-full !py-4 shadow-xl shadow-emerald-500/20 mb-4 font-black">
                                        Archive Collection
                                    </button>

                                    <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                        Encryption Active
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
