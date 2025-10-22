<script setup lang="ts">
import { AppCheckbox, AppButton, AppInput } from "#components"
import type { CartItem, OrderState } from "~/stores/order"

interface CheckOrderStatusResponse {
  success: boolean
  order?: OrderState
  error?: string
  orderId?: number
  cart?: Record<string, CartItem>
}

const route = useRoute()
const orderId = parseInt(route.params.id as string)

const userStore = useUserStore()
const orderStore = useOrderStore()
const authStore = useAuthStore()

const localIsPaymentSuccessful = ref<boolean | null>(null)
const localShowErrorPaymentMethod = ref<boolean>(false)
const localIsLoadingPayment = ref<boolean>(false)
const loadedOrder = ref<OrderState | null>(null)

const localCartDetailed = computed(() => orderStore.cartDetailed)

const localTotalOldSum = computed(() => orderStore.totalOldSum)
const localFinalPrice = computed(() => orderStore.finalPrice)

onMounted(async () => {
  if (!orderId) {
    await navigateTo("/order")
    return
  }

  await orderStore.loadPaymentMethods()
  await orderStore.loadUserData()
  await orderStore.loadOrderState()
  await userStore.fetchUser()

  const token = await userStore.loadToken()
  if (!token) {
    localIsPaymentSuccessful.value = false
    return
  }

  try {
    const { data, error } = await useFetch<CheckOrderStatusResponse>(
      "https://back.casaalmare.com/api/checkOrderStatus",
      {
        method: "POST",
        body: { token, orderId },
      },
    )

    if (error.value) {
      console.error("Network error checking order status:", error.value)
      localIsPaymentSuccessful.value = false
      return
    }

    if (data.value) {
      localIsPaymentSuccessful.value = data.value.success ?? false

      if (data.value.cart && orderStore.cartItems.length === 0) {
        const parsedCart: CartItem[] = Object.entries(data.value.cart).map(([_, item]) => ({
          id: item.id,
          variant: item.variant,
          count: item.count,
          updated_at: item.updated_at,
          name: item.name,
          colors: item.colors,
          sizes: item.sizes,
          images: item.images,
          vector: item.vector,
          type: item.type,
          material: item.material,
          useType: item.useType,
        }))
        orderStore.setCartItems(parsedCart)
      }

      if (data.value.order) {
        loadedOrder.value = data.value.order
        if (data.value.order.paymentMethod) {
          orderStore.paymentMethod = data.value.order.paymentMethod
        }
      } else {
        localIsPaymentSuccessful.value = false
      }
    }
  } catch (error) {
    console.error("Ошибка проверки статуса заказа:", error)
    localIsPaymentSuccessful.value = false
  }

  if (orderStore.cartItems.length === 0) {
    await navigateTo("/order")
  }
})

watch(
  () => orderStore.paymentMethod,
  (newVal) => {
    if (newVal) {
      localShowErrorPaymentMethod.value = false
    }
  },
)

async function handleRetryPay(): Promise<void> {
  if (orderStore.isLoadingPayment) return

  if (orderStore.cartItems.length === 0) {
    return
  }

  if (localIsPaymentSuccessful.value === null) {
    if (!authStore.isAuth) {
      if (orderStore.isGuestAuthStep) {
        if (!orderStore.guestSmsCode) {
          orderStore.guestAuthError = "Введите код из SMS"
          orderStore.showGuestAuthError = true
          return
        }
      } else {
        orderStore.showErrorAuth = true
        return
      }
    }

    if (!orderStore.city) {
      orderStore.showErrorDeliveryMethod = true
      return
    }

    if (!orderStore.deliveryMethod) {
      orderStore.showErrorDeliveryMethod = true
      return
    }

    if (orderStore.deliveryMethod === "Курьер") {
      if (!orderStore.currentAddress) {
        orderStore.showErrorDeliveryMethod = true
        return
      }

      if (orderStore.currentAddress === "Новый адрес") {
        orderStore.showErrorDeliveryMethod = true
        orderStore.errorDeliveryMethod = "Выберите адрес доставки"
        return
      }
    }
  }

  if (orderStore.paymentMethod === null) {
    localShowErrorPaymentMethod.value = true
    return
  }

  localIsLoadingPayment.value = true
  orderStore.isLoadingPayment = true

  try {
    const paymentData = await orderStore.getPaymentData()
    if (!paymentData || !paymentData.success) {
      console.error("Ошибка получения данных для оплаты")
      localIsLoadingPayment.value = false
      orderStore.isLoadingPayment = false
      return
    }

    if (paymentData.type === "widget") {
      if (orderStore.isWidgetOpen) {
        console.warn("Виджет уже открыт, игнорируем повторный вызов")
        localIsLoadingPayment.value = false
        orderStore.isLoadingPayment = false
        return
      }

      orderStore.isWidgetOpen = true

      if (!(window as any).cp) {
        const script = document.createElement("script")
        script.src = "https://widget.cloudpayments.ru/bundles/cloudpayments.js"
        script.async = true
        document.head.appendChild(script)
        await new Promise((resolve) => {
          script.onload = resolve
        })
      }

      const widget = new (window as any).cp.CloudPayments()
      widget.pay("charge", paymentData.data, {
        onSuccess: (options: any) => {
          console.log("Оплата успешна")
        },
        onFail: (reason: any, options: any) => {
          console.log("Оплата неуспешна по причине " + reason)
          localIsLoadingPayment.value = false
          orderStore.isLoadingPayment = false
          orderStore.isWidgetOpen = false
        },
        onComplete: async (paymentResult: any, options: any) => {
          localIsLoadingPayment.value = false
          orderStore.isLoadingPayment = false
          orderStore.isWidgetOpen = false

          if (paymentResult.success && paymentResult.code === 0) {
            await navigateTo(paymentData.link)
          } else {
            console.log("Оплата отменена или неуспешна")
            localIsPaymentSuccessful.value = false
          }
        },
      })
    } else {
      await navigateTo(paymentData.link, { external: paymentData.external })
      localIsLoadingPayment.value = false
      orderStore.isLoadingPayment = false
    }
  } catch (error) {
    console.error("Ошибка при оплате:", error)
    localIsLoadingPayment.value = false
    orderStore.isLoadingPayment = false
    orderStore.isWidgetOpen = false
  }
}
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] flex justify-start items-center pt-8 pb-8 flex-col">
    <div class="mt-8 flex max-w-[1264px] flex-col px-2 sm:px-0 sm:flex-row h-fit w-full gap-12">
      <div
        class="p-10 flex flex-col gap-12 w-full max-w-[652px] rounded-4xl border-[0.7px] border-[#BBB8B6] h-fit"
        :class="localIsPaymentSuccessful && 'bg-[#F9F6EC]'"
      >
        <div
          v-if="localIsPaymentSuccessful"
          class="flex flex-col gap-4"
        >
          <h2 class="font-[Inter] text-[17px] text-[#211D1D] uppercase">Благодарим Вас за заказ №{{ orderId }}!</h2>
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
        <div v-if="localIsPaymentSuccessful">
          <h2 class="font-[Inter] text-[17px] text-[#211D1D] uppercase">заказанные товары</h2>
          <div class="flex flex-col gap-6 mt-8">
            <div
              v-for="(item, index) in localCartDetailed"
              :key="index"
              class="flex items-center justify-between w-full"
            >
              <div
                v-if="item"
                class="flex items-center gap-2"
              >
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
              <div
                v-if="item"
                class="flex flex-col items-end gap-4"
              >
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
          <div class="flex items-center justify-between mt-8 sm:pt-4 sm:border-t sm:border-[#F9F6EC]">
            <span>Стоимость товаров:</span>
            <span class="flex items-center gap-2">
              {{ orderStore.priceFormatter(localFinalPrice) }}
              <span
                v-if="localFinalPrice < localTotalOldSum"
                class="font-extralight line-through"
                >{{ orderStore.priceFormatter(localTotalOldSum) }}</span
              >
            </span>
          </div>
        </div>
        <div v-else>
          <div class="flex flex-col gap-6 mt-8">
            <div
              v-for="(item, index) in localCartDetailed"
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
                  <div class="py-1 px-2 flex gap-1 rounded-xl border-[0.7px] border-[#211D1D] text-xs font-light">
                    <button
                      class="w-4 h-4 flex items-center justify-center cursor-pointer"
                      :disabled="orderStore.isLoadingPayment"
                      @click="orderStore.decrementQuantity(item.id, item.vector)"
                    >
                      <NuxtImg
                        src="/minus.svg"
                        alt="minus"
                        class="w-full"
                      />
                    </button>
                    {{ item.count }}
                    <button
                      class="w-4 h-4 flex items-center justify-center cursor-pointer"
                      :disabled="orderStore.isLoadingPayment"
                      @click="orderStore.incrementQuantity(item.id, item.vector)"
                    >
                      <NuxtImg
                        src="/plus.svg"
                        alt="plus"
                        class="w-full"
                      />
                    </button>
                  </div>
                  <button
                    class="w-6 h-6 flex items-center justify-center cursor-pointer"
                    :disabled="orderStore.isLoadingPayment"
                    @click="orderStore.removeItemFromCart(item.id, item.vector)"
                  >
                    <NuxtImg
                      src="/x.svg"
                      alt="x"
                      class="w-full"
                    />
                  </button>
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

          <div class="flex items-center justify-between mt-8 sm:pt-4 sm:border-t sm:border-[#F9F6EC]">
            <span>Стоимость товаров:</span>
            <span class="flex items-center gap-2">
              {{ orderStore.priceFormatter(localFinalPrice) }}
              <span
                v-if="localFinalPrice < localTotalOldSum"
                class="font-extralight line-through"
                >{{ orderStore.priceFormatter(localTotalOldSum) }}</span
              >
            </span>
          </div>

          <AppTooltip
            text="Выберите способ оплаты"
            type="error"
            :show="localShowErrorPaymentMethod"
            @update:show="(value) => (localShowErrorPaymentMethod = value)"
          >
            <div class="relative flex flex-col gap-6 mt-8">
              <span class="font-light text-sm">Способ оплаты</span>
              <div class="flex flex-col gap-4">
                <AppCheckbox
                  v-for="method in orderStore.paymentMethods"
                  :key="method.id"
                  v-model="orderStore.paymentMethod"
                  size="S"
                  :label="method.name"
                  :value="method.id"
                />
              </div>
            </div>
          </AppTooltip>
          <AppButton
            class="w-full mt-8"
            content="Оплатить заказ"
            :disabled="localIsLoadingPayment || orderStore.cartItems.length === 0"
            @click="handleRetryPay"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.collapsible-div {
  transition-property: max-height, opacity;
}
</style>
