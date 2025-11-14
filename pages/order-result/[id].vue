<script setup lang="ts">
import { AppCheckbox, AppButton } from "#components"
import type { CartItem, OrderState, CityData, PvzData } from "~/stores/order"

interface CheckOrderStatusResponse {
  success: boolean
  status?: number
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
const catalogStore = useCatalogStore()

const localIsPaymentSuccessful = ref<boolean | null>(null)
const localShowErrorPaymentMethod = ref<boolean>(false)
const localIsLoadingPayment = ref<boolean>(false)
const loadedOrder = ref<OrderState | null>(null)

const localCartItems = ref<CartItem[]>([])
const localDeliveryMethod = ref<string | null>(null)
const localCity = ref<CityData | null>(null)
const localCurrentAddress = ref<string | null>(null)
const localCommentForCourier = ref<string>("")
const localPaymentMethod = ref<string | null>(null)
const localSelectedPvz = ref<PvzData | null>(null)
const localDeliveryCost = ref<number>(0)
const localDeliveryTime = ref<string | null>(null)
const localPointsToUse = ref<number>(0)
const localSelectedCertificates = ref<string[]>([])
const localTotalSum = ref<number>(0)
const localFinalPrice = ref<number>(0)

const localCartDetailed = computed(() => {
  return localCartItems.value
    .map((cartItem) => {
      const isCertificate = cartItem.id === -1

      if (isCertificate) {
        const imagesArray = Object.values(cartItem.images).filter((img) => img)
        return {
          key: cartItem.key,
          id: cartItem.id,
          count: cartItem.count,
          name: cartItem.name,
          images: imagesArray,
          price: cartItem.price,
          oldPrice: cartItem.oldPrice,
          certificateType: cartItem.certificateType || cartItem.options?.certificateType,
          deliveryMethod: cartItem.deliveryMethod || cartItem.options?.deliveryMethod,
          recipientEmail: cartItem.recipientEmail || cartItem.options?.recipientEmail,
          recipientName: cartItem.recipientName || cartItem.options?.recipientName,
          recipientPhone: cartItem.recipientPhone || cartItem.options?.recipientPhone,
          deliveryDetails: cartItem.deliveryDetails || cartItem.options?.deliveryDetails,
          vector: "certificate",
          isCertificate: true,
        }
      }

      if (!cartItem.variant) return null
      const size = cartItem.variant
      const colorName = cartItem.colorName || "Цвет не указан"
      const imagesArray = Object.values(cartItem.images).filter((img) => img)
      return {
        key: cartItem.key,
        id: cartItem.id,
        vector: cartItem.variant,
        count: cartItem.count,
        name: cartItem.name,
        color: colorName,
        images: imagesArray,
        size,
        price: cartItem.price,
        oldPrice: cartItem.oldPrice,
        isCertificate: false,
      }
    })
    .filter(Boolean)
})

const localDeliveryTypes = ref<
  Array<{ id: number; name: string; term?: { min: number; max: number }; cost?: number; isExpress?: boolean }>
>([
  { id: 1, name: "Курьер СДЭК", term: { min: 0, max: 0 }, cost: 0 },
  { id: 2, name: "Курьер СДЭК с примеркой", term: { min: 0, max: 0 }, cost: 0 },
  { id: 3, name: "Экспресс-доставка", isExpress: true },
  { id: 4, name: "СДЭК (ПВЗ)", term: { min: 0, max: 0 }, cost: 0 },
])

function localDecrementQuantity(key: string) {
  const item = localCartItems.value.find((i) => i.key === key)
  if (!item) return
  if (item && item.count > 1) {
    item.count--
  }
}

function localIncrementQuantity(key: string) {
  const item = localCartItems.value.find((i) => i.key === key)
  if (!item) return
  if (item) {
    item.count++
  }
}

function localRemoveItemFromCart(key: string) {
  const item = localCartItems.value.find((i) => i.key === key)
  if (!item) return
  localCartItems.value = localCartItems.value.filter((item) => item.key !== key)
}

const navigateToItem = async (itemId: number) => {
  if (catalogStore.items.length === 0) {
    await catalogStore.loadItems()
  }
  const item = catalogStore.getItemById(itemId)
  const fullAlias = item?.alias || String(itemId)
  const itemLink = `/catalog/item/?alias=${fullAlias}`
  try {
    await navigateTo(itemLink)
  } catch (error) {
    console.error("Navigation error:", error)
  }
}

const localGoodsSum = computed(() => {
  return localCartItems.value.reduce((sum, cartItem) => {
    if (cartItem.id === -1) return sum
    return sum + cartItem.price * cartItem.count
  }, 0)
})

const localCertsInCartSum = computed(() => {
  return localTotalSum.value - localGoodsSum.value
})

const localTotalOldSum = computed(() => {
  return localCartItems.value.reduce((sum, cartItem) => {
    const oldPrice = cartItem.oldPrice > 0 ? cartItem.oldPrice : cartItem.price
    return sum + oldPrice * cartItem.count
  }, 0)
})

function updateLocalDeliveryDetails() {
  const methodId = Number(localDeliveryMethod.value)
  const type = localDeliveryTypes.value.find((t) => t.id === methodId)
  if (type) {
    if (type.term && type.term.min !== undefined && type.term.max !== undefined) {
      localDeliveryTime.value = `${type.term.min}-${type.term.max}`
    } else if (type.isExpress) {
      localDeliveryTime.value = null
    } else {
      localDeliveryTime.value = null
    }
    localDeliveryCost.value = type.cost || 0
    if (methodId === 4 && localSelectedPvz.value && typeof localSelectedPvz.value.price === "number") {
      localDeliveryCost.value = localSelectedPvz.value.price
    }
  } else {
    localDeliveryTime.value = null
    localDeliveryCost.value = 0
  }
  if (localGoodsSum.value >= 30000) {
    localDeliveryCost.value = 0
  }

  let certDiscount = 0
  if (authStore.isAuth && userStore.user?.certificates) {
    certDiscount = localSelectedCertificates.value.reduce((sum, code) => {
      const cert = userStore.user.certificates.find((c: any) => c.code === code)
      return cert ? sum + (cert.value_now || 0) : sum
    }, 0)
  }

  let price = localGoodsSum.value
  if (localPointsToUse.value > 0) {
    price -= Math.min(localPointsToUse.value, price)
  }
  price -= Math.min(certDiscount, price)
  localFinalPrice.value = Math.max(price + localDeliveryCost.value + localCertsInCartSum.value, 0.01)
}

watch(
  [localCartItems, localPointsToUse, localSelectedCertificates, localDeliveryCost, localGoodsSum],
  () => {
    localTotalSum.value = localCartItems.value.reduce((sum, item) => sum + item.price * item.count, 0)
    updateLocalDeliveryDetails()
  },
  { deep: true, immediate: true },
)

function normalizeAddress(address: string | string[] | null): string {
  if (!address) return ""
  if (Array.isArray(address)) {
    return address.filter(Boolean).join(", ")
  }
  return address
}

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
    orderStore.resetOrder()
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
      orderStore.resetOrder()
      return
    }

    if (data.value) {
      localIsPaymentSuccessful.value = data.value.status === 2

      if (data.value.status === 1 || data.value.status === 2) {
        orderStore.resetOrder()
      }

      let cartData = data.value.cart
      if (!cartData && data.value.order?.cart) {
        cartData = data.value.order.cart
      }
      if (cartData) {
        localCartItems.value = orderStore.parseCart(cartData)
      }

      if (data.value.order) {
        loadedOrder.value = data.value.order
        localDeliveryMethod.value = data.value.order.deliveryMethod || null
        localCity.value = data.value.order.city || null
        localCurrentAddress.value = normalizeAddress(data.value.order.currentAddress)
        localCommentForCourier.value = data.value.order.commentForCourier || ""
        localPaymentMethod.value = data.value.order.paymentMethod || null
        localSelectedPvz.value = data.value.order.pvz || null
        localDeliveryCost.value = data.value.order.deliveryCost || 0
        localDeliveryTime.value = data.value.order.deliveryTime || null
        localPointsToUse.value = data.value.order.points || 0
        localSelectedCertificates.value = data.value.order.certificates || []

        updateLocalDeliveryDetails()
      } else {
        localIsPaymentSuccessful.value = false
        orderStore.resetOrder()
      }
    } else {
      localIsPaymentSuccessful.value = false
      orderStore.resetOrder()
    }
  } catch (error) {
    console.error("Ошибка проверки статуса заказа:", error)
    localIsPaymentSuccessful.value = false
    orderStore.resetOrder()
  }

  if (localCartItems.value.length === 0 && loadedOrder.value) {
    console.warn("Корзина пуста, но заказ существует - возможно, данные в order.cart")
  }
})

watch(
  () => localPaymentMethod.value,
  (newVal) => {
    if (newVal) {
      localShowErrorPaymentMethod.value = false
    }
  },
)

function restoreToStoreForPayment() {
  orderStore.cartItems = [...localCartItems.value]
  orderStore.deliveryMethod = localDeliveryMethod.value
  orderStore.city = localCity.value
  orderStore.currentAddress = localCurrentAddress.value
  orderStore.commentForCourier = localCommentForCourier.value
  orderStore.paymentMethod = localPaymentMethod.value
  orderStore.selectedPvz = localSelectedPvz.value
  orderStore.deliveryCost = localDeliveryCost.value
  orderStore.deliveryTime = localDeliveryTime.value
  orderStore.pointsToUse = localPointsToUse.value
  orderStore.selectedCertificates = [...localSelectedCertificates.value]
  orderStore.orderId = orderId
}

async function handleRetryPay(): Promise<void> {
  if (localIsLoadingPayment.value) return

  if (localCartItems.value.length === 0) {
    return
  }

  if (localIsPaymentSuccessful.value !== false) {
    return
  }

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

  if (!localCity.value) {
    orderStore.showErrorDeliveryMethod = true
    return
  }

  if (!localDeliveryMethod.value) {
    orderStore.showErrorDeliveryMethod = true
    return
  }

  const methodId = Number(localDeliveryMethod.value)
  if ([1, 2, 3].includes(methodId)) {
    if (!localCurrentAddress.value) {
      orderStore.showErrorDeliveryMethod = true
      return
    }

    if (localCurrentAddress.value === "Новый адрес") {
      orderStore.showErrorDeliveryMethod = true
      orderStore.errorDeliveryMethod = "Выберите адрес доставки"
      return
    }
  }
  if (methodId === 4) {
    if (!localSelectedPvz.value) {
      orderStore.showErrorDeliveryMethod = true
      orderStore.errorDeliveryMethod = "Выберите пункт выдачи СДЭК"
      return
    }
  }

  if (localPaymentMethod.value === null) {
    localShowErrorPaymentMethod.value = true
    return
  }

  localIsLoadingPayment.value = true
  orderStore.isLoadingPayment = true

  try {
    restoreToStoreForPayment()

    const paymentData = await orderStore.getPaymentData()
    if (!paymentData || !paymentData.success) {
      console.error("Ошибка получения данных для оплаты")
      localIsLoadingPayment.value = false
      orderStore.isLoadingPayment = false
      orderStore.resetOrder()
      return
    }

    if (paymentData.type === "widget") {
      if (orderStore.isWidgetOpen) {
        console.warn("Виджет уже открыт, игнорируем повторный вызов")
        localIsLoadingPayment.value = false
        orderStore.isLoadingPayment = false
        orderStore.resetOrder()
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
          localIsPaymentSuccessful.value = true
          orderStore.resetOrder()
        },
        onFail: (reason: any, options: any) => {
          localIsLoadingPayment.value = false
          orderStore.isLoadingPayment = false
          orderStore.isWidgetOpen = false
          orderStore.resetOrder()
        },
        onComplete: async (paymentResult: any, options: any) => {
          localIsLoadingPayment.value = false
          orderStore.isLoadingPayment = false
          orderStore.isWidgetOpen = false

          if (paymentResult.success && paymentResult.code === 0) {
            await navigateTo(paymentData.link)
          } else {
            localIsPaymentSuccessful.value = false
            orderStore.resetOrder()
          }
        },
      })
    } else {
      await navigateTo(paymentData.link, { external: paymentData.external })
      localIsLoadingPayment.value = false
      orderStore.isLoadingPayment = false
      orderStore.resetOrder()
    }
  } catch (error) {
    console.error("Ошибка при оплате:", error)
    localIsLoadingPayment.value = false
    orderStore.isLoadingPayment = false
    orderStore.isWidgetOpen = false
    orderStore.resetOrder()
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
        <div v-if="localIsPaymentSuccessful">
          <h2 class="font-[Inter] text-[17px] text-[#211D1D] uppercase">Благодарим Вас за заказ №{{ orderId }}!</h2>
          <p class="font-[Manrope] text-sm text-[#211D1D] font-light">
            Мы уже проверяем ваш платеж и в течение 30 минут информация появится в вашем личном кабинете
          </p>
          <p class="font-[Manrope] text-sm text-[#211D1D] font-light">
            В случае возникновения вопросов свяжитесь с нами, пожалуйста, написав на почту clients@casaalmare.com или по
            телефону +7 (495) 004-04-94
          </p>
        </div>
        <div v-else>
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
          <div
            v-if="localCartDetailed.length > 0"
            class="flex flex-col gap-6 mt-8"
          >
            <div
              v-for="(item, index) in localCartDetailed"
              :key="index"
              class="flex items-center justify-between w-full"
            >
              <div
                v-if="item"
                class="flex items-center gap-2"
              >
                <img
                  :src="item.images[0] || '/placeholder.jpg'"
                  alt="order-img"
                  width="57"
                  height="72"
                  class="rounded-2xl border-[0.5px] border-[#211D1D]"
                />
                <div class="flex flex-col gap-1">
                  <span
                    class="font-light text-sm text-[#414141] cursor-pointer"
                    @click="navigateToItem(item.id)"
                  >
                    {{ item.name }}
                  </span>
                  <span class="font-light text-[13px]">
                    <template v-if="!item.isCertificate">
                      Размер: {{ item.size }} <span class="ml-1">Цвет: {{ item.color }}</span>
                    </template>
                    <template v-else
                      >Кому: {{ item.recipientName }}
                      <span class="ml-1">Тип: {{ item.certificateType }}</span></template
                    >
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
          <div
            v-else
            class="mt-8"
          >
            <p class="font-light text-sm text-[#414141]">Товары успешно заказаны и отправлены.</p>
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
          <div
            v-if="localCartDetailed.length > 0"
            class="flex flex-col gap-6 mt-8"
          >
            <div
              v-for="(item, index) in localCartDetailed"
              :key="index"
              class="flex items-center justify-between w-full"
            >
              <div
                v-if="item"
                class="flex items-center gap-2"
              >
                <img
                  :src="item.images[0] || '/placeholder.jpg'"
                  alt="order-img"
                  width="57"
                  height="72"
                  class="rounded-2xl border-[0.5px] border-[#211D1D]"
                />
                <div class="flex flex-col gap-1">
                  <span
                    class="font-light text-sm text-[#414141] cursor-pointer"
                    @click="navigateToItem(item.id)"
                  >
                    {{ item.name }}
                  </span>
                  <span class="font-light text-[13px]">
                    <template v-if="!item.isCertificate">
                      Размер: {{ item.size }} <span class="ml-1">Цвет: {{ item.color }}</span>
                    </template>
                    <template v-else
                      >Кому: {{ item.recipientName }}
                      <span class="ml-1">Тип: {{ item.certificateType }}</span></template
                    >
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
                  <div
                    class="py-1 px-2 flex gap-1 rounded-xl border-[0.7px] border-[#211D1D] text-xs font-light"
                    :class="item.isCertificate && 'px-2.5'"
                  >
                    <button
                      v-if="!item.isCertificate"
                      class="w-4 h-4 flex items-center justify-center cursor-pointer"
                      :disabled="localIsLoadingPayment"
                      @click="localDecrementQuantity(item.key)"
                    >
                      <div class="minus-icon" />
                    </button>
                    {{ item.count }}
                    <button
                      v-if="!item.isCertificate"
                      class="w-4 h-4 flex items-center justify-center cursor-pointer"
                      :disabled="localIsLoadingPayment"
                      @click="localIncrementQuantity(item.key)"
                    >
                      <div class="plus-icon" />
                    </button>
                  </div>
                  <button
                    class="w-6 h-6 flex items-center justify-center cursor-pointer"
                    :disabled="localIsLoadingPayment"
                    @click="localRemoveItemFromCart(item.key)"
                  >
                    <div class="x-icon" />
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
          <div
            v-else
            class="mt-8"
          >
            <p class="font-light text-sm text-[#414141]">Корзина пуста. Перейдите к оформлению нового заказа.</p>
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
                  v-model="localPaymentMethod"
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
            :disabled="localIsLoadingPayment || localCartItems.length === 0"
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

.minus-icon {
  background-image: url("/minus.svg");
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  background-position: center;
}

.plus-icon {
  background-image: url("/plus.svg");
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  background-position: center;
}

.x-icon {
  background-image: url("/x.svg");
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  background-position: center;
}
</style>
