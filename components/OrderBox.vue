<script setup lang="ts">
const props = defineProps<{
  state: {
    status: "processing" | "pending" | "way" | "recieved"
    items?: {
      id: string
      img: string
      name: string
      top: string
      bottom: string
      color: string
      price: number
      count: number
    }[]
    orderId: number
    receiver: string
    address: string
    orderDate: string
    deliveryDate: string
    deliveryMethod: string
    paymentMethod: string
  }
}>()

const isExpandedOrder = ref(false)
const isExpandedAddress = ref(false)

const toggleExpandOrder = () => {
  isExpandedOrder.value = !isExpandedOrder.value
}

const toggleExpandAddress = () => {
  isExpandedAddress.value = !isExpandedAddress.value
}

const priceFormatter = (value: number) => {
  const formattedValue = new Intl.NumberFormat("ru-RU").format(value)
  return `${formattedValue} ₽`
}

const calculateSum = () => {
  if (props.state.items === undefined || props.state.items.length === 0) return 0
  return props.state.items.map((item) => item.price * item.count).reduce((acc, c) => acc + c, 0)
}
</script>

<template>
  <div class="border border-[#211D1D] flex flex-col gap-6 rounded-3xl w-full p-8 font-[Manrope] text-[#211D1D]">
    <div class="flex justify-between items-center">
      <div class="flex gap-2 items-center">
        <span class="text-sm">№ {{ state.orderId }} от {{ state.orderDate }}</span>
        <div
          :class="[
            state.status === 'pending'
              ? 'bg-[#E57979] border-[#E57979]'
              : state.status === 'processing'
                ? 'bg-[#E29650] border-[#E29650]'
                : state.status === 'way'
                  ? 'bg-[#4395C2] border-[#4395C2]'
                  : 'bg-[#008C49] border-[#008C49]',
            'text-xs text-[#FFFFFA] p-1 rounded-md border',
          ]"
        >
          {{
            state.status === "pending"
              ? "Ожидает оплаты"
              : state.status === "processing"
                ? "Обрабатывается"
                : state.status === "way"
                  ? "В пути"
                  : "Получен"
          }}
        </div>
      </div>
      <button
        class="w-4 h-4 flex items-center justify-center cursor-pointer"
        :class="isExpandedOrder ? 'rotate-0' : 'rotate-180'"
        @click="toggleExpandOrder"
      >
        <NuxtImg
          src="/order-arrow.svg"
          class="w-full"
        />
      </button>
    </div>
    <div
      class="collapsible-div flex flex-col gap-6 overflow-hidden transition-max-height duration-300 ease-in-out"
      :class="{ 'max-h-500 opacity-100': isExpandedOrder, 'max-h-0 opacity-0': !isExpandedOrder }"
    >
      <div class="flex flex-col gap-6">
        <div
          v-for="(item, index) in state.items"
          :key="index"
          class="flex items-center justify-between w-full"
        >
          <div class="flex items-center gap-2">
            <NuxtImg
              :src="item.img"
              alt="order-img"
              width="57"
              height="72"
              class="rounded-2xl border-[0.5px] border-[#211D1D]"
            />
            <div class="flex flex-col gap-1">
              <span
                class="font-light text-sm text-[#414141] cursor-pointer"
                @click="navigateTo(`/catalog/${item.id}`)"
                >{{ item.name }}</span
              >
              <span class="font-light text-[13px]"
                >Размер: {{ item.top }} <span class="ml-1">Цвет: {{ item.color }}</span></span
              >
              <span class="text-xs text-[#414141]"
                >{{ priceFormatter(item.price) }} <span class="font-light text-[#606060] ml-1">за шт.</span></span
              >
            </div>
          </div>
          <div class="flex flex-col items-end gap-4">
            <div class="py-1 px-3 rounded-xl border-[0.7px] border-[#211D1D] text-xs font-light">{{ item.count }}</div>
            <span class="text-xs font-light"
              >{{ priceFormatter(item.price * item.count) }}
              <span class="line-through ml-1">{{ priceFormatter(item.price * item.count + 1000) }}</span></span
            >
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-xs font-light"
          >Получатель: <span class="font-normal">{{ state.receiver }}</span></span
        >
        <div class="flex items-center gap-1">
          <span class="text-xs font-light"
            >Адрес доставки: <span class="font-normal">{{ state.address }}</span></span
          >
          <ExpandButton
            custom-class="px-2 py-0"
            content="Изменить"
            expanded-content="Вернуть"
            @click="toggleExpandAddress"
          />
        </div>
        <div
          class="overflow-hidden collapsible-div flex flex-col transition-max-height duration-300 ease-in-out"
          :class="{
            'max-h-500 p-4 border border-[#BBB8B6] opacity-100 rounded-2xl': isExpandedAddress,
            'max-h-0 p-0 opacity-0': !isExpandedAddress,
          }"
        >
          <div class="flex flex-col gap-4">
            <div class="flex gap-1 items-center">
              <input
                type="checkbox"
                class="w-4 h-4"
              />
              <span class="text-[13px] font-light">Ул. Заречная, дом 19, кв. 55</span>
            </div>
            <div class="flex gap-1 items-center">
              <input
                type="checkbox"
                class="w-4 h-4"
              />
              <span class="text-[13px] font-light">Москва; Ленинский проспект 62; кв 13</span>
            </div>
            <div class="flex gap-1 items-center">
              <input
                type="checkbox"
                class="w-4 h-4"
              />
              <span class="text-[13px] font-light">Новый адрес</span>
            </div>
            <input
              type="text"
              placeholder="Улица, дом, корпус, строение, квартира"
              class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
            />
            <input
              type="text"
              placeholder="Номер дома и домофон / офис"
              class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
            />
            <AppButton content="Сохранить" />
          </div>
        </div>
        <span class="text-xs font-light"
          >Способ доставки: <span class="font-normal">{{ state.deliveryMethod }}</span></span
        >
        <span class="text-xs font-light"
          >Способ оплаты: <span class="font-normal">{{ state.paymentMethod }}</span></span
        >
        <span class="text-xs font-light"
          >Сумма заказа: <span class="font-normal">{{ priceFormatter(calculateSum()) }}</span></span
        >
      </div>
      <AppButton
        content="Связаться с магазином"
        custom-class="w-full"
      />
    </div>
    <span
      class="text-xs font-light -mt-6"
      :class="isExpandedOrder && 'hidden'"
      >Сумма заказа: <span class="font-normal">{{ priceFormatter(calculateSum()) }}</span></span
    >
  </div>
</template>

<style scoped>
.collapsible-div {
  transition-property: max-height, opacity;
}
</style>
