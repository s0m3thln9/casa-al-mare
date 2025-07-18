<script setup lang="ts">
const props = defineProps<{
	imageUrl: string
	text?: string
	price?: number
	oldPrice?: number
	customClass?: string
	customImageClass?: string
	variant: 'mini' | 'large'
}>()

const priceFormatter = (value: number) => {
	const formattedValue = new Intl.NumberFormat('ru-RU').format(value)
	if (props.variant === 'mini') {
		return `${formattedValue.replace(/\s/g, '.')}₽`
	} else {
		return `${formattedValue} ₽`
	}
}

</script>

<template>
	<div
		v-if="variant === 'mini'"
		:class="['relative font-[Commissioner] font-light text-[11px] text-center sm:font-[Manrope] sm:text-xs', customClass]"
	>
	  <NuxtImg
		  :src="imageUrl" alt="card" width="300" height="450"
		  :class="['rounded-lg', customImageClass]"
	  />
	  <h4 class="mt-2">{{ text }}</h4>
		<span class="mt-1">{{ priceFormatter(price!) }} <span class="text-[#5E5B58] line-through">{{ priceFormatter(oldPrice!) }}</span></span>
	  <NuxtImg
		  src="/star.svg" alt="star"
		  class="w-3 h-3 absolute right-2.5 top-2.5 sm:w-5 sm:h-5 sm:right-4 sm:top-4"
	  />
  </div>
  <div
	  v-else
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
	  <span class="mt-0.5">{{ priceFormatter(price!) }}</span>
	  <NuxtImg
		  src="/star.svg" alt="star"
		  class="w-3 h-3 absolute right-2.5 top-2.5 sm:w-5 sm:h-5 sm:right-4 sm:top-4"
	  />
  </div>
</template>

<style scoped>

</style>