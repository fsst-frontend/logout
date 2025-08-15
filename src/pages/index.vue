<script setup lang="ts">
import { STORAGE_DEVICE_ID_KEY, STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import { defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import bgcn from '@/assets/images/invite/bgcn.png'
import bgncn from '@/assets/images/invite/bgncn.png'
import link from '@/assets/images/invite/link.png'
import posters from '@/assets/images/invite/posters.png'
import qrcode from '@/assets/images/invite/qrcode.png'
import share from '@/assets/images/invite/share.png'
import edit from '@/assets/images/invite/edit.png'
import FAQ from '@/components/FAQ.vue'
import FriendStep from '@/components/invite/FriendStep.vue'
import TabSwitch from '@/components/ArcTabs.vue'
import AvatarPopup from '@/components/invite/QrcodeModal.vue'
import { getPartnerSummary, isTrader } from '@/api/invite'
import { useRoute, useRouter } from 'vue-router'
import jsBridge from '@/utils/jsBridge'
import PosterInvitePopup from '@/components/invite/PosterInvitePopup.vue'
import { useStorage } from '@vueuse/core'
import TipsModal from '@/components/TipsModal.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const Invitation = defineAsyncComponent(() => import('@/components/invite/Invitation.vue'))
const Rebate = defineAsyncComponent(() => import('@/components/invite/Rebate.vue'))
const Record = defineAsyncComponent(() => import('@/components/invite/Record.vue'))
const Overview = defineAsyncComponent(() => import('@/components/invite/Overview.vue'))

const showPopup = ref(false)
const showPosterPopup = ref(false)
const showTipsModal = ref(false)

const overviewData = reactive<any>({})

const shareOptions = [
  {
    id: 1,
    img: posters,
    text: t('invite.posterInvitation'),
    onClick: () => {
      showPosterPopup.value = true
    },
  },
  {
    id: 2,
    img: qrcode,
    text: t('invite.QRCodeInvitation'),
    onClick: () => {
      showPopup.value = true
    },
  },
  {
    id: 3,
    img: link,
    text: t('invite.LinkInvitation'),
    onClick: () => {
      copy(overviewData.invitation_link)
    },
  },
  {
    id: 4,
    img: share,
    text: t('invite.MoreSharing'),
    onClick: () => {
      handleShare(overviewData.invitation_link)
    },
  },
]

const faqList = [
  {
    question: t('invite.whoCanInitiateInvitation'),
    answer: t('invite.initiatorCondition'),
  },
  {
    question: t('invite.whoCanAcceptInvitation'),
    answer: t('invite.acceptorCondition'),
  },
  {
    question: t('invite.howToConfirmInvitationRelationship'),
    answer: t('invite.invitationRelationshipDescription'),
  },
  {
    question: t('invite.howToTrackInviteeProgress'),
    answer: t('invite.inviteeProgressDescription'),
  },
]

const activeTab = ref('overview')

const tabList = [
  { name: 'overview', label: t('invite.MyOverview') },
  { name: 'invitation', label: t('invite.MyInvitation') },
  { name: 'rebate', label: t('invite.MyRebate') },
  { name: 'record', label: t('invite.RebateRecord') },
]

const components = {
  overview: Overview,
  invitation: Invitation,
  rebate: Rebate,
  record: Record,
}

const currentComponent = computed(() => components[activeTab.value])

const userInfo: any = useStorage('userInfo', {}) // 自动响应式

const isChinese = computed(() => {
  const userInfoVal = userInfo.value
  return userInfoVal
    && (userInfoVal.language_code === 'zh-Hant'
      || userInfoVal.language_code === 'zh-Hans'
      || userInfoVal.language === 'zh-Hant'
      || userInfoVal.language === 'zh-Hans')
})

// const isLogin = computed(() => {
//   return userInfo.value.id && userInfo.value.id > 0
// })
const isLogin = ref(false)
watch(userInfo.value, (newVal) => {
  isLogin.value = newVal.id && newVal.id > 0
}, { immediate: true, deep: true })

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

const qrCodeData = ref('')

function getPartnerSummaryApi() {
  if (!isLogin.value)
    return
  getPartnerSummary().then((response) => {
    const res: PartnerSummary = response.data
    Object.assign(overviewData, res)
    qrCodeData.value = res.invitation_link
  })
}

async function goToLogin() {
  try {
    await jsBridge.call('open', {
      router: '/login',
    })
  }
  catch {
    router.push('/polymer/login')
  }
}

function showModal(item) {
  if (item.onClick && typeof item.onClick === 'function') {
    if (userInfo.value.id && userInfo.value.id > 0) {
      // 表示已登录
      item.onClick() // 执行点击回调
    }
    else {
      goToLogin()
    }
  }
}

async function toRebateVariety() {
  if (!(userInfo.value.id && userInfo.value.id > 0)) {
    goToLogin()
    return
  }
  try {
    await jsBridge.call('open', {
      router: '/web',
      link: `${window.__APP_CONFIG__.H5_BASE_HOST}/partner/#/rebate-variety`,
    })
  }
  catch {
    router.push('/rebate-variety')
  }
}

async function goToRule() {
  try {
    await jsBridge.call('open', {
      router: '/web',
      link: `${window.__APP_CONFIG__.H5_BASE_HOST}/partner/#/rule`,
    })
  }
  catch {
    router.push('/rule')
  }
}

async function toInviteSetting() {
  if (!(userInfo.value.id && userInfo.value.id > 0)) {
    goToLogin()
    return
  }
  try {
    await jsBridge.call('open', {
      router: '/web',
      link: `${window.__APP_CONFIG__.H5_BASE_HOST}/partner/#/invite-setting`,
    })
  }
  catch {
    router.push('/invite-setting')
  }
}

function copy(text) {
  try {
    navigator.clipboard.writeText(text)
    showToast(t('toast.inviteLinkCopySuccess'))
  }
  catch (e) {
    showToast(e || t('toast.inviteLinkCopyFailed'))
  }
}

const backgroundImage = computed(() => {
  return isChinese.value ? bgcn : bgncn
})

const getBg = computed(() => {
  return {
    backgroundColor: '#111526',
  }
})

async function handleBack() {
  try {
    await jsBridge.call('close')
  }
  catch {
    router.back()
  }
}

async function handleShare(link) {
  await jsBridge.call('more', {
    shareLink: link,
    shareTypes: [7, 0, 1, 5], // 操作按钮
  })
}

async function closeModal() {
  showPopup.value = false
}

async function goToTrader() {
  try {
    await jsBridge.call('open', {
      router: '/web',
      link: window.__APP_CONFIG__.H5_BASE_HOST.replace(/\/[^/]*$/, '/davmu/documentary/detail/management'),
    })
  }
  catch {
    showToast(t('toast.redirectFailed'))
  }
}

async function handleMoreHigh() {
  if (!(userInfo.value.id && userInfo.value.id > 0)) {
    goToLogin()
    return
  }
  isTrader().then((res) => {
    if (res.data.is_signal_provider || res.data.is_take_exam) {
      goToTrader()
    }
    else {
      showTipsModal.value = true
    }
  })
}

onMounted(() => {
  getPartnerSummaryApi()
  if (route.query.showPoster === '1') {
    showPosterPopup.value = true
  }
  jsBridge.on('pageWillAppear', async () => {
    try {
      const res = await jsBridge.call('getUserInfo')

      if (res) {
        userInfo.value = res
        localStorage.setItem('userInfo', JSON.stringify(res))
        isLogin.value = true
      }

      res?.token && localStorage.setItem(STORAGE_TOKEN_KEY, res.token)
      res?.device_id && localStorage.setItem(STORAGE_DEVICE_ID_KEY, res.device_id)
    }
    catch (error) {
      console.error('客户端回调错误', error)
    }
    finally {
      getPartnerSummaryApi()
    }
  })
})
</script>

<template>
  <FullPageView :style="getBg">
    <template #header>
      <NavBar icon-color="white" @back="handleBack">
        <template #right>
          <span class="text-[14px] text-white cursor-pointer" @click="goToRule">{{ $t('invite.activityRules') }}</span>
        </template>
      </NavBar>
    </template>
    <div class="relative">
      <div class="relative -mt-[44px]">
        <img :src="backgroundImage" class="h-auto w-full object-contain">
        <div class="flex left-0 right-0 top-55px justify-center absolute">
          <div class="text-center">
            <div class="text-[18px] text-#F7F7F7 leading-none lh-1em" style="color: #F7F7F7;">
              {{ $t('invite.inviteFriendsToEarn') }}
            </div>
            <div class="text-[40px] text-#1BCC83 font-900 leading-none lh-1em pt-3px" style="color:#1BCC83">
              {{ $t('invite.upTo30Rebate') }}
            </div>
            <div class="text-[12px] text-#F7F7F7 lh-1em px-20px pt-3px text-center" style="color: #F7F7F7;">
              {{ $t('invite.InviteFriendsToRegisterAndTradeAndYouCanGetTradingRebateRewards') }}
            </div>
          </div>
        </div>
      </div>
      <div class="text-#D5D7DC px-26px py-7px rounded-b-14px bg-#212745 flex h-auto min-h-[145px] w-full justify-between relative z-10" style="background-color: #212745; color: #D5D7DC">
        <div v-for="(item, index) in shareOptions" :key="index" class="flex flex-col items-center" @click="showModal(item)">
          <div><img :src="item.img" class="h-48px w-48px"></div>
          <div class="text-[12px] lh-1em text-center">
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
    <div class="bg-#f7f7f7" style="background-color: #f7f7f7;">
      <div class="relative z-20 -mt-50px">
        <div class="bili mx-auto px-15px py-17px rounded-8px w-[calc(100%-30px)] shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex">
              <div class="font-PingFang-SC text-16px text-#2B2B2E font-bold leading-19px text-left normal-case" style="color: #2B2B2E">
                {{ $t('invite.RebateRatio') }}
              </div>
              <div class="ml-4px" @click="toInviteSetting">
                <img :src="edit" class="h-20px w-20px">
              </div>
            </div>
            <div class="font-PingFang-SC text-12px text-#1B347D font-medium font-normal leading-12px text-left normal-case" style="color: #1B347D" @click="handleMoreHigh">
              {{ $t('invite.UnlockHigherRebates') }}
            </div>
          </div>
          <div class="bg-gradient-to-t pt-16px rounded-8px flex relative from-#F2F8FF to-#DCE3FF">
            <div class="text-center flex-1 relative">
              <div class="font-PingFang-SC text-12px font-medium leading-[1.5]">
                {{ $t('invite.MyCommissionRate') }}
                <van-icon name="info-o" @click="toRebateVariety" />
              </div>
              <div class="font-PingFang-SC text-24px color-#3E7DFE font-bold mt-4px" style="color: #3E7DFE">
                {{ isLogin ? (Math.round(overviewData.invitation_rebate_ratio * 100) || 100) : '--' }}%
              </div>
              <div class="bg-#DEE5FF bg-opacity-50 h-60px w-2px transform right-0 top-1/2 absolute -translate-y-1/2" style="background-color: #DEE5FF;" />
            </div>
            <div class="text-center flex-1">
              <div class="font-PingFang-SC text-12px font-medium leading-[1.5]">
                {{ $t('invite.FriendFeedbackRatio') }}
              </div>
              <div class="font-PingFang-SC text-24px color-#3E7DFE font-bold mt-4px" style="color: #3E7DFE">
                {{ isLogin ? (Math.round(overviewData.invitation_return_ratio * 100) || 0) : '--' }}%
              </div>
            </div>
          </div>
          <div v-if="!isLogin" class="mt-16px flex justify-center">
            <div class="button" @click="goToLogin">
              {{ $t('invite.LoginRegister') }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="isLogin" class="mt-9px bg-#ffffff" style="background-color: #ffffff;">
        <TabSwitch
          v-model:active-tab="activeTab"
          :tab-list="tabList"
        />
        <div class="px-15px py-17px" :class="[activeTab !== 'overview' ? 'min-h-337px' : '']">
          <KeepAlive>
            <component :is="currentComponent" v-bind="currentProps" />
          </KeepAlive>
        </div>
      </div>
      <div v-else class="px-15px bg-#f7f7f7" style="background-color: #f7f7f7;">
        <FriendStep />
      </div>
    </div>
    <FAQ
      v-if="activeTab === 'overview'"
      class="bg-#f7f7f7"
      style="background-color: #f7f7f7;"
      :faq-data="faqList"
      :title="$t('invite.FrequentlyAskedQuestions')"
    />
  </FullPageView>

  <AvatarPopup
    v-if="showPopup"
    :url="overviewData.invitation_link"
    @close-modal="closeModal"
  />

  <PosterInvitePopup v-model:visible="showPosterPopup" />
  <TipsModal v-model:visible="showTipsModal" />
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
.navbar {
  color: #fff;
  background-image: url('@/assets/images/invite/bg.png');
}
</style>
