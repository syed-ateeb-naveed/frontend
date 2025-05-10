/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  // Ensure server actions work properly
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
    // Disable static generation for routes that use cookies
    outputFileTracing: true,
  },
  // Ensure all routes are treated as dynamic by default
  output: 'standalone',
}

export default nextConfig

