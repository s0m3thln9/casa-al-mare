<script setup lang="ts">
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
		    <li><button @click="toggleMenu">Меню</button> </li>
		    <li><NuxtLink to="/catalog">Новинки</NuxtLink> </li>
		    <li><NuxtLink to="/">Блог</NuxtLink> </li>
		    <li><NuxtLink to="/">NEW COLLECTION</NuxtLink> </li>
		    <li><NuxtLink to="/">Telegram</NuxtLink> </li>
		    <li><NuxtLink to="/">WhatsApp</NuxtLink> </li>
		  </ul>
	  </nav>
	  <nav>
		  <ul class="flex gap-2 sm:gap-4">
			  <li><button>Поиск</button></li>
			  <li class="hidden lg:block"><NuxtLink to="/">Избранное</NuxtLink></li>
			  <li><NuxtLink to="/">Корзина</NuxtLink></li>
			  <li class="block lg:hidden"><button @click="toggleMenu">Меню</button></li>
		  </ul>
	  </nav>
	  <MainMenu :is-menu-open="isMenuOpen" />
  </header>
</template>