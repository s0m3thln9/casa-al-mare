<script setup lang="ts">
const route = useRoute()
const segment = route.params.id
const catalogStore = useCatalogStore()
const item = catalogStore.items.find(item => item.id === segment)
const pants: {
	title: string,
	src: string,
	altSrc: string
}[] = [
	{title: "Стринги", src: "/pant-1.svg", altSrc: "/pant-1-filled.svg"},
	{title: "Бразилиана", src: "/pant-2.svg", altSrc: "/pant-2-filled.svg"},
	{title: "Классика", src: "/pant-3.svg", altSrc: "/pant-3-filled.svg"}
]
const sizes = ["XXS", "XS", "S", "M", "L", "XL"]
const other: { title: string, src: string }[] = [{ title: "Оранжевый", src: "/orange.png" }, { title: "Синий", src: "/blue.png" }]
const breadcrumsItems: { name: string, path?: string }[] = [{ name: "Главная", path: "/" }, { name: "Смотреть все", path: "/catalog" }, { name: item!.name }]

const currentImageIndex = ref(0)
const touchStartX = ref(0)
const areImagesLoaded = ref(false)

const popupStore = usePopupStore()
const itemStore = useItemStore()
const setStore = useSetStore()

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

const handleTouchStart = (e: TouchEvent) => {
	touchStartX.value = e.touches[0].clientX
}

const handleTouchEnd = (e: TouchEvent) => {
	const touchEndX = e.changedTouches[0].clientX
	const deltaX = touchEndX - touchStartX.value
	const threshold = 50
	if (deltaX > threshold) {
		currentImageIndex.value = (currentImageIndex.value - 1 + item!.images.length) % item!.images.length
	} else if (deltaX < -threshold) {
		currentImageIndex.value = (currentImageIndex.value + 1) % item!.images.length
	}
}

const preloadImages = async () => {
	const loadImage = (url: string) => {
		return new Promise((resolve, reject) => {
			const img = new Image()
			img.src = url
			img.onload = resolve
			img.onerror = reject
		})
	}
	
	try {
		await Promise.all(item!.images.map(url => loadImage(url)))
		areImagesLoaded.value = true
	} catch (error) {
		console.error('Ошибка при загрузке изображений:', error)
		areImagesLoaded.value = true
	}
}

const calculateDiscount = (price: number, oldPrice: number) => {
	if (!oldPrice || oldPrice <= price) return 0;
	return Math.round(((oldPrice - price) / oldPrice) * 100);
};

const discount = calculateDiscount(item!.price, item!.oldPrice)

const priceFormatter = (value: number) => {
	const formattedValue = new Intl.NumberFormat('ru-RU').format(value)
	return `${formattedValue} ₽`
}

onMounted(() => {
	preloadImages()
})

</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] w-full">
	  <div class="p-2 sm:px-4 sm:py-6">
		  <AppBreadcrumbs :items="breadcrumsItems" />
	  </div>
	  <div class="px-0 grid grid-cols-1 sm:grid-cols-[minmax(auto,1450px)_1fr] w-full gap-8 sm:px-4">
		  <div class="block sm:hidden">
			  <div class="relative w-full aspect-[460/680] overflow-hidden" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
				  <div v-if="!areImagesLoaded" class="aspect-[460/680] w-full bg-[#F9F6EC]" />
			    <NuxtImg
				    v-for="(img, index) in item?.images"
				    v-else
				    :key="index"
				    :src="img"
				    alt="item"
				    width="460"
				    height="680"
				    class="absolute top-0 left-0 w-full h-full"
				    :style="imageStyles(index)"
			    />
			  </div>
			  <div class="flex justify-center items-center gap-1 px-4 mt-2">
			    <div
				    v-for="(_, index) in item!.images"
				    :key="index"
				    class="flex-1 border-y border-[#A6CEFF]"
				    :style="barStyles(index)"
			    />
			  </div>
			</div>
		  <div class="hidden sm:grid grid-cols-1 gap-2 lg:grid-cols-2">
			  <template v-if="!areImagesLoaded">
				  <div v-for="(_, index) in item!.images" :key="index" class="aspect-[726/1080] bg-[#F9F6EC] rounded-lg" />
			  </template>
        <NuxtImg
				  v-for="(img, index) in item!.images"
				  v-else
				  :key="index"
				  :src="img"
				  alt="item"
				  width="726"
				  height="1080"
				  class="sm:rounded-lg"
			  />
			</div>
		  <div class="px-2 flex flex-col max-w-[400px] sm:px-0">
			  <div class="flex justify-center items-center">
				  <h2
					  class="font-[Inter] text-center text-[32px] sm:text-4xl"
				  >
					  {{ item!.name }}
				  </h2>
			  </div>
			  <div class="flex justify-center items-center gap-2 mt-4 sm:mt-6">
				  <span class="font-[Inter] font-light text-[17px] text-[#8C8785] sm:font-[Manrope] sm:font-normal sm:text-base sm:text-[#211D1D]">{{ priceFormatter(item!.price) }}</span>
				  <span class="font-[Inter] line-through font-light text-[17px] text-[#8C8785] sm:font-[Manrope] sm:font-normal sm:text-base sm:text-[#211D1D]">{{ priceFormatter(item!.oldPrice) }}</span>
			  </div>
			  <div class="flex justify-center items-center mt-1 sm:mt-2">
				  <span class="font-light text-xs">Скидка {{ discount }}%</span>
			  </div>
			  <div class="flex justify-center items-center gap-6 mt-14">
				  <PantButton v-model="itemStore.color" :pants="other" other />
			  </div>
			  <div class="flex flex-col justify-center items-center gap-4 mt-12 sm:mt-10">
				  <div class="flex justify-center items-center gap-3 font-light sm:gap-4 sm:font-normal">
					  <SingleSelectButton v-model="itemStore.top" :content="sizes" />
				  </div>
				  <span class="text-xs">Верх</span>
			  </div>
			  <div class="flex flex-col justify-center items-center gap-4 mt-12 sm:mt-10">
				  <div class="flex justify-center items-center gap-3 font-light sm:gap-4 sm:font-normal">
					  <SingleSelectButton v-model="itemStore.bottom" :content="sizes" />
				  </div>
				  <span class="text-xs">Низ</span>
				  <div class="flex justify-center items-center gap-6 text-xs">
				    <PantButton v-model="itemStore.pantsType" :pants="pants"/>
		      </div>
			  </div>
			  <div class="flex flex-col justify-center items-center gap-1 mt-12 sm:mt-10">
				  <span class="font-light text-xs">На модели размер: топ S, низ M</span>
				  <span class="text-[11px] text-[#363636]">Параметры модели: 175 80/60/89</span>
			  </div>
			  <div class="flex flex-col justify-center items-center gap-4 mt-6">
				  <BuyButton in-stock available-quantity :is-parameters-selected="itemStore.canAddToCart" />
				  <AppButton variant="secondary" content="Собрать комплект" custom-class="w-full py-4" @click="popupStore.open('set')" />
			  </div>
			  <div class="flex justify-center items-center mt-4 sm:mt-6">
				  <WishlistButton />
			  </div>
			  <div class="mt-14 flex flex-col justify-center items-center gap-3 p-4 rounded-2xl border border-[#BBB8B6]">
				  <div class="flex justify-center gap-2.5 items-center w-full sm:justify-between cursor-pointer sm:gap-0">
					  <span class="font-light text-sm">Состав и уход</span>
					  <NuxtImg src="/help.svg" alt="help" width="16" height="16" />
				  </div>
				  <div class="w-full h-[1px] bg-[#BBB8B6]"/>
				  <div
					  class="flex justify-center gap-2.5 items-center w-full sm:justify-between cursor-pointer sm:gap-0"
					  @click="popupStore.open('size')"
				  >
					  <span class="font-light text-sm">Определить размер</span>
					  <NuxtImg src="/help.svg" alt="help" width="16" height="16" />
				  </div>
				  <div class="w-full h-[1px] bg-[#BBB8B6]"/>
				  <div class="flex justify-center gap-2.5 items-center w-full sm:justify-between cursor-pointer sm:gap-0">
					  <span class="font-light text-sm">Доставка и возврат</span>
					  <NuxtImg src="/help.svg" alt="help" width="16" height="16" />
				  </div>
				  <div class="w-full h-[1px] bg-[#BBB8B6]"/>
				  <div
					  class="flex justify-center gap-2.5 items-center w-full sm:justify-between cursor-pointer sm:gap-0"
					  @click="popupStore.open('subscription')"
				  >
					  <span class="font-light text-sm">Подписаться на рассылку</span>
					  <NuxtImg src="/mail.svg" alt="mail" width="16" height="16" />
				  </div>
			  </div>
		  </div>
	  </div>
	  <div class="px-2 flex flex-col justify-center items-start gap-4 mt-18 sm:items-center sm:gap-12 sm:mt-24">
		  <h2 class="font-[Manrope] text-[15px] font-light sm:font-[Inter] sm:text-4xl sm:font-normal">Вам может понравиться</h2>
		  <div class="w-full grid gap-2 grid-cols-3 sm:gap-4 sm:px-[15%]">
			  <CatalogCard
				  variant="large"
				  :slider-images="item!.sliderImages"
				  :color="item!.color"
				  :name="item!.name"
				  :price="item!.price"
				  :old-price="item!.oldPrice"
				  :link="`/catalog/${item!.id}`"
			  />
			  <CatalogCard
				  variant="large"
				  :slider-images="item!.sliderImages"
				  :color="item!.color"
				  :name="item!.name"
				  :price="item!.price"
				  :old-price="item!.oldPrice"
				  :link="`/catalog/${item!.id}`"
			  />
			  <CatalogCard
				  variant="large"
				  :slider-images="item!.sliderImages"
				  :color="item!.color"
				  :name="item!.name"
				  :price="item!.price"
				  :old-price="item!.oldPrice"
				  :link="`/catalog/${item!.id}`"
			  />
		  </div>
	  </div>
	  <div class="px-2 flex flex-col justify-center items-start gap-4 mt-18 mb-18 sm:items-center sm:gap-12 sm:mt-12 sm:mb-4">
		  <h2 class="font-[Manrope] text-[15px] font-light sm:font-[Inter] sm:text-4xl sm:font-normal">Вы недавно смотрели</h2>
		  <div class="w-full grid gap-2 grid-cols-3 sm:gap-4 sm:px-[15%]">
			  <CatalogCard
				  variant="large"
				  :slider-images="item!.sliderImages"
				  :color="item!.color"
				  :name="item!.name"
				  :price="item!.price"
				  :old-price="item!.oldPrice"
				  :link="`/catalog/${item!.id}`"
			  />
			  <CatalogCard
				  variant="large"
				  :slider-images="item!.sliderImages"
				  :color="item!.color"
				  :name="item!.name"
				  :price="item!.price"
				  :old-price="item!.oldPrice"
				  :link="`/catalog/${item!.id}`"
			  />
			  <CatalogCard
				  variant="large"
				  :slider-images="item!.sliderImages"
				  :color="item!.color"
				  :name="item!.name"
				  :price="item!.price"
				  :old-price="item!.oldPrice"
				  :link="`/catalog/${item!.id}`"
			  />
		  </div>
	  </div>
	  <AppPopup title="Собрать комплект" popup-id="set">
		  <div class="flex flex-col gap-6 mt-6">
			  <div class="grid grid-cols-2 gap-y-6 gap-x-4 sm:gap-x-2">
				  <div class="flex flex-col gap-2">
					  <span class="font-[Manrope] text-sm">Верх</span>
					  <CatalogCard v-model="setStore.top" custom-image-class="aspect-[200/300] w-full" popup :slider-images="item!.sliderImages" variant="mini" :price="item!.price" :old-price="item!.oldPrice" :color="item!.color" :name="item!.name" />
				  </div>
				  <div class="flex flex-col gap-2">
					  <span class="font-[Manrope] text-sm">Низ</span>
					  <CatalogCard v-model="setStore.bottom" custom-image-class="aspect-[200/300] w-full" popup :slider-images="item!.sliderImages" variant="mini" :price="item!.price" :old-price="item!.oldPrice" :color="item!.color" :name="item!.name" />
				  </div>
				  <div class="flex flex-col gap-2">
					  <span class="font-[Manrope] text-sm">Аксессуар</span>
					  <CatalogCard v-model="setStore.accessory" custom-image-class="aspect-[200/300] w-full" popup :slider-images="item!.sliderImages" variant="mini" :price="item!.price" :old-price="item!.oldPrice" :color="item!.color" :name="item!.name" />
				  </div>
			  </div>
			  <BuyButton available-quantity in-stock :is-parameters-selected="setStore.canAddToCart" />
		  </div>
	  </AppPopup>
	  <AppPopup title="Определить размер" popup-id="size">
		  <div class="mt-6 flex flex-col gap-6">
			  <div class="p-4 border border-[#BBB8B6] rounded-2xl flex flex-col gap-1">
				  <span class="font-[Manrope] text-xs text-[#363636]">На модели размер: S</span>
				  <span class="font-[Manrope] text-xs text-[#363636]">Параметры модели: 177 80/60/90</span>
			  </div>
			  <div class="p-4 border border-[#BBB8B6] rounded-2xl flex flex-col gap-4">
				  <div class="flex gap-1 flex-col">
					  <h3 class="font-[Manrope] text-sm text-[#211D1D]">Таблица размеров</h3>
					  <span class="font-[Manrope] text-xs text-[#363636]">Сопоставьте ваши параметры с указанными значениями, чтобы определить свой размер</span>
				  </div>
				  <div class="border border-[#BBB8B6] rounded-lg flex flex-col pt-2 pb-4 gap-5">
					  <div class="flex flex-col gap-2">
						  <div class="grid grid-cols-9 border-b-[0.7px] border-[#8C8785] gap-4 pb-2 px-6">
							  <div class="col-span-3 font-[Manrope] text-xs text-[#211D1D]">INT</div>
							  <div class="font-[Manrope] text-xs text-[#211D1D]">XSS</div>
							  <div class="font-[Manrope] text-xs text-[#211D1D]">XS</div>
							  <div class="font-[Manrope] text-xs text-[#211D1D]">S</div>
							  <div class="font-[Manrope] text-xs text-[#211D1D]">M</div>
							  <div class="font-[Manrope] text-xs text-[#211D1D]">L</div>
							  <div class="font-[Manrope] text-xs text-[#211D1D]">XL</div>
						  </div>
						  <div class="grid grid-cols-9 border-b-[0.7px] border-[#8C8785] gap-4 pb-2 px-6">
							  <div class="col-span-3 font-[Manrope] text-xs text-[#211D1D]">RU</div>
							  <div class="font-[Manrope] text-xs text-[#211D1D]">40</div>
							  <div class="font-[Manrope] text-xs text-[#211D1D]">42</div>
							  <div class="font-[Manrope] text-xs text-[#211D1D]">44</div>
							  <div class="font-[Manrope] text-xs text-[#211D1D]">46</div>
							  <div class="font-[Manrope] text-xs text-[#211D1D]">48</div>
							  <div class="font-[Manrope] text-xs text-[#211D1D]">50</div>
						  </div>
					  </div>
					  <div class="px-4 flex flex-col gap-1">
						  <div class="px-2 py-1.5 bg-[#F9F6EC] rounded-lg grid grid-cols-9 gap-4">
							  <div class="col-span-3 font-[Manrope] text-xs text-[#211D1D] pl-2">Обхват груди</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">80</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">84</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">88</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">92</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">96</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">100</div>
						  </div>
						  <div class="px-2 py-1.5 bg-[#F9F6EC] rounded-lg grid grid-cols-9 gap-4">
							  <div class="col-span-3 font-[Manrope] text-xs text-[#211D1D] pl-2">Обхват талии</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">60</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">64</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">68</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">72</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">76</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">80</div>
						  </div>
						  <div class="px-2 py-1.5 bg-[#F9F6EC] rounded-lg grid grid-cols-9 gap-4">
							  <div class="col-span-3 font-[Manrope] text-xs text-[#211D1D] pl-2">Обхват бедер</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">88</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">92</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">96</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">100</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">104</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">108</div>
						  </div>
						  <div class="px-2 py-1.5 bg-[#F9F6EC] rounded-lg grid grid-cols-9 gap-4">
							  <div class="col-span-3 font-[Manrope] text-xs text-[#211D1D] pl-2">Рост</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">165</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">170</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">170</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">170</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">175</div>
							  <div class="font-[Manrope] text-xs text-[#363636]">175</div>
						  </div>
					  </div>
				  </div>
				  <div class="border border-[#BBB8B6] rounded-lg flex flex-col p-4 gap-4">
					  <div class="flex gap-1 flex-col">
						  <h3 class="font-[Manrope] text-sm text-[#211D1D]">Обмеры изделия</h3>
						  <span class="font-[Manrope] text-xs text-[#363636]">Сравните обмеры аналогичных вещей из вашего гардероба, чтобы выбрать подходящую посадку</span>
					  </div>
					  <div class="flex flex-col gap-2">
						  <span class="font-[Manrope] text-xs text-[#363636]">Размер S:</span>
						  <span class="font-[Manrope] text-xs text-[#363636]">Размер M:</span>
						  <span class="font-[Manrope] text-xs text-[#363636]">Размер L:</span>
					  </div>
				  </div>
			  </div>
		  </div>
	  </AppPopup>
  </main>
</template>

<style scoped>

</style>