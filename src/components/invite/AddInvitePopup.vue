<script setup>
import { computed, ref } from 'vue'
import { createInviteCode } from '@/api/invite'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:show', 'confirm'])

const showBottom = computed({
  get() {
    return props.show
  },
  set(val) {
    emit('update:show', val)
  },
})

const returnRatio = ref(15)
const remark = ref('')
const isDefault = ref(false)
const loading = ref(false)

function handleCancel() {
  emit('update:show', false)
}

async function handleConfirm() {
  if (loading.value)
    return
  loading.value = true
  try {
    const params = {
      return_ratio: String((returnRatio.value / 100).toFixed(2)),
      remark: remark.value,
      is_default: isDefault.value,
    }
    const res = await createInviteCode(params)
    if (res.code === 0) {
      showToast(t('toast.creationSuccess'))
      emit('confirm')
      handleCancel()
    }
    else {
      showToast(res.message || t('toast.creationFailed'))
    }
  }
  catch {
    showToast(t('toast.creationFailed'))
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <van-popup
    v-model:show="showBottom"
    round
    position="bottom"
  >
    <div class="p-4">
      <div class="text-16px font-600">
        {{t('inviteSetting.createInvitationCode')}}
      </div>
      <div class="text-12px text-#60656D mt-2">
        {{t('inviteSetting.autoRebateDescription')}}
      </div>
      <div class="text-12px text-#F95959 mt-1">
        {{t('inviteSetting.rebateRateLockNotice')}}
      </div>
      <div class="mt-19px">
        <div class="text-12px text-#60656D mb-10px">
          {{t('inviteSetting.setFriendRewardRate')}}
        </div>
        <van-slider
          v-model="returnRatio"
          :min="0"
          :max="100"
          :step="5"
          bar-height="4px"
          active-color="#4080FF"
        >
          <template #button>
            <div class="custom-button">
              {{ returnRatio }}
            </div>
          </template>
        </van-slider>
        <div class="text-12px text-#60656D mt-4 flex justify-between">
          <div>{{t('inviteSetting.myRebateRate')}}：<span>{{ 100 - returnRatio }}%</span></div>
          <div>{{t('inviteSetting.friendRewardRate')}}：<span>{{ returnRatio }}%</span></div>
        </div>
      </div>

      <div class="mt-6">
        <div class="text-14px text-#333 font-500 mb-2">
          {{t('inviteSetting.remark')}}
        </div>
        <van-field
          v-model="remark"
          :placeholder="t('toast.characterLimitHint')"
          :maxlength="15"
          class="rd-[4px]"
          style="background-color: #F7F7F7;"
          :rules="[{ required: true, message: t('toast.enterRemarkPrompt') }]"
        >
          <template #right-icon>
            <div class="text-12px text-#999">
              {{ remark.length }}/15
            </div>
          </template>
        </van-field>
      </div>

      <div class="mt-4 flex items-center">
        <van-switch v-model="isDefault" size="20px" active-color="#4DCB73">
          <template #node>
            <div class="flex h-full w-full items-center justify-center">
              <div v-if="isDefault" class="i-carbon:checkmark text-12px text-white" />
            </div>
          </template>
        </van-switch>
        <span class="text-13px text-#60656D font-500 ml-2">{{ t('inviteSetting.setAsDefaultInviteCode') }}</span>
      </div>

      <div class="mt-6 flex gap-3">
        <van-button
          block
          class="flex-1"
          :class="{ 'op-40': loading }"
          @click="handleCancel"
        >
          {{ t('toast.cancel') }}
        </van-button>
        <van-button
          type="primary"
          block
          class="flex-1"
          :loading="loading"
          @click="handleConfirm"
        >
         {{ t('toast.confirm') }}
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<style scoped>
.custom-button {
  width: 26px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  background-color: var(--van-primary-color);
  border-radius: 100px;
}
</style>
