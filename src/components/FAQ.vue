<script setup lang="ts">
import { ref } from 'vue'
import RightArrow from '@/assets/images/invite/angle_arrow_down.png'

interface FAQItem {
  question: string
  answer: string
}

const props = withDefaults(defineProps<{
  faqData: FAQItem[]
  title?: string
  defaultOpen?: boolean
}>(), {
  title: '常见问题',
  defaultOpen: true,
})

const activeIndex = ref<number | null>(props.defaultOpen ? 0 : null)
const answerRefs = ref<HTMLElement[]>([])

function toggleItem(index: number) {
  activeIndex.value = activeIndex.value === index ? null : index
}
</script>

<template>
  <div class="faq-container">
    <h2>
      <van-divider class="faq-title">
        {{ title }}
      </van-divider>
    </h2>

    <div
      v-for="(item, index) in faqData"
      :key="index"
      class="faq-item"
    >
      <div
        class="faq-question"
        @click="toggleItem(index)"
      >
        <div class="question-header">
          {{ index + 1 }}.
          <span class="question-text">{{ item.question }}</span>
          <span class="question-arrow" :class="{ 'arrow-down': activeIndex === index }">
            <img :src="RightArrow" alt="arrow" class="arrow-icon">
          </span>
        </div>
      </div>

      <div
        ref="answerRefs"
        class="faq-answer"
        :class="{ 'answer-expanded': activeIndex === index }"
      >
        <div>{{ item.answer }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.faq-container {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
  font-family: 'PingFang SC', sans-serif;

  .faq-title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    color: #000;
  }

  .faq-item {
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .faq-question {
      cursor: pointer;

      .question-header {
        display: flex;
        align-items: center;

        .question-text {
          flex: 1;
          font-family:
            PingFang SC,
            PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #2b2b2e;
          line-height: 32px;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }

        .question-arrow {
          transition: transform 0.3s ease;
          color: #999;
          display: flex;
          align-items: center;

          .arrow-icon {
            width: 12px;
            height: 12px;
            transform: rotate(180deg); // Default state (arrow up)
          }

          &.arrow-down {
            .arrow-icon {
              transform: rotate(0deg); // Rotated state (arrow down)
            }
          }
        }
      }
    }

    .faq-answer {
      display: grid;
      grid-template-rows: 0fr;
      padding-bottom: 8px;
      color: #666;
      transition: grid-template-rows 0.3s ease;
      font-size: 12px;

      > div {
        overflow: hidden;
        font-family:
          PingFang SC,
          PingFang SC;
        font-weight: 400;
        font-size: 12px;
        color: #8b8b8b;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }

      &.answer-expanded {
        grid-template-rows: 1fr;
      }
    }
  }
}
</style>
