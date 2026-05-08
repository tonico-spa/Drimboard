/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/models/:path*.glb',
        headers: [
          { key: 'Content-Type', value: 'model/gltf-binary' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/models/:path*.gltf',
        headers: [
          { key: 'Content-Type', value: 'model/gltf+json' },
        ],
      },
    ];
  },
};

export default nextConfig;
