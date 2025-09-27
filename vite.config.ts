import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
// https://vite.dev/guide/env-and-mode
export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        babel: {
          presets: ['@babel/preset-typescript'],
          plugins: [
            '@babel/plugin-transform-typescript',
            ['@babel/plugin-proposal-decorators', { version: 'legacy' }],
            '@babel/plugin-transform-class-properties',
            [
              'babel-plugin-styled-components',
              {
                ssr: false,
                pure: true,
                fileName: true,
                displayName: true,
              },
            ],
          ],
        },
      }),
      viteTsconfigPaths(),
      svgr({
        svgrOptions: { exportType: 'named', ref: true },
        include: '**/*.svg',
      }),
      eslint({
        exclude: ['/virtual:/**', 'node_modules/**'],
      }),
    ],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
    },
    build: {
      minify: true,
      outDir: 'build',
      cssCodeSplit: true,
      assetsDir: 'assets',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
        },
      },
    },
  };
});
