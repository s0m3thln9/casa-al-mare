<script setup lang="ts">
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
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] px-2 sm:px-4">
    <div class="py-2 sm:py-6">
      <AppBreadcrumbs :items="breadcrumsItems" />
    </div>
    <div class="grid grid-cols-1 items-center my-6 gap-4 sm:gap-18 xl:grid-cols-2">
      <div
        v-if="!areImagesLoaded"
        class="aspect-[909/692] w-full bg-[#F9F6EC] rounded-lg"
      />
      <img
        v-else
        src="/about.jpg"
        alt="about"
        width="909"
        height="692"
        class="rounded-lg"
      />
      <div class="flex flex-col gap-2">
        <h2 class="text-[15] sm:text-xl max-sm:font-light text-[#0a0e11]">Swimwear Care</h2>
        <p class="text-sm font-light">
          Любимые купальники заслуживают особого внимания. Следуйте нашим советам, чтобы сохранить форму, цвет и
          эластичность ткани.
        </p>
        <h2 class="text-[15] sm:text-xl max-sm:font-light text-[#0a0e11]">Соблюдать базовые правила ухода</h2>
        <p class="text-sm font-light">
          №1. Только ручная стирка Купальники и шорты из полиамида и эластана не любят машинной стирки. Используйте
          прохладную воду (до 30 °C) и мягкое жидкое средство без отбеливателей.
        </p>
        <p class="text-sm font-light">
          №2. Не тереть и не выкручивать После стирки аккуратно промокните изделие полотенцем, не выкручивая и не
          растягивая ткань.
        </p>
        <h2 class="text-[15] sm:text-xl max-sm:font-light text-[#0a0e11]">Дать высохнуть естественно</h2>
        <p class="text-sm font-light">
          Сушите купальник в тени, в расправленном виде, избегая прямых солнечных лучей и батарей. Высокая температура
          может повредить волокна и изменить форму.
        </p>
        <h2 class="text-[15] sm:text-xl max-sm:font-light text-[#0a0e11]">Приводить в порядок</h2>
        <p class="text-sm font-light">
          Не используйте сушильную машину и не гладьте. Если ткань чуть помялась, дайте ей «отдохнуть» — волокна
          разгладятся сами.
        </p>
        <h2 class="text-[15] sm:text-xl max-sm:font-light text-[#0a0e11]">Хранить с любовью</h2>
        <p class="text-sm font-light">
          Храните купальники в сухом, прохладном месте. Не оставляйте влажные вещи в сумке — это может вызвать
          деформацию или изменение цвета.
        </p>
        <h2 class="text-[15] sm:text-xl max-sm:font-light text-[#0a0e11]">Для туник и костюмов</h2>
        <p class="text-sm font-light">
          Туники и костюмы из хлопка и полиэстера можно стирать в машине на деликатном режиме при 30 °C. Используйте
          мягкое средство и невысокие обороты отжима.
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
