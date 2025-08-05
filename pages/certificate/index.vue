<script setup lang="ts">
const breadcrumsItems: { name: string, path?: string }[] = [{ name: "Главная", path: "/" }, { name: "Сертификат" }]
const sums =  ["999", "9999", "99999", "999999"]
const ways =  ["Электронной почтой", "По SMS", "Доставка"]
const details =  ["Отправить сразу после оплаты", "Анонимно"]
const currentImageIndex = ref(0)
const touchStartX = ref(0)

const certificateStore = useCertificateStore()

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
	"/certificate-2.png",
	"/certificate-1.png",
	"/certificate-2.png",
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

</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] mb-18 sm:mb-4">
	  <div class="p-2 sm:px-4 sm:py-6">
		  <AppBreadcrumbs :items="breadcrumsItems" />
	  </div>
	  <div class="px-0 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 sm:px-4">
		  <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
			  <NuxtImg
				  src="/certificate-1.png" alt="certificate" width="726" height="1080"
				  class="sm:rounded-lg hidden sm:block"
			  />
			  <NuxtImg
				  src="/certificate-2.png" alt="certificate" width="726" height="1080"
				  class="sm:rounded-lg hidden sm:block"
			  />
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
            <h3 class="font-[Inter] text-2xl">{{ certificateStore.step }}/3</h3>
            <span class="font-light text-sm">
              {{ certificateStore.step === 1 ? "Выберите номинал:" : certificateStore.step === 2 ? "Как отправить получателю?" : "Кому и когда отправить?" }}
            </span>
          </div>
          <div :class="['flex w-full justify-center items-center font-light sm:font-normal', certificateStore.step === 3 ? 'flex-col gap-8' : 'gap-3 sm:gap-4']">
            <SingleSelectButton v-if="certificateStore.step === 1" :content="sums" @select="value => certificateStore.selectedSum = value" />
            <SingleSelectButton v-if="certificateStore.step === 2" :content="ways" @select="value => certificateStore.selectedWay = value" />
            <div v-if="certificateStore.step === 3" class="w-full flex flex-col gap-8">
              <AppInput
	              label="Имя получателя*"
	              type="text"
	              id="recipientName"
	              v-model="certificateStore.recipientName"
              />
              <AppInput
	              label="Текст послания"
	              type="text"
	              id="message"
	              v-model="certificateStore.message"
              />
            </div>
            <div class="flex justify-center items-center gap-3 font-light sm:gap-4 sm:font-normal">
              <SingleSelectButton v-if="certificateStore.step === 3" :content="details" @select="value => certificateStore.selectedDetails = value" />
            </div>
          </div>
          <div class="w-full flex items-center gap-2 sm:w-[400px]">
            <AppButton :disabled="certificateStore.step === 1" content="Назад" @click="certificateStore.prevStep" />
            <AppButton
	            :disabled="!certificateStore.canGoNext"
	            variant="primary"
	            :content="(certificateStore.step === 1 && certificateStore.selectedSum === null) ? 'Сначала выберите номинал' : (certificateStore.step === 2 && certificateStore.selectedWay === null) ? 'Выберите способ отправки' : (certificateStore.step === 3 && certificateStore.selectedDetails === null) ? 'Укажите детали отправки' : (certificateStore.step === 3 && certificateStore.selectedDetails !== null) ? 'Отправить сертификат' : 'Далее'"
	            custom-class="w-full"
	            @click="certificateStore.nextStep"
            />
          </div>
        </div>
			  <div class="w-full mt-14">
				  <CollapsibleBlock label="Описание сертификта" description="Текстовое описание сертификата" />
			  </div>
		  </div>
	  </div>
  </main>
</template>

<style scoped>

</style>