<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	label: string
	options: string[]
	customClass?: string
	modelValue: string | null
	required?: boolean
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void
}>()

const isDropdownOpen = ref(false)
const selected = ref<string | null>(props.modelValue)
const dropdownRef = ref<HTMLElement | null>(null)
const showError = ref(false)

const isActive = computed(() => !!selected.value)

watch(() => props.modelValue, (newValue) => {
	selected.value = newValue
})

const toggleSelect = () => {
	isDropdownOpen.value = !isDropdownOpen.value
}

const validateSelect = () => {
	showError.value = props.required && !selected.value
	return !showError.value
}

watch(isDropdownOpen, (newValue) => {
	if (!newValue) {
		validateSelect()
	}
})

const select = (item: string) => {
	selected.value = item
	isDropdownOpen.value = false
	emit('update:modelValue', selected.value!)
}

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event: MouseEvent) => {
	if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
		isDropdownOpen.value = false
	}
}

defineExpose({ validateSelect })

</script>

<template>
  <div ref="dropdownRef" class="relative font-[Manrope] font-light text-sm text-[#211D1D] select-none cursor-pointer sm:text-xs" :class="customClass">
    <label
	    v-if="!isDropdownOpen"
	    class="absolute top-3.5 left-2.5 font-[Manrope] font-light text-sm text-[#8C8785] transition-all duration-200 pointer-events-none sm:text-xs"
	    :class="{'!top-[3px]': isActive}"
    >
      {{ label }}
	    <span v-if="props.required" class="text-[#E29650]">*</span>
    </label>
    <div
	    class="relative h-[44px] w-full flex-col px-2.5 border-[0.7px] rounded-lg flex items-center justify-center"
	    :class="{
        'border-[#5E5B58]': showError === false || isDropdownOpen,
        'border-[#E29650]': showError === true && !isDropdownOpen,
        'pt-[21.5px] pb-1.5': isActive && !isDropdownOpen,
        'py-[8.75px] h-full max-h-[257.5px]': isDropdownOpen
      }"
	    @click="toggleSelect"
    >
	    <div class="flex items-center w-full" :class="[(isActive && !isDropdownOpen) ? 'justify-between' : 'justify-end']">
		    <span
			    v-if="selected !== null && !isDropdownOpen"
			    class="text-sm font-light text-[#211D1D] font-[Manrope] sm:text-xs"
		    >
	        {{ selected }}
	      </span>
	      <button
		      class="w-4 h-4 flex justify-center items-center cursor-pointer focus:outline-none"
	      >
	        <NuxtImg
		        src="/chevron-down.svg"
		        class="w-full"
		        :class="isDropdownOpen ? 'rotate-180' : 'rotate-0'"
	        />
	      </button>
	    </div>
	    <div class="flex flex-col gap-2 w-full pr-3 collapsible-div transition-max-height duration-300 ease-in-out overflow-y-scroll" :class="[isDropdownOpen ? 'max-h-500 opacity-100 mt-2' : 'max-h-0 opacity-0']">
		    <div
			    v-for="(item, index) in options"
			    :key="index"
			    class="w-full rounded-lg border border-[#BBB8B6] py-2 flex items-center justify-center font-[Manrope] text-[15px] font-light"
			    :class="[item === selected ? 'bg-[#211D1D] text-[#FFFFFA]' : 'bg-[#FFFFFA] text-[#211D1D]']"
			    @click.stop="select(item)"
		    >
          {{ item }}
        </div>
	    </div>
    </div>
	  <div
		  class="absolute -top-[40px] left-3 bg-[#FFFFFA] border border-[#A6CEFF] transition-opacity duration-300 text-[#211D1D] text-[13px] font-light font-[Manrope] p-4 shadow-md z-10 rounded-t-3xl rounded-r-3xl pointer-events-none"
		  :class="showError === true && !isDropdownOpen ? 'opacity-100' : 'opacity-0'"
	  >
      Это поле обязательно для заполнения
    </div>
  </div>
</template>

<style scoped>
.collapsible-div {
	transition-property: max-height, opacity;
}
</style>