<script setup lang="ts">
import { useRoute } from "vue-router"

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const docsStore = useDocsStore()

const doc = computed(() => docsStore.getDocBySlug(slug.value))

const breadcrumbsItems = computed(() => [
  { name: "Главная", path: "/" },
  { name: "Инфо" },
  { name: doc.value?.pagetitle || "Не найдено" },
])
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
        to="/info"
        class="text-blue-500 hover:underline"
        >Вернуться к инфо</NuxtLink
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
