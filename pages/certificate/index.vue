<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue"
import { useCertificateStore } from "~/stores/certificate"

const certificateStore = useCertificateStore()

const breadcrumbsItems: { name: string; path?: string }[] = [{ name: "Главная", path: "/" }, { name: "Сертификат" }]
const sums = ["999", "9999", "99999", "999999"]
const ways = ["Электронной почтой", "По SMS", "Доставка"]
const details = ["Отправить сразу после оплаты", "Анонимно"]
const currentImageIndex = ref(0)
const touchStartX = ref(0)
const touchStartY = ref(0)
const isHorizontalSwipe = ref(false)
const isTransitioning = ref(false)

const imageStyles = computed(() => (index: number) => {
  const len = certificateImages.value.length
  if (len === 0) {
    if (index === 0) {
      return {
        transform: "translateX(0)",
        opacity: 1,
        zIndex: 1,
        transition: "transform 400ms ease-in-out, opacity 400ms ease-in-out",
      }
    } else {
      return { opacity: 0, visibility: "hidden" }
    }
  }
  if (index >= len) return { opacity: 0, visibility: "hidden" }
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

const certificateImages = ref<string[]>([])

const fallbackImages = ["/certificate-1.png", "/certificate-2.png", "/certificate-3.png"]

const isLoadingImages = ref(true)

const numBars = computed(() => Math.max(certificateImages.value.length, 1))

onMounted(async () => {
  try {
    isLoadingImages.value = true
    const response = await $fetch<{ success: boolean; images: string[] }>(
      "https://back.casaalmare.com/api/getCertImages",
    )
    if (response.success && response.images.length > 0) {
      certificateImages.value = response.images
    } else {
      certificateImages.value = fallbackImages
    }
  } catch (error) {
    console.error("Ошибка загрузки изображений сертификата:", error)
    certificateImages.value = fallbackImages
  } finally {
    isLoadingImages.value = false
  }
})

watch(certificateImages, () => {
  currentImageIndex.value = 0
})

watch(currentImageIndex, (newVal) => {
  console.log("Current image index changed to:", newVal)
})

const handleTouchStart = (e: TouchEvent) => {
  const len = certificateImages.value.length
  if (len <= 1 || isTransitioning.value) return
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isHorizontalSwipe.value = false
}

const handleTouchMove = (e: TouchEvent) => {
  const len = certificateImages.value.length
  if (len <= 1 || isTransitioning.value || !touchStartX.value || !touchStartY.value) return

  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY
  const deltaX = Math.abs(currentX - touchStartX.value)
  const deltaY = Math.abs(currentY - touchStartY.value)

  // Увеличиваем порог для определения направления свайпа
  const directionThreshold = 10

  // Определяем направление только если есть достаточное движение
  if (deltaX > directionThreshold || deltaY > directionThreshold) {
    // Если уже определили, что это горизонтальный свайп, блокируем прокрутку
    if (isHorizontalSwipe.value) {
      e.preventDefault()
      return
    }

    // Определяем направление: если горизонтальное движение значительно больше вертикального
    if (deltaX > deltaY * 1.5 && deltaX > directionThreshold) {
      isHorizontalSwipe.value = true
      e.preventDefault()
    }
    // Если вертикальное движение больше, позволяем прокрутку страницы
    else if (deltaY > deltaX) {
      // Явно разрешаем вертикальную прокрутку
      return
    }
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  const len = certificateImages.value.length
  if (len <= 1 || isTransitioning.value) return

  if (!isHorizontalSwipe.value) {
    touchStartX.value = 0
    touchStartY.value = 0
    return
  }

  const deltaX = e.changedTouches[0].clientX - touchStartX.value
  const threshold = 50
  if (Math.abs(deltaX) > threshold) {
    isTransitioning.value = true
    const direction = deltaX > 0 ? -1 : 1
    currentImageIndex.value = (currentImageIndex.value + direction + len) % len
    setTimeout(() => {
      isTransitioning.value = false
    }, 400)
  }

  touchStartX.value = 0
  touchStartY.value = 0
  isHorizontalSwipe.value = false
}

const getStepDescription = computed(() => {
  switch (certificateStore.step) {
    case 1:
      return "Выберите номинал:"
    case 2:
      return "Выберите дизайн сертификата:"
    case 3:
      return "Как отправить получателю?"
    case 4:
      return "Кому и когда отправить?"
    default:
      return ""
  }
})
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] mb-18 sm:mb-4">
    <div class="p-2 sm:px-4 sm:py-6">
      <AppBreadcrumbs :items="breadcrumbsItems" />
    </div>
    <div class="px-0 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 sm:px-4">
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <template v-if="certificateImages.length > 0">
          <div
            class="block sm:hidden relative w-full aspect-[460/680] overflow-hidden"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          >
            <NuxtImg
              v-for="(img, index) in certificateImages"
              :key="index"
              v-slot="{ src, isLoaded, imgAttrs }"
              :src="img"
              :custom="true"
              class="absolute top-0 left-0 w-full h-full"
            >
              <div
                v-if="!isLoaded"
                class="w-full h-full aspect-[460/680] bg-[#F9F6EC]"
                :style="imageStyles(index)"
              />
              <img
                v-else
                v-bind="imgAttrs"
                :src="src"
                :style="imageStyles(index)"
                class="w-full h-full object-cover"
                alt="certificate"
              />
            </NuxtImg>
          </div>
          <div class="flex sm:hidden justify-center items-center gap-1 px-4 mt-2">
            <div
              v-for="(_, index) in numBars"
              :key="index"
              class="flex-1 border-y border-[#A6CEFF]"
              :style="barStyles(index)"
            />
          </div>
          <NuxtImg
            v-for="(img, index) in certificateImages"
            :key="index"
            v-slot="{ src, isLoaded, imgAttrs }"
            :src="img"
            :custom="true"
            class="rounded-2xl hidden sm:block aspect-[726/1080]"
          >
            <div
              v-if="!isLoaded"
              class="aspect-[726/1080] bg-[#F9F6EC] rounded-2xl"
            />
            <img
              v-else
              v-bind="imgAttrs"
              :src="src"
              class="w-full h-full object-cover rounded-2xl"
              alt="certificate"
            />
          </NuxtImg>
        </template>
        <template v-else>
          <div class="block sm:hidden">
            <div class="relative w-full aspect-[460/680] overflow-hidden bg-[#F9F6EC]" />
            <div class="flex justify-center items-center gap-1 px-4 mt-2">
              <div class="flex-1 border-y border-[#A6CEFF]" />
              <div class="flex-1 border-y border-[#A6CEFF]" />
              <div class="flex-1 border-y border-[#A6CEFF]" />
            </div>
          </div>
          <div class="hidden sm:block aspect-[726/1080] w-full bg-[#F9F6EC] sm:rounded-lg" />
          <div class="hidden sm:block aspect-[726/1080] w-full bg-[#F9F6EC] sm:rounded-lg" />
          <div class="hidden sm:block aspect-[726/1080] w-full bg-[#F9F6EC] sm:rounded-lg" />
        </template>
      </div>
      <div class="px-2 flex flex-col sm:px-0">
        <div class="flex justify-center items-center">
          <h2 class="font-[Inter] text-center text-[32px] sm:text-4xl">Подарочный сертификат</h2>
        </div>
        <SelectButton
          v-model="certificateStore.certificateType"
          :variants="['Электронный', 'Физический']"
          custom-class="w-fit self-center mt-6"
          custom-button-class="text-[13px] sm:text-xs"
        />
        <div class="mt-14 flex flex-col justify-center items-center">
          <div class="flex flex-col justify-center items-center gap-2 mb-8">
            <h3 class="font-[Inter] text-2xl">{{ certificateStore.step }}/4</h3>
            <span class="font-light text-sm">
              {{ getStepDescription }}
            </span>
          </div>
          <div
            :class="[
              'flex justify-center items-center font-light sm:font-normal',
              certificateStore.step === 4 ||
              certificateStore.step === 2 ||
              (certificateStore.step === 3 &&
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

            <div
              v-if="certificateStore.step === 2"
              class="w-full grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
            >
              <div
                v-for="(img, index) in certificateImages"
                :key="index"
                class="relative aspect-square cursor-pointer rounded-lg overflow-hidden"
                :class="
                  certificateStore.selectedDesign === index
                    ? 'border-[2px] border-[#211D1D]'
                    : 'border-[2px] border-transparent'
                "
                @click="certificateStore.selectedDesign = index"
              >
                <NuxtImg
                  v-slot="{ src, isLoaded, imgAttrs }"
                  :src="img"
                  alt="certificate design"
                  width="200"
                  height="200"
                  class="w-full h-full"
                >
                  <div
                    v-if="!isLoaded"
                    class="w-full h-full bg-[#F9F6EC] rounded-lg"
                  />
                  <img
                    v-else
                    v-bind="imgAttrs"
                    :src="src"
                    class="w-full h-full object-cover rounded-lg"
                    alt="certificate design"
                  />
                </NuxtImg>
              </div>
            </div>

            <div class="flex w-full justify-center items-center gap-3 sm:gap-4">
              <SingleSelectButton
                v-if="certificateStore.step === 3"
                v-model="certificateStore.selectedWay"
                :content="ways"
              />
            </div>
            <div
              v-if="certificateStore.step === 4"
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
                certificateStore.step === 3 &&
                (certificateStore.selectedWay === 'Электронной почтой' || certificateStore.selectedWay === 'По SMS') &&
                'w-full'
              "
            >
              <SingleSelectButton
                v-if="certificateStore.step === 4"
                v-model="certificateStore.selectedDetails"
                :content="details"
              />
              <div
                v-if="
                  certificateStore.step === 3 &&
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
                    { code: '+384', country: 'Украина' },
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
                  : certificateStore.step === 2 && certificateStore.selectedDesign === null
                    ? 'Выберите дизайн'
                    : certificateStore.step === 3 && certificateStore.selectedWay === null
                      ? 'Выберите способ отправки'
                      : certificateStore.step === 4 && certificateStore.selectedDetails === null
                        ? 'Укажите детали отправки'
                        : certificateStore.step === 4 && certificateStore.selectedDetails !== null
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
            label="Описание сертификата"
            description="Текстовое описание сертификата"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
