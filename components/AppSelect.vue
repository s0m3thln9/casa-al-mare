<script setup lang="ts">
interface CityData {
  label: string
  name: string
  kladr: string
  fias: string
  region?: string
}

const props = withDefaults(
  defineProps<{
    label: string
    options?: string[]
    customClass?: string
    modelValue: CityData | string | null
    required?: boolean
    errorHideDelay?: number
    searchable?: boolean
    asyncSearch?: boolean
    asyncSearchUrl?: string
    cityMode?: boolean
  }>(),
  {
    options: () => [],
    customClass: "",
    required: false,
    errorHideDelay: 3000,
    searchable: false,
    asyncSearch: false,
    asyncSearchUrl: "",
    cityMode: false,
  },
)

const emit = defineEmits<{
  (e: "update:modelValue", value: CityData | string): void
}>()

const isDropdownOpen = ref(false)
const selected = ref<CityData | string | null>(props.modelValue)
const searchQuery = ref("")
const dropdownRef = ref<HTMLElement | null>(null)
const showError = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)
const asyncOptions = ref<CityData[]>([])
const searchTimeout = ref<NodeJS.Timeout | null>(null)

const displayValue = computed(() => {
  if (!selected.value) return ""
  if (props.cityMode && typeof selected.value === "object") {
    return selected.value.label
  }
  return typeof selected.value === "string" ? selected.value : ""
})

const isActive = computed(() => !!selected.value)

watch(
  () => props.modelValue,
  (newValue) => {
    selected.value = newValue
    if (props.required && newValue) {
      clearError()
    }
    if (!isDropdownOpen.value && props.searchable) {
      searchQuery.value = displayValue.value
      nextTick(() => {
        if (inputRef.value) {
          inputRef.value.value = searchQuery.value
        }
      })
    }
  },
)

watch(selected, (newValue) => {
  if (!isDropdownOpen.value && props.searchable) {
    searchQuery.value = displayValue.value
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.value = searchQuery.value
      }
    })
  }
})

const filteredOptions = computed(() => {
  let options =
    props.asyncSearch && props.cityMode
      ? asyncOptions.value
      : props.searchable && searchQuery.value
        ? props.options.filter((option) => option.toLowerCase().includes(searchQuery.value.toLowerCase()))
        : props.options
  
  if (props.cityMode && typeof selected.value === "object" && selected.value) {
    const selectedCity = selected.value as CityData
    const isAlreadyInOptions = options.some((opt) => typeof opt === "object" && opt.kladr === selectedCity.kladr)
    if (!isAlreadyInOptions) {
      options = [selectedCity, ...options]
    }
  }
  
  return options
})

const searchCities = async () => {
  if (!props.asyncSearch || !props.asyncSearchUrl || !searchQuery.value || searchQuery.value.length < 2) {
    asyncOptions.value = []
    return
  }
  
  isLoading.value = true
  
  try {
    const response = await $fetch<{ success: boolean; data?: CityData[] }>(
      `${props.asyncSearchUrl}?query=${encodeURIComponent(searchQuery.value)}`,
    )
    
    if (response.success && response.data) {
      asyncOptions.value = response.data
    } else {
      asyncOptions.value = []
    }
  } catch (error) {
    console.error("Ошибка поиска городов:", error)
    asyncOptions.value = []
  } finally {
    isLoading.value = false
  }
}

const toggleSelect = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  if (props.searchable && isDropdownOpen.value) {
    searchQuery.value = displayValue.value
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

const select = (item: CityData | string) => {
  const newSelected = item
  if (selected.value === newSelected) {
    isDropdownOpen.value = false
    return
  }
  selected.value = newSelected
  if (props.cityMode && typeof newSelected === "object") {
    searchQuery.value = newSelected.label
    emit("update:modelValue", newSelected)
  } else {
    searchQuery.value = typeof newSelected === "string" ? newSelected : ""
    emit("update:modelValue", newSelected)
  }
  isDropdownOpen.value = false
  if (props.required) {
    clearError()
  }
}

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  
  if (props.searchable && !isDropdownOpen.value && searchQuery.value.trim().length > 0) {
    isDropdownOpen.value = true
    nextTick(() => inputRef.value?.focus())
  }
  
  if (props.searchable && isDropdownOpen.value && searchQuery.value.trim() === "") {
    isDropdownOpen.value = false
    asyncOptions.value = []
  }
  
  if (props.asyncSearch && searchQuery.value.length >= 2) {
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
    }
    
    searchTimeout.value = setTimeout(() => {
      searchCities()
    }, 300)
  } else if (props.asyncSearch && searchQuery.value.length < 2) {
    asyncOptions.value = []
  }
}

onMounted(() => {
  if (props.searchable && selected.value) {
    searchQuery.value = displayValue.value
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.value = searchQuery.value
      }
    })
  }
  document.addEventListener("click", handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside)
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

const setValue = (value: CityData | string | null) => {
  selected.value = value
  if (props.searchable) {
    searchQuery.value = displayValue.value
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.value = searchQuery.value
      }
    })
  }
  emit("update:modelValue", value)
  validate()
}

defineExpose({ validate, showError, setValue })
</script>

<template>
  <div
    ref="dropdownRef"
    class="relative font-[Manrope] font-light text-sm text-[#211D1D] select-none cursor-pointer sm:text-xs"
    :class="[customClass, { 'opacity-[0.99] z-50': isDropdownOpen }]"
  >
    <label
      v-if="!isDropdownOpen && !searchable"
      class="absolute top-3.5 left-2.5 font-[Manrope] font-light text-sm text-[#8C8785] transition-all duration-200 pointer-events-none z-10 sm:text-xs"
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
      class="relative h-[44px] w-full flex-col px-2.5 flex items-center justify-center overflow-visible bg-[#FFFFFA]"
      :class="{
        'border-[#E29650]': showError === true && !isDropdownOpen,
        'border-[#211D1D]': isActive || isDropdownOpen,
        'border-[#B8B8B6]': !isActive && !isDropdownOpen && showError === false,
        'pt-[21.5px] pb-1.5': isActive && !isDropdownOpen && !searchable,
        'border-t-[0.7px] border-l-[0.7px] border-r-[0.7px] rounded-t-lg':
        isDropdownOpen,
        'border-[0.7px] rounded-lg': !isDropdownOpen,
      }"
      :style="{ paddingTop: isDropdownOpen ? '8.75px' : '', paddingBottom: isDropdownOpen ? '8.75px' : '' }"
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
          {{ displayValue }}
        </span>
        <button class="w-4 h-4 flex justify-center items-center cursor-pointer focus:outline-none">
          <div
            class="chevron-icon"
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
        >
        <button class="w-4 h-4 flex justify-center items-center cursor-pointer focus:outline-none">
          <div
            v-if="!isLoading"
            class="chevron-icon"
            :class="isDropdownOpen ? 'rotate-180' : 'rotate-0'"
          />
          <div
            v-else
            class="w-3 h-3 border-2 border-[#211D1D] border-t-transparent rounded-full animate-spin"
          />
        </button>
      </div>
      <div
        class="absolute top-full left-0 right-0 flex flex-col gap-2 w-[calc(100%+2px)] -ml-[1px] px-2.5 pr-[22px] py-2 bg-[#FFFFFA] border-b-[0.7px] border-l-[0.7px] border-r-[0.7px] border-[#211D1D] rounded-b-lg shadow-md collapsible-div transition-all duration-300 ease-in-out overflow-y-scroll z-50"
        :class="[isDropdownOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0 border-transparent py-0 shadow-none']"
        :style="{ pointerEvents: isDropdownOpen ? 'auto' : 'none' }"
      >
        <div
          v-if="asyncSearch && searchQuery.length < 2 && !isLoading"
          class="w-full py-2 text-center text-xs text-[#8C8785] font-light"
        >
          Введите минимум 2 символа
        </div>
        <div
          v-else-if="isLoading"
          class="w-full py-2 text-center text-xs text-[#8C8785] font-light"
        >
          Поиск...
        </div>
        <div
          v-else-if="searchable && filteredOptions.length === 0 && searchQuery && !isLoading"
          class="w-full py-2 text-center text-xs text-[#8C8785] font-light"
        >
          Город не найден
        </div>
        <template v-else>
          <div
            v-for="(item, index) in filteredOptions"
            :key="cityMode && typeof item === 'object' ? item.kladr : index"
            class="w-full rounded-lg border border-[#BBB8B6] py-2 px-3 flex flex-col font-[Manrope] text-[15px] font-light hover:bg-[#F3A454] hover:border-[#F3A454] hover:text-[#FFFFFA] cursor-pointer"
            :class="[
              cityMode && typeof item === 'object' && typeof selected === 'object' && item.kladr === selected?.kladr
                ? 'bg-[#211D1D] text-[#FFFFFA]'
                : item === selected
                  ? 'bg-[#211D1D] text-[#FFFFFA]'
                  : 'bg-[#FFFFFA] text-[#211D1D]',
                  !item.label && 'hidden'
            ]"
            @click.stop="select(item)"
          >
            <span>{{ cityMode && typeof item === "object" ? item.label : item }}</span>
            <span
              v-if="cityMode && typeof item === 'object' && item.region"
              class="text-xs opacity-70 mt-0.5"
            >
              {{ item.region }}
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.collapsible-div {
  transition-property: max-height, opacity, padding, box-shadow;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.chevron-icon {
  background-image: url("/chevron-down.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
}
</style>