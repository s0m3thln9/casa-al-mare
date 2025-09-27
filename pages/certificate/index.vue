<script setup lang="ts">
import { useCertificateStore } from "~/stores/certificate"
import { ref, computed } from "vue"

const certificateStore = useCertificateStore()

const breadcrumbsItems: { name: string; path?: string }[] = [{ name: "Главная", path: "/" }, { name: "Сертификат" }]
const sums = ["999", "9999", "99999", "999999"]
const ways = ["Электронной почтой", "По SMS", "Доставка"]
const details = ["Отправить сразу после оплаты", "Анонимно"]
const currentImageIndex = ref(0)
const touchStartX = ref(0)

const imageStyles = computed(() => (index: number) => {
  if (index === currentImageIndex.value) {
    return {
      transform: "translateX(0)",
      opacity: 1,
      zIndex: 1,
      transition: "transform 400ms ease-in-out, opacity 400ms ease-in-out",
    }
  }
  return {
    transform: index < currentImageIndex.value ? "translateX(-100%)" : "translateX(100%)",
    opacity: 0,
    zIndex: 0,
    transition: "transform 400ms ease-in-out, opacity 400ms ease-in-out",
  }
})

const barStyles = computed(() => (index: number) => ({
  opacity: index === currentImageIndex.value ? 1 : 0.3,
  transition: "opacity 400ms ease-in-out",
}))

const certificateImages = [
  "/certificate-1.png",
  "/certificate-2.png",
  "/certificate-1.png",
  "/certificate-2.png",
  "/certificate-1.png",
  "/certificate-2.png",
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
      <AppBreadcrumbs :items="breadcrumbsItems" />
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
          src="/certificate-1.png"
          alt="certificate"
          width="726"
          height="1080"
          class="sm:rounded-lg hidden sm:block"
        />
        <NuxtImg
          src="/certificate-2.png"
          alt="certificate"
          width="726"
          height="1080"
          class="sm:rounded-lg hidden sm:block"
        />
        <NuxtImg
          src="/certificate-1.png"
          alt="certificate"
          width="726"
          height="1080"
          class="sm:rounded-lg hidden sm:block"
        />
        <NuxtImg
          src="/certificate-2.png"
          alt="certificate"
          width="726"
          height="1080"
          class="sm:rounded-lg hidden sm:block"
        />
        <NuxtImg
          src="/certificate-1.png"
          alt="certificate"
          width="726"
          height="1080"
          class="sm:rounded-lg hidden sm:block"
        />
        <NuxtImg
          src="/certificate-2.png"
          alt="certificate"
          width="726"
          height="1080"
          class="sm:rounded-lg hidden sm:block"
        />
      </div>
      <div class="px-2 flex flex-col sm:px-0">
        <div class="flex justify-center items-center">
          <h2 class="font-[Inter] text-center text-[32px] sm:text-4xl">Подарочный сертификат</h2>
        </div>
        <SelectButton
          v-model="certificateStore.certificateType"
          :variants="['Электронный', 'Подарочный']"
          custom-class="w-fit self-center mt-6"
          custom-button-class="text-[13px] sm:text-xs"
        />
        <div class="mt-14 flex flex-col justify-center items-center">
          <div class="flex flex-col justify-center items-center gap-2 mb-8">
            <h3 class="font-[Inter] text-2xl">{{ certificateStore.step }}/3</h3>
            <span class="font-light text-sm">
              {{
                certificateStore.step === 1
                  ? "Выберите номинал:"
                  : certificateStore.step === 2
                    ? "Как отправить получателю?"
                    : "Кому и когда отправить?"
              }}
            </span>
          </div>
          <div
            :class="[
              'flex justify-center items-center font-light sm:font-normal',
              certificateStore.step === 3 ||
              (certificateStore.step === 2 &&
                (certificateStore.selectedWay === 'Электронной почтой' || certificateStore.selectedWay === 'По SMS'))
                ? 'flex-col'
                : 'gap-3 sm:gap-4',
            ]"
          >
            <div class="flex justify-center items-center gap-3 sm:gap-4">
              <SingleSelectButton
                v-if="certificateStore.step === 1"
                v-model="certificateStore.selectedSum"
                :content="sums"
              />
            </div>
            <div class="flex w-full justify-center items-center gap-3 sm:gap-4">
              <SingleSelectButton
                v-if="certificateStore.step === 2"
                v-model="certificateStore.selectedWay"
                :content="ways"
              />
            </div>
            <div
              v-if="certificateStore.step === 3"
              class="w-full flex flex-col gap-8"
            >
              <AppInput
                id="recipientName"
                v-model="certificateStore.recipientName"
                label="Имя получателя*"
                type="text"
              />
              <AppInput
                id="message"
                v-model="certificateStore.message"
                label="Текст послания"
                type="text"
              />
            </div>
            <div
              class="flex justify-center items-center gap-3 font-light sm:gap-4 sm:font-normal mt-8"
              :class="
                certificateStore.step === 2 &&
                (certificateStore.selectedWay === 'Электронной почтой' || certificateStore.selectedWay === 'По SMS') &&
                'w-full'
              "
            >
              <SingleSelectButton
                v-if="certificateStore.step === 3"
                v-model="certificateStore.selectedDetails"
                :content="details"
              />
              <div
                v-if="
                  certificateStore.step === 2 &&
                  (certificateStore.selectedWay === 'Электронной почтой' || certificateStore.selectedWay === 'По SMS')
                "
                class="w-full flex flex-col"
              >
                <AppInput
                  v-if="certificateStore.selectedWay === 'Электронной почтой'"
                  id="recipientEmail"
                  v-model="certificateStore.recipientEmail"
                  label="Введите e-mail получателя*"
                  type="email"
                />
                <SelectInput
                  v-if="certificateStore.selectedWay === 'По SMS'"
                  id="recipientPhone"
                  v-model="certificateStore.recipientPhone"
                  :options="[
                    { code: '+7', country: 'Россия' },
                    { code: '+375', country: 'Беларусь' },
                    { code: '+380', country: 'Украина' },
                    { code: '+77', country: 'Казахстан' },
                    { code: '+998', country: 'Узбекистан' },
                    { code: '+992', country: 'Таджикистан' },
                    { code: '+993', country: 'Туркменистан' },
                    { code: '+996', country: 'Кыргызстан' },
                    { code: '+374', country: 'Армения' },
                    { code: '+994', country: 'Азербайджан' },
                    { code: '+373', country: 'Молдова' },
                    { code: '+7', country: 'Абхазия' },
                    { code: '+995', country: 'Грузия' },
                  ]"
                  type="text"
                  label="Номер телефона"
                  required
                />
              </div>
            </div>
          </div>
          <div class="w-full flex items-center gap-2 sm:w-[400px] mt-8">
            <AppButton
              :disabled="certificateStore.step === 1"
              content="Назад"
              @click="certificateStore.prevStep"
            />
            <AppButton
              :disabled="!certificateStore.canGoNext"
              variant="primary"
              :content="
                certificateStore.step === 1 && certificateStore.selectedSum === null
                  ? 'Сначала выберите номинал'
                  : certificateStore.step === 2 && certificateStore.selectedWay === null
                    ? 'Выберите способ отправки'
                    : certificateStore.step === 3 && certificateStore.selectedDetails === null
                      ? 'Укажите детали отправки'
                      : certificateStore.step === 3 && certificateStore.selectedDetails !== null
                        ? 'Отправить сертификат'
                        : 'Далее'
              "
              custom-class="w-full"
              @click="certificateStore.nextStep"
            />
          </div>
        </div>
        <div class="w-full mt-14">
          <CollapsibleBlock
            label="Описание сертификта"
            description="Текстовое описание сертификата"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
