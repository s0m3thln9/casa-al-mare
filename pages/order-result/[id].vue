<script setup lang="ts">
import { AppCheckbox, AppButton } from "#components"
import type { CartItem, OrderState, CartBackendItem } from "~/stores/order"
import { useCatalogStore } from "~/stores/catalog"
import { useUserStore } from "~/stores/user"

interface CheckOrderStatusResponse {
  success: boolean
  order?: OrderState
  error?: string
  orderId?: number
  cart?: Record<string, CartBackendItem>
}

interface ApiResponse {
  success: boolean
  error?: string
}

const route = useRoute()
const orderId = parseInt(route.params.id as string)

const catalogStore = useCatalogStore()
const userStore = useUserStore()

const localCartItems = ref<CartItem[]>([])
const localIsPaymentSuccessful = ref<boolean | null>(null)
const localPaymentMethod = ref<string | null>(null)
const localShowErrorPaymentMethod = ref<boolean>(false)
const localIsLoadingPayment = ref<boolean>(false)
const loadedOrder = ref<OrderState | null>(null)

const localCartDetailed = computed(() => {
  return localCartItems.value
    .map((cartItem) => {
      const product = catalogStore.items.find((p) => p.id === cartItem.id)
      if (!product) return null
      const vectorData = product?.vector?.[cartItem.vector] ?? {
        price: 0,
        oldPrice: 0,
      }
      const [colorKey, size] = cartItem.vector.split("_")
      const colorData = product?.colors?.[colorKey] ?? { name: "", images: [] }

      return {
        id: cartItem.id,
        vector: cartItem.vector,
        count: cartItem.count,
        name: product?.name ?? "",
        color: colorData.name,
        images: (colorData.images ?? []).map((id) => product?.images?.[id] ?? "") ?? [],
        size,
        price: vectorData.price,
        oldPrice: vectorData.oldPrice,
      }
    })
    .filter(Boolean) as any[]
})

const localTotalSum = computed(() => {
  return localCartItems.value.reduce((sum, cartItem) => {
    const product = catalogStore.items.find((p) => p.id === cartItem.id)
    if (!product) return sum
    const vectorData = product.vector?.[cartItem.vector]
    if (!vectorData) return sum
    return sum + vectorData.price * cartItem.count
  }, 0)
})

const localTotalOldSum = computed(() => {
  return localCartItems.value.reduce((sum, cartItem) => {
    const product = catalogStore.items.find((p) => p.id === cartItem.id)
    if (!product) return sum
    const vectorData = product.vector?.[cartItem.vector]
    if (!vectorData) return sum
    return sum + (vectorData.oldPrice > 0 ? vectorData.oldPrice : vectorData.price) * cartItem.count
  }, 0)
})

const localFinalPrice = computed(() => {
  let price = localTotalSum.value

  if (loadedOrder.value) {
    // Баллы
    const points = loadedOrder.value.points ?? 0
    if (points > 0) {
      price -= Math.min(points, price)
    }

    // Сертификаты
    const certs = loadedOrder.value.certificates ?? []
    if (certs.length > 0 && userStore.user?.certificates) {
      const certSum = certs.reduce((sum, code) => {
        const cert = userStore.user.certificates.find((c: any) => c.code === code)
        return cert ? sum + (cert.value_now || 0) : sum
      }, 0)
      price -= Math.min(certSum, price)
    }

    // Промокоды закомментированы, как в сторе
  }

  return Math.max(price, 0.01)
})

const priceFormatter = (value: number): string => {
  const formattedValue = new Intl.NumberFormat("ru-RU").format(Math.round(value))
  return `${formattedValue} ₽`
}

onMounted(async () => {
  if (!orderId) {
    await navigateTo("/order")
    return
  }

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

      if (data.value.cart) {
        localCartItems.value = Object.entries(data.value.cart).map(([_, item]) => ({
          id: item.productId,
          vector: item.variant,
          count: item.count,
        }))
      }

      if (data.value.order) {
        loadedOrder.value = data.value.order
        if (data.value.order.paymentMethod) {
          localPaymentMethod.value = data.value.order.paymentMethod
        }
      } else {
        localIsPaymentSuccessful.value = false
      }
    }
  } catch (error) {
    console.error("Ошибка проверки статуса заказа:", error)
    localIsPaymentSuccessful.value = false
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

async function handleRetryPay(): Promise<void> {
  if (!localPaymentMethod.value) {
    localShowErrorPaymentMethod.value = true
    return
  }

  localIsLoadingPayment.value = true

  const token = await userStore.loadToken()
  if (!token) {
    localIsLoadingPayment.value = false
    return
  }

  try {
    const { data, error } = await useFetch<ApiResponse>("https://back.casaalmare.com/api/createOrder", {
      method: "POST",
      body: {
        token,
        orderId,
      },
    })

    if (error.value) {
      console.error("Network error during payment:", error.value)
      return
    }

    if (data.value?.success) {
      await navigateTo(`/order-result/${orderId}`)
    } else {
      console.error("Ошибка создания заказа:", data.value?.error)
    }
  } catch (error) {
    console.error("Ошибка оплаты:", error)
  } finally {
    localIsLoadingPayment.value = false
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
          <div class="flex items-center justify-between mt-8">
            <span>Стоимость товаров:</span>
            <span class="flex items-center gap-2">
              {{ priceFormatter(localFinalPrice) }}
              <span
                v-if="localFinalPrice < localTotalOldSum"
                class="font-extralight line-through"
                >{{ priceFormatter(localTotalOldSum) }}</span
              >
            </span>
          </div>
        </div>
        <div v-else>
          <div class="flex items-center justify-between mt-8">
            <span>Стоимость товаров:</span>
            <span class="flex items-center gap-2">
              {{ priceFormatter(localFinalPrice) }}
              <span
                v-if="localFinalPrice < localTotalOldSum"
                class="font-extralight line-through"
                >{{ priceFormatter(localTotalOldSum) }}</span
              >
            </span>
          </div>
          <div class="relative flex flex-col gap-6 mt-8">
            <span class="font-light text-sm">Способ оплаты</span>
            <div class="flex flex-col gap-4">
              <AppCheckbox
                v-model="localPaymentMethod"
                size="S"
                label="Картой на сайте"
                value="Картой на сайте"
              />
              <AppCheckbox
                v-model="localPaymentMethod"
                size="S"
                label="Оплата при получении"
                value="Оплата при получении"
              />
            </div>
            <div
              class="absolute -top-[40px] left-3 bg-[#FFFFFA] transition-opacity duration-300 border border-[#A6CEFF] text-[#211D1D] text-[13px] font-light font-[Manrope] p-4 shadow-md z-10 rounded-t-3xl rounded-r-3xl"
              :class="localShowErrorPaymentMethod ? 'opacity-100' : 'opacity-0'"
            >
              Выберите способ оплаты
            </div>
          </div>
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
