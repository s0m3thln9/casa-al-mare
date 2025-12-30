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
  withItems: {
    id: number
    name: string
    link: string
  }[]
  set?: {
    id: number
    type: string
    name: string
    link: string
  }[]
  complex: {
    id: number
    name: string
    link: string
    image?: string
    activeImage?: string
  }[]
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
      art?: string
    }
  }
}

type SortAndFilter = {
  parentsAliases: string[]
  secondLevelAliases: string[] // ДОБАВИТЬ эту строку
  thirdLevelByParent: Record<string, string>
  colors: { code: string; name: string; value: string }[]
  sortType: string | null
  materials: string[]
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
    secondLevelAliases: [], // ДОБАВИТЬ эту строку
    thirdLevelByParent: {},
    colors: [],
    sortType: null,
    materials: [],
    useTypes: [],
    keystrings: [],
    searchQuery: "",
    extra: {},
  })

  const currentFilters = ref<SortAndFilter>({ ...pendingFilters.value })

  const shouldResetCount = ref(false)

  const maxParentsLength = computed(() => Math.max(...items.value.map((i) => i.parents.length), 0))

  const padParentsAliases = (arr: string[]): string[] => {
    const len = maxParentsLength.value
    const cleaned = arr.map((item) => item || "")
    return cleaned.length > len
      ? cleaned.slice(0, len)
      : [...cleaned, ...Array(Math.max(0, len - cleaned.length)).fill("")]
  }

  const loadItems = async (): Promise<void> => {
    if (items.value.length > 0) {
      return
    }

    try {
      isLoading.value = true
      const response = await $fetch("https://back.casaalmare.com/api/getProducts")
      if (response && Array.isArray(response)) {
        items.value = response as Item[]
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
      const filteredSegments = filters.parentsAliases.filter((segment) => segment && segment.trim() !== "")

      // ИЗМЕНИТЬ: добавляем второй уровень из secondLevelAliases
      if (filters.secondLevelAliases && filters.secondLevelAliases.length > 0) {
        filteredSegments.push(filters.secondLevelAliases.join(","))
      }

      if (filters.thirdLevelByParent && Object.keys(filters.thirdLevelByParent).length > 0) {
        const thirdLevelSegments: string[] = []

        // ИЗМЕНИТЬ: проверяем все выбранные второго уровня
        filters.secondLevelAliases?.forEach((parentAlias) => {
          const child = filters.thirdLevelByParent![parentAlias]
          if (child && child.trim() !== "") {
            thirdLevelSegments.push(child)
          }
        })

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
    if (filters.materials && filters.materials.length > 0) {
      params.set("material", filters.materials.join(","))
    }
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      params.set("query", filters.searchQuery)
    }
    if (filters.sortType) {
      params.set("sortType", filters.sortType)
    }
    const queryString = params.toString()
    return queryString ? `/catalog?${queryString}` : "/catalog"
  }

  const isSyncing = ref(false)

  const syncPending = (): void => {
    isSyncing.value = true
    pendingFilters.value = JSON.parse(JSON.stringify(currentFilters.value))
    void nextTick(() => {
      isSyncing.value = false
    })
  }

  const getFilteredItemsForLevel = (level: number) => {
    let filtered = [...items.value]

    // Фильтруем по первому уровню
    if (level >= 1) {
      const firstSegment = pendingFilters.value.parentsAliases[0]
      if (firstSegment && firstSegment.trim() !== "") {
        filtered = filtered.filter((item) => {
          return item.parents[0]?.alias === firstSegment
        })
      }
    }

    // Фильтруем по второму уровню (если мы на третьем уровне)
    if (level >= 2 && pendingFilters.value.secondLevelAliases && pendingFilters.value.secondLevelAliases.length > 0) {
      filtered = filtered.filter((item) => {
        return pendingFilters.value.secondLevelAliases.some((alias) => item.parents[1]?.alias === alias)
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

      // Special sorting for second level (level === 1)
      if (level === 1 && levelOptions.length > 0) {
        // Map each second-level option to its first-level parent(s)
        const optionToFirstParents = new Map<string, string[]>()

        levelItems.forEach((item) => {
          if (item.parents.length > 1) {
            const secondAlias = item.parents[1]?.alias
            const firstAlias = item.parents[0]?.alias
            if (secondAlias && firstAlias) {
              if (!optionToFirstParents.has(secondAlias)) {
                optionToFirstParents.set(secondAlias, [])
              }
              if (!optionToFirstParents.get(secondAlias)!.includes(firstAlias)) {
                optionToFirstParents.get(secondAlias)!.push(firstAlias)
              }
            }
          }
        })

        // Get first-level names for sorting
        const firstLevelMap = new Map<string, string>()
        items.value.forEach((item) => {
          if (item.parents[0]) {
            firstLevelMap.set(item.parents[0].alias, item.parents[0].name)
          }
        })

        levelOptions.sort((a, b) => {
          // Get first-level parent names for a and b
          const aFirstAliases = optionToFirstParents.get(a.alias) || []
          const bFirstAliases = optionToFirstParents.get(b.alias) || []

          const aFirstNames = aFirstAliases.map((alias) => firstLevelMap.get(alias) || alias).sort()
          const bFirstNames = bFirstAliases.map((alias) => firstLevelMap.get(alias) || alias).sort()

          // Compare first by first parent name
          const firstCompare = (aFirstNames[0] || "").localeCompare(bFirstNames[0] || "")
          if (firstCompare !== 0) return firstCompare

          // Then by own name
          return a.name.localeCompare(b.name)
        })
      }

      pathLevels.push(levelOptions)

      if (level === 0) {
        pathLevelNames.push("Категория")
      } else {
        const prevLevelItems = getFilteredItemsForLevel(level - 1)
        const firstItemWithCatName = prevLevelItems.find((item) => item.parents[level - 1]?.catName)
        pathLevelNames.push(firstItemWithCatName?.parents[level - 1]?.catName || "")
      }
    }

    // ИЗМЕНИТЬ весь блок thirdLevelGroups
    const thirdLevelGroups: {
      parentAlias: string
      catName: string
      options: { name: string; alias: string; image?: string; activeImage?: string }[]
    }[] = []

    const currentLevelAliases = (pendingFilters.value.parentsAliases || [])
      .map((seg) => seg || "")
      .slice(
        0,
        (pendingFilters.value.parentsAliases || []).filter((seg) => seg && typeof seg === "string" && seg.trim() !== "")
          .length,
      )
      .filter((seg) => seg && typeof seg === "string" && seg.trim() !== "")

    // ИЗМЕНИТЬ: проверяем что выбран первый уровень и есть выбранные элементы второго уровня
    if (
      currentLevelAliases.length >= 1 &&
      pendingFilters.value.secondLevelAliases &&
      pendingFilters.value.secondLevelAliases.length > 0
    ) {
      const firstLevelAlias = currentLevelAliases[0]

      // ИЗМЕНИТЬ: обрабатываем каждый выбранный элемент второго уровня
      pendingFilters.value.secondLevelAliases.forEach((secondLevelAlias) => {
        if (!secondLevelAlias || secondLevelAlias.trim() === "") return

        // Находим товары с этим родителем
        const itemsWithParent = items.value.filter((item) => {
          if (!item.parents || item.parents.length < 2) return false
          // Проверяем первый уровень
          if (item.parents[0]?.alias !== firstLevelAlias) return false
          // Проверяем второй уровень (конкретный родитель)
          return item.parents[1]?.alias === secondLevelAlias
        })

        // Проверяем, есть ли у родителя catName
        const parentCategory = itemsWithParent[0]?.parents?.[1]
        const catName = parentCategory?.catName

        if (catName && itemsWithParent.some((item) => item.parents && item.parents.length > 2 && item.parents[2])) {
          // Собираем уникальные дочерние категории третьего уровня
          const childOptions = new Map(
            itemsWithParent
              .filter((item) => item.parents && item.parents.length > 2)
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

          if (childOptions.size > 0) {
            thirdLevelGroups.push({
              parentAlias: secondLevelAlias,
              catName: catName,
              options: Array.from(childOptions.values()),
            })
          }
        }
      })
    }

    const pathFilteredItems = getFilteredItemsForLevel(
      pendingFilters.value.parentsAliases.filter((seg) => seg.length > 0).length,
    )
    
    const colorsMap = new Map<string, { code: string; name: string; value: string; art?: string }>()
    
    pathFilteredItems.forEach((item) => {
      item.keys
        ?.filter((k) => k.type === "color")
        .forEach((k) => {
          if (!colorsMap.has(k.alias)) {
            colorsMap.set(k.alias, {
              code: k.alias,
              name: k.name,
              value: k.value || k.alias,
              art: item.colorArt,
            })
          }
        })
    })
    
    const colors = Array.from(colorsMap.values())

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
    () => [...(pendingFilters.value.parentsAliases || [])].map((v) => v || ""),
    (newVal, oldVal) => {
      if (!oldVal || isSyncing.value) return

      let changedIndex = -1
      for (let i = 0; i < Math.max(newVal.length, oldVal.length); i++) {
        const newSegment = (newVal[i] || "").toString()
        const oldSegment = (oldVal[i] || "").toString()

        if (newSegment !== oldSegment) {
          changedIndex = i
          break
        }
      }

      if (changedIndex > -1) {
        const resetParentsAliases = newVal.map((v) => v || "")
        for (let i = changedIndex + 1; i < resetParentsAliases.length; i++) {
          resetParentsAliases[i] = ""
        }
        pendingFilters.value.parentsAliases = resetParentsAliases

        // ИЗМЕНИТЬ: при изменении первого уровня сбрасываем второй уровень
        if (changedIndex === 0) {
          pendingFilters.value.secondLevelAliases = []
        }

        if (changedIndex <= 1) {
          pendingFilters.value.thirdLevelByParent = {}
        }

        pendingFilters.value.colors = []
        pendingFilters.value.materials = []
        pendingFilters.value.extra = {}
      }
    },
    { deep: true },
  )

  watch(
    () => [...(pendingFilters.value.secondLevelAliases || [])],
    (newVal, oldVal) => {
      if (!oldVal || isSyncing.value) return

      const removed = oldVal.filter((alias) => !newVal.includes(alias))
      removed.forEach((alias) => {
        delete pendingFilters.value.thirdLevelByParent[alias]
      })

      pendingFilters.value.colors = []
      pendingFilters.value.materials = []
      pendingFilters.value.extra = {}
    },
    { deep: true },
  )

  const filters = computed(() => {
    return {
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
    const filledSegments = f.parentsAliases.filter((seg) => seg && seg.trim() !== "")

    if (filledSegments.length > 0) {
      if (filledSegments.length > maxParentsLength.value) return []

      filtered = filtered.filter((item) => {
        if (filledSegments.length > 0 && item.parents[0]?.alias !== filledSegments[0]) {
          return false
        }

        if (f.secondLevelAliases && f.secondLevelAliases.length > 0) {
          const hasMatchingSecondLevel = f.secondLevelAliases.some((alias) => item.parents[1]?.alias === alias)
          if (!hasMatchingSecondLevel) return false
        }

        // Проверяем третий уровень
        if (f.thirdLevelByParent && Object.keys(f.thirdLevelByParent).length > 0) {
          const secondLevelParent = item.parents[1]?.alias

          if (!secondLevelParent) return false

          const thirdLevelFilter = f.thirdLevelByParent[secondLevelParent]

          if (thirdLevelFilter && thirdLevelFilter.trim() !== "") {
            if (!item.parents[2]) return false
            return item.parents[2].alias === thirdLevelFilter
          }

          return true
        }

        return true
      })
    }

    // Остальная логика фильтрации остается без изменений
    if (f.colors.length > 0) {
      const colorCodes = f.colors.map((c) => c.code)
      filtered = filtered.filter(
        (item) => item.keys?.some((k) => k.type === "color" && colorCodes.includes(k.alias)) || false,
      )
    }
    if (f.materials && f.materials.length > 0) {
      filtered = filtered.filter(
        (item) => item.keys?.some((k) => k.type === "material" && f.materials.includes(k.alias)) || false,
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
      secondLevelAliases: [], // ДОБАВИТЬ эту строку
      thirdLevelByParent: {},
      colors: [],
      sortType: null,
      materials: [],
      useTypes: [],
      keystrings: [],
      searchQuery: "",
      extra: {},
    }
    currentFilters.value = JSON.parse(JSON.stringify(pendingFilters.value))
    shouldResetCount.value = true
    currentVisibleCardCount.value = 12
    navigateTo("/catalog")
  }

  const applyFilters = (): void => {
    const oldFiltersJson = JSON.stringify(currentFilters.value)
    currentFilters.value = JSON.parse(JSON.stringify(pendingFilters.value))
    currentFilters.value.parentsAliases = currentFilters.value.parentsAliases.filter(
      (seg) => seg && seg.trim() !== "",
    )

    const newFiltersJson = JSON.stringify(currentFilters.value)

    if (oldFiltersJson !== newFiltersJson) {
      shouldResetCount.value = true
    }

    const url = getLinkFromFilters(currentFilters.value)
    navigateTo(url)
  }

  const getItemById = (id: number): Item | undefined => {
    return items.value.find((item) => item.id === id)
  }

  const getPendingFilteredCount = (): number => {
    if (items.value.length === 0) return 0
    let filtered = [...items.value]
    const f = pendingFilters.value
    const filledSegments = f.parentsAliases.filter((seg) => seg && seg.trim() !== "")

    if (filledSegments.length > 0) {
      if (filledSegments.length > maxParentsLength.value) return 0

      filtered = filtered.filter((item) => {
        if (filledSegments.length > 0 && item.parents[0]?.alias !== filledSegments[0]) {
          return false
        }

        if (f.secondLevelAliases && f.secondLevelAliases.length > 0) {
          const hasMatchingSecondLevel = f.secondLevelAliases.some((alias) => item.parents[1]?.alias === alias)
          if (!hasMatchingSecondLevel) return false
        }

        if (f.thirdLevelByParent && Object.keys(f.thirdLevelByParent).length > 0) {
          const secondLevelParent = item.parents[1]?.alias

          if (!secondLevelParent) return false

          const thirdLevelFilter = f.thirdLevelByParent[secondLevelParent]

          if (thirdLevelFilter && thirdLevelFilter.trim() !== "") {
            if (!item.parents[2]) return false
            return item.parents[2].alias === thirdLevelFilter
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
    if (f.materials && f.materials.length > 0) {
      filtered = filtered.filter(
        (item) => item.keys?.some((k) => k.type === "material" && f.materials.includes(k.alias)) || false,
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
    if (f.searchQuery && f.searchQuery.trim() !== "") {
      const searchTerm = f.searchQuery.toLowerCase().trim()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchTerm))
    }
    return filtered.length
  }

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
    getPendingFilteredCount,
    getItemById,
    reset,
    applyFilters,
    loadItems,
    syncPending,
    getLinkFromFilters,
    maxParentsLength,
    padParentsAliases,
    shouldResetCount,
  }
})
