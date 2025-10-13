<script setup lang="ts">
const authStore = useAuthStore()
const authModalStore = useAuthModalStore()
const catalogStore = useCatalogStore()
const favoritesStore = useFavoritesStore()

watch(
  () => authStore.isAuth,
  (isAuth) => {
    if (isAuth) {
      favoritesStore.syncFavorites()
    }
  },
  { immediate: true },
)

const favoriteItems = computed(() => catalogStore.items.filter((item) => favoritesStore.favorites.includes(item.id)))

onMounted(() => {
  if (!authStore.isAuth) {
    authModalStore.open()
  }
})
</script>

<template>
  <div>
    <AuthModal v-if="authModalStore.isOpen" />
    <main
      class="relative py-5 font-[Manrope] bg-[#FFFFFA] text-[#211D1D] sm:py-10 flex-1 flex flex-col justify-between"
      :class="authModalStore.isOpen && 'opacity-22'"
    >
      <h2 class="uppercase text-center font-[Inter] text-[17px]">Избранное</h2>
      <h3
        v-if="!authStore.isAuth"
        class="uppercase text-center font-[Inter] mt-8"
      >
        Авторизируйтесь для добавления в избранное
      </h3>
      <template v-else>
        <div
          v-if="favoriteItems.length > 0"
          class="mt-4 grid grid-cols-2 px-2 gap-x-1 gap-y-2 sm:mt-10 sm:grid-cols-4 sm:px-4 sm:gap-x-4 sm:gap-y-6"
        >
          <template
            v-for="item in favoriteItems"
            :key="item.id"
          >
            <CatalogCard
              :id="item.id"
              :slider-images="item.sliderImages"
              :color="item.color"
              :name="item.name"
              :price="item.price"
              :old-price="item.oldPrice"
              variant="large"
              :link="`/catalog/${item.id}`"
            />
          </template>
          <div class="col-span-2 w-full flex justify-center items-center mt-5 mb-3 sm:hidden">
            <button class="font-light text-xs">Показать больше</button>
          </div>
        </div>
        <h3
          v-else
          class="uppercase text-center font-[Inter] mt-8"
        >
          Тут ничего нет
        </h3>
        <h2 class="hidden mt-10 font-[Inter] text-4xl text-center sm:block">Вам может понравится</h2>
        <div class="hidden mt-12 grid-cols-4 px-4 gap-x-4 gap-y-6 sm:grid">
          <template
            v-for="(_, index) in new Array(4)"
            :key="index"
          >
            <CatalogCard
              :id="catalogStore.items[0].id"
              :slider-images="catalogStore.items[0].sliderImages"
              :color="catalogStore.items[0].color"
              :name="catalogStore.items[0].name"
              :price="catalogStore.items[0].price"
              :old-price="catalogStore.items[0].oldPrice"
              variant="large"
              :link="`/catalog/${catalogStore.items[0].id}`"
            />
          </template>
        </div>
        <AppSEO
          :paragraphs="[
            'CASA AL MARE — эстетика тела, свобода выбора.\n' +
              'Каталог CASA AL MARE создан для женщин, которые ищут не просто купальник или комплект белья, а выражение своей индивидуальности. Мы создаём коллекции, вдохновлённые побережьями, архитектурой юга и непринуждённой элегантностью.',
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
          custom-class="sm:hidden"
        />
      </template>
    </main>
  </div>
</template>

<style scoped></style>
