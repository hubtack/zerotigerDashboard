<template>
  <div class="home">
    <AuroraBackground class="aurora-bg" />
    
    <div class="header">
      <h1 class="title">
        <RadiantText>ZeroTier Dashboard</RadiantText>
      </h1>
    </div>
    
    <div class="dashboard-content">
      <div class="networks-section">
        <h2 class="section-title">
          <RadiantText>网络列表</RadiantText>
        </h2>
        
        <div v-if="loading" class="loading-container">
          <MultiStepLoader />
          <p>加载中...</p>
        </div>
        
        <div v-else-if="error" class="error-container">
          <div class="error-icon">!</div>
          <p>{{ error }}</p>
        </div>
        
        <div v-else-if="networks.length === 0" class="empty-container">
          <div class="empty-icon">📭</div>
          <p>暂无网络</p>
        </div>
        
        <div v-else class="networks-grid">
          <div
            v-for="member in sortedNetworks"
            :key="member.nodeId"
            class="card-3d"
            :class="{ 'offline': !member.lastSeen }"
          >
            <div class="card-content">
              <div class="card-header">
                <h3 class="card-title">
                  <RadiantText>{{ member.name || member.nodeId }}</RadiantText>
                </h3>
                <span class="status-text" :class="{ 'online': isOnline(member) }">
                  <span class="status-dot"></span>
                  {{ isOnline(member) ? '在线' : '离线' }}
                </span>
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
              </div>
              
              <GradientButton
                @click="viewNetworkDetails(member.nodeId)"
                :disabled="!member.lastSeen"
              >
                查看详情
              </GradientButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getMembers } from '@/services/api'
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
  config?: {
    ipAssignments?: string[]
  }
}

const router = useRouter()
const userStore = useUserStore()
const networks = ref<NetworkMember[]>([])
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

const fetchNetworks = async () => {
  try {
    loading.value = true
    error.value = ''
    const networkId = localStorage.getItem('zerotier_network_id')
    const response = await getMembers(networkId)
    networks.value = response.data
  } catch (err) {
    console.error('获取网络列表失败:', err)
    error.value = '获取网络列表失败，请重试'
  } finally {
    loading.value = false
  }
}

const viewNetworkDetails = (nodeId: string) => {
  router.push(`/network/${nodeId}`)
}

const isOnline = (member: NetworkMember) => {
  if (!member.lastSeen) return false
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
  return member.lastSeen > fiveMinutesAgo
}

const sortedNetworks = computed(() => {
  return [...networks.value].sort((a, b) => {
    const aOnline = isOnline(a)
    const bOnline = isOnline(b)
    if (aOnline === bOnline) return 0
    return aOnline ? -1 : 1
  })
})

onMounted(() => {
  fetchNetworks()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

@media (min-width: 768px) {
  .home {
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

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

@media (min-width: 768px) {
  .dashboard-content {
    padding: 0 3rem;
  }
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
}

.networks-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap:3rem 2rem;
  padding: 1.5rem 0.5rem;
}

@media (min-width: 640px) {
  .networks-grid {
    grid-template-columns: repeat(2, 1fr);

  }
}

@media (min-width: 1024px) {
  .networks-grid {
    grid-template-columns: repeat(3, 1fr);
 
  }
}

@media (min-width: 1400px) {
  .networks-grid {
    grid-template-columns: repeat(4, 1fr);

  }
}

.card-3d {
  position: relative;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem 1.5rem 0.5rem 1.5rem;
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.card-3d:hover {
  transform: translateY(-5px) rotateX(5deg) rotateY(5deg);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.card-3d::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  z-index: -1;
}

.card-3d.offline {
  opacity: 0.7;
}

.card-3d.offline:hover {
  opacity: 0.9;
}

.card-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .card-header {
    margin-bottom: 1.5rem;
  }
}

.card-title {
  font-size: 1.1rem;
  margin: 0;
  word-break: break-all;
}

@media (min-width: 768px) {
  .card-title {
    font-size: 1.2rem;
  }
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
  flex: 1;
  margin: 1.5rem 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  max-width: 60%;
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

.network-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: #ef4444;
  color: white;
}

.network-status.online {
  background: #22c55e;
}

.network-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
}

.status-text {
  font-size: 14px;
  color: #dc3545;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-text.online {
  color: #42b983;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
  display: inline-block;
}

.card-footer {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}
</style>
