/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Old site sent everyone here; social/ads may still link to it.
      { source: '/welcome', destination: '/', permanent: true },
      { source: '/welcome/', destination: '/', permanent: true },
      { source: '/how-we-work', destination: '/', permanent: true },
      { source: '/contact', destination: '/get-offer', permanent: true },
      { source: '/sell', destination: '/areas', permanent: true },
    ];
  },
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
  /**
   * Windows dev only, if you hit corrupt webpack cache (vendor-chunks ENOENT):
   *   set NEXT_DISABLE_WEBPACK_CACHE=1
   * Leaving cache ON by default avoids flaky missing chunk 404s (main-app.js, etc.).
   */
  webpack: (config, { dev }) => {
    if (dev && process.env.NEXT_DISABLE_WEBPACK_CACHE === '1') {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
