// trigger-vercel-rebuild
// force-vercel-root-detection
import Navigation from '@/components/Navigation';
import ScrapeTrigger from '@/components/ScrapeTrigger';
import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen">
            <Navigation />

            {/* Hero Section */}
            <section className="relative pt-16 sm:pt-20 pb-20 sm:pb-32 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[120px] opacity-60 floating" />
                    <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-teal-100 rounded-full blur-[100px] opacity-50 floating" {...{style: {animationDelay: '2s'}}} />
                    <div className="absolute top-[50%] left-[20%] w-[20%] h-[20%] bg-blue-100 rounded-full blur-[80px] opacity-40 floating" {...{style: {animationDelay: '4s'}}} />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block px-6 py-2 mb-8 text-sm font-bold tracking-wider text-emerald-700 uppercase bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full animate-in shadow-lg">
                            ✨ Emerald Web Scraper
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.1]">
                            Explore <span className="gradient-text">World of Books</span> <br />
                            with <span className="gradient-text">Intelligent Data</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-in" {...{style: {animationDelay: '0.2s'}}}>
                            Discover thousands of titles across hundreds of categories.
                            Experience lightning-fast data exploration powered by Crawlee & NestJS.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 sm:mb-20">
                            <Link href="/category/fiction" className="btn-premium w-full sm:w-auto text-base sm:text-lg py-4 px-8 animate-in pulse-glow" {...{style: {animationDelay: '0.4s'}}}>
                                🚀 Start Exploring
                            </Link>
                            <a href="#admin" className="px-6 sm:px-8 py-3.5 bg-white/80 backdrop-blur-sm text-slate-900 font-semibold rounded-xl border border-emerald-100 hover:bg-emerald-50 transition-all w-full sm:w-auto shadow-lg hover:shadow-xl text-center animate-in" {...{style: {animationDelay: '0.6s'}}}>
                                ⚙️ View Admin Panel
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section - Mobile Friendly */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-block px-6 py-2 mb-6 text-sm font-bold tracking-wider text-emerald-700 uppercase bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full shadow-lg animate-in">
                            📚 Browse Categories
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                            Explore Our <span className="gradient-text">Library</span>
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto animate-in" {...{style: {animationDelay: '0.2s'}}}>
                            Discover thousands of titles across our curated collection
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
                        <Link href="/category/fiction" className="group p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl text-center hover:from-emerald-100 hover:to-emerald-200 transition-all hover:-translate-y-2 hover:shadow-2xl border border-emerald-200 animate-in" {...{style: {animationDelay: '0.4s'}}}>
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📚</div>
                            <div className="font-black text-sm text-slate-900 group-hover:text-emerald-600">Fiction</div>
                        </Link>
                        <Link href="/category/non-fiction" className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl text-center hover:from-blue-100 hover:to-blue-200 transition-all hover:-translate-y-2 hover:shadow-2xl border border-blue-200 animate-in" {...{style: {animationDelay: '0.5s'}}}>
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📖</div>
                            <div className="font-black text-sm text-slate-900 group-hover:text-blue-600">Non-Fiction</div>
                        </Link>
                        <Link href="/category/childrens-books" className="group p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl text-center hover:from-pink-100 hover:to-pink-200 transition-all hover:-translate-y-2 hover:shadow-2xl border border-pink-200 animate-in" {...{style: {animationDelay: '0.6s'}}}>
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🧸</div>
                            <div className="font-black text-sm text-slate-900 group-hover:text-pink-600">Children's</div>
                        </Link>
                        <Link href="/category/academic" className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl text-center hover:from-purple-100 hover:to-purple-200 transition-all hover:-translate-y-2 hover:shadow-2xl border border-purple-200 animate-in" {...{style: {animationDelay: '0.7s'}}}>
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎓</div>
                            <div className="font-black text-sm text-slate-900 group-hover:text-purple-600">Academic</div>
                        </Link>
                        <Link href="/category/romance" className="group p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl text-center hover:from-red-100 hover:to-red-200 transition-all hover:-translate-y-2 hover:shadow-2xl border border-red-200 animate-in" {...{style: {animationDelay: '0.8s'}}}>
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">💕</div>
                            <div className="font-black text-sm text-slate-900 group-hover:text-red-600">Romance</div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Admin Section */}
            <section id="admin" className="py-16 sm:py-24 bg-gradient-to-br from-emerald-50 to-teal-50 border-t border-emerald-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-xl mx-auto">
                        <div className="glass p-10 rounded-[32px] shadow-2xl shadow-emerald-900/10 relative overflow-hidden group animate-in" {...{style: {animationDelay: '0.4s'}}}>
                            <div className="absolute top-0 right-0 p-8 text-6xl opacity-[0.03] group-hover:scale-110 transition-transform">⚙️</div>
                            <h2 className="text-2xl font-bold mb-2 text-emerald-950">Admin Dashboard</h2>
                            <p className="text-emerald-800/60 mb-8 text-sm leading-relaxed">
                                Synchronize your local database with latest categories and navigation structure from source.
                            </p>

                            <ScrapeTrigger />

                            <div className="mt-8 pt-8 border-t border-emerald-100/50 flex items-start gap-3">
                                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg text-lg">💡</div>
                                <p className="text-sm text-emerald-800/70 italic leading-snug">
                                    Scraping may take a few minutes depending on network conditions.
                                    Progress will be visible in the console.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
