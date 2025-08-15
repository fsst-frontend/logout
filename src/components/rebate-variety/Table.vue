<script lang="ts" setup>
import rightArrow from '@/assets/images/rebate-variety/right-arrow-green.png'
import { useI18n } from 'vue-i18n'

const {t} = useI18n();

interface Props {
  // rebateRate: string
  // pairs: string[]
  tableItem: any[]
  title: string
}

const props = withDefaults(defineProps<Props>(), {
  // rebateRate: '30%点/手',
  // pairs: () => [
  //   'AUD/CAD',
  //   'GBPUSD',
  //   'EURUSD',
  //   'GBPUSD',
  //   'EURUSD',
  //   'GBPUSD',
  //   'EURUSD',
  //   'GBPUSD',
  //   'EURUSD',
  //   'GBPUSD',
  // ],
  // title: '外汇',
})

</script>

<template>
  <div class="my-15px flex items-center">
    <div><img :src="rightArrow" alt="" class="h-12px w-12px"></div>
    <div class="font-PingFang-SC text-14px text-[#F7F7F7] font-bold font-normal leading-15px ml-6px text-center normal-case">
      {{ props.title }}
    </div>
  </div>
  <div class="rebate-table-container">
    <table class="rebate-table">
      <thead>
        <tr>
          <th class="column">
            {{ t('rebate.rebateRate') }}
          </th>
          <th class="column no-border-right">
            {{ t('rebate.rebateInstrument') }}
          </th>
        </tr>
      </thead>
      <tbody v-for="item in props.tableItem">
        <tr v-for="(pair, index) in item.symbols" :key="index">
          <td v-if="index === 0" :rowspan="item.symbols.length" class="table-left">
            {{ item.rebate_value }} {{ t('rebate.usdPerLot') }}
          </td>
          <td class="no-border-right no-cell-border">
            {{ pair }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.rebate-table-container {
  font-family: Arial, sans-serif;
  width: 100%;
  color: white;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #2a3a6e;
  background-color: #16213e;
}

.rebate-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #16213e;
}

.rebate-table th,
.rebate-table td {
  padding: 10px;
  text-align: center;
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  border-right: 1px solid #2a3a6e;
  border-bottom: 1px solid #2a3a6e;
}

.rebate-table th {
  background-color: #29304d;
  font-weight: bold;
  color: #ffffff;
}

.rebate-table td {
  color: #2b2b2e;
}

.rebate-table .no-border-right,
.rebate-table th.no-border-right {
  border-right: none;
}

.rebate-table .no-cell-border {
  border: none;
}

.rebate-table tr:last-child td {
  border-bottom: none;
}

.rebate-table tr:nth-child(even) {
  background-color: #ffffff;
}

.rebate-table tr:nth-child(odd) {
  background-color: #edf1ff;
}

.column {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 500;
  font-size: 14px;
  color: #ffffff;
  line-height: 15px;
  text-align: center;
  font-style: normal;
  text-transform: none;
}

.table-left {
  background-color: #edf1ff;
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 500;
  font-size: 12px;
  color: #2b2b2e;
  line-height: 16px;
  text-align: center;
  font-style: normal;
  text-transform: none;
  border-right: 1px solid #2a3a6e;
  border-bottom: 1px solid #2a3a6e;
}
</style>
