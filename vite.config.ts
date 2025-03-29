import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@img': path.resolve(__dirname, './public/img')
    }
  },
  server: {
    proxy: {
      '/api/megasena': {
        target: 'https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/megasena/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Enviando requisição para:', req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Recebeu resposta de:', req.url, 'status:', proxyRes.statusCode);
          });
        },
      },
    },
  },
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})