<script setup lang="ts">
defineProps<{
	isMenuOpen: boolean
}>()
</script>

<template>
  <div
	  class="absolute top-[62px] left-0 z-30 transition-all duration-300 ease-in-out"
	  :class="{
      'opacity-100 translate-x-0': isMenuOpen,
      'opacity-0 translate-x-[-100%]': !isMenuOpen,
      'pointer-events-none': !isMenuOpen,
    }"
  >
	  <div class="p-6 bg-[#FFFFFA] rounded-br-3xl border-t-[0.5px] border-[#BBB8B6]">
		  <div class="relative w-full overflow-hidden">
        <NuxtImg
			    src="/menu-1.jpg"
			    alt="banner"
			    class="w-full h-full object-cover rounded-lg"
			    loading="lazy"
			    width="252"
			    height="180"
		    />
		    <div
			    class="absolute bottom-2 right-2 px-2 py-1 bg-[#FFFFFA99] backdrop-blur-sm rounded-lg font-[Commissioner] font-light text-[#211D1D] text-[11px]"
		    >
		      Категории
		    </div>
      </div>
		  <ul class="flex flex-col gap-4 mt-8 font-[Manrope] font-light">
			  <li class="flex gap-2 items-center"><NuxtLink class="px-2 py-1" to="/">Смотреть все</NuxtLink><NuxtImg src="/arrow-right.svg" alt="arrow" class="w-1.5" /></li>
				<li class="flex gap-2 items-center"><NuxtLink class="px-2 py-1" to="/">Купальники</NuxtLink></li>
				<li class="flex gap-2 items-center"><NuxtLink class="px-2 py-1" to="/">Нижняя часть купальника</NuxtLink></li>
				<li class="flex gap-2 items-center"><NuxtLink class="px-2 py-1" to="/">Верхняя часть купальника</NuxtLink></li>
				<li class="flex gap-2 items-center"><NuxtLink class="px-2 py-1" to="/">Одежда для пляжа</NuxtLink><NuxtImg src="/dot.svg" alt="dot" class="w-[9px]" /></li>
				<li class="flex gap-2 items-center"><NuxtLink class="px-2 py-1" to="/">Головные уборы</NuxtLink></li>
				<li class="flex gap-2 items-center"><NuxtLink class="px-2 py-1" to="/">Аксессуары</NuxtLink></li>
		  </ul>
		  <ul class="py-4 border-t-[0.5px] border-[#BBB8B6] flex flex-col gap-4 mt-8 font-[Manrope] font-light">
				<li class="flex gap-2 items-center"><NuxtLink class="px-2 py-1" to="/">Войти в Личный кабинет</NuxtLink></li>
				<li class="flex gap-2 items-center"><NuxtLink class="px-2 py-1" to="/">Покупателям</NuxtLink><NuxtImg src="/arrow-right.svg" alt="arrow" class="w-1.5" /></li>
				<li class="flex gap-2 items-center"><NuxtLink class="px-2 py-1 bg-[#F3A45429] rounded-lg" to="/">Подписаться</NuxtLink></li>
				<li class="flex gap-2 items-center"><NuxtLink class="px-2 py-1" to="/">Контакты</NuxtLink></li>
		  </ul>
	  </div>
  </div>
</template>

<style scoped>

</style>