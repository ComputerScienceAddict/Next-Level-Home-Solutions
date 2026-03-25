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
