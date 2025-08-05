<script setup lang="ts">
const props = defineProps<{
	customClass?: string
	content: string[]
}>()

const emit = defineEmits<{
	(e: 'select', value: string | null): void
}>()

const selected = ref<number | null>(null)

const select = (index: number) => {
	if (selected.value === index) {
		selected.value = null
		emit('select', null)
	} else {
		selected.value = index
		emit('select', props.content[index])
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
      selected === index ? 'bg-[#211D1D] border-[#211D1D] text-[#FFFFFA]' : 'border-[#BBB8B6]'
    ]"
	  @click="select(index)"
  >
    {{ item }}
  </button>
</template>

<style scoped>

</style>