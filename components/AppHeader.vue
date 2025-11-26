<script setup lang="ts">
const menuStore = useMenuStore()
const favoritesStore = useFavoritesStore()
const authModalStore = useAuthModalStore()
const authStore = useAuthStore()
const orderStore = useOrderStore()
const viewport = useViewport()

const isMobile = computed(() => viewport.isLessThan("sm"))
const favoritesCount = computed(() => favoritesStore.favorites.length)
const headerZIndex = ref(10)

const handleSearchToggle = (isOpen: boolean) => {
  headerZIndex.value = isOpen ? 50 : 30
}

const cartCount = computed(() => {
  return orderStore.cartItems.reduce((total, item) => total + item.count, 0)
})

const handleFavClick = () => {
  if (authStore.isAuth) {
    navigateTo("/favorites")
  } else {
    authModalStore.open()
  }
}

const badgeText = (count: number) => (count > 99 ? "99+" : count.toString())

const menuButtonText = computed(() => {
  if (isMobile.value && menuStore.isOpen) {
    return "Назад"
  }
  return "Меню"
})

const handleMenuButtonClick = () => {
  if (menuStore.isOpen) {
    menuStore.close()
  } else {
    menuStore.open()
  }
}
</script>

<template>
  <header
    :class="[
      'sticky top-0 left-0 font-[Manrope] text-xs flex justify-between items-center p-2 bg-[#FFFFFA] text-[#211D1D] sm:text-sm sm:p-4',
      `z-${headerZIndex}`,
    ]"
  >
    <div>
      <NuxtLink to="/">
        <img
          src="/logo.svg"
          alt="CASA AL MARE"
          class="min-w-[126px] h-[17px] sm:w-[229px] sm:h-[30px]"
          loading="eager"
        >
      </NuxtLink>
    </div>
    <nav class="hidden lg:block">
      <ul class="flex gap-4">
        <li class="hover:text-[#F3A454]">
          <button
            aria-label="Меню"
            class="cursor-pointer menu-button"
            @click="menuStore.open"
          >
            Меню
          </button>
        </li>
        <li class="hover:text-[#F3A454]"><NuxtLink to="/catalog">Новинки</NuxtLink></li>
        <li class="hover:text-[#F3A454]"><NuxtLink to="/blog">Блог</NuxtLink></li>
        <li class="hover:text-[#F3A454]"><NuxtLink to="/campaigns">CAMPAIGNS
        </NuxtLink></li>
        <li class="hover:text-[#F3A454]">
          <a
            href="https://t.me/casaalmare_swim"
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram
          </a>
        </li>
        <li class="hover:text-[#F3A454]">
          <a
            href="https://wa.me/79300360494"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </li>
      </ul>
    </nav>
    <nav>
      <ul class="flex gap-3 sm:gap-4">
        <li class="hover:text-[#F3A454] cursor-pointer"><AppSearch @search-toggle="handleSearchToggle" /></li>
        <li class="hidden hover:text-[#F3A454] cursor-pointer sm:block relative">
          <NuxtLink @click="handleFavClick"
            >Избранное
            <span
              v-if="favoritesCount > 0"
              class="absolute top-0 -right-2 text-[#211D1D] text-[10px]"
              :class="favoritesCount > 9 && '-right-2.5'"
            >
              {{ badgeText(favoritesCount) }}
            </span>
          </NuxtLink>
        </li>
        <li class="hover:text-[#F3A454] relative">
          <NuxtLink to="/order">Корзина</NuxtLink>
          <span
            v-if="cartCount > 0"
            class="absolute top-0 -right-2 text-[#211D1D] text-[10px]"
            :class="cartCount > 9 && '-right-2.5'"
          >
            {{ badgeText(cartCount) }}
          </span>
        </li>
        <li class="block hover:text-[#F3A454] cursor-pointer lg:hidden">
          <button
            aria-label="Меню"
            class="menu-button2"
            @click="handleMenuButtonClick"
          >
            {{ menuButtonText }}
          </button>
        </li>
      </ul>
    </nav>
  </header>
  <MainMenu />
</template>
