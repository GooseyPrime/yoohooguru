/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@yoohooguru/shared'],
  env: {
    NEXT_PUBLIC_SUBDOMAIN: 'writing',
  },
}

module.exports = nextConfig
