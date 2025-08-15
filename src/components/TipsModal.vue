<script setup lang="ts">
import investment from '@/assets/images/invite/jiaoyi-icon.png'
import jsBridge from '@/utils/jsBridge'
import { useI18n } from 'vue-i18n'

withDefaults(defineProps<Props>(), {
  avatarUrl: investment,
  username: '大赢家',
  uid: '123127',
  brand: 'Futren',
  referralCode: 'YTREU7SD',
})

const emit = defineEmits(['update:visible'])

const { t } = useI18n()

interface Props {
  visible: boolean
  avatarUrl?: string
  username?: string
  uid?: string
  brand?: string
  referralCode?: string
}

function close() {
  emit('update:visible', false)
}

async function goToTrader() {
  try {
    await jsBridge.call('open', {
      router: '/web',
      link: window.__APP_CONFIG__.H5_BASE_HOST.replace(/\/[^/]*$/, '/davmu/exam/traderExamIntro'),
    })
  }
  catch {
    showToast(t('toast.redirectFailed'))
  }
}
</script>

<template>
  <div v-if="visible" class="overlay" @click.self="close">
    <div class="popup-container">
      <div class="avatar-container">
        <img class="avatar" :src="avatarUrl">
      </div>

      <div class="popup">
        <div class="content">
          <div class="title">
            {{ t('toast.areYouTrader') }}
          </div>
          <div class="des">
            {{ t('toast.traderProgramDescription') }}
          </div>
          <div class="button-container">
            <div class="button" @click="goToTrader">
              {{ t('toast.joinNow') }}
            </div>
            <div class="cancel" @click="close">
              {{ t('toast.cancel') }}
            </div>
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
  overflow: hidden;
  width: 139px;
  height: 122px;
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

.title {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: bold;
  font-size: 20px;
  color: #2b2b2e;
  line-height: 22px;
  text-align: center;
  font-style: normal;
  text-transform: none;
  margin-top: 40px;
}
.des {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #2b2b2e;
  line-height: 22px;
  text-align: center;
  font-style: normal;
  text-transform: none;
  margin-top: 15px;
}
.button-container {
  margin-top: 12px;
}
.button {
  width: 264px;
  height: 42px;
  line-height: 42px;
  color: #fff;
  background: linear-gradient(265deg, #1bcc83 0%, #3e7dfe 100%);
  border-radius: 26px 26px 26px 26px;
  border: 1px solid;
  border-image: linear-gradient(180deg, rgba(247, 247, 247, 0.5), rgba(247, 247, 247, 0.7)) 1 1;
}
.cancel {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #6b6b6b;
  line-height: 20px;
  text-align: center;
  font-style: normal;
  text-transform: none;
  margin-top: 12px;
}
</style>
