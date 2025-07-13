<script setup lang="ts">
const images = {
	camp1: "/camp-1.jpg",
	camp2: "/camp-2.jpg",
	camp3: "/camp-3.jpg",
	camp4: "/camp-4.jpg",
	camp5: "/camp-5.jpg",
	camp6: "/camp-6.jpg",
	camp7: "/camp-7.jpg",
	camp8: "/camp-8.jpg",
	camp9: "/camp-9.jpg",
	camp10: "/camp-10.jpg",
	camp11: "/camp-11.jpg",
	camp12: "/camp-12.jpg",
	camp13: "/camp-13.jpg",
	camp14: "/camp-14.jpg",
}
</script>

<template>
  <main class="mb-5 font-[Manrope] bg-[#FFFFFA] text-[#211D1D] sm:mb-10">
	  <div class="p-2 sm:px-4 sm:py-6">
		  <span
			  class="text-[10px] font-light text-[#211D1D] font-[Commissioner] sm:font-[Manrope] sm:text-sm"
		  >
			 Главная / Сертификат
		  </span>
	  </div>
		<h2 class="uppercase text-center font-[Inter] text-[17px]">Campaign</h2>
	  <div class="grid grid-cols-2 mt-4 px-2 gap-2 sm:gap-4 sm:px-4 sm:mt-10 sm:grid-cols-4">
		  <BannerCard
			  :image-url="images.camp1"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
		  />
		  <BannerCard
			  :image-url="images.camp2"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
		  />
		  <BannerCard
			  :image-url="images.camp3"
			  plus
			  custom-class="rounded-lg aspect-[936/680] col-span-2"
			  object-position="50% 70%"
		  />
		  <BannerCard
			  :image-url="images.camp4"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
		  />
		  <BannerCard
			  :image-url="images.camp5"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
		  />
		  <BannerCard
			  :image-url="images.camp6"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
		  />
		  <BannerCard
			  :image-url="images.camp7"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
		  />
		  <BannerCard
			  :image-url="images.camp8"
			  plus
			  custom-class="rounded-lg aspect-[936/680] col-span-2"
			  object-position="center"
		  />
		  <BannerCard
			  :image-url="images.camp9"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
		  />
		  <BannerCard
			  :image-url="images.camp10"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
		  />
		  <BannerCard
			  :image-url="images.camp11"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
		  />
		  <BannerCard
			  :image-url="images.camp12"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
		  />
		  <BannerCard
			  :image-url="images.camp13"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
		  />
		  <BannerCard
			  :image-url="images.camp14"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
		  />
	  </div>
	</main>
</template>

<style scoped>

</style>