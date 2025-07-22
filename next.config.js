/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "file.hstatic.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pos.nvncdn.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
