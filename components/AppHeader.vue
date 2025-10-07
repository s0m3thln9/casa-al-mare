<script setup lang="ts">
import { useMenuStore } from "~/stores/menu"

const menuStore = useMenuStore()
const favoritesStore = useFavoritesStore()
const orderStore = useOrderStore()
const favoritesCount = computed(() => favoritesStore.favorites.length)

const cartCount = computed(() => {
  return orderStore.cartItems.reduce((total, item) => total + item.count, 0)
})

const badgeText = (count: number) => (count > 99 ? "99+" : count.toString())
</script>

<template>
  <header
    class="sticky top-0 left-0 z-10 font-[Manrope] text-xs flex justify-between items-center p-2 bg-[#FFFFFA] text-[#211D1D] sm:text-sm sm:p-4"
  >
    <div>
      <NuxtLink to="/">
        <NuxtImg
          src="logo.svg"
          alt="CASA AL MARE"
          class="min-w-[126px] h-[17px] sm:w-[229px] sm:h-[30px]"
          loading="eager"
        />
      </NuxtLink>
    </div>
    <nav class="hidden lg:block">
      <ul class="flex gap-4">
        <li class="hover:text-[#F3A454]">
          <button
            class="cursor-pointer menu-button"
            @click="menuStore.open"
          >
            Меню
          </button>
        </li>
        <li class="hover:text-[#F3A454]"><NuxtLink to="/catalog">Новинки</NuxtLink></li>
        <li class="hover:text-[#F3A454]"><NuxtLink to="/blog">Блог</NuxtLink></li>
        <li class="hover:text-[#F3A454]"><NuxtLink to="/collections/collection">NEW COLLECTION</NuxtLink></li>
        <li class="hover:text-[#F3A454]">
          <a
            href="https://t.me/casaalmare_swim"
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram
          </a>
        </li>
        <li class="hover:text-[#F3A454]"><NuxtLink to="/">WhatsApp</NuxtLink></li>
      </ul>
    </nav>
    <nav>
      <ul class="flex gap-2 sm:gap-4">
        <li class="hover:text-[#F3A454]"><button>Поиск</button></li>
        <li class="hidden hover:text-[#F3A454] lg:block relative">
          <NuxtLink to="/favorites"
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
        <li class="block hover:text-[#F3A454] lg:hidden">
          <button
            class="menu-button2"
            @click="menuStore.open"
          >
            Меню
          </button>
        </li>
      </ul>
    </nav>
  </header>
  <MainMenu />
</template>
