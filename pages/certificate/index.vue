<script setup lang="ts">
const breadcrumsItems: { name: string, path?: string }[] = [{ name: "Главная", path: "/" }, { name: "Сертификат" }]
const sums =  ["999", "9999", "99999", "999999"]
const ways =  ["Электронной почтой", "По SMS", "Доставка"]
const details =  ["Отправить сразу после оплаты", "Анонимно"]
const step = ref(1)
const selectedSum = ref<number | null>(null)
const selectedWay = ref<number | null>(null)
const selectedDetails = ref<number | null>(null)
const currentImageIndex = ref(0)
const touchStartX = ref(0)

const imageStyles = computed(() => (index: number) => {
	if (index === currentImageIndex.value) {
		return {
			transform: 'translateX(0)',
			opacity: 1,
			zIndex: 1,
			transition: 'transform 400ms ease-in-out, opacity 400ms ease-in-out'
		}
	}
	return {
		transform: index < currentImageIndex.value ? 'translateX(-100%)' : 'translateX(100%)',
		opacity: 0,
		zIndex: 0,
		transition: 'transform 400ms ease-in-out, opacity 400ms ease-in-out'
	}
})

const barStyles = computed(() => (index: number) => ({
	opacity: index === currentImageIndex.value ? 1 : 0.3,
	transition: 'opacity 400ms ease-in-out'
}))

const certificateImages = [
	"/certificate-1.png",
	"/certificate-2.png"
]

const handleTouchStart = (e: TouchEvent) => {
	touchStartX.value = e.touches[0].clientX
}

const handleTouchEnd = (e: TouchEvent) => {
	const touchEndX = e.changedTouches[0].clientX
	const deltaX = touchEndX - touchStartX.value
	const threshold = 50
	if (deltaX > threshold) {
		currentImageIndex.value = (currentImageIndex.value - 1 + certificateImages.length) % certificateImages.length
	} else if (deltaX < -threshold) {
		currentImageIndex.value = (currentImageIndex.value + 1) % certificateImages.length
	}
}

const handleNextStep = () => {
	if (step.value + 1 > 3) {
		alert('Отправлено')
		return
	}
	step.value++
}

</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] mb-18 sm:mb-4">
	  <div class="p-2 sm:px-4 sm:py-6">
		  <AppBreadcrumbs :items="breadcrumsItems" />
	  </div>
	  <div class="px-0 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 sm:px-4">
		  <div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
			  <div
				  class="block sm:hidden relative w-full aspect-[460/680] overflow-hidden"
				  @touchstart="handleTouchStart"
				  @touchend="handleTouchEnd"
			  >
          <NuxtImg
	          v-for="(img, index) in certificateImages"
	          :key="index"
	          :src="img"
	          alt="certificate"
	          width="460"
	          height="680"
	          class="absolute top-0 left-0 w-full h-full sm:rounded-lg"
	          :style="imageStyles(index)"
          />
        </div>
			  <div class="flex sm:hidden justify-center items-center gap-1 px-4 mt-2">
				  <div
					  v-for="(_, index) in certificateImages"
					  :key="index"
					  class="flex-1 border-y border-[#A6CEFF]"
					  :style="barStyles(index)"
				  />
			  </div>
			  <NuxtImg
				  src="/certificate-1.png" alt="certificate" width="726" height="1080"
				  class="sm:rounded-lg hidden sm:block"
			  />
			  <NuxtImg
				  src="/certificate-2.png" alt="certificate" width="726" height="1080"
				  class="sm:rounded-lg hidden sm:block"
			  />
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
					  <h3 class="font-[Inter] text-2xl">{{step}}/3</h3>
					  <span class="font-light text-sm">{{step === 1 ? "Выберите номинал:" : step === 2 ? "Как отправить получателю?" : "Кому и когда отправить?"}}</span>
				  </div>
				  <div
					  :class="['flex w-full justify-center items-center font-light sm:font-normal', step === 3 ? 'flex-col gap-8' : 'gap-3 sm:gap-4']"
				  >
					  <SingleSelectButton v-if="step === 1" :content="sums" @select="value => selectedSum = value" />
					  <SingleSelectButton v-if="step === 2" :content="ways" @select="value => selectedWay = value" />
					  <div v-if="step === 3" class="w-full flex flex-col gap-8">
						  <input
							  type="text" placeholder="Имя получателя*"
							  class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
						  >
						  <input
							  type="text" placeholder="Текст послания"
							  class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
						  >
					  </div>
					  <div class="flex justify-center items-center gap-3 font-light sm:gap-4 sm:font-normal">
					    <SingleSelectButton v-if="step === 3" :content="details" @select="value => selectedDetails = value" />
					  </div>
				  </div>
				  <div class="w-full flex items-center gap-2 sm:w-[400px]">
					  <AppButton @click="step--" :disabled="step === 1" content="Назад" />
					  <AppButton @click="handleNextStep" :disabled="(step === 1 && selectedSum === null) || (step === 2 && selectedWay === null) || (step === 3 && selectedDetails === null)" variant="primary" :content="(step === 1 && selectedSum === null) ? 'Сначала выберите номинал' : (step === 2 && selectedWay === null) ? 'Выберите способ отправки' : (step === 3 && selectedDetails === null) ? 'Укажите детали отправки' : (step === 3 && selectedDetails !== null) ? 'Отправить сертификат' : 'Далее'" custom-class="w-full" />
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