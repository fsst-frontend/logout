<script setup lang='tsx'>
defineProps({
  headerBg: {
    type: Object,
  },
  footerBg: {
    type: Object,
  },
  hasFooter: {
    type: Boolean,
    default: true,
  },
})

const headerRef = ref<HTMLElement>()
onMounted(() => {
  const header = headerRef.value
  if (header) {
    const headerPaddingTop = getComputedStyle(header).paddingTop
    if (headerPaddingTop === '0px') {
      const safeAreaTop = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top')
      if (safeAreaTop) {
        header.style.paddingTop = `${safeAreaTop}`
      }
    }
  }
})
</script>

<template>
  <div class="flex flex-col h-100vh">
    <div ref="headerRef" class="van-safe-area-top" :style="headerBg">
      <slot name="header" />
    </div>
    <div class="flex-1 overflow-auto">
      <slot />
    </div>
    <div v-if="hasFooter" :style=" footerBg " class="van-safe-area-bottom">
      <slot name="footer" />
    </div>
  </div>
</template>
