<script setup lang="ts">

export interface PartnerSummary {
  user_id: number
  total_commission_amount: string
  max_rebate_ratio: string
  invitation_return_ratio: string
  invitation_rebate_ratio: string
  total_sub_count: number
  total_sub_active_count: number
  total_sub_trader_count: number
  invitation_code: string
  invitation_link: string
  yestoday_rebate_amount: string
}

const props = defineProps<PartnerSummary>()
</script>

<template>
  <div class="p-4 rounded-8px bg-white w-345px">
    <div class="mb-6 text-center">
      <div class="text-18px font-semibold">
         {{ $t('invite.totalRevenue') }}(USD)
      </div>
      <div class="text-30px text-[#1E90FF] font-bold mt-1">
        {{props.total_commission_amount || '--'}}
      </div>
    </div>
    <div class="text-gray-800 space-y-3">
      <div class="flex items-center justify-between">
        <span class="title">{{ $t('invite.yesterdayRevenue') }}</span>
        <span class="outcome">{{ props.yestoday_rebate_amount || 0 }} USD</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="title">{{ $t('invite.registeredFriends') }}</span>
        <span class="outcome">{{props.total_sub_count || 0}}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="title">{{ $t('invite.activatedFriends') }}</span>
        <span class="outcome">{{props.total_sub_active_count || 0}}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="title">{{ $t('invite.tradedFriends') }}</span>
        <span class="outcome">{{props.total_sub_trader_count || 0}}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.title {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #8b8b8b;
  line-height: 12px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.outcome {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 800;
  font-size: 14px;
  color: #2b2b2e;
  line-height: 12px;
  text-align: right;
  font-style: normal;
  text-transform: none;
}
</style>
