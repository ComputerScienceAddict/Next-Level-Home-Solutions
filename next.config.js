/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'monteinvestment.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
