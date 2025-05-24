import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: string
  name: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  const setUser = (userData: User) => {
    user.value = userData
  }

  const login = async (networkId: string, token: string) => {
    try {
      // 更新用户状态
      setUser({ id: networkId, name: 'ZeroTier User' })
      
      return true
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    user.value = null
  }

  return {
    user,
    setUser,
    login,
    logout
  }
}) 