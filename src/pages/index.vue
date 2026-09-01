<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import infoIcon from '@/assets/images/info.svg'
import { getCheckAccountApi } from '@/api/logout' // 假设这是你封装的 API 模块
import { showToast } from 'vant' // vant 自带 toast

const account = ref('')
const router = useRouter()

async function goToNext() {
  try {
    const res = await getCheckAccountApi({
      id: Number(account.value),
    })

    if (res.code === 0 && res.data.is_exist) {
      // 账号存在，发送验证码
      // if (res.data.tel.length > 0) {
      //   await postSendCodeApi({
      //     tel_area_code: res.data.tel_area_code,
      //     tel: res.data.tel,
      //     type: 10
      //   })
      // } else {
      //   await postSendCodeEmailApi({
      //     email: res.data.email,
      //     type: 10
      //   })
      // }

      const text = res.data.tel.length > 0 ? 'mobile phone' : 'email address'
      const num = res.data.tel.length > 0 ? res.data.tel : res.data.email

      router.replace({
        path: '/verify',
        query: {
          id: Number(account.value),
          tel_area_code: res.data.tel_area_code,
          text,
          num,
        },
      })
    }
    else {
      showToast(res.message || 'Api error')
    }
  }
  catch {
    showToast('Api error')
  }
}
</script>

<template>
  <div class="px-12px bg-#fff h-100vh">
    <div class="flex flex-col items-center justify-center">
      <img :src="infoIcon" width="64" height="64" class="mb-30px mt-80px">
      <div class="text-18px font-600 mb-15px">
        Delete KIFX Account
      </div>
      <div class="text-12px text-#60656D mb-27px">
        If you choose to cancel your account, the following will occur:
      </div>
      <div class="text-14px text-#60656D lh-1.5em px-22px py-13px rounded-9px bg-#F7F7F7">
        <li>All functions of the account will no longer be provided;</li>
        <li>All information in the account will be deleted;</li>
        <li>
          Once an account is cancelled, it can no longer be used in any way, and the mobile phone and email address
          bound to the account cannot be used for re-registration or binding.
        </li>
      </div>
      <div class="mt-21px">
        <div class="text-14px text-#60656D mb-8px">
          Your account
        </div>
        <input
          v-model="account"
          type="text"
          placeholder="Please enter your account number"
          class="pl-16px rounded-9px h-50px w-335px"
          style="border: 1px solid #e7e8e9"
        >
      </div>
      <van-button
        round
        type="primary"
        style="width: 230px; margin-top: 52px;"
        :disabled="!account"
        @click="goToNext"
      >
        Next
      </van-button>
    </div>
  </div>
</template>
