<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
	label: string
	options: string[]
	customClass?: string
}>()

const isDropdownOpen = ref(false)
const selected = ref<number | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)

const isActive = computed(() => selected.value !== null)

const toggleSelect = () => {
	isDropdownOpen.value = !isDropdownOpen.value
}

const select = (event: MouseEvent, index: number) => {
	event.stopPropagation()
	selected.value = index
	isDropdownOpen.value = false
}

</script>

<template>
  <div ref="dropdownRef" class="relative font-[Manrope] font-light text-sm text-[#211D1D] select-none cursor-pointer sm:text-xs" :class="customClass">
    <label
	    v-if="!isDropdownOpen"
	    class="absolute top-3.5 left-2.5 font-[Manrope] font-light text-sm text-[#8C8785] transition-all duration-200 pointer-events-none sm:text-xs"
	    :class="{'!top-[3px]': isActive}"
    >
      {{ label }}
    </label>
    <div
	    class="relative h-[44px] w-full flex-col px-2.5 border-[#5E5B58] border-[0.7px] rounded-lg flex items-center justify-center"
	    :class="[(isActive && !isDropdownOpen) && 'pt-[21.5px] pb-1.5', isDropdownOpen && 'py-[8.75px] h-full max-h-[257.5px]']"
	    @click="toggleSelect"
    >
	    <div class="flex items-center justify-between w-full" :class="[(isActive && !isDropdownOpen) ? 'justify-between' : 'justify-end']">
		    <span
			    v-if="selected !== null && !isDropdownOpen"
			    class="text-sm font-light text-[#211D1D] font-[Manrope] sm:text-xs"
		    >
	        {{ options[selected] }}
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
			    :class="[index === selected ? 'bg-[#211D1D] text-[#FFFFFA]' : 'bg-[#FFFFFA] text-[#211D1D]']"
			    @click="(event) => select(event, index)"
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