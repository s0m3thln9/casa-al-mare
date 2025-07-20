<script setup lang="ts">
const props = defineProps<{
	imageUrls: string[]
	text?: string
	price?: number
	oldPrice?: number
	color?: string
	customClass?: string
	customImageClass?: string
	variant: 'mini' | 'large'
}>()

const currentImageIndex = ref(0)
const isTransitioning = ref(false)
const isHovered = ref(false)
const isFavorite = ref(false)
const isVisible = ref(false)
const isLoading = ref(false)

const imageStyles = computed(() => (index: number) => {
	if (index === currentImageIndex.value) {
		return {
			transform: 'translateX(0)',
			opacity: 1,
			zIndex: 1,
			transition: 'transform 400ms ease-in-out, opacity 400ms ease-in-out'
		}
	}
	return {
		transform: index < currentImageIndex.value ? 'translateX(-100%)' : 'translateX(100%)',
		opacity: 0,
		zIndex: 0,
		transition: 'transform 400ms ease-in-out, opacity 400ms ease-in-out'
	}
})

const barStyles = computed(() => (index: number) => ({
	opacity: index === currentImageIndex.value ? 1 : 0.3,
	transition: 'opacity 400ms ease-in-out'
}))

onMounted(() => {
	isVisible.value = true
})

const priceFormatter = (value: number) => {
	const formattedValue = new Intl.NumberFormat('ru-RU').format(value)
	if (props.variant === 'mini') {
		return `${formattedValue.replace(/\s/g, '.')}₽`
	} else {
		return `${formattedValue} ₽`
	}
}

const handleMouseMove = (e: MouseEvent) => {
	if (isTransitioning.value) return
	
	const target = e.currentTarget as HTMLElement
	const rect = target.getBoundingClientRect()
	const x = e.clientX - rect.left
	const width = rect.width
	const section = width / props.imageUrls.length
	const newIndex = Math.floor(x / section)
	
	if (newIndex !== currentImageIndex.value) {
		isTransitioning.value = true
		currentImageIndex.value = newIndex
		setTimeout(() => {
			isTransitioning.value = false
		}, 500)
	}
}

const isAuthenticated = () => false

const toggleFavorite = () => {
	isFavorite.value = !isFavorite.value
	
	if (isAuthenticated()) {
		// Заглушка для сохранения в базу
		console.log(`Сохраняем товар в избранное в базе: ${isFavorite.value}`)
	} else {
		// Заглушка для сохранения в localStorage
		console.log(`Сохраняем товар в localStorage: ${isFavorite.value}`)
	}
}

</script>

<template>
	<div
		v-if="variant === 'mini'"
		:class="['flex flex-col items-center relative font-[Commissioner] font-light text-[11px] text-center sm:font-[Manrope] sm:text-xs', customClass]"
		@mouseenter="isHovered = true"
		@mouseleave="isHovered = false"
	>
		<div>
			<NuxtImg
				:src="imageUrls[0]" alt="card" width="300" height="450"
				:class="['rounded-lg', customImageClass]"
			/>
		</div>
	  <h4 class="mt-1 sm:mt-2">{{ text }}</h4>
		<span class="mt-0.5 block sm:mt-1">{{ priceFormatter(price!) }} <span class="text-[#5E5B58] line-through">{{ priceFormatter(oldPrice!) }}</span></span>
		<span class="mt-1 hidden sm:block">{{ color }}</span>
		<div class="mt-2 hidden gap-1 2xl:flex">
			<SizeButton custom-class="text-xs" />
		</div>
	  <NuxtImg
		  v-if="isHovered"
		  :src="isFavorite ? '/star-filled.svg' : '/star.svg'"
		  alt="star"
		  class="w-3 h-3 absolute z-10 right-2.5 top-2.5 sm:w-5 sm:h-5 sm:right-4 sm:top-4"
		  @click="toggleFavorite"
	  />
  </div>
  <div
	  v-else
	  :class="['relative font-[Commissioner] font-light text-[10px] text-center sm:font-[Manrope] sm:text-sm', customClass, isVisible ? 'animate-card-appear' : '']"
	  @mouseenter="isHovered = true"
	  @mouseleave="isHovered = false"
  >
	  <div class="relative w-full aspect-[460/680] overflow-hidden">
      <NuxtImg
	      v-for="(img, index) in props.imageUrls"
	      :key="index"
	      :src="img"
	      alt="card"
	      width="460"
	      height="680"
	      :class="['rounded-lg sm:rounded-2xl absolute top-0 left-0 w-full h-full', customImageClass]"
	      :style="imageStyles(index)"
	      @mousemove="handleMouseMove"
      />
    </div>
	  <div class="flex justify-center items-center gap-1 px-6 py-2">
		  <div
			  v-for="(_, index) in props.imageUrls"
			  :key="index"
			  class="flex-1 border-y border-[#A6CEFF]"
			  :style="barStyles(index)"
		  />
	  </div>
	  <h4 class="mt-1">{{ text }}</h4>
	  <span class="mt-0.5">{{ priceFormatter(price!) }}</span>
	  <NuxtImg
		  v-if="isHovered"
		  :src="isFavorite ? '/star-filled.svg' : '/star.svg'"
		  alt="star"
		  class="w-3 h-3 absolute z-10 right-2.5 top-2.5 sm:w-5 sm:h-5 sm:right-4 sm:top-4"
		  @click="toggleFavorite"
	  />
  </div>
</template>

<style scoped>
@keyframes card-appear {
	from {
		opacity: 0;
		transform: translateX(20px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.animate-card-appear {
	animation: card-appear 400ms ease-out forwards;
}
</style>