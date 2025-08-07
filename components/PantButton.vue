<script setup lang="ts">
const props = defineProps<{
	pants: {
		title: string
		src: string
		altSrc?: string
	}[]
	modelValue: string | null
	other?: boolean
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | null): void
}>()

const select = (index: number) => {
	const selectedTitle = props.pants[index].title
	if (props.modelValue === selectedTitle) {
		emit('update:modelValue', null)
	} else {
		emit('update:modelValue', selectedTitle)
	}
}

const isSelected = (index: number) => {
	return props.pants[index].title === props.modelValue
}
</script>

<template>
  <div
	  v-for="(pant, index) in pants"
	  :key="index"
	  class="flex flex-col justify-center items-center gap-2"
  >
    <button
	    class="cursor-pointer"
	    @click="select(index)"
    >
      <NuxtImg
	      :src="(!other && isSelected(index)) ? pant.altSrc : pant.src"
	      alt="pant"
	      :width="other ? 40 : 54"
	      :height="other ? 54 : 31"
	      :class="[other ? 'h-[54px] rounded-lg border-[0.7px]' : 'h-[31px]', (other && isSelected(index)) ? 'border-[#211D1D] border' : 'border-[#BBB8B6]']"
      />
    </button>
    <span class="text-xs font-[Manrope]">{{ pant.title }}</span>
  </div>
</template>

<style scoped>
</style>