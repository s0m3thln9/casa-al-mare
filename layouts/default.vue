<script setup lang="ts">
const isCookieAccepted = ref(false)
const isCitySelected = ref(false)
const email = ref("")
const emailRef = ref()
const catalogStore = useCatalogStore()

const acceptCookie = () => {
  isCookieAccepted.value = true
}

const selectCity = () => {
  isCitySelected.value = true
}

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

const handleEmail = () => {
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

onMounted(() => {
  catalogStore.loadItems()
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1 bg-[#FFFFFA]">
      <NuxtPage />
    </main>
    <AppFooter />
    <CitySelection
      v-show="!isCitySelected"
      @select-city="selectCity"
    />
    <CookieConsent
      v-show="!isCookieAccepted"
      @accept-cookie="acceptCookie"
    />
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
          @click="handleEmail"
        />
        <p class="w-full font-light text-[10px] text-[#5E5B58] font-[Commissioner] sm:w-[350px]">
          Нажимая на кнопку «Подписаться», я соглашаюсь на обработку моих персональных данных и ознакомлен(а) с
          условиями конфиденциальности.
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
