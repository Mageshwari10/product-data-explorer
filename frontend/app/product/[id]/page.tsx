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
import { motion, AnimatePresence } from 'framer-motion';

// Review form component
const ReviewForm = ({ productId, onReviewAdded }: { productId: number; onReviewAdded: () => void }) => {
    const [formData, setFormData] = useState({ rating: 5, author: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await fetchFromApi('/reviews', {
                method: 'POST',
                body: JSON.stringify({ ...formData, productId })
            });
            setFormData({ rating: 5, author: '', text: '' });
            setShowForm(false);
            onReviewAdded();
        } catch (error) {
            console.error('Failed to submit review', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-8">
            <button
                onClick={() => setShowForm(!showForm)}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
                {showForm ? 'Cancel Review' : 'Write a Review'}
            </button>
            
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="mt-6 p-6 bg-white rounded-2xl border border-emerald-100 space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className={`text-2xl transition-colors ${star <= formData.rating ? 'text-yellow-400' : 'text-slate-300'}`}
                                    >
                                        ⭐
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                            <input
                                type="text"
                                id="author"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="text" className="block text-sm font-medium text-slate-700 mb-2">Review</label>
                            <textarea
                                id="text"
                                rows={4}
                                value={formData.text}
                                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function ProductPage() {
    const params = useParams();
    const id = params.id;
    const userId = useUser();
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);
    const [reviewKey, setReviewKey] = useState(0); // For refreshing reviews

    const { data: product, isLoading, error, mutate } = useSWR(id ? `/products/${id}` : null, fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true
    });
    const { data: recData } = useSWR(product?.category ? `/categories/${product.category.slug}?limit=6` : null, fetcher);
    const { data: historyData } = useSWR(userId ? `/history?userId=${userId}&limit=5` : null, fetcher);
    const { data: reviewsData, mutate: mutateReviews } = useSWR(id ? `/reviews?productId=${id}` : null, fetcher);

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
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <Navigation />
            <div className="container mx-auto px-4 py-12 max-w-6xl" role="status" aria-label="Loading product details">
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
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <Navigation />
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Product not found</h1>
                <p className="text-slate-600 mt-4">The product you're looking for doesn't exist in our archive.</p>
                <Link href="/" className="inline-block mt-8 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all">
                    Return Home
                </Link>
            </div>
        </main>
    );

    const recommendations = recData?.products?.filter((p: any) => p.id !== Number(id)) || [];
    const reviews = reviewsData?.reviews || [];
    const averageRating = reviews.length
        ? (reviews.reduce((acc: number, r: any) => acc + Number(r.rating), 0) / reviews.length).toFixed(1)
        : null;

    const ratingCounts = reviews.reduce((acc: any, review: any) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
    }, {});

    return (
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <Navigation />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="container mx-auto px-4 py-12"
            >
                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="mb-8" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 text-sm">
                            <li><Link href="/" className="text-slate-500 hover:text-emerald-600">Home</Link></li>
                            <li className="text-slate-400">/</li>
                            <li><Link href={`/category/${product.category?.slug}`} className="text-slate-500 hover:text-emerald-600">{product.category?.title}</Link></li>
                            <li className="text-slate-400">/</li>
                            <li className="text-slate-900 font-medium">{product.title}</li>
                        </ol>
                    </nav>
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
                                            <span className="text-slate-400">({reviews.length})</span>
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
                                    aria-label={added ? 'Added to collection' : 'Add to collection'}
                                >
                                    {added ? 'Added to Collection ✓' : 'Add to Collection ⚡'}
                                </button>

                                <button
                                    onClick={handleSync}
                                    disabled={syncLoading}
                                    className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    aria-label="Force re-sync metadata"
                                >
                                    {syncLoading ? (
                                        <>
                                            <span className="animate-spin text-lg" aria-hidden="true">⚙️</span>
                                            Deep Scanning Archive...
                                        </>
                                    ) : (
                                        <>
                                            <span aria-hidden="true">🔄</span>
                                            Force Re-Sync Metadata
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Enhanced Metadata */}
                            <div className="mt-12 pt-8 border-t border-slate-200">
                                <h2 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest text-emerald-600/60">Product Metadata</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm">
                                        <div className="text-[8px] font-black uppercase tracking-widest text-emerald-600/40 mb-1">Category</div>
                                        <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{product.category?.title || 'N/A'}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm">
                                        <div className="text-[8px] font-black uppercase tracking-widest text-emerald-600/40 mb-1">Currency</div>
                                        <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{product.currency || 'USD'}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm">
                                        <div className="text-[8px] font-black uppercase tracking-widest text-emerald-600/40 mb-1">Reviews</div>
                                        <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{reviews.length}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm">
                                        <div className="text-[8px] font-black uppercase tracking-widest text-emerald-600/40 mb-1">Rating</div>
                                        <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{averageRating || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            {product.detail?.description && (
                                <div className="mt-12 pt-8 border-t border-slate-200">
                                    <h2 className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest text-emerald-600/60">Description</h2>
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

                    {/* Reviews Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-slate-900 font-outfit uppercase tracking-tighter border-b border-emerald-100 pb-4 inline-block">
                                    Customer Reviews
                                </h2>
                                {averageRating && (
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-emerald-600">{averageRating}</div>
                                        <div className="text-sm text-slate-600">Based on {reviews.length} reviews</div>
                                    </div>
                                )}
                            </div>

                            {/* Rating Distribution */}
                            {reviews.length > 0 && (
                                <div className="mb-8 p-6 bg-white rounded-2xl border border-emerald-50">
                                    <h3 className="text-sm font-bold text-slate-900 mb-4">Rating Distribution</h3>
                                    {[5, 4, 3, 2, 1].map((rating) => {
                                        const count = ratingCounts[rating] || 0;
                                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                        return (
                                            <div key={rating} className="flex items-center gap-3 mb-2">
                                                <span className="text-sm w-8">{rating} ⭐</span>
                                                <div className="flex-1 bg-slate-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-slate-600 w-8 text-right">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <ReviewForm 
                                productId={Number(id)} 
                                onReviewAdded={() => {
                                    setReviewKey(prev => prev + 1);
                                    mutateReviews();
                                }} 
                            />

                            {reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {reviews.map((review: any, index: number) => (
                                        <motion.div
                                            key={review.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="font-black text-slate-900 text-sm uppercase tracking-tight">{review.author}</div>
                                                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span
                                                            key={star}
                                                            className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-slate-300'}`}
                                                        >
                                                            ⭐
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-slate-600 italic text-sm leading-relaxed">"{review.text}"</p>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white/50 border-2 border-dashed border-emerald-100 rounded-3xl p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                    No reviews yet. Be the first to review this product!
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-slate-900 font-outfit uppercase tracking-tighter mb-8 border-b border-emerald-100 pb-4 inline-block">Recommendations</h2>
                            <div className="space-y-4 mb-12">
                                {recommendations.length > 0 ? recommendations.slice(0, 4).map((rec: any, index: number) => (
                                    <motion.div
                                        key={rec.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link href={`/product/${rec.id}`} className="group block bg-white p-4 rounded-2xl border border-emerald-50 hover:border-emerald-200 transition-all hover:translate-x-1">
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
                                    </motion.div>
                                )) : (
                                    <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">Loading recommendations...</div>
                                )}
                            </div>

                            {/* Recently Viewed */}
                            {historyData && historyData.length > 1 && (
                                <>
                                    <h2 className="text-2xl font-black text-slate-900 font-outfit uppercase tracking-tighter mb-8 border-b border-emerald-100 pb-4 inline-block">Recently Viewed</h2>
                                    <div className="space-y-4">
                                        {historyData.filter((h: any) => h.product.id !== Number(id)).slice(0, 3).map((h: any, index: number) => (
                                            <motion.div
                                                key={h.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Link href={`/product/${h.product.id}`} className="group block opacity-60 hover:opacity-100 transition-all">
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
                                            </motion.div>
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
