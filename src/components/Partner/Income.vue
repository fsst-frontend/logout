<script setup lang='tsx'>
import { getIncomeApi, postWithdrawApi } from '@/api/partner'
import { showLoadingToast, showToast } from 'vant'
import { useRouter } from 'vue-router'
import jsBridge from '@/utils/jsBridge'

const emits = defineEmits(['inviteCode'])
const router = useRouter()
// 接口返回
const loading = ref(false)
const income = ref<any>({})
const showPopup = ref(false)
const amount = ref('')
const compIncome = computed(() => {
  return [
    {
      title: '全部下级',
      num: income.value?.subordinate_count || 0,
      more: '查看全部＞',
      fn: () => {
        router.push('/sub')
      },
    },
    {
      title: '跟单用户',
      num: income.value?.follow_user_count || 0,
      more: '查看全部＞',
      fn: () => {
        const sp_id = income.value.sp_id
        showLoadingToast({
          message: '加载中...',
        })
        window.location.href = window.__APP_CONFIG__.H5_BASE_HOST.replace(/\/[^/]*$/, `/davmu/documentary/detail/management?sp_id=${sp_id}&isPartner=true`)
      },
    },
    {
      title: '当前收益',
      num: income.value?.current_revenue || 0,
      currency: 'USD',
      more: '申请提现＞',
      fn: () => {
        showPopup.value = true
        // this.goToAppWallet()
      },
    },
    {
      title: '总收益',
      num: income.value?.total_revenue || 0,
      currency: 'USD',
      more: '累计提现＞',
      fn: () => {
        goToAppWallet()
      },
    },
    {
      title: '分佣收益',
      num: income.value?.commissioned || 0,
      currency: 'USD',
      more: '查看明细＞',
      fn: () => {
        router.push({
          path: '/detail/more',
          query: {
            uid: income.value?.uid,
          },
        })
      },
    },
    {
      title: '分润收益',
      num: income.value?.profit || 0,
      currency: 'USD',
      more: '查看明细＞',
      fn: () => {
        goToAppWallet()
      },
    },
  ]
})

async function goToAppWallet() {
  try {
    await jsBridge.call('open', {
      router: '/mine/wallet',
      type: 0,
    })
  }
  catch (error) {
    showToast(`跳转钱包失败${error}`)
  }
}

async function getIncome() {
  loading.value = true
  try {
    const res = await getIncomeApi()
    income.value = res.data.info
    emits('inviteCode', res.data.info?.code || '')
  }
  catch (error) {
    showToast(`获取收益失败${error}`)
  }
  finally {
    loading.value = false
  }
}

async function withdrawal() {
  if (!amount.value) {
    showToast('请输入提现金额')
    return
  }
  try {
    await postWithdrawApi({
      amount: amount.value,
    })
    showToast('提现成功')
    getIncome()
  }
  catch (error) {
    showToast(`提现失败${error}`)
  }
  finally {
    showPopup.value = false
  }
}

onMounted(() => {
  getIncome()
})
</script>

<template>
  <div v-loading="loading" class="px-7px py-10px rounded-6px bg-white">
    <div class="text-#80572A mb-8px px-10px">
      我的收益
    </div>
    <div class="px-22px pb-10px pt-20px rounded-6px bg-#FFF7E6">
      <div class="gap-20px grid grid-cols-3">
        <div v-for="(i, index) in compIncome" :key="index">
          <div class="text-12px text-#A06A38">
            {{ i.title }}
          </div>
          <div class="text-#E6A262 font-700 line-height-30px mt-1 h-30px" @click="i.fn">
            <span
              :style="{
                fontSize: String(i.num).length <= 3 ? '30px' : `${(4 / String(i.num).length) * 30}px`,
              }"
            >
              {{ i.num }}
            </span>
            <span
              :style="{
                fontSize: String(i.num).length <= 3 ? '16px' : `${(4 / String(i.num).length) * 16}px`,
              }"
            >{{ i.currency }}</span>
          </div>
        </div>
      </div>
    </div>
    <VanPopup v-model:show="showPopup" round @close="amount = ''">
      <div class="h-180px w-300px overflow-hidden">
        <div class="van-hairline--bottom h-112px">
          <div class="text-20px text-#2b2b2e line-height-20px mt-23px text-center">
            提现金额
          </div>
          <div class="mt-25px px-20px flex gap-10px a-c">
            <div>提现金额</div>
            <div class="input-outer w-140px">
              <van-field v-model="amount" type="number" class="p-4px b-1 b-#e2e2e2 rounded-3px b-solid w-151px" placeholder="请输入提现金额" />
            </div>
            <div class="text-#3E7DFE" @click="amount = income?.current_revenue">
              全部
            </div>
          </div>
        </div>
        <div class="flex h-44px a-c">
          <div class="text-#8B8B8B text-center w-50%" @click="showPopup = false">
            取消
          </div>
          <div class="van-hairline--left text-#3E7DFE flex h-full w-50% a-c j-c" @click="withdrawal">
            确认
          </div>
        </div>
      </div>
    </VanPopup>
  </div>
</template>

<style scoped lang="less">
.input-outer {
  div {
    padding: 4px !important;
  }
}
</style>
