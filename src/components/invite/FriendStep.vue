<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import step1 from '@/assets/images/invite/step1.png'
import step2 from '@/assets/images/invite/step2.png'
import step3 from '@/assets/images/invite/step3.png'
import lineImage from '@/assets/images/invite/line.png'
import arrowImage from '@/assets/images/invite/bottom-arrow.png'

defineProps({
  lineImage: {
    type: String,
    default: lineImage,
  },
  arrowImage: {
    type: String,
    default: arrowImage,
  },
})

const { t } = useI18n()

// interface StepItem {
//   index: string
//   title: string
//   description: string
//   icon: string
// }

const title: Ref<string> = computed(() => {
  return t('invite.HowDoIInviteFriends?')
})

const steps = computed(() => {
  return [
    {
      index: '01',
      title: t('invite.SetInvitationCode'),
      description: t('invite.SetInvitationCodeDesc'),
      icon: step1,
    },
    {
      index: '02',
      title: t('invite.ShareInvitationLink'),
      description: t('invite.ShareInvitationLinkDesc'),
      icon: step2,
    },
    {
      index: '03',
      title: t('invite.FriendRegistrationSuccess'),
      description: t('invite.FriendRegistrationSuccessDesc'),
      icon: step3,
    },
  ]
})
</script>

<template>
  <div class="invite-steps-container">
    <div class="title pt-5px">
      <img :src="lineImage" alt="" class="line-img">
      <div class="text">
        {{ title }}
      </div>
    </div>
    <div class="line mb-14px" />
    <div v-for="(step, index) in steps" :key="index" class="steps">
      <div class="step mb-9px flex items-center">
        <div class="step-l w-44px h-44px">
          <img :src="step.icon">
        </div>
        <div class="step-r ml-13px">
          <div class="title-r flex items-center">
            <div class="index">
              {{ step.index }}
            </div>
            <div class="title-text ml-5px">
              {{ step.title }}
            </div>
          </div>
          <div class="sub-title">
            {{ step.description }}
          </div>
        </div>
      </div>
      <div v-if="index < steps.length - 1" class="arrow mb-10px ml-15px">
        <img :src="arrowImage">
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.invite-steps-container {
  height: 306px;
  background: #ffffff;
  border-radius: 8px 8px 8px 8px;
  margin-top: 9px;
  padding: 0 15px;

  .title {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .line-img {
      width: 100px;
      height: 20px;
      transform: translateY(17px);
    }

    .text {
      position: absolute;
      white-space: nowrap;
      font-family:
        PingFang SC,
        PingFang SC;
      font-weight: 600;
      font-size: 18px;
      color: #000000;
      line-height: 37px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }

  .line {
    width: 100%;
    height: 1px;
    padding: 0 15px;
    background-color: #eee;
    margin-top: 20px;
    box-sizing: border-box;
  }

  .steps {
    .step {
      .step-l {
        img {
          width: 50px;
          height: 50px;
        }
      }

      .step-r {
        .title-r {
          .index {
            font-family: Gilroy, Gilroy;
            font-weight: bold;
            font-size: 20px;
            line-height: 37px;
            text-align: left;
            font-style: normal;
            text-transform: none;
            color: transparent;
            background-image: linear-gradient(315.0497797537395deg, #3e7dfe 0%, #1bcc83 100%);
            -webkit-background-clip: text;
            background-clip: text;
            display: inline-block;
          }

          .title-text {
            font-family:
              PingFang SC,
              PingFang SC;
            font-weight: 500;
            font-size: 16px;
            color: #2b2b2e;
            line-height: 19px;
            text-align: left;
            font-style: normal;
            text-transform: none;
          }
        }

        .sub-title {
          font-family:
            PingFang SC,
            PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #2b2b2e;
          line-height: 19px;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
      }
    }

    .arrow {
      width: 12px;
      height: 9px;
    }
  }
}
</style>
