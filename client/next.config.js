/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mfl.maxbarsukov.ru',
        port: '',
        pathname: '/storage/mfl/**'
      }
    ]
  },
  transpilePackages: ['geist']
};

module.exports = nextConfig;
