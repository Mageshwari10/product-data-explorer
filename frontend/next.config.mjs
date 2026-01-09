/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.worldofbooks.com',
            },
            {
                protocol: 'https',
                hostname: 'image-server.worldofbooks.com',
            },
            {
                protocol: 'https',
                hostname: 'wob.com',
            },
            {
                protocol: 'https',
                hostname: 'm.media-amazon.com',
            },
            {
                protocol: 'https',
                hostname: 'images-na.ssl-images-amazon.com',
            },
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
            {
                protocol: 'https',
                hostname: 'covers.openlibrary.org',
            }
        ],
    },
};

export default nextConfig;
