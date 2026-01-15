<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    icon?: boolean
    text: string
    type?: "error" | "info"
    position?: "top" | "bottom" | "left" | "right" | "lefttop"
    show?: boolean
    autoHide?: boolean
    hideDelay?: number
  }>(),
  {
    icon: true,
    type: "info",
    position: "top",
    show: false,
    autoHide: true,
    hideDelay: 3000,
  },
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
}>()

const visible = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.show,
  (val) => {
    if (val) {
      visible.value = true
      if (props.autoHide) {
        if (hideTimer) clearTimeout(hideTimer)
        hideTimer = setTimeout(() => {
          visible.value = false
          emit("update:show", false)
        }, props.hideDelay)
      }
    } else {
      visible.value = false
      if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = null
      }
    }
  },
)
</script>

<template>
  <div class="relative flex items-center">
    <slot />
    <div
      :class="[
        'pointer-events-none absolute z-50 flex items-center gap-4 px-4 py-2 font-[Rubik] text-sm leading-[1] rounded-lg w-full max-w-2xs sm:max-w-xs break-words transition-opacity duration-200',
        'before:content-[\'\'] before:absolute before:border-solid',
        visible ? 'opacity-100' : 'opacity-0',
        type === 'info' && 'text-[#FFFFFA] bg-[#211D1D]',
        type === 'error' && 'text-[#211D1D] bg-[#FFF4A4]',
        position === 'top' && [
          'bottom-full left-1/2 -translate-x-1/2 mb-2',
          `before:top-full before:left-1/2 before:-translate-x-1/2 before:border-x-8 before:border-x-transparent before:border-t-8 ${
            type === 'info' ? 'before:border-t-[#211D1D]' : 'before:border-t-[#FFF4A4]'
          }`,
        ],
        position === 'bottom' && [
          'top-full left-1/2 -translate-x-1/2 mt-2',
          `before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-x-8 before:border-x-transparent before:border-b-8 ${
            type === 'info' ? 'before:border-b-[#211D1D]' : 'before:border-b-[#FFF4A4]'
          }`,
        ],
        position === 'left' && [
          'right-full top-1/2 -translate-y-1/2 mr-2',
          `before:right-[-8px] before:top-1/2 before:-translate-y-1/2 before:border-y-8 before:border-y-transparent before:border-l-8 ${
            type === 'info' ? 'before:border-l-[#211D1D]' : 'before:border-l-[#FFF4A4]'
          }`,
        ],
        position === 'right' && [
          'left-full top-1/2 -translate-y-1/2 ml-2',
          `before:left-[-8px] before:top-1/2 before:-translate-y-1/2 before:border-y-8 before:border-y-transparent before:border-r-8 ${
            type === 'info' ? 'before:border-r-[#211D1D]' : 'before:border-r-[#FFF4A4]'
          }`,
        ],
        position === 'lefttop' && [
          'bottom-full left-0 -translate-x-1/2 mb-2',
          `before:top-full before:left-1/2 before:-translate-x-1/2 before:border-x-8 before:border-x-transparent before:border-t-8 ${
            type === 'info' ? 'before:border-t-[#211D1D]' : 'before:border-t-[#FFF4A4]'
          }`,
         ],
      ]"
    >
      <div
        v-if="icon"
        class="sign-icon shrink-0 w-[22px] h-[22px]"
      />
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<style scoped>
.sign-icon {
  background-image: url("/sign.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
