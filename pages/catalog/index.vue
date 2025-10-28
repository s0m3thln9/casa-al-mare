<script setup lang="ts">
const images = {
  card1: "/card-1.jpg",
  card2: "/card-2.jpg",
  card3: "/card-3.jpg",
  promo1: "/promo-1.jpg",
}

const popupStore = usePopupStore()
const catalogStore = useCatalogStore()
const viewport = useViewport()
const isMobile = computed(() => viewport.isLessThan("sm"))

const currentCardCount = computed(() =>
  isMobile.value ? catalogStore.mobileStrokeCardCount : catalogStore.desktopStrokeCardCount,
)

const route = useRoute()

const applyFiltersFromQuery = (q: any) => {
  let parentsAliasesFromQuery: string[][] = []
  const thirdLevelByParent: Record<string, string[]> = {}

  if (typeof q.path === "string" && q.path.trim() !== "") {
    const segments = q.path
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .filter((p) => p.trim() !== "")
      .map((segment) => segment.split(",").filter((alias) => alias.trim() !== ""))

    parentsAliasesFromQuery = segments.slice(0, 2)

    if (segments.length > 2 && parentsAliasesFromQuery.length === 2) {
      const thirdLevelAliases = segments[2]
      const secondLevelParents = parentsAliasesFromQuery[1]

      thirdLevelAliases.forEach((thirdAlias) => {
        const itemWithThisChild = catalogStore.items.find(
          (item) =>
            item.parents.length > 2 &&
            item.parents[2]?.alias === thirdAlias &&
            secondLevelParents.some((parentAlias) => item.parents[1]?.alias === parentAlias),
        )

        if (itemWithThisChild && itemWithThisChild.parents[1]) {
          const parentAlias = itemWithThisChild.parents[1].alias
          if (!thirdLevelByParent[parentAlias]) {
            thirdLevelByParent[parentAlias] = []
          }
          if (!thirdLevelByParent[parentAlias].includes(thirdAlias)) {
            thirdLevelByParent[parentAlias].push(thirdAlias)
          }
        }
      })
    }
  }

  catalogStore.currentFilters.parentsAliases = parentsAliasesFromQuery
  catalogStore.currentFilters.thirdLevelByParent = thirdLevelByParent

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
    catalogStore.currentFilters.materials = q.material.trim()
  } else {
    catalogStore.currentFilters.materials = ""
  }

  if (typeof q.query === "string") {
    catalogStore.currentFilters.searchQuery = q.query.trim()
  } else {
    catalogStore.currentFilters.searchQuery = ""
  }

  if (typeof q.maxPrice === "string" && q.maxPrice.trim() !== "") {
    catalogStore.currentFilters.maxPrice = q.maxPrice.trim()
  } else {
    catalogStore.currentFilters.maxPrice = null
  }

  if (typeof q.sortType === "string" && q.sortType.trim() !== "") {
    catalogStore.currentFilters.sortType = q.sortType.trim()
  } else {
    catalogStore.currentFilters.sortType = null
  }

  if (typeof q.inStock === "string" && q.inStock.trim() !== "") {
    catalogStore.currentFilters.inStock = q.inStock.trim()
  } else {
    catalogStore.currentFilters.inStock = null
  }

  if (typeof q.withDiscount === "string" && q.withDiscount.trim() !== "") {
    catalogStore.currentFilters.withDiscount = q.withDiscount.trim()
  } else {
    catalogStore.currentFilters.withDiscount = null
  }

  catalogStore.currentFilters.extra = {}
}

onMounted(async () => {
  // Загружаем товары и применяем фильтры после загрузки
  await catalogStore.loadItems()
  applyFiltersFromQuery(route.query)
  // Синхронизируем pendingFilters с currentFilters после применения
})

// Следим за изменениями query параметров
watch(
  () => route.query,
  (q) => {
    // Применяем фильтры только если товары уже загружены
    if (catalogStore.items.length > 0) {
      applyFiltersFromQuery(q)
    }
  },
  { immediate: false }, // Изменено на false, так как применяем в onMounted
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

    segments.forEach((segment, index) => {
      const aliases = segment.split(",").filter((a) => a.trim() !== "")

      if (aliases.length === 1) {
        // Один алиас - обычное поведение
        const category = catalogStore.items
          .flatMap((item) => item.parents || [])
          .find((parent) => parent.alias === aliases[0])
        const pathSegments = segments.slice(0, index + 1)
        const categoryPath = `/catalog?path=${pathSegments.join("/")}`

        items.push({
          name: category?.name || aliases[0].charAt(0).toUpperCase() + aliases[0].slice(1).replace(/-/g, " "),
          path: categoryPath,
        })
      } else {
        // Несколько алиасов - показываем через запятую
        const names = aliases.map((alias) => {
          const category = catalogStore.items
            .flatMap((item) => item.parents || [])
            .find((parent) => parent.alias === alias)
          return category?.name || alias.charAt(0).toUpperCase() + alias.slice(1).replace(/-/g, " ")
        })

        const pathSegments = segments.slice(0, index + 1)
        const categoryPath = `/catalog?path=${pathSegments.join("/")}`

        items.push({
          name: names.join(", "),
          path: categoryPath,
        })
      }
    })
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
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D]">
    <div
      v-if="!isMobile"
      class="flex justify-between px-4 py-6"
    >
      <AppBreadcrumbs :items="breadcrumsItems" />
      <div class="flex gap-4">
        <button
          class="cursor-pointer"
          @click="
            async () => {
              catalogStore.syncPending()
              popupStore.open('filter')
            }
          "
        >
          <NuxtImg
            src="/sliders.svg"
            alt="sliders"
            width="24"
            height="24"
          />
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
          class="cursor-pointer"
          @click="
            async () => {
              catalogStore.syncPending()
              popupStore.open('filter')
            }
          "
        >
          <NuxtImg
            src="/sliders.svg"
            alt="sliders"
            width="21"
            height="21"
          />
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
      <template
        v-for="(item, index) in visibleItems"
        :key="item.id"
      >
        <template v-if="index > 0 && index % 6 === 0">
          <BannerCard
            :image-url="images.promo1"
            text="SS26 SOLAR POWER"
            custom-class="rounded-lg aspect-[1] col-span-2 sm:hidden"
            object-position="center"
          />
        </template>
        <CatalogCard
          :id="item.id"
          variant="large"
          link
        />
      </template>
    </div>
    <div
      v-else
      class="overflow-hidden grid grid-cols-3 px-2 gap-x-1 gap-y-2 sm:grid-cols-6 sm:px-4 sm:gap-x-4 sm:gap-y-6"
    >
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
    </div>
    <div
      v-if="catalogStore.currentVisibleCardCount < catalogStore.filteredItems.length"
      class="flex justify-center items-center pt-4 pb-2 sm:py-10"
    >
      <LoadButton
        content="Показать больше"
        @click="load"
      />
    </div>
    <div
      v-else
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
                catalogStore.pendingFilters.parentsAliases.slice(0, levelIndex).filter((seg) => seg.length > 0)
                  .length === levelIndex
              "
              class="flex flex-col items-center gap-4 sm:gap-6"
            >
              <h3
                v-if="catalogStore.popupDynamicFilters.pathLevelNames[levelIndex]"
                class="font-[Inter] text-[17px] font-light sm:font-[Manrope] sm:font-light sm:text-base sm:uppercase"
              >
                {{ catalogStore.popupDynamicFilters.pathLevelNames[levelIndex] }}
              </h3>
              <div
                v-if="levelOptions.some((opt) => opt.image && opt.image.trim() !== '')"
                class="flex gap-6 items-center justify-center"
              >
                <ImageButton
                  v-model="catalogStore.pendingFilters.parentsAliases[levelIndex]"
                  :items="
                    levelOptions.map((opt) => ({
                      alias: opt.alias,
                      name: opt.name,
                      image: opt.image || '',
                      activeImage: opt.activeImage || opt.image || '',
                    }))
                  "
                  multiple
                />
              </div>
              <div
                v-else
                class="flex flex-wrap gap-4 items-center justify-center"
              >
                <MultiSelectButton
                  v-model="catalogStore.pendingFilters.parentsAliases[levelIndex]"
                  :content="levelOptions.map((opt) => ({ value: opt.alias, label: opt.name }))"
                />
              </div>
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
                  :model-value="catalogStore.pendingFilters.thirdLevelByParent[group.parentAlias] || []"
                  :items="
                    group.options.map((opt) => ({
                      alias: opt.alias,
                      name: opt.name,
                      image: opt.image || '',
                      activeImage: opt.activeImage || opt.image || '',
                    }))
                  "
                  multiple
                  @update:model-value="
                    (val) => {
                      if (!catalogStore.pendingFilters.thirdLevelByParent[group.parentAlias]) {
                        catalogStore.pendingFilters.thirdLevelByParent[group.parentAlias] = []
                      }
                      catalogStore.pendingFilters.thirdLevelByParent[group.parentAlias] = val
                    }
                  "
                />
              </div>
              <div
                v-else
                class="flex flex-wrap gap-4 items-center justify-center"
              >
                <MultiSelectButton
                  :model-value="catalogStore.pendingFilters.thirdLevelByParent[group.parentAlias] || []"
                  :content="group.options.map((opt) => ({ value: opt.alias, label: opt.name }))"
                  @update:model-value="
                    (val) => {
                      if (!catalogStore.pendingFilters.thirdLevelByParent[group.parentAlias]) {
                        catalogStore.pendingFilters.thirdLevelByParent[group.parentAlias] = []
                      }
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
            <SingleSelectButton
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
                v-model="catalogStore.pendingFilters.maxPrice"
                :content="catalogStore.filters.maxPrices"
              />
            </div>
            <div class="flex flex-wrap gap-4 items-center justify-center">
              <SingleSelectButton
                v-model="catalogStore.pendingFilters.sortType"
                :content="catalogStore.filters.sortTypes"
              />
              <SingleSelectButton
                v-model="catalogStore.pendingFilters.inStock"
                :content="catalogStore.filters.inStock"
              />
              <SingleSelectButton
                v-model="catalogStore.pendingFilters.withDiscount"
                :content="catalogStore.filters.withDiscount"
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
            content="Показать результаты"
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

<style scoped></style>
