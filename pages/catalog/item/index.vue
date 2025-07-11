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
	  <div class="px-0 grid grid-cols-[auto_1fr] gap-4 sm:px-4">
		  <div class="grid grid-cols-2 gap-2">
			  <NuxtImg
				  src="/item-1.jpg" alt="item" width="726" height="1080"
				  class="rounded-lg"
			  />
			  <NuxtImg
				  src="/item-2.jpg" alt="item" width="726" height="1080"
				  class="rounded-lg"
			  />
			  <NuxtImg
				  src="/item-3.jpg" alt="item" width="726" height="1080"
				  class="rounded-lg"
			  />
			  <NuxtImg
				  src="/item-4.jpg" alt="item" width="726" height="1080"
				  class="rounded-lg"
			  />
			  <NuxtImg
				  src="/item-5.jpg" alt="item" width="726" height="1080"
				  class="rounded-lg"
			  />
			  <NuxtImg
				  src="/item-6.jpg" alt="item" width="726" height="1080"
				  class="rounded-lg"
			  />
		  </div>
		  <div class="px-4 flex flex-col">
			  <div class="flex justify-center items-center">
				  <h2
					  class="font-[Inter] text-4xl text-center"
				  >Colored triangle top</h2>
			  </div>
			  <div class="flex justify-center items-center gap-2 my-6">
				  <span>36 000 ₽</span>
				  <span class="line-through">39 700 ₽</span>
			  </div>
			  <div class="flex justify-center items-center gap-6 mt-14">
				  <div class="flex flex-col justify-center items-center gap-2.5">
					  <div>
						  <NuxtImg
							  src="/orange.png" alt="orange" width="40" height="54"
							  class="rounded-lg border-[0.7px] border-[#BBB8B6]"
						  />
					  </div>
					  <span>Оранжевый</span>
				  </div>
				  <div class="flex flex-col justify-center items-center gap-2.5">
					  <div>
						  <NuxtImg
							  src="/blue.png" alt="blue" width="40" height="54"
							  class="rounded-lg border-[0.7px] border-[#BBB8B6]"
						  />
					  </div>
					  <span>Синий</span>
				  </div>
			  </div>
			  <div class="flex flex-col justify-center items-center gap-4 mt-10">
				  <div class="flex justify-center items-center gap-4 ">
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
			  <div class="flex flex-col justify-center items-center gap-4 mt-10">
				  <div class="flex justify-center items-center gap-4 ">
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
				  <div class="flex justify-center items-center gap-6">
					  <div class="flex flex-col justify-center items-center gap-2">
						  <NuxtImg src="/pant-1.svg" alt="pant" width="54" height="30" class="h-[31px]" />
						  <span>Стринги</span>
					  </div>
					  <div class="flex flex-col justify-center items-center gap-2">
						  <NuxtImg src="/pant-2.svg" alt="pant" width="54" height="30" class="h-[31px]" />
						  <span>Стринги</span>
					  </div>
					  <div class="flex flex-col justify-center items-center gap-2">
						  <NuxtImg src="/pant-3.svg" alt="pant" width="54" height="30" class="h-[31px]" />
						  <span>Стринги</span>
					  </div>
				  </div>
			  </div>
			  <div class="flex flex-col justify-center items-center gap-1 mt-10">
				  <span class="font-light text-xs">На модели размер: топ S, низ M</span>
				  <span class="text-[11px] text-[#363636]">Параметры модели: 175 80/60/89</span>
			  </div>
			  <div class="flex flex-col justify-center items-center gap-4 mt-6">
				  <button class="w-full px-8 py-4 rounded-[18px] border border-[#211D1D] bg-[#211D1D] text-[#FFFFFA] text-sm">Выберите размер</button>
				  <button class="w-full px-8 py-4 rounded-[18px] border border-[#211D1D] text-[#211D1D] text-sm">Собрать комплект</button>
			  </div>
			  <div class="flex justify-center items-center mt-6">
				  <button class="font-light text-xs">Добавить в избранное</button>
			  </div>
			  <div class="mt-14 flex flex-col justify-center items-center gap-6 p-4 rounded-2xl border border-[#BBB8B6]">
				  <div class="flex justify-between items-center w-full">
					  <span class="font-light text-sm">Состав и уход</span>
					  <NuxtImg src="/help.svg" alt="help" width="16" height="16" />
				  </div>
				  <div class="w-full h-[1px] bg-[#BBB8B6]"/>
				  <div class="flex justify-between items-center w-full">
					  <span class="font-light text-sm">Определить размер</span>
					  <NuxtImg src="/help.svg" alt="help" width="16" height="16" />
				  </div>
				  <div class="w-full h-[1px] bg-[#BBB8B6]"/>
				  <div class="flex justify-between items-center w-full">
					  <span class="font-light text-sm">Доставка и возврат</span>
					  <NuxtImg src="/help.svg" alt="help" width="16" height="16" />
				  </div>
				  <div class="w-full h-[1px] bg-[#BBB8B6]"/>
				  <div class="flex justify-between items-center w-full">
					  <span class="font-light text-sm">Подписаться на рассылку</span>
					  <NuxtImg src="/mail.svg" alt="mail" width="16" height="16" />
				  </div>
			  </div>
		  </div>
	  </div>
	  <div class="flex flex-col justify-center items-center gap-12 mt-24">
		  <h2 class="font-[Inter] text-4xl">Вам может понравиться</h2>
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
	  <div class="flex flex-col justify-center items-center gap-12 mt-12 mb-4">
		  <h2 class="font-[Inter] text-4xl">Вы недавно смотрели</h2>
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
  </main>
</template>

<style scoped>

</style>