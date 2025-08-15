<script setup lang="ts">
import { computed } from 'vue'
import bg from '@/assets/images/rebate-variety/bg.png'
import tabBg from '@/assets/images/rebate-variety/tabbar-bg.png'
import investment from '@/assets/images/rebate-variety/investment.png'
import Table from '@/components/rebate-variety/Table.vue'
import { getTransactionGroupConfig } from '@/api/invite'
import { useI18n } from 'vue-i18n'
import jsBridge from '@/utils/jsBridge'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const getBg = computed(() => ({
  backgroundImage: `url(${bg})`,
  backgroundSize: '100%',
}))
const getNavBg = computed(() => ({
  backgroundImage: `url(${tabBg})`,
  backgroundSize: '100%',
}))

const tableData = ref()

async function getData() {
  const res: any = await getTransactionGroupConfig()
  if (res.code === 0) {
    tableData.value = res.data.transaction_group_rebate_config
  }
}

async function handleBack() {
  try {
    await jsBridge.call('close')
  }
  catch {
    router.back()
  }
}

onMounted(() => {
  getData()
})
</script>

<template>
  <FullPageView :header-bg="{ ...getNavBg, backgroundPosition: 'bottom' }">
    <template #header>
      <NavBar icon-color="white" @back="handleBack">
        <div class="text-white flex j-c">
          {{ t('rebate.rebateInstrument') }}
        </div>
      </NavBar>
    </template>
    <div class="px-14px py-12px" :style="{ ...getBg }">
      <div class="ml-15px flex">
        <div><img :src="investment" class="h-28px w-28px"></div>
        <div class="font-Inter text-[15px] text-white font-bold leading-[32px] ml-7px text-left normal-case not-italic">
          Futren
        </div>
      </div>
      <div class="ml-15px mt-23px">
        <div class="font-Inter text-[18px] text-[#1BCC83] font-bold leading-[24px] text-left normal-case not-italic">
          {{ t('rebate.rebateAmount') }}
        </div>
        <div class="font-PingFang-SC text-12px text-white font-medium leading-18px text-left max-w-150px normal-case not-italic">
          {{ t('rebate.rebateCalculationDescription') }}
        </div>
      </div>
      <div class="mt-32px">
        <div class="mb-20px">
          <Table v-for="item in tableData" :key="item.transaction_group" :table-item="item.symbol_rebate_configs" :title="item.transaction_group" />
        </div>
      </div>
    </div>
  </FullPageView>
</template>
