<script setup lang="ts">
const images = {
  card1: "/item-page-1.jpg",
  camp1: "/camp_1.webp",
  camp2: "/camp_2.webp",
  camp3: "/camp_3.webp",
  camp4: "/camp_4.webp",
  camp5: "/camp_5.webp",
  camp6: {
    mp4: "/тизер_9_9x16_logo.mp4",
    ogv: "/тизер_9_9x16_logo.ogv",
    webm: "/тизер_9_9x16_logo.webm",
    
  },
  camp7: "/camp_7.webp",
  camp8: "/camp_8.webp",
  camp9: "/camp_9.webp",
  camp10: "/camp_10.webp",
  camp11: "/camp_11.webp",
  camp12: {
    mp4: "/тизер_8_9x16_no logo.mp4",
    ogv: "/тизер_8_9x16_no logo.ogv",
    webm: "/тизер_8_9x16_no logo.webm",
  },
  camp13: "/camp_13.webp",
  camp14: "/camp_14.webp",
}

const popupStore = usePopupStore()
const setStore = useSetStore()

const breadcrumsItems: { name: string; path?: string }[] = [
  { name: "Главная", path: "/" },
  { name: "CAMPAIGNS" },
]
</script>

<template>
  <main class="mb-5 font-[Manrope] bg-[#FFFFFA] text-[#211D1D] sm:mb-10">
    <div class="p-2 sm:px-4 sm:py-6">
      <AppBreadcrumbs :items="breadcrumsItems" />
    </div>
    <h2 class="uppercase text-center font-[Inter] text-[17px]">Campaigns</h2>
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
      <VideoBanner
        plus
        :video-data="{ pc: images.camp6, mob: images.camp6 }"
        custom-class="rounded-lg aspect-[460/680]"
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
      <VideoBanner
        plus
        :video-data="{ pc: images.camp12, mob: images.camp12 }"
        custom-class="rounded-lg aspect-[460/680]"
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
    <AppPopup
      title="Собрать комплект"
      popup-id="set"
    >
      <div class="flex flex-col gap-6 mt-6">
        <div class="grid grid-cols-2 gap-y-6 gap-x-4 sm:gap-x-2">
          <div class="flex flex-col gap-2">
            <span class="font-[Manrope] text-sm">Верх</span>
            <CatalogCard
              id="1"
              v-model="setStore.top"
              custom-image-class="aspect-[200/300] w-full"
              popup
              :slider-images="[images.card1, images.card1, images.card1]"
              variant="mini"
              :price="24600"
              :old-price="26000"
              color="Цвет"
              name="Название"
            />
          </div>
          <div class="flex flex-col gap-2">
            <span class="font-[Manrope] text-sm">Низ</span>
            <CatalogCard
              id="1"
              v-model="setStore.top"
              custom-image-class="aspect-[200/300] w-full"
              popup
              :slider-images="[images.card1, images.card1, images.card1]"
              variant="mini"
              :price="24600"
              :old-price="26000"
              color="Цвет"
              name="Название"
            />
          </div>
          <div class="flex flex-col gap-2">
            <span class="font-[Manrope] text-sm">Аксессуар</span>
            <CatalogCard
              id="1"
              v-model="setStore.top"
              custom-image-class="aspect-[200/300] w-full"
              popup
              :slider-images="[images.card1, images.card1, images.card1]"
              variant="mini"
              :price="24600"
              :old-price="26000"
              color="Цвет"
              name="Название"
            />
          </div>
        </div>
        <BuyButton
          id="1"
          available-quantity
          in-stock
          :is-parameters-selected="setStore.canAddToCart"
        />
      </div>
    </AppPopup>
  </main>
</template>

<style scoped></style>
