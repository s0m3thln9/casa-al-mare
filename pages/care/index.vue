<script setup lang="ts">

useHead({
  title: "Уход за изделиями - CASA AL MARE",
})

const breadcrumsItems: { name: string; path?: string }[] = [
  {
    name: "Главная",
    path: "/",
  },
  { name: "Уход за изделиями" },
]

const areImagesLoaded = ref(false)

const preloadImages = async () => {
  const loadImage = (url: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = url
      img.onload = resolve
      img.onerror = reject
    })
  }
  
  try {
    await Promise.all(["/about.jpg"].map((url) => loadImage(url)))
    areImagesLoaded.value = true
  } catch (error) {
    console.error("Ошибка при загрузке изображений:", error)
    areImagesLoaded.value = true
  }
}

onMounted(() => {
  preloadImages()
})

const { data: treeData } = await useFetch(
  "https://back.casaalmare.com/api/getdocTree"
)

const careContent = computed(() => {
  return (treeData.value as any)?.data?.docs?.subitems?.care?.content ?? ""
})
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] px-2 sm:px-4">
    <div class="py-2 sm:py-6">
      <AppBreadcrumbs :items="breadcrumsItems" />
    </div>
    <div class="grid grid-cols-1 items-start my-6 xl:grid-cols-2">
      <div
        v-if="!areImagesLoaded"
        class="aspect-[909/692] w-full bg-[#F9F6EC] rounded-lg"
      />
      <img
        v-else
        src="/care.png"
        alt="care"
        width="909"
        height="692"
        class="rounded-lg"
      >
      <div
        class="care-content flex flex-col gap-2"
        v-html="careContent"
      />
    </div>
  </main>
</template>

<style scoped>
.care-content :deep(h2) {
  font-size: 20px;
  font-weight: 400;
  color: #0a0e11;
}

.care-content :deep(p) {
  font-size: 14px;
  font-weight: 300;
}

@media screen and (max-width: 640px) {
  .care-content :deep(h2) {
    font-size: 15px;
    font-weight: 300;
  }
}
</style>
