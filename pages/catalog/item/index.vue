<script setup lang="ts">
const images = {
	item: "/item-page-1.jpg",
}
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D]">
	  <div class="p-2 sm:px-4 sm:py-6">
		  <span
			  class="text-[10px] font-light text-[#211D1D] font-[Commissioner] sm:font-[Manrope] sm:text-sm"
		  >
			 Главная / Смотреть все / Наименование
		  </span>
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
				  <div class="flex flex-col justify-center items-center gap-2.5">
					  <div>
						  <NuxtImg
							  src="/orange.png" alt="orange" width="40" height="54"
							  class="rounded-lg border-[0.7px] border-[#BBB8B6]"
						  />
					  </div>
					  <span class="font-normal text-[11px] sm:text-xs sm:font-light">Оранжевый</span>
				  </div>
				  <div class="flex flex-col justify-center items-center gap-2.5">
					  <div>
						  <NuxtImg
							  src="/blue.png" alt="blue" width="40" height="54"
							  class="rounded-lg border-[0.7px] border-[#BBB8B6]"
						  />
					  </div>
					  <span class="font-normal text-[11px] sm:text-xs sm:font-light">Синий</span>
				  </div>
			  </div>
			  <div class="flex flex-col justify-center items-center gap-4 mt-12 sm:mt-10">
				  <div class="flex justify-center items-center gap-3 font-light sm:gap-4 sm:font-normal">
					  <div
						  class="p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm"
					  >
						  XXS
					  </div>
					  <div
						  class="p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm"
					  >
						  XS
					  </div>
					  <div
						  class="p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm"
					  >
						  S
					  </div>
					  <div
						  class="p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm"
					  >
						  M
					  </div>
					  <div
						  class="p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm"
					  >
						  L
					  </div>
					  <div
						  class="p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm"
					  >
						  XL
					  </div>
				  </div>
				  <span class="text-xs">Верх</span>
			  </div>
			  <div class="flex flex-col justify-center items-center gap-4 mt-12 sm:mt-10">
				  <div class="flex justify-center items-center gap-3 font-light sm:gap-4 sm:font-normal">
					  <div
						  class="p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm"
					  >
						  XXS
					  </div>
					  <div
						  class="p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm"
					  >
						  XS
					  </div>
					  <div
						  class="p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm"
					  >
						  S
					  </div>
					  <div
						  class="p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm"
					  >
						  M
					  </div>
					  <div
						  class="p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm"
					  >
						  L
					  </div>
					  <div
						  class="p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm"
					  >
						  XL
					  </div>
				  </div>
				  <span class="text-xs">Низ</span>
				  <div class="flex justify-center items-center gap-6 text-xs">
					  <div class="flex flex-col justify-center items-center gap-2">
						  <NuxtImg src="/pant-1.svg" alt="pant" width="54" height="30" class="h-[31px]" />
						  <span>Стринги</span>
					  </div>
					  <div class="flex flex-col justify-center items-center gap-2">
						  <NuxtImg src="/pant-2.svg" alt="pant" width="54" height="30" class="h-[31px]" />
						  <span>Бразилиана</span>
					  </div>
					  <div class="flex flex-col justify-center items-center gap-2">
						  <NuxtImg src="/pant-3.svg" alt="pant" width="54" height="30" class="h-[31px]" />
						  <span>Классика</span>
					  </div>
				  </div>
			  </div>
			  <div class="flex flex-col justify-center items-center gap-1 mt-12 sm:mt-10">
				  <span class="font-light text-xs">На модели размер: топ S, низ M</span>
				  <span class="text-[11px] text-[#363636]">Параметры модели: 175 80/60/89</span>
			  </div>
			  <div class="flex flex-col justify-center items-center gap-4 mt-6">
				  <button class="w-full px-8 py-4 rounded-[18px] border border-[#211D1D] bg-[#211D1D] text-[#FFFFFA] text-[13px] sm:text-sm">Выберите размер</button>
				  <button class="w-full px-8 py-4 rounded-[18px] border border-[#211D1D] text-[#211D1D] text-[13px] sm:text-sm">Собрать комплект</button>
			  </div>
			  <div class="flex justify-center items-center mt-4 sm:mt-6">
				  <button class="font-normal text-[13px] sm:font-light sm:text-xs">Добавить в избранное</button>
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
		  <div class="flex justify-center items-center gap-2">
			  <CatalogCard
				  :image-url="images.item"
				  text="Printed bikini top"
				  price="25 500"
			  />
			  <CatalogCard
				  :image-url="images.item"
				  text="Printed bikini top"
				  price="25 500"
			  />
			  <CatalogCard
				  :image-url="images.item"
				  text="Printed bikini top"
				  price="25 500"
			  />
		  </div>
	  </div>
	  <div class="px-2 flex flex-col justify-center items-start gap-4 mt-18 mb-18 sm:items-center sm:gap-12 sm:mt-12 sm:mb-4">
		  <h2 class="font-[Manrope] text-[15px] font-light sm:font-[Inter] sm:text-4xl sm:font-normal">Вы недавно смотрели</h2>
		  <div class="flex justify-center items-center gap-2">
			  <CatalogCard
				  :image-url="images.item"
				  text="Printed bikini top"
				  price="25 500"
				  custom-class="h-[245px] sm:h-auto"
			  />
			  <CatalogCard
				  :image-url="images.item"
				  text="Printed bikini top"
				  price="25 500"
				  custom-class="h-[245px] sm:h-auto"
			  />
			  <CatalogCard
				  :image-url="images.item"
				  text="Printed bikini top"
				  price="25 500"
				  custom-class="h-[245px] sm:h-auto"
			  />
		  </div>
	  </div>
  </main>
</template>

<style scoped>

</style>