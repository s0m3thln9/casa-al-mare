<script setup lang="ts">

interface MenuItem {
	label: string;
	link: string;
	submenu?: MenuItem[];
}

const props = defineProps<{
	isMenuOpen: boolean;
}>();

const emit = defineEmits<{
	(e: 'open-popup'): void;
	(e: 'close-menu'): void;
}>();

const menuRef = ref<HTMLElement | null>(null);
const activeSubmenu = ref<MenuItem[] | null>(null);

const menuItems: MenuItem[] = [
	{ label: 'Смотреть все', link: '/catalog' },
	{
		label: 'Купальники',
		link: '/catalog/swimsuits',
		submenu: [
			{ label: 'Цельные', link: '/catalog/swimsuits/one-piece' },
			{ label: 'Бикини', link: '/catalog/swimsuits/bikini' },
		],
	},
	{ label: 'Нижняя часть купальника', link: '/catalog/bottoms' },
	{ label: 'Верхняя часть купальника', link: '/catalog/tops' },
	{
		label: 'Одежда для пляжа',
		link: '/catalog/beachwear',
		submenu: [
			{ label: 'Платья', link: '/catalog/beachwear/dresses' },
			{ label: 'Шорты', link: '/catalog/beachwear/shorts' },
		],
	},
	{ label: 'Головные уборы', link: '/catalog/hats' },
	{ label: 'Аксессуары', link: '/catalog/accessories' },
];

// Блокировка прокрутки body при открытии меню
watch(() => props.isMenuOpen, (newVal) => {
	document.body.style.overflow = newVal ? 'hidden' : 'auto';
});

onMounted(() => {
	document.addEventListener('click', handleClickOutside);
	document.addEventListener('keydown', handleEscKey);
});

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside);
	document.removeEventListener('keydown', handleEscKey);
	document.body.style.overflow = 'auto';
});

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
		activeSubmenu.value = null;
	}
};

const handleMenuItemClick = () => {
	emit('close-menu');
	activeSubmenu.value = null;
};

const handleEscKey = (event: KeyboardEvent) => {
	if (event.key === 'Escape' && props.isMenuOpen) {
		emit('close-menu');
		activeSubmenu.value = null;
	}
};

const setActiveSubmenu = (submenu: MenuItem[] | undefined) => {
	if (submenu) {
		activeSubmenu.value = submenu;
	} else {
		activeSubmenu.value = null;
	}
};
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
    <div
	    class="flex px-4 bg-[#FFFFFA] rounded-br-3xl border-t-none border-[#BBB8B6] w-full h-full sm:border-t-[0.5px] sm:w-auto sm:h-auto sm:top-[62px]"
    >
      <div class="pr-6 py-6 h-full flex flex-col flex-1 sm:w-[250px] sm:flex-none overflow-y-auto">
        <div
	        class="hidden relative w-full overflow-hidden cursor-pointer sm:block"
	        @click="() => { handleMenuItemClick(); navigateTo('/catalog'); }"
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
        <ul
	        class="flex flex-col gap-6 pb-[170px] font-[Inter] font-normal text-[17px] sm:text-base sm:font-[Manrope] uppercase sm:font-light sm:gap-4 sm:mt-8 sm:pb-0 sm:normal-case"
        >
          <li
	          v-for="item in menuItems"
	          :key="item.label"
	          class="flex gap-2 justify-between items-center sm:justify-start cursor-pointer"
	          @click="item.submenu ? setActiveSubmenu(item.submenu) : null"
          >
            <span v-if="item.submenu" class="px-2 py-1">{{ item.label }}</span>
            <NuxtLink
	            v-else
	            :to="item.link"
	            class="px-2 py-1"
	            @click="handleMenuItemClick"
            >{{ item.label }}</NuxtLink>
            <NuxtImg
	            v-if="item.submenu"
	            src="/arrow-right.svg"
	            alt="arrow"
	            class="w-1.5"
            />
          </li>
        </ul>
        <ul
	        class="py-4 border-t-[0.5px] border-[#BBB8B6] flex flex-col gap-4 mt-8 font-[Manrope] font-light text-[15px] sm:text-base"
        >
          <li class="flex gap-2 justify-between items-center sm:justify-start">
            <NuxtLink
	            class="px-2 py-1"
	            to="/profile"
	            @click="handleMenuItemClick"
            >Войти в Личный кабинет</NuxtLink>
          </li>
          <li class="flex gap-2 justify-between items-center sm:justify-start">
            <NuxtLink
	            class="px-2 py-1"
	            to="/"
	            @click="handleMenuItemClick"
            >Покупателям</NuxtLink>
            <NuxtImg src="/arrow-right.svg" alt="arrow" class="w-1.5" />
          </li>
          <li class="hidden gap-2 justify-between items-center sm:justify-start sm:flex">
            <button
	            class="cursor-pointer px-2 py-1 bg-[#F3A45429] rounded-lg"
	            @click="() => { emit('close-menu'); emit('open-popup'); }"
            >Подписаться</button>
          </li>
          <li class="flex gap-2 justify-between items-center sm:justify-start sm:hidden">
            <button
	            class="cursor-pointer px-2 py-1"
	            @click="() => { emit('close-menu'); emit('open-popup'); }"
            >Подписаться на рассылку</button>
          </li>
          <li class="flex gap-2 justify-between items-center sm:justify-start">
            <NuxtLink
	            class="px-2 py-1"
	            to="/contacts"
	            @click="handleMenuItemClick"
            >Контакты</NuxtLink>
          </li>
        </ul>
      </div>
      <transition name="slide">
        <div
	        v-if="activeSubmenu"
	        class="submenu pl-4 py-6 border-l-[0.5px] border-[#BBB8B6] flex-1 overflow-y-auto sm:block hidden"
        >
          <ul
	          class="flex flex-col gap-6 font-[Inter] font-normal text-[17px] sm:text-base sm:font-[Manrope] uppercase sm:font-light sm:gap-4 sm:normal-case"
          >
            <li
	            v-for="subItem in activeSubmenu"
	            :key="subItem.label"
	            class="flex gap-2 justify-between items-center sm:justify-start"
            >
              <NuxtLink
	              :to="subItem.link"
	              class="px-2 py-1"
	              @click="handleMenuItemClick"
              >{{ subItem.label }}</NuxtLink>
            </li>
          </ul>
        </div>
      </transition>
      <transition name="slide">
        <div
	        v-if="activeSubmenu"
	        class="fixed inset-0 bg-white z-40 sm:hidden"
        >
          <div class="p-4">
            <button
	            @click="activeSubmenu = null"
	            class="mb-4 px-2 py-1 bg-gray-200 rounded"
            >Назад</button>
            <ul class="flex flex-col gap-6">
              <li v-for="subItem in activeSubmenu" :key="subItem.label">
                <NuxtLink
	                :to="subItem.link"
	                class="px-2 py-1"
	                @click="handleMenuItemClick"
                >{{ subItem.label }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.submenu {
	min-width: 200px;
}

.slide-enter-active,
.slide-leave-active {
	transition: all 0.3s ease-in-out;
}
.slide-enter-from,
.slide-leave-to {
	opacity: 0;
	transform: translateX(-100%);
}
.slide-enter-to,
.slide-leave-from {
	opacity: 1;
	transform: translateX(0);
}
</style>