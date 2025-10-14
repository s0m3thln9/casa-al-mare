export type Item = {
  id: number
  name: string
  colors: {
    [color: string]: {
      name: string
      value: string
      images: number[]
    }
  }
  sizes: string[]
  images: {
    [id: number]: string
  }
  vector: {
    [vector: string]: {
      oldPrice: number
      price: number
      quantity: number
      comingSoon: boolean
    }
  }
  type: string
  material: string[]
  useType: string[]
  keystrings: string[]
}

type SortAndFilter = {
  types: string[]
  colors: { code: string; name: string; value: string }[]
  sizes: string[]
  maxPrice: number | null
  sortType: string | null
  withDiscount: string | null
  inStock: string | null
  materials: string[]
  useTypes: string[]
  keystrings: string[]
  searchQuery: string
}

export const useCatalogStore = defineStore("catalog", () => {
  const desktopStrokeCardCount = ref("4")
  const mobileStrokeCardCount = ref("2")
  const currentVisibleCardCount = ref(12)
  const items = ref<Item[]>([])
  const isLoading = ref(true)
  const pendingFilters = ref<SortAndFilter>({
    types: [],
    colors: [],
    sizes: [],
    maxPrice: null,
    sortType: null,
    withDiscount: null,
    inStock: null,
    materials: [],
    useTypes: [],
    keystrings: [],
    searchQuery: "",
  })

  const activeFilters = ref<SortAndFilter>({ ...pendingFilters.value })

  const loadItems = async () => {
    try {
      isLoading.value = true
      const response = await $fetch("https://back.casaalmare.com/api/getProducts")
      if (response && Array.isArray(response)) {
        items.value = response as Item[]
      } else {
        throw new Error("Invalid data from server")
      }
    } catch (error) {
      console.error("Error loading items:", error)
      items.value = []
    } finally {
      isLoading.value = false
    }
  }

  const generateKeystringPath = (keys?: string[]) => {
    const currentKeys = keys || activeFilters.value.keystrings
    if (currentKeys.length === 0) return "/catalog"
    const path = currentKeys.join("/")
    return `/catalog?keystrings=/${path}/`
  }

  const filters = computed(() => {
    return {
      types: [...new Set(items.value.map((item) => item.type))],
      colors: () => {
        const colorsSet = new Set()
        const colorsArray: { code: string; name: string; value: string }[] = []
        items.value.forEach((item) => {
          Object.entries(item.colors).forEach(([code, colorData]) => {
            const colorKey = `${code}-${colorData.value}`
            if (!colorsSet.has(colorKey)) {
              colorsSet.add(colorKey)
              colorsArray.push({
                code: code,
                name: colorData.name,
                value: colorData.value,
              })
            }
          })
        })
        return colorsArray
      },
      sizes: [...new Set(items.value.flatMap((item) => item.sizes))],
      maxPrices: () => {
        const allPrices: number[] = []
        items.value.forEach((item) => {
          Object.values(item.vector).forEach((variant) => {
            allPrices.push(variant.price)
          })
        })
        const uniquePrices = [...new Set(allPrices)].sort((a, b) => a - b)
        const minPrice = uniquePrices[0] ?? 0
        const maxPrice = uniquePrices[uniquePrices.length - 1] ?? 0
        const ranges: { label: string; value: number }[] = []
        if (minPrice < 15000) ranges.push({ label: "до 15000", value: 15000 })
        if (maxPrice > 20000) ranges.push({ label: "до 20000", value: 20000 })
        if (maxPrice > 25000) ranges.push({ label: "до 25000", value: 25000 })
        if (maxPrice > 30000) ranges.push({ label: "до 30000", value: 30000 })
        if (maxPrice > 35000) ranges.push({ label: "до 35000", value: 35000 })
        if (maxPrice > 40000) ranges.push({ label: "до 40000", value: 40000 })
        if (maxPrice > 45000) ranges.push({ label: "до 45000", value: 45000 })
        return ranges.filter((range) => range.value <= maxPrice)
      },
      inStock: ["В наличии"],
      withDiscount: ["Со скидкой"],
      sortTypes: ["По умолчанию", "По убыванию цены", "По возрастанию цены"],
      materials: [...new Set(items.value.flatMap((item) => item.material).filter((m) => m.trim() !== ""))],
      useTypes: [...new Set(items.value.flatMap((item) => item.useType).filter((u) => u.trim() !== ""))],
    }
  })

  const filteredItems = computed(() => {
    let filtered = [...items.value]
    const f = activeFilters.value
    if (f.types.length > 0) {
      filtered = filtered.filter((item) => f.types.includes(item.type))
    }
    if (f.colors.length > 0) {
      filtered = filtered.filter((item) =>
        Object.keys(item.colors).some((colorCode) => f.colors.some((c) => c.code === colorCode)),
      )
    }
    if (f.sizes.length > 0) {
      filtered = filtered.filter((item) => item.sizes.some((size) => f.sizes.includes(size)))
    }
    if (f.maxPrice !== null) {
      filtered = filtered.filter((item) =>
        Object.values(item.vector).some((variant) => (variant.price ?? 0) <= f.maxPrice!),
      )
    }
    if (f.withDiscount === "Со скидкой") {
      filtered = filtered.filter((item) =>
        Object.values(item.vector).some(
          (variant) => (variant.oldPrice ?? 0) > 0 && (variant.oldPrice ?? 0) > (variant.price ?? 0),
        ),
      )
    }
    if (f.inStock === "В наличии") {
      filtered = filtered.filter((item) => Object.values(item.vector).some((variant) => (variant.quantity ?? 0) > 0))
    }
    if (f.materials.length > 0) {
      filtered = filtered.filter((item) => f.materials.some((m) => item.material.includes(m)))
    }
    if (f.useTypes.length > 0) {
      filtered = filtered.filter((item) => f.useTypes.some((u) => item.useType.includes(u)))
    }
    if (f.keystrings.length > 0) {
      filtered = filtered.filter((item) => f.keystrings.every((key) => item.keystrings.includes(key)))
    }
    if (f.sortType && f.sortType !== "По умолчанию") {
      filtered.sort((a, b) => {
        const firstPriceA = Object.values(a.vector)[0]?.price ?? 0
        const firstPriceB = Object.values(b.vector)[0]?.price ?? 0
        return f.sortType === "По убыванию цены" ? firstPriceB - firstPriceA : firstPriceA - firstPriceB
      })
    }
    if (f.searchQuery && f.searchQuery.trim() !== "") {
      const searchTerm = f.searchQuery.toLowerCase().trim()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchTerm))
    }
    return filtered
  })

  const reset = () => {
    activeFilters.value = {
      types: [],
      colors: [],
      sizes: [],
      maxPrice: null,
      sortType: null,
      withDiscount: null,
      inStock: null,
      materials: [],
      useTypes: [],
      keystrings: [],
      searchQuery: "",
    }
    pendingFilters.value = { ...activeFilters.value }
    currentVisibleCardCount.value = 12
  }

  const applyFilters = () => {
    activeFilters.value = JSON.parse(JSON.stringify(pendingFilters.value))
    currentVisibleCardCount.value = 12
  }

  const getItemById = (id: number) => {
    return items.value.find((item) => item.id === id)
  }

  watch(filteredItems, () => {
    if (filteredItems.value.length > 0) {
      currentVisibleCardCount.value = 12
    }
  })

  return {
    desktopStrokeCardCount,
    mobileStrokeCardCount,
    currentVisibleCardCount,
    pendingFilters,
    items,
    isLoading,
    filters,
    filteredItems,
    getItemById,
    reset,
    applyFilters,
    loadItems,
    generateKeystringPath,
  }
})
