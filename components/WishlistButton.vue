<script setup lang="ts">
const props = defineProps<{
  customClass?: string
}>()

const styleBase =
  "flex justify-center items-center px-2 py-1.5 rounded-lg border-[0.7px] border-transparent text-[13px]/snug font-[Manrope] sm:text-xs/snug " +
  (props.customClass ? props.customClass + " " : " ")
const styleVariants = {
  default: "bg-[#FFFFFA] text-[#211D1D] cursor-pointer hover:border-[#211D1D]",
  preload: "bg-[#FFFFFA] text-[#211D1D] cursor-default",
  success: "bg-[#FFFFFA] border-[#211D1D] text-[#211D1D] cursor-pointer",
}

const isLoading = ref(false)
const showSuccess = ref(false)

const currentState = computed(() => {
  let content: string
  let style: string
  let disabled: boolean

  if (isLoading.value) {
    content = "Добавление..."
    style = styleBase + styleVariants.preload
    disabled = true
  } else if (showSuccess.value) {
    content = "Убрать из избранного"
    style = styleBase + styleVariants.success
    disabled = false
  } else {
    content = "Добавить в избранное"
    style = styleBase + styleVariants.default
    disabled = false
  }
  return { content, style, disabled }
})
</script>

<template>
  <button
    :class="currentState.style"
    :disabled="currentState.disabled"
  >
    {{ currentState.content }}
  </button>
</template>

<style scoped></style>
