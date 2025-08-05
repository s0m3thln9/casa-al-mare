<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
	customClass?: string
	content: string[]
	modelValue: string | null
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | null): void
}>()

const select = (item: string) => {
	if (props.modelValue === item) {
		emit('update:modelValue', null)
	} else {
		emit('update:modelValue', item)
	}
}
</script>

<template>
  <button
	  v-for="(item, index) in content"
	  :key="index"
	  :class="[
      'font-[Manrope] p-2 flex justify-center items-center border-[0.7px] rounded-lg text-sm cursor-pointer hover:border-[#F3A454] hover:text-[#FFFFFA] hover:bg-[#F3A454]',
      customClass,
      item === modelValue ? 'bg-[#211D1D] border-[#211D1D] text-[#FFFFFA]' : 'border-[#BBB8B6]'
    ]"
	  @click="select(item)"
  >
    {{ item }}
  </button>
</template>

<style scoped>
</style>