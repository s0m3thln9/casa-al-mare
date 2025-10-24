import type { Item } from "~/stores/catalog"

export type Item = {
  id: number
  name: string
  link: string
  alias: string
  price: string
  oldPrice: string
  sizes: string[] | null
  images: {
    [key: string]: string
  }
  vector: {
    [size: string]: {
      quantity: number
      comingSoon: number
    }
  }
  type: string | null
  material: string[]
  useType: string[]
  withItems: string[]
  complex: string[]
  content: {
    header: string
    content: string
  }[]
  keys: string[]
  parents: {
    id: number
    name: string
    alias: string
  }[]
  parent: string
  colorVal: string
  colorName: string
  colors?: {
    // Добавлено для совместимости с page/item (если multiple colors)
    [code: string]: {
      name: string
      value: string
      images: string[]
    }
  }
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
  parentsAliases: string[] // Новое: для фильтра по path (aliases из parents)
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
    parentsAliases: [], // Новое
    searchQuery: "",
  })

  const activeFilters = ref<SortAndFilter>({ ...pendingFilters.value })

  const loadItems = async (): Promise<void> => {
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

  const getLinkFromFilters = (filters: Partial<SortAndFilter>): string => {
    const params = new URLSearchParams()
    if (filters.parentsAliases && filters.parentsAliases.length > 0) {
      params.set("path", filters.parentsAliases.join("/"))
    }
    if (filters.colors && filters.colors.length > 0) {
      params.set("color", filters.colors[0].code) // Берем первый цвет
    }
    if (filters.materials && filters.materials.length > 0) {
      params.set("material", filters.materials[0]) // Берем первый материал
    }
    if (filters.types && filters.types.length > 0) {
      params.set("types", filters.types.join(","))
    }
    if (filters.keystrings && filters.keystrings.length > 0) {
      params.set("keystrings", "/" + filters.keystrings.join("/") + "/")
    }
    if (filters.searchQuery) {
      params.set("query", filters.searchQuery)
    }
    const queryString = params.toString()
    return queryString ? `/catalog?${queryString}` : "/catalog"
  }

  const generateKeystringPath = (keys?: string[]): string => {
    const currentKeys = keys || activeFilters.value.keystrings
    if (currentKeys.length === 0) return "/catalog"
    const path = currentKeys.join("/")
    return `/catalog?keystrings=/${path}/`
  }

  const filters = computed(() => ({
    types: [...new Set(items.value.map((item) => item.type).filter((t) => t))],
    colors: (): { code: string; name: string; value: string }[] => {
      const colorsSet = new Set()
      const colorsArray: { code: string; name: string; value: string }[] = []
      items.value.forEach((item) => {
        if (item.colorVal && item.colorName) {
          const colorKey = `${item.colorVal}-${item.colorName}`
          if (!colorsSet.has(colorKey)) {
            colorsSet.add(colorKey)
            colorsArray.push({
              code: item.colorVal,
              name: item.colorName,
              value: item.colorVal,
            })
          }
        }
      })
      return colorsArray
    },
    sizes: [...new Set(items.value.flatMap((item) => Object.keys(item.vector || {})))],
    maxPrices: (): { label: string; value: number }[] => {
      const allPrices: number[] = items.value.map((item) => parseInt(item.price || "0")).filter((p) => p > 0)
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
  }))

  const filteredItems = computed(() => {
    let filtered = [...items.value]
    const f = activeFilters.value
    if (f.types.length > 0) {
      filtered = filtered.filter((item) => f.types.includes(item.type || ""))
    }
    if (f.colors.length > 0) {
      const colorCodes = f.colors.map((c) => c.code)
      filtered = filtered.filter((item) => colorCodes.includes(item.colorVal || ""))
    }
    if (f.sizes.length > 0) {
      filtered = filtered.filter((item) => Object.keys(item.vector || {}).some((size) => f.sizes.includes(size)))
    }
    if (f.maxPrice !== null) {
      filtered = filtered.filter((item) => parseInt(item.price || "0") <= f.maxPrice!)
    }
    if (f.withDiscount === "Со скидкой") {
      filtered = filtered.filter((item) => {
        const price = parseInt(item.price || "0")
        const oldPrice = parseInt(item.oldPrice || "0")
        return oldPrice > 0 && oldPrice > price
      })
    }
    if (f.inStock === "В наличии") {
      filtered = filtered.filter((item) =>
        Object.values(item.vector || {}).some((variant: any) => (variant.quantity ?? 0) > 0),
      )
    }
    if (f.materials.length > 0) {
      filtered = filtered.filter((item) => f.materials.some((m) => item.material.includes(m)))
    }
    if (f.useTypes.length > 0) {
      filtered = filtered.filter((item) => f.useTypes.some((u) => item.useType.includes(u)))
    }
    if (f.keystrings.length > 0) {
      filtered = filtered.filter((item) => f.keystrings.every((key) => item.keys?.includes(key) || false))
    }
    // Новое: фильтр по parentsAliases (из path)
    if (f.parentsAliases.length > 0) {
      filtered = filtered.filter((item) =>
        f.parentsAliases.every((alias) => item.parents.some((p) => p.alias === alias)),
      )
    }
    if (f.sortType && f.sortType !== "По умолчанию") {
      filtered.sort((a, b) => {
        const priceA = parseInt(a.price || "0")
        const priceB = parseInt(b.price || "0")
        return f.sortType === "По убыванию цены" ? priceB - priceA : priceA - priceB
      })
    }
    if (f.searchQuery && f.searchQuery.trim() !== "") {
      const searchTerm = f.searchQuery.toLowerCase().trim()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchTerm))
    }
    return filtered
  })

  const reset = (): void => {
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
      parentsAliases: [],
      searchQuery: "",
    }
    pendingFilters.value = { ...activeFilters.value }
    currentVisibleCardCount.value = 12
  }

  const applyFilters = (): void => {
    activeFilters.value = JSON.parse(JSON.stringify(pendingFilters.value))
    currentVisibleCardCount.value = 12
  }

  const getItemById = (id: number): Item | undefined => {
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
    getLinkFromFilters, // Новая функция
  }
})
