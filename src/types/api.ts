// API 响应类型
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

// 用户相关类型
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  createdAt: string
  updatedAt: string
}

// 设置相关类型
export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: boolean
}

// 仪表盘数据类型
export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalOrders: number
  totalRevenue: number
  recentOrders: Order[]
}

export interface Order {
  id: string
  userId: string
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
} 