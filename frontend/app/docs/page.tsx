'use client';

import Navigation from '@/components/Navigation';

export default function DocsPage() {
    return (
        <main className="min-h-screen">
            <Navigation />
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-16">
                        <div className="inline-block px-4 py-1 mb-4 text-[10px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-100 rounded-full">
                            Developer Interface
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 font-outfit uppercase tracking-tighter mb-4">
                            Documentation
                        </h1>
                        <p className="text-lg text-slate-500">
                            Comprehensive guide to the Product Data Explorer (WobExplorer) architecture and feature set.
                        </p>
                    </div>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 font-outfit uppercase tracking-tight flex items-center gap-3">
                                <span className="bg-emerald-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm">01</span>
                                Core Architecture
                            </h2>
                            <div className="glass p-8 rounded-3xl border-white/60 space-y-4">
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    WobExplorer uses a decoupled **monorepo** structure:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-emerald-500 mt-1 font-bold">»</span>
                                        <div>
                                            <span className="font-bold text-slate-800">Backend:</span> Built with **NestJS** and **PostgreSQL** via TypeORM. Handles scraping jobs, data persistence, and API delivery.
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-emerald-500 mt-1 font-bold">»</span>
                                        <div>
                                            <span className="font-bold text-slate-800">Frontend:</span> Built with **Next.js 14**, featuring a premium **Emerald Tailwind** design system and dynamic server components.
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 font-outfit uppercase tracking-tight flex items-center gap-3">
                                <span className="bg-emerald-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm">02</span>
                                Scraping Engine
                            </h2>
                            <div className="glass p-8 rounded-3xl border-white/60 space-y-4">
                                <p className="text-slate-600 leading-relaxed">
                                    The **Emerald Crawler** utilizes `Crawlee` and `Playwright` to navigate e-commerce platforms. It currently interfaces with **Algolia** search indexes to provide near-instant results for common categories.
                                </p>
                                <div className="bg-slate-900 rounded-2xl p-6 text-emerald-400 font-mono text-xs overflow-x-auto shadow-xl">
                                    POST /scraper/products/:categorySlug<br />
                                    // Triggers a targeted scrape for a specific genre
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 font-outfit uppercase tracking-tight flex items-center gap-3">
                                <span className="bg-emerald-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm">03</span>
                                UI Components
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white border border-emerald-50 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="font-bold text-slate-800 mb-2">Emerald Glass</div>
                                    <p className="text-xs text-slate-500">Custom CSS layer providing high-depth translucent containers with background blurs.</p>
                                </div>
                                <div className="bg-white border border-emerald-50 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="font-bold text-slate-800 mb-2">Dynamic Grid</div>
                                    <p className="text-xs text-slate-500">Responsive grid/list toggle for high-efficiency book title exploration.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mt-20 pt-12 border-t border-slate-200 text-center">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            Product Data Explorer Documentation &copy; 2026
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
