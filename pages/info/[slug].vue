<script setup lang="ts">
import { useRoute } from "vue-router"

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const docsStore = useDocsStore()

const { data: treeData } = await useFetch(
  "https://back.casaalmare.com/api/getdocTree"
)

const doc = computed(() => {
  const slugValue = slug.value
  if (!slugValue || !treeData.value?.data) return null
  
  // Ищем документ по slug во всех ветках
  const findDoc = (obj: any): any => {
    if (!obj) return null
    
    for (const key in obj) {
      const item = obj[key]
      if (item && typeof item === 'object') {
        if (item.alias === slugValue) return item
        if (item.subitems) {
          const found = findDoc(item.subitems)
          if (found) return found
        }
      }
    }
    return null
  }
  
  return findDoc(treeData.value.data)
})

const breadcrumbsItems = computed(() => [
  { name: "Главная", path: "/" },
  { name: doc.value?.pagetitle || "Не найдено" },
])

const pageTitle = computed(() => doc.value?.pagetitle ?? "")
const description = computed(() => doc.value?.description ?? "")

const metaTags = computed(() => {
  const tags: Record<string, any> = {}
  
  doc.value?.metatags?.forEach(tag => {
    if (tag.name.startsWith('og:')) {
      const ogKey = tag.name.replace('og:', '')
      const camelCaseKey = 'og' + ogKey.charAt(0).toUpperCase() + ogKey.slice(1)
      tags[camelCaseKey] = tag.content
    } else if (tag.name.startsWith('twitter:')) {
      const twitterKey = tag.name.replace('twitter:', '')
      const camelCaseKey = 'twitter' + twitterKey.charAt(0).toUpperCase() + twitterKey.slice(1)
      tags[camelCaseKey] = tag.content
    } else {
      tags[tag.name] = tag.content
    }
  })
  
  return tags
})

const updateSeo = () => {
  useSeoMeta({
    title: pageTitle.value,
    description: description.value,
    ...metaTags.value
  })
}

updateSeo()

const handleAccordionClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const header = target.closest('.accordeon .header') as HTMLElement | null
  if (!header) return
  
  const accordeon = header.closest('.accordeon') as HTMLElement
  accordeon.classList.toggle('open')
}

watch(doc, () => {
  updateSeo()
}, { immediate: true })
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] px-2 py-6 sm:pb-3 sm:px-4 lg:py-8">
    <div class="py-2 sm:py-6">
      <AppBreadcrumbs :items="breadcrumbsItems" />
    </div>
    <div
      v-if="docsStore.loading"
      class="flex flex-col items-center justify-center min-h-[400px]"
    >
      <p class="text-lg">Загрузка...</p>
    </div>
    <div
      v-else-if="doc"
      class="flex flex-col items-center"
    >
      <h2 class="uppercase mb-6 font-[Inter] text-[17px]">{{ doc.pagetitle }}</h2>
      <div
        class="prose prose-lg max-w-4xl w-full px-4 content"
        @click="handleAccordionClick"
        v-html="doc.content"
      />
    </div>
    <div
      v-else-if="docsStore.error"
      class="flex flex-col items-center justify-center min-h-[400px]"
    >
      <h2 class="uppercase mb-6 text-2xl font-bold">Ошибка загрузки</h2>
      <p class="text-red-500">{{ docsStore.error }}</p>
      <button
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        @click="docsStore.fetchTree"
      >
        Повторить
      </button>
    </div>
    <div
      v-else
      class="flex flex-col items-center justify-center min-h-[400px]"
    >
      <h2 class="uppercase mb-6 text-2xl font-bold">Страница не найдена</h2>
      <NuxtLink
        to="/"
        class="text-blue-500 hover:underline"
        >Вернуться на главную</NuxtLink
      >
    </div>
  </main>
</template>

<style scoped>
.content {
  font-family: "Manrope", sans-serif;
  color: #211d1d;
}

.content :deep(p) {
  font-size: 14px;
  font-weight: 300;
}

.content :deep(h1),
.content :deep(h2),
.content :deep(h3),
.content :deep(h4),
.content :deep(h5),
.content :deep(h6) {
  font-size: 20px;
  color: #0a0e11;
  margin: 32px 0 8px;
}

.content :deep(ol),
.content :deep(ul) {
  font-size: 14px;
  color: #211d1d;
  line-height: 134%;
}

.content :deep(ol):last-child,
.content :deep(ul):last-child {
  margin-bottom: 0;
}

.content :deep(ol) {
  list-style: none;
  counter-reset: item;
}

.content :deep(ul) {
  list-style-type: disc;
  list-style-position: inside;
}

.content :deep(ol li),
.content :deep(ul li) {
  margin-bottom: 4px;
  color: #211d1d;
  display: flex;
  align-items: flex-start;
}

.content :deep(ol li) {
  counter-increment: item;
}

.content :deep(a) {
  text-decoration: underline;
}

.content :deep(ol li::before) {
  content: counter(item) ". ";
  color: #211d1d;
  flex-shrink: 0;
  font-weight: 300;
  margin-right: 4px;
  line-height: 134%;
}

.content :deep(ul > li > ul) {
  padding-left: 16px;
  list-style-type: circle;
}

.content :deep(ul > li > ul > li > ul) {
  padding-left: 32px;
  list-style-type: square;
}

.content :deep(.accordeonWrapper) {
  border: 1px solid #BBB8B6;
  border-radius: 16px;
  overflow: hidden;
  padding: 16px;
}

.content :deep(.accordeon) {
  border-bottom: 1px solid rgba(187, 184, 182, 0.5);
  overflow: hidden;
  padding-top: 16px;
  padding-bottom: 16px;
  transition: padding-bottom 300ms ease;
}

.content :deep(.accordeon.open) {
  padding-bottom: 12px;
}

.content :deep(.accordeon):last-child {
  border-bottom: none;
}

.content :deep(.accordeon):first-child {
  padding-top: 4px;
}

.content :deep(.accordeon .header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-family: "Manrope", sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #211d1d;
  user-select: none;
  padding-bottom: 0px;
  transition: padding-bottom 300ms ease;
}

.content :deep(.accordeon.open .header) {
  padding-bottom: 4px;
}

.content :deep(.accordeon .header::after) {
  content: '';
  background-image: url("/arrow-right.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 0.75rem;
  height: 0.75rem;
  flex-shrink: 0;
  transform: rotate(90deg);
  transition: transform 300ms ease;
}

.content :deep(.accordeon.open .header::after) {
  transform: rotate(270deg);
}

.content :deep(.accordeon .text) {
  max-height: 0;
  font-weight: 400;
  overflow: hidden;
  font-family: "Manrope", sans-serif;
  transition: max-height 300ms ease, padding 300ms ease;
  font-size: 12px;
  color: #363636;
  line-height: 134%;
}

.content :deep(.accordeon.open .text) {
  max-height: 600px;
}

.content :deep(.accordeon .text ul),
.content :deep(.accordeon .text ol) {
  list-style-position: outside;
  padding-left: 16px;
}

.content :deep(.accordeon .text ul li),
.content :deep(.accordeon .text ol li) {
  display: list-item;
  margin-bottom: 0;
}

@media screen and (max-width: 640px) {
  .content :deep(h1),
  .content :deep(h2),
  .content :deep(h3),
  .content :deep(h4),
  .content :deep(h5),
  .content :deep(h6) {
    font-size: 15px;
    font-weight: 300;
    margin: 24px 0 8px;
  }
}
</style>
