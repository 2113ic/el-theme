import { resolve } from 'node:path'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import Comps from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
