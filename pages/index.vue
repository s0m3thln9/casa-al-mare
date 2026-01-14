<script setup lang="ts">
import { computed, onMounted } from "vue"

interface VideoSource {
  mp4: string
  ogv: string
  webm: string
}

interface VideoData {
  pc: VideoSource
  mob: VideoSource
}

const docsStore = useDocsStore()
const route = useRoute()

onMounted(async () => {
  if (!docsStore.tree) {
    await docsStore.fetchTree()
    const metaItm = computed(() => docsStore.tree?.data?.index)
    
    const metaobj: Record<string, string> = {
      title: metaItm.value?.longtitle || metaItm.value?.pagetitle || '',
      description: metaItm.value?.meta_descr
        || metaItm.value?.description?.replace(/(<([^>]+)>)/gi, '')
        || '',
      'og:url': 'https://casaalmare.com' + route.fullPath,
    }
    
    if (metaItm.value?.metatags) {
      metaItm.value.metatags.forEach((e) => {
        if (e.name === 'og:image') {
          metaobj[e.name] = e.content
        } else if (e.name === 'og:description') {
          metaobj[e.name] = e.content
            || metaItm.value.description?.replace(/(<([^>]+)>)/gi, '')
            || ''
        } else {
          metaobj[e.name] = e.content
        }
      })
    }
    
    useSeoMeta(metaobj)
  }
})

const { data } = await useFetch<VideoData>("https://back.casaalmare.com/api/getMainVideo")
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
<!--    <div class="flex flex-col lg:flex-row gap-2 px-2 py-2 sm:gap-4 sm:px-4 sm:py-4">-->
<!--      <BannerCard-->
<!--        :image-url="images.promo3"-->
<!--        text="fw25 Surf tales"-->
<!--        custom-class="rounded-lg aspect-[1]"-->
<!--        object-position="center"-->
<!--        link="/campaigns"-->
<!--      />-->
<!--      <BannerCard-->
<!--        :image-url="images.promo4"-->
<!--        text="top capsule 25"-->
<!--        custom-class="rounded-lg aspect-[1]"-->
<!--        object-position="center"-->
<!--        link="/campaigns"-->
<!--      />-->
<!--    </div>-->
<!--    <AppSEO-->
<!--      :paragraphs="[-->
<!--        '— это бренд стильного белья и купальников, созданный для женщин, которые ценят комфорт, эстетику и качество.\n' +-->
<!--          'Мы разрабатываем коллекции, вдохновлённые природой, искусством и городским ритмом жизни.',-->
<!--        'В каталоге CASA AL MARE вы найдете:\n' +-->
<!--          'купальники: раздельные и слитные;\n' +-->
<!--          'комплекты нижнего белья: браллеты, трусики, боди;\n' +-->
<!--          'аксессуары: пляжные полотенца, сумки, косметички.\n' +-->
<!--          'мы используем премиальные материалы, адаптированные к разным типам фигуры и формам.\n' +-->
<!--          'каждое изделие проходит ручную проверку, а дизайн продуман до мелочей.',-->
<!--        'Быстрая доставка по всей России и миру. Поддержка клиентов работает ежедневно. Вся продукция произведена с заботой об экологии.\n' +-->
<!--          'Выбирайте купальники и бельё CASA AL MARE — сочетание модных решений, комфорта и женственности.\n' +-->
<!--          'Следите за новыми коллекциями, подписывайтесь на наш telegram, vk и открывайте красоту каждый день.',-->
<!--      ]"-->
<!--    />-->
  </main>
</template>
