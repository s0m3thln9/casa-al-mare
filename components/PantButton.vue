<script setup lang="ts">
defineProps<{
	pants: {
		title: string
		src: string
		altSrc?: string
	}[]
	other?: boolean
}>()

const selected = ref<number | null>(null)

const select = (index: number) => {
	if (selected.value === index) {
		selected.value = null
	} else {
		selected.value = index
	}
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
	      :src="(!other && selected === index) ? pant.altSrc : pant.src"
	      alt="pant"
	      :width="other ? 40 : 54"
	      :height="other ? 54 : 31"
	      :class="[other ? 'h-[54px] rounded-lg border-[0.7px]' : 'h-[31px]', (other && selected === index) ? 'border-[#211D1D] border' : 'border-[#BBB8B6]']"
      />
    </button>
    <span class="text-xs font-[Manrope]">{{ pant.title }}</span>
  </div>
</template>

<style scoped>
</style>