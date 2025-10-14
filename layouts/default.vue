<script setup lang="ts">
import { SelectInput } from "#components"

interface CartResponseData {
  success: boolean
  cart_items_count?: number
  total_quantity?: number
  cart: Record<string, import("~/stores/order").CartItem>
}

const isCookieAccepted = ref(true)
// const isCitySelected = ref(false)
const email = ref("")
const emailReverse = ref("")
const name = ref("")
const phone = ref<{
  code: string
  phone: string
  country: string
} | null>(null)
const text = ref("")
const emailRef = ref()
const emailReverseRef = ref()
const nameRef = ref()
const phoneRef = ref()
const textRef = ref()
const catalogStore = useCatalogStore()
const orderStore = useOrderStore()

// const selectCity = () => {
//   isCitySelected.value = true
// }

const userStore = useUserStore()
onMounted(async () => {
  await userStore.loadToken()
  await userStore.fetchUser()
})

const buttonState = ref({
  content: "Подписаться",
  isLoading: false,
  showSuccess: false,
})

const buttonStateReverse = ref({
  content: "Отправить",
  isLoading: false,
  showSuccess: false,
})

const handleSubscription = () => {
  if (emailRef.value.validate()) {
    buttonState.value.isLoading = true
    setTimeout(() => {
      buttonState.value.isLoading = false
      buttonState.value.content = "Вы подписаны"
      buttonState.value.showSuccess = true
      setTimeout(() => {
        buttonState.value.content = "Подписаться"
        buttonState.value.showSuccess = false
      }, 1000)
    }, 1000)
  }
}

const handleReverseForm = () => {
  const isNameValid = nameRef.value?.validate()
  const isEmailValid = emailReverseRef.value?.validate()
  const isPhoneValid = phoneRef.value?.validate()
  const isTextValid = textRef.value?.validate()

  if (isNameValid && isEmailValid && isPhoneValid && isTextValid) {
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
      }, 1000)
    }, 1000)
  } else {
    console.warn("Форма обратной связи не валидна")
  }
}

onMounted(() => {
  catalogStore.loadItems()
})

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
        const parsedCart: import("~/stores/order").CartItem[] = Object.entries(rawCart).map(([_, item]) => ({
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
    } catch (error) {
      console.error("Ошибка при получении корзины:", error)
    }
  }

  await getCart()
  await orderStore.loadUserData()
  await orderStore.loadOrderState()
})

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
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1 bg-[#FFFFFA]">
      <NuxtPage />
    </main>
    <AppFooter />
    <!--    <CitySelection-->
    <!--      v-show="!isCitySelected"-->
    <!--      @select-city="selectCity"-->
    <!--    />-->
    <CookieConsent v-model="isCookieAccepted" />
    <AppPopup
      title="Подпишитесь на рассылку"
      popup-id="subscription"
    >
      <div class="flex flex-col items-stretch gap-6 mt-8 sm:mt-14">
        <NuxtImg
          src="/pop-up-sub.jpg"
          alt="sub"
          width="390"
          height="532"
          class="rounded-lg"
        />
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
        <NuxtImg
          src="/pop-up-sub.jpg"
          alt="sub"
          width="390"
          height="532"
          class="rounded-lg"
        />
        <h2 class="font-[Manrope] uppercase text-[#211D1D]">Текст</h2>
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
            custom-class="w-full"
            :options="phoneOptions"
            label="Номер телефона"
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
