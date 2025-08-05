/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/23b7fc8ef6c2804082e1dc42ecb35399',
        destination: '/case-study/citizens-league',
        permanent: true,
      },
      {
        source: '/23d7fc8ef6c2800b8e9deaebec871c7b',
        destination: '/case-study/stenovate',
        permanent: true,
      },
      {
        source: '/23b7fc8ef6c28016b2b5fdc0d5d2222e',
        destination: '/case-study/aurelius',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
