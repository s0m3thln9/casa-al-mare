<script setup lang="ts">
import axios from "axios"

const images = {
	card1: "/card-1.jpg",
	card2: "/card-2.jpg",
	card3: "/card-3.jpg",
	promo1: "/promo-1.jpg",
}

const popupStore = usePopupStore()
const catalogStore = useCatalogStore()
const isMobile = ref(false)
const selectedSizes = ref<Record<string, string | null>>({})

const currentCardCount = computed(() => isMobile.value ? catalogStore.mobileStrokeCardCount : catalogStore.desktopStrokeCardCount);

const handleResize = () => {
	isMobile.value = window.innerWidth < 640;
};

onMounted(() => {
	isMobile.value = window.innerWidth < 640;
	window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
	window.removeEventListener('resize', handleResize);
});

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

const visibleItems = computed(() => {
	return catalogStore.filteredItems.slice(0, catalogStore.currentVisibleCardCount)
})

const load = () => {
	const newCount = catalogStore.currentVisibleCardCount + 12
	catalogStore.currentVisibleCardCount = Math.min(newCount, catalogStore.filteredItems.length)
}

onMounted(async  () => {
	const response = await axios.get('https://swimwear.kyokata.wtf/api/getProducts')
})

</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D]">
	  <div
		  v-if="!isMobile"
		  class="flex justify-between px-4 py-6"
	  >
		  <AppBreadcrumbs :items="breadcrumsItems" />
		  <div class="flex gap-4">
			  <button class="cursor-pointer" @click="popupStore.open('filter')">
			    <NuxtImg src="/sliders.svg" alt="sliders" width="24" height="24" />
			  </button>
			  <SelectButton v-model="catalogStore.desktopStrokeCardCount" :variants="['4', '6']" />
		  </div>
	  </div>
	  <div
		  v-else
		  class="flex justify-between items-center p-2 sticky top-0 bg-[#FFFFFA] z-10"
	  >
		  <SelectButton v-model="catalogStore.mobileStrokeCardCount" :variants="['2', '3']" />
		  <span class="text-[10px] font-light font-[Commissioner]">Смотреть все / Купальники</span>
		  <div class="flex items-center gap-1">
			  <span class="text-[11px] font-[Manrope]">(12)</span>
			  <button class="cursor-pointer" @click="popupStore.open('filter')">
			    <NuxtImg src="/sliders.svg" alt="sliders" width="21" height="21" />
			  </button>
		  </div>
	  </div>
	  <div
		  v-if="currentCardCount === '4' || currentCardCount === '2'"
		  class="overflow-hidden grid grid-cols-2 px-2 gap-x-1 gap-y-2 sm:grid-cols-4 sm:px-4 sm:gap-x-4 sm:gap-y-6"
	  >
		  <template v-for="(item, index) in visibleItems" :key="item.id">
	      <template v-if="index > 0 && index % 6 === 0">
	        <BannerCard
		        :image-url="images.promo1"
		        text="SS26 SOLAR POWER"
		        custom-class="rounded-lg aspect-[1] col-span-2 sm:hidden"
		        object-position="center"
	        />
	      </template>
			  <CatalogCard
				  :id="item.id"
				  v-model="selectedSizes[item.id]"
		      :slider-images="item.sliderImages"
		      :color="item.color"
		      :name="item.name"
		      :price="item.price"
		      :old-price="item.oldPrice"
		      variant="large"
		      :link="`/catalog/${item.id}`"
	      />
	    </template>
	  </div>
	  <div
		  v-else
		  class="overflow-hidden grid grid-cols-3 px-2 gap-x-1 gap-y-2 sm:grid-cols-6 sm:px-4 sm:gap-x-4 sm:gap-y-6"
	  >
		  <template v-for="item in visibleItems" :key="item.id">
			  <CatalogCard
				  :id="item.id"
				  v-model="selectedSizes[item.id]"
				  :slider-images="item.sliderImages"
				  :color="item.color"
				  :name="item.name"
				  :price="item.price"
				  :old-price="item.oldPrice"
				  variant="mini"
				  :link="`/catalog/${item.id}`"
			  />
		  </template>
	  </div>
	  <div
		  v-if="catalogStore.currentVisibleCardCount < catalogStore.filteredItems.length"
		  class="flex justify-center items-center pt-4 pb-2 sm:py-10"
	  >
		  <LoadButton content="Показать больше" @click="load" />
	  </div>
	  <div
		  v-else
		  class="pt-4 pb-2 sm:py-10"
	  />
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
		  title="Фильтр и сортировка"
		  popup-id="filter"
	  >
			<div class="mt-6 flex flex-col gap-10 sm:mt-10">
				<div class="flex flex-col items-center gap-4 sm:gap-6">
					<h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">Тип</h3>
					<div class="flex flex-wrap gap-4 items-center justify-center">
						<SingleSelectButton v-model="catalogStore.sortAndFilter.type" :content="types" />
					</div>
				</div>
				<div class="grid grid-cols-4 gap-4 sm:gap-y-8">
					<ColorButton v-model="catalogStore.sortAndFilter.color" :colors="colors" />
				</div>
				<div class="flex flex-col items-center gap-4 sm:gap-6">
					<h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">Верх</h3>
					<div class="flex gap-4 items-center justify-center">
						<SingleSelectButton v-model="catalogStore.sortAndFilter.top" :content="sizes" />
					</div>
				</div>
				<div class="flex flex-col items-center gap-4 sm:gap-6">
					<h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">Низ</h3>
					<div class="flex gap-4 items-center justify-center">
						<SingleSelectButton v-model="catalogStore.sortAndFilter.bottom" :content="sizes" />
					</div>
				</div>
				<div class="flex justify-center items-center gap-6 text-xs">
				  <PantButton v-model="catalogStore.sortAndFilter.pantsType" :pants="pants"/>
		    </div>
				<div class="flex flex-col items-center gap-4 sm:gap-6">
					<h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">Цена</h3>
					<div class="flex flex-wrap gap-4 items-center justify-center">
						<SingleSelectButton v-model="catalogStore.sortAndFilter.priceLimit" :content="prices" />
					</div>
				</div>
				<div class="flex flex-wrap gap-4 items-center justify-center">
					<SingleSelectButton v-model="catalogStore.sortAndFilter.price" :content="sortTypes" />
				</div>
				<div class="flex flex-col items-center gap-4 sm:gap-6">
					<h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">Материал</h3>
					<div class="flex flex-wrap gap-4 items-center justify-center">
						<SingleSelectButton v-model="catalogStore.sortAndFilter.material" :content="materials" />
					</div>
				</div>
				<div class="flex flex-col items-center gap-4 sm:gap-6">
					<h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">Назначение</h3>
					<div class="flex flex-wrap gap-4 items-center justify-center">
						<SingleSelectButton v-model="catalogStore.sortAndFilter.useType" :content="useTypes" />
					</div>
				</div>
				<div class="flex items-center gap-4 sm:pt-6">
					<AppButton custom-class="py-4 px-4 sm:px-8" content="Сбросить" @click="catalogStore.reset" />
					<AppButton custom-class="w-full py-4 sm:p-4" variant="primary" content="Показать результаты" />
				</div>
			</div>
		</AppPopup>
  </main>
</template>

<style scoped>

</style>