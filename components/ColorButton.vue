<script setup lang="ts">
const props = defineProps<{
	colors: {
		code: string
		name: string
		value: string
	}[]
	modelValue: { code: string, name: string } | null
	text?: boolean
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: { code: string; name: string } | null): void
}>()

const select = (color: { code: string, name: string, value: string }) => {
	if (props.modelValue?.code === color.code) {
		emit('update:modelValue', null)
	} else {
		emit('update:modelValue', { code: color.code, name: color.name })
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
			@click="select(color)"
		>
	    <div
		    :class="['w-6 h-6 rounded-lg', modelValue?.code === color.code && 'border-2 border-[#211D1D]']"
	      :style="{ backgroundColor: color.value }"
	    />
    </button>
		<span v-if="text" class="text-xs font-[Manrope]">{{ color.name }}</span>
	</div>
</template>

<style scoped>

</style>