<script setup lang="ts">
const images = {
	blog1: "/blog-1.jpg",
	blog2: "/blog-2.jpg",
	blog3: "/blog-3.jpg",
	blog4: "/blog-4.jpg",
	blog5: "/blog-5.jpg",
	blog6: "/blog-6.jpg",
}
const categories = ["Все", "Уход", "Стиль", "Советы"]

</script>

<template>
   <main class="mb-5 font-[Manrope] bg-[#FFFFFA] text-[#211D1D] sm:mb-10">
	   <h2 class="uppercase text-center font-[Inter] text-[17px]">Блог</h2>
	   <div class="mt-4 w-full flex justify-center items-center px-2">
		   <SelectButton :variants="categories" custom-class="max-w-[600px] w-full " custom-button-class="flex-1" />
	   </div>
	   <div class="grid px-2 mt-4 sm:mt-10 sm:px-4 sm:gap-6 lg:grid-cols-3">
		   <div class="flex flex-col items-center cursor-pointer" @click="navigateTo('/blog/article')">
			   <NuxtImg :src="images.blog1" alt="blog" width="610" height="570" class="aspect-[610/570] object-cover rounded-lg" />
			   <h3 class="uppercase text-center mt-2 font-[Manrope] text-[13px] max-w-[610px] sm:font-[Inter] sm:text-xl sm:mt-4">Краткое название статьи</h3>
		   </div>
		   <div class="flex flex-col items-center cursor-pointer" @click="navigateTo('/blog/article')">
			   <NuxtImg :src="images.blog2" alt="blog" width="610" height="570" class="aspect-[610/570] object-cover rounded-lg" />
			   <h3 class="uppercase text-center mt-2 font-[Manrope] text-[13px] max-w-[610px] sm:font-[Inter] sm:text-xl sm:mt-4">Очень длинное название статьи о трендах в путешествиях ...</h3>
		   </div>
		   <div class="flex flex-col items-center cursor-pointer" @click="navigateTo('/blog/article')">
			   <NuxtImg :src="images.blog3" alt="blog" width="610" height="570" class="aspect-[610/570] object-cover rounded-lg" />
			   <h3 class="uppercase text-center mt-2 font-[Manrope] text-[13px] max-w-[610px] sm:font-[Inter] sm:text-xl sm:mt-4">Среднее по длине название статьи</h3>
		   </div>
		   <div class="flex flex-col items-center cursor-pointer" @click="navigateTo('/blog/article')">
			   <NuxtImg :src="images.blog4" alt="blog" width="610" height="570" class="aspect-[610/570] object-cover rounded-lg" />
			   <h3 class="uppercase text-center mt-2 font-[Manrope] text-[13px] max-w-[610px] sm:font-[Inter] sm:text-xl sm:mt-4">Очень длинное название статьи о трендах в путешествиях ...</h3>
		   </div>
		   <div class="flex flex-col items-center cursor-pointer" @click="navigateTo('/blog/article')">
			   <NuxtImg :src="images.blog5" alt="blog" width="610" height="570" class="aspect-[610/570] object-cover rounded-lg" />
			   <h3 class="uppercase text-center mt-2 font-[Manrope] text-[13px] max-w-[610px] sm:font-[Inter] sm:text-xl sm:mt-4">Краткое название статьи</h3>
		   </div>
		   <div class="flex flex-col items-center cursor-pointer" @click="navigateTo('/blog/article')">
			   <NuxtImg :src="images.blog6" alt="blog" width="610" height="570" class="aspect-[610/570] object-cover rounded-lg" />
			   <h3 class="uppercase text-center mt-2 font-[Manrope] text-[13px] max-w-[610px] sm:font-[Inter] sm:text-xl sm:mt-4">Среднее по длине название статьи</h3>
		   </div>
	   </div>
   </main>
</template>

<style scoped>

</style>