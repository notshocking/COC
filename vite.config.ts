import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],

    server: {
      port: 3000,
      host: '0.0.0.0',
      open: true,
    },

    preview: {
      port: 3000,
    },

    define: {
      'process.env.API_KEY': JSON.stringify(env['GEMINI_API_KEY']),
      'process.env.GEMINI_API_KEY': JSON.stringify(env['GEMINI_API_KEY']),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@/components': path.resolve(__dirname, './components'),
        '@/services': path.resolve(__dirname, './services'),
        '@/data': path.resolve(__dirname, './data'),
      },
    },

    build: {
      target: 'es2022',
      sourcemap: mode === 'development',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'chart-vendor': ['recharts'],
            'ui-vendor': ['lucide-react'],
          },
        },
      },
      chunkSizeWarningLimit: 500,
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'recharts', 'lucide-react'],
    },
  };
});
