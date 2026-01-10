'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

function CategoryPreview({ slug, title, isSub = false }: { slug: string; title: string; isSub?: boolean }) {
    const { data: catData } = useSWR(`/categories/${slug}?limit=5`, fetcher);
    const products = catData?.products || [];

    if (products.length === 0) return null;

    return (
        <div className={`absolute top-full ${isSub ? 'left-0' : 'left-1/2 -translate-x-1/2'} mt-0 pt-0 w-[300px] opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300 translate-y-2 group-hover/item:translate-y-0 z-[60]`}>
            <div className="bg-white rounded-3xl shadow-2xl border border-emerald-50 overflow-hidden mt-2">
                <div className="p-3 bg-slate-900 flex justify-between items-center">
                    <span className="font-black text-[8px] uppercase tracking-widest text-emerald-400">{title} Spotlight</span>
                </div>
                <div className="p-2 space-y-1 bg-emerald-50/5">
                    {products.map((p: any) => (
                        <Link
                            key={p.id}
                            href={`/product/${p.id}`}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all"
                        >
                            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-xs">📖</div>
                            <div className="flex-1 min-w-0 text-[10px]">
                                <div className="font-bold text-slate-800 truncate uppercase tracking-tighter">{p.title}</div>
                                <div className="font-black text-emerald-500">{p.price} {p.currency}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Navigation() {
    const { data: navItems } = useSWR('/navigation', fetcher);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { cartCount } = useCart();
    const router = useRouter();

    const menuItems = navItems || [];

    // Group categories for better visibility
    const bookCategorySlugs = ['books', 'fiction-books', 'non-fiction-books', 'childrens-books', 'rare-books'];
    const mediaCategorySlugs = ['dvds', 'cds', 'games'];
    const otherCategorySlugs = ['sale', 'sell-your-books'];

    const books = menuItems.filter((i: any) => bookCategorySlugs.includes(i.slug));
    const media = menuItems.filter((i: any) => mediaCategorySlugs.includes(i.slug));
    const others = menuItems.filter((i: any) => otherCategorySlugs.includes(i.slug));

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <nav className="glass sticky top-0 z-50 border-b border-gray-200/20">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20 gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0 group">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/30 group-hover:rotate-12 transition-transform">📚</div>
                        <span className="font-outfit text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Wob<span className="text-emerald-600">Explorer</span></span>
                    </Link>

                    {/* Search Bar - Global */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search by title, author, or keyword..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl py-2.5 px-5 pl-11 text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 opacity-50 group-hover:opacity-100 transition-opacity">
                                🔍
                            </div>
                        </div>
                    </form>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Link href="/cart" className="relative p-2 rounded-xl hover:bg-emerald-50 transition-all group">
                            <span className="text-2xl group-hover:scale-110 transition-transform">🛒</span>
                            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">{cartCount}</span>}
                        </Link>
                        <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-900"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg></button>
                    </div>
                </div>

                {/* Desktop Category Navigation - Secondary Row */}
                <div className="hidden lg:flex items-center gap-1 border-t border-emerald-50/50 h-12">
                    {books.map((item: any) => (
                        <div key={item.id} className="relative group/item h-full flex items-center">
                            <Link
                                href={`/category/${item.slug}`}
                                className="px-3 py-1.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100 hover:bg-emerald-50 rounded-lg"
                            >
                                {item.title}
                            </Link>
                            <CategoryPreview slug={item.slug} title={item.title} />
                        </div>
                    ))}

                    <div className="w-px h-4 bg-slate-200 mx-2"></div>

                    {media.map((item: any) => (
                        <div key={item.id} className="relative group/item h-full flex items-center">
                            <Link
                                href={`/category/${item.slug}`}
                                className="px-3 py-1.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100 hover:bg-emerald-50 rounded-lg"
                            >
                                {item.title}
                            </Link>
                            <CategoryPreview slug={item.slug} title={item.title} />
                        </div>
                    ))}

                    <div className="flex-1"></div>

                    {others.map((item: any) => (
                        <Link
                            key={item.id}
                            href={`/category/${item.slug}`}
                            className="px-3 py-1.5 text-sm font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 h-full w-[85%] max-w-[350px] bg-white z-[105] shadow-2xl p-8 pt-20 overflow-y-auto">
                            <form onSubmit={handleSearch} className="mb-8">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search archive..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-emerald-50 border border-emerald-100 rounded-xl py-3 px-10 text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">🔍</div>
                                </div>
                            </form>
                            <div className="space-y-6">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-4">Library</div>
                                {[...books, ...media, ...others].map((item: any) => (
                                    <Link key={item.id} href={`/category/${item.slug}`} onClick={() => setMobileMenuOpen(false)} className="block text-xl font-black text-slate-900 hover:text-emerald-600 uppercase tracking-tighter">{item.title}</Link>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
