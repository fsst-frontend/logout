<script setup>
import { useRouter } from 'vue-router'
import backIcon from '@/assets/images/navBar/back_black.png'
import successIcon from '@/assets/images/success.svg'

const router = useRouter()

function goToNext() {
  router.replace('/')
}
</script>

<template>
  <div class="px-12px bg-#fff h-100vh">
    <div class="flex h-48px items-center">
      <img :src="backIcon" width="24" height="24" @click="goToNext">
    </div>

    <div class="flex flex-col items-center justify-center">
      <img :src="successIcon" width="64" height="64" class="mt-21px">
      <div class="text-18px font-600 mb-13px mt-13px">
        Account has been cancelled
      </div>
      <div class="text-12px text-#60656D">
        Thank you for your use and see you next time!
      </div>
      <van-button round type="primary" style="width: 190px; margin-top: 60px;" @click="goToNext">
        Back
      </van-button>
    </div>
  </div>
</template>

<style scoped>
.van-nav-bar .van-icon {
  color: #000;
}
</style>
