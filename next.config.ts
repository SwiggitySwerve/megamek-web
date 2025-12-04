import type { NextConfig } from "next";
import type { Configuration } from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Turbopack config (empty to silence Next.js 16 warning)
  turbopack: {},
  
  // Optimize for production builds
  experimental: {
    // Enable modern output for better tree-shaking
    esmExternals: true,
  },

  // Webpack configuration for bundle optimization
  webpack: (config: Configuration, { buildId: _buildId, dev, isServer, defaultLoaders: _defaultLoaders, webpack }: { buildId: string; dev: boolean; isServer: boolean; defaultLoaders: unknown; webpack: typeof import('webpack') }) => {
    // Type assertion for webpack config - Configuration type has complex unions
    const webpackConfig = config as {
      optimization: { sideEffects?: boolean; splitChunks?: { cacheGroups?: Record<string, unknown> } };
      module: { rules: unknown[] };
      plugins: unknown[];
      resolve: { alias?: Record<string, string> };
    };
    // Enable tree-shaking for equipment data files
    if (!dev) {
      webpackConfig.optimization.sideEffects = false;

      // Add specific tree-shaking rules for equipment files
      webpackConfig.module.rules.push({
        test: /src\/data\/equipment.*\.ts$/,
        sideEffects: false,
      });
    }

    // Add bundle analyzer in development
    if (dev && !isServer) {
      webpackConfig.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: false,
        })
      );
    }

    // Optimize chunk splitting for better caching
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          
          // Separate chunk for equipment data
          equipment: {
            test: /[\\/]src[\\/]data[\\/]equipment/,
            name: 'equipment',
            chunks: 'all',
            priority: 30,
          },
          
          // Separate chunk for services
          services: {
            test: /[\\/]src[\\/]services[\\/]/,
            name: 'services',
            chunks: 'all',
            priority: 25,
          },
          
          // Separate chunk for utilities
          utils: {
            test: /[\\/]src[\\/]utils[\\/]/,
            name: 'utils',
            chunks: 'all',
            priority: 20,
          },
          
          // Separate chunk for components
          components: {
            test: /[\\/]src[\\/]components[\\/]/,
            name: 'components',
            chunks: 'all',
            priority: 15,
          },
        },
      };
    }

    // Add progress plugin for build feedback
    if (!dev) {
      webpackConfig.plugins.push(
        new webpack.ProgressPlugin({
          activeModules: true,
          entries: true,
          modules: true,
          dependencies: true,
        })
      );
    }

    // Optimize module resolution for faster builds
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      '@/services': './src/services',
      '@/utils': './src/utils',
      '@/components': './src/components',
      '@/data': './src/data',
      '@/types': './src/types',
    };

    return webpackConfig;
  },

  // Enable static optimization
  trailingSlash: false,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Enable compression
  compress: true,

  // Power-user settings
  poweredByHeader: false,
  
  // Generate build ID for cache busting
  generateBuildId: async () => {
    return `${Date.now()}`;
  },

  // Environment variables for build optimization
  env: {
    BUNDLE_ANALYZE: process.env.ANALYZE === 'true' ? 'true' : 'false',
    BUILD_TIME: new Date().toISOString(),
  },
};

export default nextConfig;
