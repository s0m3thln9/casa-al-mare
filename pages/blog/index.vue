<script setup lang="ts">
const { data: blogContent, error: blogError } = await useContentNode("blog")
useFetchErrorPage(blogError)

const blogData = computed(() => blogContent.value?.node)

useDocSeo(() => ({
  title: blogData.value?.pagetitle,
  description: blogData.value?.description,
  metatags: blogData.value?.metatags,
}))

const subitemsArray = computed(() => {
  const data = blogData.value?.subitems;
  if (!data) return [];
  return Object.values(data).sort((a, b) => (b.publishedon ?? '').localeCompare(a.publishedon ?? ''));
});

</script>

<template>
  <main class="mb-5 font-[Manrope] bg-[#FFFFFA] text-[#211D1D] sm:mb-10">
    <h2 class="uppercase text-center font-[Inter] text-[17px]">Блог</h2>
    <div class="grid px-2 mt-4 gap-6 sm:mt-10 sm:px-4 lg:grid-cols-3">
      <NuxtLink
        v-for="(item, index) in subitemsArray"
        :key="index"
        :to="`/blog/${item.alias}/`"
        class="flex flex-col items-center cursor-pointer"
      >
        <NuxtImg
          :src="item.image"
          :alt="item.pagetitle"
          width="610"
          height="570"
          :loading="index < 3 ? 'eager' : 'lazy'"
          class="aspect-[610/570] w-full object-cover rounded-lg bg-[#F9F6EC]"
        />
        <h3
          class="uppercase text-center mt-2 font-[Manrope] text-[13px] max-w-[610px] sm:font-[Inter] sm:text-xl sm:mt-4"
        >
          {{ item.pagetitle }}
        </h3>
      </NuxtLink>
    </div>
  </main>
</template>

<style scoped></style>