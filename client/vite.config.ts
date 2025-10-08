import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Optimize JSX runtime
      jsxRuntime: 'automatic',
    }),
    // Bundle analyzer (only in build mode)
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, '../attached_assets'),
    },
  },
  
  build: {
    // Enable source maps for debugging in production
    sourcemap: false,
    
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    
    // Manual chunking for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['wouter', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'framer-motion'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers'],
          'query-vendor': ['@tanstack/react-query'],
          'radix-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
          // Utility chunks
          'utils': ['clsx', 'tailwind-merge', 'date-fns', 'zod'],
        },
      },
    },
    
    // Minification options
    minify: 'esbuild',
    target: 'es2020',
    
    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'wouter',
      'lucide-react',
      'framer-motion',
      '@tanstack/react-query',
      'clsx',
      'tailwind-merge',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },
  
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  
  // Performance optimizations
  esbuild: {
    // Remove console.log in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});
