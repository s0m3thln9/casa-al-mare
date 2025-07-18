<script setup lang="ts">
const props = defineProps<{
	variants: string[]
}>()

const emit = defineEmits<{
	(e: 'select', selected: number): void
}>()

const selected = ref(0)

const select = (index: number) => {
	selected.value = index
	emit('select', parseInt(props.variants[index]))
}

</script>

<template>
  <div
	  class="border-[0.7px] border-[#211D1D] flex rounded-lg overflow-hidden"
  >
	  <button
		  v-for="(variant, index) in variants"
		  :key="index"
		  class="flex items-center px-4 py-1.5 text-xs cursor-pointer"
		  :class="[index === selected ? 'bg-[#211D1D] text-[#FFFFFA]' : 'bg-[#FFFFFA] text-[#211D1D]', index !== variants.length - 1 ? 'border-r-[0.7px]' : '']"
		  @click="select(index)"
	  >
		  {{ variant }}
		</button>
  </div>
</template>

<style scoped>

</style>