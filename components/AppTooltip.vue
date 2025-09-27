<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    icon?: boolean
    text: string
    type?: "error" | "info"
    position?: "top" | "bottom" | "left" | "right"
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
        'pointer-events-none absolute z-50 flex items-center gap-4 px-4 py-2 font-[Rubik] text-sm rounded-lg w-full max-w-2xs sm:max-w-xs break-words transition-opacity duration-200',
        'before:content-[\'\'] before:absolute before:border-solid',
        visible ? 'opacity-100' : 'opacity-0',
        type === 'info' && 'text-[#FFFFFA] bg-[#211D1D]',
        type === 'error' && 'text-[#211D1D] bg-[#FFF4A4]',
        position === 'top' && [
          'bottom-full left-1/2 -translate-x-1/2 mb-2',
          type === 'info' &&
            'before:top-full before:left-1/2 before:-translate-x-1/2 before:border-x-8 before:border-x-transparent before:border-t-8 before:border-t-[#211D1D]',
          type === 'error' &&
            'before:top-full before:left-1/2 before:-translate-x-1/2 before:border-x-8 before:border-x-transparent before:border-t-8 before:border-t-[#FFF4A4]',
        ],
        position === 'bottom' && [
          'top-full left-1/2 -translate-x-1/2 mt-2',
          type === 'info' &&
            'before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-x-8 before:border-x-transparent before:border-b-8 before:border-b-[#211D1D]',
          type === 'error' &&
            'before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-x-8 before:border-x-transparent before:border-b-8 before:border-b-[#FFF4A4]',
        ],
        position === 'left' && [
          'right-full top-1/2 -translate-y-1/2 mr-2',
          type === 'info' &&
            'before:right-[-8px] before:top-1/2 before:-translate-y-1/2 before:border-y-8 before:border-y-transparent before:border-l-8 before:border-l-[#211D1D]',
          type === 'error' &&
            'before:right-[-8px] before:top-1/2 before:-translate-y-1/2 before:border-y-8 before:border-y-transparent before:border-l-8 before:border-l-[#FFF4A4]',
        ],
        position === 'right' && [
          'left-full top-1/2 -translate-y-1/2 ml-2',
          type === 'info' &&
            'before:left-[-8px] before:top-1/2 before:-translate-y-1/2 before:border-y-8 before:border-y-transparent before:border-r-8 before:border-r-[#211D1D]',
          type === 'error' &&
            'before:left-[-8px] before:top-1/2 before:-translate-y-1/2 before:border-y-8 before:border-y-transparent before:border-r-8 before:border-r-[#FFF4A4]',
        ],
      ]"
    >
      <svg
        v-if="icon"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="shrink-0"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.5 11C0.5 5.20101 5.20101 0.5 11 0.5C16.799 0.5 21.5 5.20101 21.5 11C21.5 16.799 16.799 21.5 11 21.5C5.20101 21.5 0.5 16.799 0.5 11ZM11 1.5C5.75329 1.5 1.5 5.75329 1.5 11C1.5 16.2467 5.75329 20.5 11 20.5C16.2467 20.5 20.5 16.2467 20.5 11C20.5 5.75329 16.2467 1.5 11 1.5Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11 6.5C11.2761 6.5 11.5 6.72386 11.5 7V11C11.5 11.2761 11.2761 11.5 11 11.5C10.7239 11.5 10.5 11.2761 10.5 11V7C10.5 6.72386 10.7239 6.5 11 6.5Z"
          fill="currentColor"
        />
        <path
          d="M12 15C12 15.5523 11.5523 16 11 16C10.4477 16 10 15.5523 10 15C10 14.4477 10.4477 14 11 14C11.5523 14 12 14.4477 12 15Z"
          fill="currentColor"
        />
      </svg>
      <span>{{ text }}</span>
    </div>
  </div>
</template>
