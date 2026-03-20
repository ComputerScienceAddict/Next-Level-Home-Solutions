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
   * Windows dev: disk webpack cache can corrupt (missing vendor-chunks/@swc.js).
   * Disabling persistent cache in dev avoids ENOENT / 500s; prod build unchanged.
   */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
