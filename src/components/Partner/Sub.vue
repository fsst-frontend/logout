<script setup lang='tsx'>
import lv1 from '@/assets/images/lvs/lv1.png'
import lv2 from '@/assets/images/lvs/lv2.png'
import lv3 from '@/assets/images/lvs/lv3.png'
import lv4 from '@/assets/images/lvs/lv4.png'
import lv5 from '@/assets/images/lvs/lv5.png'
import lv6 from '@/assets/images/lvs/lv6.png'
import lv7 from '@/assets/images/lvs/lv7.png'
import lv8 from '@/assets/images/lvs/lv8.png'
import lv9 from '@/assets/images/lvs/lv9.png'
import lv10 from '@/assets/images/lvs/lv10.png'
import { getSubListApi } from '@/api/partner'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()
// 接口返回
const lvImg = [lv1, lv2, lv3, lv4, lv5, lv6, lv7, lv8, lv9, lv10]

const loading = ref(false)
const subList = ref<any>([])

async function getSubList() {
  loading.value = true
  try {
    const res = await getSubListApi({ limit: 4, offset: 0 })
    subList.value = res.data.subordinate_list
  }
  catch (error) {
    showToast(`获取下级失败${error}`)
  }
  finally {
    loading.value = false
  }
}

function getlvImg(vip_level) {
  return lvImg[~~vip_level[vip_level.length - 1] - 1]
}

onMounted(() => {
  getSubList()
})
</script>

<template>
  <div v-loading="loading" class="px-7px pb-7px pt-10px rounded-6px bg-white">
    <div class="mb-10px px-10px flex a-c j-b">
      <div class="text-#533000">
        我的下级
      </div>
      <div class="text-12px text-#E6A262" @click="router.push('/sub')">
        查看明细＞
      </div>
    </div>
    <div
      class="text-#6F5800 p-12px rounded-6px"
    >
      <div v-if="subList.length" class="flex flex-col gap-4.5">
        <div
          v-for="(i, index) in subList"
          :key="index"
          class="flex gap-2 h-12.5"
          @click="router.push('/sub')"
        >
          <div class="flex gap-2 a-c">
            <div class="text-white line-height-20px rounded-full bg-#ECA269 flex w-20px aspect-ratio-1/1 j-c">
              {{ index + 1 }}
            </div>
            <img class="rounded-full w-50px aspect-ratio-1/1 block" :src="i.avatar" alt="">
            <div class="ml-2">
              <div class="van-ellipsis text-12px text-#533000 w-36px">
                {{ i.nick_name }}
              </div>
              <img class="h-13px block" :src="getlvImg(i.vip_level)">
            </div>
          </div>
          <div class="text-12px text-#80572A flex flex-1 a-c j-b">
            <div>邀请{{ i.invite_count }}人</div>
            <div>分佣{{ i.commissioned }}</div>
            <div>分润{{ i.profit }}</div>
          </div>
        </div>
      </div>
      <div v-else>
        暂无下级,请邀请更多下级
      </div>
    </div>
  </div>
</template>
