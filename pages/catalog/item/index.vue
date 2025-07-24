<script setup lang="ts">
const isPopupOpen = ref(false)

const images = {
	card1: "/item-page-1.jpg",
	item: "/item-page-1.jpg",
}
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
const breadcrumsItems: { name: string, path?: string }[] = [{ name: "Главная", path: "/" }, { name: "Смотреть все", path: "/catalog" }, { name: "Наименование" }]

const getScrollbarWidth = () => {
	const outer = document.createElement("div")
	outer.style.visibility = "hidden"
	outer.style.overflow = "scroll"
	document.body.appendChild(outer)
	const inner = document.createElement("div")
	outer.appendChild(inner)
	const width = outer.offsetWidth - inner.offsetWidth
	outer.remove()
	return width
}

const openPopup = () => {
	isPopupOpen.value = true
	const scrollbarWidth = getScrollbarWidth()
	document.body.style.overflow = "hidden"
	document.body.style.paddingRight = `${scrollbarWidth}px`
}

const closePopup = () => {
	isPopupOpen.value = false
	document.body.style.overflow = "auto"
	document.body.style.paddingRight = "0"
}
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D]">
	  <div class="p-2 sm:px-4 sm:py-6">
		  <AppBreadcrumbs :items="breadcrumsItems" />
	  </div>
	  <div class="px-0 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 sm:px-4">
		  <div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
			  <NuxtImg
				  src="/item-1.jpg" alt="item" width="726" height="1080"
				  class="sm:rounded-lg"
			  />
			  <NuxtImg
				  src="/item-2.jpg" alt="item" width="726" height="1080"
				  class="hidden sm:block sm:rounded-lg"
			  />
			  <NuxtImg
				  src="/item-3.jpg" alt="item" width="726" height="1080"
				  class="hidden sm:block sm:rounded-lg"
			  />
			  <NuxtImg
				  src="/item-4.jpg" alt="item" width="726" height="1080"
				  class="hidden sm:block sm:rounded-lg"
			  />
			  <NuxtImg
				  src="/item-5.jpg" alt="item" width="726" height="1080"
				  class="hidden sm:block sm:rounded-lg"
			  />
			  <NuxtImg
				  src="/item-6.jpg" alt="item" width="726" height="1080"
				  class="hidden sm:block sm:rounded-lg"
			  />
			  <div class="w-full flex justify-center items-center gap-1 px-4 sm:hidden">
				  <div class="w-full border-y-1 border-[#A6CEFF]" />
				  <div class="w-full border-y-1 border-[#A6CEFF] opacity-30" />
				  <div class="w-full border-y-1 border-[#A6CEFF] opacity-30" />
				  <div class="w-full border-y-1 border-[#A6CEFF] opacity-30" />
			  </div>
		  </div>
		  <div class="px-2 flex flex-col sm:px-0">
			  <div class="flex justify-center items-center">
				  <h2
					  class="font-[Inter] text-center text-[32px] sm:text-4xl"
				  >
					  Colored triangle top
				  </h2>
			  </div>
			  <div class="flex justify-center items-center gap-2 mt-4 sm:mt-6">
				  <span class="font-[Inter] font-light text-[17px] text-[#8C8785] sm:font-[Manrope] sm:font-normal sm:text-base sm:text-[#211D1D]">36 000 ₽</span>
				  <span class="font-[Inter] line-through font-light text-[17px] text-[#8C8785] sm:font-[Manrope] sm:font-normal sm:text-base sm:text-[#211D1D]">39 700 ₽</span>
			  </div>
			  <div class="flex justify-center items-center mt-1 sm:mt-2">
				  <span class="font-light text-xs">Скидка #%</span>
			  </div>
			  <div class="flex justify-center items-center gap-6 mt-14">
				  <PantButton :pants="other" other />
			  </div>
			  <div class="flex flex-col justify-center items-center gap-4 mt-12 sm:mt-10">
				  <div class="flex justify-center items-center gap-3 font-light sm:gap-4 sm:font-normal">
					  <SingleSelectButton :content="sizes" />
				  </div>
				  <span class="text-xs">Верх</span>
			  </div>
			  <div class="flex flex-col justify-center items-center gap-4 mt-12 sm:mt-10">
				  <div class="flex justify-center items-center gap-3 font-light sm:gap-4 sm:font-normal">
					  <SingleSelectButton :content="sizes" />
				  </div>
				  <span class="text-xs">Низ</span>
				  <div class="flex justify-center items-center gap-6 text-xs">
				    <PantButton :pants="pants"/>
		      </div>
			  </div>
			  <div class="flex flex-col justify-center items-center gap-1 mt-12 sm:mt-10">
				  <span class="font-light text-xs">На модели размер: топ S, низ M</span>
				  <span class="text-[11px] text-[#363636]">Параметры модели: 175 80/60/89</span>
			  </div>
			  <div class="flex flex-col justify-center items-center gap-4 mt-6">
				  <BuyButton in-stock available-quantity is-size-selected />
				  <AppButton variant="secondary" content="Собрать комплект" custom-class="w-full py-4" @click="openPopup" />
			  </div>
			  <div class="flex justify-center items-center mt-4 sm:mt-6">
				  <WishlistButton />
			  </div>
			  <div class="mt-14 flex flex-col justify-center items-center gap-3 p-4 rounded-2xl border border-[#BBB8B6]">
				  <div class="flex justify-center gap-2.5 items-center w-full sm:justify-between sm:gap-0">
					  <span class="font-light text-sm">Состав и уход</span>
					  <NuxtImg src="/help.svg" alt="help" width="16" height="16" />
				  </div>
				  <div class="w-full h-[1px] bg-[#BBB8B6]"/>
				  <div class="flex justify-center gap-2.5 items-center w-full sm:justify-between sm:gap-0">
					  <span class="font-light text-sm">Определить размер</span>
					  <NuxtImg src="/help.svg" alt="help" width="16" height="16" />
				  </div>
				  <div class="w-full h-[1px] bg-[#BBB8B6]"/>
				  <div class="flex justify-center gap-2.5 items-center w-full sm:justify-between sm:gap-0">
					  <span class="font-light text-sm">Доставка и возврат</span>
					  <NuxtImg src="/help.svg" alt="help" width="16" height="16" />
				  </div>
				  <div class="w-full h-[1px] bg-[#BBB8B6]"/>
				  <div class="flex justify-center gap-2.5 items-center w-full sm:justify-between sm:gap-0">
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
				  :image-urls="[images.item, images.item, images.item]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
				  link="/catalog/item"
			  />
			  <CatalogCard
				  :image-urls="[images.item, images.item, images.item]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
				  link="/catalog/item"
			  />
			  <CatalogCard
				  :image-urls="[images.item, images.item, images.item]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
				  link="/catalog/item"
			  />
		  </div>
	  </div>
	  <div class="px-2 flex flex-col justify-center items-start gap-4 mt-18 mb-18 sm:items-center sm:gap-12 sm:mt-12 sm:mb-4">
		  <h2 class="font-[Manrope] text-[15px] font-light sm:font-[Inter] sm:text-4xl sm:font-normal">Вы недавно смотрели</h2>
		  <div class="w-full grid gap-2 grid-cols-3 sm:gap-4 sm:px-[15%]">
			  <CatalogCard
				  :image-urls="[images.item, images.item, images.item]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
				  link="/catalog/item"
			  />
			  <CatalogCard
				  :image-urls="[images.item, images.item, images.item]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
				  link="/catalog/item"
			  />
			  <CatalogCard
				  :image-urls="[images.item, images.item, images.item]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
				  link="/catalog/item"
			  />
		  </div>
	  </div>
	  <AppPopup :is-popup-open="isPopupOpen" title="Собрать комплект" @close-popup="closePopup" >
		  <div class="flex flex-col gap-6 mt-6">
			  <div class="grid grid-cols-2 gap-y-6 gap-x-4 sm:gap-x-2">
				  <div class="flex flex-col gap-2">
					  <span class="font-[Manrope] text-sm">Верх</span>
					  <CatalogCard custom-image-class="aspect-[200/300] w-full" popup :image-urls="[images.card1, images.card1, images.card1]" variant="mini" :price="24600" :old-price="26000" color="Цвет" text="Название" />
				  </div>
				  <div class="flex flex-col gap-2">
					  <span class="font-[Manrope] text-sm">Низ</span>
					  <CatalogCard custom-image-class="aspect-[200/300] w-full" popup :image-urls="[images.card1, images.card1, images.card1]" variant="mini" :price="24600" :old-price="26000" color="Цвет" text="Название" />
				  </div>
				  <div class="flex flex-col gap-2">
					  <span class="font-[Manrope] text-sm">Аксессуар</span>
					  <CatalogCard custom-image-class="aspect-[200/300] w-full" popup :image-urls="[images.card1, images.card1, images.card1]" variant="mini" :price="24600" :old-price="26000" color="Цвет" text="Название" />
				  </div>
			  </div>
			  <BuyButton available-quantity in-stock is-size-selected />
		  </div>
	  </AppPopup>
  </main>
</template>

<style scoped>

</style>