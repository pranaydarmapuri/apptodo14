/** @type {import('next').NextConfig} */
// next.config.js
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/signin',
          destination: '/components/ui/signin', // adjust the destination path accordingly
          permanent: true,
        },
        {
          source: '/login',
          destination: '/components/ui/login', // adjust the destination path accordingly
          permanent: true,
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  