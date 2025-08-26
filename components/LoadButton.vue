<script setup lang="ts">

import {twMerge} from "tailwind-merge"

const props = defineProps<{
	content?: string
	customClass?: string
	disabled?: boolean
}>()

const styleBase = computed(() =>
	twMerge("flex justify-center items-center px-4 py-2 rounded-xl border text-xs/snug font-[Manrope] font-light sm:font-normal", props.customClass) + ' '
)
const styleVariants = {
	default: "bg-transparent border-transparent text-[#211D1D] cursor-pointer hover:border-[#211D1D] hover:text-[#211D1D]",
}

const currentState = computed(() => {
	const content = props.content
	const style = styleBase.value + styleVariants.default
	const disabled = props.disabled || false
	
	
	return { content, style, disabled }
})

</script>

<template>
  <button
	  :class="currentState.style"
	  :disabled="currentState.disabled"
  >
    {{ currentState.content }}
  </button>
</template>

<style scoped>

</style>