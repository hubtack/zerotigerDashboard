import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://my.zerotier.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // 从查询参数中获取 token 和 path
            const url = new URL(req.url || '', 'http://localhost')
            const token = url.searchParams.get('token')
            const apiPath = url.searchParams.get('path')
            
            if (token && apiPath) {
              // 设置 Authorization 头
              proxyReq.setHeader('Authorization', `Bearer ${token}`)
              // 修改请求路径
              proxyReq.path = `/api${apiPath}`
            }
          })
        }
      }
    }
  }
}) 