<script setup lang="ts">
const props = defineProps<{
  variant?: "primary" | "secondary"
  content?: string
  customClass?: string
  disabled?: boolean
  isLoading?: boolean
  showSuccess?: boolean
  extra?: boolean
}>()

const styleBase =
  "flex justify-center items-center px-5 py-2 border rounded-2xl text-[13px]/snug font-[Manrope] font-light sm:text-sm/snug sm:font-normal " +
  (props.customClass ? props.customClass + " " : " ")
const styleVariants = {
  default: {
    primary: `bg-[#211D1D] border-[#211D1D] text-[#FFFFFA] cursor-pointer ${props.extra ? "hover:bg-[#F3A454] hover:border-[#F3A454]" : "hover:bg-[#FFFFFA] hover:border-[#211D1D] hover:text-[#211D1D]"}`,
    secondary:
      "bg-[#FFFFFA] border-[#211D1D] text-[#211D1D] cursor-pointer hover:bg-[#211D1D] hover:border-[#211D1D] hover:text-[#FFFFFA]",
  },
  preload: "bg-[#FFFFFA] border-[#F3A454] text-[#F3A454] cursor-default",
  success: "bg-[#FFF4A4] border-[#211D1D] text-[#211D1D] cursor-default",
  disabled: "bg-[#FFFFFA] border-[#8C8785] text-[#8C8785] cursor-default",
}

const currentState = computed(() => {
  let content: string
  let style: string
  let disabled: boolean

  if (props.isLoading) {
    content = "Загрузка..."
    style = styleBase + styleVariants.preload
    disabled = true
  } else if (props.showSuccess) {
    content = props.content!
    style = styleBase + styleVariants.success
    disabled = true
  } else if (props.disabled) {
    content = props.content!
    style = styleBase + styleVariants.disabled
    disabled = true
  } else if (props.variant === "primary") {
    content = props.content!
    style = styleBase + styleVariants.default.primary
    disabled = false
  } else {
    content = props.content!
    style = styleBase + styleVariants.default.secondary
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
