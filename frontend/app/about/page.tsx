'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <Navigation />
            
            <main className="container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="glass p-8 md:p-12 rounded-3xl mb-12">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-outfit">
                            About Our Product Explorer
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 mb-8 rounded-full"></div>
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-1 mb-4 text-[10px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-100 rounded-full">
                            Our Story
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 font-outfit uppercase tracking-tighter mb-6">
                            Wob<span className="text-emerald-600">Explorer</span>
                        </h1>
                        <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
                            Revolutionizing how you discover and archive literature through real-time web intelligence and premium data exploration.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        <div className="glass p-10 rounded-[40px] border-white/60">
                            <div className="text-3xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 font-outfit uppercase">The Mission</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Our goal is to bridge the gap between massive online book repositories and your personal collection. We use advanced crawling technology to bring you accurate, live data.
                            </p>
                        </div>
                        <div className="glass p-10 rounded-[40px] border-white/60">
                            <div className="text-3xl mb-4">🌲</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 font-outfit uppercase">The Essence</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Named after the vibrant Emerald palette, our design philosophy emphasizes clarity, speed, and a premium "High-End" feel for every interaction.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 blur-[100px] -mr-32 -mt-32"></div>
                        <h2 className="text-3xl font-black font-outfit uppercase tracing-tight mb-6">Built for the Future</h2>
                        <p className="text-slate-300 leading-relaxed mb-8">
                            WobExplorer is built on a modern stack including Next.js, NestJS, and TypeORM, ensuring high performance and data integrity. Every book you see is a result of intelligent automation.
                        </p>
                        <div className="flex gap-4">
                            <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">Next.js 14</div>
                            <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">emerald UI</div>
                            <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">Algolia Sync</div>
                        </div>
                    </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
