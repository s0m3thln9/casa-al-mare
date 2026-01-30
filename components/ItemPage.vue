<script setup lang="ts">
import { computed } from "vue"
import type { Item } from "~/stores/catalog"

const route = useRoute()
const alias = computed(() => {
  const param = route.params.alias
  let result = ''
  if (Array.isArray(param)) {
    result = param.join('/') || ''
  } else {
    result = param || ''
  }
  return result.endsWith('/') ? result.slice(0, -1) : result
})
const catalogStore = useCatalogStore()
const popupStore = usePopupStore()
const itemStore = useItemStore()
// const setStore = useSetStore()

const isLoading = ref(true)
const error = ref<string | null>(null)
const item = ref<Item | null>(null)

const isHtml = (str: string) => {
  return /<\/?[a-z][\s\S]*>/i.test(str)
}

const loadItem = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    if (catalogStore.items.length === 0) {
      await catalogStore.loadItems()
    }
    
    let foundItem: Item | null = null
    console.log(alias.value)
    if (alias.value && alias.value.trim() !== "") {
      foundItem = catalogStore.items.find((i) => i.alias === alias.value) || null
      
      if (foundItem) {
        // Установка цвета в стор
        if (foundItem.colorVal && foundItem.colorName) {
          itemStore.color = {
            code: foundItem.colorVal,
            name: foundItem.colorName,
            value: foundItem.colorVal,
          }
        }
      } else {
        error.value = "Товар не найден. Проверьте адресную строку."
        item.value = null
        return
      }
    } else {
      // Оставляем поиск по ID как запасной вариант из параметров пути
      const idFromParams = route.params.id
      if (typeof idFromParams === "string" && !isNaN(Number(idFromParams))) {
        foundItem = catalogStore.getItemById(Number(idFromParams)) || null
      }
    }
    
    if (!foundItem) {
      error.value = "Товар не найден."
      return
    }
    
    item.value = foundItem
    
    const sizeFromQuery = route.query.size as string
    if (sizeFromQuery && foundItem.sizes?.includes(sizeFromQuery)) {
      await nextTick()
      itemStore.size = sizeFromQuery
    }
  } catch (err) {
    console.error("Ошибка:", err)
    error.value = "Произошла ошибка при загрузке данных."
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadItem()
})

const availableColors = computed(() => {
  if (!item.value || !item.value.parent) return []
  const parentId = item.value.parent
  const allColorItems = catalogStore.items.filter((otherItem) => otherItem.parent === parentId)
  const uniqueColors = allColorItems
    .map((colorItem) => ({
      alias: colorItem.alias,
      colorVal: colorItem.colorVal,
      colorName: colorItem.colorName,
      art: colorItem.colorArt,
    }))
    .filter((c1, idx, arr) => arr.findIndex((c2) => c2.colorVal === c1.colorVal) === idx)
  return uniqueColors.sort((a, b) => a.colorName.localeCompare(b.colorName))
})

const sortedShapes = computed(() => {
  if (!item.value?.complex || item.value.complex.length === 0) return []
  
  const allShapes = [...item.value.complex]
  
  if (item.value.parents[2]) {
    const currentShapeInComplex = allShapes.find((s) => s.id === item.value?.parents[2].id)
    if (!currentShapeInComplex) {
      allShapes.push({
        id: item.value.parents[2].id,
        name: item.value.parents[2].name,
        link: item.value.link,
        image: item.value.parents[2].image,
        activeImage: item.value.parents[2].activeImage,
      })
    }
  }
  
  return allShapes.sort((a, b) => a.id - b.id)
})

const breadcrumsItems = computed(() => {
  if (isLoading.value) {
    return [{ name: "Главная", path: "/" }, { name: "Смотреть все", path: "/catalog" }, { name: "Загрузка..." }]
  }
  return [
    { name: "Главная", path: "/" },
    { name: "Смотреть все", path: "/catalog" },
    { name: item.value?.name || "Товар" },
  ]
})

const tabSections = computed(() => {
  return item.value?.content || []
})

const getPopupId = (header: string): string => {
  const mapping: Record<string, string> = {
    Состав: "composition",
    "Определить размер": "size",
    "Доставка и оплата": "delivery",
    "Возврат и обмен": "trans",
    Описание: "description",
  }
  return (
    mapping[header] ||
    header
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/ё/g, "e")
      .replace(/[^a-z0-9-]/g, "")
  )
}

const relatedItemsIds = computed(() => {
  const currentId = item.value?.id
  const allIds = catalogStore.items.filter((i) => i.id !== currentId).map((i) => i.id)
  const shuffled = [...allIds].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 3)
})

// const setItemsIds = computed(() => item.value?.set?.map((item) => item.id) || [])
// const hasSetItems = computed(() => setItemsIds.value.length > 0)

const currentImageIndex = ref(0)
const touchStartX = ref(0)
const touchStartY = ref(0)
const isHorizontalSwipe = ref(false)
const isTransitioning = ref(false)

// const setItems = computed(() => {
//   const result: { id: number; size: string }[] = []
//
//   if (catalogStore.items.length === 0 || !hasSetItems.value) return result
//
//   item.value?.set?.forEach((setItem) => {
//     const itemType = setItem.type
//     const size = setStore.items[itemType]
//     const itemId = setStore.itemsIds[itemType] || setItem.id
//
//     if (size && size.trim() !== "") {
//       const catalogItem = catalogStore.getItemById(itemId)
//       if (catalogItem) {
//         result.push({
//           id: catalogItem.id,
//           size: size,
//         })
//       }
//     }
//   })
//
//   return result
// })

// const setMissingParams = computed<string | "all" | null>(() => {
//   if (setStore.canAddToCart) return null
//
//   const allTypes = item.value?.set?.map((s) => s.type) || []
//   const missing: string[] = []
//
//   allTypes.forEach((type) => {
//     if (!setStore.items[type] || setStore.items[type].trim() === "") {
//       missing.push(type)
//     }
//   })
//
//   if (missing.length === allTypes.length) return "all"
//   return missing.length > 0 ? missing[0] : null
// })

// const setButtonText = computed(() => {
//   if (!hasSetItems.value) return "Собрать комплект"
//
//   const types = item.value?.set?.map((s) => s.type) || []
//
//   if (types.length === 0) return "Собрать комплект"
//   if (types.length === 1) return `Добавить ${types[0].toLowerCase()}`
//   if (types.length === 2) return `Собрать комплект (${types.length} товара)`
//
//   return `Собрать комплект (${types.length} товара)`
// })

const isNoSizeItem = computed(() => {
  return Object.keys(item.value?.vector)[0] === 'NS'
})

const isNoSizeItemParams = computed(() => {
  return item.value?.template
    !== 4
})

const canAddToCart = computed(() => isNoSizeItem.value || !!itemStore.size)

const missingParams = computed<"size" | null>(() => {
  if (canAddToCart.value) return null
  return "size"
})

const currentSize = computed(() => {
  if (isNoSizeItem.value) return ""
  return itemStore.size || item.value?.sizes?.[0] || ""
})

const currentColorCode = computed(() => item.value?.colorVal || "")
const currentColorName = computed(() => item.value?.colorName || "")
const currentColorImages = computed(() => {
  if (!item.value?.images) return []
  return Object.values(item.value.images || {})
})

const currentPrice = computed(() => parseInt(item.value?.price || "0"))
const currentOldPrice = computed(() => parseInt(item.value?.oldPrice || "0"))

const numBars = computed(() => Math.max(currentColorImages.value.length, 1))

watch(currentColorImages, () => {
  currentImageIndex.value = 0
})

const imageStyles = computed(() => (index: number) => {
  const len = currentColorImages.value.length
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

const barStyles = computed(() => (index: number) => {
  const len = currentColorImages.value.length
  const currentIdx = len === 0 ? 0 : currentImageIndex.value
  return {
    opacity: index === currentIdx ? 1 : 0.3,
    transition: "opacity 400ms ease-in-out",
  }
})

const handleTouchStart = (e: TouchEvent) => {
  const len = currentColorImages.value.length
  if (len <= 1 || isTransitioning.value) return
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isHorizontalSwipe.value = false
}

const handleTouchMove = (e: TouchEvent) => {
  const len = currentColorImages.value.length
  if (len <= 1 || isTransitioning.value || !touchStartX.value || !touchStartY.value) return
  
  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY
  const deltaX = Math.abs(currentX - touchStartX.value)
  const deltaY = Math.abs(currentY - touchStartY.value)
  
  const directionThreshold = 10
  
  if (deltaX > directionThreshold || deltaY > directionThreshold) {
    if (isHorizontalSwipe.value) {
      e.preventDefault()
      return
    }
    
    if (deltaX > deltaY * 1.5 && deltaX > directionThreshold) {
      isHorizontalSwipe.value = true
      e.preventDefault()
    } else if (deltaY > deltaX) {
      return
    }
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  const len = currentColorImages.value.length
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

const needsBorder = (color: { art?: string }) => {
  const art = color.art?.toUpperCase()
  return art === "WH" || art === "BW" || art === "RW"
}

watch(
  item,
  (newItem) => {
    if (newItem) {
      if (newItem.colorVal && newItem.colorName) {
        itemStore.color = {
          code: newItem.colorVal,
          name: newItem.colorName,
          value: newItem.colorVal,
          art: newItem.colorArt,
        }
      }
      if (newItem.sizes?.[0]) {
        itemStore.size = newItem.sizes[0]
      }
      
      // if (newItem.set && newItem.set.length > 0) {
      //   const types = newItem.set.map((s) => s.type)
      //   setStore.setRequiredTypes(types)
      // } else {
      //   setStore.setRequiredTypes([])
      // }
    }
  },
  { immediate: true },
)

// Следим за изменением пропса alias
watch(
  () => alias.value,
  async (newAlias) => {
    if (newAlias) {
      itemStore.color = null
      itemStore.size = null
      await loadItem()
      
      if (!error.value) {
        scrollToTop()
      }
    }
  }
)

const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}

const { data: treeData } = await useFetch(
  "https://back.casaalmare.com/api/getdocTree"
)


const doc = computed(() => {
  const slugValue = alias.value
  if (!slugValue || !treeData.value?.data) return null
  
  // Ищем документ по slug во всех ветках
  const findDoc = (obj: any): any => {
    if (!obj) return null
    
    for (const key in obj) {
      const item = obj[key]
      if (item && typeof item === 'object') {
        if (item.alias === slugValue) return item
        if (item.subitems) {
          const found = findDoc(item.subitems)
          if (found) return found
        }
      }
    }
    return null
  }
  
  return findDoc(treeData.value.data)
})

const pageTitle = computed(() => doc.value?.pagetitle ?? "")
const description = computed(() => doc.value?.description ?? "")

const metaTags = computed(() => {
  const tags: Record<string, any> = {}
  
  doc.value?.metatags?.forEach(tag => {
    if (tag.name.startsWith('og:')) {
      const ogKey = tag.name.replace('og:', '')
      const camelCaseKey = 'og' + ogKey.charAt(0).toUpperCase() + ogKey.slice(1)
      tags[camelCaseKey] = tag.content
    } else if (tag.name.startsWith('twitter:')) {
      const twitterKey = tag.name.replace('twitter:', '')
      const camelCaseKey = 'twitter' + twitterKey.charAt(0).toUpperCase() + twitterKey.slice(1)
      tags[camelCaseKey] = tag.content
    } else {
      tags[tag.name] = tag.content
    }
  })
  
  return tags
})

const updateSeo = () => {
  useSeoMeta({
    title: pageTitle.value,
    description: description.value,
    ...metaTags.value
  })
}

updateSeo()

watch(doc, () => {
  updateSeo()
}, { immediate: true })


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
      v-if="isLoading || !item"
      class="p-2 sm:px-4 sm:py-6"
    >
      <AppBreadcrumbs :items="breadcrumsItems" />

      <div
        class="px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[4fr_1fr] xl:grid-cols-[3fr_1fr] w-full gap-8 sm:px-4"
      >
        <div class="block sm:hidden">
          <div class="relative w-full aspect-[460/680] overflow-hidden bg-[#F9F6EC]" />
          <div class="flex justify-center items-center gap-1 px-4 mt-2">
            <div class="flex-1 border-y border-[#A6CEFF]" />
            <div class="flex-1 border-y border-[#A6CEFF]" />
          </div>
        </div>
        <div class="hidden sm:grid grid-cols-1 gap-2 lg:grid-cols-2">
          <div class="aspect-[726/1080] bg-[#F9F6EC] rounded-2xl" />
          <div class="aspect-[726/1080] bg-[#F9F6EC] rounded-2xl" />
        </div>

        <div class="px-2 flex flex-col sm:px-0 sm:sticky sm:top-0 sm:h-screen sm:overflow-y-auto">
          <div class="flex justify-center items-center">
            <h2 class="font-[Inter] text-center text-[32px] sm:text-4xl">Название</h2>
          </div>
          <div class="flex justify-center items-center gap-2 mt-4 sm:mt-6">
            <span
              class="font-[Inter] font-light text-[17px] text-[#8C8785] sm:font-[Manrope] sm:font-normal sm:text-base sm:text-[#211D1D]"
            >Цена</span
            >
            <span
              class="font-[Inter] line-through font-light text-[17px] text-[#8C8785] sm:font-[Manrope] sm:font-normal sm:text-base sm:text-[#211D1D]"
            >Старая цена</span
            >
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
            <!--            <div>Собрать комплект</div>-->
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
      <div class="block sm:hidden">
        <div
          class="relative w-full aspect-[460/680] overflow-hidden"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <template v-if="currentColorImages.length > 0">
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
              >
            </NuxtImg>
          </template>
          <template v-else>
            <div
              class="w-full h-full aspect-[460/680] bg-[#F9F6EC]"
              :style="imageStyles(0)"
            />
          </template>
        </div>
        <div class="flex justify-center items-center gap-1 px-4 mt-2">
          <div
            v-for="(_, index) in numBars"
            :key="index"
            class="flex-1 border-y border-[#A6CEFF]"
            :style="barStyles(index)"
          />
        </div>
      </div>
       <div
         v-if="item"
         class="hidden sm:grid grid-cols-1 gap-2 lg:grid-cols-2"
       >
        <template v-if="currentColorImages.length > 0">
          <div
            v-for="(img, index) in currentColorImages"
            :key="index"
            class="relative w-full rounded-2xl overflow-hidden bg-[#F9F6EC]"
            style="aspect-ratio: 726/1080;"
          >
            <NuxtImg
              v-slot="{ src, isLoaded, imgAttrs }"
              :src="img"
              :custom="true"
              class="absolute inset-0 w-full h-full"
            >
              <div
                v-if="!isLoaded"
                class="w-full h-full bg-[#F9F6EC]"
              />
              <img
                v-else
                v-bind="imgAttrs"
                :src="src"
                class="w-full h-full object-cover"
                alt="item"
              >
            </NuxtImg>
          </div>
        </template>
        <template v-else>
          <div
            class="w-full bg-[#F9F6EC] rounded-2xl"
            style="aspect-ratio: 726/1080;"
          />
        </template>
      </div>
      <div
        v-if="item"
        class="px-2 flex flex-col sm:px-0 sm:sticky sm:top-20 sm:h-screen sm:overflow-y-auto"
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
        <div class="flex flex-col justify-center items-center gap-2 mt-14">
          <div class="flex justify-center items-center gap-4">
            <div class="flex gap-4 flex-wrap">
              <NuxtLink
                v-for="colorItem in availableColors"
                :key="colorItem.alias"
                :to="`/product/${colorItem.alias}`"
                class="flex flex-col justify-center gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div
                  :class="[
                    'w-6 h-6 rounded-lg',
                    colorItem.colorVal === currentColorCode && 'border-2 border-[#211D1D]',
                    colorItem.colorVal !== currentColorCode &&
                      needsBorder(colorItem) &&
                      'border-1 border-[#211D1D] hover:border-1 hover:border-[#211D1D]',
                  ]"
                  :style="{ background: colorItem.colorVal }"
                />
              </NuxtLink>
            </div>
          </div>
          <span class="text-xs font-[Manrope] text-center">{{ currentColorName }}</span>
        </div>
        <div
          v-if="!isNoSizeItem"
          class="flex flex-col justify-center items-center gap-4 mt-12 sm:mt-10">
          <div class="flex justify-center items-center gap-3 font-light sm:gap-4 sm:font-normal">
            <SingleSelectButton
              v-if="(item.sizes || []).length > 0"
              v-model="itemStore.size"
              :content="item.sizes || []"
            />
            <span
              v-else
              class="text-xs text-gray-500"
            >Размеры не указаны</span
            >
          </div>
        </div>
        <div
          v-if="sortedShapes.length > 0"
          class="flex flex-col justify-center items-center gap-6 mt-12 sm:mt-10"
        >
          <div class="flex justify-center items-center gap-4">
            <div class="flex gap-4 flex-wrap">
              <NuxtLink
                v-for="shapeItem in sortedShapes"
                :key="shapeItem.id"
                :to="item?.parents[2]?.id !== shapeItem.id ? shapeItem.link : ''"
                class="flex flex-col justify-center gap-2 items-center cursor-pointer"
              >
                <div class="w-[52px] h-[52px] flex items-center justify-center">
                  <img
                    :src="item?.parents[2]?.id === shapeItem.id ? shapeItem.activeImage : shapeItem.image"
                    :alt="shapeItem.name"
                    class="w-full h-full object-contain"
                  >
                </div>
                <span class="text-xs font-[Manrope] text-center">{{ shapeItem.name }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
        <div
          v-if="!isNoSizeItemParams"
          class="flex flex-col justify-center items-center gap-1 mt-12 sm:mt-10">
          <span class="font-light text-xs">На модели размер:
                                           {{item.sizes ? item.sizes[0] : 0
                                           }}</span>
          <span class="text-[11px] text-[#363636]">Параметры модели: 178 88/59/90</span>
        </div>
        <div class="flex flex-col justify-center items-stretch gap-4 mt-6">
          <BuyButton
            :id="item.id"
            :size="currentSize"
            :in-stock="isNoSizeItem ?
            (Object.keys(item.vector)[0].quantity ===
             0 && Object.keys(item.vector)[0].comingSoon >
             0) || Object.keys(item.vector)[0].quantity >
             0 :
            (item.vector[currentSize].quantity === 0 &&
            item.vector[currentSize].comingSoon > 0) ||
            item.vector[currentSize].quantity >
             0 "
            :available-quantity="isNoSizeItem ?
            Object.keys(item.vector)[0].quantity >
             0 :
            item.vector[currentSize].quantity > 0"
            :is-parameters-selected="canAddToCart"
            :missing-params="missingParams"
          />
          <!--          <AppButton-->
          <!--            v-if="hasSetItems"-->
          <!--            variant="secondary"-->
          <!--            :content="setButtonText"-->
          <!--            custom-class="w-full py-4"-->
          <!--            @click="popupStore.open('set')"-->
          <!--          />-->
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
              <div class="icon-help w-4 h-4 shrink-0" />
            </div>
            <div
              v-if="index < tabSections.length - 1"
              class="w-full h-[1px] bg-[#BBB8B6]"
            />
          </template>
<!--          <div-->
<!--            v-if="tabSections.length > 0"-->
<!--            class="w-full h-[1px] bg-[#BBB8B6]"-->
<!--          />-->
<!--          <div-->
<!--            class="flex justify-center gap-2.5 items-center w-full sm:justify-between cursor-pointer sm:gap-0"-->
<!--            @click="popupStore.open('subscription')"-->
<!--          >-->
<!--            <span class="font-light text-sm">Подписаться на рассылку</span>-->
<!--            <div class="icon-mail w-4 h-4 shrink-0" />-->
<!--          </div>-->
        </div>
      </div>
    </div>
    <div
      v-if="!isLoading && relatedItemsIds.length > 0"
      class="px-2 flex flex-col justify-center items-start gap-4 mt-18 sm:items-center sm:gap-12 sm:mt-24"
    >
      <h2 class="font-[Manrope] text-[15px] font-light sm:font-[Inter] sm:text-4xl sm:font-normal">
        Вам может понравиться
      </h2>
      <div class="w-full grid gap-2 grid-cols-3 sm:gap-4 sm:px-[15%]">
        <CatalogCard
          v-for="id in relatedItemsIds"
          :id="id"
          :key="id"
          variant="large"
          link
        />
      </div>
    </div>
    <!--    <AppPopup-->
    <!--      v-if="hasSetItems"-->
    <!--      title="Собрать комплект"-->
    <!--      popup-id="set"-->
    <!--    >-->
    <!--      <div class="flex flex-col gap-6 mt-6">-->
    <!--        <div class="grid grid-cols-2 gap-y-6 gap-x-4 sm:gap-x-2">-->
    <!--          <div-->
    <!--            v-for="setItem in item?.set"-->
    <!--            :key="setItem.id"-->
    <!--            class="flex flex-col gap-2"-->
    <!--          >-->
    <!--            <span class="font-[Manrope] text-sm">{{ setItem.type }}</span>-->
    <!--            <CatalogCard-->
    <!--              v-if="catalogStore.items.length > 0"-->
    <!--              :id="setItem.id"-->
    <!--              :key="`${currentColorCode}-${setItem.type}`"-->
    <!--              :model-value="setStore.items[setItem.type]"-->
    <!--              :current-color-code="currentColorCode"-->
    <!--              custom-image-class="aspect-[200/300] w-full"-->
    <!--              popup-->
    <!--              variant="mini"-->
    <!--              link-->
    <!--              @update:model-value="(val) => setStore.setItem(setItem.type, val, setItem.id)"-->
    <!--            />-->
    <!--            <div-->
    <!--              v-else-->
    <!--              class="aspect-[200/300] w-full bg-[#F9F6EC]"-->
    <!--            />-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <BuyButton-->
    <!--          :items="setItems"-->
    <!--          available-quantity-->
    <!--          in-stock-->
    <!--          :is-parameters-selected="setStore.canAddToCart"-->
    <!--          :missing-params="setMissingParams"-->
    <!--        />-->
    <!--      </div>-->
    <!--    </AppPopup>-->
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
            v-for="(contentItem, cIndex) in [section.content]"
            :key="cIndex"
            class="prose prose-sm max-w-none custom-section-content"
          >
            <template v-if="isHtml(contentItem)">
              <div class="html-content-wrapper">
                <div v-html="contentItem" />
              </div>
            </template>
            <template v-else>
              <div class="p-4 border-[0.5px] sm:border-1 border-[#BBB8B6] rounded-2xl custom-text-content">
                {{ contentItem }}
              </div>
            </template>
          </div>
        </div>
      </AppPopup>
    </template>

<!--    <AppPopup-->
<!--      title="Подписаться на рассылку"-->
<!--      popup-id="subscription"-->
<!--    >-->
<!--      <div class="mt-6 flex flex-col gap-6">-->
<!--        <div class="p-4 border border-[#BBB8B6] rounded-2xl flex flex-col gap-4">-->
<!--          <h3 class="font-[Manrope] text-sm text-[#211D1D]">Подписка на рассылку</h3>-->
<!--          <span class="font-[Manrope] text-xs text-[#363636]">-->
<!--            Подпишитесь, чтобы получать новости о новинках, акциях и эксклюзивных предложениях.-->
<!--          </span>-->
<!--          <div class="flex flex-col gap-2">-->
<!--            <input-->
<!--              type="email"-->
<!--              placeholder="Ваш email"-->
<!--              class="p-2 border border-[#BBB8B6] rounded-lg text-xs"-->
<!--            >-->
<!--            <AppButton-->
<!--              content="Подписаться"-->
<!--              custom-class="w-full"-->
<!--            />-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </AppPopup>-->
  </main>
</template>

<style scoped>
.custom-section-content {
  font-family: "Manrope", sans-serif;
  line-height: 134%;
}

.custom-text-content {
  font-size: 12px;
  color: #363636;
  line-height: 134%;
  white-space: pre-wrap;
}

.html-content-wrapper :deep(p),
.html-content-wrapper :deep(h1),
.html-content-wrapper :deep(h2),
.html-content-wrapper :deep(h3),
.html-content-wrapper :deep(h4),
.html-content-wrapper :deep(h5),
.html-content-wrapper :deep(h6) {
  margin-bottom: 8px;
}

.html-content-wrapper :deep(p) {
  font-size: 12px;
  color: #363636;
}

.html-content-wrapper :deep(h1),
.html-content-wrapper :deep(h2),
.html-content-wrapper :deep(h3),
.html-content-wrapper :deep(h4),
.html-content-wrapper :deep(h5),
.html-content-wrapper :deep(h6) {
  font-size: 14px;
  color: #211d1d;
  font-weight: 500;
}

.html-content-wrapper :deep(p):last-child,
.html-content-wrapper :deep(h1):last-child,
.html-content-wrapper :deep(h2):last-child,
.html-content-wrapper :deep(h3):last-child,
.html-content-wrapper :deep(h4):last-child,
.html-content-wrapper :deep(h5):last-child,
.html-content-wrapper :deep(h6):last-child {
  margin-bottom: 0;
}

.html-content-wrapper :deep(div.block) {
  padding: 16px;
  border: 1px solid #bbb8b6;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.html-content-wrapper :deep(div.block):not(:last-child) {
  margin-bottom: 0;
}

.html-content-wrapper :deep(div.block):last-child {
  margin-bottom: 0;
}

.html-content-wrapper :deep(table) {
  font-size: 11px;
  border-collapse: collapse;
  width: 100%;
  overflow: hidden;
  padding-bottom: 16px;
}

.html-content-wrapper :deep(.roundtable) {
  border: 1px solid #bbb8b6;
  border-radius: 8px;
}

.html-content-wrapper :deep(thead tr) {
  position: relative;
  background: transparent;
}

.html-content-wrapper :deep(thead tr th) {
  padding: 2px 6px;
  vertical-align: top;
  text-align: center;
  font-weight: 400;
}

.html-content-wrapper :deep(thead tr th.cssth) {
  width: 30px;
}

.html-content-wrapper :deep(thead tr th:first-child) {
  padding-left: 8px;
  text-align: left;
}

.html-content-wrapper :deep(thead tr th:last-child) {
  padding-right: 24px;
}

.html-content-wrapper :deep(thead tr th) {
  border-bottom: 1px solid #8c8785;
  background-clip: padding-box;
}

.html-content-wrapper :deep(tbody tr) {
  position: relative;
  background: transparent;
}

.html-content-wrapper :deep(tbody tr td) {
  padding: 2px 8px;
  vertical-align: top;
  text-align: center;
  background-color: #f9f6ec;
  background-clip: padding-box;
  border-top: 2px solid #FFFFFA;
  border-bottom: 2px solid #FFFFFA;
}

.html-content-wrapper :deep(tbody tr td:nth-child(2)) {
  border-bottom-left-radius: 8px;
  border-top-left-radius: 8px;
  text-align: left;
}

.html-content-wrapper :deep(td.csstd) {
  opacity: 0;
  border: none;
  padding: 0;
}

.html-content-wrapper :deep(tr.csstr td) {
  opacity: 0;
  border: none;
  padding: 0;
}

.html-content-wrapper :deep(tbody tr td:nth-last-child(2)) {
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
}

.html-content-wrapper :deep(ol),
.html-content-wrapper :deep(ul) {
  font-size: 14px;
  color: #211d1d;
  margin-bottom: 8px;
  line-height: 134%;
}

.html-content-wrapper :deep(ol):last-child,
.html-content-wrapper :deep(ul):last-child {
  margin-bottom: 0;
}

.html-content-wrapper :deep(ol) {
  list-style: none;
  counter-reset: item;
}

.html-content-wrapper :deep(ul) {
  list-style-type: disc;
  list-style-position: inside;
}

.html-content-wrapper :deep(ol li),
.html-content-wrapper :deep(ul li) {
  margin-bottom: 4px;
  color: #211d1d;
  display: flex;
  align-items: flex-start;
}

.html-content-wrapper :deep(ol li) {
  counter-increment: item;
}

.html-content-wrapper :deep(ol li::before) {
  content: counter(item) ". ";
  color: #211d1d;
  font-weight: 300;
  flex-shrink: 0;
  margin-right: 4px;
  line-height: 134%;
}

.html-content-wrapper :deep(ul > li > ul) {
  padding-left: 16px;
  list-style-type: circle;
}

.html-content-wrapper :deep(ul > li > ul > li > ul) {
  padding-left: 32px;
  list-style-type: square;
}

@media screen and (max-width: 640px) {
  .html-content-wrapper :deep(div.block) {
    border: 0.5px solid #bbb8b6;
    margin-bottom: 8px;
  }
  
  .custom-text-content {
    border: 0.5px solid #bbb8b6;
  }
  
  .html-content-wrapper :deep(table) {
    padding: 8px 0 10px;
  }
  
  .html-content-wrapper :deep(h1),
  .html-content-wrapper :deep(h2),
  .html-content-wrapper :deep(h3),
  .html-content-wrapper :deep(h4),
  .html-content-wrapper :deep(h5),
  .html-content-wrapper :deep(h6) {
    margin-bottom: 4px;
  }
  
  .html-content-wrapper :deep(p) {
    margin-bottom: 4px;
  }
  
  .html-content-wrapper :deep(tbody tr:first-child)::before {
    top: 8px;
  }
}

.icon-mail {
  background-image: url("/mail.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-help {
  background-image: url("/help.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
