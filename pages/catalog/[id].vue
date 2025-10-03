<script setup lang="ts">
import type { Item } from "~/stores/catalog"

const route = useRoute()
const segment = route.params.id
const catalogStore = useCatalogStore()
const popupStore = usePopupStore()
const itemStore = useItemStore()
const setStore = useSetStore()

// ФИКС: Состояния для устойчивости
const isLoading = ref(true)
const error = ref<string | null>(null)
const item = ref<Item | null>(null) // Ref для реактивности

// ФИКС: Async setup — ждём загрузку store
onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null

    // Загружаем store, если пусто
    if (catalogStore.items.length === 0) {
      await catalogStore.loadItems()
    }

    // ФИКС: Парсим id в number, с проверкой
    const id = Number(segment)
    if (isNaN(id)) {
      throw new Error("Неверный ID товара")
    }

    // Ищем в items (или filteredItems, если фильтры важны)
    item.value = catalogStore.items.find((i) => i.id === id) || null
    if (!item.value) {
      throw new Error("Товар не найден")
    }

    // ФИКС: Устанавливаем дефолт color/size сразу, если item готов
    if (Object.keys(item.value.colors).length > 0) {
      const firstColorCode = Object.keys(item.value.colors)[0]
      const firstColor = item.value.colors[firstColorCode]
      itemStore.color = { code: firstColorCode, name: firstColor.name, value: firstColor.value }
    }
    if (item.value.sizes.length > 0) {
      itemStore.size = item.value.sizes[0]
    }
  } catch (err) {
    console.error("Ошибка загрузки страницы товара:", err)
    error.value = err instanceof Error ? err.message : "Неизвестная ошибка"
    // Опционально: navigateTo('/catalog') для редиректа
  } finally {
    isLoading.value = false
  }
})

// ФИКС: Безопасные breadcrumbs (с ?.)
const breadcrumsItems = computed(() => [
  { name: "Главная", path: "/" },
  { name: "Смотреть все", path: "/catalog" },
  { name: item.value?.name || "Товар не найден" }, // ФИКС: Fallback
])

const currentImageIndex = ref(0)
const touchStartX = ref(0)

// ФИКС: setItems — динамические ID? (здесь хардкод, но с проверкой)
const setItems = computed(() => {
  const items: { id: number; vector: string }[] = []

  // Верх: ID 31 (замени на динамику, напр. setStore.topId)
  if (setStore.top) {
    const topItem = catalogStore.getItemById(31) // ФИКС: getItemById вместо find
    if (topItem) {
      const firstColorCode = Object.keys(topItem.colors)[0] || ""
      items.push({
        id: topItem.id,
        vector: `${firstColorCode}_${setStore.top}`,
      })
    }
  }

  // Низ: ID 32? (пример; подставь реальные)
  if (setStore.bottom) {
    const bottomItem = catalogStore.getItemById(32) // ФИКС: Разные ID для комплекта
    if (bottomItem) {
      const firstColorCode = Object.keys(bottomItem.colors)[0] || ""
      items.push({
        id: bottomItem.id,
        vector: `${firstColorCode}_${setStore.bottom}`,
      })
    }
  }

  // Аксессуар: ID 33?
  if (setStore.accessory) {
    const accessoryItem = catalogStore.getItemById(33)
    if (accessoryItem) {
      const firstColorCode = Object.keys(accessoryItem.colors)[0] || ""
      items.push({
        id: accessoryItem.id,
        vector: `${firstColorCode}_${setStore.accessory}`,
      })
    }
  }

  return items
})

// ФИКС: Все computed с ? и fallback
const currentColorCode = computed(() => itemStore.color?.code || (item.value ? Object.keys(item.value.colors)[0] : ""))
const currentColorName = computed(() => itemStore.color?.name || "")
const currentSize = computed(() => itemStore.size || item.value?.sizes[0] || "")
const currentColorImages = computed(() => {
  if (!item.value || !currentColorCode.value) return []
  const colorData = item.value.colors[currentColorCode.value]
  if (!colorData) return []
  return colorData.images.map((id) => item.value.images[id]).filter(Boolean) || [] // ФИКС: Фильтр null
})
const currentVectorData = computed(() => {
  if (!item.value || !currentColorCode.value || !currentSize.value) return null
  const vectorKey = `${currentColorCode.value}_${currentSize.value}`
  return item.value.vector[vectorKey] || null
})
const currentPrice = computed(() => currentVectorData.value?.price || 0)
const currentOldPrice = computed(() => currentVectorData.value?.oldPrice || 0)
const canAddToCart = computed(() => !!(itemStore.color && itemStore.size)) // ФИКС: !! для boolean

// ФИКС: imageStyles и barStyles с проверкой длины
const imageStyles = computed(() => (index: number) => {
  const len = currentColorImages.value.length
  if (len === 0 || index >= len) return { opacity: 0, visibility: "hidden" } // ФИКС: Пустой слайдер
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

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
}

const handleTouchEnd = (e: TouchEvent) => {
  const touchEndX = e.changedTouches[0].clientX
  const deltaX = touchEndX - touchStartX.value
  const threshold = 50
  const len = currentColorImages.value.length
  if (len === 0) return // ФИКС: Нет изображений — не свайпай
  if (deltaX > threshold) {
    currentImageIndex.value = (currentImageIndex.value - 1 + len) % len
  } else if (deltaX < -threshold) {
    currentImageIndex.value = (currentImageIndex.value + 1) % len
  }
}

const calculateDiscount = (price: number, oldPrice: number) => {
  if (!oldPrice || oldPrice <= price) return 0
  return Math.round(((oldPrice - price) / oldPrice) * 100)
}

const discount = computed(() => calculateDiscount(currentPrice.value, currentOldPrice.value))

const priceFormatter = (value: number) => {
  if (value === 0) return "Цена не указана" // ФИКС: Fallback для пустого vector
  const formattedValue = new Intl.NumberFormat("ru-RU").format(value)
  return `${formattedValue} ₽`
}

// ФИКС: Watch на item для автообновления (если store изменится)
watch(
  item,
  (newItem) => {
    if (newItem && !itemStore.color) {
      // Логика дефолта из onMounted
      const firstColorCode = Object.keys(newItem.colors)[0]
      if (firstColorCode) {
        const firstColor = newItem.colors[firstColorCode]
        itemStore.color = { code: firstColorCode, name: firstColor.name, value: firstColor.value }
      }
      if (newItem.sizes[0]) {
        itemStore.size = newItem.sizes[0]
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <main
    v-if="!isLoading && !error"
    class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] w-full"
  >
    <!-- ФИКС: v-if для всего main -->
    <div class="p-2 sm:px-4 sm:py-6">
      <AppBreadcrumbs :items="breadcrumsItems" />
    </div>
    <div
      class="px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[4fr_1fr] xl:grid-cols-[3fr_1fr] w-full gap-8 sm:px-4"
    >
      <!-- Мобильные изображения -->
      <div
        v-if="currentColorImages.length > 0"
        class="block sm:hidden"
      >
        <!-- ФИКС: v-if если изображения есть -->
        <div
          class="relative w-full aspect-[460/680] overflow-hidden"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <NuxtImg
            v-for="(img, index) in currentColorImages"
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
              alt="item"
            />
          </NuxtImg>
        </div>
        <div class="flex justify-center items-center gap-1 px-4 mt-2">
          <div
            v-for="(_, index) in currentColorImages"
            :key="index"
            class="flex-1 border-y border-[#A6CEFF]"
            :style="barStyles(index)"
          />
        </div>
      </div>
      <div
        v-if="currentColorImages.length > 0"
        class="hidden sm:grid grid-cols-1 gap-2 lg:grid-cols-2"
      >
        <NuxtImg
          v-for="(img, index) in currentColorImages"
          :key="index"
          v-slot="{ src, isLoaded, imgAttrs }"
          :src="img"
          :custom="true"
          class="sm:rounded-lg aspect-[726/1080]"
        >
          <div
            v-if="!isLoaded"
            class="aspect-[726/1080] bg-[#F9F6EC] rounded-lg"
          />
          <img
            v-else
            v-bind="imgAttrs"
            :src="src"
            class="w-full h-full object-cover sm:rounded-lg"
            alt="item"
          />
        </NuxtImg>
      </div>
      <div
        v-if="item"
        class="px-2 flex flex-col sm:px-0 sm:sticky sm:top-0 sm:h-screen sm:overflow-y-auto"
      >
        <div class="flex justify-center items-center">
          <h2 class="font-[Inter] text-center text-[32px] sm:text-4xl">{{ item.name }}</h2>
          <!-- Без ! -->
        </div>
        <div class="flex justify-center items-center gap-2 mt-4 sm:mt-6">
          <span
            class="font-[Inter] font-light text-[17px] text-[#8C8785] sm:font-[Manrope] sm:font-normal sm:text-base sm:text-[#211D1D]"
          >
            {{ priceFormatter(currentPrice) }}
          </span>
          <span
            v-if="currentOldPrice > 0"
            class="font-[Inter] line-through font-light text-[17px] text-[#8C8785] sm:font-[Manrope] sm:font-normal sm:text-base sm:text-[#211D1D]"
          >
            {{ priceFormatter(currentOldPrice) }}
          </span>
        </div>
        <div
          v-if="currentOldPrice > 0"
          class="flex justify-center items-center mt-1 sm:mt-2"
        >
          <span class="font-light text-xs">Скидка {{ discount }}%</span>
        </div>
        <div class="flex flex-col justify-center items-center gap-6 mt-14">
          <div class="flex justify-center items-center gap-4">
            <ColorButton
              v-model="itemStore.color"
              :colors="
                Object.entries(item.colors).map(([code, colorData]) => ({
                  code,
                  name: colorData.name,
                  value: colorData.value,
                }))
              "
            />
          </div>
          <span class="text-xs">{{ currentColorName || "" }}</span>
        </div>
        <div class="flex flex-col justify-center items-center gap-4 mt-12 sm:mt-10">
          <div class="flex justify-center items-center gap-3 font-light sm:gap-4 sm:font-normal">
            <SingleSelectButton
              v-model="itemStore.size"
              :content="item.sizes"
            />
          </div>
          <span class="text-xs">Размер</span>
        </div>
        <div class="flex flex-col justify-center items-center gap-1 mt-12 sm:mt-10">
          <span class="font-light text-xs">На модели размер: S</span>
          <span class="text-[11px] text-[#363636]">Параметры модели: 175 80/60/89</span>
        </div>
        <div class="flex flex-col justify-center items-stretch gap-4 mt-6">
          <BuyButton
            :id="item.id"
            :vector="`${currentColorCode}_${currentSize}`"
            in-stock
            available-quantity
            :is-parameters-selected="canAddToCart"
          />
          <AppButton
            variant="secondary"
            content="Собрать комплект"
            custom-class="w-full py-4"
            @click="popupStore.open('set')"
          />
        </div>
        <div class="flex justify-center items-center mt-4 sm:mt-6">
          <WishlistButton />
        </div>
        <div class="mt-14 flex flex-col justify-center items-center gap-3 p-4 rounded-2xl border border-[#BBB8B6]">
          <div class="flex justify-center gap-2.5 items-center w-full sm:justify-between cursor-pointer sm:gap-0">
            <span class="font-light text-sm">Состав и уход</span>
            <NuxtImg
              src="/help.svg"
              alt="help"
              width="16"
              height="16"
            />
          </div>
          <div class="w-full h-[1px] bg-[#BBB8B6]" />
          <div
            class="flex justify-center gap-2.5 items-center w-full sm:justify-between cursor-pointer sm:gap-0"
            @click="popupStore.open('size')"
          >
            <span class="font-light text-sm">Определить размер</span>
            <NuxtImg
              src="/help.svg"
              alt="help"
              width="16"
              height="16"
            />
          </div>
          <div class="w-full h-[1px] bg-[#BBB8B6]" />
          <div class="flex justify-center gap-2.5 items-center w-full sm:justify-between cursor-pointer sm:gap-0">
            <span class="font-light text-sm">Доставка и возврат</span>
            <NuxtImg
              src="/help.svg"
              alt="help"
              width="16"
              height="16"
            />
          </div>
          <div class="w-full h-[1px] bg-[#BBB8B6]" />
          <div
            class="flex justify-center gap-2.5 items-center w-full sm:justify-between cursor-pointer sm:gap-0"
            @click="popupStore.open('subscription')"
          >
            <span class="font-light text-sm">Подписаться на рассылку</span>
            <NuxtImg
              src="/mail.svg"
              alt="mail"
              width="16"
              height="16"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="px-2 flex flex-col justify-center items-start gap-4 mt-18 sm:items-center sm:gap-12 sm:mt-24">
      <h2 class="font-[Manrope] text-[15px] font-light sm:font-[Inter] sm:text-4xl sm:font-normal">
        Вам может понравиться
      </h2>
      <div class="w-full grid gap-2 grid-cols-3 sm:gap-4 sm:px-[15%]">
        <CatalogCard
          :id="31"
          variant="large"
          link
        />
        <!-- ФИКС: id как number: 1 -->
        <CatalogCard
          :id="31"
          variant="large"
          link
        />
        <CatalogCard
          :id="31"
          variant="large"
          link
        />
      </div>
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
              :id="31"
              v-model="setStore.top"
              custom-image-class="aspect-[200/300] w-full"
              popup
              variant="mini"
            />
          </div>
          <div class="flex flex-col gap-2">
            <span class="font-[Manrope] text-sm">Низ</span>
            <CatalogCard
              :id="31"
              v-model="setStore.bottom"
              custom-image-class="aspect-[200/300] w-full"
              popup
              variant="mini"
            />
          </div>
          <div class="flex flex-col gap-2">
            <span class="font-[Manrope] text-sm">Аксессуар</span>
            <CatalogCard
              :id="31"
              v-model="setStore.accessory"
              custom-image-class="aspect-[200/300] w-full"
              popup
              variant="mini"
            />
          </div>
        </div>
        <BuyButton
          :items="setItems"
          available-quantity
          in-stock
          :is-parameters-selected="setStore.canAddToCart"
        />
      </div>
    </AppPopup>
    <AppPopup
      title="Определить размер"
      popup-id="size"
    >
      <div class="mt-6 flex flex-col gap-6">
        <div class="p-4 border border-[#BBB8B6] rounded-2xl flex flex-col gap-1">
          <span class="font-[Manrope] text-xs text-[#363636]">На модели размер: S</span>
          <span class="font-[Manrope] text-xs text-[#363636]">Параметры модели: 177 80/60/90</span>
        </div>
        <div class="p-4 border border-[#BBB8B6] rounded-2xl flex flex-col gap-4">
          <div class="flex gap-1 flex-col">
            <h3 class="font-[Manrope] text-sm text-[#211D1D]">Таблица размеров</h3>
            <span class="font-[Manrope] text-xs text-[#363636]"
              >Сопоставьте ваши параметры с указанными значениями, чтобы определить свой размер</span
            >
          </div>
          <div class="border border-[#BBB8B6] rounded-lg flex flex-col pt-2 pb-4 gap-5">
            <div class="flex flex-col gap-2">
              <div class="grid grid-cols-9 border-b-[0.7px] border-[#8C8785] gap-4 pb-2 px-6">
                <div class="col-span-3 font-[Manrope] text-xs text-[#211D1D]">INT</div>
                <div class="font-[Manrope] text-xs text-[#211D1D]">XSS</div>
                <div class="font-[Manrope] text-xs text-[#211D1D]">XS</div>
                <div class="font-[Manrope] text-xs text-[#211D1D]">S</div>
                <div class="font-[Manrope] text-xs text-[#211D1D]">M</div>
                <div class="font-[Manrope] text-xs text-[#211D1D]">L</div>
                <div class="font-[Manrope] text-xs text-[#211D1D]">XL</div>
              </div>
              <div class="grid grid-cols-9 border-b-[0.7px] border-[#8C8785] gap-4 pb-2 px-6">
                <div class="col-span-3 font-[Manrope] text-xs text-[#211D1D]">RU</div>
                <div class="font-[Manrope] text-xs text-[#211D1D]">40</div>
                <div class="font-[Manrope] text-xs text-[#211D1D]">42</div>
                <div class="font-[Manrope] text-xs text-[#211D1D]">44</div>
                <div class="font-[Manrope] text-xs text-[#211D1D]">46</div>
                <div class="font-[Manrope] text-xs text-[#211D1D]">48</div>
                <div class="font-[Manrope] text-xs text-[#211D1D]">50</div>
              </div>
            </div>
            <div class="px-4 flex flex-col gap-1">
              <div class="px-2 py-1.5 bg-[#F9F6EC] rounded-lg grid grid-cols-9 gap-4">
                <div class="col-span-3 font-[Manrope] text-xs text-[#211D1D] pl-2">Обхват груди</div>
                <div class="font-[Manrope] text-xs text-[#363636]">80</div>
                <div class="font-[Manrope] text-xs text-[#363636]">84</div>
                <div class="font-[Manrope] text-xs text-[#363636]">88</div>
                <div class="font-[Manrope] text-xs text-[#363636]">92</div>
                <div class="font-[Manrope] text-xs text-[#363636]">96</div>
                <div class="font-[Manrope] text-xs text-[#363636]">100</div>
              </div>
              <div class="px-2 py-1.5 bg-[#F9F6EC] rounded-lg grid grid-cols-9 gap-4">
                <div class="col-span-3 font-[Manrope] text-xs text-[#211D1D] pl-2">Обхват талии</div>
                <div class="font-[Manrope] text-xs text-[#363636]">60</div>
                <div class="font-[Manrope] text-xs text-[#363636]">64</div>
                <div class="font-[Manrope] text-xs text-[#363636]">68</div>
                <div class="font-[Manrope] text-xs text-[#363636]">72</div>
                <div class="font-[Manrope] text-xs text-[#363636]">76</div>
                <div class="font-[Manrope] text-xs text-[#363636]">80</div>
              </div>
              <div class="px-2 py-1.5 bg-[#F9F6EC] rounded-lg grid grid-cols-9 gap-4">
                <div class="col-span-3 font-[Manrope] text-xs text-[#211D1D] pl-2">Обхват бедер</div>
                <div class="font-[Manrope] text-xs text-[#363636]">88</div>
                <div class="font-[Manrope] text-xs text-[#363636]">92</div>
                <div class="font-[Manrope] text-xs text-[#363636]">96</div>
                <div class="font-[Manrope] text-xs text-[#363636]">100</div>
                <div class="font-[Manrope] text-xs text-[#363636]">104</div>
                <div class="font-[Manrope] text-xs text-[#363636]">108</div>
              </div>
              <div class="px-2 py-1.5 bg-[#F9F6EC] rounded-lg grid grid-cols-9 gap-4">
                <div class="col-span-3 font-[Manrope] text-xs text-[#211D1D] pl-2">Рост</div>
                <div class="font-[Manrope] text-xs text-[#363636]">165</div>
                <div class="font-[Manrope] text-xs text-[#363636]">170</div>
                <div class="font-[Manrope] text-xs text-[#363636]">170</div>
                <div class="font-[Manrope] text-xs text-[#363636]">170</div>
                <div class="font-[Manrope] text-xs text-[#363636]">175</div>
                <div class="font-[Manrope] text-xs text-[#363636]">175</div>
              </div>
            </div>
          </div>
          <div class="border border-[#BBB8B6] rounded-lg flex flex-col p-4 gap-4">
            <div class="flex gap-1 flex-col">
              <h3 class="font-[Manrope] text-sm text-[#211D1D]">Обмеры изделия</h3>
              <span class="font-[Manrope] text-xs text-[#363636]"
                >Сравните обмеры аналогичных вещей из вашего гардероба, чтобы выбрать подходящую посадку</span
              >
            </div>
            <div class="flex flex-col gap-2">
              <span class="font-[Manrope] text-xs text-[#363636]">Размер S:</span>
              <span class="font-[Manrope] text-xs text-[#363636]">Размер M:</span>
              <span class="font-[Manrope] text-xs text-[#363636]">Размер L:</span>
            </div>
          </div>
        </div>
      </div>
    </AppPopup>
  </main>
</template>

<style scoped></style>
