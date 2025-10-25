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
      <h2 class="uppercase mb-6 text-2xl font-bold">{{ doc.pagetitle }}</h2>
      <div
        class="prose prose-lg max-w-4xl w-full px-4"
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

<style scoped></style>
