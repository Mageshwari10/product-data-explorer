import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";

export const metadata: Metadata = {
    title: "Product Data Explorer",
    description: "Scrape and explore products from World of Books",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@700;800&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased font-inter text-gray-900 bg-[#f8fafc]">
                <CartProvider>
                    {children}
                </CartProvider>
            </body>
        </html>
    );
}
