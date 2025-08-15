<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { getFlowListApi } from '@/api/partner'
import dayjs from 'dayjs'
import income from '@/assets/images/icons/income.png'
import expenses from '@/assets/images/icons/expenses.png'
import gonggao from '@/assets/images/icons/gonggao.png'
import arrow_down from '@/assets/images/icons/arrow_down.png'

const route = useRoute()

const img = {
  income,
  expenses,
}

const timePopupVisible = ref(false)

const loading = ref(false)
const currentTab = ref('全部') // '全部', '收入', '支出'
const currentDate = ref<string[]>([
  dayjs().format('YYYY'),
  dayjs().format('MM'),
])
const flowList = ref<any[]>([])

const formatDate = computed(() => {
  return `${currentDate.value[0]}.${currentDate.value[1]}月`
})

watch([currentDate, currentTab], getFlowList)

onMounted(() => {
  getFlowList()
})

async function getFlowList() {
  loading.value = true
  try {
    const res = await getFlowListApi({
      uid: route.query.uid,
      flow_filter:
        currentTab.value === '全部'
          ? 'all'
          : currentTab.value === '收入'
            ? 'income'
            : 'expenses',
      start_time: dayjs(`${currentDate.value[0]}-${currentDate.value[1]}-01`).startOf('month').unix(),
    })
    flowList.value = res.data.flows
  }
  catch (error) {
    showToast(`获取流水失败: ${error}`)
  }
  finally {
    loading.value = false
  }
}

function comfirm(v) {
  timePopupVisible.value = false
  currentDate.value = v.selectedValues
}
</script>

<template>
  <FullPageView :style="{ backgroundColor: '#F7F7F7' }">
    <template #header>
      <NavBar icon-color="black" :style="{ backgroundColor: 'white' }">
        <div class="flex w-full j-c">
          用户明细
        </div>
      </NavBar>
    </template>
    <div class="text-14px text-#3E7DFE line-height-7.5 mx-15px mt-8px px-14px rounded-8px bg-#DBE6FC flex h-30px a-c">
      <img class="mr-2 w-4" :src="gonggao"> 这里展示已经邀请注册成功的用户
    </div>
    <div class="m-15px flex j-b">
      <Tabs :list="['全部', '收入', '支出']" @change="currentTab = ['全部', '收入', '支出'][$event]" />
      <div class="text-12px flex a-c" @click="timePopupVisible = true">
        {{ formatDate }}
        <img class="h-8px w-10px block" :src="arrow_down">
      </div>
    </div>

    <div v-loading="loading" class="mx-3 px-10px rounded-10px bg-white overflow-auto">
      <div v-if="!flowList.length" class="flex j-c">
        暂无数据
      </div>
      <div v-for="(i) in flowList" :key="i" class="van-hairline--bottom py-5">
        <div class="flex gap-2 a-c">
          <img class="h-28px w-28px block" :src="i?.amount > 0 ? img.income : img.expenses">
          <div class="flex-1">
            <div class="flex j-b">
              <div>
                {{
                  i?.flow_type === 'deposit'
                    ? '好友入金获利'
                    : i?.flow_type === 'close_order'
                      ? '好友平仓成功获利'
                      : i?.flow_type === 'withdrawal'
                        ? '提现'
                        : '--'
                }}
              </div>
              <div class="text-#2B2B2E font-700">
                {{ i?.amount || '--' }}
              </div>
            </div>
          </div>
        </div>
        <div class="mb- text-12px text-#8B8B8B ml-9 mt-2">
          <div>收益来源 {{ i?.user_id || '--' }}</div>
          <div>{{ i?.created_at || '--' }}</div>
        </div>
      </div>
    </div>
    <VanPopup v-model:show="timePopupVisible" round position="bottom">
      <van-date-picker
        :model-value="currentDate"
        :columns-type="['year', 'month']"
        title="选择年月"
        @confirm="comfirm"
        @cancel="timePopupVisible = false"
      />
    </VanPopup>
  </FullPageView>
</template>

<style scoped></style>
