<script setup lang="ts">

</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] mb-18 sm:mb-4">
	  <div class="p-2 sm:px-4 sm:py-6">
		  <span
			  class="text-[10px] font-light text-[#211D1D] font-[Commissioner] sm:font-[Manrope] sm:text-sm"
		  >
			 Главная / Сертификат
		  </span>
	  </div>
	  <div class="px-0 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 sm:px-4">
		  <div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
			  <NuxtImg
				  src="/certificate-1.png" alt="certificate" width="726" height="1080"
				  class="sm:rounded-lg"
			  />
			  <NuxtImg
				  src="/certificate-2.png" alt="certificate" width="726" height="1080"
				  class="sm:rounded-lg hidden sm:block"
			  />
			  <div class="w-full flex justify-center items-center gap-1 px-4 sm:hidden">
				  <div class="w-full border-y-1 border-[#A6CEFF]" />
				  <div class="w-full border-y-1 border-[#A6CEFF] opacity-30" />
			  </div>
		  </div>
		  <div class="px-2 flex flex-col sm:px-0">
			  <div class="flex justify-center items-center">
				  <h2
					  class="font-[Inter] text-center text-[32px] sm:text-4xl"
				  >
					  Электронный подарочный сертификат
				  </h2>
			  </div>
			  <div class="mt-14 flex flex-col justify-center items-center gap-8">
				  <div class="flex flex-col justify-center items-center gap-2">
					  <h3 class="font-[Inter] text-2xl">1/3</h3>
					  <span class="font-light text-sm">Выберите номинал:</span>
				  </div>
				  <div
					  class="flex justify-center items-center gap-3 font-light sm:gap-4 sm:font-normal"
				  >
					  <div
						  class="p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm"
					  >
						  999
					  </div>
					  <div
						  class="p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm"
					  >
						  9999
					  </div>
					  <div
						  class="p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm"
					  >
						  99999
					  </div>
					  <div
						  class="p-2 flex justify-center items-center border-[0.7px] border-[#BBB8B6] rounded-lg text-sm"
					  >
						  999999
					  </div>
				  </div>
				  <div class="w-full flex items-center gap-2">
					  <button
						  class="px-4 py-2 rounded-2xl border border-[#211D1D] text-[#211D1D] text-[13px] sm:px-8 sm:py-4 sm:rounded-[18px] sm:text-sm"
					  >
						  Назад
					  </button>
					  <button
						  class="w-full px-4 py-2 rounded-2xl bg-[#211D1D] border border-[#211D1D] text-[#FFFFFA] text-[13px] sm:px-8 sm:py-4 sm:rounded-[18px] sm:bg-transparent sm:text-[#211D1D] sm:text-sm"
					  >
						  Сначала выберите номинал
					  </button>
				  </div>
			  </div>
			  <div class="w-full mt-14">
				  <div
					  class="flex justify-center gap-2.5 items-center p-4 border border-[#BBB8B6] rounded-2xl sm:justify-between sm:gap-0"
				  >
					  <span class="font-light text-sm">Описание сертификата</span>
					  <NuxtImg src="/help.svg" alt="help" width="16" height="16" />
				  </div>
			  </div>
		  </div>
	  </div>
  </main>
</template>

<style scoped>

</style>