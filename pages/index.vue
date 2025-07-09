<script setup lang="ts">

const images = {
	video: '/video-banner.jpg',
	promo1: '/promo-1.jpg',
	promo2: '/promo-2.jpg',
	promo3: '/promo-3.jpg',
	promo4: '/promo-4.jpg',
	category1: '/category-1.jpg',
	category2: '/category-2.jpg',
	category3: '/category-3.jpg',
	category4: '/category-4.jpg',
	category5: '/category-5.jpg',
}
</script>

<template>
  <main>
    <BannerCard
	    :image-url="images.video"
	    text="SS26 solar power"
	    object-position="50% 75%"
	    custom-class="sm:aspect-[375/607] md:aspect-[5/4] lg:aspect-[1920/962]"
    />
    <div class="flex flex-col lg:flex-row gap-2 px-2 py-2 sm:gap-4 sm:px-4 sm:py-4">
      <BannerCard
	      :image-url="images.promo1"
	      text="SS26 solar power"
	      custom-class="rounded-lg aspect-[1]"
	      object-position="center"
      />
      <BannerCard
	      :image-url="images.promo2"
	      text="SS26 solar power"
	      custom-class="rounded-lg aspect-[1]"
	      object-position="center"
      />
    </div>
    <div
	    class="grid grid-cols-2 gap-2 px-2 sm:gap-4 md:grid-cols-6 lg:grid-cols-5 sm:px-4"
    >
      <BannerCard
	      :image-url="images.category1"
	      text="Головные уборы"
	      custom-class="rounded-lg col-span-2 aspect-[343/400] sm:aspect-[1920/2462] md:col-span-3 lg:col-span-1"
	      object-position="center"
      />
      <BannerCard
	      :image-url="images.category2"
	      text="Купальники"
	      custom-class="rounded-lg aspect-[167/284] sm:aspect-[1920/2462] md:col-span-3 lg:col-span-1"
	      object-position="center"
      />
      <BannerCard
	      :image-url="images.category3"
	      text="Низ купальника"
	      custom-class="rounded-lg aspect-[167/284] sm:aspect-[1920/2462] md:col-span-2 lg:col-span-1"
	      object-position="center"
      />
      <BannerCard
	      :image-url="images.category4"
	      text="Верх купальника"
	      custom-class="rounded-lg aspect-[167/284] sm:aspect-[1920/2462] md:col-span-2 lg:col-span-1"
	      object-position="center"
      />
      <BannerCard
	      :image-url="images.category5"
	      text="Аксессуары"
	      custom-class="rounded-lg aspect-[167/284] sm:aspect-[1920/2462] md:col-span-2 lg:col-span-1"
	      object-position="center"
      />
    </div>
    <div class="flex flex-col lg:flex-row gap-2 px-2 py-2 sm:gap-4 sm:px-4 sm:py-4">
      <BannerCard
	      :image-url="images.promo3"
	      text="fw25 Surf tales"
	      custom-class="rounded-lg aspect-[1]"
	      object-position="center"
      />
      <BannerCard
	      :image-url="images.promo4"
	      text="top capsule 25"
	      custom-class="rounded-lg aspect-[1]"
	      object-position="center"
      />
    </div>
    <div class="px-4 py-3 flex justify-center items-center sm:py-0">
      <div
	      class="flex flex-col items-center gap-6 pt-10 pb-6 px-6 border border-[#BBB8B6] rounded-2xl w-full sm:pt-12"
      >
        <NuxtImg src="/logo-2.svg" alt="CASA AL MARE" width="230" height="31" />
        <p class="font-[Manrope] text-[11px] text-[#8F8F8F] font-light text-center sm:text-xs">
          — это бренд стильного белья и купальников, созданный для женщин, которые ценят комфорт, эстетику и качество.<br>Мы разрабатываем коллекции, вдохновлённые природой, искусством и городским ритмом жизни.
        </p>
        <button class="font-[Manrope] text-xs text-[#211D1D] font-light">
          Подробнее
        </button>
      </div>
    </div>
  </main>
</template>