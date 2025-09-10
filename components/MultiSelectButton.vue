<script setup lang="ts">
const props = defineProps<{
	customClass?: string
	content: string[]
	modelValue: string[]
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: string[]): void
}>()

const select = (item: string) => {
	const currentValues = [...props.modelValue]
	const index = currentValues.indexOf(item)
	if (index > -1) {
		currentValues.splice(index, 1)
	} else {
		currentValues.push(item)
	}
	
	emit('update:modelValue', currentValues)
}

const isSelected = (item: string): boolean => {
	return props.modelValue.includes(item)
}
</script>

<template>
  <button
	  v-for="(item, index) in content"
	  :key="index"
	  :class="[
      'font-[Manrope] p-2 flex justify-center gap-1 items-center border-[0.7px] rounded-lg text-sm cursor-pointer',
      customClass,
      {
        'bg-[#211D1D] border-[#211D1D] text-[#FFFFFA]': isSelected(item),
        'border-[#BBB8B6] hover:border-[#F3A454] hover:text-[#FFFFFA] hover:bg-[#F3A454]': !isSelected(item)
      }
    ]"
	  @click="select(item)"
  >
    {{ item }}
  </button>
</template>

<style scoped>
</style>