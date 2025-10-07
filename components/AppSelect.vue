<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    options: string[]
    customClass?: string
    modelValue: string | null
    required?: boolean
    errorHideDelay?: number
    searchable?: boolean
  }>(),
  {
    customClass: "",
    required: false,
    errorHideDelay: 3000,
    searchable: false,
  },
)

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

const isDropdownOpen = ref(false)
const selected = ref<string | null>(props.modelValue)
const searchQuery = ref("")
const dropdownRef = ref<HTMLElement | null>(null)
const showError = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const isActive = computed(() => !!selected.value)

watch(
  () => props.modelValue,
  (newValue) => {
    selected.value = newValue
    if (props.required && newValue) {
      clearError()
    }
    // <-- ФИКС: Синхронизируем searchQuery с selected при внешнем обновлении modelValue (если закрыто)
    if (!isDropdownOpen.value && props.searchable) {
      searchQuery.value = newValue || ""
    }
  },
)

// <-- ФИКС: Watch на selected для синхронизации searchQuery (если закрыто)
watch(selected, (newValue) => {
  if (!isDropdownOpen.value && props.searchable) {
    searchQuery.value = newValue || ""
  }
})

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options
  }
  return props.options.filter((option) => option.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const toggleSelect = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  if (props.searchable && isDropdownOpen.value) {
    // <-- ФИКС: Устанавливаем searchQuery = selected при открытии, чтобы input начинался с текущим значением
    searchQuery.value = selected.value || ""
    nextTick(() => inputRef.value?.focus())
  }
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
  // <-- ФИКС: Устанавливаем searchQuery = item (вместо очистки ""), чтобы input показал выбранный текст после закрытия
  searchQuery.value = item
  isDropdownOpen.value = false
  emit("update:modelValue", selected.value!)
  if (props.required) {
    clearError()
  }
}

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  selected.value = target.value || null
  emit("update:modelValue", selected.value)
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
      v-if="!isDropdownOpen && !searchable"
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
        'pt-[21.5px] pb-1.5': isActive && !isDropdownOpen && !searchable,
        'py-[8.75px] h-full max-h-[257.5px]': isDropdownOpen,
      }"
      @click="toggleSelect"
    >
      <div
        v-if="!searchable"
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
        v-else
        class="flex items-center w-full justify-between"
      >
        <input
          ref="inputRef"
          v-model="searchQuery"
          :placeholder="label"
          class="w-full bg-transparent outline-none text-sm font-light text-[#211D1D] sm:text-xs"
          :class="{ 'text-[#8C8785]': !selected }"
          type="text"
          @input="handleSearchInput"
        />
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
          v-for="(item, index) in searchable ? filteredOptions : options"
          :key="index"
          class="w-full rounded-lg border border-[#BBB8B6] py-2 flex items-center justify-center font-[Manrope] text-[15px] font-light hover:bg-[#F3A454] hover:border-[#F3A454] hover:text-[#FFFFFA]"
          :class="[item === selected ? 'bg-[#211D1D] text-[#FFFFFA]' : 'bg-[#FFFFFA] text-[#211D1D]']"
          @click.stop="select(item)"
        >
          {{ item }}
        </div>
        <div
          v-if="searchable && filteredOptions.length === 0 && searchQuery"
          class="w-full py-2 text-center text-xs text-[#8C8785] font-light"
        >
          Город не найден
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
