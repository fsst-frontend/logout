<script setup lang="ts">
import jsBridge from '@/utils/jsBridge'
import { useRouter } from 'vue-router'

const router = useRouter()

const isChinese = computed(() => {
  const userInfoVal = JSON.parse(localStorage.getItem('userInfo'))
  return userInfoVal
    && (userInfoVal.language_code === 'zh-Hant'
      || userInfoVal.language_code === 'zh-Hans'
      || userInfoVal.language === 'zh-Hant'
      || userInfoVal.language === 'zh-Hans')
})

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
      <div v-if="isChinese">
        <p><strong>Futren 合作伙伴计划：规则与条款</strong></p>

        <p><strong>序言：构建网络，共创价值</strong></p>
        <p>
          感谢您选择 Future
          Invest。为嘉奖我们尊贵的合作伙伴，现正式发布全面升级的"合作伙伴计划"。此计划旨在为您提供一个强大、透明且具备双重收益引擎的合作框架。您不仅能从直接邀请的好友中获得丰厚返佣，更能通过构建自己的合作伙伴网络，解锁持续的团队收益。
        </p>

        <p><strong>第一章：参与资格与方式</strong></p>
        <ol>
          <li>
            <strong>1. 参与方式</strong>：所有 Futren
            用户均可使用个人专属的邀请链接或邀请码，邀请新用户注册和交易，以建立合作伙伴关系。
          </li>
          <li>
            <strong>2. 数据中心</strong>：您可在「邀请好友」内，实时追踪邀请数据、分析佣金报告，并获取邀请的链接。
          </li>
          <li>
            <strong>3. 地区限制</strong>：本计划遵循国际法规，不向服务受限国家或地区的用户开放。Future
            Invest 保留随时更新此名单的权利。
          </li>
        </ol>

        <p><strong>第二章：双重收益引擎：直接返佣与团队返佣</strong></p>
        <p>
          这是本计划的核心。您的收益由<strong>直接返佣</strong>和<strong>团队返佣</strong>两部分构成，为您带来指数级增长的潜力。
        </p>

        <p><strong>第 2.1 ：直接返佣（一级收益）</strong></p>
        <p>您从直接邀请的用户（一级受邀人）的交易中获得的佣金。</p>
        <ul class="disc pl-15px">
          <li>
            <strong>计算模型</strong>：佣金基于 "等级返佣基数"
            进行计算。我们为每种差价合约（CFD）品种在不同VIP等级下设定了明确的返佣标准（美元/标准手）。
            <ul class="circle pl-15px">
              <li>
                <em>专业术语说明：合资格交易指用户在<strong>真实交易账户</strong>中，所有已平仓的<strong>差价合约（CFD）产品</strong>订单，这涵盖了标准的杠杆交易以及通过跟单社区（Copy
                  Trading）发起的交易。</em>
              </li>
            </ul>
          </li>
          <li>
            <strong>返佣比例设定</strong>：
            <ul class="circle pl-15px">
              <li>
                <strong>默认邀请码</strong>：自动为您生成，您将获得一级受邀人交易返佣的 <strong>100%</strong>。
              </li>
              <li>
                <strong>自定义邀请码</strong>：您可以创建多个邀请码，并为每个邀请码设定
                "好友回赠比例" （例如 40%）。此比例一旦设定，对该受邀人永久有效。
              </li>
              <ul class="square pl-15px">
                <li>您的收益 = 100% - 好友回赠比例</li>
                <li>好友收益 = 好友回赠比例</li>
              </ul>
            </ul>
          </li>
          <li>
            <strong>等级的影响</strong>：您的VIP等级越高，所享有的"返佣基数"也越高。您与好友的<strong>分成比例不变</strong>，但由于佣金基数提升，双方获得的实际金额会同步增加。
          </li>
        </ul>

        <p><strong>【示例】</strong></p>
        <ul class="disc pl-15px">
          <li>
            <strong>您的状态</strong>：您是 <strong>VIP 2</strong> 等级，XAUUSD 的返佣基数为 <strong>$5/手</strong>。
          </li>
          <li>
            <strong>您的设定</strong>：您创建了一个自定义码，设定<strong>好友回赠 40%</strong>（即您获得
            60%）。
          </li>
          <li>
            <strong>一级受邀人交易</strong>：该好友交易了 10 手 XAUUSD。
          </li>
          <li>
            <strong>收益分配</strong>：
            <ol type="a">
              <li>
                <strong>a. 产生总佣金</strong>：10 手 × $5/手 = <strong>$50</strong>
              </li>
              <li>
                <strong>b. 您的直接返佣</strong>：$50 × 60% = <strong>$30</strong>
              </li>
              <li>
                <strong>c. 好友获得回赠</strong>：$50 × 40% = <strong>$20</strong>
              </li>
            </ol>
          </li>
        </ul>

        <p><strong>第 2.2 ：团队返佣（网络收益）</strong></p>
        <p>
          当您的合作伙伴网络不断延伸，您可以从更深层级的用户（二代及以后，我们统称为您的"团队成员"）交易中赚取佣金，这部分收益称为团队返佣。
        </p>
        <ul class="disc pl-15px">
          <li>
            <strong>触发条件</strong>：您必须<strong>高于</strong>您的一级伙伴的VIP等级，才能赚取来自他整个团队的返佣。<strong>如果你们等级相同，则无法触发</strong>。
          </li>
          <li>
            <strong>计算模型</strong>：团队返佣基于 "等级佣金基数差额" 计算。
            <ul class="circle pl-15px">
              <li>等级佣金基数差额 = 您的返佣基数 - 您下级伙伴的返佣基数</li>
              <li>您的团队返佣 = 等级佣金基数差额 × 团队成员的交易手数</li>
            </ul>
          </li>
          <li>
            <strong>返佣深度</strong>：您最多可以获得 <strong>9 代</strong>团队成员所产生的团队返佣。超过 9
            代的网络层级将不再为您产生团队返佣。
          </li>
        </ul>

        <p><strong>【示例】</strong></p>
        <ul class="disc pl-15px">
          <li>
            <strong>网络结构与等级</strong>：
            <ul class="circle pl-15px">
              <li>您：<strong>VIP 3</strong> (XAUUSD 返佣基数 = <strong>$8/手</strong>)</li>
              <li>您的一级伙伴 A：<strong>VIP 1</strong> (XAUUSD 返佣基数 = <strong>$3/手</strong>)</li>
              <li>A的受邀人 B (即您的二代成员)：非VIP (无返佣基数)</li>
            </ul>
          </li>
          <li>
            <strong>团队成员交易</strong>：B 交易了 5 手 XAUUSD。
          </li>
          <li>
            <strong>收益分配</strong>：
            <ol>
              <li>
                <strong>a. 计算佣金差额</strong>：您的等级高于 A，触发团队返佣。佣金基数差额 =
                $8/手 (您的佣金基数) - $3/手 (A的佣金基数) = <strong>$5/手</strong>。
              </li>
              <li>
                <strong>b. 计算您的团队返佣</strong>：$5/手 (佣金基数差额) × 5 手 (B的交易量) =
                <strong>$25</strong>。
              </li>
              <li>
                <strong>c. 伙伴A的收益</strong>：A 仍按其规则赚取 B 的直接返佣。A 的收益 = $3/手 ×
                5 手 = $15
                （假设A给B的回赠是0%）。您的团队返佣是<strong>额外获得</strong>的，不影响您下级的收益。
              </li>
            </ol>
          </li>
        </ul>

        <p><strong>第三章：VIP 等级与返佣基数</strong></p>
        <ol>
          <li>
            <strong>1. 等级评估</strong>：系统将于<strong>每月1日 00:00 (UTC)</strong>
            根据您上月的邀请及交易表现，自动更新您的VIP等级。新等级及对应的返佣基数将在当月生效。
          </li>
          <li>
            <strong>2. 佣金基数查询</strong>：您可以随时访问「邀请好友」内的"<strong>我的返佣标准</strong>"页面，查看您当前等级下，所有交易品种的详细返佣基数。请注意，您仅能看到自己当前等级所对应的费率标准。
          </li>
        </ol>

        <p><strong>第四章：佣金结算与其他条款</strong></p>
        <ol>
          <li>
            <strong>1. 结算与发放</strong>：所有佣金（直接返佣与团队返佣）均在相关订单<strong>平仓后实时结算</strong>，并以美元（USD）即刻存入您的
            Futren 的<strong>钱包</strong>账户。
          </li>
          <li>
            <strong>2. 禁止行为</strong>：严禁任何形式的欺诈与滥用行为，包括但不限于自我邀请、恶意刷单、利用品牌关键词进行付费广告、建立误导性网站等。一经查实，Future
            Invest
            有权永久取消您的合作伙伴资格，并没收所有已产生和未结算的佣金。
          </li>
          <li>
            <strong>3. 独立身份</strong>：您以独立合作伙伴身份参与本计划，并非 Futren
            的雇员或代理人，无权代表本公司。
          </li>
          <li>
            <strong>4. 最终解释权</strong>：Futren
            保留对本计划所有条款的最终解释权，并有权根据市场情况进行调整。若条款有语言版本差异，以<strong>英文版本</strong>为准。
          </li>
        </ol>

        <p><strong>当您开始进行任何邀请行为时，即视为您已完全理解并同意遵守以上所有规则与条款。</strong></p>
      </div>
      <div v-else>
        <p><strong>Partner Program: Rules & Terms</strong></p>

        <p><strong>Preamble: Building Your Network, Creating Value Together</strong></p>
        <p>
          Thank you for choosing Futren. To reward our valued partners, we
          are pleased to officially launch our comprehensively upgraded "Partner
          Program." This program is designed to provide you with a powerful,
          transparent, and robust framework featuring a dual revenue engine. You
          will not only earn generous commissions from your direct invitees but
          also unlock continuous team earnings by building your own partner
          network.
        </p>

        <p><strong>Chapter 1: Eligibility and Participation</strong></p>
        <ol>
          <li>
            <strong>1. How to Participate:</strong> All Futren users can use their
            personal, unique invitation link or code to invite new users to
            register and trade, thereby establishing a partnership.
          </li>
          <li>
            <strong>2. Partner Dashboard:</strong> Within the "Invite Friends" dashboard, you
            can track invitation data in real-time, analyze commission reports,
            and access your invitation links.
          </li>
          <li>
            <strong>3. Regional Restrictions:</strong> This program adheres to international
            regulations and is not available to users in restricted countries or
            regions. Futren reserves the right to update this list at any
            time.
          </li>
        </ol>

        <p><strong>Chapter 2: The Dual Revenue Engine: Direct & Team Commissions</strong></p>
        <p>
          This is the core of the program. Your earnings are composed of two
          parts---Direct Commission and Team Commission---offering you the
          potential for exponential growth.
        </p>

        <p><strong>Article 2.1: Direct Commission (Tier 1 Earnings)</strong></p>
        <p>
          This is the commission you earn from the trades of your directly invited
          users (Tier 1 Invitees).
        </p>
        <ul class="disc pl-15px">
          <li>
            <strong>Calculation Model:</strong> Commissions are calculated based on the
            <strong>"Commission Base Rate by Tier."</strong> We have set a defined commission
            standard (in USD per standard lot) for each CFD product at different
            VIP tiers.
            <ul class="circle pl-15px">
              <li>
                <strong>Terminology Note:</strong> Eligible Trades refer to all closed CFD product
                orders in a user's real trading account. This includes standard
                leveraged trades as well as trades initiated through the Copy Trading
                community.
              </li>
            </ul>
          </li>
          <li>
            <strong>Commission Rate Setting:</strong>
            <ul class="circle pl-15px">
              <li>
                <strong>Default Invitation Code:</strong> This is automatically generated for you.
                You will receive 100% of the commission generated from your Tier 1
                Invitees' trades.
              </li>
              <li>
                <strong>Custom Invitation Codes:</strong> You can create multiple invitation codes
                and set a <strong>"Friend Rebate Rate"</strong> for each (e.g., 40%). Once set,
                this rate is permanently effective for that invitee.
                <ul class="square pl-15px">
                  <li>Your Earnings = 100% - Friend Rebate Rate</li>
                  <li>Friend's Earnings = Friend Rebate Rate</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <strong>Impact of VIP Tier:</strong> The higher your VIP tier, the higher your
            "Commission Base Rate." While your profit-sharing ratio with your
            friend remains the same, the actual monetary amounts you both receive
            will increase in sync due to the higher commission base.
          </li>
        </ul>

        <p><strong>[Example]</strong></p>
        <ul class="disc pl-15px">
          <li>
            <strong>Your Status:</strong> You are VIP Tier 2, and the commission base rate for
            XAUUSD is $5/lot.
          </li>
          <li>
            <strong>Your Setting:</strong> You create a custom code with a 40% Friend Rebate
            (meaning you earn 60%).
          </li>
          <li>
            <strong>Tier 1 Invitee's Trade:</strong> This friend trades 10 lots of XAUUSD.
          </li>
          <li>
            <strong>Payout Distribution:</strong>
            <ol type="a">
              <li>
                <strong>a. Total Commission Generated:</strong> 10 lots × $5/lot = $50
              </li>
              <li>
                <strong>b. Your Direct Commission:</strong> $50 × 60% = $30
              </li>
              <li>
                <strong>c. Friend's Rebate:</strong> $50 × 40% = $20
              </li>
            </ol>
          </li>
        </ul>

        <p><strong>Article 2.2: Team Commission (Network Earnings)</strong></p>
        <p>
          As your partner network expands, you can earn commission from the trades
          of deeper-level users (Tier 2 and beyond, collectively referred to as
          your "Team Members"). This is known as Team Commission.
        </p>
        <ul class="disc pl-15px">
          <li>
            <strong>Triggering Condition:</strong> You must have a <strong>higher VIP tier than your
              direct partner</strong> to earn commissions from their entire team. If your
            tiers are the same, this commission will not be triggered.
          </li>
          <li>
            <strong>Calculation Model:</strong> Team Commission is calculated based on the
            <strong>"Commission Rate Spread"</strong> between tiers.
            <ul class="circle pl-15px">
              <li>
                <strong>Commission Rate Spread</strong> = Your Commission Base Rate - Your Downline
                Partner's Commission Base Rate
              </li>
              <li>
                <strong>Your Team Commission</strong> = Commission Rate Spread × Trading Volume of
                Team Members
              </li>
            </ul>
          </li>
          <li>
            <strong>Commission Depth:</strong> You can earn Team Commissions from up to <strong>9
              tiers</strong> of Team Members. Network levels beyond 9 tiers will no longer
            generate Team Commissions for you.
          </li>
        </ul>

        <p><strong>[Example]</strong></p>
        <ul class="disc pl-15px">
          <li>
            <strong>Network Structure & Tiers:</strong>
            <ul class="circle pl-15px">
              <li><strong>You:</strong> VIP 3 (XAUUSD Base Rate = $8/lot)</li>
              <li><strong>Your Tier 1 Partner (A):</strong> VIP 1 (XAUUSD Base Rate = $3/lot)</li>
              <li>
                <strong>A's Invitee (B) (Your Tier 2 Member):</strong> Non-VIP (No commission base
                rate)
              </li>
            </ul>
          </li>
          <li>
            <strong>Team Member's Trade:</strong> B trades 5 lots of XAUUSD.
          </li>
          <li>
            <strong>Payout Distribution:</strong>
            <ol type="a">
              <li>
                <strong>a. Calculate the Spread:</strong> Your tier is higher than A's, triggering
                Team Commission. The Commission Rate Spread = $8/lot (Your Rate) -
                $3/lot (A's Rate) = $5/lot.
              </li>
              <li>
                <strong>b. Calculate Your Team Commission:</strong> $5/lot (The Spread) × 5 lots
                (B's Volume) = $25.
              </li>
              <li>
                <strong>c. Partner A's Earnings:</strong> A still earns their direct commission
                from B according to their own rules. A's earnings = $3/lot × 5
                lots = $15 (assuming A's rebate to B is 0%). Your Team Commission
                is an additional earning and does not affect the commissions of your
                downline partners.
              </li>
            </ol>
          </li>
        </ul>

        <p><strong>Chapter 3: VIP Tiers and Commission Base Rates</strong></p>
        <ol>
          <li>
            <strong>1. Tier Assessment:</strong> The system will automatically update your VIP
            tier on the 1st of each month at 00:00 (UTC) based on your
            invitation and trading performance from the previous month. The new
            tier and corresponding commission base rates will be effective for
            the current month.
          </li>
          <li>
            <strong>2. Checking Commission Base Rates:</strong> You can visit the "My
            Commission Standards" page within the "Invite Friends" dashboard
            at any time to view the detailed commission base rates for all
            trading products under your current tier. Please note that you can
            only view the rate standards corresponding to your current tier.
          </li>
        </ol>

        <p><strong>Chapter 4: Commission Settlement and Other Terms</strong></p>
        <ol>
          <li>
            <strong>1. Settlement and Payout:</strong> All commissions (Direct and Team) are
            settled in real-time after the relevant trade is closed and are
            instantly credited to your Futren Wallet Account in USD.
          </li>
          <li>
            <strong>2. Prohibited Activities:</strong> Any form of fraudulent or abusive
            activity is strictly prohibited, including but not limited to
            self-invitation (self-referral), malicious trading (churning), using
            brand keywords for paid advertising, or creating misleading
            websites. If verified, Futren has the right to permanently
            revoke your partner qualification and forfeit all earned and
            unsettled commissions.
          </li>
          <li>
            <strong>3. Independent Contractor Status:</strong> You participate in this program
            as an independent partner, not as an employee or agent of Future
            Invest, and you have no authority to represent the company.
          </li>
          <li>
            <strong>4. Right of Final Interpretation:</strong> Futren reserves the right
            of final interpretation of all terms of this program and the right
            to make adjustments based on market conditions. In case of any
            discrepancy between language versions of these terms, the <strong>English
              version</strong> shall prevail.
          </li>
        </ol>

        <p>
          By initiating any invitation activity, you are deemed to have fully
          understood and agreed to comply with all the rules and terms listed
          above.
        </p>
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
