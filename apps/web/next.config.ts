import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@compras-ja/ui', '@compras-ja/shared'],
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
