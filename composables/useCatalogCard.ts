export function useCatalogCard(variant: "mini" | "large", id: number, link: boolean) {
  const catalogStore = useCatalogStore()
  const currentImageIndex = ref(0)
  const isTransitioning = ref(false)
  const isHovered = ref(false)
  const isVisible = ref(false)
  const isWideScreen = ref(false)
  const touchStartX = ref(0)
  const item = catalogStore.getItemById(id)
  const favoritesStore = useFavoritesStore()
  const selectedSize = ref<string | null>(null)

  const numImages = computed(() => {
    return Math.min(3, Object.values(item?.images || {}).length || 0)
  })

  const barIndices = computed(() => {
    return Array.from({ length: numImages.value }, (_, i) => i)
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

  const updateScreenWidth = () => {
    isWideScreen.value = document.body.clientWidth > 640
  }

  const priceFormatter = (value: number) => {
    const formattedValue = new Intl.NumberFormat("ru-RU").format(value)
    return variant === "mini" ? `${formattedValue.replace(/\s/g, ".")}₽` : `${formattedValue} ₽`
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
    console.log("handleClick triggered:", { id, link, path: `/catalog/${id}` })
    if (link && item) {
      try {
        await navigateTo(`/catalog/${id}`)
      } catch (error) {
        console.error("Navigation error:", error)
      }
    } else {
      console.warn("Navigation skipped: link=false or no item")
    }
  }

  onMounted(() => {
    isVisible.value = true
    updateScreenWidth()
    window.addEventListener("resize", updateScreenWidth)
  })

  onUnmounted(() => {
    window.removeEventListener("resize", updateScreenWidth)
  })

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
    priceFormatter,
    handleMouseMove,
    handleTouchStart,
    handleTouchEnd,
    handleClick,
  }
}
