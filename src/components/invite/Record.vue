<script setup>
import { ref } from 'vue'
import { getMySubTraderReturnRecordList, getMyTraderReturnRecordList } from '@/api/invite.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentTab = ref('registered')

const users = ref([])
const loading = ref(false)

function switchTab(tab) {
  loading.value = true
  currentTab.value = tab
  const params = {}
  if (currentTab.value === 'registered') {
    getMySubTraderReturnRecordList(params).then((res) => {
      users.value = (res.data.record_list || []).map((item) => {
        item.joinTime = new Date(item.create_time * 1000).toLocaleString()
        item.myRebate = `${item.rebate_ratio * 100}%`
        item.commission = `${item.rebate_amount} USD`
        item.tradeDetails = {
          tradeNumber: item.order_no,
          tradePair: item.symbol,
          tradeType: item.symbol_group,
          tradeVolume: item.lot_size,
          spreadCost: item.spread_amount,
          rebateRate: `${item.return_ratio * 100}%`,
          rebateAmount: `${item.return_amount} USD`,
        }
        return item
      })
    }).finally(() => {
      loading.value = false
    })
  }
  else {
    getMyTraderReturnRecordList(params).then((res) => {
      users.value = (res.data.record_list || []).map((item) => {
        item.joinTime = new Date(item.create_time * 1000).toLocaleString()
        item.myRebate = `${item.rebate_ratio * 100}%`
        item.commission = `${item.rebate_amount} USD`
        item.tradeDetails = {
          tradeNumber: item.order_no,
          tradePair: item.symbol,
          tradeType: item.symbol_group,
          tradeVolume: item.lot_size,
          spreadCost: item.spread_amount,
          rebateRate: `${item.return_ratio * 100}%`,
          rebateAmount: `${item.return_amount} USD`,
        }
        return item
      })
    }).finally(() => {
      loading.value = false
    })
  }
}

onMounted(() => {
  switchTab(currentTab.value)
})
</script>

<template>
  <div class="user-status-container">
    <!-- 状态标签导航 -->
    <div class="status-nav">
      <div
        class="status-item"
        :class="{ active: currentTab === 'registered' }"
        @click="switchTab('registered')"
      >
        {{ $t('rebate.returned') }}
      </div>
      <div
        class="status-item"
        :class="{ active: currentTab === 'activated' }"
        @click="switchTab('activated')"
      >
        {{ $t('rebate.obtained') }}
      </div>
      <!-- <div
        class="status-item"
        :class="{ active: currentTab === 'traded' }"
        @click="switchTab('traded')"
      >
        {{ $t('rebate.pendingIssuance') }}
      </div> -->
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
              <div class="flex">
                <div><img :src="user.avatar" class="rd-30px h-40px w-40px"></div>
                <div class="ml-15px">
                  <span class="user-id">{{ user.user_id }}</span>
                  <div class="font-PingFang-SC text-12px text-[#8B8B8B] font-400 text-left normal-case not-italic">
                    {{ user.joinTime }}
                  </div>
                </div>
              </div>
              <div class="text-[12px] color-[#16C000] leading-[20px] px-8px rounded-4px bg-[#EBF7ED] h-20px w-52px">
                {{ user.status ? $t('rebate.issued') : $t('rebate.pendingIssuance') }}
              </div>
            </div>

            <div class="info-row">
              <span class="info-label">{{ $t('rebate.transactionNumber') }}</span>
              <span class="info-value highlight">{{ user.tradeDetails.tradeNumber }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{{ $t('rebate.tradingProduct') }}</span>
              <span class="info-value highlight">{{ user.tradeDetails.tradePair }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{{ $t('rebate.productType') }}</span>
              <span class="info-value highlight">{{ user.tradeDetails.tradeType }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{{ $t('rebate.tradingLots') }}</span>
              <span class="info-value highlight">{{ user.tradeDetails.tradeVolume }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{{ $t('rebate.spreadCost') }}</span>
              <span class="info-value highlight">{{ user.tradeDetails.spreadCost }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{{ $t('rebate.returnRate') }}</span>
              <span class="info-value highlight">{{ user.tradeDetails.rebateRate }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{{ $t('rebate.expectedRebate') }}</span>
              <span class="info-value highlight">{{ user.tradeDetails.rebateAmount }}</span>
            </div>
            <div v-if="index !== users.length - 1" class="line" />
            <div v-if="index !== users.length - 1" class="pb-16px" />
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

/* 用户卡片样式 */
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
  justify-content: space-between;
  align-items: flex-start;
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
</style>
