<script setup lang="ts">
interface VideoSource {
  mp4: string
  ogv: string
  webm: string
}

interface VideoData {
  pc: VideoSource
  mob: VideoSource
}

const { data: treeData } = await useFetch(
  "https://back.casaalmare.com/api/getdocTree"
)

const indexData = computed(() => treeData.value?.data?.index)

const pageTitle = computed(() => indexData.value?.pagetitle ?? "")
const description = computed(() => indexData.value?.description ?? "")

const metaTags = computed(() => {
  const tags: Record<string, any> = {}
  
  indexData.value?.metatags?.forEach(tag => {
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

// Обновляем SEO при монтировании и при изменении данных
updateSeo()

watch([pageTitle, description, metaTags], () => {
  updateSeo()
}, { deep: true })

const data = await $fetch<VideoData>("https://back.casaalmare.com/api/getMainVideo")
const images = {
  promo1: "/2_camp.webp",
  promo2: "/1_camp.webp",
  promo3: "/promo-3.jpg",
  promo4: "/promo-4.jpg",
  category1: "/Category_kypalniki.webp",
  category2: "/Slitie.webp",
  category3: "/odejda.webp",
  category4: "/aksessyari.webp",
  category5: "/igri.webp",
}
</script>

<template>
  <main class="bg-[#FFFFFA]">
    <VideoBanner
      v-if="data"
      :video-data="data"
      text="В каталог"
      custom-class="sm:aspect-[375/607] max-sm:h-[100dvh] md:aspect-[5/4] lg:aspect-[1920/962]"
      link="/catalog"
    />
    <div class="flex flex-col lg:flex-row gap-2 px-2 py-2 sm:gap-4 sm:px-4 sm:py-4">
      <BannerCard
        :image-url="images.promo1"
        custom-class="rounded-lg aspect-[1] cursor-default!"
        object-position="center"
      />
      <BannerCard
        :image-url="images.promo2"
        text="Campaign"
        custom-class="rounded-lg aspect-[1]"
        object-position="center"
        link="/campaigns"
      />
    </div>
    <div class="grid grid-cols-2 gap-2 px-2 sm:gap-4 md:grid-cols-6 lg:grid-cols-5 sm:px-4">
      <BannerCard
        :image-url="images.category1"
        text="Купальники"
        custom-class="rounded-lg col-span-2 aspect-[343/400] sm:aspect-[1920/2462] md:col-span-3 lg:col-span-1"
        object-position="center"
        link="/catalog/kupalniki"
      />
      <BannerCard
        :image-url="images.category2"
        text="Слитные купальники"
        custom-class="rounded-lg aspect-[167/284] sm:aspect-[1920/2462] md:col-span-3 lg:col-span-1"
        object-position="center"
        link="/catalog/kupalniki/slitnyie-kupalniki"
      />
      <BannerCard
        :image-url="images.category3"
        text="Одежда"
        custom-class="rounded-lg aspect-[167/284] sm:aspect-[1920/2462] md:col-span-2 lg:col-span-1"
        object-position="center"
        link="/catalog/odezhda"
      />
      <BannerCard
        :image-url="images.category4"
        text="Аксессуары"
        custom-class="rounded-lg aspect-[167/284] sm:aspect-[1920/2462] md:col-span-2 lg:col-span-1"
        object-position="center"
        link="/catalog/aksessuaryi"
      />
      <BannerCard
        :image-url="images.category5"
        text="Настольные игры"
        custom-class="rounded-lg aspect-[167/284] sm:aspect-[1920/2462] md:col-span-2 lg:col-span-1"
        object-position="center"
        link="/catalog/nastolnyie-igryi"
      />
    </div>
  </main>
</template>