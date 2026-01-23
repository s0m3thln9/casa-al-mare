<script setup lang="ts">
const route = useRoute()
const docsStore = useDocsStore()

const articleAlias = computed(() => route.params.alias as string)

const { data: treeData } = await useFetch(
  "https://back.casaalmare.com/api/getdocTree"
)

const subitems = computed(() =>
  Object.values(docsStore.tree?.data?.blog?.subitems ?? {})
)

const article = computed(() => {
  const alias = articleAlias.value
  if (!alias) return null
  
  return treeData.value?.data?.blog?.subitems?.[alias] ?? null
})

const pageTitle = computed(() => article.value?.pagetitle ?? "")
const description = computed(() => article.value?.description ?? "")

const articleContent = computed(() => article.value?.content ?? "")

const randomOtherArticles = computed(() => {
  if (!article.value) return []
  
  const others = subitems.value.filter(
    item => item.id !== article.value!.id
  )
  
  const shuffled = [...others].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 3)
})

const metaTags = computed(() => {
  const tags: Record<string, any> = {}
  
  article.value?.metatags?.forEach(tag => {
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

// Функция для обновления SEO
const updateSeo = () => {
  useSeoMeta({
    title: pageTitle.value,
    description: description.value,
    ...metaTags.value
  })
}

// Обновляем SEO при монтировании и при изменении статьи
updateSeo()

watch(article, () => {
  updateSeo()
}, { immediate: true })

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const breadcrumsItems = computed(() => [
  { name: "Главная", path: "/" },
  { name: "Блог", path: "/blog" },
  { name: article.value?.pagetitle ?? "" },
])
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] mb-6 sm:mb-4">
    <div class="p-2 sm:px-4 sm:py-6">
      <AppBreadcrumbs :items="breadcrumsItems" />
    </div>

    <div class="px-2 sm:px-4 grid grid-cols-1 gap-10 items-start lg:grid-cols-[minmax(auto,618px)_1fr] lg:gap-20">
      
      <div class="flex flex-col items-center pt-4 lg:sticky lg:top-16 lg:h-fit">
        <NuxtImg
          v-if="article?.image"
          :src="article.image"
          :alt="article.pagetitle"
          width="618"
          height="570"
          class="rounded-lg object-cover aspect-[618/570] w-full"
        />
        <h1 class="mt-6 font-[Inter] text-2xl sm:text-4xl text-center">{{ article?.pagetitle }}</h1>
        <span class="text-sm font-light text-[#8C8785] sm:text-base sm:font-normal mt-2">
          {{ formatDate(article?.createdon) }}
        </span>
      </div>

      <div class="max-w-[900px] flex flex-col gap-6">
        <div
          class="article-content font-light text-sm sm:text-base leading-relaxed"
          v-html="articleContent"
        />
      </div>
    </div>

    <div v-if="randomOtherArticles.length" class="mt-30 mb-8 hidden lg:block">
      <h2 class="font-[Inter] text-4xl text-center">Другие статьи</h2>
      <div class="flex px-4 mt-8 gap-4 overflow-x-auto">
        <BannerCard
          v-for="item in randomOtherArticles"
          :key="item.id"
          :text="item.pagetitle"
          custom-class="rounded-lg aspect-[618/570] max-w-[33%]"
          :link="`/blog/${item.alias}`"
          :image-url="item.image"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.article-content :deep(h2) {
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 24px;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #211D1D;
}

@media (min-width: 640px) {
  .article-content :deep(h2) {
    font-size: 1.5rem;
  }
}

.article-content :deep(p) {
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 14px;
  font-family: "Manrope", sans-serif;
  font-weight: 300;
  color: #211D1D;
}

.article-content :deep(img) {
  border-radius: 0.5rem;
  max-width: 100%;
  height: auto;
  margin: 2rem 0;
  display: block;
}

.article-content :deep(p img) {
  border-radius: 0.5rem;
  max-width: 100%;
  height: auto;
  margin: 2rem auto;
  display: block;
}

.article-content :deep(blockquote div) {
  display: flex;
  gap: 1rem;
}


.article-content :deep(blockquote img) {
  max-width: calc(50% - 1rem);
  width: auto !important;
  height: auto !important;
}

.article-content :deep(blockquote p) {
  display: flex;
  gap: 1rem;
}

.article-content :deep(blockquote) {
  display: flex;
  gap: 1rem;
}

.article-content :deep(blockquote img) {
  max-width: calc(50% - 1rem);
  width: auto !important;
  height: auto !important;
}

@media screen and (max-width: 640px) {
  .article-content :deep(blockquote div) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .article-content :deep(blockquote p) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .article-content :deep(blockquote) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .article-content :deep(blockquote img) {
    max-width: 100%;
    width: auto !important;
    height: auto !important;
  }
}

.article-content :deep(ul) {
  list-style: none;
}

.article-content :deep(ul li) {
  position: relative;
  padding-left: 24px;
}

.article-content :deep(ul li)::before {
  content: "*";
  position: absolute;
  left: 0;
  top: 0;
  color: #0A0E11;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 36px;
  line-height: 1;
}

.article-content :deep(li) {
  font-size: 14px;
  font-family: "Manrope", sans-serif;
  font-weight: 300;
  color: #211D1D;
}
</style>