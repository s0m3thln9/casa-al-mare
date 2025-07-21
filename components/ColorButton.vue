<script setup lang="ts">
defineProps<{
	colors: {
		title: string
		value: string
	}[]
}>()

const selected = ref<number | null>(null)

const select = (index: number) => {
	if (selected.value === index) {
		selected.value = null
	} else {
		selected.value = index
	}
	// emit('select', parseInt(props.variants[index]))
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
			@click="select(index)"
		>
	    <div
		    :class="['w-6 h-6 rounded-lg', selected === index && 'border-2 border-[#211D1D]']"
	      :style="{ backgroundColor: color.value }"
	    />
    </button>
		<span class="text-xs font-[Manrope]">{{ color.title }}</span>
	</div>
</template>

<style scoped>

</style>