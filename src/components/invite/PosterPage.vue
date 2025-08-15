<template>
  <van-swipe class="w-375px h-601px" indicator-color="white" :show-indicators="false">
    <van-swipe class="h-full overflow-visible" :options="swiperOptions" ref="mySwiper">
          <van-swipe-item v-for="s in posterImgs" :key="s">
            <img class="h-full w-full rd-15px" :src="s" alt="" />
          </van-swipe-item>
          <div v-show="posterImgs.length > 1" class="swiper-pagination" slot="pagination"></div>
        </van-swipe>
    <!-- <van-swipe-item class="my-swipe my-swipe1 relative">
      <div class="absolute bottom-22px left-22px flex justify-between">
        <div class="text-14px text-#ffffff">
          <div>和我一起在FI探索CFD差价合约交易</div>
          <div>立即加入全球领先的CFD差价合约平台</div>
          <div>邀请码：WSHFG</div>
        </div>
        <div class="w-58px h-58px bg-#ffffff flex-end"></div>
      </div>
    </van-swipe-item>
    <van-swipe-item class="my-swipe my-swipe2">2</van-swipe-item>
    <van-swipe-item class="my-swipe my-swipe3">3</van-swipe-item> -->
  </van-swipe>
  <!-- <div class="poster-page">
    <div></div>
    <van-swipe class="my-swipe" indicator-color="white">
      <van-swipe-item>1</van-swipe-item>
      <van-swipe-item>2</van-swipe-item>
      <van-swipe-item>3</van-swipe-item>
      <van-swipe-item>4</van-swipe-item>
    </van-swipe>
    轮播指示点
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
      <span class="w-3 h-1.5 bg-green-400 rounded-full"></span>
      <span class="w-3 h-1.5 bg-gray-400 rounded-full"></span>
      <span class="w-3 h-1.5 bg-gray-400 rounded-full"></span>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import postImg1 from '@/assets/images/invite/post1.png'
import postImg2 from '@/assets/images/invite/post2.png'
import postImg3 from '@/assets/images/invite/post3.png'

const swiperOptions=ref( {
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      })

const posterImgs = ref([
postImg1,postImg2,postImg3
])

</script>

<style scoped>
  .my-swipe {
    width: 375px;
    height: 601px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .my-swipe1{
    background-image: url('@/assets/images/invite/post1.png');
  }
  .my-swipe2{
    background-image: url('@/assets/images/invite/post2.png');
  }
  .my-swipe3{
    background-image: url('@/assets/images/invite/post3.png');
  }
</style>