<script setup lang="ts">
import { AppInput, AppSelect, SelectInput } from "#components"

interface CartResponseData {
  success: boolean
  cart_items_count?: number
  total_quantity?: number
  cart: Record<
    string,
    {
      added_at: number
      colorName: string
      count: number
      id: number
      images: Record<number, string>
      variant: string // Теперь только размер (XS/S, S/M, M/L)
      updated_at: null | number
      material: string[]
      name: string
      oldPrice: string // На верхнем уровне
      price: string // На верхнем уровне
      sizes: string[]
      type: string
      useType: string[]
      colors: any[] // Пустой массив (не используется)
      vector: Record<string, { quantity: number; comingSoon: number }>
    }
  >
}

const cityRef = ref<InstanceType<typeof AppSelect> | null>(null)
const emailRef = ref<InstanceType<typeof AppInput> | null>(null)
const nameRef = ref<InstanceType<typeof AppInput> | null>(null)
const newAddressRef = ref<InstanceType<typeof AppInput> | null>(null)
const phoneRef = ref<InstanceType<typeof SelectInput> | null>(null)
const surnameRef = ref<InstanceType<typeof AppInput> | null>(null)

const authStore = useAuthStore()
const authModalStore = useAuthModalStore()
const orderStore = useOrderStore()
const userStore = useUserStore()

const isExpanded = ref(false)

const handleProfileClick = () => {
  if (authStore.isAuth) {
    navigateTo("/profile")
  } else {
    authModalStore.open()
  }
}

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

interface PhoneOption {
  code: string
  country: string
  iso: string
}

const phoneOptions: PhoneOption[] = [
  { code: "+7", country: "Россия", iso: "RU" },
  { code: "+375", country: "Беларусь", iso: "BY" },
  { code: "+380", country: "Украина", iso: "UA" },
  { code: "+77", country: "Казахстан", iso: "KZ" },
  { code: "+998", country: "Узбекистан", iso: "UZ" },
  { code: "+992", country: "Таджикистан", iso: "TJ" },
  { code: "+993", country: "Туркменистан", iso: "TM" },
  { code: "+996", country: "Кыргызстан", iso: "KG" },
  { code: "+374", country: "Армения", iso: "AM" },
  { code: "+994", country: "Азербайджан", iso: "AZ" },
  { code: "+373", country: "Молдова", iso: "MD" },
  { code: "+995", country: "Грузия", iso: "GE" },
]

onMounted(async () => {
  const getCart = async (): Promise<void> => {
    const token = await userStore.loadToken()
    if (!token) return

    try {
      const { data, error } = await useFetch<CartResponseData>("https://back.casaalmare.com/api/getCart", {
        method: "POST",
        body: {
          token: token,
        },
      })

      if (error.value) {
        console.error("Network error fetching cart:", error.value)
        return
      }

      if (data.value?.success && data.value?.cart) {
        const rawCart = data.value.cart
        const parsedCart: import("~/stores/order").CartItem[] = Object.entries(rawCart).map(([_, item]) => {
          const vector: Record<string, { quantity: number; comingSoon: boolean }> = {}
          for (const [size, vecData] of Object.entries(item.vector || {})) {
            vector[size] = {
              quantity: vecData.quantity || 0,
              comingSoon: !!vecData.comingSoon,
            }
          }
          return {
            id: item.id,
            variant: item.variant, // Только размер
            count: item.count,
            updated_at: item.updated_at || undefined,
            name: item.name,
            colorName: item.colorName || "", // Добавляем значение по умолчанию
            sizes: item.sizes,
            images: item.images,
            vector,
            type: item.type,
            material: item.material,
            useType: item.useType,
            price: parseInt(item.price) || 0,
            oldPrice: parseInt(item.oldPrice) || 0,
          }
        })
        orderStore.setCartItems(parsedCart)
      }
    } catch (error) {
      console.error("Ошибка при получении корзины:", error)
    }
  }

  await getCart()
  await orderStore.loadPaymentMethods()
  await orderStore.loadUserData()
  await orderStore.loadOrderState()
})

async function handlePay(): Promise<void> {
  if (orderStore.isLoadingPayment) return

  if (orderStore.cartItems.length === 0) {
    return
  }

  if (orderStore.isPaymentSuccessful === null) {
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

    if (!cityRef.value?.validate()) return

    if (!orderStore.deliveryMethod) {
      orderStore.showErrorDeliveryMethod = true
      return
    }

    const methodId = Number(orderStore.deliveryMethod)
    if ([1, 2, 3].includes(methodId)) {
      if (!orderStore.currentAddress) {
        orderStore.showErrorDeliveryMethod = true
        return
      }

      if (orderStore.currentAddress === "Новый адрес") {
        if (!newAddressRef.value?.validate()) {
          return
        }
        orderStore.showErrorDeliveryMethod = true
        orderStore.errorDeliveryMethod = "Выберите адрес доставки"
        return
      }
    }
    if (methodId === 4) {
      if (!orderStore.selectedPvz) {
        orderStore.showErrorDeliveryMethod = true
        orderStore.errorDeliveryMethod = "Выберите пункт выдачи СДЭК"
        return
      }
    }
  }

  if (orderStore.paymentMethod === null) {
    orderStore.showErrorPaymentMethod = true
    return
  }

  orderStore.isLoadingPayment = true

  try {
    const paymentData = await orderStore.getPaymentData()
    if (!paymentData || !paymentData.success) {
      console.error("Ошибка получения данных для оплаты")
      orderStore.isLoadingPayment = false
      return
    }

    if (paymentData.type === "widget") {
      if (orderStore.isWidgetOpen) {
        console.warn("Виджет уже открыт, игнорируем повторный вызов")
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
          orderStore.isLoadingPayment = false
          orderStore.isWidgetOpen = false
        },
        onComplete: (paymentResult: any, options: any) => {
          orderStore.isLoadingPayment = false
          orderStore.isWidgetOpen = false

          if (paymentResult.success && paymentResult.code === 0) {
            navigateTo(paymentData.link)
          } else {
            console.log("Оплата отменена или неуспешна")
          }
        },
      })
    } else {
      await navigateTo(paymentData.link, { external: paymentData.external })
      orderStore.isLoadingPayment = false
    }
  } catch (error) {
    console.error("Ошибка при оплате:", error)
    orderStore.isLoadingPayment = false
    orderStore.isWidgetOpen = false
  }
}

async function handleSave(): Promise<void> {
  if (!newAddressRef.value?.validate()) return
  await orderStore.saveNewAddress()
}

async function handleGuestAuth(): Promise<void> {
  const inputs = [nameRef.value, surnameRef.value, phoneRef.value, emailRef.value]
  const isValid = inputs.every((input): input is NonNullable<typeof input> => input?.validate?.() ?? false)
  if (!isValid) return

  orderStore.showErrorAuth = false
  orderStore.showGuestAuthError = false
  orderStore.guestAuthError = ""
  orderStore.isGuestAuthLoading = true
  orderStore.guestAuthButtonContent = "Отправка..."
  orderStore.guestAuthButtonDisabled = true

  const body = {
    email: orderStore.email,
    phone: orderStore.phone,
    name: orderStore.name,
    surname: orderStore.surname,
  }

  let testData: any = null
  try {
    const response = await $fetch("https://back.casaalmare.com/api/testContacts", {
      method: "POST",
      body,
    })
    testData = response
    if (!testData.success) {
      orderStore.guestAuthError = testData.error || "Ошибка проверки данных (пользователь не найден)"
      orderStore.showGuestAuthError = true
      orderStore.guestAuthButtonContent = "Попробовать снова"
      orderStore.guestAuthButtonDisabled = false
      orderStore.isGuestAuthLoading = false
      return
    }
  } catch (error) {
    orderStore.guestAuthError = `Ошибка проверки данных: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`
    orderStore.showGuestAuthError = true
    orderStore.guestAuthButtonContent = "Попробовать снова"
    orderStore.guestAuthButtonDisabled = false
    orderStore.isGuestAuthLoading = false
    return
  }

  const loginType = testData.res === 1 ? 1 : 2
  orderStore.guestLoginType = loginType

  if (!orderStore.phone || !orderStore.phone.code || !orderStore.phone.phone) {
    orderStore.guestAuthError = "Неверный формат телефона"
    orderStore.showGuestAuthError = true
    orderStore.guestAuthButtonContent = "Попробовать снова"
    orderStore.guestAuthButtonDisabled = false
    orderStore.isGuestAuthLoading = false
    return
  }

  let smsData: any = null
  try {
    const smsBody = { phone: orderStore.phone }
    smsData = await $fetch("https://back.casaalmare.com/api/createSmsCode", {
      method: "POST",
      body: smsBody,
    })
    if (!smsData.success) {
      const errorMsg = typeof smsData.error === "string" ? smsData.error : "Код не отправлен (проверьте номер)"
      orderStore.guestAuthError = `Ошибка отправки SMS: ${errorMsg}`
      orderStore.showGuestAuthError = true
      orderStore.guestAuthButtonContent = "Попробовать снова"
      orderStore.guestAuthButtonDisabled = false
      orderStore.isGuestAuthLoading = false
      return
    }
  } catch (error) {
    let errorMsg = "Ошибка сети при отправке SMS"
    if (error instanceof Error) {
      if (error.message.includes("404")) errorMsg = "SMS-сервис недоступен (проверьте endpoint)"
      else if (error.message.includes("CORS")) errorMsg = "Ошибка CORS (настройте backend)"
      else if (error.message.includes("fetch")) errorMsg = `Сетевая ошибка: ${error.message}`
      else errorMsg = `Ошибка отправки SMS: ${error.message}`
    }
    orderStore.guestAuthError = errorMsg
    orderStore.showGuestAuthError = true
    orderStore.guestAuthButtonContent = "Попробовать снова"
    orderStore.guestAuthButtonDisabled = false
    orderStore.isGuestAuthLoading = false
    return
  }

  orderStore.isGuestAuthStep = true
  orderStore.guestNextCode = smsData.nextCode || 45
  orderStore.startGuestCountdown()
  orderStore.guestAuthButtonContent = "Код отправлен"
  orderStore.guestAuthButtonDisabled = false
  orderStore.isGuestAuthLoading = false
}

function getDayLabel(days: number): string {
  if (days % 10 === 1 && days % 100 !== 11) return "день"
  if (days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 10 || days % 100 >= 20)) return "дня"
  return "дней"
}

function getTimeLabel(type: { term?: { min: number; max: number }; isExpress?: boolean }): string {
  if (type.isExpress) return ""
  const min = type.term?.min || 0
  const max = type.term?.max || 0
  if (min === 0 && max === 0) return ""
  if (min === max) {
    return `(${min} ${getDayLabel(min)})`
  }
  return `(${min}-${max} ${getDayLabel(max)})`
}

async function handleGuestSmsConfirm(): Promise<void> {
  if (!orderStore.guestSmsCode) return

  orderStore.showGuestSmsError = false
  orderStore.guestSmsError = ""
  orderStore.isGuestAuthLoading = true
  orderStore.guestSmsButtonContent = "Проверка..."
  orderStore.guestSmsButtonDisabled = true

  const body: any = {
    phone: orderStore.phone,
    code: orderStore.guestSmsCode,
    loginType: orderStore.guestLoginType,
    token: await userStore.loadToken(),
  }
  if (orderStore.guestLoginType === 2) {
    body.email = orderStore.email
    body.firstname = orderStore.name
    body.lastname = orderStore.surname
  }

  let loginData: any = null
  try {
    const response = await $fetch("https://back.casaalmare.com/api/login", {
      method: "POST",
      body,
    })
    loginData = response

    if (loginData.success) {
      orderStore.guestSmsButtonContent = "Успешно"
      orderStore.guestSmsButtonDisabled = false
      if (loginData.token) {
        await userStore.saveToken(loginData.token)
        await userStore.loadToken()
        await userStore.fetchUser()
      }
      orderStore.resetGuestAuth()
      window.location.reload()
      return
    } else {
      const errorCode = loginData.error?.code || loginData.error || "Неверный код"
      orderStore.guestSmsError = `Ошибка: ${errorCode}`
      orderStore.showGuestSmsError = true

      orderStore.guestSmsButtonContent = "Попробовать снова"
      orderStore.guestSmsButtonDisabled = false
    }
  } catch (error) {
    let errorMsg = "Ошибка подтверждения SMS"
    if (error instanceof Error) {
      if (error.message.includes("404")) errorMsg = "Сервис авторизации недоступен (проверьте endpoint)"
      else if (error.message.includes("CORS")) errorMsg = "Ошибка CORS (настройте backend)"
      else if (error.message.includes("fetch") || error.message.includes("network"))
        errorMsg = `Сетевая ошибка: ${error.message}`
      else if (error.message.includes("JSON")) errorMsg = "Неверный формат ответа сервера (HTML вместо JSON)"
      else errorMsg = `Ошибка: ${error.message}`
    }
    orderStore.guestSmsError = errorMsg
    orderStore.showGuestSmsError = true

    orderStore.guestSmsButtonContent = "Попробовать снова"
    orderStore.guestSmsButtonDisabled = false
  } finally {
    orderStore.isGuestAuthLoading = false
  }
}

const isGuestAuthEnabled = computed(() => {
  if (orderStore.isGuestAuthStep) return false
  return orderStore.name && orderStore.surname && orderStore.phone && orderStore.email && !orderStore.isGuestAuthLoading
})

const hasItemsInCart = computed(() => orderStore.cartItems.length > 0)
const isGuestSmsSubmitting = computed(() => orderStore.isGuestAuthLoading || orderStore.guestSmsButtonDisabled)
useSmsAutoSubmit(
  computed(() => orderStore.guestSmsCode || ""),
  handleGuestSmsConfirm,
  isGuestSmsSubmitting,
)
</script>

<template>
  <main
    class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] flex justify-start items-center pt-8 pb-8 flex-col max-sm:px-2"
  >
    <template v-if="hasItemsInCart">
      <h2 class="uppercase max-sm:font-[Inter] max-sm:text-[17px] msx-sm:self-start max-sm:w-full">Оформление</h2>
      <div class="mt-8 flex max-w-[1264px] flex-col sm:flex-row h-fit w-full gap-6 sm:gap-12">
        <div
          class="sm:hidden"
          :class="[isExpanded && 'p-4 rounded-2xl border-[0.7px] border-[#BBB8B6]']"
        >
          <div class="flex flex-col">
            <div
              class="overflow-hidden transition-all duration-300 ease-in-out"
              :class="[isExpanded ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0']"
            >
              <div class="flex flex-col gap-6">
                <div
                  v-for="(item, index) in orderStore.cartDetailed"
                  :key="index"
                  class="flex items-center justify-between w-full"
                >
                  <div
                    v-if="item"
                    class="flex items-center gap-2"
                  >
                    <NuxtImg
                      :src="item?.images[0] || ''"
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
            </div>
            <AppButton
              :content="isExpanded ? 'Скрыть все товары в корзине' : 'Показать все товары в корзине'"
              custom-class="w-full"
              @click="toggleExpanded"
            />
          </div>
        </div>
        <div
          v-if="!authStore.isAuth"
          class="sm:hidden p-4 pb-6 flex flex-col gap-6 w-full max-w-[652px] rounded-2xl border-[0.7px] border-[#BBB8B6] h-fit"
        >
          <template v-if="orderStore.isPaymentSuccessful === null">
            <AppTooltip
              text="Необходимо авторизоваться"
              type="error"
              :show="orderStore.showErrorAuth"
              class="w-full"
              @update:show="(value) => (orderStore.showErrorAuth = value)"
            >
              <div class="flex flex-col gap-4">
                <span class="text-xs">
                  Есть аккаунт?
                  <span
                    class="cursor-pointer underline"
                    @click="authModalStore.open"
                    >Войти</span
                  >
                </span>
                <AppTooltip
                  text="Это поле обязательно для заполнения"
                  type="error"
                  :show="nameRef?.showError"
                  class="w-full"
                >
                  <AppInput
                    id="name"
                    ref="nameRef"
                    v-model="orderStore.name"
                    type="text"
                    label="Имя"
                    custom-class="w-full"
                    required
                  />
                </AppTooltip>
                <AppTooltip
                  text="Это поле обязательно для заполнения"
                  type="error"
                  :show="surnameRef?.showError"
                  class="w-full"
                >
                  <AppInput
                    id="surname"
                    ref="surnameRef"
                    v-model="orderStore.surname"
                    type="text"
                    label="Фамилия"
                    custom-class="w-full"
                    required
                  />
                </AppTooltip>
                <AppTooltip
                  text="Это поле обязательно для заполнения"
                  type="error"
                  :show="phoneRef?.showError"
                  class="w-full"
                >
                  <SelectInput
                    id="phone"
                    ref="phoneRef"
                    v-model="orderStore.phone"
                    custom-class="w-full"
                    :options="phoneOptions"
                    label="Номер телефона"
                    required
                  />
                </AppTooltip>
                <AppTooltip
                  text="Это поле обязательно для заполнения"
                  type="error"
                  :show="emailRef?.showError"
                  class="w-full"
                >
                  <AppInput
                    id="email"
                    ref="emailRef"
                    v-model="orderStore.email"
                    type="text"
                    label="E-mail"
                    custom-class="w-full"
                    required
                  />
                </AppTooltip>
                <AppTooltip
                  :text="orderStore.guestAuthError || 'Заполните все поля'"
                  type="error"
                  :show="orderStore.showGuestAuthError"
                  class="w-full"
                  @update:show="
                    (value) => {
                      if (!value) orderStore.guestAuthError = ''
                    }
                  "
                >
                  <AppButton
                    variant="primary"
                    :content="orderStore.guestAuthButtonContent"
                    :disabled="orderStore.guestAuthButtonDisabled || !isGuestAuthEnabled"
                    custom-class="w-full mt-4"
                    @click="handleGuestAuth"
                  />
                </AppTooltip>

                <div
                  v-if="orderStore.isGuestAuthStep"
                  class="flex flex-col gap-4 mt-4"
                >
                  <AppInput
                    id="guestSms"
                    v-model="orderStore.guestSmsCode"
                    type="text"
                    label="Код из SMS"
                    required
                    custom-class="w-full"
                  />
                  <AppTooltip
                    :text="orderStore.guestSmsError || 'Введите код из SMS'"
                    type="error"
                    :show="orderStore.showGuestSmsError"
                    class="w-full"
                    @update:show="
                      (value) => {
                        if (!value) orderStore.guestSmsError = ''
                      }
                    "
                  >
                    <AppButton
                      variant="primary"
                      :content="orderStore.guestSmsButtonContent"
                      :disabled="orderStore.guestSmsButtonDisabled || !orderStore.guestSmsCode"
                      custom-class="w-full"
                      @click="handleGuestSmsConfirm"
                    />
                  </AppTooltip>
                  <span class="text-xs text-center">
                    Нажимая "Подтвердить", вы соглашаетесь с обработкой персональных данных.
                  </span>
                  <span
                    v-if="orderStore.guestRemainingSeconds > 0"
                    class="text-xs text-center"
                  >
                    Запросить код повторно через {{ orderStore.guestRemainingSeconds }} сек.
                  </span>
                  <span
                    v-else
                    class="text-xs text-center cursor-pointer underline"
                    @click="
                      () => {
                        orderStore.isGuestAuthStep = false
                        handleGuestAuth()
                      }
                    "
                  >
                    Отправить ещё раз
                  </span>
                </div>
              </div>
            </AppTooltip>
          </template>
        </div>
        <div
          class="p-4 pb-6 sm:p-10 flex flex-col sm:gap-12 gap-6 w-full max-w-[652px] sm:rounded-4xl rounded-2xl border-[0.7px] border-[#BBB8B6] h-fit"
        >
          <template v-if="orderStore.isPaymentSuccessful === null">
            <AppTooltip
              v-if="!authStore.isAuth"
              text="Необходимо авторизоваться"
              type="error"
              :show="orderStore.showErrorAuth"
              class="w-full hidden sm:block"
              @update:show="(value) => (orderStore.showErrorAuth = value)"
            >
              <div class="flex flex-col gap-4 w-full">
                <span class="text-xs">
                  Есть аккаунт?
                  <span
                    class="cursor-pointer underline"
                    @click="authModalStore.open"
                    >Войти</span
                  >
                </span>
                <AppTooltip
                  text="Это поле обязательно для заполнения"
                  type="error"
                  :show="nameRef?.showError"
                  class="w-full"
                >
                  <AppInput
                    id="name"
                    ref="nameRef"
                    v-model="orderStore.name"
                    type="text"
                    label="Имя"
                    custom-class="w-full"
                    required
                  />
                </AppTooltip>
                <AppTooltip
                  text="Это поле обязательно для заполнения"
                  type="error"
                  :show="surnameRef?.showError"
                  class="w-full"
                >
                  <AppInput
                    id="surname"
                    ref="surnameRef"
                    v-model="orderStore.surname"
                    type="text"
                    label="Фамилия"
                    custom-class="w-full"
                    required
                  />
                </AppTooltip>
                <AppTooltip
                  text="Это поле обязательно для заполнения"
                  type="error"
                  :show="phoneRef?.showError"
                  class="w-full"
                >
                  <SelectInput
                    id="phone"
                    ref="phoneRef"
                    v-model="orderStore.phone"
                    custom-class="w-full"
                    :options="phoneOptions"
                    label="Номер телефона"
                    required
                  />
                </AppTooltip>
                <AppTooltip
                  text="Это поле обязательно для заполнения"
                  type="error"
                  :show="emailRef?.showError"
                  class="w-full"
                >
                  <AppInput
                    id="email"
                    ref="emailRef"
                    v-model="orderStore.email"
                    type="text"
                    label="E-mail"
                    custom-class="w-full"
                    required
                  />
                </AppTooltip>
                <AppTooltip
                  :text="orderStore.guestAuthError || 'Заполните все поля'"
                  type="error"
                  :show="orderStore.showGuestAuthError"
                  class="w-full"
                  @update:show="
                    (value) => {
                      if (!value) orderStore.guestAuthError = ''
                    }
                  "
                >
                  <AppButton
                    variant="primary"
                    :content="orderStore.guestAuthButtonContent"
                    :disabled="orderStore.guestAuthButtonDisabled || !isGuestAuthEnabled"
                    custom-class="w-full mt-4"
                    @click="handleGuestAuth"
                  />
                </AppTooltip>
                <div
                  v-if="orderStore.isGuestAuthStep"
                  class="flex flex-col gap-4 mt-4"
                >
                  <AppInput
                    id="guestSms"
                    v-model="orderStore.guestSmsCode"
                    type="text"
                    label="Код из SMS"
                    required
                    custom-class="w-full"
                  />
                  <AppTooltip
                    :text="orderStore.guestSmsError || 'Введите код из SMS'"
                    type="error"
                    :show="orderStore.showGuestSmsError"
                    class="w-full"
                    @update:show="
                      (value) => {
                        if (!value) orderStore.guestSmsError = ''
                      }
                    "
                  >
                    <AppButton
                      variant="primary"
                      :content="orderStore.guestSmsButtonContent"
                      :disabled="orderStore.guestSmsButtonDisabled || !orderStore.guestSmsCode"
                      custom-class="w-full"
                      @click="handleGuestSmsConfirm"
                    />
                  </AppTooltip>
                  <span class="text-xs text-center">
                    Нажимая "Подтвердить", вы соглашаетесь с обработкой персональных данных.
                  </span>
                  <span
                    v-if="orderStore.guestRemainingSeconds > 0"
                    class="text-xs text-center"
                  >
                    Запросить код повторно через {{ orderStore.guestRemainingSeconds }} сек.
                  </span>
                  <span
                    v-else
                    class="text-xs text-center cursor-pointer underline"
                    @click="
                      () => {
                        orderStore.isGuestAuthStep = false
                        handleGuestAuth()
                      }
                    "
                  >
                    Отправить ещё раз
                  </span>
                </div>
              </div>
            </AppTooltip>
            <AppTooltip
              :text="orderStore.errorDeliveryMethod ? orderStore.errorDeliveryMethod : 'Выберите способ доставки'"
              type="error"
              :show="orderStore.showErrorDeliveryMethod"
              @update:show="(value) => (orderStore.showErrorDeliveryMethod = value)"
            >
              <div class="relative flex flex-col gap-6 w-full">
                <span class="sm:font-light text-[17px] sm:text-sm">Доставка</span>
                <AppTooltip
                  text="Это поле обязательно для заполнения"
                  type="error"
                  :show="cityRef?.showError"
                >
                  <AppSelect
                    ref="cityRef"
                    v-model="orderStore.city"
                    label="Город"
                    custom-class="w-full"
                    required
                    searchable
                    async-search
                    city-mode
                    async-search-url="https://back.casaalmare.com/api/getCityByQuery"
                  />
                </AppTooltip>
                <div class="flex flex-col gap-6">
                  <AppCheckbox
                    v-for="type in orderStore.deliveryTypes"
                    :key="type.id"
                    v-model="orderStore.deliveryMethod"
                    size="M"
                    :label="`${type.name} ${!type.isExpress ? `${getTimeLabel(type)}` : ''}`"
                    :value="type.id"
                  />
                </div>
                <div
                  v-if="[1, 2, 3].includes(Number(orderStore.deliveryMethod))"
                  class="flex flex-col gap-4"
                >
                  <AppCheckbox
                    v-for="(address, index) in orderStore.addresses"
                    :key="index"
                    v-model="orderStore.currentAddress"
                    size="S"
                    :label="address"
                    :value="address"
                  />
                  <AppCheckbox
                    v-model="orderStore.currentAddress"
                    size="S"
                    label="Новый адрес"
                    value="Новый адрес"
                  />
                  <div
                    v-if="orderStore.currentAddress === 'Новый адрес'"
                    class="flex flex-col gap-4"
                  >
                    <AppTooltip
                      text="Это поле обязательно для заполнения"
                      type="error"
                      :show="newAddressRef?.showError"
                    >
                      <AppInput
                        id="address1"
                        ref="newAddressRef"
                        v-model="orderStore.newAddressFirstLine"
                        type="text"
                        label="Улица, дом, корпус, строение, квартира"
                        custom-class="w-full"
                        required
                      />
                    </AppTooltip>
                    <AppInput
                      id="address2"
                      v-model="orderStore.newAddressSecondLine"
                      type="text"
                      label="Номер дома и домофон / офис"
                    />
                    <AppButton
                      custom-class="w-full"
                      content="Сохранить"
                      variant="primary"
                      :disabled="orderStore.isLoadingPayment"
                      @click="handleSave"
                    />
                  </div>
                </div>
                <div v-if="orderStore.deliveryMethod === 4">
                  <PvzSelector
                    v-model="orderStore.selectedPvz"
                    :city="{ name: orderStore.city?.name || 'Москва' }"
                  />
                </div>
                <AppInput
                  id="forCourier"
                  v-model="orderStore.commentForCourier"
                  type="text"
                  label="Пожелания и комментарии для курьера"
                />
              </div>
            </AppTooltip>
            <AppTooltip
              text="Выберите способ оплаты"
              type="error"
              :show="orderStore.showErrorPaymentMethod"
              @update:show="(value) => (orderStore.showErrorPaymentMethod = value)"
            >
              <div class="relative flex flex-col gap-6">
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
          </template>
        </div>
        <div
          class="sm:hidden p-4 pb-6 flex flex-col gap-6 w-full max-w-[652px] rounded-2xl border-[0.7px] border-[#BBB8B6] h-fit"
        >
          <template v-if="orderStore.isPaymentSuccessful === null">
            <AppTooltip
              text="Выберите способ оплаты"
              type="error"
              :show="orderStore.showErrorPaymentMethod"
              @update:show="(value) => (orderStore.showErrorPaymentMethod = value)"
            >
              <div class="relative flex flex-col gap-6">
                <span class="text-[17px]">Способ оплаты</span>
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
          </template>
        </div>
        <div
          v-if="authStore.isAuth"
          class="sm:hidden p-4 pb-6 flex flex-col gap-6 w-full max-w-[652px] rounded-2xl border-[0.7px] border-[#BBB8B6] h-fit"
        >
          <template v-if="orderStore.isPaymentSuccessful === null">
            <div class="flex flex-col gap-4">
              <div
                class="flex items-center justify-between cursor-pointer"
                @click="orderStore.togglePoints"
              >
                <span class="font-light text-sm">Баллы</span>
                <button
                  class="w-4 h-4 flex items-center justify-center cursor-pointer transition-transform duration-300"
                  :class="orderStore.isExpandedPoints ? 'rotate-0' : 'rotate-180'"
                >
                  <NuxtImg
                    src="/order-arrow.svg"
                    class="w-full"
                  />
                </button>
              </div>
              <div
                class="collapsible-div flex flex-col gap-4 transition-max-height duration-300 ease-in-out overflow-hidden"
                :class="{
                  'max-h-500 opacity-100': orderStore.isExpandedPoints,
                  'max-h-0 opacity-0': !orderStore.isExpandedPoints,
                }"
              >
                <span class="text-[13px]">Сумма баллов: {{ userStore.user?.points ?? 0 }}</span>
                <AppInput
                  id="points"
                  v-model="orderStore.pendingPoints"
                  label="Введите сумму баллов для списания"
                  type="text"
                  :disabled="orderStore.isLoadingPoints"
                />
                <AppButton
                  variant="primary"
                  custom-class="w-full"
                  :content="`Списать ${Number(orderStore.pendingPoints) || 0} баллов`"
                  :disabled="orderStore.isLoadingPoints || !orderStore.pendingPoints"
                  @click="orderStore.applyPoints"
                />
                <span
                  v-if="orderStore.pointsError"
                  class="font-light text-[13px] text-[#E57979]"
                  >{{ orderStore.pointsError }}</span
                >
              </div>
            </div>
          </template>
        </div>
        <div
          v-if="authStore.isAuth"
          class="sm:hidden p-4 pb-6 flex flex-col gap-6 w-full max-w-[652px] rounded-2xl border-[0.7px] border-[#BBB8B6] h-fit"
        >
          <template v-if="orderStore.isPaymentSuccessful === null">
            <div class="flex flex-col gap-4">
              <div
                class="flex items-center justify-between cursor-pointer"
                @click="orderStore.toggleCert"
              >
                <span class="font-light text-sm">Сертификат</span>
                <button
                  class="w-4 h-4 flex items-center justify-center cursor-pointer transition-transform duration-300"
                  :class="orderStore.isExpandedCert ? 'rotate-0' : 'rotate-180'"
                >
                  <NuxtImg
                    src="/order-arrow.svg"
                    class="w-full"
                  />
                </button>
              </div>
              <div
                class="collapsible-div flex flex-col gap-4 transition-max-height duration-300 ease-in-out overflow-hidden"
                :class="{
                  'max-h-500 opacity-100': orderStore.isExpandedCert,
                  'max-h-0 opacity-0': !orderStore.isExpandedCert,
                }"
              >
                <AppInput
                  id="certificate"
                  v-model="orderStore.newCertificateCode"
                  label="Введите код"
                  type="text"
                  :disabled="orderStore.isLoadingCert"
                />
                <AppButton
                  v-if="orderStore.newCertificateCode"
                  variant="primary"
                  custom-class="w-full"
                  content="Добавить сертификат"
                  :disabled="orderStore.isLoadingCert"
                  @click="orderStore.addCertificate"
                />
                <span
                  v-if="orderStore.certificateError"
                  class="font-light text-[13px] text-[#E57979]"
                  >{{ orderStore.certificateError }}</span
                >
                <template
                  v-for="cert in userStore.user?.certificates ?? []"
                  :key="cert.code"
                >
                  <AppCheckbox
                    v-model="orderStore.selectedCertificates"
                    size="S"
                    :label="`Сертификат ${cert.code} на сумму ${cert.value_now} рублей`"
                    :value="cert.code"
                  />
                </template>
              </div>
            </div>
          </template>
        </div>
        <div class="sm:hidden mt-4 flex flex-col gap-6 w-full max-w-[652px] h-fit">
          <template v-if="orderStore.isPaymentSuccessful === null">
            <div class="flex flex-col gap-1 text-sm font-light">
              <div class="flex items-center justify-between">
                <span>Доставка:</span>
                <span>
                  {{
                    Number(orderStore.deliveryMethod) === 3
                      ? "по согласованию с менеджером"
                      : orderStore.totalSum >= 30000
                        ? "бесплатно"
                        : orderStore.priceFormatter(orderStore.deliveryCost)
                  }}</span
                >
              </div>
              <div class="flex items-center justify-between">
                <span>Стоимость товаров:</span>
                <span class="flex items-center gap-2">
                  {{ orderStore.priceFormatter(orderStore.totalSum) }}
                  <span
                    v-if="orderStore.totalOldSum > orderStore.totalSum"
                    class="font-extralight line-through"
                    >{{ orderStore.priceFormatter(orderStore.totalOldSum) }}</span
                  >
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span>Окончательная стоимость:</span>
                <span class="flex items-center gap-2">
                  {{ orderStore.priceFormatter(orderStore.finalPrice) }}
                  <span
                    v-if="orderStore.totalSum + orderStore.deliveryCost > orderStore.finalPrice"
                    class="font-extralight line-through"
                    >{{ orderStore.priceFormatter(orderStore.totalSum + orderStore.deliveryCost) }}</span
                  >
                </span>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <AppButton
                class="w-full"
                content="Оплатить заказ"
                variant="primary"
                :disabled="orderStore.isLoadingPayment || orderStore.cartItems.length === 0"
                @click="handlePay"
              />
              <p class="text-xs text-[#8C8785]">
                Нажимая на кнопку «Оплатить», Вы соглашаетесь с условиями публичной оферты, принимаете политику защиты и
                обработки персональных данных и даете свое согласие на их обработку.
              </p>
            </div>
          </template>
        </div>
        <div class="max-sm:hidden p-8 w-full max-w-[564px] h-fit rounded-lg border-[0.7px] border-[#BBB8B6]">
          <template v-if="orderStore.isPaymentSuccessful === null">
            <div
              class="flex flex-col gap-8"
              :class="{ 'opacity-50': orderStore.isLoadingPayment }"
            >
              <div class="flex flex-col gap-6">
                <div
                  v-for="(item, index) in orderStore.cartDetailed"
                  :key="index"
                  class="flex items-center justify-between w-full"
                >
                  <div
                    v-if="item"
                    class="flex items-center gap-2"
                  >
                    <NuxtImg
                      :src="item?.images[0] || ''"
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
                <div
                  v-if="authStore.isAuth"
                  class="flex flex-col gap-4"
                >
                  <div
                    class="flex items-center justify-between cursor-pointer"
                    @click="orderStore.togglePoints"
                  >
                    <span class="font-light text-sm">Баллы</span>
                    <button
                      class="w-4 h-4 flex items-center justify-center cursor-pointer transition-transform duration-300"
                      :class="orderStore.isExpandedPoints ? 'rotate-0' : 'rotate-180'"
                    >
                      <NuxtImg
                        src="/order-arrow.svg"
                        class="w-full"
                      />
                    </button>
                  </div>
                  <div
                    class="collapsible-div flex flex-col gap-4 transition-max-height duration-300 ease-in-out overflow-hidden"
                    :class="{
                      'max-h-500 opacity-100': orderStore.isExpandedPoints,
                      'max-h-0 opacity-0': !orderStore.isExpandedPoints,
                    }"
                  >
                    <span class="text-[13px]">Сумма баллов: {{ userStore.user?.points ?? 0 }}</span>
                    <AppInput
                      id="points"
                      v-model="orderStore.pendingPoints"
                      label="Введите сумму баллов для списания"
                      type="text"
                      :disabled="orderStore.isLoadingPoints"
                    />
                    <AppButton
                      variant="primary"
                      custom-class="w-full"
                      :content="`Списать ${Number(orderStore.pendingPoints) || 0} баллов`"
                      :disabled="orderStore.isLoadingPoints || !orderStore.pendingPoints"
                      @click="orderStore.applyPoints"
                    />
                    <span
                      v-if="orderStore.pointsError"
                      class="font-light text-[13px] text-[#E57979]"
                      >{{ orderStore.pointsError }}</span
                    >
                  </div>
                </div>
                <div
                  v-if="authStore.isAuth"
                  class="flex flex-col gap-4"
                >
                  <div
                    class="flex items-center justify-between cursor-pointer"
                    @click="orderStore.toggleCert"
                  >
                    <span class="font-light text-sm">Сертификат</span>
                    <button
                      class="w-4 h-4 flex items-center justify-center cursor-pointer transition-transform duration-300"
                      :class="orderStore.isExpandedCert ? 'rotate-0' : 'rotate-180'"
                    >
                      <NuxtImg
                        src="/order-arrow.svg"
                        class="w-full"
                      />
                    </button>
                  </div>
                  <div
                    class="collapsible-div flex flex-col gap-4 transition-max-height duration-300 ease-in-out overflow-hidden"
                    :class="{
                      'max-h-500 opacity-100': orderStore.isExpandedCert,
                      'max-h-0 opacity-0': !orderStore.isExpandedCert,
                    }"
                  >
                    <AppInput
                      id="certificate"
                      v-model="orderStore.newCertificateCode"
                      label="Введите код"
                      type="text"
                      :disabled="orderStore.isLoadingCert"
                    />
                    <AppButton
                      v-if="orderStore.newCertificateCode"
                      variant="primary"
                      custom-class="w-full"
                      content="Добавить сертификат"
                      :disabled="orderStore.isLoadingCert"
                      @click="orderStore.addCertificate"
                    />
                    <span
                      v-if="orderStore.certificateError"
                      class="font-light text-[13px] text-[#E57979]"
                      >{{ orderStore.certificateError }}</span
                    >
                    <template
                      v-for="cert in userStore.user?.certificates ?? []"
                      :key="cert.code"
                    >
                      <AppCheckbox
                        v-model="orderStore.selectedCertificates"
                        size="S"
                        :label="`Сертификат ${cert.code} на сумму ${cert.value_now} рублей`"
                        :value="cert.code"
                      />
                    </template>
                  </div>
                </div>
                <div class="flex flex-col gap-1 text-sm font-light">
                  <div class="flex items-center justify-between">
                    <span>Доставка:</span>
                    <span>
                      {{
                        Number(orderStore.deliveryMethod) === 3
                          ? "по согласованию с менеджером"
                          : orderStore.totalSum >= 30000
                            ? "бесплатно"
                            : orderStore.priceFormatter(orderStore.deliveryCost)
                      }}</span
                    >
                  </div>
                  <div class="flex items-center justify-between">
                    <span>Стоимость товаров:</span>
                    <span class="flex items-center gap-2">
                      {{ orderStore.priceFormatter(orderStore.totalSum) }}
                      <span
                        v-if="orderStore.totalOldSum > orderStore.totalSum"
                        class="font-extralight line-through"
                        >{{ orderStore.priceFormatter(orderStore.totalOldSum) }}</span
                      >
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>Окончательная стоимость:</span>
                    <span class="flex items-center gap-2">
                      {{ orderStore.priceFormatter(orderStore.finalPrice) }}
                      <span
                        v-if="orderStore.totalSum + orderStore.deliveryCost > orderStore.finalPrice"
                        class="font-extralight line-through"
                        >{{ orderStore.priceFormatter(orderStore.totalSum + orderStore.deliveryCost) }}</span
                      >
                    </span>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <AppButton
                    class="w-full"
                    content="Оплатить заказ"
                    :disabled="orderStore.isLoadingPayment || orderStore.cartItems.length === 0 || !authStore.isAuth"
                    @click="handlePay"
                  />
                  <p class="text-xs text-[#8C8785]">
                    Нажимая на кнопку «Оплатить», Вы соглашаетесь с условиями публичной оферты, принимаете политику
                    защиты и обработки персональных данных и даете свое согласие на их обработку.
                  </p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
    <template v-else>
      <h2 class="uppercase max-sm:text-left max-sm:text-[17px] max-sm:font-[Inter] max-sm:self-start">Корзина пуста</h2>
      <div class="grid sm:grid-cols-4 mt-[10%] gap-8 sm:justify-items-center max-sm:self-start">
        <div
          class="font-light text-[#211D1D] cursor-pointer max-sm:text-[17px] max-sm:font-[Inter] max-sm:uppercase"
          @click="navigateTo('/catalog')"
        >
          Смотреть все
        </div>
        <div
          class="font-light text-[#211D1D] cursor-pointer max-sm:text-[17px] max-sm:font-[Inter] max-sm:uppercase"
          @click="navigateTo('/catalog?path=kupalniki/niz')"
        >
          Нижняя часть купальника
        </div>
        <div
          class="font-light text-[#211D1D] cursor-pointer max-sm:text-[17px] max-sm:font-[Inter] max-sm:uppercase"
          @click="navigateTo('/catalog')"
        >
          Головные уборы
        </div>
        <div
          class="font-light text-[#211D1D] cursor-pointer max-sm:text-[17px] max-sm:font-[Inter] max-sm:uppercase"
          @click="navigateTo('/certificate')"
        >
          Cертификаты
        </div>
        <div
          class="font-light text-[#211D1D] cursor-pointer max-sm:text-[17px] max-sm:font-[Inter] max-sm:uppercase"
          @click="navigateTo('/catalog?path=kupalniki')"
        >
          Купальники
        </div>
        <div
          class="font-light text-[#211D1D] cursor-pointer max-sm:text-[17px] max-sm:font-[Inter] max-sm:uppercase"
          @click="navigateTo('/catalog?path=kupalniki/verx')"
        >
          Верхняя часть купальника
        </div>
        <div
          class="font-light text-[#211D1D] cursor-pointer max-sm:text-[17px] max-sm:font-[Inter] max-sm:uppercase"
          @click="navigateTo('/catalog')"
        >
          Аксессуары
        </div>
        <div
          class="font-light text-[#211D1D] cursor-pointer max-sm:text-[17px] max-sm:font-[Inter] max-sm:uppercase"
          @click="handleProfileClick"
        >
          В личный кабинет
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped>
.collapsible-div {
  transition-property: max-height, opacity;
}
</style>
