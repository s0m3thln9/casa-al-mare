export function useCatalogCard(variant: "mini" | "large", id: string, link: boolean) {
  const catalogStore = useCatalogStore()
  const currentImageIndex = ref(0)
  const isTransitioning = ref(false)
  const isHovered = ref(false)
  const isVisible = ref(false)
  const isWideScreen = ref(false)
  const touchStartX = ref(0)
  const item = catalogStore.getItemById(id)
  const favouritesStore = useFavouritesStore()
  const selectedSize = ref<string | null>(null)

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
    if (isTransitioning.value || !isWideScreen.value) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const section = rect.width / 3
    const newIndex = Math.max(0, Math.floor((e.clientX - rect.left) / section))
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
    const deltaX = e.changedTouches[0].clientX - touchStartX.value
    const threshold = 50
    if (Math.abs(deltaX) > threshold) {
      currentImageIndex.value =
        (currentImageIndex.value + (deltaX > 0 ? -1 : 1) + 3) % 3
    }
  }

  const handleClick = () => {
    if (link) navigateTo(`/catalog/${id}`)
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
    favouritesStore,
    imageStyles,
    barStyles,
    item,
    priceFormatter,
    handleMouseMove,
    handleTouchStart,
    handleTouchEnd,
    handleClick,
  }
}
