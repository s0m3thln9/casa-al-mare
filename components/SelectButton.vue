<script setup lang="ts">
const props = defineProps<{
	variants: string[]
	customClass?: string
	customButtonClass?: string
	modelValue: string
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | null): void
}>()

const selected = ref(props.modelValue)

const select = (variant: string) => {
	selected.value = variant
	emit('update:modelValue', selected.value)
}

</script>

<template>
  <div
	  :class="['border-[0.7px] border-[#211D1D] flex items-center rounded-lg overflow-hidden', customClass]"
  >
	  <button
		  v-for="(variant, index) in variants"
		  :key="index"
		  class="flex items-center justify-center px-4 py-1.5 text-xs cursor-pointer"
		  :class="[variant === selected ? 'bg-[#211D1D] text-[#FFFFFA]' : 'bg-[#FFFFFA] text-[#211D1D]', index !== variants.length - 1 ? 'border-r-[0.7px]' : '', customButtonClass]"
		  @click="select(variant)"
	  >
		  {{ variant }}
		</button>
  </div>
</template>

<style scoped>

</style>