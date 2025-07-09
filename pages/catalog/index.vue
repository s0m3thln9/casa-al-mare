<script setup lang="ts">
const images = {
	card1: "/card-1.jpg",
	promo1: "/promo-1.jpg",
}
</script>

<template>
  <main class="font-[Manrope]">
	  <div class="hidden sm:flex justify-between px-4 py-6">
		  <span
			  class="text-sm font-light text-[#211D1D]"
		  >Смотреть все / Купальники</span>
		  <div class="flex gap-4">
			  <NuxtImg src="/sliders.svg" alt="sliders" width="24" height="24" />
			  <div
				  class="border-[0.7px] border-[#211D1D] flex rounded-lg overflow-hidden"
			  >
				  <div
					  class="bg-[#211D1D] text-[#FFFFFA] flex items-center px-4 py-1.5 text-xs"
				  >
					  4
				  </div>
				  <div
					  class="bg-[#FFFFFA] text-[#211D1D] flex items-center px-4 py-1.5 text-xs"
				  >
					  6
				  </div>
			  </div>
		  </div>
	  </div>
	  <div class="flex justify-between items-center p-2 sm:hidden">
		  <div
			  class="border-[0.7px] border-[#211D1D] flex rounded-lg overflow-hidden"
		  >
				<div
					class="bg-[#211D1D] text-[#FFFFFA] flex items-center px-2 py-1 text-[10px] font-light font-[Commissioner]"
				>
					2
				</div>
			  <div
				  class="bg-[#FFFFFA] text-[#211D1D] flex items-center px-2 py-1 text-[10px] font-light font-[Commissioner]"
			  >
				  3
			  </div>
		  </div>
		  <span class="text-[10px] font-light font-[Commissioner]">Смотреть все / Купальники</span>
		  <div class="flex items-center gap-1">
			  <span class="text-[11px] font-[Manrope]">(12)</span>
			  <NuxtImg src="/sliders.svg" alt="sliders" width="21" height="21" />
		  </div>
	  </div>
	  <div
		  class="grid grid-cols-2 px-2 gap-x-1 gap-y-2 font-[Commissioner] font-light text-[10px] text-center sm:font-[Manrope] sm:text-sm sm:grid-cols-4 sm:px-4 sm:gap-x-4 sm:gap-y-6"
	  >
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  price="25 500"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  price="25 500"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  price="25 500"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  price="25 500"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  price="25 500"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  price="25 500"
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
			  price="25 500"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  price="25 500"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  price="25 500"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  price="25 500"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  price="25 500"
		  />
		  <CatalogCard
			  :image-url="images.card1"
			  text="Printed bikini top"
			  price="25 500"
		  />
		  <BannerCard
			  :image-url="images.promo1"
			  text="SS26 SOLAR POWER"
			  custom-class="rounded-lg aspect-[1] col-span-2 sm:hidden"
			  object-position="center"
		  />
	  </div>
	  <div class="flex justify-center items-center pt-4 pb-2 sm:py-10">
		  <button class="text-xs font-light text-[#211D1D]">
			  Показать больше
		  </button>
	  </div>
	  <AppSEO
		  content="CASA AL MARE — эстетика тела, свобода выбора. Каталог CASA AL MARE создан для женщин, которые ищут не просто купальник или комплект белья, а выражение своей индивидуальности. Мы создаём коллекции, вдохновлённые побережьями, архитектурой юга и непринуждённой элегантностью."
	  />
  </main>
</template>

<style scoped>

</style>