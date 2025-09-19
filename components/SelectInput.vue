<script setup lang="ts">
import parsePhoneNumberFromString from "libphonenumber-js"

type CountryOption = { code: string; country: string; iso: string }

type PhoneData = {
  code: string | null
  phone: string
  country: string | null
}

const props = withDefaults(
  defineProps<{
    id: string
    label: string
    options: CountryOption[]
    customClass?: string
    modelValue: PhoneData | null
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
  (e: "update:modelValue", value: PhoneData | null): void
}>()

const isDropdownOpen = ref(false)
const isActive = ref(false)
const selectedCountry = ref<CountryOption | null>(null)
const nationalNumber = ref("")
const maskedNumber = ref("")
const search = ref("")
const showError = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const customMasks: Record<string, string> = {
  "+7": "(###) ###-##-##", // Россия
  "+375": "## ###-##-##", // Беларусь
  "+380": "## ###-##-##", // Украина
  "+1": "(###) ###-####", // США/Канада
  "+44": "#### ### ####", // Великобритания
  "+49": "### ### ####", // Германия
  "+33": "# ## ## ## ##", // Франция
  "+39": "### ### ####", // Италия
  "+86": "### #### ####", // Китай
  "+81": "##-####-####", // Япония
  "+82": "##-####-####", // Южная Корея
  "+91": "##### #####", // Индия
  "+55": "## ####-####", // Бразилия
  "+54": "## ####-####", // Аргентина
  "+52": "## ####-####", // Мексика
  "+61": "### ### ###", // Австралия
  "+64": "##-### ####", // Новая Зеландия
  "+27": "## ### ####", // ЮАР
  "+90": "### ### ####", // Турция
  "+966": "## ###-####", // Саудовская Аравия
  "+971": "## ###-####", // ОАЭ
  "+48": "### ###-###", // Польша
  "+420": "### ### ###", // Чехия
  "+36": "## ###-####", // Венгрия
}

const digitsOnly = (v: string) => v.replace(/\D/g, "")

const filteredOptions = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter(
    (o) => o.code.toLowerCase().includes(q) || o.country.toLowerCase().includes(q) || o.iso.toLowerCase().includes(q),
  )
})

const getPhoneMask = (countryCode: string | null): string => {
  if (!countryCode) return ""
  if (customMasks[countryCode]) {
    return customMasks[countryCode]
  }

  const maskLength = getMaskLengthByCountry(countryCode)
  return generateGenericMask(maskLength)
}

const getMaskLengthByCountry = (countryCode: string): number => {
  const lengthMap: Record<string, number> = {
    "+7": 10, // Россия
    "+375": 9, // Беларусь
    "+380": 9, // Украина
    "+1": 10, // США/Канада
    "+44": 10, // Великобритания
    "+49": 10, // Германия
    "+33": 9, // Франция
    "+39": 10, // Италия
    "+86": 11, // Китай
    "+81": 10, // Япония
  }

  return lengthMap[countryCode] || 10
}

const generateGenericMask = (length: number): string => {
  const hashes = Array(length).fill("#").join("")
  if (length <= 6) return hashes
  if (length <= 9) return `${hashes.slice(0, 3)} ${hashes.slice(3)}`
  return `${hashes.slice(0, 3)} ${hashes.slice(3, 6)} ${hashes.slice(6)}`
}

const applyMask = (value: string, mask: string): string => {
  if (!mask) return value

  const digits = digitsOnly(value)
  let masked = ""
  let digitIndex = 0

  for (let i = 0; i < mask.length && digitIndex < digits.length; i++) {
    if (mask[i] === "#") {
      masked += digits[digitIndex]
      digitIndex++
    } else {
      masked += mask[i]
    }
  }

  return masked
}

const combinedValue = computed((): PhoneData | null => {
  if (!selectedCountry.value && !nationalNumber.value) {
    return null
  }

  return {
    code: selectedCountry.value?.code || null,
    phone: digitsOnly(nationalNumber.value),
    country: selectedCountry.value?.country || null,
  }
})

const applyFromModel = (val: PhoneData | null) => {
  if (!val) {
    selectedCountry.value = null
    nationalNumber.value = ""
    maskedNumber.value = ""
    return
  }

  const country = props.options.find((opt) => opt.code === val.code)
  selectedCountry.value = country || null

  if (val.phone) {
    nationalNumber.value = val.phone
    const mask = getPhoneMask(val.code)
    maskedNumber.value = applyMask(val.phone, mask)
  } else {
    nationalNumber.value = ""
    maskedNumber.value = ""
  }
}

const updateModelValue = () => {
  const next = combinedValue.value
  emit("update:modelValue", next)
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  const digits = digitsOnly(value)

  nationalNumber.value = digits

  const mask = getPhoneMask(selectedCountry.value?.code || null)
  if (mask) {
    maskedNumber.value = applyMask(digits, mask)
    nextTick(() => {
      target.value = maskedNumber.value
    })
  } else {
    maskedNumber.value = digits
  }

  clearError()
}

const onFocus = () => {
  isActive.value = true
  isDropdownOpen.value = false
}

const onBlur = () => {
  isActive.value = nationalNumber.value !== "" || selectedCountry.value !== null
  if (props.required) {
    setTimeout(() => validate(), 100)
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

const validate = (): boolean => {
  if (!props.required) {
    clearError()
    return true
  }

  const hasCode = !!selectedCountry.value
  const hasPhone = !!nationalNumber.value

  if (!hasCode && !hasPhone) {
    triggerError()
    return false
  }

  if (hasCode && !hasPhone) {
    triggerError()
    return false
  }

  if (!hasCode && hasPhone) {
    triggerError()
    return false
  }

  if (hasCode && hasPhone) {
    try {
      const fullNumber = selectedCountry.value!.code + nationalNumber.value
      const parsed = parsePhoneNumberFromString(fullNumber)

      if (!parsed || !parsed.isValid()) {
        triggerError()
        return false
      }
    } catch (e) {
      console.error(e)
      triggerError()
      return false
    }
  }

  clearError()
  return true
}

const selectCode = (item: CountryOption) => {
  selectedCountry.value = item
  isDropdownOpen.value = false
  search.value = ""
  isActive.value = true

  const mask = getPhoneMask(item.code)
  if (nationalNumber.value) {
    maskedNumber.value = applyMask(nationalNumber.value, mask)
  }

  clearError()
}

onMounted(() => {
  applyFromModel(props.modelValue)
  isActive.value = nationalNumber.value !== "" || selectedCountry.value !== null
  document.addEventListener("click", handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside)
})

watch(
  () => props.modelValue,
  (val) => {
    if (JSON.stringify(val) !== JSON.stringify(combinedValue.value)) {
      applyFromModel(val)
      isActive.value = nationalNumber.value !== "" || selectedCountry.value !== null
    }
  },
  { deep: true },
)

watch([selectedCountry, nationalNumber], () => {
  updateModelValue()
  if (showError.value) {
    validate()
  }
})

watch(
  selectedCountry,
  (newCountry) => {
    if (newCountry && nationalNumber.value) {
      const mask = getPhoneMask(newCountry.code)
      maskedNumber.value = applyMask(nationalNumber.value, mask)
    }
  },
  { immediate: true },
)

defineExpose({ validate, showError })
</script>

<template>
  <div
    ref="dropdownRef"
    class="relative font-[Manrope] font-light text-sm text-[#211D1D] select-none cursor-pointer sm:text-xs"
    :class="customClass"
  >
    <div
      class="relative h-[44px] w-full flex-col px-2.5 border-[0.7px] rounded-lg flex items-center justify-center"
      :class="{
        'pt-[14px] !h-auto': isDropdownOpen,
        'border-[#E29650]': !!showError && !isDropdownOpen,
        'border-[#BBB8B6]': !showError || isDropdownOpen,
      }"
    >
      <div class="flex items-center w-full">
        <div
          class="flex items-center gap-1 pr-2.5 border-r-[0.7px] border-[#BBB8B6] min-w-fit"
          @click="isDropdownOpen = !isDropdownOpen"
        >
          <span class="font-light text-[#211D1D] font-[Manrope] text-xs whitespace-nowrap">
            {{ selectedCountry?.code || "Код" }}
          </span>
          <button class="w-4 h-4 flex justify-center items-center cursor-pointer outline-none">
            <NuxtImg
              src="/chevron-down.svg"
              class="w-full transition-transform"
              :class="isDropdownOpen ? 'rotate-180' : 'rotate-0'"
            />
          </button>
        </div>

        <div class="pl-2.5 w-full relative">
          <label
            v-if="!isActive"
            class="absolute font-[Manrope] font-light text-[#8C8785] pointer-events-none text-xs"
          >
            {{ label }}
            <span
              v-if="props.required"
              class="text-[#E29650]"
              >*</span
            >
          </label>
          <input
            :value="maskedNumber"
            type="tel"
            class="w-full outline-none"
            inputmode="tel"
            :placeholder="getPhoneMask(selectedCountry?.code || null)"
            @input="handleInput"
            @focus="onFocus"
            @blur="onBlur"
          />
        </div>
      </div>

      <div
        class="flex flex-col gap-2 w-full overflow-hidden transition-all duration-300"
        :style="{
          'max-height': isDropdownOpen ? '500px' : '0px',
          opacity: isDropdownOpen ? '1' : '0',
          'margin-top': isDropdownOpen ? '1rem' : '0',
        }"
      >
        <input
          v-model="search"
          placeholder="Поиск"
          class="h-[32px] w-full px-2.5 py-2 border-[0.5px] border-[#BBB8B6] rounded-lg text-[#211D1D] font-[Manrope] outline-none text-xs"
        />
        <div class="flex flex-col gap-2 w-full pr-3 max-h-[140px] overflow-y-scroll">
          <div
            v-for="(item, index) in filteredOptions"
            :key="index"
            class="w-full rounded-lg px-2 py-1 flex items-center justify-between font-[Manrope] text-xs font-light cursor-pointer hover:bg-gray-50"
            :class="[
              item.code === selectedCountry?.code ? 'bg-[#211D1D] text-[#FFFFFA]' : 'bg-[#FFFFFA] text-[#211D1D]',
            ]"
            @click.stop="selectCode(item)"
          >
            <span>{{ item.code }}</span>
            <span class="truncate ml-2">{{ item.country }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
