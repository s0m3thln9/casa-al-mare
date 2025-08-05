<script setup lang="ts">
import {useMenuStore} from "~/stores/menu"
import {usePopupStore} from "~/stores/popup"

type MenuItem = {
	label: string
	link?: string
	submenu?: MenuItem[]
	customClass?: string
	func?: () => void
}

const menuStore = useMenuStore()
const popupStore = usePopupStore()

const selectedSubmenu = ref<MenuItem[] | undefined>(undefined)
const selectedSubmenuLabel = ref<string | undefined>(undefined)
const isMobile = ref(false)

const menuItems: MenuItem[] = [
	{ label: 'Смотреть все', link: '/catalog' },
	{
		label: 'Купальники',
		submenu: [
			{ label: 'Цельные', link: '/catalog' },
			{ label: 'Бикини', link: '/catalog' },
		],
	},
	{
		label: 'Нижняя часть купальника',
		submenu: [
			{ label: 'Цельные', link: '/catalog' },
			{ label: 'Бикини', link: '/catalog' },
		],
	},
	{
		label: 'Верхняя часть купальника',
		submenu: [
			{ label: 'Цельные', link: '/catalog' },
			{ label: 'Бикини', link: '/catalog' },
		],
	},
	{
		label: 'Одежда для пляжа',
		submenu: [
			{ label: 'Платья', link: '/catalog/beachwear/dresses' },
			{ label: 'Шорты', link: '/catalog/beachwear/shorts' },
		],
	},
	{
		label: 'Головные уборы',
		submenu: [
			{ label: 'Цельные', link: '/catalog' },
			{ label: 'Бикини', link: '/catalog' },
		],
	},
	{
		label: 'Аксессуары',
		submenu: [
			{ label: 'Цельные', link: '/catalog' },
			{ label: 'Бикини', link: '/catalog' },
		],
	},
]

const secondMenuItems: MenuItem[] = [
	{ label: 'В личный кабинет', link: '/profile' },
	{
		label: 'Покупателям',
		submenu: [
			{ label: 'О нас', link: '/about-us' },
			{ label: 'Доставка и оплата', link: '/about-us' },
			{ label: 'Возврат', link: '/about-us' },
			{ label: 'Уход за изделиями', link: '/about-us' },
		],
	},
	{
		label: 'Подписаться на расссылку',
		customClass: 'bg-[#F3A45429] rounded-lg',
		func: () => popupStore.open('subscription'),
	},
	{
		label: 'Контакты',
		link: '/contacts',
	},
]

const handleItemClick = (item: MenuItem) => {
	if (item.submenu) {
		selectedSubmenu.value = item.submenu
		selectedSubmenuLabel.value = item.label
	}
	if (item.link) {
		menuStore.close()
		navigateTo(item.link)
		return
	}
	if (item.func) {
		menuStore.close()
		item.func()
		return
	}
}

const goBack = () => {
	selectedSubmenu.value = undefined
}

const updateIsMobile = () => {
	isMobile.value = window.innerWidth < 768
}

onMounted(() => {
	isMobile.value = window.innerWidth < 768
	window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
	window.removeEventListener('resize', updateIsMobile)
})

</script>

<template>
  <div class="absolute inset-0 z-30" :class="menuStore.isOpen ? 'pointer-events-auto' : 'pointer-events-none'" @click.self="menuStore.close">
	  <div
		  class="max-h-[calc(100vh-32px)] sm:max-h-[calc(100vh-62px)] overflow-hidden absolute top-[32px] flex bg-[#FFFFFA] transition-all duration-300 h-full sm:top-[62px] sm:rounded-br-3xl sm:border-t-[0.5px] sm:border-[#BBB8B6] sm:h-auto"
		  :class="[menuStore.isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0', isMobile ? 'w-full' : 'w-fit']"
	  >
		  <div
			  class="flex flex-col z-31 bg-[#FFFFFA] overflow-y-auto"
			  :class="[(selectedSubmenu !== undefined) && 'border-r-[0.5px] border-[#BBB8B6]', isMobile ? (selectedSubmenu !== undefined) ? 'w-0' : 'px-2 pt-8 pb-6 w-full justify-between' : 'p-6 gap-8']"
		  >
			  <div
				  class="w-[252px] min-h-[180px] relative overflow-hidden cursor-pointer"
				  :class="isMobile && 'hidden'"
			  >
          <NuxtImg
	          src="/menu-1.jpg"
	          alt="banner"
	          class="object-cover rounded-lg"
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
				  class="flex flex-col"
				  :class="isMobile ? 'pb-6 gap-6' : 'py-4 gap-4'"
			  >
				  <li 
					  v-for="(item, index) in menuItems"
					  :key="index"
					  class="flex items-center justify-between cursor-pointer text-[#211D1D]"
					  :class="isMobile ? 'font-[Inter] text-[17px] uppercase' : 'text-base font-[Manrope] font-light'"
					  @click.stop="handleItemClick(item)"
				  >
					  <span class="px-2 py-1">{{item.label}}</span>
					  <NuxtImg
						  v-if="item.submenu"
						  src="/arrow-right.svg"
						  alt="arrow"
						  class="w-1.5"
					  />
				  </li>
			  </ul>
			  <ul
				  class="flex flex-col border-t-[0.5px] border-[#BBB8B6]"
				  :class="isMobile ? 'pt-6 gap-6' : 'py-4 gap-4'"
			  >
				  <li
					  v-for="(item, index) in secondMenuItems"
					  :key="index"
					  class="flex items-center justify-between cursor-pointer text-[#211D1D]"
					  :class="isMobile ? 'font-[Inter] text-[17px] uppercase' : 'text-base font-[Manrope] font-light'"
					  @click.stop="handleItemClick(item)"
				  >
					  <span :class="['px-2 py-1', !isMobile && item.customClass]">{{item.label}}</span>
					  <NuxtImg
						  v-if="item.submenu"
						  src="/arrow-right.svg"
						  alt="arrow"
						  class="w-1.5"
					  />
				  </li>
			  </ul>
		  </div>
		  <div class="flex flex-col gap-8 transition-[transform,_opacity] duration-300 overflow-y-auto" :class="selectedSubmenu !== undefined ? isMobile ? 'w-full px-4 gap-10 pt-8' : 'min-w-[254px] p-6 translate-x-0 opacity-100' : 'w-0 p-0 -translate-x-full opacity-0'">
			  <div
				  v-if="isMobile"
				  class="flex items-center gap-2 cursor-pointer"
				  @click="goBack"
			  >
				  <NuxtImg
					  src="/arrow-right.svg"
					  alt="arrow"
					  class="w-2 rotate-180"
				  />
				  <span class="font-[Inter] text-[17px] uppercase">{{selectedSubmenuLabel}}</span>
			  </div>
			  <ul class="flex flex-col gap-4 py-4">
				  <li
				    v-for="(item, index) in selectedSubmenu"
				    :key="index"
				    class="flex items-center justify-between cursor-pointer text-[#211D1D]"
				    :class="isMobile ? 'font-[Inter] text-[17px] uppercase' : 'text-base font-[Manrope] font-light'"
				    @click.stop="handleItemClick(item)"
				  >
					  {{item.label}}
				  </li>
			  </ul>
		  </div>
	  </div>
  </div>
</template>

<style scoped>

</style>