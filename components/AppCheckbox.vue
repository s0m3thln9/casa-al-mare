<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	size: "S" | "M" | "L" | "XL"
	modelValue: string | null
	label: string
	disabled?: boolean
	value: string
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | null): void
}>()

const isSelected = computed(() => props.modelValue === props.value)
</script>

<template>
  <div
	  class="flex gap-2 items-center select-none"
	  :class="!disabled && 'cursor-pointer'"
	  role="checkbox"
	  :aria-checked="isSelected"
	  @click="!disabled && emit('update:modelValue', isSelected ? null : value)"
  >
    <button
	    :disabled="disabled"
	    :class="[
        'flex justify-center items-center rounded-3xl border border-[#BBB8B6]',
        disabled ? 'bg-[#F9F6EC]' : 'cursor-pointer',
        size === 'S' && 'w-4 h-4',
        size === 'M' && 'w-5 h-5',
        size === 'L' && 'w-6 h-6',
        size === 'XL' && 'w-8 h-8',
        isSelected && 'bg-[#211D1D] border-[#F9F6EC]'
      ]"
    >
      <NuxtImg v-if="isSelected" src="/check.svg" alt="Check mark" />
    </button>
    <span class="text-sm font-light">{{ label }}</span>
  </div>
</template>

<style scoped>
</style>