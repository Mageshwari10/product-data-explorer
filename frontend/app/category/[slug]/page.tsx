'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import { fetchFromApi, fetcher } from '@/lib/api';
import { CategorySkeleton } from '@/components/Skeleton';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [page, setPage] = useState(1);
    const limit = 12;

    const { data: catData, error, isLoading, mutate } = useSWR(
        `/categories/${slug}?page=${page}&limit=${limit}`,
        fetcher,
        { 
            keepPreviousData: true,
            revalidateOnFocus: true,
            revalidateOnReconnect: true
        }
    );

    const [scraping, setScraping] = useState(false);

    useEffect(() => {
        setPage(1);
    }, [slug]);

    const handleScrape = async () => {
        setScraping(true);
        try {
            await fetchFromApi(`/scraper/products/${slug}`, { method: 'POST' });
            setTimeout(() => mutate(), 5000);
        } catch (error) {
            console.error('Scrape failed:', error);
        } finally {
            setScraping(false);
        }
    };

    const products = catData?.products || [];
    const totalItems = catData?.totalProducts || 0;

    return (
        <main className="min-h-screen">
            <Navigation />
            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8"
                >
                    <div className="text-center md:text-left">
                        <div className="text-emerald-600 font-bold uppercase tracking-widest text-[9px] mb-2 px-3 py-1 bg-emerald-50 rounded-full inline-block">Collection Explorer</div>
                        <h1 className="text-5xl font-black text-slate-900 font-outfit uppercase tracking-tighter">
                            {slug.replace(/-/g, ' ')}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white p-1 rounded-2xl border border-emerald-100 flex items-center shadow-sm">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                        <div className="bg-white border border-emerald-100 px-6 py-2 rounded-2xl shadow-sm text-emerald-700 font-black text-lg">
                            {totalItems} <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1 pointer-events-none">Titles</span>
                        </div>
                    </div>
                </motion.div>

                {isLoading ? (
                    <CategorySkeleton />
                ) : products.length === 0 ? (
                    <div className="glass p-16 rounded-[40px] text-center border-dashed border-2 border-emerald-100 max-w-2xl mx-auto">
                        <div className="text-6xl mb-6 scale-125">🧭</div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2 font-outfit uppercase tracking-tight">Library Offline</h2>
                        <p className="text-slate-500 mb-10 max-w-sm mx-auto text-sm leading-relaxed">
                            No titles found in this archive. Trigger a deep scan for <strong>{slug.replace(/-/g, ' ')}</strong>.
                        </p>
                        <button
                            onClick={handleScrape}
                            disabled={scraping}
                            className={`btn-premium inline-flex mx-auto py-4 px-10 ${scraping ? 'opacity-70 animate-pulse' : ''}`}
                        >
                            {scraping ? 'Deep Scanning...' : `Sync Category Now`}
                        </button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12">
                                {products.map((p: any) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        ) : (
                            <div className="glass rounded-[32px] overflow-hidden border-white/50 mb-12">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-emerald-600/5 text-emerald-800 text-[10px] font-black uppercase tracking-widest border-b border-emerald-100">
                                            <th className="px-8 py-5 text-center">Preview</th>
                                            <th className="px-8 py-5">Title</th>
                                            <th className="px-8 py-5">Price Est.</th>
                                            <th className="px-8 py-5 text-right">Explore</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-emerald-100/30">
                                        {products.map((p: any) => (
                                            <tr key={p.id} className="group hover:bg-white transition-all">
                                                <td className="px-8 py-4 w-24">
                                                    <div className="w-12 h-16 bg-white rounded-lg shadow-sm border border-emerald-50 relative overflow-hidden">
                                                        {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="object-cover w-full h-full" />}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <div className="font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight text-sm">{p.title}</div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className="font-black text-emerald-600 text-lg">{p.price}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold ml-1">{p.currency}</span>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <Link href={`/product/${p.id}`} className="inline-flex items-center gap-2 group-hover:bg-emerald-600 group-hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black text-emerald-600 border border-emerald-100 transition-all active:scale-95 uppercase tracking-widest">
                                                        Details ➔
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalItems > limit && (
                            <div className="flex items-center justify-center gap-4 py-12 border-t border-emerald-100/50">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-8 py-3 rounded-2xl bg-white border border-emerald-100 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 disabled:opacity-20 transition-all shadow-sm active:scale-95"
                                >
                                    ← Back
                                </button>
                                <div className="px-8 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/10">
                                    Archive Page {page}
                                </div>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page >= Math.ceil(totalItems / limit)}
                                    className="px-8 py-3 rounded-2xl bg-white border border-emerald-100 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 disabled:opacity-20 transition-all shadow-sm active:scale-95"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </main>
    );
}
