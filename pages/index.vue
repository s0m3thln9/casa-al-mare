<script setup lang="ts">
const images = {
  video: "/video-banner.jpg",
  promo1: "/promo-1.jpg",
  promo2: "/promo-2.jpg",
  promo3: "/promo-3.jpg",
  promo4: "/promo-4.jpg",
  category1: "/category-1.jpg",
  category2: "/category-2.jpg",
  category3: "/category-3.jpg",
  category4: "/category-4.jpg",
  category5: "/category-5.jpg",
}
</script>

<template>
  <main class="bg-[#FFFFFA]">
<!--    <RunningLine-->
<!--      :messages="[-->
<!--        'Сообщение об акции и эксклюзивных условиях',-->
<!--        'Сообщение об акции и эксклюзивных условиях',-->
<!--        'Сообщение об акции и эксклюзивных условиях',-->
<!--        'Сообщение об акции и эксклюзивных условиях',-->
<!--        'Сообщение об акции и эксклюзивных условиях',-->
<!--        'Сообщение об акции и эксклюзивных условиях',-->
<!--        'Сообщение об акции и эксклюзивных условиях',-->
<!--      ]"-->
<!--    />-->
    <BannerCard
      :image-url="images.video"
      text="В каталог"
      object-position="50% 75%"
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
        text="Головные уборы"
        custom-class="rounded-lg col-span-2 aspect-[343/400] sm:aspect-[1920/2462] md:col-span-3 lg:col-span-1"
        object-position="center"
        link="/catalog"
      />
      <BannerCard
        :image-url="images.category2"
        text="Купальники"
        custom-class="rounded-lg aspect-[167/284] sm:aspect-[1920/2462] md:col-span-3 lg:col-span-1"
        object-position="center"
        link="/catalog"
      />
      <BannerCard
        :image-url="images.category3"
        text="Низ купальника"
        custom-class="rounded-lg aspect-[167/284] sm:aspect-[1920/2462] md:col-span-2 lg:col-span-1"
        object-position="center"
        link="/catalog"
      />
      <BannerCard
        :image-url="images.category4"
        text="Верх купальника"
        custom-class="rounded-lg aspect-[167/284] sm:aspect-[1920/2462] md:col-span-2 lg:col-span-1"
        object-position="center"
        link="/catalog"
      />
      <BannerCard
        :image-url="images.category5"
        text="Аксессуары"
        custom-class="rounded-lg aspect-[167/284] sm:aspect-[1920/2462] md:col-span-2 lg:col-span-1"
        object-position="center"
        link="/catalog"
      />
    </div>
    <div class="flex flex-col lg:flex-row gap-2 px-2 py-2 sm:gap-4 sm:px-4 sm:py-4">
      <BannerCard
        :image-url="images.promo3"
        text="fw25 Surf tales"
        custom-class="rounded-lg aspect-[1]"
        object-position="center"
        link="/collections/collection"
      />
      <BannerCard
        :image-url="images.promo4"
        text="top capsule 25"
        custom-class="rounded-lg aspect-[1]"
        object-position="center"
        link="/collections/collection"
      />
    </div>
    <AppSEO
      :paragraphs="[
        '— это бренд стильного белья и купальников, созданный для женщин, которые ценят комфорт, эстетику и качество.\n' +
          'Мы разрабатываем коллекции, вдохновлённые природой, искусством и городским ритмом жизни.',
        'В каталоге CASA AL MARE вы найдете:\n' +
          'купальники: раздельные и слитные;\n' +
          'комплекты нижнего белья: браллеты, трусики, боди;\n' +
          'аксессуары: пляжные полотенца, сумки, косметички.\n' +
          'мы используем премиальные материалы, адаптированные к разным типам фигуры и формам.\n' +
          'каждое изделие проходит ручную проверку, а дизайн продуман до мелочей.',
        'Быстрая доставка по всей России и миру. Поддержка клиентов работает ежедневно. Вся продукция произведена с заботой об экологии.\n' +
          'Выбирайте купальники и бельё CASA AL MARE — сочетание модных решений, комфорта и женственности.\n' +
          'Следите за новыми коллекциями, подписывайтесь на наш telegram, vk и открывайте красоту каждый день.',
      ]"
    />
  </main>
</template>
