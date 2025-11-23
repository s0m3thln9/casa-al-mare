<script setup lang="ts">

interface VideoSource {
  mp4: string
  ogv: string
  webm: string
}

interface VideoData {
  pc: VideoSource
  mob: VideoSource
}

interface VideoAPIItem {
  MIGX_id: string
  image: string
  mp4: string
  ogv: string
  webm: string
}

const { data: videoData } = await useFetch<VideoAPIItem[]>("https://back.casaalmare.com/api/getVideoByID?id=3", {
  immediate: true,
  transform: (response) => {
    if (!response || !Array.isArray(response) || response.length === 0) {
      return []
    }
    return response.slice(0, 2)
  },
})

const videoData1 = computed<VideoData | null>(() => {
  const item = videoData.value?.[0]
  if (!item) return null
  const source: VideoSource = { mp4: item.mp4, ogv: item.ogv, webm: item.webm }
  return { pc: source, mob: source }
})

const videoData2 = computed<VideoData | null>(() => {
  const item = videoData.value?.[1]
  if (!item) return null
  const source: VideoSource = { mp4: item.mp4, ogv: item.ogv, webm: item.webm }
  return { pc: source, mob: source }
})

const popupStore = usePopupStore()
const catalogStore = useCatalogStore()
const viewport = useViewport()
const isMobile = computed(() => viewport.isLessThan("sm"))

const currentCardCount = computed(() =>
  isMobile.value ? catalogStore.mobileStrokeCardCount : catalogStore.desktopStrokeCardCount,
)

const route = useRoute()

// Сохраняем позицию скролла перед уходом со страницы
const scrollPosition = ref(0)

const applyFiltersFromQuery = (q: any) => {
  let parentsAliasesFromQuery: string[] = []
  let secondLevelAliases: string[] = []
  const thirdLevelByParent: Record<string, string> = {}

  if (typeof q.path === "string" && q.path.trim() !== "") {
    const segments = q.path
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .filter((p) => p.trim() !== "")

    // Первый уровень
    parentsAliasesFromQuery = segments.slice(0, 1)

    // ИЗМЕНИТЬ: второй уровень может содержать несколько значений через запятую
    if (segments.length > 1) {
      secondLevelAliases = segments[1].split(",").filter((s) => s.trim() !== "")
    }

    // ИЗМЕНИТЬ: третий уровень для каждого родителя второго уровня
    if (segments.length > 2 && secondLevelAliases.length > 0) {
      const thirdLevelSegments = segments[2].split(",").filter((s) => s.trim() !== "")

      // Связываем третий уровень с родителями второго
      thirdLevelSegments.forEach((thirdAlias) => {
        const itemWithThisChild = catalogStore.items.find(
          (item) =>
            item.parents.length > 2 &&
            item.parents[2]?.alias === thirdAlias &&
            secondLevelAliases.includes(item.parents[1]?.alias),
        )

        if (itemWithThisChild && itemWithThisChild.parents[1]) {
          const parentAlias = itemWithThisChild.parents[1].alias
          thirdLevelByParent[parentAlias] = thirdAlias
        }
      })
    }
  }

  catalogStore.currentFilters.parentsAliases = parentsAliasesFromQuery
  catalogStore.currentFilters.secondLevelAliases = secondLevelAliases // ДОБАВИТЬ эту строку
  catalogStore.currentFilters.thirdLevelByParent = thirdLevelByParent

  // Остальная логика остается без изменений
  if (typeof q.color === "string" && q.color.trim() !== "") {
    const colorCode = q.color.trim()
    const colorKey = catalogStore.items.find((item) =>
      item.keys?.some((k) => k.type === "color" && k.alias === colorCode),
    )
    const colorName =
      colorKey?.keys?.find((k) => k.type === "color" && k.alias === colorCode)?.name ||
      catalogStore.items.find((item) => item.colorVal === colorCode)?.colorName ||
      ""
    const colorValue = colorKey?.keys?.find((k) => k.type === "color" && k.alias === colorCode)?.value || colorCode
    catalogStore.currentFilters.colors = [{ code: colorCode, name: colorName, value: colorValue }]
  } else {
    catalogStore.currentFilters.colors = []
  }

  if (typeof q.material === "string" && q.material.trim() !== "") {
    catalogStore.currentFilters.materials = q.material
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m !== "")
  } else {
    catalogStore.currentFilters.materials = []
  }

  if (typeof q.query === "string") {
    catalogStore.currentFilters.searchQuery = q.query.trim()
  } else {
    catalogStore.currentFilters.searchQuery = ""
  }

  if (typeof q.sortType === "string" && q.sortType.trim() !== "") {
    catalogStore.currentFilters.sortType = q.sortType.trim()
  } else {
    catalogStore.currentFilters.sortType = null
  }

  catalogStore.currentFilters.extra = {}
}

// Инициализация скролла
const loadMoreObserver = ref<IntersectionObserver | null>(null)
const loadMoreTrigger = ref<HTMLElement | null>(null)

const setupInfiniteScroll = () => {
  if (loadMoreObserver.value) {
    loadMoreObserver.value.disconnect()
  }

  loadMoreObserver.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && catalogStore.currentVisibleCardCount < catalogStore.filteredItems.length) {
          load()
        }
      })
    },
    {
      rootMargin: "200px", // Начинаем загрузку за 200px до конца
      threshold: 0.1,
    },
  )

  if (loadMoreTrigger.value) {
    loadMoreObserver.value.observe(loadMoreTrigger.value)
  }
}

onMounted(async () => {
  // Загружаем товары и применяем фильтры после загрузки
  await catalogStore.loadItems()
  applyFiltersFromQuery(route.query)

  // Сбрасываем флаг, если он был установлен
  catalogStore.shouldResetCount = false // <- ДОБАВИТЬ ЭТУ СТРОКУ

  // Восстанавливаем позицию скролла, если возвращаемся на страницу
  nextTick(() => {
    if (scrollPosition.value > 0) {
      window.scrollTo(0, scrollPosition.value)
    }
    setupInfiniteScroll()
  })
})

onBeforeUnmount(() => {
  // Сохраняем текущую позицию скролла
  scrollPosition.value = window.scrollY

  if (loadMoreObserver.value) {
    loadMoreObserver.value.disconnect()
  }
})

// Следим за изменениями query параметров
watch(
  () => route.query,
  (q) => {
    // Применяем фильтры только если товары уже загружены
    if (catalogStore.items.length > 0) {
      applyFiltersFromQuery(q)
      // Сбрасываем счетчик только если был установлен флаг
      if (catalogStore.shouldResetCount) {
        // <- ИЗМЕНИТЬ ЭТИ СТРОКИ
        catalogStore.currentVisibleCardCount = 12
        catalogStore.shouldResetCount = false
      }
      nextTick(() => {
        setupInfiniteScroll()
      })
    }
  },
  { immediate: false },
)

// Пересоздаем observer при изменении количества отображаемых карточек
watch(
  () => catalogStore.currentVisibleCardCount,
  () => {
    nextTick(() => {
      setupInfiniteScroll()
    })
  },
)

const breadcrumsItems = computed(() => {
  const items: { name: string; path?: string }[] = [
    { name: "Главная", path: "/" },
    { name: "Смотреть все", path: "/catalog" },
  ]

  const pathFromQuery = route.query.path
  if (typeof pathFromQuery === "string" && pathFromQuery.trim() !== "") {
    const segments = pathFromQuery
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .filter((p) => p.trim() !== "")

    // Первый уровень
    if (segments.length > 0) {
      const firstLevelAlias = segments[0]
      const category = catalogStore.items
        .flatMap((item) => item.parents || [])
        .find((parent) => parent.alias === firstLevelAlias)

      items.push({
        name: category?.name || firstLevelAlias.charAt(0).toUpperCase() + firstLevelAlias.slice(1).replace(/-/g, " "),
        path: `/catalog?path=${firstLevelAlias}`,
      })
    }

    // ИЗМЕНИТЬ: Второй уровень (все элементы в одном breadcrumb через запятую)
    if (segments.length > 1) {
      const secondLevelAliases = segments[1].split(",").filter((s) => s.trim() !== "")

      if (secondLevelAliases.length > 0) {
        const names = secondLevelAliases.map((secondAlias) => {
          const category = catalogStore.items
            .flatMap((item) => item.parents || [])
            .find((parent) => parent.alias === secondAlias)

          return category?.name || secondAlias.charAt(0).toUpperCase() + secondAlias.slice(1).replace(/-/g, " ")
        })

        items.push({
          name: names.join(", "),
          path: `/catalog?path=${segments[0]}/${segments[1]}`,
        })
      }
    }

    // ИЗМЕНИТЬ: Третий уровень (все элементы в одном breadcrumb через запятую)
    if (segments.length > 2) {
      const thirdLevelAliases = segments[2].split(",").filter((s) => s.trim() !== "")

      if (thirdLevelAliases.length > 0) {
        const names = thirdLevelAliases.map((thirdAlias) => {
          const category = catalogStore.items
            .flatMap((item) => item.parents || [])
            .find((parent) => parent.alias === thirdAlias)

          return category?.name || thirdAlias.charAt(0).toUpperCase() + thirdAlias.slice(1).replace(/-/g, " ")
        })

        items.push({
          name: names.join(", "),
          path: `/catalog?path=${segments[0]}/${segments[1]}/${segments[2]}`,
        })
      }
    }
  }

  return items
})

const visibleItems = computed(() => {
  return catalogStore.filteredItems.slice(0, catalogStore.currentVisibleCardCount)
})

const load = () => {
  const newCount = catalogStore.currentVisibleCardCount + 12
  catalogStore.currentVisibleCardCount = Math.min(newCount, catalogStore.filteredItems.length)
}

const pendingFilteredCount = computed(() => {
  return catalogStore.getPendingFilteredCount()
})

const hasMoreItems = computed(() => {
  return catalogStore.currentVisibleCardCount < catalogStore.filteredItems.length
})
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D]">
    <div
      v-if="!isMobile"
      class="flex justify-between px-4 py-6"
    >
      <AppBreadcrumbs :items="breadcrumsItems" />
      <div class="flex gap-4 items-center">
        <button
          class="cursor-pointer flex items-center justify-center w-6 h-6"
          :disabled="catalogStore.isLoading"
          @click="
            async () => {
              catalogStore.syncPending()
              popupStore.open('filter')
            }
          "
        >
          <div class="sliders-icon" />
        </button>
        <SelectButton
          v-model="catalogStore.desktopStrokeCardCount"
          :variants="['4', '6']"
        />
      </div>
    </div>
    <div
      v-else
      class="flex justify-between items-center p-2 sticky top-[32px] bg-[#FFFFFA] z-[8]"
    >
      <SelectButton
        v-model="catalogStore.mobileStrokeCardCount"
        :variants="['2', '3']"
      />
      <span class="text-[10px] font-light font-[Commissioner]"><AppBreadcrumbs :items="breadcrumsItems" /></span>
      <div class="flex items-center gap-1">
        <span class="text-[11px] font-[Manrope]" />
        <button
          class="cursor-pointer flex items-center font-[Manrope] text-xs text-[#211D1D]"
          :disabled="catalogStore.isLoading"
          @click="
            async () => {
              catalogStore.syncPending()
              popupStore.open('filter')
            }
          "
        >
          {{ `(${pendingFilteredCount})` }}
          <div class="sliders-icon w-[21px] h-[21px]" />
        </button>
      </div>
    </div>
    <div
      v-if="catalogStore.filteredItems.length === 0 && !catalogStore.isLoading"
      class="flex justify-center items-center py-10 text-[#211D1D]/60"
    >
      <p>
        Ничего не найдено{{ route.query.query ? ` по запросу "${route.query.query}"` : "" }}. Попробуйте другой поиск.
      </p>
    </div>
    <div
      v-if="catalogStore.isLoading"
      class="flex justify-center items-center py-10 text-[#211D1D]/60"
    >
      <p>Загрузка товаров...</p>
    </div>
    <div
      v-if="currentCardCount === '4' || currentCardCount === '2'"
      class="overflow-hidden grid grid-cols-2 px-2 gap-x-1 gap-y-2 sm:grid-cols-4 sm:px-4 sm:gap-x-4 sm:gap-y-6"
    >
      <template v-if="!catalogStore.isLoading">
        <template
          v-for="(item, index) in visibleItems"
          :key="item.id"
        >
          <template v-if="index === 8 && isMobile && videoData1">
            <VideoBanner
              :video-data="videoData1"
              text="SS26 solar power"
              custom-class="rounded-lg aspect-[1] col-span-2 sm:hidden"
              link="/collections/collection"
            />
          </template>
          <template v-else-if="index === 16 && isMobile && videoData2">
            <VideoBanner
              :video-data="videoData2"
              text="SS26 solar power"
              custom-class="rounded-lg aspect-[1] col-span-2 sm:hidden"
              link="/collections/collection"
            />
          </template>
          <CatalogCard
            :id="item.id"
            variant="large"
            link
          />
        </template>
      </template>
    </div>
    <div
      v-else
      class="overflow-hidden grid grid-cols-3 px-2 gap-x-1 gap-y-2 sm:grid-cols-6 sm:px-4 sm:gap-x-4 sm:gap-y-6"
    >
      <template v-if="!catalogStore.isLoading">
        <template
          v-for="item in visibleItems"
          :key="item.id"
        >
          <CatalogCard
            :id="item.id"
            variant="mini"
            link
          />
        </template>
      </template>
    </div>

    <!-- Триггер для бесконечного скролла -->
    <div
      v-if="hasMoreItems && !catalogStore.isLoading"
      ref="loadMoreTrigger"
      class="flex justify-center items-center py-4"
    >
      <div class="text-[#211D1D]/60 text-sm">Загрузка...</div>
    </div>

    <div
      v-else-if="!catalogStore.isLoading && catalogStore.filteredItems.length > 0"
      class="pt-4 pb-2 sm:py-10"
    />

    <AppSEO
      :paragraphs="[
        'CASA AL MARE — эстетика тела, свобода выбора. Каталог CASA AL MARE создан для женщин, которые ищут не просто купальник или комплект белья, а выражение своей индивидуальности.\n' +
          'Мы создаём коллекции, вдохновлённые побережьями, архитектурой юга и непринуждённой элегантностью.',
        'В каталоге CASA AL MARE вы найдете:\n' +
          'купальники: раздельные и слитные;\n' +
          'комплекты нижнего белья: браллеты, трусики, боди;\n' +
          'аксессуары: пляжные полотенца, сумки, косметички.\n' +
          'мы используем премиальные материалы, адаптированные к разным типам фигуры и формам.\n' +
          'каждое изделие проходит ручную проверку, а дизайн продуман до мелочей.',
        'Быстрая доставка по всей России и миру. Поддержка клиентов работает ежедневно. Вся продукция произведена с заботой об экологии.\n' +
          'Выбирайте купальники и бельё CASA AL MARE — сочетание модных решений, комфорта и женственности.\n' +
          'Следите за новыми коллекциями, подписывайтесь на наш telegram, vk и открывайте красоту каждый день.',
      ]"
    />
    <AppPopup
      title="Фильтр и сортировка"
      popup-id="filter"
    >
      <div class="mt-6 flex flex-col gap-10 sm:mt-10">
        <div class="flex flex-col gap-4 sm:gap-6">
          <template
            v-for="(levelOptions, levelIndex) in catalogStore.popupDynamicFilters.pathLevels.slice(0, 2)"
            :key="`level-${levelIndex}`"
          >
            <div
              v-if="
                levelOptions.length > 0 &&
                (catalogStore.pendingFilters.parentsAliases || [])
                  .slice(0, levelIndex)
                  .filter((seg) => seg && typeof seg === 'string' && seg.trim() !== '').length === levelIndex
              "
              class="flex flex-col items-center gap-4 sm:gap-6"
            >
              <h3
                v-if="catalogStore.popupDynamicFilters.pathLevelNames[levelIndex]"
                class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase"
              >
                {{ catalogStore.popupDynamicFilters.pathLevelNames[levelIndex] }}
              </h3>

              <!-- ИЗМЕНИТЬ: для первого уровня (levelIndex === 0) используем SingleSelectButton -->
              <template v-if="levelIndex === 0">
                <div
                  v-if="levelOptions.some((opt) => opt.image && opt.image.trim() !== '')"
                  class="flex gap-6 items-center justify-center"
                >
                  <ImageButton
                    :model-value="catalogStore.pendingFilters.parentsAliases[levelIndex] || ''"
                    :items="
                      levelOptions.map((opt) => ({
                        alias: opt.alias,
                        name: opt.name,
                        image: opt.image || '',
                        activeImage: opt.activeImage || opt.image || '',
                      }))
                    "
                    @update:model-value="
                      (val) => {
                        catalogStore.pendingFilters.parentsAliases[levelIndex] = val || ''
                      }
                    "
                  />
                </div>
                <div
                  v-else
                  class="flex flex-wrap gap-4 items-center justify-center"
                >
                  <SingleSelectButton
                    :model-value="catalogStore.pendingFilters.parentsAliases[levelIndex] || ''"
                    :content="levelOptions.map((opt) => ({ value: opt.alias, label: opt.name }))"
                    @update:model-value="
                      (val) => {
                        catalogStore.pendingFilters.parentsAliases[levelIndex] = val || ''
                      }
                    "
                  />
                </div>
              </template>

              <!-- ИЗМЕНИТЬ: для второго уровня (levelIndex === 1) используем MultiSelectButton -->
              <template v-else-if="levelIndex === 1">
                <div
                  v-if="levelOptions.some((opt) => opt.image && opt.image.trim() !== '')"
                  class="flex gap-6 items-center justify-center"
                >
                  <ImageButton
                    :model-value="catalogStore.pendingFilters.secondLevelAliases"
                    :items="
                      levelOptions.map((opt) => ({
                        alias: opt.alias,
                        name: opt.name,
                        image: opt.image || '',
                        activeImage: opt.activeImage || opt.image || '',
                      }))
                    "
                    multiple
                    @update:model-value="
                      (val) => {
                        catalogStore.pendingFilters.secondLevelAliases = val
                      }
                    "
                  />
                </div>
                <div
                  v-else
                  class="flex flex-wrap gap-4 items-center justify-center"
                >
                  <MultiSelectButton
                    v-model="catalogStore.pendingFilters.secondLevelAliases"
                    :content="levelOptions.map((opt) => ({ value: opt.alias, label: opt.name }))"
                  />
                </div>
              </template>
            </div>
          </template>

          <template
            v-for="(group, index) in catalogStore.popupDynamicFilters.thirdLevelGroups"
            :key="`third-level-${index}`"
          >
            <div class="flex flex-col items-center gap-4 sm:gap-6">
              <h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">
                {{ group.catName }}
              </h3>
              <div
                v-if="group.options.some((opt) => opt.image && opt.image.trim() !== '')"
                class="flex gap-6 items-center justify-center"
              >
                <ImageButton
                  :model-value="catalogStore.pendingFilters.thirdLevelByParent[group.parentAlias] || ''"
                  :items="
                    group.options.map((opt) => ({
                      alias: opt.alias,
                      name: opt.name,
                      image: opt.image || '',
                      activeImage: opt.activeImage || opt.image || '',
                    }))
                  "
                  @update:model-value="
                    (val) => {
                      catalogStore.pendingFilters.thirdLevelByParent[group.parentAlias] = val
                    }
                  "
                />
              </div>
              <div
                v-else
                class="flex flex-wrap gap-4 items-center justify-center"
              >
                <SingleSelectButton
                  :model-value="catalogStore.pendingFilters.thirdLevelByParent[group.parentAlias] || ''"
                  :content="group.options.map((opt) => ({ value: opt.alias, label: opt.name }))"
                  @update:model-value="
                    (val) => {
                      catalogStore.pendingFilters.thirdLevelByParent[group.parentAlias] = val
                    }
                  "
                />
              </div>
            </div>
          </template>
        </div>
        <div class="flex flex-col items-center gap-4 sm:gap-6">
          <h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">
            Цвет
          </h3>
          <div
            v-if="catalogStore.popupDynamicFilters.colors.length > 0"
            class="grid grid-cols-4 gap-4 items-center justify-center"
          >
            <ColorButton
              v-model="catalogStore.pendingFilters.colors"
              :colors="catalogStore.popupDynamicFilters.colors"
              text
            />
          </div>
          <p
            v-else
            class="text-[#211D1D]/60 text-sm"
          >
            Нет доступных вариантов в этой категории
          </p>
        </div>
        <div class="flex flex-col items-center gap-4 sm:gap-6">
          <h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">
            Материал
          </h3>
          <div
            v-if="catalogStore.popupDynamicFilters.materials.length > 0"
            class="flex flex-wrap gap-4 items-center justify-center"
          >
            <MultiSelectButton
              v-model="catalogStore.pendingFilters.materials"
              :content="catalogStore.popupDynamicFilters.materials.map((m) => ({ value: m.alias, label: m.name }))"
            />
          </div>
          <p
            v-else
            class="text-[#211D1D]/60 text-sm"
          >
            Нет доступных вариантов в этой категории
          </p>
        </div>
        <div
          v-if="Object.keys(catalogStore.popupDynamicFilters.extraFilters).length > 0"
          class="flex flex-col gap-4 sm:gap-6"
        >
          <template
            v-for="(extraGroup, groupKey) in catalogStore.popupDynamicFilters.extraFilters"
            :key="groupKey"
          >
            <div class="flex flex-col items-center gap-4 sm:gap-6">
              <h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">
                {{ groupKey }}
              </h3>
              <div class="flex flex-wrap gap-4 items-center justify-center">
                <MultiSelectButton
                  v-model="catalogStore.pendingFilters.extra[groupKey]"
                  :content="extraGroup.map((opt) => ({ value: opt.alias, label: opt.name }))"
                />
              </div>
            </div>
          </template>
        </div>
        <div class="flex flex-col items-center gap-4 sm:gap-6">
          <h3 class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase">
            Цена
          </h3>
          <div class="flex flex-col items-center gap-4">
            <div class="flex flex-wrap gap-4 items-center justify-center">
              <SingleSelectButton
                v-model="catalogStore.pendingFilters.sortType"
                :content="catalogStore.filters.sortTypes"
              />
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4 sm:pt-6">
          <AppButton
            custom-class="py-4 px-4 sm:px-8"
            content="Сбросить"
            @click="
              () => {
                catalogStore.reset()
                popupStore.close()
              }
            "
          />
          <AppButton
            custom-class="w-full py-4 sm:p-4"
            variant="primary"
            :content="`(${pendingFilteredCount}) Показать результаты`"
            extra
            @click="
              () => {
                catalogStore.applyFilters()
                popupStore.close()
              }
            "
          />
        </div>
      </div>
    </AppPopup>
  </main>
</template>

<style scoped>
.sliders-icon {
  background-image: url("/sliders.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
}
</style>
