<script setup lang="ts">
const images = {
	card1: "/item-page-1.jpg",
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

const popupStore = usePopupStore()
const setStore = useSetStore()

const breadcrumsItems: { name: string, path?: string }[] = [{ name: "Главная", path: "/" }, { name: "COLLECTIONS", path: "/collections" }, { name: "COLLECTION" }]

</script>

<template>
  <main class="mb-5 font-[Manrope] bg-[#FFFFFA] text-[#211D1D] sm:mb-10">
	  <div class="p-2 sm:px-4 sm:py-6">
		  <AppBreadcrumbs :items="breadcrumsItems" />
	  </div>
		<h2 class="uppercase text-center font-[Inter] text-[17px]">Campaign</h2>
	  <div class="grid grid-cols-2 mt-4 px-2 gap-2 sm:gap-4 sm:px-4 sm:mt-10 md:grid-cols-4">
		  <BannerCard
			  :image-url="images.camp1"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
			  @click="popupStore.open('set')"
		  />
		  <BannerCard
			  :image-url="images.camp2"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
			  @click="popupStore.open('set')"
		  />
		  <BannerCard
			  :image-url="images.camp3"
			  plus
			  custom-class="rounded-lg aspect-[936/680] col-span-2"
			  object-position="50% 70%"
			  @click="popupStore.open('set')"
		  />
		  <BannerCard
			  :image-url="images.camp4"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
			  @click="popupStore.open('set')"
		  />
		  <BannerCard
			  :image-url="images.camp5"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
			  @click="popupStore.open('set')"
		  />
		  <BannerCard
			  :image-url="images.camp6"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
			  @click="popupStore.open('set')"
		  />
		  <BannerCard
			  :image-url="images.camp7"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
			  @click="popupStore.open('set')"
		  />
		  <BannerCard
			  :image-url="images.camp8"
			  plus
			  custom-class="rounded-lg aspect-[936/680] col-span-2"
			  object-position="center"
			  @click="popupStore.open('set')"
		  />
		  <BannerCard
			  :image-url="images.camp9"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
			  @click="popupStore.open('set')"
		  />
		  <BannerCard
			  :image-url="images.camp10"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
			  @click="popupStore.open('set')"
		  />
		  <BannerCard
			  :image-url="images.camp11"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
			  @click="popupStore.open('set')"
		  />
		  <BannerCard
			  :image-url="images.camp12"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
			  @click="popupStore.open('set')"
		  />
		  <BannerCard
			  :image-url="images.camp13"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
			  @click="popupStore.open('set')"
		  />
		  <BannerCard
			  :image-url="images.camp14"
			  plus
			  custom-class="rounded-lg aspect-[460/680]"
			  object-position="center"
			  @click="popupStore.open('set')"
		  />
	  </div>
	  <AppPopup title="Собрать комплект" popup-id="set">
		  <div class="flex flex-col gap-6 mt-6">
			  <div class="grid grid-cols-2 gap-y-6 gap-x-4 sm:gap-x-2">
				  <div class="flex flex-col gap-2">
					  <span class="font-[Manrope] text-sm">Верх</span>
					  <CatalogCard v-model="setStore.top" custom-image-class="aspect-[200/300] w-full" popup :image-urls="[images.card1, images.card1, images.card1]" variant="mini" :price="24600" :old-price="26000" color="Цвет" text="Название" />
				  </div>
				  <div class="flex flex-col gap-2">
					  <span class="font-[Manrope] text-sm">Низ</span>
					  <CatalogCard v-model="setStore.bottom" custom-image-class="aspect-[200/300] w-full" popup :image-urls="[images.card1, images.card1, images.card1]" variant="mini" :price="24600" :old-price="26000" color="Цвет" text="Название" />
				  </div>
				  <div class="flex flex-col gap-2">
					  <span class="font-[Manrope] text-sm">Аксессуар</span>
					  <CatalogCard v-model="setStore.accessory" custom-image-class="aspect-[200/300] w-full" popup :image-urls="[images.card1, images.card1, images.card1]" variant="mini" :price="24600" :old-price="26000" color="Цвет" text="Название" />
				  </div>
			  </div>
			  <BuyButton available-quantity in-stock :is-parameters-selected="setStore.canAddToCart" />
		  </div>
	  </AppPopup>
	</main>
</template>

<style scoped>

</style>