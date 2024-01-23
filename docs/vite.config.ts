import { resolve } from 'node:path'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
// import ElementResolver from '@icxy/el-theme/resolver'
import ElementResolver from './resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: ElementResolver()
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
