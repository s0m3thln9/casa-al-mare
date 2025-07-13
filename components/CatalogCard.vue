<script setup lang="ts">
defineProps<{
	imageUrl: string
	text?: string
	price?: string
	customClass?: string
	customImageClass?: string
}>()
</script>

<template>
  <div
	  :class="['relative font-[Commissioner] font-light text-[10px] text-center sm:font-[Manrope] sm:text-sm', customClass]"
  >
			  <NuxtImg
				  :src="imageUrl" alt="card" width="460" height="680"
				  :class="['rounded-lg sm:rounded-2xl', customImageClass]"
			  />
			  <div class="flex justify-center items-center gap-1 px-6 py-2">
				  <div class="w-full border-y-1 border-[#A6CEFF]" />
				  <div class="w-full border-y-1 border-[#A6CEFF] opacity-30" />
				  <div class="w-full border-y-1 border-[#A6CEFF] opacity-30" />
			  </div>
			  <h4 class="mt-1">{{ text }}</h4>
			  <span class="mt-0.5">{{ price }} ₽</span>
			  <NuxtImg
				  src="/star.svg" alt="star"
				  class="w-3 h-3 absolute right-2.5 top-2.5 sm:w-5 sm:h-5 sm:right-4 sm:top-4"
			  />
		  </div>
</template>

<style scoped>

</style>