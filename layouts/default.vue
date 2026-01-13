<script setup lang="ts">
import { type AppInput, SelectInput } from "#components"

interface CartResponseData {
  success: boolean
  cart_items_count?: number
  total_quantity?: number
  cart: Record<string, import("~/stores/order").CartItem>
}

interface PhoneOption {
  code: string
  country: string
  iso: string
}

const isCookieAccepted = ref(true)

const email = ref("")
const emailRef = ref<InstanceType<typeof AppInput> | null>(null)
const buttonState = ref({
  content: "Подписаться",
  isLoading: false,
  showSuccess: false,
})

const name = ref("")
const emailReverse = ref("")
const phone = ref<{ code: string; phone: string; country: string } | null>(null)
const text = ref("")
const nameRef = ref<InstanceType<typeof AppInput> | null>(null)
const emailReverseRef = ref<InstanceType<typeof AppInput> | null>(null)
const phoneRef = ref<InstanceType<typeof SelectInput> | null>(null)
const textRef = ref<InstanceType<typeof AppInput> | null>(null)
const buttonStateReverse = ref({
  content: "Отправить",
  isLoading: false,
  showSuccess: false,
})

const catalogStore = useCatalogStore()
const orderStore = useOrderStore()
const docsStore = useDocsStore()
const userStore = useUserStore()

const TIMEOUT_DURATION = 1000

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

const handleSubscription = () => {
  if (emailRef.value?.validate?.()) {
    buttonState.value.isLoading = true
    setTimeout(() => {
      buttonState.value.isLoading = false
      buttonState.value.content = "Вы подписаны"
      buttonState.value.showSuccess = true
      setTimeout(() => {
        buttonState.value.content = "Подписаться"
        buttonState.value.showSuccess = false
      }, TIMEOUT_DURATION)
    }, TIMEOUT_DURATION)
  }
}

const handleReverseForm = () => {
  const isValid =
    nameRef.value?.validate?.() &&
    emailReverseRef.value?.validate?.() &&
    phoneRef.value?.validate?.() &&
    textRef.value?.validate?.()

  if (isValid) {
    buttonStateReverse.value.isLoading = true
    setTimeout(() => {
      buttonStateReverse.value.isLoading = false
      buttonStateReverse.value.content = "Благодарим за обращение"
      buttonStateReverse.value.showSuccess = true
      setTimeout(() => {
        buttonStateReverse.value.content = "Отправить"
        buttonStateReverse.value.showSuccess = false
        name.value = ""
        emailReverse.value = ""
        phone.value = null
        text.value = ""
      }, TIMEOUT_DURATION)
    }, TIMEOUT_DURATION)
  }
}

const getCart = async () => {
  const token = await userStore.loadToken()
  if (!token) return

  try {
    const data = await $fetch<CartResponseData>("https://back.casaalmare.com/api/getCart", {
      method: "POST",
      body: { token },
    })

    if (data?.success && data.cart) {
      const parsedCart = orderStore.parseCart(data.cart)
      orderStore.setCartItems(parsedCart)
    }
  } catch (error) {
    console.error("Ошибка при получении корзины:", error)
  }
}

onMounted(async () => {
  await userStore.loadToken()
  await userStore.fetchUser()
  await docsStore.fetchTree()
  await catalogStore.loadItems()
  await getCart()
  await orderStore.loadUserData()
  await orderStore.loadOrderState()
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1 bg-[#FFFFFA]">
      <NuxtPage />
    </main>
    <AppFooter />
    <CookieConsent v-model="isCookieAccepted" />
    <AppPopup
      title="Подпишитесь на рассылку"
      popup-id="subscription"
    >
      <div class="flex flex-col items-stretch gap-6 mt-8 sm:mt-14">
        <img
          src="/rassilka.webp"
          alt="sub"
          width="390"
          height="532"
          class="rounded-lg"
          loading="lazy"
        >
        <AppTooltip
          text="Это поле обязательно для заполнения"
          type="error"
          :show="emailRef?.showError"
        >
          <AppInput
            id="email"
            ref="emailRef"
            v-model="email"
            label="Введите e-mail для получения новостей"
            type="email"
            custom-class="w-full"
            required
          />
        </AppTooltip>
        <AppButton
          :content="buttonState.content"
          :is-loading="buttonState.isLoading"
          :show-success="buttonState.showSuccess"
          variant="primary"
          custom-class="w-full px-0"
          @click="handleSubscription"
        />
        <p class="w-full font-light text-[10px] text-[#5E5B58] font-[Commissioner] sm:w-[350px]">
          Нажимая на кнопку «Подписаться», я соглашаюсь на обработку моих персональных данных и ознакомлен(а) с
          условиями конфиденциальности.
        </p>
      </div>
    </AppPopup>
    <AppPopup
      title="Обратная связь"
      popup-id="reverse"
    >
      <div class="flex flex-col items-stretch gap-6 mt-8 sm:mt-14">
        <img
          src="/obratnaya_svyaz.webp"
          alt="sub"
          width="390"
          height="532"
          class="rounded-lg"
          loading="lazy"
        >
        <AppTooltip
          text="Это поле обязательно для заполнения"
          type="error"
          :show="nameRef?.showError"
        >
          <AppInput
            id="name"
            ref="nameRef"
            v-model="name"
            label="Имя"
            type="text"
            custom-class="w-full"
            required
          />
        </AppTooltip>
        <AppTooltip
          text="Это поле обязательно для заполнения"
          type="error"
          :show="emailReverseRef?.showError"
        >
          <AppInput
            id="emailReverse"
            ref="emailReverseRef"
            v-model="emailReverse"
            label="E-mail"
            type="email"
            custom-class="w-full"
            required
          />
        </AppTooltip>
        <AppTooltip
          text="Это поле обязательно для заполнения"
          type="error"
          :show="phoneRef?.showError"
        >
          <SelectInput
            id="phone"
            ref="phoneRef"
            v-model="phone"
            :options="phoneOptions"
            label="Номер телефона"
            custom-class="w-full"
            required
          />
        </AppTooltip>
        <AppTooltip
          text="Это поле обязательно для заполнения"
          type="error"
          :show="textRef?.showError"
        >
          <AppInput
            id="text"
            ref="textRef"
            v-model="text"
            label="Сообщение"
            type="text"
            custom-class="w-full"
            required
          />
        </AppTooltip>
        <AppButton
          :content="buttonStateReverse.content"
          :is-loading="buttonStateReverse.isLoading"
          :show-success="buttonStateReverse.showSuccess"
          variant="primary"
          custom-class="w-full px-0"
          @click="handleReverseForm"
        />
        <p class="w-full font-light text-[10px] text-[#5E5B58] font-[Commissioner] sm:w-[350px]">
          Нажимая на кнопку «Отправить», я соглашаюсь на обработку моих персональных данных и ознакомлен(а) с условиями
          конфиденциальности.
        </p>
      </div>
    </AppPopup>
  </div>
</template>

<style>
body {
  width: 100%;
}

* {
  scrollbar-width: thin !important;
  scrollbar-color: #211d1d #f9f6ec !important;
  text-decoration-thickness: 0.5px;
}

::-webkit-scrollbar {
  width: 4px !important;
  height: 4px !important;
}

::-webkit-scrollbar-track {
  background: #f1f1f1 !important;
  border-radius: 23px !important;
  margin: 1px 0 !important;
}

::-webkit-scrollbar-thumb {
  background: #211d1d !important;
  border-radius: 23px !important;
  transition: background 0.3s ease !important;
}

::-webkit-scrollbar-button {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
}
</style>
