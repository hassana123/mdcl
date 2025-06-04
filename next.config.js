/** @type {import('next').NextConfig} */
// next.config.js
const nextConfig = {
    webpack: (config) => {
      config.module.rules.push({
        test: /pdf\.worker\.entry\.js/,
        use: { loader: 'file-loader' },
      });
      config.resolve.alias.canvas = false;
      return config;
    },
    images: {
      domains: ['firebasestorage.googleapis.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
          pathname: '/v0/b/**',
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  