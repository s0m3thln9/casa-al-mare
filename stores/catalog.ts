export type KeyItem = {
  type: string
  name: string
  alias: string
  value?: string
}

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
  keys: KeyItem[]
  parents: {
    id: number
    name: string
    alias: string
    catName?: string
    image?: string
    activeImage?: string
  }[]
  parent: string
  colorVal: string
  colorName: string
  colorArt?: string
  colors?: {
    [code: string]: {
      name: string
      value: string
      images: string[]
    }
  }
}

type SortAndFilter = {
  parentsAliases: string[][]
  thirdLevelByParent: Record<string, string[]>
  colors: { code: string; name: string; value: string }[]
  maxPrice: string | null // Изменено с number на string
  sortType: string | null
  withDiscount: string | null
  inStock: string | null
  materials: string
  useTypes: string[]
  keystrings: string[]
  searchQuery: string
  extra: Record<string, string[]>
}

export const useCatalogStore = defineStore("catalog", () => {
  const desktopStrokeCardCount = ref("4")
  const mobileStrokeCardCount = ref("2")
  const currentVisibleCardCount = ref(12)
  const items = ref<Item[]>([])
  const isLoading = ref(true)
  const pendingFilters = ref<SortAndFilter>({
    parentsAliases: [],
    thirdLevelByParent: {},
    colors: [],
    maxPrice: null,
    sortType: null,
    withDiscount: null,
    inStock: null,
    materials: "",
    useTypes: [],
    keystrings: [],
    searchQuery: "",
    extra: {},
  })

  const currentFilters = ref<SortAndFilter>({ ...pendingFilters.value })

  const maxParentsLength = computed(() => Math.max(...items.value.map((i) => i.parents.length), 0))

  const padParentsAliases = (arr: string[][]): string[][] => {
    const len = maxParentsLength.value
    return arr.length > len ? arr.slice(0, len) : [...arr, ...Array(len - arr.length).fill([])]
  }

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
      const filteredSegments = filters.parentsAliases
        .filter((segment) => Array.isArray(segment) && segment.length > 0)
        .map((segment) => segment.join(","))

      if (filters.thirdLevelByParent && Object.keys(filters.thirdLevelByParent).length > 0) {
        const thirdLevelSegments: string[] = []

        if (filters.parentsAliases[1]) {
          filters.parentsAliases[1].forEach((parentAlias) => {
            const children = filters.thirdLevelByParent![parentAlias] || []
            if (children.length > 0) {
              thirdLevelSegments.push(...children)
            }
          })
        }

        if (thirdLevelSegments.length > 0) {
          filteredSegments.push(thirdLevelSegments.join(","))
        }
      }

      if (filteredSegments.length > 0) {
        params.set("path", filteredSegments.join("/"))
      }
    }
    if (filters.colors && filters.colors.length > 0) {
      params.set("color", filters.colors[0].code)
    }
    if (filters.materials && filters.materials.trim() !== "") {
      params.set("material", filters.materials)
    }
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      params.set("query", filters.searchQuery)
    }
    if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
      params.set("maxPrice", filters.maxPrice.toString())
    }
    if (filters.sortType) {
      params.set("sortType", filters.sortType)
    }
    if (filters.inStock) {
      params.set("inStock", filters.inStock)
    }
    if (filters.withDiscount) {
      params.set("withDiscount", filters.withDiscount)
    }
    const queryString = params.toString()
    return queryString ? `/catalog?${queryString}` : "/catalog"
  }

  const isSyncing = ref(false)

  const syncPending = (): void => {
    isSyncing.value = true
    pendingFilters.value = JSON.parse(JSON.stringify(currentFilters.value))
    nextTick(() => {
      isSyncing.value = false
    })
  }

  const getFilteredItemsForLevel = (level: number) => {
    let filtered = [...items.value]
    const prevSegments = pendingFilters.value.parentsAliases.slice(0, level).filter((seg) => seg.length > 0)

    if (prevSegments.length > 0) {
      filtered = filtered.filter((item) => {
        // Проверяем, соответствует ли товар хотя бы одной комбинации родителей
        return prevSegments.every((aliases, idx) => {
          if (idx >= item.parents.length) return false
          // Товар должен соответствовать хотя бы одному алиасу в сегменте
          return aliases.some((alias) => item.parents[idx]?.alias === alias)
        })
      })
    }
    return filtered
  }

  const popupDynamicFilters = computed(() => {
    const pathLevels: { name: string; alias: string; image?: string; activeImage?: string; catName?: string }[][] = []
    const pathLevelNames: string[] = []
    const maxLevels = maxParentsLength.value

    for (let level = 0; level < maxLevels; level++) {
      const levelItems = getFilteredItemsForLevel(level)
      const uniqueParents = new Map(
        levelItems
          .map((item) => item.parents[level])
          .filter(Boolean)
          .map((p) => [
            p.alias,
            {
              name: p.name,
              alias: p.alias,
              image: p.image,
              activeImage: p.activeImage,
              catName: p.catName,
            },
          ]),
      )
      const levelOptions = Array.from(uniqueParents.values())
      pathLevels.push(levelOptions)

      if (level === 0) {
        pathLevelNames.push("Категория")
      } else {
        const prevLevelItems = getFilteredItemsForLevel(level - 1)
        const firstItemWithCatName = prevLevelItems.find((item) => item.parents[level - 1]?.catName)
        pathLevelNames.push(firstItemWithCatName?.parents[level - 1]?.catName || "")
      }
    }

    // Группируем третий уровень по родителям второго уровня с catName
    const thirdLevelGroups: {
      parentAlias: string
      catName: string
      options: { name: string; alias: string; image?: string; activeImage?: string }[]
    }[] = []

    const currentLevelAliases = pendingFilters.value.parentsAliases
      .slice(0, pendingFilters.value.parentsAliases.filter((seg) => seg.length > 0).length)
      .filter((seg) => seg.length > 0)

    // Проверяем, выбран ли второй уровень
    if (currentLevelAliases.length >= 2) {
      // Изменено с === 2 на >= 2
      const secondLevelAliases = currentLevelAliases[1]

      // Для каждого выбранного алиаса на втором уровне
      secondLevelAliases.forEach((parentAlias) => {
        // Находим товары с этим родителем
        const itemsWithParent = items.value.filter((item) => {
          if (item.parents.length < 2) return false
          // Проверяем первый уровень
          if (!currentLevelAliases[0].some((alias) => item.parents[0]?.alias === alias)) return false
          // Проверяем второй уровень (конкретный родитель)
          return item.parents[1]?.alias === parentAlias
        })

        // Проверяем, есть ли у родителя catName
        const parentCategory = itemsWithParent[0]?.parents[1]
        const catName = parentCategory?.catName

        if (catName && itemsWithParent.some((item) => item.parents[2])) {
          // Собираем уникальные дочерние категории третьего уровня
          const childOptions = new Map(
            itemsWithParent
              .map((item) => item.parents[2])
              .filter(Boolean)
              .map((p) => [
                p.alias,
                {
                  name: p.name,
                  alias: p.alias,
                  image: p.image,
                  activeImage: p.activeImage,
                },
              ]),
          )

          thirdLevelGroups.push({
            parentAlias: parentAlias,
            catName: catName,
            options: Array.from(childOptions.values()),
          })
        }
      })
    }

    const pathFilteredItems = getFilteredItemsForLevel(
      pendingFilters.value.parentsAliases.filter((seg) => seg.length > 0).length,
    )

    const colors: { code: string; name: string; value: string; art?: string }[] = []
    const colorsSet = new Set()
    pathFilteredItems.forEach((item) => {
      item.keys
        ?.filter((k) => k.type === "color")
        .forEach((k) => {
          const colorKey = `${k.alias}-${k.name}`
          if (!colorsSet.has(colorKey)) {
            colorsSet.add(colorKey)
            colors.push({
              code: k.alias,
              name: k.name,
              value: k.value || k.alias,
              art: item.colorArt,
            })
          }
        })
    })

    const materials: { name: string; alias: string }[] = []
    const matSet = new Set()
    pathFilteredItems.forEach((item) => {
      item.keys
        ?.filter((k) => k.type === "material")
        .forEach((k) => {
          if (!matSet.has(k.alias)) {
            matSet.add(k.alias)
            materials.push({ name: k.name, alias: k.alias })
          }
        })
    })

    const extraFilters: Record<string, { name: string; alias: string }[]> = {}
    const extraSet = new Map()
    pathFilteredItems.forEach((item) => {
      item.keys
        ?.filter((k) => k.type !== "material" && k.type !== "color")
        .forEach((k) => {
          if (!extraSet.has(k.type)) {
            extraSet.set(k.type, new Set())
          }
          const typeSet = extraSet.get(k.type)
          if (typeSet && !typeSet.has(k.alias)) {
            typeSet.add(k.alias)
            if (!extraFilters[k.type]) {
              extraFilters[k.type] = []
            }
            extraFilters[k.type].push({ name: k.name, alias: k.alias })
          }
        })
    })

    return { pathLevels, pathLevelNames, colors, materials, extraFilters, thirdLevelGroups }
  })

  watch(
    () => [...pendingFilters.value.parentsAliases],
    (newVal, oldVal) => {
      if (!oldVal || isSyncing.value) return

      let changedIndex = -1
      for (let i = 0; i < Math.max(newVal.length, oldVal.length); i++) {
        const newSegment = newVal[i] || []
        const oldSegment = oldVal[i] || []

        if (JSON.stringify(newSegment.sort()) !== JSON.stringify(oldSegment.sort())) {
          changedIndex = i
          break
        }
      }

      if (changedIndex > -1) {
        const resetParentsAliases = [...newVal]
        for (let i = changedIndex + 1; i < resetParentsAliases.length; i++) {
          resetParentsAliases[i] = []
        }
        pendingFilters.value.parentsAliases = resetParentsAliases

        if (changedIndex <= 1) {
          pendingFilters.value.thirdLevelByParent = {}
        }

        pendingFilters.value.colors = []
        pendingFilters.value.materials = ""
        pendingFilters.value.extra = {}
      }
    },
    { deep: true },
  )

  const filters = computed(() => {
    const allPrices = items.value.map((item) => parseInt(item.price || "0")).filter((p) => p > 0)
    const uniquePrices = [...new Set(allPrices)].sort((a, b) => a - b)
    const minPrice = uniquePrices[0] ?? 0
    const maxPrice = uniquePrices[uniquePrices.length - 1] ?? 0
    const ranges = []
    if (maxPrice > 0) ranges.push({ label: "до 15000", value: "15000" })
    if (maxPrice >= 20000) ranges.push({ label: "до 20000", value: "20000" })
    if (maxPrice >= 25000) ranges.push({ label: "до 25000", value: "25000" })
    if (maxPrice >= 30000) ranges.push({ label: "до 30000", value: "30000" })
    if (maxPrice >= 35000) ranges.push({ label: "до 35000", value: "35000" })
    if (maxPrice >= 40000) ranges.push({ label: "до 40000", value: "40000" })
    if (maxPrice >= 45000) ranges.push({ label: "до 45000", value: "45000" })
    const filteredRanges = ranges.filter((range) => parseInt(range.value) >= minPrice)
    return {
      maxPrices: filteredRanges,
      inStock: [{ label: "В наличии", value: "В наличии" }],
      withDiscount: [{ label: "Со скидкой", value: "Со скидкой" }],
      sortTypes: [
        { label: "По убыванию цены", value: "По убыванию цены" },
        { label: "По возрастанию цены", value: "По возрастанию цены" },
      ],
    }
  })

  const filteredItems = computed(() => {
    if (items.value.length === 0) return []
    let filtered = [...items.value]
    const f = currentFilters.value
    const filledSegments = f.parentsAliases.filter((seg) => seg.length > 0)

    if (filledSegments.length > 0) {
      if (filledSegments.length > maxParentsLength.value) return []

      filtered = filtered.filter((item) => {
        const matchesFirstTwoLevels = filledSegments.every((aliases, idx) => {
          if (idx >= item.parents.length) return false
          return aliases.some((alias) => item.parents[idx]?.alias === alias)
        })

        if (!matchesFirstTwoLevels) return false

        if (f.thirdLevelByParent && Object.keys(f.thirdLevelByParent).length > 0) {
          const secondLevelParent = item.parents[1]?.alias

          if (!secondLevelParent) return false

          const thirdLevelFilters = f.thirdLevelByParent[secondLevelParent]

          if (thirdLevelFilters && thirdLevelFilters.length > 0) {
            if (!item.parents[2]) return false
            return thirdLevelFilters.includes(item.parents[2].alias)
          }

          return true
        }

        return true
      })
    }

    if (f.colors.length > 0) {
      const colorCodes = f.colors.map((c) => c.code)
      filtered = filtered.filter(
        (item) => item.keys?.some((k) => k.type === "color" && colorCodes.includes(k.alias)) || false,
      )
    }
    if (f.maxPrice !== null) {
      filtered = filtered.filter((item) => parseInt(item.price || "0") <= parseInt(f.maxPrice!))
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
    if (f.materials && f.materials.trim() !== "") {
      filtered = filtered.filter(
        (item) => item.keys?.some((k) => k.type === "material" && k.alias === f.materials) || false,
      )
    }
    if (f.useTypes.length > 0) {
      filtered = filtered.filter((item) => f.useTypes.some((u) => item.useType.includes(u)))
    }
    if (f.keystrings.length > 0) {
      filtered = filtered.filter((item) =>
        f.keystrings.every((key) => item.keys?.some((k) => k.alias === key) || false),
      )
    }
    if (f.extra && Object.keys(f.extra).length > 0) {
      filtered = filtered.filter((item) => {
        return Object.entries(f.extra).every(([type, aliases]) => {
          return aliases.length === 0 || item.keys?.some((k) => k.type === type && aliases.includes(k.alias)) || false
        })
      })
    }
    if (f.sortType) {
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
    pendingFilters.value = {
      parentsAliases: padParentsAliases([]),
      thirdLevelByParent: {},
      colors: [],
      maxPrice: null,
      sortType: null,
      withDiscount: null,
      inStock: null,
      materials: "",
      useTypes: [],
      keystrings: [],
      searchQuery: "",
      extra: {},
    }
    currentFilters.value = JSON.parse(JSON.stringify(pendingFilters.value))
    navigateTo("/catalog")
    currentVisibleCardCount.value = 12
  }

  const applyFilters = (): void => {
    currentFilters.value = JSON.parse(JSON.stringify(pendingFilters.value))
    currentFilters.value.parentsAliases = currentFilters.value.parentsAliases.filter((seg) => seg.length > 0)
    const url = getLinkFromFilters(currentFilters.value)
    navigateTo(url)
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

  watch(items, () => {
    pendingFilters.value.parentsAliases = padParentsAliases(pendingFilters.value.parentsAliases)
    currentFilters.value.parentsAliases = padParentsAliases(currentFilters.value.parentsAliases)
  })

  return {
    desktopStrokeCardCount,
    mobileStrokeCardCount,
    currentVisibleCardCount,
    pendingFilters,
    currentFilters,
    items,
    isLoading,
    filters,
    popupDynamicFilters,
    filteredItems,
    getItemById,
    reset,
    applyFilters,
    loadItems,
    syncPending,
    getLinkFromFilters,
    maxParentsLength,
    padParentsAliases,
  }
})
