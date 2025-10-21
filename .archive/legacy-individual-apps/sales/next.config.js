/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@yoohooguru/shared'],
  env: {
    NEXT_PUBLIC_SUBDOMAIN: 'sales',
  },
}

module.exports = nextConfig
