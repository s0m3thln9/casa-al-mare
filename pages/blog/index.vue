<script setup lang="ts">
import { onMounted } from "vue"

const docsStore = useDocsStore()

const pageTitle = computed(() => docsStore.tree?.data?.blog?.pagetitle)
const description = computed(() => docsStore.tree?.data?.blog?.description ?? "")
const metatags = computed(() =>
  docsStore.tree?.data?.blog?.metatags?.map(tag => ({ property: tag.name,
    content: tag.content, })) ?? [] )

useHead({
  title: pageTitle,
  meta: computed(() => [
    { name: "description", content: description.value },
    ...metatags.value,
  ]),
})

onMounted(async () => {
  if (!docsStore.tree) {
    await docsStore.fetchTree()
  }
})

const subitemsArray = computed(() => {
  const data = docsStore.tree?.data?.blog?.subitems;
  return data ? Object.values(data) : [];
});

</script>

<template>
  <main class="mb-5 font-[Manrope] bg-[#FFFFFA] text-[#211D1D] sm:mb-10">
    <h2 class="uppercase text-center font-[Inter] text-[17px]">Блог</h2>
    <div class="grid px-2 mt-4 gap-6 sm:mt-10 sm:px-4 lg:grid-cols-3">
      <div
        v-for="(item, index) in subitemsArray"
        :key="index"
        class="flex flex-col items-center cursor-pointer"
        @click="navigateTo(`/blog/${item.alias}`)"
      >
        <NuxtImg
          v-slot="{ src, alt, isLoaded, imgAttrs }"
          :src="item.image"
          :custom="true"
          :alt="item.pagetitle"
        >
              <div
                v-if="!isLoaded"
                class="aspect-[610/570] w-full bg-[#F9F6EC] rounded-lg"
              />
              <img
                v-else
                v-bind="imgAttrs"
                :src="src"
                :alt="alt"
                width="610"
                height="570"
                class="aspect-[610/570] object-cover rounded-lg"
              >
            </NuxtImg>
        <h3
          class="uppercase text-center mt-2 font-[Manrope] text-[13px] max-w-[610px] sm:font-[Inter] sm:text-xl sm:mt-4"
        >
          {{ item.pagetitle }}
        </h3>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
