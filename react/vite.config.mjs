import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

const resolvePath = (str) => path.resolve(__dirname, str);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const PORT = parseInt(env.PORT || '3000', 10);

  return {
    base: '/react/free/',
    server: {
      open: true,
      port: PORT,
      host: true,
      strictPort: true,
      cors: true,
      fs: {
        strict: true,
        allow: ['..']
      },
      hmr: {
        overlay: false
      }
    },
    preview: {
      open: true,
      host: true,
      port: PORT + 1,
      cors: true
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_APP_BASE_NAME': JSON.stringify('/react/free/'),
      __APP_VERSION__: JSON.stringify(env.npm_package_version || '0.0.1')
    },
    resolve: {
      alias: {
        '@': resolvePath('src'),
        '@assets': resolvePath('src/assets'),
        '@components': resolvePath('src/components'),
        '@contexts': resolvePath('src/contexts'),
        '@views': resolvePath('src/views'),
        '@routes': resolvePath('src/routes')
      },
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly'
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/scss/variables.scss";`,
          charset: false
        },
        less: {
          javascriptEnabled: true,
          charset: false
        }
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') atRule.remove();
              }
            }
          }
        ]
      }
    },
    build: {
      target: 'esnext',
      minify: 'terser',
      sourcemap: mode !== 'production',
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        input: resolvePath('index.html'),
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('@mui')) {
                return 'vendor-mui';
              }
              if (id.includes('apexcharts') || id.includes('recharts')) {
                return 'vendor-charts';
              }
              return 'vendor';
            }
            if (id.includes('src/views/dashboard')) {
              return 'dashboard';
            }
          },
          assetFileNames: 'assets/[name].[hash].[ext]',
          chunkFileNames: 'chunks/[name].[hash].js',
          entryFileNames: 'entries/[name].[hash].js'
        }
      },
      outDir: 'dist',
      emptyOutDir: true
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@mui/material', '@emotion/react', '@emotion/styled', 'framer-motion'],
      exclude: ['js-big-decimal']
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin']
        }
      }),
      tsconfigPaths()
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
      coverage: {
        reporter: ['text', 'json', 'html']
      }
    }
  };
});
