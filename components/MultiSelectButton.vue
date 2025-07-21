<script setup lang="ts">
defineProps<{
	customClass?: string
	content: string[]
}>()

const selected = ref<number[]>([])
const ring = ref<number | null>(null)

const select = (index: number) => {
	const isSelected = selected.value.includes(index)
	if (!isSelected) {
		selected.value.push(index)
	} else {
		selected.value = selected.value.filter(i => i !== index)
	}
	// emit('select', parseInt(props.variants[index]))
}

</script>

<template>
  <button
	  v-for="(item, index) in content"
	  :key="index"
	  :class="['font-[Manrope] p-2 flex justify-center items-center border-[0.7px] rounded-lg text-sm cursor-pointer hover:border-[#F3A454] hover:text-[#FFFFFA] hover:bg-[#F3A454]', customClass, selected.includes(index) ? 'bg-[#211D1D] border-[#211D1D] text-[#FFFFFA]' : 'border-[#BBB8B6]']"
	  @click="select(index)"
  >
	  {{ item }}
	  <NuxtImg v-if="ring" src="/ring.svg" alt="ring" class="w-[9px] h-[9px]" />
  </button>
</template>

<style scoped>

</style>