<script setup lang="ts">
type MenuItem = {
	label: string
	link?: string
	submenu?: MenuItem[]
	customClass?: string
	func?: () => void
	types?: string[]
}

const menuStore = useMenuStore()
const popupStore = usePopupStore()

const selectedSubmenu = ref<MenuItem[] | null>(null)
const selectedSubmenuLabel = ref<string | null>(null)
const isMobile = ref(false)

const menuItems: MenuItem[] = [
	{ label: "Смотреть все", link: "/catalog" },
	{
		label: "Купальники",
		submenu: [
			{ label: "Слитные", link: "/catalog", types: ["Комплект бикини"] },
			{ label: "Верх купальника", link: "/catalog", types: ["Топ"] },
			{ label: "Низ купальника", link: "/catalog", types: ["Трусы"] },
		],
	},
	{
		label: "Одежда для пляжа",
		submenu: [
			{ label: "Шорты", link: "/catalog", types: ["Шорты"] },
			{ label: "Рубашки", link: "/catalog", types: ["Рубашки"] },
			{ label: "Поло", link: "/catalog", types: ["Поло"] },
			{ label: "Туники", link: "/catalog", types: ["Туника"] },
			{ label: "Брюки", link: "/catalog", types: ["Брюки"] },
		],
	},
	{
		label: "Аксессуары",
		submenu: [
			{ label: "Панамки", link: "/catalog", types: ["Панамка"] },
			{ label: "Сумки пляжные", link: "/catalog", types: ["Сумка пляжная"] },
			{ label: "Косметички", link: "/catalog", types: ["Косметичка"] },
			{ label: "Полотенца", link: "/catalog", types: ["Полотенце"] },
		],
	},
	{
		label: "Сертификаты",
		link: "/certificate",
	}
]

const secondMenuItems: MenuItem[] = [
	{ label: "В личный кабинет", link: "/profile" },
	{
		label: "Покупателям",
		submenu: [
			{ label: "О нас", link: "/about-us" },
			{ label: "Доставка и оплата", link: "/about-us" },
			{ label: "Возврат", link: "/about-us" },
			{ label: "Уход за изделиями", link: "/about-us" },
		],
	},
	{
		label: "Подписаться на расссылку",
		customClass: "bg-[#F3A45429] rounded-lg",
		func: () => popupStore.open("subscription"),
	},
	{
		label: "Контакты",
		link: "/contacts",
	},
]

const catalogStore = useCatalogStore()

const handleMenuClick = (item: MenuItem) => {
	if (item.submenu) {
		// Изменение: Добавлена логика toggle для того же пункта
		if (selectedSubmenu.value !== null) {
			if (selectedSubmenuLabel.value === item.label) {
				// Если подменю уже открыто от этого пункта — закрываем его
				selectedSubmenu.value = null
				selectedSubmenuLabel.value = null
			} else {
				// Если открыто от другого — закрываем с анимацией, потом открываем новое
				selectedSubmenu.value = null
				selectedSubmenuLabel.value = null
				setTimeout(() => {
					selectedSubmenu.value = item.submenu
					selectedSubmenuLabel.value = item.label
				}, 200) // Задержка для анимации закрытия
			}
		} else {
			// Если подменю закрыто — просто открываем
			selectedSubmenu.value = item.submenu
			selectedSubmenuLabel.value = item.label
		}
		return
	}
	
	// Логика для клика на пункте без submenu (включая подменю): сначала закрываем подменю, потом навигируем
	if (selectedSubmenu.value !== null) {
		selectedSubmenu.value = null
		selectedSubmenuLabel.value = null
		setTimeout(() => {
			proceedWithNavigationAndClose(item)
		}, 300) // Задержка для анимации закрытия подменю
	} else {
		proceedWithNavigationAndClose(item)
	}
}

// Вспомогательная функция для навигации и закрытия (без изменений)
const proceedWithNavigationAndClose = (item: MenuItem) => {
	menuStore.close()
	if (item.link) {
		if (item.label === "Смотреть все") {
			catalogStore.reset()
			navigateTo({ path: item.link })
			return
		}
		if (item.label === "Сертификаты") {
			navigateTo({ path: item.link })
			return
		}
		if (item.types) {
			const validTypes = item.types.filter((t) => catalogStore.filters.types.includes(t))
			navigateTo({
				path: item.link,
				query: validTypes.length ? { label: item.label, types: validTypes } : { label: item.label },
			})
			return
		}
		navigateTo({ path: item.link, query: { label: item.label } })
		return
	}
	if (item.func) {
		item.func()
		return
	}
}

const goBack = () => {
	selectedSubmenu.value = null
	selectedSubmenuLabel.value = null
}

const updateIsMobile = () => {
	isMobile.value = window.innerWidth < 768
}

onMounted(() => {
	isMobile.value = window.innerWidth < 768
	window.addEventListener("resize", updateIsMobile)
})

onUnmounted(() => {
	window.removeEventListener("resize", updateIsMobile)
})

watch(
	() => menuStore.isOpen,
	(isOpen) => {
		if (!isOpen) {
			selectedSubmenu.value = null
			selectedSubmenuLabel.value = null
		}
	},
)
</script>

<template>
  <div
	  class="absolute inset-0 z-30"
	  :class="menuStore.isOpen ? 'pointer-events-auto' : 'pointer-events-none'"
	  @click.self="menuStore.close"
  >
    <div
	    class="max-h-[calc(100vh-32px)] sm:max-h-[calc(100vh-62px)] overflow-hidden absolute top-[32px] flex bg-[#FFFFFA] transition-all duration-300 h-full sm:top-[62px] sm:rounded-b-3xl sm:border-t-[0.5px] sm:border-r-[0.5px] sm:border-b-[0.5px] sm:border-[#F9F6EC] sm:h-auto"
	    :class="[
        menuStore.isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0',
        isMobile ? 'w-full' : 'w-fit',
      ]"
    >
      <div
	      class="flex flex-col z-31 bg-[#FFFFFA] overflow-y-auto"
	      :class="[
          selectedSubmenu !== null && 'border-r-[0.5px] border-[#F9F6EC]',
          isMobile ? (selectedSubmenu !== null ? 'w-0' : 'px-2 pt-8 pb-6 w-full justify-between') : 'p-6 gap-6',
        ]"
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
	          @click.stop="handleMenuClick(item)"
          >
            <span class="px-2 py-1">{{ item.label }}</span>
            <NuxtImg
	            v-if="item.submenu"
	            src="/arrow-right.svg"
	            alt="arrow"
	            class="w-1.5 transition-transform duration-300"
	            :class="{ 'rotate-90': selectedSubmenuLabel === item.label }"
            />
          </li>
        </ul>
        <ul
	        class="flex flex-col border-t-[0.5px] border-[#F9F6EC]"
	        :class="isMobile ? 'pt-6 gap-6' : 'py-4 gap-4'"
        >
          <li
	          v-for="(item, index) in secondMenuItems"
	          :key="index"
	          class="flex items-center justify-between cursor-pointer text-[#211D1D]"
	          :class="isMobile ? 'font-[Inter] text-[17px] uppercase' : 'text-base font-[Manrope] font-light'"
	          @click.stop="handleMenuClick(item)"
          >
            <span :class="['px-2 py-1', !isMobile && item.customClass]">{{ item.label }}</span>
            <NuxtImg
	            v-if="item.submenu"
	            src="/arrow-right.svg"
	            alt="arrow"
	            class="w-1.5 transition-transform duration-300"
	            :class="{ 'rotate-90': selectedSubmenuLabel === item.label }"
            />
          </li>
        </ul>
      </div>
      <div
	      class="flex flex-col gap-8 transition-[transform,_opacity] duration-300 overflow-y-auto"
	      :class="
          selectedSubmenu !== null
            ? isMobile
              ? 'w-full px-4 gap-10 pt-8'
              : 'min-w-[254px] p-6 translate-x-0 opacity-100'
            : 'w-0 p-0 -translate-x-full opacity-0'
        "
      >
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
          <span class="font-[Inter] text-[17px] uppercase">{{ selectedSubmenuLabel }}</span>
        </div>
        <ul class="flex flex-col gap-4 py-4">
          <li
	          v-for="(item, index) in selectedSubmenu"
	          :key="index"
	          class="flex items-center justify-between cursor-pointer text-[#211D1D]"
	          :class="isMobile ? 'font-[Inter] text-[17px] uppercase' : 'text-base font-[Manrope] font-light'"
	          @click.stop="handleMenuClick(item)"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped></style>