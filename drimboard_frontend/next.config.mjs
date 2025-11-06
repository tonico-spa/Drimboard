/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/:path*', // This will match any path starting with /api
        destination: 'http://localhost:5001/:path*', // Proxy to your Flask backend
      },
    ];
  },
};

export default nextConfig;
