<script setup lang="ts">
const emit = defineEmits<{
	(e: 'open-popup'): void
}>()

const isMenuOpen = ref(false)
const scrollbarWidth = ref(0)

const getScrollbarWidth = () => {
	const outer = document.createElement('div')
	outer.style.visibility = 'hidden'
	outer.style.overflow = 'scroll'
	document.body.appendChild(outer)
	const inner = document.createElement('div')
	outer.appendChild(inner)
	const width = outer.offsetWidth - inner.offsetWidth
	outer.remove()
	return width
};

const toggleMenu = () => {
	if (!isMenuOpen.value) {
		scrollbarWidth.value = getScrollbarWidth()
		document.body.style.overflow = 'hidden'
		document.body.style.paddingRight = `${scrollbarWidth.value}px`
	} else {
		document.body.style.overflow = 'auto'
		document.body.style.paddingRight = '0'
	}
	isMenuOpen.value = !isMenuOpen.value
}

</script>

<template>
  <header
	  class="relative font-[Manrope] text-xs flex justify-between items-center p-2 bg-[#FFFFFA] text-[#211D1D] sm:text-sm sm:p-4"
  >
	  <div>
		  <NuxtLink to="/">
		    <NuxtImg
			    src="logo.svg" alt="CASA AL MARE"
			    class="min-w-[126px] h-[17px] sm:w-[229px] sm:h-[30px]"
			    loading="eager"
		    />
		  </NuxtLink>
	  </div>
	  <nav class="hidden lg:block">
		  <ul class="flex gap-4">
		    <li class="hover:text-[#F3A454]"><button class="cursor-pointer menu-button" @click="toggleMenu">Меню</button> </li>
		    <li class="hover:text-[#F3A454]"><NuxtLink to="/catalog">Новинки</NuxtLink> </li>
		    <li class="hover:text-[#F3A454]"><NuxtLink to="/blog">Блог</NuxtLink> </li>
		    <li class="hover:text-[#F3A454]"><NuxtLink to="/collections/collection">NEW COLLECTION</NuxtLink> </li>
		    <li class="hover:text-[#F3A454]"><NuxtLink to="/">Telegram</NuxtLink> </li>
		    <li class="hover:text-[#F3A454]"><NuxtLink to="/">WhatsApp</NuxtLink> </li>
		  </ul>
	  </nav>
	  <nav>
		  <ul class="flex gap-2 sm:gap-4">
			  <li class="hover:text-[#F3A454]"><button>Поиск</button></li>
			  <li class="hidden hover:text-[#F3A454] lg:block"><NuxtLink to="/favourites">Избранное</NuxtLink></li>
			  <li class="hover:text-[#F3A454]"><NuxtLink to="/">Корзина</NuxtLink></li>
			  <li class="block hover:text-[#F3A454] lg:hidden"><button class="menu-button2" @click="toggleMenu">Меню</button></li>
		  </ul>
	  </nav>
	  <MainMenu :is-menu-open="isMenuOpen" @open-popup="emit('open-popup')" @close-menu="toggleMenu" />
  </header>
</template>