<script setup>
import { useRoute, useRouter } from 'vue-router'
import failIcon from '@/assets/images/fail.svg'

const route = useRoute()
const router = useRouter()

const reason = route.query.reason || 'Api error'

function goToNext() {
  router.replace('/')
}
</script>

<template>
  <div class="px-12px bg-#fff h-100vh">
    <van-nav-bar>
      <template #left>
        <van-icon name="arrow-left" class="text-18px font-bold" @click="goToNext" />
      </template>
    </van-nav-bar>

    <div class="flex flex-col items-center justify-center">
      <img :src="failIcon" width="64" height="64" class="mt-21px">
      <div class="text-18px text-#F95959 font-600 mb-13px mt-13px">
        Sorry, account cancellation failed
      </div>
      <div class="text-12px text-#60656D">
        reason: {{ reason }}
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
