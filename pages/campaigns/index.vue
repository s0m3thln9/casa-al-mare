<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

const docsStore = useDocsStore()
const popupStore = usePopupStore()
const setStore = useSetStore()

const campaignsBranch = computed(() => docsStore.tree?.data?.campaigns)
const campaignItems = computed(() => {
  if (!campaignsBranch.value?.subitems) return []
  return Object.values(campaignsBranch.value.subitems)
})

const breadcrumsItems: { name: string; path?: string }[] = [
  { name: "Главная", path: "/" },
  { name: "CAMPAIGNS" },
]

const selectedSetItems = ref([])

const openSetPopup = (node) => {
  if (!node.set || !Array.isArray(node.set)) return
  
  setStore.clear()
  
  const items = node.set
    .map(id => docsStore.findDocById(docsStore.tree?.data, id))
    .filter((item) => item !== null)
  
  selectedSetItems.value = items
  
  const ids = items.map(item => String(item.id))
  setStore.setRequiredTypes(ids)
  
  popupStore.open('set')
}

const isAllSelected = computed(() => {
  if (selectedSetItems.value.length === 0) return false
  return selectedSetItems.value.every(item =>
    setStore.items[item.id] && setStore.items[item.id].trim() !== ""
  )
})

const itemsForPurchase = computed(() => {
  return selectedSetItems.value.map(item => ({
    id: Number(item.id),
    size: setStore.items[item.id] || ""
  }))
})

const missingParamLabel = computed(() => {
  if (isAllSelected.value) return null
  const missing = selectedSetItems.value.find(item => !setStore.items[item.id])
  return missing ? missing.pagetitle : 'все параметры'
})

onMounted(async () => {
  if (!docsStore.tree) {
    await docsStore.fetchTree()
  }
})

const getCardClass = (index: number) => {
  const isWide = index === 2 || index === 7
  return isWide ? "rounded-lg aspect-[936/680] col-span-2" : "rounded-lg aspect-[460/680]"
}

const pageTitle = computed(() => docsStore.tree?.data?.campaigns?.pagetitle)
const description = computed(() => docsStore.tree?.data?.campaigns?.description ?? "")
const metatags = computed(() =>
  docsStore.tree?.data?.campaigns?.metatags?.map(tag => ({ property: tag.name,
    content: tag.content, })) ?? [] )

useHead({
  title: pageTitle,
  meta: computed(() => [
    { name: "description", content: description.value },
    ...metatags.value,
  ]),
})

</script>

<template>
  <main class="mb-5 font-[Manrope] bg-[#FFFFFA] text-[#211D1D] sm:mb-10">
    <div class="p-2 sm:px-4 sm:py-6">
      <AppBreadcrumbs :items="breadcrumsItems" />
    </div>
    
    <h2 class="uppercase text-center font-[Inter] text-[17px]">Campaigns</h2>

    <div v-if="docsStore.loading" class="text-center py-10">Загрузка...</div>

    <div v-else class="grid grid-cols-2 mt-4 px-2 gap-2 sm:gap-4 sm:px-4 sm:mt-10 md:grid-cols-4">
      <template v-for="(item, index) in campaignItems" :key="item.id">
        <VideoBanner
          v-if="item.video && item.video.length > 0"
          :video-data="{ pc: item.video[0], mob: item.video[0] }"
          :custom-class="getCardClass(index)"
        />
        
        <BannerCard
          v-else
          :image-url="item.image ? `https://back.casaalmare.com/assets/images/${item.id}/${item.image}` : ''"
          plus
          :custom-class="getCardClass(index)"
          :object-position="index === 2 ? '50% 70%' : 'center'"
          @click="openSetPopup(item)"
        />
      </template>
    </div>

    <AppPopup title="Собрать комплект" popup-id="set">
      <div class="flex flex-col gap-6 mt-6">
        <div class="grid grid-cols-2 gap-y-6 gap-x-4 sm:gap-x-2">
          <div v-for="product in selectedSetItems" :key="product.id" class="flex flex-col gap-2">
            <CatalogCard
              :id="product.id"
              v-model="setStore.items[product.id]"
              custom-image-class="aspect-[200/300] w-full"
              popup
              :slider-images="product.image ? [`https://back.casaalmare.com/assets/images/${product.id}/${product.image}`] : []"
              variant="mini"
              :price="product.price || 0"
              :old-price="product.old_price"
              color="Базовый"
              :name="product.pagetitle"
            />
          </div>
        </div>
        
        <div v-if="selectedSetItems.length === 0" class="text-center text-gray-400">
          В данном комплекте пока нет товаров
        </div>

        <BuyButton
          v-else
          :items="itemsForPurchase"
          :is-parameters-selected="isAllSelected"
          :missing-params="missingParamLabel"
          available-quantity
          in-stock
        />
      </div>
    </AppPopup>
  </main>
</template>