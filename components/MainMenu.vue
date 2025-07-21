<script setup lang="ts">
const props = defineProps<{
	isMenuOpen: boolean
}>()

const emit = defineEmits<{
	(e: 'open-popup'): void
	(e: 'close-menu'): void
}>()

const menuRef = ref<HTMLElement | null>(null)

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
	document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
	document.removeEventListener('keydown', handleEscKey)
})

const handleClickOutside = (event: MouseEvent) => {
	const menuButton = document.querySelector('.menu-button');
	const menuButton2 = document.querySelector('.menu-button2');
	if (
		menuRef.value &&
		!menuRef.value.contains(event.target as Node) &&
		!menuButton?.contains(event.target as Node) &&
		!menuButton2?.contains(event.target as Node) &&
		props.isMenuOpen
	) {
		emit('close-menu');
	}
}

const handleMenuItemClick = () => {
	// emit('close-menu')
}

const handleEscKey = (event: KeyboardEvent) => {
	if (event.key === 'Escape' && props.isMenuOpen) {
		emit('close-menu')
	}
}

</script>

<template>
  <div
	  ref="menuRef"
	  class="absolute top-[33px] left-0 z-30 transition-all duration-300 ease-in-out w-full h-[100svh] sm:h-auto sm:w-auto sm:top-[62px]"
	  :class="{
      'opacity-100 translate-x-0': isMenuOpen,
      'opacity-0 translate-x-[-100%]': !isMenuOpen,
    }"
  >
	  <div class="py-8 px-4 bg-[#FFFFFA] rounded-br-3xl border-t-none border-[#BBB8B6] w-full h-full max-h-[100svh] overflow-y-auto sm:border-t-[0.5px] sm:w-auto sm:h-auto sm:p-6">
		  <div
				class="hidden relative w-full overflow-hidden cursor-pointer sm:block"
				@click="() => {
					handleMenuItemClick()
					navigateTo('/catalog')
				}"
		  >
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
		  <ul class="flex flex-col gap-6 pb-[170px] font-[Inter] font-normal text-[17px] sm:text-base sm:font-[Manrope] uppercase sm:font-light sm:gap-4 sm:mt-8 sm:pb-0 sm:normal-case">
			  <li class="flex gap-2 justify-between items-center sm:justify-start"><NuxtLink class="px-2 py-1" to="/" @click="handleMenuItemClick">Смотреть все</NuxtLink><NuxtImg src="/arrow-right.svg" alt="arrow" class="w-1.5" /></li>
				<li class="flex gap-2 justify-between items-center sm:justify-start"><NuxtLink class="px-2 py-1" to="/" @click="handleMenuItemClick">Купальники</NuxtLink></li>
				<li class="flex gap-2 justify-between items-center sm:justify-start"><NuxtLink class="px-2 py-1" to="/" @click="handleMenuItemClick">Нижняя часть купальника</NuxtLink></li>
				<li class="flex gap-2 justify-between items-center sm:justify-start"><NuxtLink class="px-2 py-1" to="/" @click="handleMenuItemClick">Верхняя часть купальника</NuxtLink></li>
				<li class="flex gap-2 justify-between items-center sm:justify-start"><NuxtLink class="px-2 py-1" to="/" @click="handleMenuItemClick">Одежда для пляжа</NuxtLink><NuxtImg src="/dot.svg" alt="dot" class="w-[9px]" /></li>
				<li class="flex gap-2 justify-between items-center sm:justify-start"><NuxtLink class="px-2 py-1" to="/" @click="handleMenuItemClick">Головные уборы</NuxtLink></li>
				<li class="flex gap-2 justify-between items-center sm:justify-start"><NuxtLink class="px-2 py-1" to="/" @click="handleMenuItemClick">Аксессуары</NuxtLink></li>
		  </ul>
		  <ul class="py-4 border-t-[0.5px] border-[#BBB8B6] flex flex-col gap-4 mt-8 font-[Manrope] font-light text-[15px] sm:text-base">
				<li class="flex gap-2 justify-between items-center sm:justify-start"><NuxtLink class="px-2 py-1" to="/" @click="handleMenuItemClick">Войти в Личный кабинет</NuxtLink></li>
				<li class="flex gap-2 justify-between items-center sm:justify-start"><NuxtLink class="px-2 py-1" to="/" @click="handleMenuItemClick">Покупателям</NuxtLink><NuxtImg src="/arrow-right.svg" alt="arrow" class="w-1.5" /></li>
				<li class="hidden gap-2 justify-between items-center sm:justify-start sm:flex"><button
class="cursor-pointer px-2 py-1 bg-[#F3A45429] rounded-lg" to="/" @click="() => {
					emit('close-menu')
					emit('open-popup')
				}"
				>Подписаться</button></li>
				<li class="flex gap-2 justify-between items-center sm:justify-start sm:hidden"><button
class="cursor-pointer px-2 py-1" to="/" @click="() => {
					emit('close-menu')
					emit('open-popup')
				}"
				>Подписаться на рассылку</button></li>
				<li class="flex gap-2 justify-between items-center sm:justify-start"><NuxtLink class="px-2 py-1" to="/" @click="handleMenuItemClick">Контакты</NuxtLink></li>
		  </ul>
	  </div>
  </div>
</template>

<style scoped>

</style>