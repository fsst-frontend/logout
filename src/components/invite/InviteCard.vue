<script setup>
import { computed } from 'vue'
import { setInviteCodeDefault } from '@/api/invite'
import UpdateRemarkPopup from '@/components/invite/UpdateRemarkPopup.vue'
import copyOutlineIcon from '@/assets/images/invite/copy-outline.svg'
import checkedColorIcon from '@/assets/images/invite/checked_color.svg'
import copyIcon from '@/assets/images/invite/copy.svg'
import editIcon from '@/assets/images/invite/edit.svg'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  inviteCodeInfo: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['confirm'])

const { t } = useI18n()

const updateRemarkPopupVisible = ref(false)
const remarkInfo = ref({
  id: '',
  remark: '',
})

const cardData = computed(() => {
  return [
    {
      title: t('inviteSetting.myRebateRate'),
      value: `${props.inviteCodeInfo.rebate_ratio * 100 || '--'}%`,
    },
    {
      title: t('inviteSetting.friendRewardRate'),
      value: `${props.inviteCodeInfo.return_ratio * 100 || '--'}%`,
    },
    {
      title: t('inviteSetting.numberOfInvites'),
      value: props.inviteCodeInfo.invitee_count || 0,
    },
    {
      title: t('inviteSetting.invitationLink'),
      value: props.inviteCodeInfo.link || '--',
    },
    {
      title: t('inviteSetting.remark'),
      value: props.inviteCodeInfo.remark || '--',
    },
  ]
})

async function handleSetDefault() {
  try {
    const res = await setInviteCodeDefault({ id: props.inviteCodeInfo.id })
    if (res.code === 0) {
      showToast(t('toast.settingSuccess'))
      emit('confirm')
    }
  }
  catch (err) {
    showToast(err.message || showToast(t('toast.settingFailed')),
    )
  }
}

function handleUpdateRemark() {
  remarkInfo.value = {
    id: props.inviteCodeInfo.id,
    remark: props.inviteCodeInfo.remark,
  }
  updateRemarkPopupVisible.value = true
}

function copy(text) {
  try {
    navigator.clipboard.writeText(text)
    // jsBridge.call('setClipBoardData', {
    //   text,
    // })
    showToast(t('toast.copySuccess'))
  }
  catch (e) {
    showToast(e || t('toast.inviteLinkCopyFailed'))
  }
}

function handleCopy(val) {
  copy(val)
}

function handleSubmit() {
  emit('confirm')
}
</script>

<template>
  <div class="mt-10px">
    <div class="p-3 rd-10px bg-white">
      <div class="pb-2 b-b b-b-#f7f7f7 flex justify-between">
        <div class="flex gap-2 items-center">
          <div>{{ inviteCodeInfo.code }}</div>
          <img :src="copyOutlineIcon" @click="handleCopy(inviteCodeInfo.code)">
        </div>
        <div v-if="inviteCodeInfo.is_default" class="flex gap-2 items-center justify-end">
          <div class="text-12px text-#4DCB73 font-600">
            {{ t('inviteSetting.default') }}
          </div>
          <img :src="checkedColorIcon" alt="">
        </div>
        <div v-else class="text-12px text-#FFFFFF px-6px py-4px rd-27px bg-black" @click="handleSetDefault">
          {{ t('inviteSetting.setAsDefault') }}
        </div>
      </div>
      <div class="mt-2px">
        <div v-for="(item, index) in cardData" :key="index" class="lh-1em mt-1px flex gap-10px items-center justify-between">
          <div class="text-12px text-#60656D font-500 lh-20px shrink-0 min-w-80px">
            {{ item.title }}
          </div>
          <div class="lh-20px flex gap-5px overflow-hidden">
            <div class="text-14px text-#2B2B2E font-500 flex-1 truncate">
              {{ item.value }}
            </div>
            <img v-if="index === 3" width="20px" height="20px" :src="copyIcon" @click="handleCopy(item.value)">
            <img v-if="index === 4" width="20px" height="20px" :src="editIcon" @click="handleUpdateRemark">
          </div>
        </div>
      </div>
    </div>
  </div>
  <UpdateRemarkPopup v-model:show="updateRemarkPopupVisible" :remark-info="remarkInfo" @submit="handleSubmit" />
</template>

<style scoped>

</style>
