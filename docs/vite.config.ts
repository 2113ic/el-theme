import { resolve } from 'node:path'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import ElementPlusResolver from '../packages/theme/index'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: ElementPlusResolver()
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
