/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const nextConfig = {
  reactStrictMode: true,
 
};

export default nextConfig;
