'use client';
import { useState } from 'react';
import { fetchFromApi } from '@/lib/api';

export default function ScrapeTrigger() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleScrape = async () => {
        setLoading(true);
        setMessage('');
        try {
            await fetchFromApi('/scraper/navigation', { method: 'POST' });
            setMessage('Scrape started! Data will appear shortly.');
            // Ideally we would poll or use websockets here
        } catch (error) {
            setMessage('Failed to start scrape.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <button
                onClick={handleScrape}
                disabled={loading}
                className={`btn-premium w-full sm:w-auto ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {loading ? (
                    <>
                        <span className="animate-spin text-xl">🔄</span>
                        Launching Crawler...
                    </>
                ) : (
                    <>
                        <span className="text-xl">🚀</span>
                        Trigger Full Synchronize
                    </>
                )}
            </button>
            {message && (
                <div className={`text-sm py-2 px-4 rounded-lg animate-in fade-in slide-in-from-left-2 ${message.includes('Failed') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                    {message}
                </div>
            )}
        </div>
    );
}
