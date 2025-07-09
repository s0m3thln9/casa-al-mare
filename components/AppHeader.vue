<script setup lang="ts">

</script>

<template>
  <header
	  class="font-[Manrope] text-xs flex justify-between items-center p-4 bg-[#FFFFFA] text-[#211D1D] sm:text-sm"
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
		    <li><NuxtLink to="/">Меню</NuxtLink> </li>
		    <li><NuxtLink to="/">Новинки</NuxtLink> </li>
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
			  <li class="block lg:hidden"><button>Меню</button></li>
		  </ul>
	  </nav>
  </header>
</template>