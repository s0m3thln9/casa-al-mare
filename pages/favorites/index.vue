<script setup lang="ts">

useHead({
  title: "Избранное - CASA AL MARE",
})

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

</script>

<template>
  <div>
    <main
      class="relative py-5 font-[Manrope] bg-[#FFFFFA] text-[#211D1D] sm:py-10 flex-1 flex flex-col justify-between"
      :class="authModalStore.isOpen && 'opacity-22'"
    >
      <h2
        class="uppercase text-center font-[Inter] text-[17px]">{{favoriteItems.length > 0 ? "Избранное" : "Избранное пока пусто"}}
      </h2>
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
              variant="large"
              link
            />
          </template>
        </div>
        <template v-else>
          <h3
            class="uppercase text-center font-[Inter] mt-8"
          >
            Сохраняйте понравившиеся модели — они появятся здесь
          </h3>
        </template>
      </template>
    </main>
  </div>
</template>

<style scoped></style>
