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
  ],
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
      custom-class="sm:aspect-[375/607] md:aspect-[5/4] lg:aspect-[1920/962]"
      link="/catalog"
    />
    <div class="flex flex-col lg:flex-row gap-2 px-2 py-2 sm:gap-4 sm:px-4 sm:py-4">
      <BannerCard
        :image-url="images.promo1"
        text="SS26 solar power"
        custom-class="rounded-lg aspect-[1]"
        object-position="center"
        link="/collections/collection"
      />
      <BannerCard
        :image-url="images.promo2"
        text="SS26 solar power"
        custom-class="rounded-lg aspect-[1]"
        object-position="center"
        link="/collections/collection"
      />
    </div>
    <div class="grid grid-cols-2 gap-2 px-2 sm:gap-4 md:grid-cols-6 lg:grid-cols-5 sm:px-4">
      <BannerCard
        :image-url="images.category1"
        text="Купальники"
        custom-class="rounded-lg col-span-2 aspect-[343/400] sm:aspect-[1920/2462] md:col-span-3 lg:col-span-1"
        object-position="center"
        link="/catalog?path=kupalniki"
      />
      <BannerCard
        :image-url="images.category2"
        text="Слитные купальники"
        custom-class="rounded-lg aspect-[167/284] sm:aspect-[1920/2462] md:col-span-3 lg:col-span-1"
        object-position="center"
        link="/catalog?path=kupalniki%2Fslitnyie-kupalniki"
      />
      <BannerCard
        :image-url="images.category3"
        text="Одежда"
        custom-class="rounded-lg aspect-[167/284] sm:aspect-[1920/2462] md:col-span-2 lg:col-span-1"
        object-position="center"
        link="/catalog?path=plyazhnaya-odezhda"
      />
      <BannerCard
        :image-url="images.category4"
        text="Аксессуары"
        custom-class="rounded-lg aspect-[167/284] sm:aspect-[1920/2462] md:col-span-2 lg:col-span-1"
        object-position="center"
        link="/catalog?path=aksessuaryi"
      />
      <BannerCard
        :image-url="images.category5"
        text="Настольные игры"
        custom-class="rounded-lg aspect-[167/284] sm:aspect-[1920/2462] md:col-span-2 lg:col-span-1"
        object-position="center"
        link="/catalog?path=nastolnyie-igryi"
      />
    </div>
<!--    <div class="flex flex-col lg:flex-row gap-2 px-2 py-2 sm:gap-4 sm:px-4 sm:py-4">-->
<!--      <BannerCard-->
<!--        :image-url="images.promo3"-->
<!--        text="fw25 Surf tales"-->
<!--        custom-class="rounded-lg aspect-[1]"-->
<!--        object-position="center"-->
<!--        link="/collections/collection"-->
<!--      />-->
<!--      <BannerCard-->
<!--        :image-url="images.promo4"-->
<!--        text="top capsule 25"-->
<!--        custom-class="rounded-lg aspect-[1]"-->
<!--        object-position="center"-->
<!--        link="/collections/collection"-->
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
