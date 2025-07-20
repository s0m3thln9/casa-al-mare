<script setup lang="ts">
defineProps<{
	customClass?: string
}>()

const selected = ref<number | null>(null)
const ring = ref<number | null>(null)

const select = (index: number) => {
	selected.value = index
	// emit('select', parseInt(props.variants[index]))
}

const sizes = ["XSS", "XS", "S", "M", "L", "XL", "XXL"]

</script>

<template>
  <button
	  v-for="(size, index) in sizes"
	  :key="index"
	  :content="size"
	  :class="['font-[Manrope] p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm cursor-pointer hover:border-[#F3A454] hover:text-[#FFFFFA] hover:bg-[#F3A454]', customClass, selected === index && 'bg-[#211D1D] border-[#211D1D] text-[#FFFFFA]']"
	  @click="select(index)"
  >
	  {{ size }}
	  <NuxtImg v-if="ring" src="/ring.svg" alt="ring" class="w-[9px] h-[9px]" />
  </button>
</template>

<style scoped>

</style>