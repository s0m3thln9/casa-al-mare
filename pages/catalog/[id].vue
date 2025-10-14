<script setup lang="ts">
import type { Item } from "~/stores/catalog"

const route = useRoute()
const segment = route.params.id
const catalogStore = useCatalogStore()
const popupStore = usePopupStore()
const itemStore = useItemStore()
const setStore = useSetStore()

const isLoading = ref(true)
const error = ref<string | null>(null)
const item = ref<Item | null>(null)

onMounted(async () => {
	try {
		isLoading.value = true
		error.value = null
		
		if (catalogStore.items.length === 0) {
			await catalogStore.loadItems()
		}
		
		const id = Number(segment)
		if (isNaN(id)) {
			throw new Error("Неверный ID товара")
		}
		
		item.value = catalogStore.items.find((i) => i.id === id) || null
		if (!item.value) {
			throw new Error("Товар не найден")
		}
	} catch (err) {
		console.error("Ошибка загрузки страницы товара:", err)
		error.value = err instanceof Error ? err.message : "Неизвестная ошибка"
	} finally {
		isLoading.value = false
	}
})

const breadcrumsItems = computed(() => {
	if (isLoading.value) {
		return [{ name: "Главная", path: "/" }, { name: "Смотреть все", path: "/catalog" }, { name: "Название" }]
	}
	return [
		{ name: "Главная", path: "/" },
		{ name: "Смотреть все", path: "/catalog" },
		{ name: item.value?.name || "Товар не найден" },
	]
})

const tabSections = computed(() => {
	return item.value?.content?.filter((c: { header: string }) => ['Описание', 'Состав и уход', 'Определить размер', 'Доставка и возврат'].includes(c.header)) || []
})

const getPopupId = (header: string): string => {
	const mapping: Record<string, string> = {
		'Состав и уход': 'composition',
		'Определить размер': 'size',
		'Доставка и возврат': 'delivery',
		'Описание': 'description'
	}
	return mapping[header] || header.toLowerCase().replace(/\s+/g, '-').replace(/ё/g, 'e').replace(/[^a-z0-9-]/g, '')
}

const relatedItemsIds = computed(() => item.value?.withItems?.map((id: string) => Number(id)) || [])
const complexItemsIds = computed(() => item.value?.complex?.map((id: string) => Number(id)) || [])

const currentImageIndex = ref(0)
const touchStartX = ref(0)

const setItems = computed(() => {
	const items: { id: number; vector: string }[] = []
	
	if (catalogStore.items.length === 0) return items
	
	const currentColor = currentColorCode.value
	
	if (setStore.top && setStore.top.trim() !== '') {
		const topId = setStore.topId || complexItemsIds.value[0] || 31
		const topItem = catalogStore.getItemById(topId)
		if (topItem) {
			const availableColors = Object.keys(topItem.colors)
			const colorCode = availableColors.includes(currentColor) ? currentColor : availableColors[0] || ""
			items.push({
				id: topItem.id,
				vector: `${colorCode}_${setStore.top}`,
			})
		}
	}
	
	if (setStore.bottom && setStore.bottom.trim() !== '') {
		const bottomId = setStore.bottomId || complexItemsIds.value[1] || 32
		const bottomItem = catalogStore.getItemById(bottomId)
		if (bottomItem) {
			const availableColors = Object.keys(bottomItem.colors)
			const colorCode = availableColors.includes(currentColor) ? currentColor : availableColors[0] || ""
			items.push({
				id: bottomItem.id,
				vector: `${colorCode}_${setStore.bottom}`,
			})
		}
	}
	
	if (setStore.accessory && setStore.accessory.trim() !== '') {
		const accessoryId = setStore.accessoryId || complexItemsIds.value[2] || 33
		const accessoryItem = catalogStore.getItemById(accessoryId)
		if (accessoryItem) {
			const availableColors = Object.keys(accessoryItem.colors)
			const colorCode = availableColors.includes(currentColor) ? currentColor : availableColors[0] || ""
			items.push({
				id: accessoryItem.id,
				vector: `${colorCode}_${setStore.accessory}`,
			})
		}
	}
	
	return items
})

const setMissingParams = computed<"top" | "bottom" | "accessory" | "all" | null>(() => {
	if (setStore.canAddToCart) return null
	const missing: string[] = []
	if (!setStore.top || setStore.top.trim() === '') missing.push('top')
	if (!setStore.bottom || setStore.bottom.trim() === '') missing.push('bottom')
	if (!setStore.accessory || setStore.accessory.trim() === '') missing.push('accessory')
	if (missing.length === 3) return "all"
	return missing[0] as "top" | "bottom" | "accessory"
})

const currentColorCode = computed(() => itemStore.color?.code || (item.value ? Object.keys(item.value.colors)[0] : ""))
const currentColorName = computed(() => itemStore.color?.name || "")
const currentSize = computed(() => itemStore.size || item.value?.sizes[0] || "")
const currentColorImages = computed(() => {
	if (!item.value || !currentColorCode.value) return []
	const colorData = item.value.colors[currentColorCode.value]
	if (!colorData) return []
	return colorData.images.map((id) => item.value.images[id]).filter(Boolean) || []
})
const currentVectorData = computed(() => {
	if (!item.value || !currentColorCode.value || !currentSize.value) return null
	const vectorKey = `${currentColorCode.value}_${currentSize.value}`
	return item.value.vector[vectorKey] || null
})
const currentPrice = computed(() => currentVectorData.value?.price || 0)
const currentOldPrice = computed(() => currentVectorData.value?.oldPrice || 0)
const canAddToCart = computed(() => !!(itemStore.color && itemStore.size))

const missingParams = computed<"color" | "size" | "both" | null>(() => {
	if (canAddToCart.value) return null
	const hasColor = !!itemStore.color
	const hasSize = !!itemStore.size
	if (!hasColor && !hasSize) return "both"
	if (!hasColor) return "color"
	return "size"
})

const imageStyles = computed(() => (index: number) => {
	const len = currentColorImages.value.length
	if (len === 0 || index >= len) return { opacity: 0, visibility: "hidden" }
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
	if (len === 0) return
	if (deltaX > threshold) {
		currentImageIndex.value = (currentImageIndex.value - 1 + len) % len
	} else if (deltaX < -threshold) {
		currentImageIndex.value = (currentImageIndex.value + 1) % len
	}
}

const calculateDiscount = (price: number, oldPrice: number): number => {
	if (!oldPrice || oldPrice <= price) return 0
	return Math.round(((oldPrice - price) / oldPrice) * 100)
}

const discount = computed(() => calculateDiscount(currentPrice.value, currentOldPrice.value))

const priceFormatter = (value: number): string => {
	if (value === 0 || isNaN(value)) return "Цена не указана"
	const formattedValue = new Intl.NumberFormat("ru-RU").format(value)
	return `${formattedValue} ₽`
}

watch(
	item,
	(newItem) => {
		if (newItem && !itemStore.color) {
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
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] w-full">
    <div
	    v-if="error"
	    class="p-4 text-center text-red-500"
    >
      {{ error }}
    </div>

    <div
	    v-if="isLoading"
	    class="p-2 sm:px-4 sm:py-6"
    >
      <AppBreadcrumbs :items="breadcrumsItems" />

      <div
	      class="px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[4fr_1fr] xl:grid-cols-[3fr_1fr] w-full gap-8 sm:px-4"
      >
        <div class="block sm:hidden">
          <div class="relative w-full aspect-[460/680] overflow-hidden bg-[#F9F6EC]">
          </div>
          <div class="flex justify-center items-center gap-1 px-4 mt-2">
            <div class="flex-1 border-y border-[#A6CEFF]" />
            <div class="flex-1 border-y border-[#A6CEFF]" />
          </div>
        </div>
        <div class="hidden sm:grid grid-cols-1 gap-2 lg:grid-cols-2">
          <div class="aspect-[726/1080] bg-[#F9F6EC] rounded-lg" />
          <div class="aspect-[726/1080] bg-[#F9F6EC] rounded-lg" />
        </div>

        <div class="px-2 flex flex-col sm:px-0 sm:sticky sm:top-0 sm:h-screen sm:overflow-y-auto">
          <div class="flex justify-center items-center">
            <h2 class="font-[Inter] text-center text-[32px] sm:text-4xl">Название</h2>
          </div>
          <div class="flex justify-center items-center gap-2 mt-4 sm:mt-6">
            <span
	            class="font-[Inter] font-light text-[17px] text-[#8C8785] sm:font-[Manrope] sm:font-normal sm:text-base sm:text-[#211D1D]"
            >
              Цена
            </span>
            <span
	            class="font-[Inter] line-through font-light text-[17px] text-[#8C8785] sm:font-[Manrope] sm:font-normal sm:text-base sm:text-[#211D1D]"
            >
              Старая цена
            </span>
          </div>
          <div class="flex justify-center items-center mt-1 sm:mt-2">
            <span class="font-light text-xs">Скидка 0%</span>
          </div>
          <div class="flex flex-col justify-center items-center gap-6 mt-14">
            <div class="flex justify-center items-center gap-4">
              <div>Цвет</div>
            </div>
            <span class="text-xs">Цвет</span>
          </div>
          <div class="flex flex-col justify-center items-center gap-4 mt-12 sm:mt-10">
            <div class="flex justify-center items-center gap-3 font-light sm:gap-4 sm:font-normal">
              <div>Размер</div>
            </div>
            <span class="text-xs">Размер</span>
          </div>
          <div class="flex flex-col justify-center items-center gap-1 mt-12 sm:mt-10">
            <span class="font-light text-xs">На модели размер: S</span>
            <span class="text-[11px] text-[#363636]">Параметры модели: 175 80/60/89</span>
          </div>
          <div class="flex flex-col justify-center items-stretch gap-4 mt-6">
            <div>Кнопка купить</div>
            <div>Собрать комплект</div>
          </div>
          <div class="flex justify-center items-center mt-4 sm:mt-6">
            <div>В избранное</div>
          </div>
          <div class="mt-14 flex flex-col justify-center items-center gap-3 p-4 rounded-2xl border border-[#BBB8B6]">
            <div class="flex justify-center gap-2.5 items-center w-full sm:justify-between cursor-pointer sm:gap-0">
              <span class="font-light text-sm">Состав и уход</span>
              <div>?</div>
            </div>
            <div class="w-full h-[1px] bg-[#BBB8B6]" />
            <div class="flex justify-center gap-2.5 items-center w-full sm:justify-between cursor-pointer sm:gap-0">
              <span class="font-light text-sm">Определить размер</span>
              <div>?</div>
            </div>
            <div class="w-full h-[1px] bg-[#BBB8B6]" />
            <div class="flex justify-center gap-2.5 items-center w-full sm:justify-between cursor-pointer sm:gap-0">
              <span class="font-light text-sm">Доставка и возврат</span>
              <div>?</div>
            </div>
            <div class="w-full h-[1px] bg-[#BBB8B6]" />
            <div class="flex justify-center gap-2.5 items-center w-full sm:justify-between cursor-pointer sm:gap-0">
              <span class="font-light text-sm">Подписаться на рассылку</span>
              <div>@</div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-2 flex flex-col justify-center items-start gap-4 mt-18 sm:items-center sm:gap-12 sm:mt-24">
        <h2 class="font-[Manrope] text-[15px] font-light sm:font-[Inter] sm:text-4xl sm:font-normal">
          Вам может понравиться
        </h2>
        <div class="w-full grid gap-2 grid-cols-3 sm:gap-4 sm:px-[15%]">
          <div>Карточка 1</div>
          <div>Карточка 2</div>
          <div>Карточка 3</div>
        </div>
      </div>
    </div>

    <div
	    v-else
	    class="p-2 sm:px-4 sm:py-6"
    >
      <AppBreadcrumbs :items="breadcrumsItems" />
    </div>
    <div
	    v-if="!isLoading"
	    class="px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[4fr_1fr] xl:grid-cols-[3fr_1fr] w-full gap-8 sm:px-4"
    >
      <div
	      v-if="currentColorImages.length > 0"
	      class="block sm:hidden"
      >
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
	          :missing-params="missingParams"
          />
          <AppButton
	          variant="secondary"
	          content="Собрать комплект"
	          custom-class="w-full py-4"
	          @click="popupStore.open('set')"
          />
        </div>
        <div class="flex justify-center items-center mt-4 sm:mt-6">
          <WishlistButton :item-id="item?.id" />
        </div>
        <div class="mt-14 flex flex-col justify-center items-center gap-3 p-4 rounded-2xl border border-[#BBB8B6]">
          <template
	          v-for="(section, index) in tabSections"
	          :key="section.header"
          >
            <div
	            class="flex justify-center gap-2.5 items-center w-full sm:justify-between cursor-pointer sm:gap-0"
	            @click="popupStore.open(getPopupId(section.header))"
            >
              <span class="font-light text-sm">{{ section.header }}</span>
              <NuxtImg
	              src="/help.svg"
	              alt="help"
	              width="16"
	              height="16"
              />
            </div>
            <div v-if="index < tabSections.length - 1" class="w-full h-[1px] bg-[#BBB8B6]" />
          </template>
          <div v-if="tabSections.length > 0" class="w-full h-[1px] bg-[#BBB8B6]" />
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
    <div
	    v-if="!isLoading"
	    class="px-2 flex flex-col justify-center items-start gap-4 mt-18 sm:items-center sm:gap-12 sm:mt-24"
    >
      <h2 class="font-[Manrope] text-[15px] font-light sm:font-[Inter] sm:text-4xl sm:font-normal">
        Вам может понравится
      </h2>
      <div v-if="catalogStore.items.length > 0" class="w-full grid gap-2 grid-cols-3 sm:gap-4 sm:px-[15%]">
        <CatalogCard
	        v-for="id in relatedItemsIds"
	        :id="id"
	        :key="id"
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
	            v-if="catalogStore.items.length > 0"
	            :key="currentColorCode"
	            :id="complexItemsIds[0] || 37"
	            v-model="setStore.top"
	            :current-color-code="currentColorCode"
	            custom-image-class="aspect-[200/300] w-full"
	            popup
	            variant="mini"
	            link
            />
            <div
	            v-else
	            class="aspect-[200/300] w-full bg-[#F9F6EC]"
            />
          </div>
          <div class="flex flex-col gap-2">
            <span class="font-[Manrope] text-sm">Низ</span>
            <CatalogCard
	            v-if="catalogStore.items.length > 0"
	            :key="currentColorCode"
	            :id="complexItemsIds[1] || 37"
	            v-model="setStore.bottom"
	            :current-color-code="currentColorCode"
	            custom-image-class="aspect-[200/300] w-full"
	            popup
	            variant="mini"
	            link
            />
            <div
	            v-else
	            class="aspect-[200/300] w-full bg-[#F9F6EC]"
            />
          </div>
          <div class="flex flex-col gap-2">
            <span class="font-[Manrope] text-sm">Аксессуар</span>
            <CatalogCard
	            v-if="catalogStore.items.length > 0"
	            :key="currentColorCode"
	            :id="complexItemsIds[2] || 37"
	            v-model="setStore.accessory"
	            :current-color-code="currentColorCode"
	            custom-image-class="aspect-[200/300] w-full"
	            popup
	            variant="mini"
	            link
            />
            <div
	            v-else
	            class="aspect-[200/300] w-full bg-[#F9F6EC]"
            />
          </div>
        </div>
        <BuyButton
	        :items="setItems"
	        available-quantity
	        in-stock
	        :is-parameters-selected="setStore.canAddToCart"
	        :missing-params="setMissingParams"
        />
      </div>
    </AppPopup>
    <template
	    v-for="section in tabSections"
	    :key="section.header"
    >
      <AppPopup
	      :title="section.header"
	      :popup-id="getPopupId(section.header)"
      >
        <div class="mt-6 flex flex-col gap-6">
          <div
	          v-for="(contentItem, cIndex) in section.content"
	          :key="cIndex"
	          class="prose prose-sm max-w-none"
	          v-html="contentItem"
          />
        </div>
      </AppPopup>
    </template>
    <AppPopup
	    title="Подписаться на рассылку"
	    popup-id="subscription"
    >
      <div class="mt-6 flex flex-col gap-6">
        <div class="p-4 border border-[#BBB8B6] rounded-2xl flex flex-col gap-4">
          <h3 class="font-[Manrope] text-sm text-[#211D1D]">Подписка на рассылку</h3>
          <span class="font-[Manrope] text-xs text-[#363636]">
            Подпишитесь, чтобы получать новости о новинках, акциях и эксклюзивных предложениях.
          </span>
          <div class="flex flex-col gap-2">
            <input
	            type="email"
	            placeholder="Ваш email"
	            class="p-2 border border-[#BBB8B6] rounded-lg text-xs"
            />
            <AppButton content="Подписаться" custom-class="w-full" />
          </div>
        </div>
      </div>
    </AppPopup>
  </main>
</template>

<style scoped></style>