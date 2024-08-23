/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable React's Strict Mode
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'www.mozilla.org',
      }
    ],
  },
};

export default nextConfig;
