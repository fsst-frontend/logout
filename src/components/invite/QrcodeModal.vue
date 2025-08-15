<script setup lang="ts">
import investment from '@/assets/images/rebate-variety/investment.png'
import { getInviteCodeList } from '@/api/invite'
import QRCode from 'qrcode'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<Props>(), {
  visible: false,
})

const emit = defineEmits(['closeModal'])

const { t } = useI18n()

interface Props {
  visible?: boolean
  url?: string
}

const userInfo: any = computed(() => {
  return JSON.parse(localStorage.getItem('userInfo'))
})

const brand = ref('Futren')

function close() {
  emit('closeModal', false)
}

const inviteData = ref()
async function getData() {
  try {
    const res = await getInviteCodeList()
    inviteData.value = (res.data.invitation_code_list || []).filter(item => item.is_default)[0]
  }
  catch {
    showToast(t('toast.apiError'))
  }
}

const qrCodeData = ref('')
async function getQrCode() {
  try {
    qrCodeData.value = await QRCode.toDataURL(props.url)
  }
  catch {
    showToast(t('toast.qrCodeGenerationFailed'))
  }
}

// 监听 url 变化，只要 url 有值就生成二维码
watch(
  () => props.url,
  (newUrl) => {
    if (newUrl)
      getQrCode()
  },
  { immediate: true }, // 如果初始就有值，立即执行一次
)

onMounted(() => {
  getData()
})
</script>

<template>
  <div class="overlay" @click.self="close">
    <div class="popup-container">
      <div class="avatar-container">
        <img class="avatar" :src="userInfo?.avatar">
      </div>

      <div class="popup">
        <div class="content">
          <div class="username">
            {{ userInfo?.firstName + userInfo?.lastName || '--' }}
          </div>
          <div class="uid">
            UID: {{ userInfo?.id || '--' }}
          </div>
          <div class="intro">
            Hey Bro, {{ t('invite.iAmHere') }} {{ brand }}, {{ t('invite.earnRebateWithMe') }}
          </div>

          <div class="qrcode-wrapper">
            <!-- 四个直角装饰 -->
            <div class="corner corner-tl" />
            <div class="corner corner-tr" />
            <div class="corner corner-bl" />
            <div class="corner corner-br" />

            <img class="qrcode" :src="qrCodeData" alt="QR Code">
          </div>

          <div class="referral-code">
            {{ $t('invite.yourReferralCodeIs') }}: <span class="qrcode-text">{{ inviteData?.code }}</span>
          </div>

          <div class="brand mt-10px flex items-center justify-center">
            <img :src="investment" class="h-16px w-16px">
            <div>{{ brand }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-container {
  position: relative;
  border-radius: 15px;
}

.popup {
  background: linear-gradient(360deg, #ffffff 54%, #cee0ff 100%);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  width: 308px;
}

.avatar-container {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 68px;
  height: 68px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  text-align: center;
}

.username {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0 0;
  color: #333;
}

.uid {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
}

.intro {
  max-width: 165px;
  margin: 0 auto 9px;
  font-family:
    PingFang SC,
    sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: #424e6d;
  line-height: 16px;
  text-align: center;
}

.qrcode-wrapper {
  position: relative;
  width: 164px;
  height: 164px;
  margin: 0 auto;
  padding: 4px;
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

.corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border: 3px solid #3e7dfe;
}

.corner-tl {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.corner-tr {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.corner-bl {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.corner-br {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

.referral-code {
  margin: 20px auto 0;
  background: #e8f0ff;
  width: 180px;
  font-family:
    PingFang SC,
    sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: #424e6d;
  line-height: 20px;
  padding: 0 5px;
  text-align: left;
}

.qrcode-text {
  font-weight: bold;
  color: #3e7dfe;
  font-size: 12px;
  margin-left: 8px;
}

.brand {
  font-family: Inter, Inter;
  font-weight: bold;
  font-size: 12px;
  color: #3e7dfe;
  line-height: 32px;
  text-align: center;
  font-style: normal;
  text-transform: none;
}
</style>
