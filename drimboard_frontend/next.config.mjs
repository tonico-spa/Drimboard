/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/:path*', // This will match any path starting with /api
        destination: `${API_URL}/:path*`
      },
    ];
  },
};

export default nextConfig;

