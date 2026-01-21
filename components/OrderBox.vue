<script setup lang="ts">
const props = defineProps<{
  state: {
    orderId: number
    orderDate: number
    status: number
    deliveryMethod: string | null
    paymentMethod: string
    receiver: string
    address?: string | string[]
    finalPrice: number
    deliveryCost: number
    usedCertificates: Record<string, number>
    points: number
    items?: {
      id: number
      alias?: string
      images: string[]
      name: string
      size?: string
      color?: string
      price: number
      oldPrice: number
      count: number
      isCertificate?: boolean
      recipientName?: string | null
      deliveryDetails?: string | null
      certificateType?: string | null
      deliveryMethod?: string | null
      recipientEmail?: string | null
      recipientPhone?: string | null
    }[]
  }
}>()

const isExpandedOrder = ref(false)

const toggleExpandOrder = () => {
  isExpandedOrder.value = !isExpandedOrder.value
}

const formattedAddress = computed(() => {
  const addr = props.state.address
  if (!addr) return ""
  if (Array.isArray(addr)) {
    return addr.filter(Boolean).join(", ")
  }
  return addr
})

const priceFormatter = (value: number) => {
  const formattedValue = new Intl.NumberFormat("ru-RU").format(value)
  return `${formattedValue} ₽`
}

const navigateToItem = (itemAlias: string | undefined, itemId: number) => {
  // Не навигируем для сертификатов
  if (itemId === -1) {
    navigateTo("/certificate")
    return
  }
  const alias = itemAlias || String(itemId)
  navigateTo(`/product/${alias}`)
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}
</script>

<template>
  <div
    class="border flex flex-col gap-6 rounded-3xl w-full p-8 font-[Manrope] text-[#211D1D]"
    :class="isExpandedOrder ? 'border-[#211D1D]' : 'border-[#A6CEFF]'"
  >
    <div class="flex justify-between items-center">
      <div class="flex gap-2 items-center">
        <span class="text-sm">№ {{ state.orderId }} от {{ formatDate(state.orderDate) }}</span>
        <div
          :class="[
            state.status === 1
              ? 'bg-[#F07C6A] border-[#F07C6A]'
              : state.status === 2
                ? 'bg-[#E29650] border-[#E29650]'
                : state.status === 3
                  ? 'bg-[#4395C2] border-[#4395C2]'
                  : state.status === 4
                    ? 'bg-[#008C49] border-[#008C49]'
                    : 'bg-[#E57979] border-[#E57979]',
            'text-xs text-[#FFFFFA] p-1 rounded-md border',
          ]"
        >
          {{
            state.status === 1
              ? "Ожидает оплаты"
              : state.status === 2
                ? "Обрабатывается"
                : state.status === 3
                  ? "В пути"
                  : state.status === 4
                    ? "Получен"
                    : "Отменён"
          }}
        </div>
      </div>
      <button
        class="toggle-button cursor-pointer flex items-center justify-center"
        :class="{ rotated: !isExpandedOrder }"
        @click="toggleExpandOrder"
      />
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
            <img
              v-if="(item?.images && item.images.length > 0) ||
              item.certificateType === 'Физический'"
              :src="item.certificateType === 'Физический' ? '/cert.jpg' :
              item.images[0]"
              alt="order-img"
              width="57"
              height="72"
              class="rounded-2xl border-[0.5px] border-[#211D1D]"
            >
            <div class="flex flex-col gap-1">
              <span
                class="font-light text-sm text-[#414141] cursor-pointer"
                @click="navigateToItem(item.alias, item.id)"
              >
                {{ item.name }}
              </span>
              <span class="font-light text-[13px]">
                <template v-if="!item.isCertificate && !item.isGame">
                  Размер: {{ item.size }} <span class="ml-1">Цвет: {{ item.color }}</span>
                </template>
                <template v-else-if="!item.isGame">
                  <div class="flex flex-col gap-1">
                    <span>Кому: {{ item.recipientName }} <span class="ml-1">Тип: {{
                        item.certificateType }}</span></span>
                  <span
v-if="item?.deliveryMethod === 'Электронной почтой' || item?.deliveryMethod ===
                  'По SMS'">Способ
                                                                получения: {{item.deliveryMethod}}
                  ({{ item?.deliveryMethod === 'Электронной почтой' ?
                      item?.recipientEmail : item?.recipientPhone.code +
                      item?.recipientPhone.phone
                            }})</span>
                  </div>
                </template>
              </span>
              <span class="text-xs text-[#414141]">
                {{ priceFormatter(item.price) }}
                <span class="font-light text-[#606060] ml-1">за шт.</span>
              </span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-4">
            <div class="flex items-center gap-2">
              <div class="py-1 px-3 flex gap-1 rounded-xl border-[0.7px] border-[#211D1D] text-xs font-light">
                {{ item.count }}
              </div>
            </div>
            <span class="text-xs font-light">
              {{ priceFormatter(item.price * item.count) }}
              <span
                v-if="item.oldPrice > 0"
                class="line-through ml-1"
                >{{ priceFormatter(item.oldPrice * item.count) }}</span
              >
            </span>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-xs font-light"
          >Получатель: <span class="font-normal">{{ state.receiver }}</span></span
        >
        <div
          v-if="formattedAddress"
          class="flex items-center gap-1"
        >
          <span class="text-xs font-light"
            >Адрес доставки: <span class="font-normal">{{ formattedAddress }}</span></span
          >
        </div>
        <span
          v-if="state.deliveryMethod"
          class="text-xs font-light"
          >Способ доставки: <span class="font-normal">{{ state.deliveryMethod }}</span></span
        >
        <span
          v-if="state.recieveMethod"
          class="text-xs font-light"
        >Способ получения: <span class="font-normal">{{ state.recieveMethod
                                             }} ({{ state.deliveryMethod }})</span></span
        >
        <span class="text-xs font-light"
          >Способ оплаты: <span class="font-normal">{{ state.paymentMethod }}</span></span
        >
        <span class="text-xs font-light"
          >Стоимость доставки: <span class="font-normal">{{ priceFormatter(state.deliveryCost) }}</span></span
        >
        <span class="text-xs font-light"
          >Сумма заказа: <span class="font-normal">{{ priceFormatter(state.finalPrice) }}</span></span
        >
        <span class="text-xs font-light"
        >Оплачено баллами:
          <span class="font-normal">{{
              priceFormatter(state.points)
                                    }}</span></span
        >
        <span class="text-xs font-light"
          >Оплачено сертификатом:
          <span class="font-normal">{{
            priceFormatter(Object.values(state.usedCertificates).reduce((sum, val) => sum + val, 0))
          }}</span></span
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
      >Сумма заказа: <span class="font-normal">{{ priceFormatter(state.finalPrice) }}</span></span
    >
  </div>
</template>

<style scoped>
.collapsible-div {
  transition-property: max-height, opacity;
}

.toggle-button {
  background-image: url("/order-arrow.svg");
  background-size: contain;
  background-repeat: no-repeat;
  width: 1rem;
  height: 1rem;
  border: none;
  background-position: center;
}

.toggle-button.rotated {
  transform: rotate(180deg);
}
</style>
