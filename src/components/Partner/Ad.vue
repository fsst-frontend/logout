<script setup lang='tsx'>
const adList = ref([
  { name: '孤岛信徒', num: '47' },
  { name: '橘猫不太冷', num: '89' },
  { name: '黑夜行舟', num: '13' },
  { name: '月下拾荒人', num: '68' },
  { name: '鱼丸粗面', num: '55' },
  { name: '小熊不吃糖', num: '24' },
  { name: '空城旧梦', num: '91' },
  { name: '碎语浅笑', num: '60' },
  { name: '柠檬味的风', num: '31' },
  { name: '咸鱼有梦想', num: '99' },
  { name: '花落微凉', num: '7' },
  { name: '南山南', num: '72' },
  { name: '一只奶盖', num: '44' },
  { name: '电竞少女阿梨', num: '88' },
  { name: '野区小仙女', num: '20' },
  { name: '云端漫步者', num: '36' },
  { name: '今天也很菜', num: '63' },
  { name: '春眠不觉晓', num: '15' },
  { name: '等风来的人', num: '50' },
  { name: '哇哦是小陈', num: '78' },
])
</script>

<template>
  <VanSwipe class="h-30px" vertical :autoplay="3000" :show-indicators="false" :touchable="false">
    <VanSwipeItem v-for="(i, index) in adList" :key="index" class="h-30px">
      <div class="flex h-full a-c">
        <div class="py-2px pe-4px rounded-full bg-#F3D6B1 flex gap-1 w-fit">
          <img class="h-12px aspect-ratio-1/1 block" src="" alt="">
          <div class="text-10px text-#80572A font-300 line-height-12px">
            {{ i.name }}邀请一位新用户交易赚了{{ i.num }}.00元
          </div>
        </div>
      </div>
    </VanSwipeItem>
  </VanSwipe>
</template>

<style scoped>

</style>
