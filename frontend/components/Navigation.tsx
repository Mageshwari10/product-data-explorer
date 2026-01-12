'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

function CategoryPreview({ slug, title, isSub = false }: { slug: string; title: string; isSub?: boolean }) {
    const { data: catData } = useSWR(`/categories/${slug}?limit=5`, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });
    const products = catData?.products || [];

    if (products.length === 0) return null;

    const getCategoryDisplayName = (slug: string, title: string) => {
        const displayNames: Record<string, string> = {
            'fiction': 'Fiction Books',
            'non-fiction': 'Non-Fiction Books',
            'childrens-books': "Children's Books",
            'academic': 'Academic Books',
            'romance': 'Romance Books',
            'dvds': 'DVDs & Movies',
            'cds': 'Music CDs',
            'games': 'Video Games',
            'sale': 'Sale & Deals',
            'sell-your-books': 'Sell Books'
        };
        return displayNames[slug] || title;
    };

    const getCategoryDescription = (slug: string) => {
        const descriptions: Record<string, string> = {
            'fiction': 'Novels, stories, and fictional literature',
            'non-fiction': 'Biographies, history, science, and factual books',
            'childrens-books': 'Books for kids and young readers',
            'academic': 'Textbooks, research, and educational materials',
            'romance': 'Love stories and romantic fiction',
            'dvds': 'Movies, documentaries, and video content',
            'cds': 'Music albums and audio recordings',
            'games': 'PC, console, and video games',
            'sale': 'Discounted books and special offers',
            'sell-your-books': 'Trade or sell your used books'
        };
        return descriptions[slug] || '';
    };

    const displayName = getCategoryDisplayName(slug, title);
    const description = getCategoryDescription(slug);

    return (
        <div className={`absolute top-full ${isSub ? 'left-0' : 'left-1/2 -translate-x-1/2'} mt-0 pt-0 w-[320px] sm:w-[350px] opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-500 ease-out translate-y-4 group-hover/item:translate-y-0 z-[60]`}>
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden mt-3 ring-1 ring-white/20">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-slate-900 to-slate-800">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="font-black text-[8px] sm:text-[10px] uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                {displayName}
                            </span>
                            {description && (
                                <p className="text-[7px] sm:text-[8px] text-slate-400 mt-1 leading-relaxed hidden sm:block">{description}</p>
                            )}
                        </div>
                        <span className="text-[7px] sm:text-[8px] text-emerald-600 font-black bg-emerald-500/20 px-2 py-1 rounded-full">
                            {products.length} items
                        </span>
                    </div>
                </div>
                <div className="p-2 sm:p-3 space-y-2 bg-gradient-to-br from-emerald-50/50 to-white max-h-[250px] sm:max-h-[300px] overflow-y-auto">
                    {products.map((p: any, index: number) => (
                        <Link
                            key={p.id}
                            href={`/product/${p.id}`}
                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group/product border border-transparent hover:border-emerald-100"
                            style={{animationDelay: `${index * 100}ms`}}
                        >
                            <div className="w-8 h-10 sm:w-12 sm:h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center text-xs sm:text-sm group/product:scale-110 transition-transform overflow-hidden relative">
                                {p.imageUrl ? (
                                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                                ) : (
                                    '📖'
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-slate-800 truncate uppercase tracking-tighter text-[10px] sm:text-[11px] group/product:text-emerald-600 transition-colors">{p.title}</div>
                                {p.author && (
                                    <div className="text-[7px] sm:text-[9px] text-slate-500 truncate hidden sm:block">by {p.author}</div>
                                )}
                                <div className="font-black text-emerald-500 text-[9px] sm:text-[10px] mt-0.5">{p.price} {p.currency}</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[8px] sm:text-xs opacity-0 group/product:opacity-100 transition-all duration-300">
                                    →
                                </div>
                                <div className="text-[6px] sm:text-[8px] text-slate-400 font-black hidden sm:block">ID: {p.id}</div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="px-3 sm:px-4 py-2 bg-emerald-50/30 border-t border-emerald-100">
                    <Link 
                        href={`/category/${slug}`} 
                        className="text-xs sm:text-xs font-black text-emerald-700 hover:text-emerald-800 transition-colors flex items-center justify-center gap-1 py-2"
                    >
                        View all {displayName} →
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function Navigation() {
    const { data: navItems } = useSWR('/navigation', fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { cartCount } = useCart();
    const router = useRouter();

    const menuItems = navItems || [];

    // Group categories for better visibility
    const bookCategorySlugs = ['fiction', 'non-fiction', 'childrens-books', 'academic', 'romance'];
    const mediaCategorySlugs = ['dvds', 'cds', 'games'];
    const otherCategorySlugs = ['sale', 'sell-your-books'];

    const books = menuItems.filter((i: any) => bookCategorySlugs.includes(i.slug));
    const media = menuItems.filter((i: any) => mediaCategorySlugs.includes(i.slug));
    const others = menuItems.filter((i: any) => otherCategorySlugs.includes(i.slug));

    // Enhanced category display with subcategories
    const getCategoryDisplayName = (slug: string, title: string) => {
        const displayNames: Record<string, string> = {
            'fiction': 'Fiction Books',
            'non-fiction': 'Non-Fiction Books',
            'childrens-books': "Children's Books",
            'academic': 'Academic Books',
            'romance': 'Romance Books',
            'dvds': 'DVDs & Movies',
            'cds': 'Music CDs',
            'games': 'Video Games',
            'sale': 'Sale & Deals',
            'sell-your-books': 'Sell Books'
        };
        return displayNames[slug] || title;
    };

    const getCategoryDescription = (slug: string) => {
        const descriptions: Record<string, string> = {
            'fiction': 'Novels, stories, and fictional literature',
            'non-fiction': 'Biographies, history, science, and factual books',
            'childrens-books': 'Books for kids and young readers',
            'academic': 'Textbooks, research, and educational materials',
            'romance': 'Love stories and romantic fiction',
            'dvds': 'Movies, documentaries, and video content',
            'cds': 'Music albums and audio recordings',
            'games': 'PC, console, and video games',
            'sale': 'Discounted books and special offers',
            'sell-your-books': 'Trade or sell your used books'
        };
        return descriptions[slug] || '';
    };

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
                <div className="flex items-center justify-between h-16 md:h-20 gap-4 md:gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0 group">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/30 group-hover:rotate-12 transition-transform">📚</div>
                        <span className="font-outfit text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Wob<span className="text-emerald-600">Explorer</span></span>
                    </Link>

                    {/* Search Bar - Mobile */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-xl md:hidden mb-2">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search titles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-2 px-4 pl-9 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 opacity-50 group-hover:opacity-100 transition-opacity text-sm">
                                🔍
                            </div>
                        </div>
                    </form>

                    {/* Search Bar - Desktop */}
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
                        <Link href="/about" className="hidden lg:block px-4 py-2 text-sm font-black uppercase tracking-widest text-slate-600 hover:text-emerald-600 transition-all duration-300 border border-transparent hover:border-emerald-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-lg">
                            About
                        </Link>
                        <Link href="/contact" className="hidden lg:block px-4 py-2 text-sm font-black uppercase tracking-widest text-slate-600 hover:text-emerald-600 transition-all duration-300 border border-transparent hover:border-emerald-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-lg">
                            Contact
                        </Link>
                        <Link href="/cart" className="relative p-2 rounded-xl hover:bg-emerald-50 transition-all group">
                            <span className="text-2xl group-hover:scale-110 transition-transform">🛒</span>
                            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">{cartCount}</span>}
                        </Link>
                        <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-900"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg></button>
                    </div>
                </div>

                {/* Desktop Category Navigation - Secondary Row */}
                <div className="hidden md:flex items-center gap-1 border-t border-emerald-50/50 h-14 overflow-x-auto">
                    {/* Books Section */}
                    <div className="flex items-center gap-1 px-2 sm:px-3 border-r border-emerald-100/50 flex-shrink-0">
                        <span className="text-[7px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Books</span>
                    </div>
                    {books.map((item: any) => (
                        <div key={item.id} className="relative group/item h-full flex items-center flex-shrink-0">
                            <Link
                                href={`/category/${item.slug}`}
                                className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-slate-600 hover:text-emerald-600 transition-all duration-300 border border-transparent hover:border-emerald-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-lg group/category whitespace-nowrap"
                            >
                                <span className="relative z-10">{getCategoryDisplayName(item.slug, item.title)}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg opacity-0 group/category:opacity-10 transition-opacity duration-300"></div>
                            </Link>
                            <CategoryPreview slug={item.slug} title={item.title} />
                        </div>
                    ))}

                    {/* Media Section */}
                    {media.length > 0 && (
                        <>
                            <div className="flex items-center gap-1 px-2 sm:px-3 border-r border-emerald-100/50 flex-shrink-0">
                                <span className="text-[7px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Media</span>
                            </div>
                            {media.map((item: any) => (
                                <div key={item.id} className="relative group/item h-full flex items-center flex-shrink-0">
                                    <Link
                                        href={`/category/${item.slug}`}
                                        className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-slate-600 hover:text-emerald-600 transition-all duration-300 border border-transparent hover:border-emerald-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-lg group/category whitespace-nowrap"
                                    >
                                        <span className="relative z-10">{getCategoryDisplayName(item.slug, item.title)}</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg opacity-0 group/category:opacity-10 transition-opacity duration-300"></div>
                                    </Link>
                                    <CategoryPreview slug={item.slug} title={item.title} />
                                </div>
                            ))}
                        </>
                    )}
                    
                    {/* Other Section */}
                    {others.length > 0 && (
                        <>
                            <div className="flex items-center gap-1 px-2 sm:px-3 border-r border-emerald-100/50 flex-shrink-0">
                                <span className="text-[7px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Services</span>
                            </div>
                            {others.map((item: any) => (
                                <div key={item.id} className="relative group/item h-full flex items-center flex-shrink-0">
                                    <Link
                                        href={`/category/${item.slug}`}
                                        className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-slate-600 hover:text-emerald-600 transition-all duration-300 border border-transparent hover:border-emerald-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-lg group/category whitespace-nowrap"
                                    >
                                        <span className="relative z-10">{getCategoryDisplayName(item.slug, item.title)}</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg opacity-0 group/category:opacity-10 transition-opacity duration-300"></div>
                                    </Link>
                                    <CategoryPreview slug={item.slug} title={item.title} />
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" />
                            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 h-full w-[90%] sm:w-[85%] max-w-[320px] bg-white z-[105] shadow-2xl p-6 sm:p-8 pt-20 overflow-y-auto">
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
                                        <Link key={item.id} href={`/category/${item.slug}`} onClick={() => setMobileMenuOpen(false)} className="block text-lg sm:text-xl font-black text-slate-900 hover:text-emerald-600 uppercase tracking-tighter py-2">{getCategoryDisplayName(item.slug, item.title)}</Link>
                                    ))}
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-4 mt-6">Company</div>
                                    <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-lg sm:text-xl font-black text-slate-900 hover:text-emerald-600 uppercase tracking-tighter py-2">About</Link>
                                    <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-lg sm:text-xl font-black text-slate-900 hover:text-emerald-600 uppercase tracking-tighter py-2">Contact</Link>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
