<script setup lang='tsx'>
import rankTitle from '@/assets/images/content/rankTitle.png'
import first from '@/assets/images/badge/first.png'
import second from '@/assets/images/badge/second.png'
import third from '@/assets/images/badge/third.png'
import { showToast } from 'vant'

import { getRankListApi } from '@/api/partner'

const loading = ref(false)
const rankList = ref<any[]>([])
async function getRankList() {
  loading.value = true
  try {
    const res = await getRankListApi()
    // 降序排名
    rankList.value = res.data.ranking.map((i, index) => {
      return {
        ...i,
        badge: index === 0 ? first : index === 1 ? second : third,
      }
    })
  }
  catch (error) {
    showToast(`获取排名失败${error}`)
  }
  finally {
    loading.value = false
  }
}
onMounted(() => {
  getRankList()
})
</script>

<template>
  <div class="mt-14px">
    <div v-loading="loading" class="px-7px pb-7px rounded-6px bg-white">
      <div class="pb-13px pt-11px flex j-c">
        <img :src="rankTitle" class="h-20px w-162px block">
      </div>
      <div class="rounded-6px bg-#FFF7E6 h-108px">
        <div class="px-27px pt-14px flex j-b">
          <div
            v-for="(i, index) in rankList"
            :key="index"
            class="text-#80572A flex flex-col w-12.5 a-c"
            :style="{ order: index === 0 ? 2 : index === 1 ? 1 : 3 }"
          >
            <div class="h-15.5 pos-relative">
              <img class="rounded-full h-12.5 w-12.5 block" :src="i.avatar" alt="">
              <div class="flex w-full bottom-0 j-c pos-absolute">
                <img class="w-8 block" :src="i.badge" alt="">
              </div>
            </div>
            <div class="text-12px line-height-12px">
              {{ i.nick_name }}
            </div>
            <div class="text-12px line-height-12px">
              {{ i.revenue }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
