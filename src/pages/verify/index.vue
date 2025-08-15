<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { postLogoutApi, postSendCodeApi, postSendCodeEmailApi } from '@/api/logout'
import backIcon from '@/assets/images/navBar/back_black.png'

const route = useRoute()
const router = useRouter()

const value = ref('')
const showKeyboard = ref(true)
const isSend = ref(false)
const text = ref(route.query.text || 'mobile phone')
const num = ref(route.query.num || '*****')
const tel_area_code = ref(route.query.tel_area_code || '+86')

const countDownRef = ref(null)

function start() {
  isSend.value = true
  countDownRef.value?.start()
}

function reset() {
  countDownRef.value?.reset()
}

function finish() {
  reset()
  isSend.value = false
}

function send() {
  if (isSend.value)
    return
  sendCode()
}

async function goToNext() {
  if (value.value.length !== 6) {
    showToast('Please enter the correct verification code')
    return
  }

  try {
    const res = await postLogoutApi({
      id: Number(route.query.id),
      code: value.value,
    })

    if (res.code === 0) {
      router.replace('/success')
    }
    else {
      router.replace({
        path: '/fail',
        query: { reason: res.message },
      })
    }
  }
  catch {
    showToast('Api error')
  }
}

function goToBack() {
  router.replace('/')
}

// 发送验证码
async function sendCode() {
  let res
  try {
    if (text.value === 'mobile phone') {
      res = await postSendCodeApi({
        tel_area_code: tel_area_code.value,
        tel: num.value,
        type: 10,
      })
    }
    else {
      res = await postSendCodeEmailApi({
        email: num.value,
        type: 10,
      })
    }
    if (res.code === 0) {
      start()
    }
    else {
      reset()
      showToast(res.message || 'Api error')
    }
  }
  catch {
    reset()
    showToast('Api error')
  }
}

onMounted(() => {
  sendCode()
})
</script>

<template>
  <div class="px-12px bg-#fff h-100vh">
    <div class="flex h-48px items-center">
      <img :src="backIcon" width="24" height="24" @click="goToBack">
    </div>

    <div class="flex flex-col justify-center">
      <div class="text-24px font-600 mb-75px mt-15px">
        Complete the following verification
      </div>
      <div class="text-16px text-#9A9DA2">
        The verification code has been sent to your reserved {{ text }}
      </div>
      <div class="text-16px text-#000 mb-15px">
        {{ num }}
      </div>

      <van-password-input
        :value="value"
        :mask="false"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
      />
      <van-number-keyboard
        v-model="value"
        :show="showKeyboard"
        @blur="showKeyboard = false"
      />

      <div class="mt-25px flex flex-col items-center justify-center">
        <div class="font-500 flex gap-5px items-center">
          <div
            class="text-14px" :class="[isSend ? 'text-#D9D9D9' : '#000']"
            @click="send"
          >
            Resend
          </div>
          <van-count-down
            v-show="isSend"
            ref="countDownRef"
            style="color: #4dcb73"
            :auto-start="false"
            :time="60000"
            format="ss s"
            @finish="finish"
          />
        </div>

        <van-button
          round
          type="primary"
          style="width: 190px; margin-top: 35px;"
          :disabled="value.length < 6"
          @click="goToNext"
        >
          Confirm cancellation
        </van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.van-nav-bar .van-icon {
  color: #000;
}
</style>
