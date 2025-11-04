<script setup lang="ts">
defineProps<{
  paragraphs: string[]
  customClass?: string
}>()

const isExpanded = ref(false)
const textContainer = ref<HTMLElement>()

const toggleExpand = () => {
  if (!textContainer.value) return

  if (!isExpanded.value) {
    const currentHeight = textContainer.value.offsetHeight
    textContainer.value.style.height = currentHeight + "px"

    isExpanded.value = true

    nextTick(() => {
      if (textContainer.value) {
        const targetHeight = textContainer.value.scrollHeight
        textContainer.value.style.height = targetHeight + "px"
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
      />

      <div
        ref="textContainer"
        class="text-container w-full md:max-w-[800px] transition-all duration-500 ease-in-out overflow-hidden"
        @transitionend="onTransitionEnd"
      >
        <p
          class="font-[Manrope] text-[11px] text-[#8F8F8F] font-light text-center w-full whitespace-pre-line sm:text-xs"
        >
          {{ isExpanded ? paragraphs.join("\n\n") : paragraphs[0] }}
        </p>
      </div>

      <ExpandButton
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
</style>
