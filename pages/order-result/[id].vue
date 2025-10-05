<script setup lang="ts">
const route = useRoute()
const orderId = parseInt(route.params.id as string)

const orderStore = useOrderStore()

onMounted(async () => {
  if (!orderId) {
    await navigateTo("/order")
    return
  }

  const status = await orderStore.checkOrderStatus(orderId)
  if (!status) {
    orderStore.isPaymentSuccessful = false
  }
})

async function handleRetryPay() {
  if (!orderStore.paymentMethod) {
    orderStore.showErrorPaymentMethod = true
    return
  }
  await orderStore.createOrder()
}
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] flex justify-start items-center pt-8 pb-8 flex-col">
    <div class="mt-8 flex max-w-[1264px] flex-col px-2 sm:px-0 sm:flex-row h-fit w-full gap-12">
      <div
        class="p-10 flex flex-col gap-12 w-full max-w-[652px] rounded-4xl border-[0.7px] border-[#BBB8B6] h-fit"
        :class="orderStore.isPaymentSuccessful && 'bg-[#F9F6EC]'"
      >
        <div
          v-if="orderStore.isPaymentSuccessful"
          class="flex flex-col gap-4"
        >
          <h2 class="font-[Inter] text-[17px] text-[#211D1D] uppercase">
            Благодарим Вас за заказ №{{ orderStore.orderId }}!
          </h2>
          <p class="font-[Manrope] text-sm text-[#211D1D] font-light">
            Мы уже проверяем ваш платеж и в течение 30 минут информация появится в вашем личном кабинете
          </p>
          <p class="font-[Manrope] text-sm text-[#211D1D] font-light">
            В случае возникновения вопросов свяжитесь с нами, пожалуйста, написав на почту clients@ или по телефону
            +7999 999 99 99
          </p>
        </div>
        <div
          v-else
          class="flex flex-col gap-4"
        >
          <h2 class="font-[Inter] text-[17px] text-[#E29650] uppercase">Оплата заказа не прошла</h2>
          <p class="font-[Manrope] text-sm text-[#211D1D] font-light">
            При оплате картами может возникать задержка до 5-ти минут. Если оплата была проведена, то она обязательно
            будет принята и обработана.
          </p>
          <p class="font-[Manrope] text-sm text-[#211D1D] font-light">
            Если вы отменили оплату, можете оплатить через личный кабинет, или изменить заказ.
          </p>
        </div>
      </div>

      <div class="p-8 w-full max-w-[564px] h-fit rounded-lg border-[0.7px] border-[#BBB8B6]">
        <div v-if="orderStore.isPaymentSuccessful">
          <h2 class="font-[Inter] text-[17px] text-[#211D1D] uppercase">заказанные товары</h2>
          <div class="flex flex-col gap-6 mt-8">
            <div
              v-for="(item, index) in orderStore.cartDetailed"
              :key="index"
              class="flex items-center justify-between w-full"
            >
              <div class="flex items-center gap-2">
                <NuxtImg
                  :src="item.images[0] || ''"
                  alt="order-img"
                  width="57"
                  height="72"
                  class="rounded-2xl border-[0.5px] border-[#211D1D]"
                />
                <div class="flex flex-col gap-1">
                  <span
                    class="font-light text-sm text-[#414141] cursor-pointer"
                    @click="navigateTo(`/catalog/${item.id}`)"
                  >
                    {{ item.name }}
                  </span>
                  <span class="font-light text-[13px]">
                    Размер: {{ item.size }} <span class="ml-1">Цвет: {{ item.color }}</span>
                  </span>
                  <span class="text-xs text-[#414141]">
                    {{ orderStore.priceFormatter(item.price) }}
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
                  {{ orderStore.priceFormatter(item.price * item.count) }}
                  <span
                    v-if="item.oldPrice > 0"
                    class="line-through ml-1"
                    >{{ orderStore.priceFormatter(item.oldPrice * item.count) }}</span
                  >
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between mt-8">
            <span>Стоимость товаров:</span>
            <span class="flex items-center gap-2">
              {{ orderStore.priceFormatter(orderStore.finalPrice) }}
              <span
                v-if="orderStore.finalPrice < orderStore.totalOldSum"
                class="font-extralight line-through"
                >{{ orderStore.priceFormatter(orderStore.totalOldSum) }}</span
              >
            </span>
          </div>
        </div>
        <div v-else>
          <div class="flex items-center justify-between mt-8">
            <span>Стоимость товаров:</span>
            <span class="flex items-center gap-2">
              {{ orderStore.priceFormatter(orderStore.finalPrice) }}
              <span
                v-if="orderStore.finalPrice < orderStore.totalOldSum"
                class="font-extralight line-through"
                >{{ orderStore.priceFormatter(orderStore.totalOldSum) }}</span
              >
            </span>
          </div>
          <div class="relative flex flex-col gap-6 mt-8">
            <span class="font-light text-sm">Способ оплаты</span>
            <div class="flex flex-col gap-4">
              <AppCheckbox
                v-model="orderStore.paymentMethod"
                size="S"
                label="Картой на сайте"
                value="Картой на сайте"
              />
              <AppCheckbox
                v-model="orderStore.paymentMethod"
                size="S"
                label="Оплата при получении"
                value="Оплата при получении"
              />
            </div>
            <div
              class="absolute -top-[40px] left-3 bg-[#FFFFFA] transition-opacity duration-300 border border-[#A6CEFF] text-[#211D1D] text-[13px] font-light font-[Manrope] p-4 shadow-md z-10 rounded-t-3xl rounded-r-3xl"
              :class="orderStore.showErrorPaymentMethod ? 'opacity-100' : 'opacity-0'"
            >
              Выберите способ оплаты
            </div>
          </div>
          <AppButton
            class="w-full mt-8"
            content="Оплатить заказ"
            :disabled="orderStore.isLoadingPayment || orderStore.cartItems.length === 0"
            @click="handleRetryPay"
          />
        </div>
      </div>
    </div>
  </main>
</template>
