/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mfl.maxbarsukov.ru',
        port: '80'
      }
    ]
  },
  transpilePackages: ['geist']
};

module.exports = nextConfig;
