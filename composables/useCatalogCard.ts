import type { NuxtImg } from "#components"

interface UseCatalogCardProps {
  variant: "mini" | "large"
  id: number
  link: boolean
}

export function useCatalogCard(props: UseCatalogCardProps) {
  const catalogStore = useCatalogStore()
  const currentImageIndex = ref(0)
  const isTransitioning = ref(false)
  const isHovered = ref(false)
  const isVisible = ref(false)
  const viewport = useViewport()
  const isNarrowScreen = computed(() => viewport.isLessThan("sm"))
  const touchStartX = ref(0)
  const touchStartY = ref(0)
  const isHorizontalSwipe = ref(false)
  const item = shallowRef<Item | null>(null)
  const favoritesStore = useFavoritesStore()
  const selectedSize = ref<string | null>(null)
  const isFavoriteLocal = ref(favoritesStore.isFavorite(props.id))
  const isStarPressed = ref(false)
  const starRef = ref<InstanceType<typeof NuxtImg> | null>(null)
  
  const availableSizes = computed(() => {
    return (item.value?.sizes || []).filter(key => key !== "NS")
  })
  
  const numImages = computed(() => {
    return Math.min(3, currentColorImages.value.length || 0)
  })
  
  const barIndices = computed(() => {
    return Array.from({ length: numImages.value }, (_, i) => i)
  })
  
  const currentColorImages = computed(() => {
    return Object.values(item.value?.images || {})
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
    return {
      price: parseInt(item.value.price || "0"),
      oldPrice: parseInt(item.value.oldPrice || "0"),
    }
  }
  
  const priceFormatter = (value: number): string => {
    const formattedValue = new Intl.NumberFormat("ru-RU").format(value)
    return props.variant === "mini" ? `${formattedValue.replace(/\s/g, ".")}₽` : `${formattedValue} ₽`
  }
  
  const handleMouseMove = (e: MouseEvent) => {
    if (isTransitioning.value || isNarrowScreen.value || numImages.value <= 1) return
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
    if (numImages.value <= 1 || !isNarrowScreen.value) return
    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
    isHorizontalSwipe.value = false
  }
  
  const handleTouchMove = (e: TouchEvent) => {
    if (numImages.value <= 1 || !isNarrowScreen.value || !touchStartX.value || !touchStartY.value) return
    
    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const deltaX = Math.abs(currentX - touchStartX.value)
    const deltaY = Math.abs(currentY - touchStartY.value)
    const threshold = 15
    
    if (deltaX > threshold && deltaX > deltaY) {
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
      if (Math.abs(angle) < 45) {
        isHorizontalSwipe.value = true
        e.preventDefault()
      }
    }
  }
  
  const handleTouchEnd = (e: TouchEvent) => {
    if (numImages.value <= 1 || !isNarrowScreen.value) return
    
    if (!isHorizontalSwipe.value) return
    
    const deltaX = e.changedTouches[0].clientX - touchStartX.value
    const threshold = 50
    if (Math.abs(deltaX) > threshold) {
      isTransitioning.value = true
      const direction = deltaX > 0 ? -1 : 1
      currentImageIndex.value = (currentImageIndex.value + direction + numImages.value) % numImages.value
      setTimeout(() => {
        isTransitioning.value = false
      }, 400)
    }
    
    touchStartX.value = 0
    touchStartY.value = 0
    isHorizontalSwipe.value = false
  }
  
  const handleClick = async (forceSize?: string | null) => {
    if (props.link && item.value && item.value.alias) {
      const fullAlias = item.value.alias
      let itemLink = `/product/${fullAlias}`
      
      const sizeToUse = forceSize ?? selectedSize.value
      if (sizeToUse) {
        itemLink += `?size=${encodeURIComponent(sizeToUse)}`
      }
      
      try {
        await navigateTo(itemLink)
      } catch (error) {
        console.error("Navigation error:", error)
      }
    }
  }
  
  const handleSizeClick = async (size: string, event?: Event) => {
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }
    
    if (props.link) {
      selectedSize.value = size
      await handleClick(size)
    } else {
      selectedSize.value = size
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
    
    const wasFavorite = isFavoriteLocal.value
    isFavoriteLocal.value = !isFavoriteLocal.value
    
    try {
      await favoritesStore.toggleFavorite(props.id)
      if (!wasFavorite && item.value && getPriceData()) {
        if (import.meta.client) {
          window.dataLayer = window.dataLayer || [];
          dataLayer.push({
            event: "add_to_wishlist",
            ecommerce: {
              items: [{
                item_name: item.value.name,
                item_id: props.id.toString(),
                price: getPriceData().price,
                item_category: item.value.parents?.[0]?.name || "Категория товара",
                item_variant: selectedSize.value || '',
                quantity: 1
              }]
            }
          });
        }
      }
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
  })
  
  watch(currentColorImages, () => {
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
    isHovered,
    isVisible,
    isNarrowScreen,
    selectedSize,
    imageStyles,
    barStyles,
    item,
    numImages,
    barIndices,
    currentColorImages,
    priceFormatter,
    getPriceData,
    handleMouseMove,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleClick,
    handleSizeClick,
    isFavoriteLocal,
    isStarPressed,
    starRef,
    handleStarClick,
    handleStarMouseDown,
    handleStarTouchStart,
    availableSizes,
  }
}