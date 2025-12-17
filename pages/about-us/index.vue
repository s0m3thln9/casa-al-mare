<script setup lang="ts">

useHead({
  title: "CASA AL MARE — стильное бельё и купальники",
  meta: [
    {
      name: "description",
      content: "CASA AL MARE — бренд стильного белья и купальников, вдохновлённый природой и искусством.",
    },
    {
      property: "og:title",
      content: "CASA AL MARE",
    },
    {
      property: "og:description",
      content: "Выбирайте купальники и бельё CASA AL MARE — сочетание модных решений, комфорта и женственности.",
    },
    {
      property: "og:image",
      content: ""
    }
  ],
})

const breadcrumsItems: { name: string; path?: string }[] = [
  {
    name: "Главная",
    path: "/",
  },
  { name: "О нас" },
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
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] px-2 sm:px-4">
    <div class="py-2 sm:py-6">
      <AppBreadcrumbs :items="breadcrumsItems" />
    </div>
    <div class="grid grid-cols-1 items-center my-6 sm:gap-18 xl:grid-cols-2">
      <div class="flex flex-col sm:gap-12">
        <img
          src="/logo-4.svg"
          alt="CASA AL MARE"
          width="908"
          height="123"
        >
        <p class="text-sm font-light hidden sm:block">
          История Casa Al Mare началась с мечты о бесконечном лете — о жизни, где утро пахнет морем, а одежда становится
          продолжением тела. Мы вдохновленные миром яхтинга и итальянским побережьем, создаём вещи, в которых легко быть
          собой, где солнце отражается в волнах, а ветер напоминает, как прекрасно быть в моменте. Простые по форме, но
          насыщенные эмоцией. Мы верим, что истинная красота — в естественности.Поэтому уделяем внимание деталям,
          тканям, посадке и комфорту. Все изделия создаются в ограниченном тираже на локальном производстве, с любовью и
          уважением к ремеслу. Casa Al Mare — это не просто одежда. Это состояние. Солнце на коже, соль в волосах,
          лёгкий ветер и уверенность в себе.
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <div
          v-if="!areImagesLoaded"
          class="aspect-[909/692] w-full bg-[#F9F6EC] rounded-lg"
        />
        <img
          v-else
          src="/O_NAS.webp"
          alt="about"
          width="909"
          height="692"
          class="rounded-lg"
        >
        <p class="text-sm font-light mt-10 sm:hidden">
          История Casa Al Mare началась с мечты о бесконечном лете — о жизни, где утро пахнет морем, а одежда становится
          продолжением тела. Мы вдохновленные миром яхтинга и итальянским побережьем, создаём вещи, в которых легко быть
          собой, где солнце отражается в волнах, а ветер напоминает, как прекрасно быть в моменте. Простые по форме, но
          насыщенные эмоцией. Мы верим, что истинная красота — в естественности.Поэтому уделяем внимание деталям,
          тканям, посадке и комфорту. Все изделия создаются в ограниченном тираже на локальном производстве, с любовью и
          уважением к ремеслу. Casa Al Mare — это не просто одежда. Это состояние. Солнце на коже, соль в волосах,
          лёгкий ветер и уверенность в себе.
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
