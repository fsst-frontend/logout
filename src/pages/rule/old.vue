<script setup lang="ts">
import jsBridge from '@/utils/jsBridge'
import { useRouter } from 'vue-router'

const router = useRouter()

async function goBack() {
  try {
    await jsBridge.call('close')
  }
  catch {
    router.back()
  }
}
</script>

<template>
  <FullPageView>
    <template #header>
      <NavBar icon-color="black" @back="goBack">
        <div class="flex w-full j-c">
          {{ $t('rule.ruleTitle') }}
        </div>
      </NavBar>
    </template>
    <div class="lh-28px p-10px">
      <div class="bold">
        {{ $t('rule.title') }}
      </div>
      <div class="bold">
        {{ $t('rule.prefaceTitle') }}
      </div>
      <div>
        {{ $t('rule.prefaceContent') }}
      </div>
      <van-divider />
      <div class="bold">
        {{ $t('rule.chapter1Title') }}
      </div>
      <div class="bold">
        1. {{ $t('rule.participationMethod') }}：
        <span class="nobold">{{ $t('rule.participationContent') }}</span>
      </div>
      <div class="bold">
        2. {{ $t('rule.dataCenter') }}：
        <span class="nobold">{{ $t('rule.dataCenterContent') }}</span>
      </div>
      <div class="bold">
        3. {{ $t('rule.regionRestriction') }}：
        <span class="nobold">{{ $t('rule.regionRestrictionContent') }}</span>
      </div>
      <van-divider />
      <div class="bold">
        {{ $t('rule.chapter2Title') }}
      </div>
      <div class="nobold">
        {{ $t('rule.chapter2Intro') }}<span class="bold">{{ $t('rule.directCommission') }}</span>{{ $t('rule.and') }}<span class="bold">{{ $t('rule.teamCommission') }}</span>{{ $t('rule.chapter2Conclusion') }}
      </div>
      <div class="bold">
        {{ $t('rule.section2_1Title') }}
      </div>
      <div>{{ $t('rule.section2_1Content') }}</div>
      <div class="px-10px">
        <ul class="disc">
          <li><span class="bold">{{ $t('rule.calculationModel') }}：</span>{{ $t('rule.calculationContent') }}</li>
          <ul class="circle">
            <li>{{ $t('rule.termExplanationIntro') }}<span class="bold">{{ $t('rule.realAccount') }}</span>{{ $t('rule.termExplanationMiddle') }}<span class="bold">{{ $t('rule.cfdProducts') }}</span>{{ $t('rule.termExplanationEnd') }}</li>
          </ul>
        </ul>
        <ul class="disc">
          <li><span class="bold">{{ $t('rule.rebateSetting') }}：</span></li>
          <ul class="circle">
            <li><span class="bold">{{ $t('rule.defaultCode') }}：</span>{{ $t('rule.defaultCodeContent') }}<span class="bold">100%</span></li>
            <li><span class="bold">{{ $t('rule.customCode') }}：</span>{{ $t('rule.customCodeContent') }}</li>
            <ul class="square">
              <li>{{ $t('rule.yourEarningsFormula') }}</li>
              <li>{{ $t('rule.friendEarningsFormula') }}</li>
            </ul>
          </ul>
          <li><span class="bold">{{ $t('rule.levelImpact') }}：</span>{{ $t('rule.levelImpactContent') }}</li>
        </ul>
        <div class="bold">
          {{ $t('rule.example') }}
        </div>
        <ul class="disc">
          <li><span class="bold">{{ $t('rule.yourStatus') }}：</span>{{ $t('rule.youAre') }}<span class="bold">VIP 2</span>{{ $t('rule.rebateRate') }}<span class="bold">{{ $t('rule.rebateAmount') }}</span></li>
          <li><span class="bold">{{ $t('rule.yourSetup') }}：</span>{{ $t('rule.customCodeSetup') }}<span class="bold">{{ $t('rule.friendRebate40') }}</span>{{ $t('rule.youGet') }}</li>
          <li><span class="bold">{{ $t('rule.inviteeTrades') }}：</span>{{ $t('rule.tradeExample') }}</li>
          <li><span class="bold">{{ $t('rule.profitDistribution') }}：</span></li>
          <ul class="circle">
            <li><span class="bold">{{ $t('rule.totalCommission') }}：</span>{{ $t('rule.commissionFormula') }}<span class="bold">$50</span></li>
            <li><span class="bold">{{ $t('rule.yourDirectCommission') }}：</span>$50 × 60% = <span class="bold">$30</span></li>
            <li><span class="bold">{{ $t('rule.friendRebate') }}：</span>$50 × 40% = <span class="bold">$20</span></li>
          </ul>
        </ul>
      </div>
      <div class="bold">
        {{ $t('rule.teamRebate_1') }}
      </div>
      <div>
        {{ $t('rule.teamRebate_2') }}
      </div>
      <div class="px-10px">
        <ul class="disc">
          <li><span class="bold">{{ $t('rule.trigger_condition') }}</span>{{ $t('rule.you_must') }}<span class="bold">{{ $t('rule.higher_than') }}</span>{{ $t('rule.vip_condition') }}<span class="bold">{{ $t('rule.same_level_condition') }}</span></li>
          <li><span class="bold">{{ $t('rule.calculation_model') }}</span>{{ $t('rule.commission_basis') }}</li>
          <ul class="circle">
            <li>{{ $t('rule.difference_formula') }}</li>
            <li>{{ $t('rule.commission_formula') }}</li>
          </ul>
          <li><span class="bold">{{ $t('rule.commission_depth') }}</span>{{ $t('rule.you_can_get') }}<span class="bold">{{ $t('rule.nine_generations') }}</span>{{ $t('rule.depth_limit') }}</li>
        </ul>
      </div>
      <div class="bold">
        {{ $t('rule.example') }}
      </div>
      <div class="px-10px">
        <ul class="disc">
          <li><span class="bold">{{ $t('rule.network_structure') }}</span></li>
          <ul class="circle">
            <li>{{ $t('rule.you') }}: <span class="bold">VIP 3</span> {{ $t('rule.rebate_base') }}<span class="bold">$8/{{ $t('rule.per_lot') }}</span>)</li>
            <li>{{ $t('rule.direct_partner') }}: <span class="bold">VIP 1</span> {{ $t('rule.rebate_base') }} <span class="bold">$3/{{ $t('rule.per_lot') }}</span>)</li>
            <li>{{ $t('rule.second_level') }}</li>
          </ul>
          <li><span class="bold">{{ $t('rule.team_trading') }}</span>{{ $t('rule.trading_volume') }}</li>
          <li><span class="bold">{{ $t('rule.profit_distribution') }}</span></li>
          <ul class="circle">
            <li><span class="bold">{{ $t('rule.calculate_difference') }}：</span>{{ $t('rule.commission_difference') }}<span class="bold">$5/{{ $t('rule.per_lot') }}</span></li>
            <li><span class="bold">{{ $t('rule.calculate_rebate') }}：</span>{{ $t('rule.rebate_formula') }} <span class="bold">$25</span></li>
            <li><span class="bold">{{ $t('rule.partner_earnings') }}：</span>{{ $t('rule.a_earnings') }} <span class="bold">{{ $t('rule.additional_income') }} </span> {{ $t('rule.no_impact') }}</li>
          </ul>
        </ul>
      </div>
      <van-divider />
      <div class="bold">
        {{ $t('rule.chapter3_title') }}
      </div>
      <div><span class="bold">1. {{ $t('rule.level_evaluation') }}：</span>{{ $t('rule.system_will') }}<span class="bold">{{ $t('rule.update_time') }}</span>{{ $t('rule.update_rule') }}</div>
      <div><span class="bold">2. {{ $t('rule.commission_query') }}：</span>{{ $t('rule.you_can_visit') }}<span class="bold">{{ $t('rule.my_rebate_standard') }}</span>{{ $t('rule.query_description') }}</div>
      <van-divider />
      <div class="bold">
        {{ $t('rule.chapter4_title') }}
      </div>
      <div><span class="bold">1. {{ $t('rule.settlement_title') }}：</span>{{ $t('rule.settlement_part1') }}<span class="bold">{{ $t('rule.settlement_part2') }}</span>{{ $t('rule.settlement_part3') }}<span class="bold">{{ $t('rule.wallet_account') }}</span>{{ $t('rule.settlement_part4') }}</div>
      <div><span class="bold">2. {{ $t('rule.prohibited_title') }}：</span>{{ $t('rule.prohibited_content') }}</div>
      <div><span class="bold">3. {{ $t('rule.independent_title') }}：</span>{{ $t('rule.independent_content') }}</div>
      <div><span class="bold">4. {{ $t('rule.interpretation_title') }}：</span>{{ $t('rule.interpretation_part1') }}<span class="bold">{{ $t('rule.interpretation_part2') }}</span></div>
      <div class="bold">
        {{ $t('rule.agreement_notice') }}
      </div>
    </div>
  </FullPageView>
</template>

<style scoped>
.bold {
  font-weight: bold;
}
.nobold {
  font-weight: 400;
}
.line {
  color: #dededf;
  margin-top: 5px;
  margin-bottom: 5px;
}
.disc {
  list-style-type: disc;
}
.circle {
  list-style-type: circle;
}
.square {
  list-style-type: square;
}
</style>
