<script setup lang="ts">
import video from "../public/video-banner.jpg"
import category1 from "../public/category-1.jpg"
import category2 from "../public/category-2.jpg"
import category3 from "../public/category-3.jpg"
import category4 from "../public/category-4.jpg"
import category5 from "../public/category-5.jpg"
import promo1 from "../public/promo-1.jpg"
import promo2 from "../public/promo-2.jpg"
import promo3 from "../public/promo-3.jpg"
import promo4 from "../public/promo-4.jpg"


const images = {
	video: video,
	promo1: promo1,
	promo2: promo2,
	promo3: promo3,
	promo4: promo4,
	category1: category1,
	category2: category2,
	category3: category3,
	category4: category4,
	category5: category5,
}
</script>
<template>
	<main>
		<VideoBannerCard :image-url="images.video" text="SS26 solar power"/>
		<div class="flex gap-4 px-4 py-4">
      <PromoBannerCard :image-url="images.promo1" text="SS26 solar power"/>
      <PromoBannerCard :image-url="images.promo2" text="SS26 solar power"/>
    </div>
		<div class="grid grid-cols-5 px-4 gap-4">
			<CategoryCard :image-url="images.category1" text="Головные уборы"/>
			<CategoryCard :image-url="images.category2" text="Купальники"/>
			<CategoryCard :image-url="images.category3" text="Низ купальника"/>
			<CategoryCard :image-url="images.category4" text="Верх купальника"/>
			<CategoryCard :image-url="images.category5" text="Аксессуары"/>
		</div>
    <div class="flex gap-4 px-4 py-4">
      <PromoBannerCard :image-url="images.promo3" text="fw25 Surf tales"/>
      <PromoBannerCard :image-url="images.promo4" text="top capsule 25"/>
    </div>
		<div class="px-4 flex justify-center items-center">
			<div class="flex flex-col items-center gap-6 pt-12 pb-6 border border-[#BBB8B6] rounded-2xl w-full">
				<NuxtImg src="logo-2.svg" alt="CASA AL MARE" width="230" height="31"/>
				<p class="font-[Manrope] text-xs text-[#8F8F8F] font-light text-center">
					— это бренд стильного белья и купальников, созданный для женщин, которые ценят комфорт, эстетику и качество.<br>Мы разрабатываем коллекции, вдохновлённые природой, искусством и городским ритмом жизни.
				</p>
				<button class="font-[Manrope] text-xs text-[#211D1D] font-light">Подробнее</button>
			</div>
		</div>
	</main>
</template>
