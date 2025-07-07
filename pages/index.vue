<script setup lang="ts">
const images = {
	video: "/video-banner.jpg",
	promo1: "/promo-1.jpg",
	promo2: "/promo-2.jpg",
	promo3: "/promo-3.jpg",
	promo4: "/promo-4.jpg",
	category1: "/category-1.jpg",
	category2: "/category-2.jpg",
	category3: "/category-3.jpg",
	category4: "/category-4.jpg",
	category5: "/category-5.jpg",
}
</script>

<template>
  <main>
    <BannerCard
	    :image-url="images.video"
	    text="SS26 solar power"
	    max-height="max-h-[900px] sm:max-h-[600px] md:max-h-[700px] lg:max-h-[900px]"
	    custom-class="aspect-[4/5]"
	    object-position="50% 75%"
    />
    <div class="flex flex-col md:flex-row gap-4 px-4 py-4">
      <BannerCard
	      :image-url="images.promo1"
	      text="SS26 solar power"
	      max-height="max-h-[936px] sm:max-h-[600px] md:max-h-[700px] lg:max-h-[936px]"
	      custom-class="rounded-lg"
      />
      <BannerCard
	      :image-url="images.promo2"
	      text="SS26 solar power"
	      max-height="max-h-[936px] sm:max-h-[600px] md:max-h-[700px] lg:max-h-[936px]"
	      custom-class="rounded-lg"
      />
    </div>
    <div
	    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 px-4 gap-4"
    >
      <BannerCard
	      :image-url="images.category1"
	      text="Головные уборы"
	      max-height="max-h-[473px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[473px]"
	      custom-class="rounded-lg"
      />
      <BannerCard
	      :image-url="images.category2"
	      text="Купальники"
	      max-height="max-h-[473px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[473px]"
	      custom-class="rounded-lg"
      />
      <BannerCard
	      :image-url="images.category3"
	      text="Низ купальника"
	      max-height="max-h-[473px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[473px]"
	      custom-class="rounded-lg"
      />
      <BannerCard
	      :image-url="images.category4"
	      text="Верх купальника"
	      max-height="max-h-[473px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[473px]"
	      custom-class="rounded-lg"
      />
      <BannerCard
	      :image-url="images.category5"
	      text="Аксессуары"
	      max-height="max-h-[473px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[473px]"
	      custom-class="rounded-lg"
      />
    </div>
    <div class="flex flex-col md:flex-row gap-4 px-4 py-4">
      <BannerCard
	      :image-url="images.promo3"
	      text="fw25 Surf tales"
	      max-height="max-h-[936px] sm:max-h-[600px] md:max-h-[700px] lg:max-h-[936px]"
	      custom-class="rounded-lg"
      />
      <BannerCard
	      :image-url="images.promo4"
	      text="top capsule 25"
	      max-height="max-h-[936px] sm:max-h-[600px] md:max-h-[700px] lg:max-h-[936px]"
	      custom-class="rounded-lg"
      />
    </div>
    <div class="px-4 flex justify-center items-center">
      <div
	      class="flex flex-col items-center gap-6 pt-12 pb-6 border border-[#BBB8B6] rounded-2xl w-full"
      >
        <NuxtImg src="/logo-2.svg" alt="CASA AL MARE" width="230" height="31" />
        <p class="font-[Manrope] text-xs text-[#8F8F8F] font-light text-center">
          — это бренд стильного белья и купальников, созданный для женщин, которые ценят комфорт, эстетику и качество.<br>Мы разрабатываем коллекции, вдохновлённые природой, искусством и городским ритмом жизни.
        </p>
        <button class="font-[Manrope] text-xs text-[#211D1D] font-light">Подробнее</button>
      </div>
    </div>
  </main>
</template>