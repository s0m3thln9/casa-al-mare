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
		func: popupStore.open,
	},
	{
		label: 'Контакты',
		link: '/contacts',
	},
]

const handleItemClick = (item: MenuItem) => {
	if (item.submenu) {
		alert('submenu clicked')
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

</script>

<template>
  <div class="absolute inset-0 z-30" @click.self="menuStore.close">
	  <div class="absolute top-[62px] flex bg-[#FFFFFA] border-t-[0.5px] border-[#BBB8B6] rounded-br-3xl w-fit">
		  <div class="p-6 flex flex-col gap-8">
			  <div
				  class="hidden relative w-full overflow-hidden cursor-pointer sm:block"
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
			  <ul class="flex flex-col gap-4 py-4 text-base font-[Manrope] font-light">
				  <li 
					  v-for="(item, index) in menuItems"
					  :key="index"
					  class="flex items-center justify-between cursor-pointer"
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
			  <ul class="flex flex-col gap-4 py-4 text-base font-[Manrope] font-light border-t-[0.5px] border-[#BBB8B6]">
				  <li
					  v-for="(item, index) in secondMenuItems"
					  :key="index"
					  class="flex items-center justify-between cursor-pointer"
					  @click.stop="handleItemClick(item)"
				  >
					  <span :class="['px-2 py-1', item.customClass]">{{item.label}}</span>
					  <NuxtImg
						  v-if="item.submenu"
						  src="/arrow-right.svg"
						  alt="arrow"
						  class="w-1.5"
					  />
				  </li>
			  </ul>
		  </div>
<!--		  <div>fdsf</div>-->
	  </div>
  </div>
</template>

<style scoped>

</style>