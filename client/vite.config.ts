// vite.config.js
const path = require('path');

module.exports = {
  root: path.resolve(__dirname, 'src'),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:5000',
        changeOrigin: true
      }
    }
  },
};