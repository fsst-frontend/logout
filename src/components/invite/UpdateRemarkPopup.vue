<script setup>
import { ref } from 'vue'
import { updateInviteCodeRemark } from '@/api/invite'
import closeIcon from '@/assets/images/invite/close_light.svg'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  remarkInfo: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:show', 'submit'])
const showBottom = computed({
  get() {
    return props.show
  },
  set(val) {
    emit('update:show', val)
  },
})

const remark = ref('')
watch(() => props.remarkInfo, (val) => {
  remark.value = val.remark
})
const loading = ref(false)
async function handleSubmit() {
  if (loading.value)
    return
  loading.value = true
  try {
    const res = await updateInviteCodeRemark({
      remark: remark.value,
      id: props.remarkInfo.id,
    })
    if (res.code === 0) {
      showBottom.value = false
      showToast(t('toast.modificationSuccess'))
      emit('submit')
    }
  }
  catch (err) {
    showToast(err.message || t('toast.modificationFailed'))
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <van-popup v-model:show="showBottom" round :style="{ padding: '15px', width: '80%' }">
    <div class="flex flex-col gap-28px relative">
      <img class="right-0 absolute" :src="closeIcon" width="20px" height="20px" @click="showBottom = false">
      <div class="text-16px text-#2B2B2E font-600 text-center">
        {{t('toast.modifyRemark')}}
      </div>
      <van-field
        v-model="remark"
        :placeholder="t('toast.characterLimitHint')"
        :maxlength="15"
        class="rd-[4px]"
        style="background-color: #F7F7F7;"
        :rules="[{ required: true, message: `${t('toast.enterRemarkPrompt')}` }]"
      >
        <template #right-icon>
          <div class="text-12px text-#999">
            {{ remark.length }}/15
          </div>
        </template>
      </van-field>
      <van-button type="primary" block :loading="loading" @click="handleSubmit">
        {{t('toast.confirm')}}
      </van-button>
    </div>
  </van-popup>
</template>

<style scoped>

</style>
