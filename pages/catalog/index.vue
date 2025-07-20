<script setup lang="ts">
const images = {
	card1: "/card-1.jpg",
	card2: "/card-2.jpg",
	card3: "/card-3.jpg",
	promo1: "/promo-1.jpg",
}

const strokeCardCount = ref(4)

const handleSelect = (selected: number) => {
	strokeCardCount.value = selected
}

</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA]">
	  <div class="hidden sm:flex justify-between px-4 py-6">
		  <span
			  class="text-sm font-light text-[#211D1D]"
		  >
			  Смотреть все / Купальники
		  </span>
		  <div class="flex gap-4">
			  <NuxtImg src="/sliders.svg" alt="sliders" width="24" height="24" />
			  <SelectButton :variants="['4', '6']" @select="handleSelect" />
		  </div>
	  </div>
	  <div class="flex justify-between items-center p-2 sm:hidden">
		  <div
			  class="border-[0.7px] border-[#211D1D] flex rounded-lg overflow-hidden"
		  >
				<SelectButton :variants="['2', '3']" @select="handleSelect" />
		  </div>
		  <span class="text-[10px] font-light font-[Commissioner]">Смотреть все / Купальники</span>
		  <div class="flex items-center gap-1">
			  <span class="text-[11px] font-[Manrope]">(12)</span>
			  <NuxtImg src="/sliders.svg" alt="sliders" width="21" height="21" />
		  </div>
	  </div>
	  <div
		  v-if="strokeCardCount === 4 || strokeCardCount === 2"
		  class="grid grid-cols-2 px-2 gap-x-1 gap-y-2 sm:grid-cols-4 sm:px-4 sm:gap-x-4 sm:gap-y-6"
	  >
		  <CatalogCard
			  :image-urls="[images.card1, images.card2, images.card3]"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
		  />
		  <BannerCard
			  :image-url="images.promo1"
			  text="SS26 SOLAR POWER"
			  custom-class="rounded-lg aspect-[1] col-span-2 sm:hidden"
			  object-position="center"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="25500"
			  variant="large"
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
		  class="grid grid-cols-3 px-2 gap-x-1 gap-y-2 sm:grid-cols-6 sm:px-4 sm:gap-x-4 sm:gap-y-6"
	  >
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  :price="24600"
			  :old-price="26000"
			  color="Цвет"
			  variant="mini"
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
  </main>
</template>

<style scoped>

</style>