<script setup lang="ts">
const props = defineProps<{
	size: "S" | "M" | "L" | "XL"
	currentValue?: number
	label: string
	disabled?: boolean
	value?: number
}>()

const emit = defineEmits<{
	(e: "toggle", value?: number): void
}>()

const isSelected = computed(() => {
	return props.value === props.currentValue
})

</script>

<template>
  <div class="flex gap-2 items-center">
	  <button :disabled="disabled" @click="emit('toggle', value)" :class="['flex justify-center items-center rounded-3xl border border-[#BBB8B6]', disabled ? 'bg-[#F9F6EC]' : 'cursor-pointer', size === 'S' && 'w-4 h-4', size === 'M' && 'w-5 h-5', size === 'L' && 'w-6 h-6', size === 'XL' && 'w-8 h-8', isSelected && 'bg-[#211D1D] border-[#F9F6EC]']"><NuxtImg v-if="isSelected" src="/check.svg" /></button>
	  <span class="text-sm font-light">{{label}}</span>
  </div>
</template>

<style scoped>

</style>