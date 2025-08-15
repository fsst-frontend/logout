<script setup>
import { ref } from 'vue'
import { getMyInviteesInfoList } from '@/api/invite.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentTab = ref('registered')

const users = ref([])
const loading = ref(false)

function switchTab(tab) {
  loading.value = true
  currentTab.value = tab
  const params = {}
  if (currentTab.value === 'activated') {
    params.has_active = true
  }
  else if (currentTab.value === 'traded') {
    params.has_trader = true
  }
  getMyInviteesInfoList(params).then((res) => {
    users.value = (res.data.invitees || []).map((item) => {
      item.id = item.invitee_id
      item.status = item.has_active ? 'activated' : item.has_trader ? 'traded' : 'registered'
      item.joinTime = new Date(item.register_time * 1000).toLocaleString()
      item.inviteCode = item.invitation_code
      item.myRebate = `${item.rebate_ratio * 100}%`
      item.friendRebate = `${item.return_ratio * 100}%`
      item.commission = `${item.rebate_amount} USD`
      item.progress = item.has_trader ? 3 : item.has_active ? 2 : 1
      return item
    })
  }).finally(() => {
    loading.value = false
  })
}

const steps = [
  { text: t('invitation.register'), inactiveIcon: 'circle', activeIcon: 'success' },
  { text: t('invitation.activation'), inactiveIcon: 'circle', activeIcon: 'success' },
  { text: t('invitation.transaction'), inactiveIcon: 'circle', activeIcon: 'success' },
]

// function isActive(item) {
//   if (item.has_active)
//     return 1
//   if (item.has_trader)
//     return 2
//   return 0
// }

onMounted(() => {
  switchTab(currentTab.value)
})
</script>

<template>
  <div class="user-status-container">
    <div class="status-nav">
      <div
        class="status-item"
        :class="{ active: currentTab === 'registered' }"
        @click="switchTab('registered')"
      >
        {{ $t('invitation.registered') }}
      </div>
      <div
        class="status-item"
        :class="{ active: currentTab === 'activated' }"
        @click="switchTab('activated')"
      >
        {{ $t('invitation.activated') }}
      </div>
      <div
        class="status-item"
        :class="{ active: currentTab === 'traded' }"
        @click="switchTab('traded')"
      >
        {{ $t('invitation.traded') }}
      </div>
    </div>
    <van-skeleton v-if="loading" title avatar :row="3" />
    <div v-else class="card-container">
      <div
        class="user-card"
      >
        <van-empty v-if="users.length === 0" :description="t('invite.noData')" />
        <div v-else class="card-body">
          <div v-for="(user, index) in users" :key="index">
            <div class="card-header">
              <div><img :src="user.invitee_avator" class="rd-30px h-40px w-40px"></div>
              <div class="ml-15px">
                <span class="user-id">{{ user.invitee_uid }}</span>
                <div class="font-PingFang-SC text-12px text-[#8B8B8B] font-400 text-left normal-case not-italic">
                  {{ $t('invitation.joinTime') }}：{{ user.joinTime }}
                </div>
              </div>
            </div>
            <div class="info-row">
              <span class="info-label">{{ $t('invitation.invitationCode') }}</span>
              <span class="info-value highlight">{{ user.inviteCode }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{{ $t('invitation.myRebateRate') }}</span>
              <span class="info-value highlight">{{ user.myRebate }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{{ $t('invitation.friendRebateRate') }}</span>
              <span class="info-value highlight">{{ user.friendRebate }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{{ $t('invitation.expectedRebate') }}</span>
              <span class="info-value highlight">{{ user.commission }}</span>
            </div>

            <van-steps
              :active="user.progress - 1"
              active-color="#3E7DFE"
              direction="horizontal"
              class=""
            >
              <template #inactive-icon>
                <div class="demo-custom-icon">
                  <van-icon name="success" />
                </div>
              </template>
              <van-step v-for="(step, idx) in steps" :key="idx" style="color: #3E7DFE">
                {{ step.text }}
              </van-step>
            </van-steps>
            <div class="line" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-status-container {
  margin: 0 auto;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.status-nav {
  display: flex;
  margin-bottom: 16px;
}

.status-item {
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  /* width: 58px; */
  padding: 0 5px;
  margin-right: 12px;
  border-radius: 4px 4px 4px 4px;
}

.status-item.active {
  background: linear-gradient(43deg, #3e7dfe 0%, #1bcc83 100%);
  color: white;
}

.status-item:not(.active) {
  background-color: #f0f0f0;
  color: #333;
}

.card-container {
  display: grid;
  gap: 16px;
}

.user-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 0px 31px 0px;
}

.user-id {
  font-size: 16px;
  font-weight: 500;
}

.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.registered {
  background-color: #1e90ff;
  color: white;
}

.status-tag.activated {
  background-color: #ffa500;
  color: white;
}

.status-tag.traded {
  background-color: #07c160;
  color: white;
}

.card-body {
  position: relative;
  padding: 16px 12px 0 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-label {
  color: #666;
}

.info-value {
  color: #333;
}

.highlight {
  font-weight: bold;
}

.line {
  position: absolute;
  height: 0.5px;
  width: calc(100% - 8px);
  left: 0;
  right: 0;
  padding: 0 4px;
  background-color: #dedede;
  margin: 0 auto 0 auto;
}

.card-body > div:not(:first-child) {
  margin-top: 16px;
}
:deep(.van-steps--horizontal) {
  padding: 0;
}

:deep(.van-step--horizontal:not(.van-step--process)) {
  color: #000 !important; /* 黑色 */
}

:deep(.van-step--horizontal.van-step--process) {
  color: #3e7dfe !important;
}
</style>
