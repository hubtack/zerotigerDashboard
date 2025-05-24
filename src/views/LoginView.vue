<template>
  <div class="login-container">
    <!-- 背景动画 -->
    <div class="animated-background">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
    </div>

    <div class="login-content">
      <div class="login-card">
        <h1 class="title">
          <span class="gradient-text">ZeroTier</span>
          <span class="subtitle">Dashboard</span>
        </h1>
        
        <div class="login-form">
          <div class="form-group">
            <label class="form-label">Network ID</label>
            <div class="input-wrapper">
              <input 
                v-model="networkId" 
                type="text" 
                class="form-input"
                placeholder="Enter your network ID"
              >
              <div class="input-focus-effect"></div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Access Token</label>
            <div class="input-wrapper">
              <input 
                v-model="accessToken" 
                type="password" 
                class="form-input"
                placeholder="Enter your access token"
              >
              <div class="input-focus-effect"></div>
            </div>
          </div>

          <button 
            @click="handleLogin" 
            class="login-button"
            :disabled="!networkId || !accessToken"
          >
            <span class="button-text">Login</span>
            <div class="button-glow"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const networkId = ref('')
const accessToken = ref('')

const handleLogin = async () => {
  try {
    if (!networkId.value || !accessToken.value) {
      return
    }
    
    await userStore.login(networkId.value, accessToken.value)
    
    // 使用 replace 而不是 push，这样用户点击返回时不会回到登录页
    await router.replace({
      name: 'home',
      query: {
        token: accessToken.value,
        networkId: networkId.value
      }
    })
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  position: relative;
  overflow: hidden;
  padding: 1rem;
  box-sizing: border-box;
}

/* 背景动画 */
.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.gradient-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: float 20s infinite;
}

.gradient-sphere:nth-child(1) {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  width: 600px;
  height: 600px;
  top: -200px;
  left: -100px;
  animation-delay: 0s;
}

.gradient-sphere:nth-child(2) {
  background: linear-gradient(45deg, #10b981, #3b82f6);
  width: 500px;
  height: 500px;
  top: 50%;
  right: -100px;
  animation-delay: -5s;
}

.gradient-sphere:nth-child(3) {
  background: linear-gradient(45deg, #8b5cf6, #ec4899);
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: 50%;
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(50px, 50px) scale(1.1);
  }
  50% {
    transform: translate(0, 100px) scale(1);
  }
  75% {
    transform: translate(-50px, 50px) scale(0.9);
  }
}

.login-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
}

.login-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

.title {
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.gradient-text {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradient 3s ease infinite;
}

.subtitle {
  font-size: 1.25rem;
  color: #94a3b8;
  font-weight: 500;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(255, 255, 255, 0.08);
}

.form-input::placeholder {
  color: #64748b;
}

.input-focus-effect {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.form-input:focus + .input-focus-effect {
  transform: scaleX(1);
}

.login-button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.button-text {
  position: relative;
  z-index: 1;
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.login-button:hover:not(:disabled) .button-glow {
  opacity: 0.2;
}

.login-button:disabled {
  background: #475569;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .login-container {
    padding: 0.75rem;
  }

  .login-card {
    padding: 1.25rem;
    margin: 0 0.5rem;
  }

  .gradient-text {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 0.875rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-input {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .login-button {
    padding: 0.625rem 1rem;
  }
}
</style> 