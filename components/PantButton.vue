<script setup lang="ts">
defineProps<{
	pants: {
		title: string
		src: string
		altSrc: string
	}[]
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
	      :src="selected === index ? pant.altSrc : pant.src"
	      alt="pant"
	      width="54"
	      height="30"
	      class="h-[31px]"
      />
    </button>
    <span class="text-xs font-[Manrope]">{{ pant.title }}</span>
  </div>
</template>

<style scoped>
</style>