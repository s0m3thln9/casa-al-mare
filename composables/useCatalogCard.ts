import type { Item } from "~/stores/catalog"

interface UseCatalogCardProps {
  variant: "mini" | "large"
  id: number
  link: boolean
  currentColorCode?: string
}

export function useCatalogCard(props: UseCatalogCardProps) {
  const catalogStore = useCatalogStore()
  const currentImageIndex = ref(0)
  const isTransitioning = ref(false)
  const isHovered = ref(false)
  const isVisible = ref(false)
  const isWideScreen = ref(false)
  const touchStartX = ref(0)
  const item = shallowRef<Item | null>(null)
  const favoritesStore = useFavoritesStore()
  const selectedSize = ref<string | null>(null)
  const isFavoriteLocal = ref(favoritesStore.isFavorite(props.id))
  const isStarPressed = ref(false)
  const starRef = ref<InstanceType<typeof NuxtImg> | null>(null)
  
  const effectiveColorCode = computed(() => {
    if (!item.value) return ""
    if (props.currentColorCode && item.value.colors[props.currentColorCode]) {
      return props.currentColorCode
    }
    return Object.keys(item.value.colors)[0] || ""
  })
  
  const effectiveSize = computed(() => selectedSize.value || item.value?.sizes[0] || "")
  
  const currentColorName = computed(() => {
    return item.value?.colors[effectiveColorCode.value]?.name || ""
  })
  
  const numImages = computed(() => {
    return Math.min(3, currentColorImages.value.length || 0)
  })
  
  const barIndices = computed(() => {
    return Array.from({ length: numImages.value }, (_, i) => i)
  })
  
  const currentColorImages = computed(() => {
    if (!item.value || !effectiveColorCode.value) return Object.values(item.value?.images || {})
    const colorData = item.value.colors[effectiveColorCode.value]
    if (!colorData) return Object.values(item.value?.images || {})
    return colorData.images.map((imgId: number) => item.value?.images[imgId]).filter(Boolean)
  })
  
  const imageStyles = computed(() => (index: number) => ({
    transform:
      index === currentImageIndex.value
        ? "translateX(0)"
        : index < currentImageIndex.value
          ? "translateX(-100%)"
          : "translateX(100%)",
    opacity: index === currentImageIndex.value ? 1 : 0,
    zIndex: index === currentImageIndex.value ? 1 : 0,
    transition: "transform 400ms ease-in-out, opacity 400ms ease-in-out",
  }))
  
  const barStyles = computed(() => (index: number) => ({
    opacity: index === currentImageIndex.value ? 1 : 0.3,
    transition: "opacity 400ms ease-in-out",
  }))
  
  const getPriceData = (): { price: number; oldPrice?: number } | null => {
    if (!item.value) return null
    const colorKey = effectiveColorCode.value
    const sizeKey = effectiveSize.value
    const key = `${colorKey}_${sizeKey}`
    return item.value.vector[key]
  }
  
  const updateScreenWidth = () => {
    isWideScreen.value = document.body.clientWidth > 640
  }
  
  const priceFormatter = (value: number): string => {
    const formattedValue = new Intl.NumberFormat("ru-RU").format(value)
    return props.variant === "mini" ? `${formattedValue.replace(/\s/g, ".")}₽` : `${formattedValue} ₽`
  }
  
  const handleMouseMove = (e: MouseEvent) => {
    if (isTransitioning.value || !isWideScreen.value || numImages.value <= 1) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const numSections = numImages.value
    const section = rect.width / numSections
    const newIndex = Math.max(0, Math.min(numSections - 1, Math.floor((e.clientX - rect.left) / section)))
    if (newIndex !== currentImageIndex.value) {
      isTransitioning.value = true
      currentImageIndex.value = newIndex
      setTimeout(() => (isTransitioning.value = false), 500)
    }
  }
  
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.value = e.touches[0].clientX
  }
  
  const handleTouchEnd = (e: TouchEvent) => {
    if (numImages.value <= 1) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.value
    const threshold = 50
    if (Math.abs(deltaX) > threshold) {
      currentImageIndex.value = (currentImageIndex.value + (deltaX > 0 ? -1 : 1) + numImages.value) % numImages.value
    }
  }
  
  const handleClick = async () => {
    if (props.link && item.value) {
      try {
        await navigateTo(`/catalog/${props.id}`)
      } catch (error) {
        console.error("Navigation error:", error)
      }
    }
  }
  
  const handleStarClick = async (e: MouseEvent | TouchEvent) => {
    e.stopPropagation()
    if (isStarPressed.value) {
      e.preventDefault()
      return
    }
    
    isStarPressed.value = true
    
    const starEl = starRef.value?.$el as HTMLElement | null
    if (starEl) {
      starEl.style.pointerEvents = "none"
    }
    
    isFavoriteLocal.value = !isFavoriteLocal.value
    
    try {
      await favoritesStore.toggleFavorite(props.id)
    } catch (error) {
      isFavoriteLocal.value = !isFavoriteLocal.value
      console.error("Не удалось обновить избранное:", error)
    }
    
    setTimeout(() => {
      if (starEl) {
        starEl.style.pointerEvents = "auto"
      }
      isStarPressed.value = false
    }, 250)
  }
  
  const handleStarMouseDown = (e: MouseEvent) => {
    e.stopPropagation()
    if (isStarPressed.value) {
      e.preventDefault()
    }
  }
  
  const handleStarTouchStart = (e: TouchEvent) => {
    e.stopPropagation()
    if (isStarPressed.value) {
      e.preventDefault()
    }
  }
  
  watchEffect(async () => {
    if (catalogStore.items.length === 0) {
      await catalogStore.loadItems()
    }
    item.value = catalogStore.getItemById(props.id)
  })
  
  onMounted(() => {
    isVisible.value = true
    updateScreenWidth()
    window.addEventListener("resize", updateScreenWidth)
  })
  
  onUnmounted(() => {
    window.removeEventListener("resize", updateScreenWidth)
  })
  
  watch(effectiveColorCode, () => {
    currentImageIndex.value = 0
  })
  
  watch(
    () => favoritesStore.isFavorite(props.id),
    (newValue) => {
      isFavoriteLocal.value = newValue
    },
  )
  
  return {
    currentImageIndex,
    isTransitioning,
    isHovered,
    isVisible,
    isWideScreen,
    selectedSize,
    favoritesStore,
    imageStyles,
    barStyles,
    item,
    numImages,
    barIndices,
    currentColorImages,
    currentColorName,
    priceFormatter,
    getPriceData,
    handleMouseMove,
    handleTouchStart,
    handleTouchEnd,
    handleClick,
    isFavoriteLocal,
    isStarPressed,
    starRef,
    handleStarClick,
    handleStarMouseDown,
    handleStarTouchStart,
    effectiveSize,
  }
}