<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import bg from '@/assets/images/invite/bg.png'
import link from '@/assets/images/invite/link.png'
import posters from '@/assets/images/invite/posters.png'
import qrcode from '@/assets/images/invite/qrcode.png'
import share from '@/assets/images/invite/share.png'
import edit from '@/assets/images/invite/edit.png'
import FAQ from '@/components/FAQ.vue'
import FriendStep from '@/components/invite/FriendStep.vue'
import TabSwitch from '@/components/ArcTabs.vue'
import AvatarPopup from '@/components/invite/QrcodeModal.vue'
import { getPartnerSummary } from '@/api/invite'

const Invitation = defineAsyncComponent(() => import('@/components/invite/Invitation.vue'))
const Rebate = defineAsyncComponent(() => import('@/components/invite/Rebate.vue'))
const Record = defineAsyncComponent(() => import('@/components/invite/Record.vue'))
const Overview = defineAsyncComponent(() => import('@/components/invite/Overview.vue'))

const showPopup = ref(false)
const shareOptions = [
  {
    id: 1,
    img: posters,
    text: '海报邀请',
  },
  {
    id: 2,
    img: qrcode,
    text: '二维码邀请',
    onClick: () => {
      showPopup.value = true
    },
  },
  {
    id: 3,
    img: link,
    text: '链接邀请',
  },
  {
    id: 4,
    img: share,
    text: '更多分享',
  },
]

const faqList = [
  {
    question: '谁可以发起邀请?',
    answer: 'Futren APP用户。',
  },
  {
    question: '谁可以接受邀请?',
    answer: '没有注册Future Invest App的用户。',
  },
  {
    question: '如何判断邀请关系是否成立?',
    answer: '你作为邀请人，将在"Futren App-我的-邀请有礼-邀请好友邀请规模"界面中看到新增的受邀好友信息。',
  },
  {
    question: '如何确定我的受邀人体验交易体验券的进度?',
    answer: '可在"Futren App-我的-邀请有礼-团队成员-全部"界面只能查询受邀人进度明细，查询相关受邀人体验进度。',
  },
]

const activeTab = ref('overview')

const tabList = [
  { name: 'overview', label: '我的总览' },
  { name: 'invitation', label: '我的邀请' },
  { name: 'rebate', label: '我的返佣' },
  { name: 'record', label: '回赠记录' },
]

const components = {
  overview: Overview,
  invitation: Invitation,
  rebate: Rebate,
  record: Record,
}

const currentComponent = computed(() => components[activeTab.value])

const isUserInfo = computed(() => {
  const userInfo = localStorage.getItem('userInfo')
  return userInfo !== null && userInfo !== 'null' && userInfo !== ''
})

const overviewData = reactive<any>({})
const currentProps = computed(() => {
  switch (activeTab.value) {
    case 'overview': return overviewData
    default: return {}
  }
})

export interface PartnerSummary {
  user_id: number
  total_commission_amount: string
  max_rebate_ratio: string
  invitation_return_ratio: string
  invitation_rebate_ratio: string
  total_sub_count: number
  total_sub_active_count: number
  total_sub_trader_count: number
  invitation_code: string
  invitation_link: string
}

function getPartnerSummaryApi() {
  getPartnerSummary().then((response) => {
    const res: PartnerSummary = response.data
    Object.assign(overviewData, res)
  })
}

function showModal(item) {
  if (item.onClick && typeof item.onClick === 'function') {
    item.onClick() // 执行点击回调
  }
}

onMounted(() => {
  getPartnerSummaryApi()
})
</script>

<template>
  <FullPageView>
    <template #header>
      <NavBar icon-color="white" :style="{ backgroundColor: '#060F24' }">
        <div class="text-white flex w-full j-c">
          好友邀请
        </div>
        <template #right>
          <span class="text-[14px] text-white">活动规则</span>
        </template>
      </NavBar>
    </template>
    <div class="relative">
      <div class="relative -mt-[44px]">
        <img :src="bg" alt="邀请背景" class="h-auto w-full object-contain">
        <div class="flex left-0 right-0 top-55px justify-center absolute">
          <div class="text-center">
            <div class="text-[18px] text-#F7F7F7 leading-none">
              邀好友可赚取
            </div>
            <div class="text-[40px] text-#1BCC83 font-900 leading-none pt-3px">
              高达30%返佣
            </div>
            <div class="text-[12px] text-#F7F7F7 pt-3px">
              邀請好友注册并交易，即可获得交易返佣奖励
            </div>
          </div>
        </div>
      </div>
      <div class="text-white px-26px py-20px rounded-b-14px bg-#212745 flex h-auto min-h-[145px] w-full justify-between relative z-10">
        <div v-for="(item, index) in shareOptions" :key="index" class="flex flex-col" @click="showModal(item)">
          <div><img :src="item.img" class="h-48px w-48px"></div>
          <div class="text-[12px]">
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
    <div class="relative z-20 -mt-50px">
      <div class="bili mx-auto px-15px py-17px rounded-8px w-[calc(100%-30px)] shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex">
            <div class="font-PingFang-SC text-16px text-#2B2B2E font-bold font-normal leading-19px text-left normal-case">
              返佣比例
            </div>
            <div class="ml-4px">
              <img :src="edit" class="h-20px w-20px">
            </div>
          </div>
          <div class="font-PingFang-SC text-12px text-#1B347D font-medium font-normal leading-12px text-left normal-case">
            解锁更高返佣
          </div>
        </div>
        <div class="bg-gradient-to-t pt-16px rounded-8px flex relative from-[#F2F8FF] to-[#DCE3FF]">
          <div class="text-center flex-1 relative">
            <div class="font-PingFang-SC text-12px font-medium leading-[1.5]">
              我的返佣金比例
            </div>
            <div class="font-PingFang-SC text-24px color-#3E7DFE font-bold mt-4px">
              25%
            </div>
            <div class="bg-#DEE5FF bg-opacity-50 h-60px w-2px transform right-0 top-1/2 absolute -translate-y-1/2" />
          </div>
          <div class="text-center flex-1">
            <div class="font-PingFang-SC text-12px font-medium leading-[1.5]">
              好友回馈比例
            </div>
            <div class="font-PingFang-SC text-24px color-#3E7DFE font-bold mt-4px">
              10%
            </div>
          </div>
        </div>
        <div v-if="isUserInfo" class="mt-16px flex justify-center">
          <div class="button">
            登录/注册
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isUserInfo" class="mt-9px">
      <TabSwitch
        v-model:active-tab="activeTab"
        :tab-list="tabList"
      />
      <div class="px-15px py-17px">
        <component :is="currentComponent" v-bind="currentProps" />
      </div>
    </div>
    <div v-else class="px-15px">
      <FriendStep />
    </div>
    <FAQ
      v-if="activeTab === 'overview'"
      :faq-data="faqList"
      title="常见问题"
    />
  </FullPageView>

  <AvatarPopup
    v-model:visible="showPopup"
    avatar-url="https://pic4.zhimg.com/v2-d8a3935ec8ce645188d950462eb55ccf_r.jpg"
    username="小赢家"
    uid="456789"
    brand="Future Pro"
    referral-code="ABCD1234"
  />
</template>

<style scoped lang="less">
.bili {
  background: linear-gradient(360deg, #f2f8ff 0%, #dce3ff 100%);
}
.button {
  width: 264px;
  height: 42px;
  background: linear-gradient(265deg, #1bcc83 0%, #3e7dfe 100%);
  border-radius: 26px 26px 26px 26px;
  border: 1px solid;
  border-image: linear-gradient(180deg, rgba(247, 247, 247, 0.5), rgba(247, 247, 247, 0.7)) 1 1;
  text-align: center;
  line-height: 40px;
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
}
</style>
