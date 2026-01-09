'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import Navigation from '@/components/Navigation';
import { fetchFromApi, fetcher, useUser } from '@/lib/api';
import { useCart } from '@/lib/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/Skeleton';
import { motion } from 'framer-motion';

export default function ProductPage() {
    const params = useParams();
    const id = params.id;
    const userId = useUser();
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);

    const { data: product, isLoading, error, mutate } = useSWR(id ? `/products/${id}` : null, fetcher);
    const { data: recData } = useSWR(product?.category ? `/categories/${product.category.slug}?limit=4` : null, fetcher);
    const { data: historyData } = useSWR(userId ? `/history?userId=${userId}&limit=5` : null, fetcher);

    useEffect(() => {
        if (userId && id && product) {
            fetchFromApi('/history', {
                method: 'POST',
                body: JSON.stringify({ userId, productId: Number(id) })
            }).catch(err => console.error('Failed to record history', err));
        }
    }, [userId, id, product]);

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                currency: product.currency || 'USD'
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 3000);
        }
    };

    const handleSync = async () => {
        if (!id) return;
        setSyncLoading(true);
        try {
            await fetchFromApi(`/scraper/product/${id}/details`, { method: 'POST' });
            await mutate(); // Refresh the product data
        } catch (err) {
            console.error('Failed to sync product details', err);
        } finally {
            setSyncLoading(false);
        }
    };

    if (isLoading) return (
        <main className="min-h-screen">
            <Navigation />
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <Skeleton className="h-[500px] w-full" />
                    <div className="space-y-6">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </div>
            </div>
        </main>
    );

    if (!product || error) return (
        <main>
            <Navigation />
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Title not found in archive</h1>
            </div>
        </main>
    );

    const recommendations = recData?.products?.filter((p: any) => p.id !== Number(id)) || [];
    const averageRating = product.reviews?.length
        ? (product.reviews.reduce((acc: number, r: any) => acc + Number(r.rating), 0) / product.reviews.length).toFixed(1)
        : null;

    return (
        <main className="min-h-screen pb-20">
            <Navigation />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="container mx-auto px-4 py-12"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
                        {/* Image Column */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="glass p-8 rounded-[40px] border-white/60 shadow-inner bg-white/40"
                        >
                            <div className="relative h-[500px] w-full bg-white rounded-3xl overflow-hidden shadow-sm">
                                {product.imageUrl ? (
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.title}
                                        fill
                                        className="object-contain p-8 hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-300 font-medium italic uppercase text-[10px] tracking-widest">No visual preview available</div>
                                )}
                            </div>
                        </motion.div>

                        {/* Details Column */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex flex-col justify-center pt-8"
                        >
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="inline-block px-4 py-1 text-[9px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-100 rounded-full">
                                        Archive Entry #{product.id}
                                    </div>
                                    {averageRating && (
                                        <div className="flex items-center gap-1 bg-white border border-emerald-100 rounded-full px-3 py-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                                            <span>⭐ {averageRating}</span>
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 font-outfit leading-[1.1] mb-4 uppercase tracking-tighter">
                                    {product.title}
                                </h1>
                                {product.author && (
                                    <p className="text-xl text-emerald-600 font-black uppercase tracking-tight italic">by {product.author}</p>
                                )}
                            </div>

                            <div className="glass p-8 rounded-3xl border-white/50 mb-8 bg-white/30 backdrop-blur-sm">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Market Estimate</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black gradient-text">
                                        <span className="text-xl font-bold text-slate-400 mr-1 uppercase">{product.currency || 'USD'}</span>
                                        {product.price}
                                    </span>
                                    <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full ml-4 border border-emerald-100">In Stock</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleAddToCart}
                                    className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 ${added
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-900 text-white hover:bg-emerald-600'
                                        }`}
                                >
                                    {added ? 'Added to Collection ✓' : 'Add to Collection ⚡'}
                                </button>

                                <button
                                    onClick={handleSync}
                                    disabled={syncLoading}
                                    className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {syncLoading ? (
                                        <>
                                            <span className="animate-spin text-lg">⚙️</span>
                                            Deep Scanning Archive...
                                        </>
                                    ) : (
                                        <>
                                            <span>🔄</span>
                                            Force Re-Sync Metadata
                                        </>
                                    )}
                                </button>
                            </div>

                            {product.detail?.description && (
                                <div className="mt-12 pt-8 border-t border-slate-200">
                                    <h2 className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest text-emerald-600/60">Comprehensive Archive Summary</h2>
                                    <div className="text-slate-600 leading-relaxed text-sm whitespace-pre-line bg-emerald-50/20 p-6 rounded-3xl border border-emerald-50/50">
                                        {product.detail.description}
                                    </div>
                                </div>
                            )}

                            {product.detail?.specs && Object.keys(product.detail.specs).length > 0 && (
                                <div className="mt-8 pt-8 border-t border-slate-200">
                                    <h2 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest text-emerald-600/60">Product DNA / Specifications</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(product.detail.specs).map(([key, value]: [string, any]) => {
                                            if (key === 'Recommendations') return null;
                                            return (
                                                <div key={key} className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm">
                                                    <div className="text-[8px] font-black uppercase tracking-widest text-emerald-600/40 mb-1">{key}</div>
                                                    <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate">{String(value)}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {!product.detail?.description && product.description && (
                                <div className="mt-12 pt-8 border-t border-slate-200">
                                    <h2 className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest">Metadata Description</h2>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {product.description}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Footer Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-black text-slate-900 font-outfit uppercase tracking-tighter mb-8 border-b border-emerald-100 pb-4 inline-block">Scanner Reviews</h2>
                            {product.reviews && product.reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {product.reviews.map((review: any) => (
                                        <div key={review.id} className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="font-black text-slate-900 text-sm uppercase tracking-tight">{review.author}</div>
                                                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</div>
                                                </div>
                                                <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    Score {review.rating}
                                                </div>
                                            </div>
                                            <p className="text-slate-600 italic text-sm leading-relaxed">"{review.text}"</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white/50 border-2 border-dashed border-emerald-100 rounded-3xl p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                    No reviews synced yet
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-slate-900 font-outfit uppercase tracking-tighter mb-8 border-b border-emerald-100 pb-4 inline-block">Matching Archive</h2>
                            <div className="space-y-4 mb-12">
                                {recommendations.length > 0 ? recommendations.slice(0, 3).map((rec: any) => (
                                    <Link key={rec.id} href={`/product/${rec.id}`} className="group block bg-white p-4 rounded-2xl border border-emerald-50 hover:border-emerald-200 transition-all hover:translate-x-1">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-16 bg-emerald-50 rounded-lg flex items-center justify-center text-xl overflow-hidden relative border border-emerald-50 shadow-sm">
                                                {rec.imageUrl ? <Image src={rec.imageUrl} alt={rec.title} fill className="object-cover" /> : '📖'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-black text-slate-800 truncate group-hover:text-emerald-600 transition-colors uppercase tracking-tighter text-xs">{rec.title}</div>
                                                <div className="text-emerald-600 font-black text-[10px] uppercase tracking-widest">{rec.price} {rec.currency}</div>
                                            </div>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">Syncing more records...</div>
                                )}
                            </div>

                            {/* Recently Viewed */}
                            {historyData && historyData.length > 1 && (
                                <>
                                    <h2 className="text-2xl font-black text-slate-900 font-outfit uppercase tracking-tighter mb-8 border-b border-emerald-100 pb-4 inline-block">Recently Viewed</h2>
                                    <div className="space-y-4">
                                        {historyData.filter((h: any) => h.product.id !== Number(id)).slice(0, 3).map((h: any) => (
                                            <Link key={h.id} href={`/product/${h.product.id}`} className="group block opacity-60 hover:opacity-100 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-14 bg-white rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden relative shadow-sm">
                                                        {h.product.imageUrl ? <Image src={h.product.imageUrl} alt={h.product.title} fill className="object-cover" /> : '📖'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold text-slate-600 truncate group-hover:text-emerald-600 transition-colors uppercase tracking-widest text-[10px]">{h.product.title}</div>
                                                        <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Seen {new Date(h.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
