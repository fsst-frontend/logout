<script setup lang="ts">
import downloadIcon from '@/assets/images/invite/download.png'
import linkIcon from '@/assets/images/invite/link2.png'
import shareIcon from '@/assets/images/invite/share2.png'
import PosterInviteItem from './PosterInviteItem.vue'
import { getInviteCodeList } from '@/api/invite'
import postImg1 from '@/assets/images/invite/post5.png'
import postImg4 from '@/assets/images/invite/post4.png'
import postImg2 from '@/assets/images/invite/post6.png'
import postImg3 from '@/assets/images/invite/post7.png'
import QRCode from 'qrcode'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import jsBridge from '@/utils/jsBridge'
import { useI18n } from 'vue-i18n'
import html2canvas from 'html2canvas'
import { closeToast } from 'vant'

const props = defineProps({
  visible: Boolean,
})

const emits = defineEmits(['update:visible'])

const { t } = useI18n()

const modules = ref([Pagination])

const router = useRouter()
const mySwiper = ref()

const show = computed({
  get: () => props.visible,
  set: val => emits('update:visible', val),
})

const defaultCodeData: any = ref()
const posterRef = ref(null)
const posterRef2 = ref(null)
const posterRef3 = ref(null)

function copy(text) {
  try {
    jsBridge.call('setClipBoardData', {
      text,
    })
    showToast(t('toast.inviteLinkCopySuccess'))
  }
  catch {
    showToast(t('toast.inviteLinkCopyFailed'))
  }
}

const iconsData: any = ref([
  {
    icon: downloadIcon,
    text: t('inviteSetting.downloadPoster'),
    onClick: downloadPosterImg,
  },
  {
    icon: linkIcon,
    text: t('inviteSetting.copyLink'),
    onClick: () => {
      copy(defaultCodeData.value.link)
    },
  },
  {
    icon: shareIcon,
    text: t('inviteSetting.goToInvite'),
    onClick: share,
  },
])

const codeData: any = ref()

const swiperActiveIndex = ref(0)
function updateCurrentIndex(val) {
  swiperActiveIndex.value = val.activeIndex
}

const posterImgs = ref([])

const userInfo: any = computed(() => {
  return JSON.parse(localStorage.getItem('userInfo'))
})

const isChinese = computed(() => {
  return userInfo.value.language_code === 'zh-Hant' || userInfo.value.language_code === 'zh-Hans' || userInfo.value.language === 'zh-Hant' || userInfo.value.language === 'zh-Hans'
})

async function getCodeData() {
  showLoadingToast({
    message: t('inviteSetting.loading'),
    duration: 0, // 不自动关闭
  })
  posterImgs.value.length = 0
  try {
    const res: any = await getInviteCodeList()
    if (res.code === 0) {
      codeData.value = res.data.invitation_code_list
      defaultCodeData.value = res.data.invitation_code_list.filter(item => item.is_default)[0]
      getPosterImg(defaultCodeData.value.link, defaultCodeData.value.code, posterRef.value)
      getPosterImg(defaultCodeData.value.link, defaultCodeData.value.code, posterRef2.value)
      getPosterImg(defaultCodeData.value.link, defaultCodeData.value.code, posterRef3.value)
      closeToast()
    }
    else {
      showToast(t('toast.apiError'))
    }
  }
  catch {
    showToast(t('toast.apiError'))
  }
}

async function goToMore() {
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

async function getPosterImg(link, code, dom) {
  const originalEl = dom
  const cloneEl = originalEl.cloneNode(true)
  cloneEl.classList.remove('hidden-render')

  const textNode = document.createElement('div')
  textNode.innerHTML = `<div style="font-size: 14px; color: #ffffff;"><div>${t('inviteSetting.joinMeInFICFD')}</div><div>${t('inviteSetting.joinLeadingCFDPlatform')}</div><div>${t('inviteSetting.invitationCode')}：${code}</div></div>`
  textNode.style.position = 'absolute'
  textNode.style.left = '10px'
  textNode.style.bottom = '25px'
  cloneEl.appendChild(textNode)

  // 二维码生成
  const qrCodeDataUrl = await QRCode.toDataURL(link)
  const qrImg = document.createElement('img')
  qrImg.src = qrCodeDataUrl
  qrImg.style.position = 'absolute'
  qrImg.style.width = '58px'
  qrImg.style.height = '58px'
  qrImg.style.right = '10px'
  qrImg.style.bottom = '20px'
  cloneEl.appendChild(qrImg)

  document.body.appendChild(cloneEl)
  await nextTick() // 等待渲染

  const canvas = await html2canvas(cloneEl, {
    useCORS: true, // 允许跨域图片
    backgroundColor: null, // 保留透明背景（可选）
  })

  // 最终导出高清图片（保持原比例）
  const dataURL = canvas.toDataURL('image/png')
  posterImgs.value.push(dataURL)

  document.body.removeChild(cloneEl)
}

async function downloadPosterImg() {
  try {
    await jsBridge.call('saveImageToPhotosAlbum', { imgFileStr: posterImgs.value[swiperActiveIndex.value] })
    showToast(t('toast.downloadSuccess'))
  }
  catch {
    showToast(t('toast.downloadFailed'))
  }
}

async function share() {
  await jsBridge.call('systemShareImage', { imgFileStr: posterImgs.value[swiperActiveIndex.value] })
}
</script>

<template>
  <van-action-sheet v-model:show="show" :closeable="false" :style="{ overflow: 'visible' }" @open="getCodeData">
    <div class="content releative">
      <div class="swiper-container h-387px w-456px left-50% top-0 absolute -translate-x-50% -translate-y-[calc(100%_+_25px)]">
        <Swiper
          ref="mySwiper"
          :modules="modules"
          :slides-per-view="2"
          :space-between="10"
          :centered-slides="true"
          class="h-full overflow-visible"
          @slide-change="updateCurrentIndex"
        >
          <SwiperSlide v-for="s in posterImgs" :key="s">
            <img class="rd-15px h-full w-full" :src="s">
          </SwiperSlide>
        </Swiper>
      </div>
      <div class="flex justify-between">
        <div class="text-16px text-#000000 font-600">
          {{ t('inviteSetting.selectRebateRatio') }}
        </div>
        <div class="text-14px text-#2d7aff" style="color: #2d7aff" @click="goToMore">
          {{ t('inviteSetting.settings') }}
        </div>
      </div>
      <div class="mt-14px flex gap-7px whitespace-nowrap overflow-x-auto">
        <PosterInviteItem v-for="item in codeData" :key="item.id" :code-data="item" @change-default="getCodeData" />
      </div>
      <div class="mb-13px flex justify-around">
        <div v-for="(item, index) in iconsData" :key="index" class="mt-15px flex flex-col gap-6px items-center" @click="item.onClick">
          <img :src="item.icon" width="48px" height="48px">
          <div class="text-12px text-#60656d font-500">
            {{ item.text }}
          </div>
        </div>
      </div>
      <div class="text-16px text-#60656d font-600 leading-48px text-center rounded-33px bg-#f7f7f7 h-48px w-345px" style="background-color: #f7f7f7;" @click="() => emits('update:visible', false)">
        {{ t('toast.cancel') }}
      </div>
    </div>
    <div ref="posterRef" class="hidden-render relative">
      <img :src="isChinese ? postImg1 : postImg4" alt="">
      <div class="px-10px text-center w-100% left-50% top-80px absolute" style="transform: translateX(-50%);">
        <div class="text-13px" style="color: #ffffff; line-height: 13px;">
          {{ t('inviteSetting.scanMyQRCode') }}
        </div>
        <div class="text-40px font-bold mb-20px" style="color: #F5BC7C; line-height: 40px;">
          {{ t('inviteSetting.share30Rebate') }}
        </div>
        <div class="text-15px" style="color: #ffffff;  line-height: 15px;">
          {{ t('inviteSetting.unlock100Bonus') }}
        </div>
      </div>
    </div>
    <div ref="posterRef2" class="hidden-render relative">
      <img :src="postImg2" alt="">
      <div class="px-10px text-center w-100% left-50% top-80px absolute" style="color: #FEECB7; transform: translateX(-50%);">
        <div class="text-40px font-bold mb-20px" style="line-height: 40px;">
          {{ t('inviteSetting.inviteToTrade') }}
        </div>
        <div class="text-18px" style="line-height: 18px;">
          {{ t('inviteSetting.signupBonus') }}
        </div>
      </div>
    </div>
    <div ref="posterRef3" class="hidden-render relative">
      <img :src="postImg3" alt="">
      <div class="px-10px text-center w-100% left-50% top-70px absolute" style="transform: translateX(-50%);">
        <div class="text-14px" style="color: #ffffff; line-height: 14px;">
          {{ t('inviteSetting.earnByInviting') }}
        </div>
        <div class="text-40px font-bold mb-20px" style="color: #3E7DFE; line-height: 40px;">
          {{ t('inviteSetting.upTo30PercentRebate') }}
        </div>
        <div class="text-14px" style="color: #ffffff; line-height: 14px;">
          {{ t('inviteSetting.referralRewardDesc') }}
        </div>
      </div>
    </div>
  </van-action-sheet>
</template>

<style scoped>
.content {
  padding: 16px 16px 0;
}
.qrcode {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #999;
}
/* Swiper 容器样式 */
.swiper-container {
  width: 530px;
  height: 400px;
}

/* 幻灯片样式 */
.swiper-slide {
  text-align: left;
  font-size: 18px;

  /* 居中内容 */
  display: flex;
  justify-content: center;
  align-items: center;

  transition: transform 300ms;
  transform: scale(0.8);
}

/* 活动幻灯片样式 */
.swiper-slide-active,
.swiper-slide-duplicate-active {
  transform: scale(1);
}

/* 分页器样式 */
.swiper-pagination {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
}

.hidden-render {
  position: fixed !important;
  top: -9999px !important;
  left: -9999px !important;
  width: auto !important;
  height: auto !important;
  opacity: 0 !important;
  pointer-events: none !important;
  z-index: -9999 !important;
}
</style>
