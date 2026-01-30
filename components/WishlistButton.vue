<script setup lang="ts">
const favoritesStore = useFavoritesStore()

const props = defineProps<{
  customClass?: string
  itemId: number
}>()

const styleBase =
  "flex justify-center items-center px-2 py-1.5 rounded-lg border-[0.7px] border-transparent text-[13px]/snug font-[Manrope] sm:text-xs/snug transition-all duration-200 ease-in-out " +
  (props.customClass ? props.customClass + " " : " ")

const styleVariants = {
  default: "bg-[#FFFFFA] text-[#211D1D] cursor-pointer hover:border-[#211D1D]",
  loading: "bg-[#FFFFFA] text-[#211D1D] cursor-default",
  favorite: "bg-[#FFFFFA] border-[#211D1D] text-[#211D1D] cursor-pointer hover:border-[#8C8785]",
}

const isLoading = ref(false)
const isFavoriteLocal = ref(favoritesStore.isFavorite(props.itemId))
const isPressed = ref(false)
const buttonRef = ref<HTMLElement | null>(null)

const currentState = computed(() => {
  let content: string
  let style: string
  let disabled: boolean
  let ariaLabel: string
  let ariaPressed: boolean

  if (isLoading.value) {
    content = !isFavoriteLocal.value ? "Удаление..." : "Добавление..."
    style = styleBase + styleVariants.loading
    disabled = true
    ariaLabel = content.toLowerCase()
    ariaPressed = false
  } else if (isFavoriteLocal.value) {
    content = "Убрать из избранного"
    style = styleBase + styleVariants.favorite
    disabled = false
    ariaLabel = "Убрать из избранного"
    ariaPressed = true
  } else {
    content = "Добавить в избранное"
    style = styleBase + styleVariants.default
    disabled = false
    ariaLabel = "Добавить в избранное"
    ariaPressed = false
  }
  return { content, style, disabled, ariaLabel, ariaPressed }
})

const catalogStore = useCatalogStore()

const getItem = async () => {
  if (catalogStore.items.length === 0) {
    await catalogStore.loadItems()
  }
  return catalogStore.getItemById(props.itemId)
}

const handleClick = async (e: MouseEvent | TouchEvent) => {
  e.stopPropagation()
  if (isPressed.value || isLoading.value) {
    e.preventDefault()
    return
  }
  
  isPressed.value = true
  const buttonEl = buttonRef.value
  if (buttonEl) {
    buttonEl.style.pointerEvents = "none"
  }
  
  const wasFavorite = isFavoriteLocal.value
  
  isFavoriteLocal.value = !isFavoriteLocal.value
  isLoading.value = true
  
  try {
    await favoritesStore.toggleFavorite(props.itemId)
    
    // ✅ GA add_to_wishlist
    if (!wasFavorite && import.meta.client) {
      const item = await getItem()
      
      if (item) {
        window.dataLayer = window.dataLayer || []
        
        dataLayer.push({
          event: "add_to_wishlist",
          ecommerce: {
            items: [
              {
                item_name: item.name,
                item_id: props.itemId.toString(),
                price: parseInt(item.price || "0"),
                item_category: item.parents?.[0]?.name || "",
                item_variant: "",
                quantity: 1,
              },
            ],
          },
        })
      }
    }
  } catch (error) {
    isFavoriteLocal.value = !isFavoriteLocal.value
    console.error("Не удалось обновить избранное:", error)
  } finally {
    isLoading.value = false
  }
  
  setTimeout(() => {
    if (buttonEl) {
      buttonEl.style.pointerEvents = "auto"
    }
    isPressed.value = false
  }, 250)
}

const handleMouseDown = (e: MouseEvent) => {
  e.stopPropagation()
  if (isPressed.value) {
    e.preventDefault()
  }
}

const handleTouchStart = (e: TouchEvent) => {
  e.stopPropagation()
  if (isPressed.value) {
    e.preventDefault()
  }
}

watch(
  () => favoritesStore.isFavorite(props.itemId),
  (newValue) => {
    isFavoriteLocal.value = newValue
  },
)
</script>

<template>
  <button
    ref="buttonRef"
    :class="currentState.style"
    :disabled="currentState.disabled"
    :aria-label="currentState.ariaLabel"
    :aria-pressed="currentState.ariaPressed"
    @click="handleClick"
    @mousedown="handleMouseDown"
    @touchstart="handleTouchStart"
  >
    {{ currentState.content }}
  </button>
</template>
