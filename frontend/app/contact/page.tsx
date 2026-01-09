'use client';

import Navigation from '@/components/Navigation';

export default function ContactPage() {
    return (
        <main className="min-h-screen">
            <Navigation />
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-block px-4 py-1 mb-4 text-[10px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-100 rounded-full">
                                Get In Touch
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 font-outfit uppercase tracking-tighter mb-6 leading-none">
                                Let's Start a <br /><span className="text-emerald-600">Conversation</span>
                            </h1>
                            <p className="text-lg text-slate-500 mb-12 max-w-md">
                                Have questions about our data collection or want to collaborate? We're here to help you navigate the library.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl border border-emerald-100 flex items-center justify-center text-xl shadow-sm">📍</div>
                                    <div>
                                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Headquarters</div>
                                        <div className="font-bold text-slate-900">Emerald Valley, CA</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl border border-emerald-100 flex items-center justify-center text-xl shadow-sm">✉️</div>
                                    <div>
                                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Us</div>
                                        <div className="font-bold text-slate-900">hello@wobexplorer.io</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-10 rounded-[48px] border-white/60 bg-white shadow-2xl">
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                                    <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Message</label>
                                    <textarea className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium h-32" placeholder="How can we help?"></textarea>
                                </div>
                                <button type="button" className="btn-premium w-full !rounded-2xl py-5">
                                    Send Message 🚀
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
