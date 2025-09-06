<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

type Option = { code: string, country: string }

const props = defineProps<{
	id: string
	label: string
	type: 'text' | 'password' | 'email'
	options: Option[]
	customClass?: string
	modelValue: string | null
	required?: boolean
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const isDropdownOpen = ref(false)
const isActive = ref(false)
const selectedCode = ref<string | null>(null)
const nationalNumber = ref('')
const search = ref('')
const showError = ref(false)

const digitsOnly = (v: string) => v.replace(/\D/g, '')

const filteredOptions = computed(() => {
	const q = search.value.trim().toLowerCase()
	if (!q) return props.options
	return props.options.filter(o =>
		o.code.toLowerCase().includes(q) || o.country.toLowerCase().includes(q)
	)
})

const buildE164 = (code: string | null, national: string) => {
	const localDigits = digitsOnly(national)
	const raw = (code ?? '') + localDigits
	if (!raw) return ''
	const parsed = parsePhoneNumberFromString(raw)
	if (parsed) return parsed.format('E.164')
	return raw.startsWith('+') ? raw : `+${raw}`
}

const applyFromModel = (val: string | null) => {
	if (!val) {
		selectedCode.value = null
		nationalNumber.value = ''
		return
	}
	const parsed = parsePhoneNumberFromString(val)
	if (parsed) {
		selectedCode.value = `+${parsed.countryCallingCode}`
		nationalNumber.value = parsed.nationalNumber || ''
	} else {
		const m = val.match(/^\+(\d{1,3})(.*)$/)
		selectedCode.value = m ? `+${m[1]}` : null
		nationalNumber.value = digitsOnly(m ? m[2] : val)
	}
}

const combinedValue = computed(() => buildE164(selectedCode.value, nationalNumber.value))

const updateModelValue = () => {
	const next = combinedValue.value
	if ((props.modelValue ?? '') !== next) {
		emit('update:modelValue', next)
	}
}

onMounted(() => {
	applyFromModel(props.modelValue ?? '')
	isActive.value = nationalNumber.value !== ''
})

watch(
	() => props.modelValue,
	(val) => {
		const next = val ?? ''
		if (next !== combinedValue.value) {
			applyFromModel(next)
			isActive.value = nationalNumber.value !== ''
		}
	}
)

watch([selectedCode, nationalNumber], () => {
	updateModelValue()
})

const onFocus = () => {
	isActive.value = true
	isDropdownOpen.value = false
}

const onBlur = () => {
	isActive.value = nationalNumber.value !== ''
	if (props.required) {
		if (combinedValue.value === '') {
			showError.value = true
		} else {
			showError.value = false
		}
	}
}

const validate = () => {
	if (props.required) {
		if (combinedValue.value === '') {
			showError.value = true
			return false
		} else {
			showError.value = false
		}
	}
	return true
}

watch(nationalNumber, (val) => {
	if (props.required && val.trim() !== '') {
		showError.value = false
	}
})

watch(selectedCode, () => {
	if (props.required && nationalNumber.value.trim() !== '') {
		showError.value = false
	}
})

defineExpose({ validate, showError })
</script>

<template>
  <div
	  class="relative font-[Manrope] font-light text-sm text-[#211D1D] select-none cursor-pointer sm:text-xs"
	  :class="customClass"
  >
    <div
	    class="relative h-[44px] w-full flex-col px-2.5 border-[0.7px] rounded-lg flex items-center justify-center"
	    :class="{
        'pt-[14px] !h-auto': isDropdownOpen,
        'border-[#E29650]': !!showError && !isDropdownOpen,
        'border-[#BBB8B6]': !showError || isDropdownOpen
      }"
    >
      <div class="flex items-center w-full">
        <div
	        class="flex items-center gap-1 pr-2.5 border-r-[0.7px] border-[#BBB8B6]"
	        @click="isDropdownOpen = !isDropdownOpen"
        >
          <span class="font-light text-[#211D1D] font-[Manrope] text-xs">
            {{ selectedCode === null ? 'Код' : selectedCode }}
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
            <span v-if="props.required" class="text-[#E29650]">*</span>
          </label>
          <input
	          v-model="nationalNumber"
	          type="tel"
	          class="w-full outline-none"
	          inputmode="tel"
	          @focus="onFocus"
	          @blur="onBlur"
          >
        </div>
      </div>

      <div
	      class="flex flex-col gap-2 w-full overflow-hidden transition-all duration-300"
	      :style="{
          'max-height': isDropdownOpen ? '500px' : '0px',
          'opacity': isDropdownOpen ? '1' : '0',
          'margin-top': isDropdownOpen ? '1rem' : '0'
        }"
      >
        <input
	        v-model="search"
	        placeholder="Поиск"
	        class="h-[32px] w-full px-2.5 py-2 border-[0.5px] border-[#BBB8B6] rounded-lg text-[#211D1D] font-[Manrope] outline-none text-xs"
        >
        <div class="flex flex-col gap-2 w-full pr-3 max-h-[140px] overflow-y-scroll">
          <div
	          v-for="(item, index) in filteredOptions"
	          :key="index"
	          class="w-full rounded-lg px-2 py-1 flex items-center justify-between font-[Manrope] text-xs font-light"
	          :class="[item.code === selectedCode ? 'bg-[#211D1D] text-[#FFFFFA]' : 'bg-[#FFFFFA] text-[#211D1D]']"
	          @click.stop="selectedCode = item.code; isDropdownOpen = false"
          >
            <span>{{ item.code }}</span>
            <span>{{ item.country }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
