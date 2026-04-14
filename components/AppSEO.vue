<script setup lang="ts">
defineProps<{
  content: string
  customClass?: string
}>()

const isExpanded = ref(false)
const textContainer = ref<HTMLElement>()
const innerContent = ref<HTMLElement>()
const hasOverflow = ref(false)

onMounted(() => {
  if (!innerContent.value) return
  hasOverflow.value = innerContent.value.scrollHeight > innerContent.value.offsetHeight
})

const toggleExpand = () => {
  if (!textContainer.value) return

  if (!isExpanded.value) {
    const currentHeight = textContainer.value.offsetHeight
    textContainer.value.style.height = currentHeight + "px"

    isExpanded.value = true

    nextTick(() => {
      if (textContainer.value) {
        textContainer.value.style.height = textContainer.value.scrollHeight + "px"
      }
    })
  } else {
    const currentHeight = textContainer.value.scrollHeight
    textContainer.value.style.height = currentHeight + "px"

    void textContainer.value.offsetHeight

    isExpanded.value = false

    nextTick(() => {
      if (textContainer.value) {
        textContainer.value.style.height = "auto"
        const targetHeight = textContainer.value.offsetHeight

        textContainer.value.style.height = currentHeight + "px"

        void textContainer.value.offsetHeight

        textContainer.value.style.height = targetHeight + "px"
      }
    })
  }
}

const onTransitionEnd = () => {
  if (textContainer.value) {
    textContainer.value.style.height = "auto"
  }
}
</script>

<template>
  <div :class="['px-4 py-3 flex justify-center items-center sm:py-0', customClass]">
    <div class="flex flex-col items-center gap-6 pt-10 pb-6 px-6 border border-[#BBB8B6] rounded-2xl w-full sm:pt-12">
      <img
        src="/logo-2.svg"
        alt="CASA AL MARE"
        width="230"
        height="31"
      >

      <div
        ref="textContainer"
        class="text-container w-full md:max-w-[800px] overflow-hidden"
        @transitionend="onTransitionEnd"
      >
        <div
          ref="innerContent"
          :class="['seo-content', { 'seo-content--collapsed': !isExpanded }]"
          v-html="content"
        />
      </div>

      <ExpandButton
        v-if="hasOverflow"
        :is-expanded="isExpanded"
        @toggle-expand="toggleExpand"
      />
    </div>
  </div>
</template>

<style scoped>
.text-container {
  transition: height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@media (prefers-reduced-motion: reduce) {
  .text-container {
    transition: none !important;
  }
}

.seo-content--collapsed {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.seo-content :deep(p) {
  font-family: Manrope, sans-serif;
  font-size: 11px;
  color: #8F8F8F;
  font-weight: 300;
  text-align: center;
  width: 100%;
  margin: 0;
}

.seo-content :deep(p + p) {
  margin-top: 0.4em;
}

@media (min-width: 640px) {
  .seo-content :deep(p) {
    font-size: 0.75rem;
  }
}
</style>
