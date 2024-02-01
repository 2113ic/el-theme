import { resolve } from 'node:path'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import ElementPlusResolver from '@icxy/el-theme'

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
