<template>
  <div class="network-detail">
    <AuroraBackground class="aurora-bg" />
    
    <div class="header">
      <h1 class="title">
        <RadiantText>节点详情</RadiantText>
      </h1>
    </div>
    
    <div class="detail-content">
      <div v-if="loading" class="loading-container">
        <MultiStepLoader />
        <p>加载中...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <div class="error-icon">!</div>
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="!member" class="empty-container">
        <div class="empty-icon">📭</div>
        <p>未找到节点信息</p>
      </div>
      
      <div v-else class="detail-card">
        <div class="card-header">
          <h2 class="card-title">
            <RadiantText>{{ member.name || member.nodeId }}</RadiantText>
          </h2>
          <GlowBorder :color="member.lastSeen ? '#42b983' : '#dc3545'">
            <span class="status-indicator" :class="{ 'online': member.lastSeen }"></span>
          </GlowBorder>
        </div>
        
        <div class="info-container">
          <AnimatedTooltip content="节点的唯一标识符">
            <div class="info-row">
              <span class="info-label">Node ID</span>
              <span class="info-value">{{ member.nodeId }}</span>
            </div>
          </AnimatedTooltip>
          
          <AnimatedTooltip content="客户端版本信息">
            <div class="info-row">
              <span class="info-label">客户端</span>
              <span class="info-value">{{ member.clientVersion || '未知' }}</span>
            </div>
          </AnimatedTooltip>
          
          <AnimatedTooltip content="最后在线时间">
            <div class="info-row">
              <span class="info-label">最后活动</span>
              <span class="info-value">{{ formatLastSeen(member.lastSeen) }}</span>
            </div>
          </AnimatedTooltip>
          
          <AnimatedTooltip content="内网IP地址">
            <div class="info-row">
              <span class="info-label">内网IP</span>
              <span class="info-value">{{ member.config?.ipAssignments?.[0] || '未分配' }}</span>
            </div>
          </AnimatedTooltip>
          
          <AnimatedTooltip content="外网IP地址">
            <div class="info-row">
              <span class="info-label">外网IP</span>
              <span class="info-value">{{ member.physicalAddress || '未知' }}</span>
            </div>
          </AnimatedTooltip>
          
          <AnimatedTooltip content="MAC地址">
            <div class="info-row">
              <span class="info-label">MAC地址</span>
              <span class="info-value">{{ member.mac || '未知' }}</span>
            </div>
          </AnimatedTooltip>
          
          <AnimatedTooltip content="节点类型">
            <div class="info-row">
              <span class="info-label">节点类型</span>
              <span class="info-value">{{ member.type || '未知' }}</span>
            </div>
          </AnimatedTooltip>
          
          <AnimatedTooltip content="节点描述">
            <div class="info-row">
              <span class="info-label">描述</span>
              <span class="info-value">{{ member.description || '无' }}</span>
            </div>
          </AnimatedTooltip>
        </div>
        
        <div class="actions">
          <GradientButton @click="goBack">返回列表</GradientButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMember } from '@/services/api'
import {
  AuroraBackground,
  CardSpotlight,
  GradientButton,
  MultiStepLoader,
  RadiantText,
  GlowBorder,
  AnimatedTooltip
} from '@/components/ui'

interface NetworkMember {
  nodeId: string
  name?: string
  clientVersion?: string
  lastSeen?: number
  physicalAddress?: string
  mac?: string
  type?: string
  description?: string
  config?: {
    ipAssignments?: string[]
  }
}

const route = useRoute()
const router = useRouter()
const member = ref<NetworkMember | null>(null)
const loading = ref(true)
const error = ref('')

const formatLastSeen = (timestamp?: number) => {
  if (!timestamp) return '从未在线'
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const fetchMemberDetails = async () => {
  try {
    loading.value = true
    error.value = ''
    const networkId = localStorage.getItem('zerotier_network_id')
    const nodeId = route.params.nodeId as string
    const response = await getMember(networkId, nodeId)
    member.value = response.data
  } catch (err) {
    console.error('获取节点详情失败:', err)
    error.value = '获取节点详情失败，请重试'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/')
}

onMounted(() => {
  fetchMemberDetails()
})
</script>

<style scoped>
.network-detail {
  min-height: 100vh;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

@media (min-width: 768px) {
  .network-detail {
    padding: 2rem;
  }
}

.aurora-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.header {
  margin-bottom: 1.5rem;
  text-align: center;
}

@media (min-width: 768px) {
  .header {
    margin-bottom: 2rem;
  }
}

.title {
  font-size: 1.8rem;
  margin: 0;
}

@media (min-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
}

.detail-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding: 0 0.5rem;
}

@media (min-width: 768px) {
  .detail-content {
    padding: 0;
  }
}

.detail-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.5rem;
  margin: 0;
  word-break: break-all;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #dc3545;
}

.status-indicator.online {
  background: #42b983;
}

.info-container {
  margin-bottom: 2rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 0.5rem;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.info-value {
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  word-break: break-all;
  text-align: right;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.loading-container,
.error-container,
.empty-container {
  text-align: center;
  padding: 2rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  color: white;
  margin: 0 0.5rem;
}

@media (min-width: 768px) {
  .loading-container,
  .error-container,
  .empty-container {
    padding: 3rem;
    margin: 0;
  }
}

.error-icon,
.empty-icon {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

@media (min-width: 768px) {
  .error-icon,
  .empty-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
}

.error-container {
  color: #ff6b6b;
}
</style> 