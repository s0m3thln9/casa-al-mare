<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    options: string[]
    customClass?: string
    modelValue: string | null
    required?: boolean
    errorHideDelay?: number
  }>(),
  {
    customClass: "",
    required: false,
    errorHideDelay: 3000,
  },
)

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

const isDropdownOpen = ref(false)
const selected = ref<string | null>(props.modelValue)
const dropdownRef = ref<HTMLElement | null>(null)
const showError = ref(false)

const isActive = computed(() => !!selected.value)

watch(
  () => props.modelValue,
  (newValue) => {
    selected.value = newValue
    if (props.required && newValue) {
      clearError()
    }
  },
)

const toggleSelect = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

let hideTimer: ReturnType<typeof setTimeout> | null = null

const triggerError = () => {
  showError.value = true
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    showError.value = false
  }, props.errorHideDelay)
}

const clearError = () => {
  showError.value = false
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const validate = () => {
  if (props.required && !selected.value) {
    triggerError()
    return false
  }
  clearError()
  return true
}

watch(isDropdownOpen, (newValue) => {
  if (!newValue) {
    validate()
  }
})

const select = (item: string) => {
  selected.value = item
  isDropdownOpen.value = false
  emit("update:modelValue", selected.value!)
  if (props.required) {
    clearError()
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside)
})

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

defineExpose({ validate, showError })
</script>

<template>
  <div
    ref="dropdownRef"
    class="relative font-[Manrope] font-light text-sm text-[#211D1D] select-none cursor-pointer sm:text-xs"
    :class="customClass"
  >
    <label
      v-if="!isDropdownOpen"
      class="absolute top-3.5 left-2.5 font-[Manrope] font-light text-sm text-[#8C8785] transition-all duration-200 pointer-events-none sm:text-xs"
      :class="{ '!top-[3px] text-[#8C8785]': isActive, 'text-[#5E5B58]': !isActive }"
    >
      {{ label }}
      <span
        v-if="props.required"
        class="text-[#E29650]"
        >*</span
      >
    </label>
    <div
      class="relative h-[44px] w-full flex-col px-2.5 border-[0.7px] rounded-lg flex items-center justify-center"
      :class="{
        'border-[#E29650]': showError === true && !isDropdownOpen,
        'border-[#211D1D]': isActive || isDropdownOpen,
        'border-[#B8B8B6]': !isActive && !isDropdownOpen && showError === false,
        'pt-[21.5px] pb-1.5': isActive && !isDropdownOpen,
        'py-[8.75px] h-full max-h-[257.5px]': isDropdownOpen,
      }"
      @click="toggleSelect"
    >
      <div
        class="flex items-center w-full"
        :class="[isActive && !isDropdownOpen ? 'justify-between' : 'justify-end']"
      >
        <span
          v-if="selected !== null && !isDropdownOpen"
          class="text-sm font-light text-[#211D1D] font-[Manrope] sm:text-xs"
        >
          {{ selected }}
        </span>
        <button class="w-4 h-4 flex justify-center items-center cursor-pointer focus:outline-none">
          <NuxtImg
            src="/chevron-down.svg"
            class="w-full"
            :class="isDropdownOpen ? 'rotate-180' : 'rotate-0'"
          />
        </button>
      </div>
      <div
        class="flex flex-col gap-2 w-full pr-3 collapsible-div transition-max-height duration-300 ease-in-out overflow-y-scroll"
        :class="[isDropdownOpen ? 'max-h-500 opacity-100 mt-2' : 'max-h-0 opacity-0']"
      >
        <div
          v-for="(item, index) in options"
          :key="index"
          class="w-full rounded-lg border border-[#BBB8B6] py-2 flex items-center justify-center font-[Manrope] text-[15px] font-light hover:bg-[#F3A454] hover:border-[#F3A454] hover:text-[#FFFFFA]"
          :class="[item === selected ? 'bg-[#211D1D] text-[#FFFFFA]' : 'bg-[#FFFFFA] text-[#211D1D]']"
          @click.stop="select(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.collapsible-div {
  transition-property: max-height, opacity;
}
</style>
