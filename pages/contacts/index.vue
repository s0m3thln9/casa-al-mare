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

</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] px-2 py-6 sm:pb-3 sm:px-4 lg:py-8">
    <div class="flex flex-col items-center gap-4 sm:gap-6">
      <h2 class="uppercase">Контакты</h2>
    </div>
    <div class="mt-8 grid">
      <div class="flex flex-col items-center gap-8 sm:gap-6">
        <img
          src="/Contacts.webp"
          alt="maps"
          width="951"
          height="692"
          class="rounded-lg"
        >
        <div class="grid lg:grid-cols-4 w-fit gap-10 sm:gap-6 text-sm">
<!--          <a-->
<!--            class="grid grid-rows-2 text-center gap-1 sm:gap-2"-->
<!--            href="https://wa.me/79300360494"-->
<!--            target="_blank"-->
<!--            rel="noopener"-->
<!--          >-->
<!--            <span>Whatsapp</span>-->
<!--            <span class="font-light">+7 (930) 036-04-94</span>-->
<!--          </a>-->
          <a
            class="grid grid-rows-2 text-center gap-1 sm:gap-2"
            href="https://t.me/casaalmare_swim"
            target="_blank"
            rel="noopener"
          >
            <span>Telegram</span>
            <span class="font-light">@casaalmare_swim</span>
          </a>
          <a
            class="grid grid-rows-2 text-center gap-1 sm:gap-2"
            href="tel:+74950040494"
          >
            <span>Телефон</span>
            <span class="font-light">+7 (495) 004-04-94</span>
          </a>
          <a
            class="grid grid-rows-2 text-center gap-1 sm:gap-2"
            href="mailto:clients@casaalmare.com"
          >
            <span>Для отзывов</span>
            <span class="font-light">clients@casaalmare.com</span>
          </a>
          <a
            class="grid grid-rows-2 text-center gap-1 sm:gap-2"
            href="mailto:pr@casaalmare.com"
          >
            <span>Сотрудничество</span>
            <span class="font-light">pr@casaalmare.com</span>
          </a>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
