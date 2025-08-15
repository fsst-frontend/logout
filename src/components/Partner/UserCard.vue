<script lang="ts" setup>
import NumberBar from './NumberBar.vue'

defineProps({
  userInfo: {
    /**
     *  - uid
     *  - nick_name
     *  - avatar
     *  - level
     *  - invite_count
     *  - commissioned
     *  - profit
     *  - trade_count
     * @type {Array}
     * @default []
     */
    type: Object,
  },
  borderLine: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div class="mt-4 pb-4px" :class="borderLine ? 'van-hairline--bottom' : ''">
    <div class="flex a-c">
      <img class="rounded-full h-48px w-48px" :src="userInfo?.avatar">
      <div class="ml-2.5 flex-1">
        <div class="text-12px text-#8B8B8B mt-4px flex w-full a-c j-b">
          <div>
            <div class="flex">
              <div class="text-16px text-#333333 line-height-16px">
                {{ userInfo?.nick_name }}
              </div>
            </div>
            <div>
              uid: {{ userInfo?.uid }}
            </div>
          </div>
          <div>
            ＞
          </div>
        </div>
      </div>
    </div>
    <NumberBar :user-info="userInfo" class="mt-5" />
  </div>
</template>
