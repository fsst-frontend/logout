<script setup lang="ts">
const props = defineProps({
  userInfo: {
    /**
     * 好友交易利润收入数据，长度为4的数组，分别代表：
     *  - 好友数据 invite_count
     *  - 交易数据 trade_count
     *  - 利润数据 profit
     *  - 收入数据 commissioned
     *
     * @type {object}
     * @default {}
     */
    type: Object,
  },
})
const data = computed(() => {
  return [
    {
      name: '累计邀请好友',
      value: props.userInfo?.invite_count || 0,
    },
    {
      name: '累计交易手数',
      value: props.userInfo?.trade_count || 0,
    },
    {
      name: '累计跟单分润',
      value: props.userInfo?.profit || 0,
    },
    {
      name: '累计提供分佣',
      value: props.userInfo?.commissioned || 0,
    },
  ]
})
</script>

<template>
  <div class="flex j-b">
    <div v-for="(i, index) in data" :key="index" class="flex flex-col a-c">
      <div class="text-12px text-#6B6B6B line-height-14px text-center w-48px">
        {{ i.name }}
      </div>
      <div class="text-20px mt-6px" :style="{ color: index === 3 ? '#3E7DFE' : '#2B2B2E' }">
        {{ i.value }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
