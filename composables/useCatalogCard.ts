import type { NuxtImg } from "#components"
import type { Item } from "~/stores/catalog"

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
  const item = shallowRef<Item | null>(null)
  const favoritesStore = useFavoritesStore()
  const selectedSize = ref<string | null>(null)
  const isFavoriteLocal = ref(favoritesStore.isFavorite(props.id))
  const isStarPressed = ref(false)
  const starRef = ref<InstanceType<typeof NuxtImg> | null>(null)

  const availableSizes = computed(() => {
    return Object.keys(item.value?.vector || {})
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
    if (props.link && item.value && item.value.alias) {
      const fullAlias = item.value.alias // Уже полный, включая colorVal если есть
      const itemLink = `/catalog/item/?alias=${fullAlias}`
      try {
        await navigateTo(itemLink)
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
    handleTouchEnd,
    handleClick,
    isFavoriteLocal,
    isStarPressed,
    starRef,
    handleStarClick,
    handleStarMouseDown,
    handleStarTouchStart,
    availableSizes,
  }
}
