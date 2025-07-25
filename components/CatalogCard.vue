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
	link?: string
	popup?: boolean
}>()

const currentImageIndex = ref(0)
const isTransitioning = ref(false)
const isHovered = ref(false)
const isFavorite = ref(false)
const isVisible = ref(false)
const isWideScreen = ref(false)
const touchStartX = ref(0)

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

const sizes = ["XSS", "XS", "S", "M", "L", "XL", "XXL"]

onMounted(() => {
	isVisible.value = true
	updateScreenWidth()
	window.addEventListener('resize', updateScreenWidth)
})

onUnmounted(() => {
	window.removeEventListener('resize', updateScreenWidth)
})

const updateScreenWidth = () => {
	isWideScreen.value = document.body.clientWidth > 640
}

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
	if (!isWideScreen.value) return
	const target = e.currentTarget as HTMLElement
	const rect = target.getBoundingClientRect()
	const x = e.clientX - rect.left
	const width = rect.width
	const section = width / props.imageUrls.length
	const newIndex = Math.floor(x / section) < 0 ? 0 : Math.floor(x / section)
	
	if (newIndex !== currentImageIndex.value) {
		isTransitioning.value = true
		currentImageIndex.value = newIndex
		setTimeout(() => {
			isTransitioning.value = false
		}, 500)
	}
}

const handleTouchStart = (e: TouchEvent) => {
	touchStartX.value = e.touches[0].clientX
}

const handleTouchEnd = (e: TouchEvent) => {
	const touchEndX = e.changedTouches[0].clientX
	const deltaX = touchEndX - touchStartX.value
	const threshold = 50
	if (deltaX > threshold) {
		currentImageIndex.value = (currentImageIndex.value - 1 + props.imageUrls.length) % props.imageUrls.length
	} else if (deltaX < -threshold) {
		currentImageIndex.value = (currentImageIndex.value + 1) % props.imageUrls.length
	}
}

const handleClick = () => {
	if (props.link) {
		navigateTo(props.link)
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
		:class="['flex flex-col items-center relative font-[Commissioner] text-[#211D1D] font-light text-[11px] text-center sm:font-[Manrope] sm:text-xs', customClass, isWideScreen && 'justify-between flex-1']"
		@mouseenter="isHovered = true"
		@mouseleave="isHovered = false"
	>
		<div>
			<NuxtImg
				:src="imageUrls[0]" alt="card" width="300" :height="(isHovered && isWideScreen) ? 470 : 450"
				:class="['rounded-lg', customImageClass, popup && 'aspect-[200/300] w-full', (popup && isHovered && isWideScreen) && 'aspect-[200/320]']"
				@click="handleClick"
			/>
		</div>
	  <h4 class="mt-1 sm:mt-2">{{ text }}</h4>
		<span class="mt-0.5 block sm:mt-1">{{ priceFormatter(price!) }} <span class="text-[#5E5B58] line-through">{{ priceFormatter(oldPrice!) }}</span></span>
		<span v-if="!isHovered" class="my-1 hidden sm:block">{{ color }}</span>
		<div :class="['hidden gap-1 2xl:flex', popup && 'flex-wrap justify-center']">
			<SingleSelectButton :content="sizes" custom-class="text-xs" />
		</div>
	  <NuxtImg
		  v-if="!isWideScreen || isHovered"
		  :src="isFavorite ? '/star-filled.svg' : '/star.svg'"
		  alt="star"
		  class="w-3 h-3 absolute z-10 right-2.5 top-2.5 sm:w-5 sm:h-5 sm:right-4 sm:top-4"
		  @click="toggleFavorite"
	  />
  </div>
  <div
	  v-else
	  :class="['relative font-[Commissioner] font-light text-[10px] text-center text-[#211D1D] sm:font-[Manrope] sm:text-sm', customClass, isVisible ? 'animate-card-appear' : '']"
	  @mouseenter="isHovered = true"
	  @mouseleave="isHovered = false"
  >
	  <div class="relative w-full aspect-[460/680] overflow-hidden" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
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
	      @click="handleClick"
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
		  v-if="!isWideScreen || isHovered"
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