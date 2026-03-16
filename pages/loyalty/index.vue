<script setup lang="ts">
useHead({
  title: "Программа лояльности - CASA AL MARE",
})

const authStore = useAuthStore()
const authModalStore = useAuthModalStore()
const userStore = useUserStore()
const docsStore = useDocsStore()

const breadcrumsItems: { name: string; path?: string }[] = [
  { name: "Главная", path: "/" },
  { name: "Программа лояльности" },
]

const levels = [
  {
    level: 1,
    range: "0 - 100 000",
    accrual: "5%",
    writeoff: "До 10%",
  },
  {
    level: 2,
    range: "101 000 - 200 000",
    accrual: "5%",
    writeoff: "До 15%",
  },
  {
    level: 3,
    range: "201 000 и выше",
    accrual: "5%",
    writeoff: "До 20%",
  },
]

const currentLevel = computed(() => (authStore.isAuth ? userStore.user?.loyaltyLevel ?? null : null))

const faqItems = computed(() => {
  const rawItems = docsStore.tree?.data?.docs?.subitems?.["loyality-faq"]?.subitems
  if (!rawItems) return []
  return Object.values(rawItems).sort((a: any, b: any) => (a?.menuindex ?? 0) - (b?.menuindex ?? 0))
})

const openAuthModal = () => {
  authModalStore.open()
}

const handleAccordionClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const header = target.closest(".accordeon .header") as HTMLElement | null
  if (!header) return
  const accordeon = header.closest(".accordeon") as HTMLElement
  accordeon.classList.toggle("open")
}
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] px-2 sm:px-4">
    <div class="py-2 sm:py-6">
      <AppBreadcrumbs :items="breadcrumsItems" />
    </div>
    <div class="mx-auto w-full max-w-[600px] pb-10 sm:pb-16">
      <div class="flex flex-col gap-6 sm:gap-8">
        <div class="flex flex-col gap-6">
          <h1 class="uppercase font-[Inter] text-[17px] text-center">Программа
                                                          лояльности</h1>
          <p class="text-sm font-light text-[#1A1A1A]">
            Вы получаете 5% бонусами с каждой покупки.<br>
В зависимости от общей суммы заказов растет процент, которым можно оплатить следующий заказ.
          </p>
        </div>
        <AppButton
          v-if="!authStore.isAuth"
          variant="primary"
          content="Создать аккаунт и получать бонусы"
          custom-class="w-full sm:w-[280px]"
          @click="openAuthModal"
        />
        <div class="flex flex-col gap-4">
          <span class="font-[Manrope] font-light text-[15px] text-[#0A0E11] sm:font-normal sm:text-[20px]">
            Как растет ваш уровень:
          </span>
          <div
            v-for="level in levels"
            :key="level.level"
            class="p-6 border rounded-lg flex items-start gap-4 max-sm:flex-col"
            :class="currentLevel === level.level ? 'border-[#211D1D]' : 'border-[#BBB8B6]'"
          >
            <div
              class="px-4 py-2 w-[100px] rounded-lg text-sm tracking-tighter"
              :class="currentLevel === level.level ? 'bg-[#F3A454] text-[#FFFFFA]' : 'border border-[#8C8785] text-[#8C8785]'"
            >
              {{ level.level }} уровень:
            </div>
            <p
              class="text-sm"
              :class="currentLevel === level.level ? 'text-[#181818]' : 'text-[#8C8785]'"
            >
              Общая сумма покупок с использованием карты: {{ level.range }}<br>
              Процент начисления бонусов от суммы покупки: {{ level.accrual }}<br>
              Процент возможного списания бонусов: {{ level.writeoff }}
            </p>
          </div>
          <p class="font-[Manrope] font-light text-[12px] sm:text-[10px] text-[#211D1D]">
            5% бонусами начисляется на всех уровнях. Уровень зависит от общей суммы покупок.
          </p>
        </div>
        <div class="flex flex-col gap-4">
          <span class="font-[Manrope] font-light text-[15px] text-[#0A0E11] sm:font-normal sm:text-[20px]">FAQ:</span>
          <div
            v-if="faqItems.length > 0"
            class="loyalty-faq"
            @click="handleAccordionClick"
          >
            <div class="accordeonWrapper">
              <div
                v-for="item in faqItems"
                :key="item.id"
                class="accordeon"
              >
                <div class="header">{{ item.pagetitle }}</div>
                <div
                  class="text"
                  v-html="item.content"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.loyalty-faq .accordeonWrapper {
  border: 1px solid #bbb8b6;
  border-radius: 16px;
  overflow: hidden;
  padding: 16px;
}

.loyalty-faq .accordeon {
  border-bottom: 1px solid rgba(187, 184, 182, 0.5);
  overflow: hidden;
  padding-top: 16px;
  padding-bottom: 16px;
  transition: padding-bottom 300ms ease;
}

.loyalty-faq .accordeon.open {
  padding-bottom: 12px;
}

.loyalty-faq .accordeon:last-child {
  border-bottom: none;
}

.loyalty-faq .accordeon:first-child {
  padding-top: 4px;
}

.loyalty-faq .accordeon .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-family: "Manrope", sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #211d1d;
  user-select: none;
  padding-bottom: 0px;
  transition: padding-bottom 300ms ease;
}

.loyalty-faq .accordeon.open .header {
  padding-bottom: 4px;
}

.loyalty-faq .accordeon .header::after {
  content: "";
  background-image: url("/arrow-right.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 0.75rem;
  height: 0.75rem;
  flex-shrink: 0;
  transform: rotate(90deg);
  transition: transform 300ms ease;
}

.loyalty-faq .accordeon.open .header::after {
  transform: rotate(270deg);
}

.loyalty-faq .accordeon .text {
  max-height: 0;
  font-weight: 400;
  overflow: hidden;
  font-family: "Manrope", sans-serif;
  transition: max-height 300ms ease, padding 300ms ease;
  font-size: 12px;
  color: #363636;
  line-height: 134%;
}

.loyalty-faq .accordeon.open .text {
  max-height: 600px;
}

.loyalty-faq .accordeon .text :deep(p) {
  margin-bottom: 8px;
}

.loyalty-faq .accordeon .text :deep(p:last-child) {
  margin-bottom: 0;
}

.loyalty-faq .accordeon .text :deep(ul),
.loyalty-faq .accordeon .text :deep(ol) {
  list-style-position: outside;
  padding-left: 16px;
  margin-bottom: 8px;
}

.loyalty-faq .accordeon .text :deep(ul li),
.loyalty-faq .accordeon .text :deep(ol li) {
  display: list-item;
  margin-bottom: 0;
}

@media screen and (max-width: 640px) {
  .loyalty-faq .accordeonWrapper {
    border: 0.5px solid #bbb8b6;
  }
}
</style>
