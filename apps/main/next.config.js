/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@yoohooguru/shared'],

  // Built-in optimization for production builds
  // This replaces the need for external minify plugins
  swcMinify: true,
  compress: true,

  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Configure for gateway architecture
  async rewrites() {
    return {
      beforeFiles: [
        // These rewrites are checked before pages/public files
        // The middleware will handle subdomain routing
      ],
      afterFiles: [
        // These rewrites are checked after pages/public files
        // and before dynamic routes
      ],
      fallback: [
        // These rewrites are checked after both pages/public files
        // and dynamic routes are checked
      ],
    }
  },

  // Support for environment variables per subdomain
  env: {
    NEXT_PUBLIC_SUBDOMAIN: process.env.NEXT_PUBLIC_SUBDOMAIN || 'www',
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_GTM_CONTAINER_ID: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID,
    NEXT_PUBLIC_VERCEL_ANALYTICS: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS || 'true',
  },
}

module.exports = nextConfig
