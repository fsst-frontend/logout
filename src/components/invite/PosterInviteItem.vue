<template>
  <div :class="codeData.is_default ? borderClass : defaultClass" @click="handleChangeDefault">
    <div class="flex justify-between mb-14px">
      <div class="text-12px font-600 text-#000000">{{t('inviteSetting.copyTradeInviteExclusive')}}</div>
      <img v-if="codeData.is_default" :src="checkedIcon" width="20px" height="20px">
      <van-icon v-else name="circle" size="20px" />
    </div>
    <div v-for="item in itemData" :key="item.label" class="flex justify-between">
      <div class="text-12px font-500 text-#60656d">{{ item.label }}</div>
      <div class="text-14px font-500 text-#000000">{{ item.value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import checkedIcon from '@/assets/images/invite/checked_color.svg'
import {setInviteCodeDefault} from '@/api/invite'
import { useI18n } from 'vue-i18n'

const {t} = useI18n()

interface ICodeData{
  code: string,
  rebate_ratio: number,
  return_ratio: number,
  is_default: boolean
  id: number
}

const props = defineProps<{
  codeData: ICodeData
}>()

const emits = defineEmits(['changeDefault'])

const defaultClass = ref('rounded-9px w-241px h-115px px-15px py-10px shrink-0 bg-#f7f7f7')
const borderClass = ref('border border-solid border-#2D7AFF rounded-9px w-241px h-115px px-15px py-10px shrink-0')

const itemData = computed(()=>[
  {
    label: t('inviteSetting.invitationCode'),
    value: props.codeData?.code || '--'
  },
  {
    label: t('inviteSetting.myRebateRate'),
    value: `${Math.round(props.codeData?.rebate_ratio * 100)}%` || '--'
  },
  {
    label: t('inviteSetting.friendRewardRate'),
    value: `${Math.round(props.codeData?.return_ratio * 100)}%` || '--'
  },
])

async function handleChangeDefault(){
  try{
    const params = {id: props.codeData.id}
    const res: any = await setInviteCodeDefault(params);
    if(res.code === 0){
      emits('changeDefault');
    }else{
      showToast(t('toast.apiError'))
    }
  }catch{
    showToast(t('toast.apiError'))
  }
}

</script>