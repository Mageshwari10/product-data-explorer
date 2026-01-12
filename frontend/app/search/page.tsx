'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import { CategorySkeleton } from '@/components/Skeleton';
import { motion } from 'framer-motion';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const { data, isLoading } = useSWR(query ? `/products/search/find?q=${encodeURIComponent(query)}` : null, fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true
    });

    const products = data?.products || [];
    const total = data?.total || 0;

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest mb-4">
                    Archive Search results
                </div>
                <h1 className="text-4xl font-black text-slate-900 font-outfit uppercase tracking-tighter">
                    Search: <span className="text-emerald-600">"{query}"</span>
                </h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                    {total} matching records found in database
                </p>
            </motion.div>

            {isLoading ? (
                <CategorySkeleton />
            ) : products.length === 0 ? (
                <div className="glass p-20 rounded-[40px] text-center border-dashed border-2 border-emerald-100 max-w-2xl mx-auto">
                    <div className="text-6xl mb-6">📉</div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2 font-outfit uppercase tracking-tight">No Records Found</h2>
                    <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed mb-8">
                        We couldn't find any matches for <strong>"{query}"</strong>. Try checking your spelling or search for a broader term like "Fiction".
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <main className="min-h-screen pb-20">
            <Navigation />
            <Suspense fallback={<CategorySkeleton />}>
                <SearchContent />
            </Suspense>
        </main>
    );
}
