import { useEffect, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://product-explorer-backend-ph5e.onrender.com';

export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
}
export const fetcher = (url: string) => fetchFromApi(url);

export function useUser() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        let id = localStorage.getItem('wob_user_id');
        if (!id) {
            id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('wob_user_id', id);
        }
        setUserId(id);
    }, []);

    return userId;
}
