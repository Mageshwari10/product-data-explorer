'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{success: boolean, message: string} | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        
        try {
            // In a real app, you would send this to your backend
            console.log('Form submitted:', formData);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setSubmitStatus({
                success: true,
                message: 'Thank you for your message! We will get back to you soon.'
            });
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setSubmitStatus({
                success: false,
                message: 'Something went wrong. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <Navigation />
            
            <main className="container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="glass p-8 md:p-12 rounded-3xl">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 font-outfit">Contact Us</h1>
                        <p className="text-slate-600 mb-8">Have questions? We'd love to hear from you.</p>
                        
                        <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 mb-8 rounded-full"></div>
                        
                        {submitStatus && (
                            <div className={`p-4 mb-6 rounded-xl ${
                                submitStatus.success ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {submitStatus.message}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    placeholder="Your name"
                                />
                            </div>
                            

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all ${
                                        isSubmitting ? 'opacity-70' : ''
                                    }`}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-12 pt-8 border-t border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Other Ways to Reach Us</h3>
                            <div className="space-y-3">
                                <p className="flex items-center text-slate-600">
                                    <svg className="w-5 h-5 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    contact@productexplorer.com
                                </p>
                                <p className="flex items-center text-slate-600">
                                    <svg className="w-5 h-5 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    +1 (555) 123-4567
                                </p>
                                <p className="flex items-start text-slate-600">
                                    <svg className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    123 Product Street<br />
                                    Tech City, TC 12345<br />
                                    United States
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
