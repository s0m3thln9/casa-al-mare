<script setup lang="ts"></script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] px-2 py-6 sm:pb-3 sm:px-4 lg:py-8">
    <div class="flex flex-col items-center gap-4 sm:gap-6">
      <h2 class="uppercase">Контакты</h2>
      <span class="text-sm font-light">Текст</span>
    </div>
    <div class="mt-8 grid">
      <div class="flex flex-col items-center gap-8 sm:gap-6">
        <NuxtImg
          src="/contact-1.png"
          alt="maps"
          width="951"
          height="692"
          class="rounded-lg"
        />
        <div class="grid sm:grid-cols-3 w-fit gap-10 sm:gap-6 text-sm">
          <div class="grid grid-rows-2 text-center gap-1 sm:gap-2">
            <span>Адрес</span>
            <span class="font-light">ул Лазурная. д.2</span>
          </div>
          <div class="grid grid-rows-2 text-center gap-1 sm:gap-2">
            <span>Телефон</span>
            <span class="font-light">+7 999 999 99 99</span>
          </div>
          <div class="grid grid-rows-2 text-center gap-1 sm:gap-2">
            <span>Email</span>
            <span class="font-light">name@mail.com</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
