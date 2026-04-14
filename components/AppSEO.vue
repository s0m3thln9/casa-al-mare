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

.seo-content :deep(ul),
.seo-content :deep(ol) {
  display: table;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 8px;
  line-height: 134%;
}

.seo-content :deep(ul):last-child,
.seo-content :deep(ol):last-child {
  margin-bottom: 0;
}

.seo-content :deep(ol) {
  list-style: none;
  counter-reset: item;
}

.seo-content :deep(ul) {
  list-style: none;
}

.seo-content :deep(ol li),
.seo-content :deep(ul li) {
  margin-bottom: 4px;
  display: flex;
  align-items: flex-start;
}

.seo-content :deep(ul li::before) {
  content: "•";
  flex-shrink: 0;
  margin-right: 6px;
  line-height: 134%;
}

.seo-content :deep(ol li) {
  counter-increment: item;
}

.seo-content :deep(ol li::before) {
  content: counter(item) ". ";
  font-weight: 300;
  flex-shrink: 0;
  margin-right: 4px;
  line-height: 134%;
}

.seo-content :deep(li p) {
  text-align: left;
  margin: 0;
}

.seo-content :deep(ul > li > ul) {
  padding-left: 16px;
}

.seo-content :deep(ul > li > ul > li::before) {
  content: "◦";
}

.seo-content :deep(ul > li > ul > li > ul) {
  padding-left: 32px;
}

.seo-content :deep(ul > li > ul > li > ul > li::before) {
  content: "▪";
}

@media (min-width: 640px) {
  .seo-content :deep(p) {
    font-size: 0.75rem;
  }
}
</style>
