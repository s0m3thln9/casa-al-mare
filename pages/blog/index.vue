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

const images = {
  blog1: "/blog-1.jpg",
  blog2: "/blog-2.jpg",
  blog3: "/blog-3.jpg",
  blog4: "/blog-4.jpg",
  blog5: "/blog-5.jpg",
  blog6: "/blog-6.jpg",
}

const areImagesLoaded = ref(false)

const blogImages = [images.blog1, images.blog2, images.blog3, images.blog4, images.blog5, images.blog6]

const categories = ["Все", "Уход", "Стиль", "Советы"]

const currentBlog = ref("Все")

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
    await Promise.all(blogImages.map((url) => loadImage(url)))
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
  <main class="mb-5 font-[Manrope] bg-[#FFFFFA] text-[#211D1D] sm:mb-10">
    <h2 class="uppercase text-center font-[Inter] text-[17px]">Блог</h2>
<!--    <div class="mt-4 w-full flex justify-center items-center px-2">-->
<!--      <SelectButton-->
<!--        v-model="currentBlog"-->
<!--        :variants="categories"-->
<!--        custom-class="max-w-[600px] w-full !rounded-2xl"-->
<!--        custom-button-class="flex-1 py-2 !text-[13px]"-->
<!--      />-->
<!--    </div>-->
    <div class="grid px-2 mt-4 gap-6 sm:mt-10 sm:px-4 lg:grid-cols-3">
      <div
        class="flex flex-col items-center cursor-pointer"
        @click="navigateTo('/blog/article')"
      >
        <div
          v-if="!areImagesLoaded"
          class="aspect-[610/570] w-full bg-[#F9F6EC] rounded-lg"
        />
        <img
          v-else
          :src="images.blog1"
          alt="blog"
          width="610"
          height="570"
          class="aspect-[610/570] object-cover rounded-lg"
        >
        <div
          v-if="!areImagesLoaded"
          class="h-10 w-full bg-[#F9F6EC] rounded-lg mt-2 sm:mt-4"
        />
        <h3
          v-else
          class="uppercase text-center mt-2 font-[Manrope] text-[13px] max-w-[610px] sm:font-[Inter] sm:text-xl sm:mt-4"
        >
          Краткое название статьи
        </h3>
      </div>
      <div
        class="flex flex-col items-center cursor-pointer"
        @click="navigateTo('/blog/article')"
      >
        <div
          v-if="!areImagesLoaded"
          class="aspect-[610/570] w-full bg-[#F9F6EC] rounded-lg"
        />
        <img
          v-else
          :src="images.blog2"
          alt="blog"
          width="610"
          height="570"
          class="aspect-[610/570] object-cover rounded-lg"
        >
        <div
          v-if="!areImagesLoaded"
          class="h-10 w-full bg-[#F9F6EC] rounded-lg mt-2 sm:mt-4"
        />
        <h3
          v-else
          class="uppercase text-center mt-2 font-[Manrope] text-[13px] max-w-[610px] sm:font-[Inter] sm:text-xl sm:mt-4"
        >
          Очень длинное название статьи о трендах в путешествиях ...
        </h3>
      </div>
      <div
        class="flex flex-col items-center cursor-pointer"
        @click="navigateTo('/blog/article')"
      >
        <div
          v-if="!areImagesLoaded"
          class="aspect-[610/570] w-full bg-[#F9F6EC] rounded-lg"
        />
        <img
          v-else
          :src="images.blog3"
          alt="blog"
          width="610"
          height="570"
          class="aspect-[610/570] object-cover rounded-lg"
        >
        <div
          v-if="!areImagesLoaded"
          class="h-10 w-full bg-[#F9F6EC] rounded-lg mt-2 sm:mt-4"
        />
        <h3
          v-else
          class="uppercase text-center mt-2 font-[Manrope] text-[13px] max-w-[610px] sm:font-[Inter] sm:text-xl sm:mt-4"
        >
          Среднее по длине название статьи
        </h3>
      </div>
      <div
        class="flex flex-col items-center cursor-pointer"
        @click="navigateTo('/blog/article')"
      >
        <div
          v-if="!areImagesLoaded"
          class="aspect-[610/570] w-full bg-[#F9F6EC] rounded-lg"
        />
        <img
          v-else
          :src="images.blog4"
          alt="blog"
          width="610"
          height="570"
          class="aspect-[610/570] object-cover rounded-lg"
        >
        <div
          v-if="!areImagesLoaded"
          class="h-10 w-full bg-[#F9F6EC] rounded-lg mt-2 sm:mt-4"
        />
        <h3
          v-else
          class="uppercase text-center mt-2 font-[Manrope] text-[13px] max-w-[610px] sm:font-[Inter] sm:text-xl sm:mt-4"
        >
          Очень длинное название статьи о трендах в путешествиях ...
        </h3>
      </div>
      <div
        class="flex flex-col items-center cursor-pointer"
        @click="navigateTo('/blog/article')"
      >
        <div
          v-if="!areImagesLoaded"
          class="aspect-[610/570] w-full bg-[#F9F6EC] rounded-lg"
        />
        <img
          v-else
          :src="images.blog5"
          alt="blog"
          width="610"
          height="570"
          class="aspect-[610/570] object-cover rounded-lg"
        >
        <div
          v-if="!areImagesLoaded"
          class="h-10 w-full bg-[#F9F6EC] rounded-lg mt-2 sm:mt-4"
        />
        <h3
          v-else
          class="uppercase text-center mt-2 font-[Manrope] text-[13px] max-w-[610px] sm:font-[Inter] sm:text-xl sm:mt-4"
        >
          Краткое название статьи
        </h3>
      </div>
      <div
        class="flex flex-col items-center cursor-pointer"
        @click="navigateTo('/blog/article')"
      >
        <div
          v-if="!areImagesLoaded"
          class="aspect-[610/570] w-full bg-[#F9F6EC] rounded-lg"
        />
        <img
          v-else
          :src="images.blog6"
          alt="blog"
          width="610"
          height="570"
          class="aspect-[610/570] object-cover rounded-lg"
        >
        <div
          v-if="!areImagesLoaded"
          class="h-10 w-full bg-[#F9F6EC] rounded-lg mt-2 sm:mt-4"
        />
        <h3
          v-else
          class="uppercase text-center mt-2 font-[Manrope] text-[13px] max-w-[610px] sm:font-[Inter] sm:text-xl sm:mt-4"
        >
          Среднее по длине название статьи
        </h3>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
