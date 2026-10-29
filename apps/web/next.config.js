const imagesUrl = process.env.NEXT_PUBLIC_IMAGES_URL
  ? new URL(process.env.NEXT_PUBLIC_IMAGES_URL)
  : null;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/api/:path*`,
      },
    ];
  },
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: process.env.BACKEND_PROTOCOL,
        hostname: process.env.BACKEND_HOST,
      },
      ...(imagesUrl
        ? [{ protocol: 'https', hostname: imagesUrl.hostname }]
        : []),
    ],
  },
};

export default nextConfig;
