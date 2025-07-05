<script setup lang="ts">

</script>

<template>
  <header class="font-[Manrope] text-sm flex justify-between items-center p-4 bg-[#FFFFFA] text-[#211D1D]">
	  <div>
		  <NuxtLink to="/">
		    <NuxtImg src="logo.svg" alt="CASA AL MARE" width="229" height="30" loading="eager" />
		  </NuxtLink>
	  </div>
	  <nav>
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
		  <ul class="flex gap-4">
			  <li><button>Поиск</button></li>
			  <li><NuxtLink to="/">Избранное</NuxtLink></li>
			  <li><NuxtLink to="/">Корзина</NuxtLink></li>
		  </ul>
	  </nav>
  </header>
</template>