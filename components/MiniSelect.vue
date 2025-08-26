<script setup lang="ts">
defineProps<{
	label: string
	options: string[]
	customClass?: string
}>()

const isDropdownOpen = ref(false)
const selected = ref<number | null>(null)

const toggleSelect = () => {
	isDropdownOpen.value = !isDropdownOpen.value
}

const select = (index: number) => {
	selected.value = index
	isDropdownOpen.value = false
}

</script>

<template>
  <div class="relative font-[Manrope] font-light text-sm text-[#211D1D] select-none cursor-pointer" :class="customClass">
	  <div class="relative w-full py-2 px-2.5 flex justify-center items-center border-[0.7px] border-[#BFBFBF] rounded-lg">
	    <div class="flex w-full justify-center items-center gap-1" @click="toggleSelect">
	      <span>{{selected !== null ? options[selected] : label}}</span>
	      <button class="w-4 h-4 flex justify-center items-center cursor-pointer"><NuxtImg src="/chevron-down.svg" alt="chevron" class="w-full" :class="isDropdownOpen && 'rotate-180'" /></button>
	    </div>
	    <div
		    class="overflow-hidden absolute flex flex-col w-full rounded-lg"
		    :class="[isDropdownOpen ? 'max-h-500 border-[0.5px] border-[#5E5B58]' : 'max-h-0 border-none', 'bottom-full']"
	    >
	      <div
		      v-for="(item, index) in options"
		      :key="index"
		      class="w-full py-1.5 px-2.5 flex items-center"
		      :class="[index !== options.length - 1 ? 'border-b-[0.5px] border-[#5E5B58]' : '', index === selected ? 'bg-[#211D1D] text-[#FFFFFA]' : 'bg-[#FFFFFA]']"
		      @click="select(index)"
	      >
		      {{item}}
	      </div>
	    </div>
	  </div>
	</div>
</template>

<style scoped>

</style>