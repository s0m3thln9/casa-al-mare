<script setup lang="ts">
interface DocNode {
  id: number
  type: string
  pagetitle: string
  alias: string
  template: number
  subitems?: Record<string, DocNode>
  [key: string]: any
}

interface MenuItem {
  label: string
  link?: string
  path?: string
  submenu?: MenuItem[]
  customClass?: string
  customClass2?: string
  func?: () => void
  a?: string
}

const menuStore = useMenuStore()
const popupStore = usePopupStore()
const authStore = useAuthStore()
const authModalStore = useAuthModalStore()
const docsStore = useDocsStore()
const catalogStore = useCatalogStore()

const selectedSubmenu = ref<MenuItem[] | null>(null)
const selectedSubmenuLabel = ref<string | null>(null)
const viewport = useViewport()
const isMobile = computed(() => viewport.isLessThan("sm"))

// Рекурсивная функция для построения меню из дерева (только 1 уровень)
const buildMenuFromTree = (node: DocNode, parentPath = ""): MenuItem[] => {
  const items: MenuItem[] = []

  if (!node.subitems) return items

  for (const key in node.subitems) {
    const item = node.subitems[key]

    // Только элементы с template = 2 (категории)
    if (item.template === 2) {
      const currentPath = parentPath ? `${parentPath}/${item.alias}` : item.alias

      const menuItem: MenuItem = {
        label: item.pagetitle,
        link: "/catalog",
        path: currentPath,
      }

      // Добавляем подменю только для элементов первого уровня (без parentPath)
      if (!parentPath && item.subitems) {
        const submenu: MenuItem[] = []

        for (const subKey in item.subitems) {
          const subItem = item.subitems[subKey]

          if (subItem.template === 2) {
            submenu.push({
              label: subItem.pagetitle,
              link: "/catalog",
              path: `${currentPath}/${subItem.alias}`,
            })
          }
        }

        if (submenu.length > 0) {
          menuItem.submenu = submenu
        }
      }

      items.push(menuItem)
    }
  }

  return items
}

// Генерируем меню из дерева
const menuItems = computed<MenuItem[]>(() => {
  const tree = docsStore.tree?.data
  if (!tree?.catalog) return []

  const items: MenuItem[] = [{ label: "Смотреть все", link: "/catalog" }]

  // Добавляем динамически сгенерированные пункты из дерева
  const dynamicItems = buildMenuFromTree(tree.catalog)
  items.push(...dynamicItems)

  // Добавляем статичный пункт "Сертификаты"
  items.push({
    label: "Сертификаты",
    link: "/certificate",
  })
  items.push({
    label: "Новинки",
    link: "/catalog",
    customClass2: "sm:hidden",
  })
  items.push({
    label: "Блог",
    link: "/blog",
    customClass2: "sm:hidden",
  })
  items.push({
    label: "CAMPAIGNS",
    link: "/collections",
    customClass2: "sm:hidden",
  })

  return items
})

const secondMenuItems: MenuItem[] = [
  {
    label: "Избранное",
    customClass2: "sm:hidden",
    link: "/favorites",
  },
  {
    label: "В личный кабинет",
    func: () => {
      menuStore.close()
      if (authStore.isAuth) {
        navigateTo("/profile/profile")
      } else {
        authModalStore.open()
      }
    },
  },
  {
    label: "Покупателям",
    submenu: [
      { label: "О нас", link: "/about-us" },
      { label: "Доставка и оплата", link: "/info/dostavka-i-oplata" },
      { label: "Возврат и обмен", link: "/info/vozvrat-i-obmen" },
      { label: "Уход за изделиями", link: "/care" },
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
  {
    label: "Telegram",
    customClass2: "sm:hidden",
    a: "https://t.me/casaalmare_swim",
  },
  {
    label: "WhatsApp",
    customClass2: "sm:hidden",
    a: "https://wa.me/79300360494",
  },
]

const handleMenuClick = (item: MenuItem) => {
  if (item.submenu) {
    // Toggle логика для подменю
    if (selectedSubmenu.value !== null) {
      if (selectedSubmenuLabel.value === item.label) {
        selectedSubmenu.value = null
        selectedSubmenuLabel.value = null
      } else {
        selectedSubmenu.value = null
        selectedSubmenuLabel.value = null
        setTimeout(() => {
          selectedSubmenu.value = item.submenu!
          selectedSubmenuLabel.value = item.label
        }, 200)
      }
    } else {
      selectedSubmenu.value = item.submenu
      selectedSubmenuLabel.value = item.label
    }
    return
  }

  // Логика для клика на пункте без submenu
  if (selectedSubmenu.value !== null) {
    selectedSubmenu.value = null
    selectedSubmenuLabel.value = null
    setTimeout(() => {
      proceedWithNavigationAndClose(item)
    }, 300)
  } else {
    proceedWithNavigationAndClose(item)
  }
}

const proceedWithNavigationAndClose = (item: MenuItem) => {
  menuStore.close()

  if (item.func) {
    item.func()
    return
  }

  if (item.a) {
    window.open(item.a, "_blank", "noopener,noreferrer")
    return
  }

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

    // Навигация с path для категорий
    if (item.path) {
      navigateTo({
        path: item.link,
        query: { path: item.path },
      })
      return
    }

    navigateTo({ path: item.link })
    return
  }
}

const goBack = () => {
  selectedSubmenu.value = null
  selectedSubmenuLabel.value = null
}

onMounted(() => {
  if (!docsStore.tree) {
    docsStore.fetchTree()
  }
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
    class="fixed inset-0 z-30"
    :class="menuStore.isOpen ? 'pointer-events-auto' : 'pointer-events-none'"
    @click.self="menuStore.close"
  >
    <div
      class="fixed top-[32px] flex bg-[#FFFFFA] transition-all duration-300 sm:top-[62px] sm:rounded-b-3xl sm:border-t-[0.5px] sm:border-r-[0.5px] sm:border-b-[0.5px] sm:border-[#F9F6EC]"
      :class="[
        menuStore.isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0',
        isMobile
          ? 'w-full h-[calc(100vh-32px-env(safe-area-inset-bottom))] overflow-y-auto'
          : 'w-fit h-auto max-h-[calc(100vh-62px)] overflow-hidden',
      ]"
    >
      <div
        class="flex flex-col z-31 bg-[#FFFFFA]"
        :class="[
          selectedSubmenu !== null && 'border-r-[0.5px] border-[#F9F6EC]',
          isMobile
            ? selectedSubmenu !== null
              ? 'w-0 overflow-hidden'
              : 'px-2 pt-8 pb-[calc(1.5rem+env(safe-area-inset-bottom))] w-full justify-between'
            : 'p-6 gap-6 overflow-y-auto',
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
            :class="[
              isMobile ? 'font-[Inter] text-[17px] uppercase' : 'text-base font-[Manrope] font-light',
              item.customClass2,
            ]"
            @click.stop="handleMenuClick(item)"
          >
            <span :class="['px-2 py-1', !isMobile && item.customClass]">{{ item.label }}</span>
            <NuxtImg
              v-if="item.submenu"
              src="/arrow-right.svg"
              alt="arrow"
              class="w-1.5 transition-transform duration-300"
              :class="{ 'rotate-180': selectedSubmenuLabel === item.label }"
            />
          </li>
        </ul>
        <ul
          class="flex flex-col border-t-[1px]"
          :class="isMobile ? 'py-4 gap-4 border-[#BBB8B6]' : 'pt-6 gap-6 border-[#F9F6EC]'"
        >
          <li
            v-for="(item, index) in secondMenuItems"
            :key="index"
            class="flex items-center justify-between cursor-pointer text-[#211D1D] font-light font-[Manrope]"
            :class="[isMobile ? 'px-4 text-[15px]' : 'text-base', item.customClass2]"
            @click.stop="handleMenuClick(item)"
          >
            <span :class="['px-2 py-1', !isMobile && item.customClass]">{{ item.label }}</span>
            <NuxtImg
              v-if="item.submenu"
              src="/arrow-right.svg"
              alt="arrow"
              class="w-1.5 transition-transform duration-300"
              :class="{ 'rotate-180': selectedSubmenuLabel === item.label }"
            />
          </li>
        </ul>
      </div>
      <div
        class="flex flex-col gap-8 transition-[transform,_opacity] duration-300"
        :class="
          selectedSubmenu !== null
            ? isMobile
              ? 'w-full px-4 gap-10 pt-8 pb-[calc(1.5rem+env(safe-area-inset-bottom))] overflow-y-auto'
              : 'min-w-[254px] p-6 translate-x-0 opacity-100 overflow-y-auto'
            : 'w-0 p-0 -translate-x-full opacity-0 overflow-hidden'
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
