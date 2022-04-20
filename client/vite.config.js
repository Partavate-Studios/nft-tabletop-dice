import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: './public',
    emptyOutDir: false,
    chunkSizeWarningLimit: 1000,
    // build breaks refs to `this.store` in methods of `SelectedDieBox.vue`. Disabling minify to debug
    minify: false,
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})