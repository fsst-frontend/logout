<script setup lang="ts">
import { computed } from 'vue'

interface Tab {
  name: string
  label: string
  icon?: string
}

const props = withDefaults(defineProps<{
  tabList?: Tab[]
  activeTab?: string
}>(), {
  tabList: () => [],
  activeTab: '',
})

const emit = defineEmits<{
  (e: 'update:activeTab', name: string): void
}>()

const activeTabIndex = computed(() => {
  return props.tabList.findIndex(tab => tab.name === props.activeTab)
})

const tabWidth = computed(() => {
  return 100 / props.tabList.length
})

function onTabClick(name: string) {
  emit('update:activeTab', name)
}
</script>

<template>
  <div class="tab-list-cnt">
    <div class="tab-list">
      <div
        v-for="tab in tabList"
        :key="tab.name"
        class="tab-item lh-1em text-center"
        :class="{ active: activeTab === tab.name }"
        @click="onTabClick(tab.name)"
      >
        <div class="p-15px">
          {{ tab.label }}
        </div>
      </div>
      <div
        v-if="tabList.length > 0"
        :style="{
          transform: `translateX(${activeTabIndex * 100}%)`,
          width: `${tabWidth}%`,
        }"
        class="tab-selected"
      >
        <div class="left" />
        <div class="right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-list-cnt {
  position: sticky;
  top: 0;
  border-radius: 12px 12px 0 0;
  background-color: #f2f6ff;
  overflow: hidden;
  z-index: 2;
}

.tab-list {
  position: relative;
  display: flex;
  border-radius: 12px 12px 0 0;
}

.tab-item {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 36px;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: color 0.2s;
}

.tab-item.active {
  color: #333;
  font-weight: 700;
}

.tab-selected {
  position: absolute;
  height: 52px;
  background: #ffffff;
  border-radius: 12px 12px 0 0;
  box-shadow:
    24px 40px 0 #ffffff,
    -24px 40px 0 0 #ffffff;
  opacity: 1;
  z-index: -1;
  transition: 0.2s ease-in-out;
}

.tab-selected .left,
.tab-selected .right {
  position: absolute;
  width: 12px;
  height: 52px;
}

.tab-selected .left {
  background: #f2f6ff;
  transform: skewX(-15deg);
  left: -18px;
  border-bottom-right-radius: 12px;
}

.tab-selected .right {
  background: #f2f6ff;
  transform: skewX(15deg);
  right: -18px;
  border-bottom-left-radius: 12px;
}

.tab-selected::before,
.tab-selected::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 52px;
}

.tab-selected::before {
  background: #ffffff;
  transform: skewX(-15deg);
  left: -6px;
  border-top-left-radius: 12px;
}

.tab-selected::after {
  background: #ffffff;
  transform: skewX(15deg);
  right: -6px;
  border-top-right-radius: 12px;
}
</style>
