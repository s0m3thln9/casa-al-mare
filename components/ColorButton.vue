<script setup lang="ts">
import {defineEmits} from "vue"

const props = defineProps<{
	colors: {
		title: string
		value: string
	}[]
	modelValue: string | null
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | null): void
}>()

const selected = ref<number | null>(null)

const select = (color: string) => {
	if (props.modelValue === color) {
		emit('update:modelValue', null)
	} else {
		emit('update:modelValue', color)
		
	}
}

</script>

<template>
	<div
		v-for="(color, index) in colors"
	  :key="index"
		class="flex flex-col justify-center gap-2 items-center"
	>
		<button
			class="cursor-pointer"
			@click="select(color.title)"
		>
	    <div
		    :class="['w-6 h-6 rounded-lg', modelValue === color.title && 'border-2 border-[#211D1D]']"
	      :style="{ backgroundColor: color.value }"
	    />
    </button>
		<span class="text-xs font-[Manrope]">{{ color.title }}</span>
	</div>
</template>

<style scoped>

</style>