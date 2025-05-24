import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import LoginView from '@/views/LoginView.vue'
import NetworkDetail from '@/views/NetworkDetail.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/network/:nodeId',
    name: 'network-detail',
    component: NetworkDetail,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = to.query.token as string
  const networkId = to.query.networkId as string

  if (to.meta.requiresAuth && (!token || !networkId)) {
    // 如果需要认证但没有 token 或 networkId，重定向到登录页
    next({ name: 'login' })
  } else if (to.name === 'login' && token && networkId) {
    // 如果已登录但访问登录页，重定向到首页
    next({ 
      name: 'home',
      query: { token, networkId }
    })
  } else {
    next()
  }
})

export default router 