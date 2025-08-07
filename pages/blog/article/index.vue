<script setup lang="ts">
const images = {
	art1: "/art-1.jpg",
	art2: "/art-2.jpg",
	art3: "/art-3.jpg",
	art4: "/art-4.jpg",
	art5: "/art-5.jpg",
	art6: "/art-6.jpg",
	art7: "/art-7.jpg",
	art8: "/art-8.jpg",
}

const areImagesLoaded = ref(false)

const articleImages = [images.art1, images.art2, images.art3, images.art4, images.art5, images.art6, images.art7]
const breadcrumsItems: { name: string, path?: string }[] = [{ name: "Главная", path: "/" }, { name: "Блог", path: "/blog" }, { name: "Статья" }]

const preloadImages = async () => {
	const loadImage = (url: string) => {
		return new Promise((resolve, reject) => {
			const img = new Image()
			img.src = url
			img.onload = resolve
			img.onerror = reject
		})
	}
	
	try {
		await Promise.all(articleImages.map(url => loadImage(url)))
		areImagesLoaded.value = true
	} catch (error) {
		console.error('Ошибка при загрузке изображений:', error)
		areImagesLoaded.value = true
	}
}

onMounted(() => {
	preloadImages()
})

</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] mb-6 sm:mb-4">
	  <div class="p-2 sm:px-4 sm:py-6">
		  <AppBreadcrumbs :items="breadcrumsItems" />
	  </div>
	  <div class="px-2 sm:px-4 grid grid-cols-1 gap-10 items-start lg:grid-cols-[minmax(auto,618px)_1fr] lg:gap-20">
		  <div class="flex flex-col items-center pt-4 lg:sticky lg:top-0 lg:h-screen ">
			  <div v-if="!areImagesLoaded" class="aspect-[618/570] w-full bg-[#F9F6EC] rounded-lg" />
			  <NuxtImg v-else :src="images.art1" alt="art" width="618" height="570" class="rounded-lg aspect-[618/570]" />
			  <h1 class="mt-6 font-[Inter] text-2xl sm:text-4xl">Заголовок</h1>
			  <span class="text-sm font-light text-[#8C8785] sm:text-base sm:font-normal">09.08.2023</span>
		  </div>
		  <div class="max-w-[900px] flex flex-col gap-10 lg:gap-12">
			  <div class="order-1">
				  <h2 class="font-light text-[15px] sm:font-normal sm:text-xl">Подзаголовок</h2>
				  <p class="font-light text-sm mt-4">Значимость этих проблем настолько очевидна, что реализация намеченных плановых заданий в значительной степени обуславливает создание модели развития. Значимость этих проблем настолько очевидна, что начало повседневной работы по формированию позиции в значительной степени обуславливает создание позиций, занимаемых участниками в отношении поставленных задач. Задача организации, в особенности же рамки и место обучения кадров позволяет оценить значение соответствующий условий активизации. Товарищи! постоянное информационно-пропагандистское обеспечение нашей деятельности позволяет оценить значение соответствующий условий активизации. Равным образом начало повседневной работы по формированию позиции обеспечивает широкому кругу (специалистов) участие в формировании систем массового участия. С другой стороны постоянное информационно-пропагандистское обеспечение нашей деятельности представляет собой <span class="underline font-semibold sm:no-underline sm:font-light">интересный эксперимент</span> проверки направлений прогрессивного развития.</p>
			  </div>
			  <div class="order-5 sm:order-2">
				  <div class="flex gap-2">
					  <div class="font-[Inter] text-[17px] min-w-8 sm:min-w-9 sm:text-2xl">1.</div>
					  <div>
						  <h3 class="font-light text-[15px] sm:font-normal sm:text-base sm:uppercase">Подзаголовок</h3>
						  <p class="font-light text-sm mt-2">Задача организации, в особенности же рамки и место обучения кадров позволяет оценить значение соответствующий условий активизации.</p>
					  </div>
				  </div>
				  <div class="flex gap-2">
					  <div class="font-[Inter] text-[17px] min-w-8 sm:min-w-9 sm:text-2xl">2.</div>
					  <div>
						  <h3 class="font-light text-[15px] sm:font-normal sm:text-base sm:uppercase">Подзаголовок</h3>
						  <p class="font-light text-sm mt-2">С другой стороны постоянное информационно-пропагандистское обеспечение нашей деятельности представляет собой интересный эксперимент проверки направлений прогрессивного развития.</p>
					  </div>
				  </div>
				  <div class="flex gap-2">
					  <div class="font-[Inter] text-[17px] min-w-8 sm:min-w-9 sm:text-2xl">3.</div>
					  <div>
						  <h3 class="font-light text-[15px] sm:font-normal sm:text-base sm:uppercase">Подзаголовок</h3>
						  <p class="font-light text-sm mt-2">Задача организации, в особенности же рамки и место обучения кадров позволяет оценить значение соответствующий условий активизации.</p>
					  </div>
				  </div>
				  <div class="flex gap-2">
					  <div class="font-[Inter] text-[17px] min-w-8 sm:min-w-9 sm:text-2xl">25.</div>
					  <div>
						  <h3 class="font-light text-[15px] sm:font-normal sm:text-base sm:uppercase">Подзаголовок</h3>
						  <p class="font-light text-sm mt-2">Равным образом начало повседневной работы по формированию позиции обеспечивает широкому кругу (специалистов) участие в формировании систем массового участия.</p>
					  </div>
				  </div>
			  </div>
			  <div class="order-3">
			    <div v-if="!areImagesLoaded" class="aspect-[900/500] w-full bg-[#F9F6EC] rounded-lg" />
				  <NuxtImg v-else :src="images.art2" alt="art" width="900" height="500" class="rounded-lg aspect-[900/500]" />
			  </div>
			  <div class="flex gap-6 order-7 sm:order-4">
				  <div class="font-[Inter] text-[#0A0E11] text-[32px] sm:text-4xl">“</div>
				  <p class="font-light text-sm">Значимость этих проблем настолько очевидна, что реализация намеченных плановых заданий в значительной степени обуславливает создание модели развития. Значимость этих проблем настолько очевидна, что начало повседневной работы по формированию позиции в значительной степени обуславливает создание позиций, занимаемых участниками в отношении поставленных задач. Задача организации, в особенности же рамки и место обучения кадров позволяет оценить значение соответствующий условий активизации. Товарищи! постоянное информационно-пропагандистское обеспечение нашей деятельности позволяет оценить значение соответствующий условий активизации. Равным образом начало повседневной работы по формированию позиции обеспечивает широкому кругу (специалистов) участие в формировании систем массового участия. С другой стороны постоянное информационно-пропагандистское обеспечение нашей деятельности представляет собой интересный эксперимент проверки направлений прогрессивного развития.</p>
				  <div class="font-[Inter] text-[#0A0E11] text-[32px] sm:text-4xl self-end">”</div>
			  </div>
			  <div class="flex flex-col gap-6 order-2 sm:order-5">
				  <div class="flex gap-2 max-w-[700px]">
					  <div class="font-[Inter] text-[17px] min-w-8 sm:min-w-9 sm:text-2xl">1.</div>
					  <div>
						  <span class="font-light text-[15px] sm:font-normal sm:text-base sm:uppercase">Равным образом начало повседневной работы по формированию позиции обеспечивает широкому кругу</span>
					  </div>
				  </div>
				  <div class="flex gap-2 max-w-[700px]">
					  <div class="font-[Inter] text-[17px] min-w-8 sm:min-w-9 sm:text-2xl">2.</div>
					  <div>
						  <span class="font-light text-[15px] sm:font-normal sm:text-base sm:uppercase">С другой стороны постоянное информационно-пропагандистское обеспечение</span>
					  </div>
				  </div>
				  <div class="flex gap-2 max-w-[700px]">
					  <div class="font-[Inter] text-[17px] min-w-8 sm:min-w-9 sm:text-2xl">3.</div>
					  <div>
						  <span class="font-light text-[15px] sm:font-normal sm:text-base sm:uppercase">Значимость этих проблем настолько очевидна, что начало повседневной работы</span>
					  </div>
				  </div>
			  </div>
			  <div class="flex gap-2 order-6">
			    <div v-if="!areImagesLoaded" class="aspect-[442/500] w-full bg-[#F9F6EC] rounded-lg" />
				  <NuxtImg v-else :src="images.art3" alt="art" width="442" height="500" class="rounded-lg aspect-[442/500]" />
			    <div v-if="!areImagesLoaded" class="aspect-[442/500] w-full bg-[#F9F6EC] rounded-lg" />
				  <NuxtImg v-else :src="images.art4" alt="art" width="442" height="500" class="rounded-lg aspect-[442/500]" />
			  </div>
			  <div class="order-4 sm:order-7">
				  <h2 class="font-[Manrope] font-light text-[15px] sm:font-[Inter] sm:font-normal sm:text-2xl">Общие положения</h2>
				  <p class="mt-4 font-light text-sm">Значимость этих проблем настолько очевидна, что реализация намеченных плановых заданий в значительной степени обуславливает создание модели развития. Значимость этих проблем настолько очевидна, что начало повседневной работы по формированию позиции в значительной степени обуславливает создание позиций, занимаемых участниками в отношении поставленных задач. Задача организации, в особенности же рамки и место обучения кадров позволяет оценить значение соответствующий условий активизации. Товарищи! постоянное информационно-пропагандистское обеспечение нашей деятельности позволяет оценить значение соответствующий условий активизации. Равным образом начало повседневной работы по формированию позиции обеспечивает широкому кругу (специалистов) участие в формировании систем массового участия. С другой стороны постоянное информационно-пропагандистское обеспечение нашей деятельности представляет собой интересный эксперимент проверки направлений прогрессивного развития.</p>
			  </div>
			  <div class="flex flex-col gap-4 order-8">
				  <div class="flex gap-2">
					  <div class="font-[Inter] text-[#0A0E11] text-[17px] min-w-8 sm:text-4xl sm:min-w-auto">*</div>
					  <div>
						  <span class="font-light text-sm">Задача организации, в особенности же рамки и место обучения кадров позволяет оценить значение соответствующий условий активизации.</span>
					  </div>
				  </div>
				  <div class="flex gap-2">
					  <div class="font-[Inter] text-[#0A0E11] text-[17px] min-w-8 sm:text-4xl sm:min-w-auto">*</div>
					  <div>
						  <span class="font-light text-sm">С другой стороны постоянное информационно-пропагандистское обеспечение нашей деятельности представляет собой интересный эксперимент проверки направлений прогрессивного развития.</span>
					  </div>
				  </div>
				  <div class="flex gap-2">
					  <div class="font-[Inter] text-[#0A0E11] text-[17px] min-w-8 sm:text-4xl sm:min-w-auto">*</div>
					  <div>
						  <span class="font-light text-sm">Задача организации, в особенности же рамки и место обучения кадров позволяет оценить значение соответствующий условий активизации.</span>
					  </div>
				  </div>
				  <div class="flex gap-2">
					  <div class="font-[Inter] text-[#0A0E11] text-[17px] min-w-8 sm:text-4xl sm:min-w-auto">*</div>
					  <div>
						  <span class="font-light text-sm">Равным образом начало повседневной работы по формированию позиции обеспечивает широкому кругу (специалистов) участие в формировании систем массового участия.</span>
					  </div>
				  </div>
			  </div>
			  <div class="order-9">
			    <div v-if="!areImagesLoaded" class="aspect-[900/500] w-full bg-[#F9F6EC] rounded-lg" />
				  <NuxtImg :src="images.art5" alt="art" width="900" height="500" class="rounded-lg aspect-[900/500]" />
			  </div>
			  <div class="order-10">
				  <p class="font-light text-sm">Задача организации, в особенности же рамки и <span class="underline font-semibold sm:no-underline sm:font-light">место обучения кадров</span> позволяет оценить значение соответствующий условий активизации.</p>
			  </div>
			  <div class="order-11">
				  <button class="px-4 py-2 rounded-2xl border border-[#211D1D] bg-[#211D1D] text-[#FFFFFA] font-light text-sm sm:px-8 sm:font-normal">Поделиться</button>
			  </div>
		  </div>
	  </div>
	  <div class="mt-30 mb-8 hidden lg:block">
		  <h2 class="font-[Inter] text-4xl text-center">Другие статьи</h2>
		  <div class="flex px-4 mt-8 gap-4">
			  <BannerCard
				  :image-url="images.art6"
				  text="Название статьи"
				  custom-class="rounded-lg aspect-[618/570]"
				  object-position="center"
				  link="/blog/article"
			  />
			  <BannerCard
				  :image-url="images.art7"
				  text="Название статьи"
				  custom-class="rounded-lg aspect-[618/570]"
				  object-position="center"
				  link="/blog/article"
			  />
			  <BannerCard
				  :image-url="images.art8"
				  text="Название статьи"
				  custom-class="rounded-lg aspect-[618/570]"
				  object-position="center"
				  link="/blog/article"
			  />
		  </div>
	  </div>
  </main>
</template>

<style scoped>

</style>