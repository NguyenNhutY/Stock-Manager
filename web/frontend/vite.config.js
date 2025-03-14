import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      http: "stream-http",
      https: "https-browserify",
      util: "util",
      zlib: "browserify-zlib",
      stream: "stream-browserify",
      url: "url",
      crypto: "crypto-browserify"
    }
  }
});
