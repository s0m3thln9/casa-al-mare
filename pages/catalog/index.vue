<script setup lang="ts">
const images = {
	card1: "/card-1.jpg",
	card2: "/card-2.jpg",
	card3: "/card-3.jpg",
	promo1: "/promo-1.jpg",
}

const strokeCardCount = ref(4)
const isPopupOpen = ref(false)

const types = ["Топ", "Купальник", "Лиф", "Трусы", "Шорты", "Рубашка", "Брюки", "Туника", "Панамка", "Поло", "Сумка", "Полотенце"]
const colors: { title: string, value: string }[] = [
	{ title: "Синий", value: "#4A66C5" },
	{ title: "Голубой", value: "#6B93DD" },
	{ title: "Бирюзовый", value: "#97D6D1" },
	{ title: "Зеленый", value: "#68C768" },
	{ title: "Желтый",	value: "#F2D06C" },
	{ title: "Оранжевый", value: "#FDBF81" },
	{ title: "Красный",	value: "#D85959" },
	{	title: "Фиолетовый", value: "#BA97D6"	}
]
const sizes = ["XXS", "XS", "S", "M", "L", "XL"]
const pants: {
	title: string,
	src: string,
	altSrc: string
}[] = [
	{ title: "Стринги", src: "/pant-1.svg", altSrc: "/pant-1-filled.svg" },
	{ title: "Бразилиана", src: "/pant-2.svg", altSrc: "/pant-2-filled.svg" },
	{ title: "Классика", src: "/pant-3.svg", altSrc: "/pant-3-filled.svg" }
]
const prices = ["до 5 000", "до 20 000", "до 50 000"]
const sortTypes = ["По умолчанию", "По возрастанию цены", "По убыванию цены", "По популярности", "По новизне", "С промокодом ", "Только со скидкой", "В наличии"]
const materials = ["Махра", "Вязаные", "В рубчик"]
const useTypes = ["Повседневная одежда", "Пляж"]
const breadcrumsItems: { name: string, path?: string }[] = [{ name: "Главная", path: "/" }, { name: "Смотреть все" }]

const handleSelect = (selected: number) => {
	strokeCardCount.value = selected
}

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
	  <div class="hidden sm:flex justify-between px-4 py-6">
		  <AppBreadcrumbs :items="breadcrumsItems" />
		  <div class="flex gap-4">
			  <button class="cursor-pointer" @click="openPopup">
			    <NuxtImg src="/sliders.svg" alt="sliders" width="24" height="24" />
			  </button>
			  <SelectButton :variants="['4', '6']" @select="handleSelect" />
		  </div>
	  </div>
	  <div
		  class="flex justify-between items-center p-2 sticky top-0 bg-[#FFFFFA] z-10 sm:hidden"
	  >
		  <SelectButton :variants="['2', '3']" @select="handleSelect" />
		  <span class="text-[10px] font-light font-[Commissioner]">Смотреть все / Купальники</span>
		  <div class="flex items-center gap-1">
			  <span class="text-[11px] font-[Manrope]">(12)</span>
			  <button class="cursor-pointer" @click="openPopup">
			    <NuxtImg src="/sliders.svg" alt="sliders" width="21" height="21" />
			  </button>
		  </div>
	  </div>
	  <div
		  v-if="strokeCardCount === 4 || strokeCardCount === 2"
		  class="overflow-hidden grid grid-cols-2 px-2 gap-x-1 gap-y-2 sm:grid-cols-4 sm:px-4 sm:gap-x-4 sm:gap-y-6"
	  >
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
			  link="/catalog/item"
		  />
		  <BannerCard
			  :image-url="images.promo1"
			  text="SS26 SOLAR POWER"
			  custom-class="rounded-lg aspect-[1] col-span-2 sm:hidden"
			  object-position="center"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
			  link="/catalog/item"
		  />
		  <BannerCard
			  :image-url="images.promo1"
			  text="SS26 SOLAR POWER"
			  custom-class="rounded-lg aspect-[1] col-span-2 sm:hidden"
			  object-position="center"
		  />
	  </div>
	  <div
		  v-else
		  class="overflow-hidden grid grid-cols-3 px-2 gap-x-1 gap-y-2 sm:grid-cols-6 sm:px-4 sm:gap-x-4 sm:gap-y-6"
	  >
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
			  link="/catalog/item"
		  />
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
			  link="/catalog/item"
		  />
	  </div>
	  <div class="flex justify-center items-center pt-4 pb-2 sm:py-10">
		  <button class="text-xs font-light text-[#211D1D]">
			  Показать больше
		  </button>
	  </div>
	  <AppSEO
		  :paragraphs="['CASA AL MARE — эстетика тела, свобода выбора. Каталог CASA AL MARE создан для женщин, которые ищут не просто купальник или комплект белья, а выражение своей индивидуальности.\n'+
'Мы создаём коллекции, вдохновлённые побережьями, архитектурой юга и непринуждённой элегантностью.', 'В каталоге CASA AL MARE вы найдете:\n'+
'купальники: раздельные и слитные;\n'+
'комплекты нижнего белья: браллеты, трусики, боди;\n'+
'аксессуары: пляжные полотенца, сумки, косметички.\n'+
'мы используем премиальные материалы, адаптированные к разным типам фигуры и формам.\n'+
'каждое изделие проходит ручную проверку, а дизайн продуман до мелочей.', 'Быстрая доставка по всей России и миру. Поддержка клиентов работает ежедневно. Вся продукция произведена с заботой об экологии.\n'+
'Выбирайте купальники и бельё CASA AL MARE — сочетание модных решений, комфорта и женственности.\n'+
'Следите за новыми коллекциями, подписывайтесь на наш telegram, vk и открывайте красоту каждый день.']"
	  />
	  <AppPopup
		  title="Фильтр и сортировка" :is-popup-open="isPopupOpen"
		  @close-popup="closePopup"
	  >
			<div class="mt-6 flex flex-col gap-10 sm:mt-10">
				<div class="flex flex-col items-center gap-4 sm:gap-6">
					<h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">Тип</h3>
					<div class="flex flex-wrap gap-4 items-center justify-center">
						<SingleSelectButton :content="types" />
					</div>
				</div>
				<div class="grid grid-cols-4 gap-4 sm:gap-y-8">
					<ColorButton :colors="colors" />
				</div>
				<div class="flex flex-col items-center gap-4 sm:gap-6">
					<h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">Верх</h3>
					<div class="flex gap-4 items-center justify-center">
						<SingleSelectButton :content="sizes" />
					</div>
				</div>
				<div class="flex flex-col items-center gap-4 sm:gap-6">
					<h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">Низ</h3>
					<div class="flex gap-4 items-center justify-center">
						<SingleSelectButton :content="sizes" />
					</div>
				</div>
				<div class="flex justify-center items-center gap-6 text-xs">
				  <PantButton :pants="pants"/>
		    </div>
				<div class="flex flex-col items-center gap-4 sm:gap-6">
					<h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">Цена</h3>
					<div class="flex flex-wrap gap-4 items-center justify-center">
						<SingleSelectButton :content="prices" />
					</div>
				</div>
				<div class="flex flex-wrap gap-4 items-center justify-center">
					<MultiSelectButton :content="sortTypes" />
				</div>
				<div class="flex flex-col items-center gap-4 sm:gap-6">
					<h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">Материал</h3>
					<div class="flex flex-wrap gap-4 items-center justify-center">
						<SingleSelectButton :content="materials" />
					</div>
				</div>
				<div class="flex flex-col items-center gap-4 sm:gap-6">
					<h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">Назначение</h3>
					<div class="flex flex-wrap gap-4 items-center justify-center">
						<SingleSelectButton :content="useTypes" />
					</div>
				</div>
				<div class="flex items-center gap-4 sm:pt-6">
					<AppButton custom-class="py-4 px-4 sm:px-8" content="Сбросить" />
					<AppButton custom-class="w-full py-4 sm:p-4" variant="primary" content="Показать результаты" />
				</div>
			</div>
		</AppPopup>
  </main>
</template>

<style scoped>

</style>