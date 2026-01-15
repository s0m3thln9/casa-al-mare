<script setup lang="ts">
const authStore = useAuthStore()
const authModalStore = useAuthModalStore()
const userStore = useUserStore()

interface SmsResponse {
  success?: string
  error?: string
  errorCode?: string
  tel?: string
  phone?: string
}

interface LoginResponse {
  success: boolean
  error?:
    | {
        code?: string
      }
    | string
  errorCode?: string
  email?: string
  token?: string
}

interface ResetPasswordResponse {
  success: boolean
  error?: string
}

const phoneRef = ref<{
  validate: () => boolean
  showError: boolean
} | null>(null)
const emailRef = ref<{
  validate: () => boolean
  showError: boolean
} | null>(null)
const emailRegRef = ref<{
  validate: () => boolean
  showError: boolean
} | null>(null)
const passwordRef = ref<{
  validate: () => boolean
  showError: boolean
} | null>(null)
const phoneRegRef = ref<{
  validate: () => boolean
  showError: boolean
} | null>(null)
const nameRef = ref<{
  validate: () => boolean
  showError: boolean
} | null>(null)
const surnameRef = ref<{
  validate: () => boolean
  showError: boolean
} | null>(null)
const smsRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const resetEmailRef = ref<{
  validate: () => boolean
  showError: boolean
} | null>(null)
const timeoutId = ref<number | null>(null)

const resendAvailableAt = ref<number | null>(null)
const remainingSeconds = ref(0)
const intervalId = ref<number | null>(null)

const sendSmsCode = async (
  phoneData: { code: string; phone: string },
  isReg: boolean = false,
  isResend: boolean = false,
): Promise<void> => {
  const endpoint = isReg
    ? "https://back.casaalmare.com/api/createSmsCodeReg"
    : "https://back.casaalmare.com/api/createSmsCode"
  
  try {
    const response = await $fetch<SmsResponse>(endpoint, {
      method: "POST",
      body: { phone: phoneData },
    })
    
    if (response.success) {
      if (!isReg) {
        authStore.smsError = ""
        if (isResend) authStore.smsError2 = ""
      } else {
        authStore.regError = ""
      }
    } else if (response.errorCode === "USER_NOT_FOUND" && !isReg) {
      authStore.type = "Регистрация"
      authStore.phoneReg = {
        code: phoneData.code,
        phone: phoneData.phone,
        country: authStore.phone?.country || null,
      }
      authStore.smsError = ""
      authStore.smsError2 = ""
      authStore.phoneButtonContent = "Отправить СМС-код"
      authStore.phoneButtonDisabled = false
      authStore.smsStep = false
      return
    } else if (response.errorCode === "USER_ALREADY_EXISTS" && isReg) {
      authStore.type = "Авторизация"
      authStore.method = "По телефону"
      authStore.phone = {
        code: phoneData.code,
        phone: phoneData.phone,
        country: authStore.phoneReg?.country || null,
      }
      authStore.regError = ""
      authStore.regButtonContent = "Зарегистрироваться"
      authStore.regButtonDisabled = false
      authStore.regStep = false
      authStore.smsError = "Пользователь уже зарегистрирован. Войдите в систему."
      return
    } else {
      throw new Error(response.error || "Неизвестная ошибка")
    }
  } catch (error: any) {
    const errorMsg = error.data?.error || error.message || "Ошибка сети или сервера"
    if (!isReg) {
      if (isResend) {
        authStore.smsError2 = errorMsg
      } else {
        authStore.smsError = errorMsg
      }
    } else {
      if (isResend) {
        authStore.regError = errorMsg
      } else {
        authStore.regError = errorMsg
      }
    }
  }
  startCountdown()
}

const startCountdown = () => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
    timeoutId.value = null
  }

  resendAvailableAt.value = Date.now() + 45000
  remainingSeconds.value = 45

  if (intervalId.value) clearInterval(intervalId.value)

  intervalId.value = window.setInterval(() => {
    if (!resendAvailableAt.value) return
    const diff = Math.floor((resendAvailableAt.value - Date.now()) / 1000)
    remainingSeconds.value = diff > 0 ? diff : 0
    if (diff <= 0 && intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }, 1000)
}

const handleClick = async (login: "phone" | "email"): Promise<void> => {
  if (login === "phone") {
    if (!phoneRef.value?.validate()) return
  } else {
    if (!emailRef.value?.validate() || !passwordRef.value?.validate()) return
  }

  const code = authStore.phone?.code
  const phone = authStore.phone?.phone
  const email = authStore.email
  const password = authStore.password

  if (login === "phone") {
    if (!code || !phone) return
  } else {
    if (!email || !password) return
  }

  if (login === "phone") {
    authStore.phoneButtonDisabled = true
    authStore.phoneButtonContent = "Отправка..."
  } else {
    authStore.emailButtonDisabled = true
    authStore.emailButtonContent = "Вход..."
  }
  
  if (login === "phone") {
    authStore.phoneButtonDisabled = true
    authStore.phoneButtonContent = "Отправка..."
    await sendSmsCode({ code: authStore.phone!.code, phone: authStore.phone!.phone }, false, false)
    
    if (authStore.type === "Регистрация") return
    
    if (!authStore.smsError) {
      authStore.phoneButtonContent = "Код отправлен"
      authStore.phoneButtonDisabled = false
      authStore.smsStep = true
    } else {
      authStore.phoneButtonContent = "Попробовать снова"
      authStore.phoneButtonDisabled = false
    }
  } else {
    authStore.emailButtonDisabled = true
    authStore.emailButtonContent = "Вход..."
    try {
      const response = await $fetch<LoginResponse>("https://back.casaalmare.com/api/login", {
        method: "POST",
        body: { email: authStore.email, password: authStore.password, loginType: 1 },
      })
      
      if (response.success) {
        authStore.smsError = ""
        authStore.emailButtonContent = "Успешно"
        if (response.token) {
          await userStore.saveToken(response.token)
          await userStore.fetchUser()
        }
        authModalStore.close()
      } else if (response.errorCode === "USER_NOT_FOUND") {
        authStore.type = "Регистрация"
        authStore.emailReg = authStore.email
        authStore.smsError = ""
        authStore.emailButtonContent = "Войти"
      } else {
        authStore.smsError = typeof response.error === "string" ? response.error : "Неизвестная ошибка"
        authStore.emailButtonContent = "Попробовать снова"
      }
    } catch (error: any) {
      authStore.smsError = "Ошибка сети или сервера"
      authStore.emailButtonContent = "Попробовать снова"
    } finally {
      authStore.emailButtonDisabled = false
    }
  }
}

const handleSmsClick = async (): Promise<void> => {
  if (!smsRef.value?.validate()) return

  const code = authStore.phone?.code
  const phone = authStore.phone?.phone
  const smsCode = authStore.sms

  if (!code || !phone || !smsCode) return

  authStore.smsButtonDisabled = true
  authStore.smsButtonContent = "Проверка..."
  
  try {
    const token = await userStore.loadToken()
    const response = await $fetch<LoginResponse>("https://back.casaalmare.com/api/login", {
      method: "POST",
      body: {
        phone: { code: authStore.phone!.code, phone: authStore.phone!.phone },
        code: authStore.sms,
        loginType: 1,
        token,
      },
    })
    
    if (response.success) {
      authStore.smsError2 = ""
      authStore.smsButtonContent = "Успешно"
      if (response.token) {
        await userStore.saveToken(response.token)
        await userStore.fetchUser()
      }
      authModalStore.close()
    } else {
      authStore.smsError2 = typeof response.error === 'object' ? response.error?.code : "Неверный код"
      authStore.smsButtonContent = "Попробовать снова"
    }
  } catch (err) {
    authStore.smsError2 = "Ошибка сети или сервера"
    authStore.smsButtonContent = "Попробовать снова"
  } finally {
    authStore.smsButtonDisabled = false
  }
}

const handleResend = async () => {
  if (authStore.resendLoading) return
  authStore.resendLoading = true
  authStore.smsError = ""
  authStore.smsError2 = ""
  const code = authStore.phone?.code
  const phone = authStore.phone?.phone
  if (!code || !phone) {
    authStore.resendLoading = false
    return
  }
  await sendSmsCode({ code, phone }, false, true)
  authStore.smsButtonContent = "Подтвердить"
  authStore.smsButtonDisabled = false
  authStore.resendLoading = false
}

const handleRegClick = async (): Promise<void> => {
  if (!emailRegRef.value?.validate()) return
  if (!phoneRegRef.value?.validate()) return
  if (!nameRef.value?.validate()) return
  if (!surnameRef.value?.validate()) return

  const email = authStore.emailReg
  const code = authStore.phoneReg?.code
  const phone = authStore.phoneReg?.phone

  if (!email || !code || !phone || !authStore.name || !authStore.surname) return

  authStore.regButtonDisabled = true
  authStore.regButtonContent = "Отправка..."

  await sendSmsCode({ code, phone }, true, false)

  if (authStore.type === "Авторизация") {
    authStore.regButtonContent = "Зарегистрироваться"
    authStore.regButtonDisabled = false
    return
  }

  if (!authStore.regError) {
    authStore.regButtonContent = "Код отправлен"
    authStore.regButtonDisabled = false
    authStore.regStep = true
  } else {
    authStore.regButtonContent = "Попробовать снова"
    authStore.regButtonDisabled = false
  }
}

const handleRegSmsClick = async (): Promise<void> => {
  if (!smsRef.value?.validate()) return

  const email = authStore.emailReg
  const code = authStore.phoneReg?.code
  const phone = authStore.phoneReg?.phone
  const smsCode = authStore.sms
  const name = authStore.name
  const surname = authStore.surname

  if (!email || !code || !phone || !smsCode || !name || !surname) return

  authStore.smsButtonDisabled = true
  authStore.smsButtonContent = "Регистрация..."
  
  try {
    const token = await userStore.loadToken()
    const response = await $fetch<LoginResponse>("https://back.casaalmare.com/api/login", {
      method: "POST",
      body: {
        email: authStore.emailReg,
        firstname: authStore.name,
        lastname: authStore.surname,
        phone: { code: authStore.phoneReg!.code, phone: authStore.phoneReg!.phone },
        code: authStore.sms,
        loginType: 2,
        token,
      },
    })
    
    if (response.success) {
      authStore.regError = ""
      if (response.token) {
        await userStore.saveToken(response.token)
        await userStore.fetchUser()
      }
      authStore.type = "Авторизация"
      authModalStore.close()
    } else {
      authStore.regError = typeof response.error === 'object' ? response.error?.code : "Ошибка регистрации"
      authStore.smsButtonContent = "Попробовать снова"
    }
  } catch (err) {
    authStore.regError = "Ошибка сети"
  } finally {
    authStore.smsButtonDisabled = false
  }
}

const handleRegResend = async () => {
  if (authStore.resendLoading) return
  authStore.resendLoading = true
  authStore.regError = ""
  const code = authStore.phoneReg?.code
  const phone = authStore.phoneReg?.phone
  if (!code || !phone) {
    authStore.resendLoading = false
    return
  }
  await sendSmsCode({ code, phone }, true, true)
  authStore.smsButtonContent = "Регистрация..."
  authStore.smsButtonDisabled = false
  authStore.resendLoading = false
}

const handleResetPassword = async (): Promise<void> => {
  if (!resetEmailRef.value?.validate()) return

  const email = authStore.resetEmail
  if (!email) return

  authStore.resetButtonDisabled = true
  authStore.resetButtonContent = "Отправка..."
  
  try {
    const response = await $fetch<ResetPasswordResponse>("https://back.casaalmare.com/api/resetPassword", {
      method: "POST",
      body: { email: authStore.resetEmail },
    })
    
    if (response.success) {
      authStore.resetError = ""
      authStore.type = "Успех восстановления"
    } else {
      authStore.resetError = response.error ?? "Неизвестная ошибка"
      authStore.resetButtonContent = "Попробовать снова"
      authStore.resetButtonDisabled = false
    }
  } catch (error) {
    authStore.resetError = "Ошибка сети"
    authStore.resetButtonDisabled = false
  }
}

const toggleBodyScroll = (disable: boolean) => {
  if (import.meta.client) {
    if (disable) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }
}

onMounted(() => {
  toggleBodyScroll(true)
})

onUnmounted(() => {
  toggleBodyScroll(false)
  if (timeoutId.value) clearTimeout(timeoutId.value)
  if (intervalId.value) clearInterval(intervalId.value)
  // ИЗМЕНЕНИЕ: Полный сброс формы при закрытии модалки
  authStore.resetForm()
})

const isAuthSmsSubmitting = computed(() => authStore.smsButtonDisabled)
useSmsAutoSubmit(
  computed(() => authStore.sms || ""),
  async () => {
    if (authStore.type === "Авторизация" && authStore.smsStep) {
      await handleSmsClick()
    } else if (authStore.type === "Регистрация" && authStore.regStep) {
      await handleRegSmsClick()
    }
  },
  isAuthSmsSubmitting,
)
</script>

<template>
  <div class="fixed inset-0 z-10 flex justify-center items-center">
    <div class="w-[300px] bg-[#FFFFFA] border-[0.7px] border-[#211D1D] rounded-2xl">
      <div class="flex justify-end items-center">
        <button
          class="p-2 cursor-pointer"
          @click="authModalStore.close"
        >
          <img
            src="/x.svg"
            width="24"
          >
        </button>
      </div>
      <div class="px-6 pb-6 flex flex-col items-stretch">
        <template v-if="authStore.type === 'Авторизация'">
          <h2 class="mb-8 font-[Manrope] text-sm text-[#211D1D] text-center uppercase">Вход</h2>
          <template v-if="!authStore.smsStep">
            <SelectButton
              v-model="authStore.method"
              :variants="['По телефону', 'По почте']"
              custom-class="mb-8 w-fit self-center"
            />
            <template v-if="authStore.method === 'По телефону'">
              <AppTooltip
                text="Это поле обязательно для заполнения"
                type="error"
                :show="phoneRef?.showError"
              >
                <SelectInput
                  id="phone"
                  ref="phoneRef"
                  v-model="authStore.phone"
                  custom-class="w-full"
                  :options="[
                    { code: '+7', country: 'Россия', iso: 'RU' },
                    { code: '+375', country: 'Беларусь', iso: 'BY' },
                    { code: '+380', country: 'Украина', iso: 'UA' },
                    { code: '+77', country: 'Казахстан', iso: 'KZ' },
                    { code: '+998', country: 'Узбекистан', iso: 'UZ' },
                    { code: '+992', country: 'Таджикистан', iso: 'TJ' },
                    { code: '+993', country: 'Туркменистан', iso: 'TM' },
                    { code: '+996', country: 'Кыргызстан', iso: 'KG' },
                    { code: '+374', country: 'Армения', iso: 'AM' },
                    { code: '+994', country: 'Азербайджан', iso: 'AZ' },
                    { code: '+373', country: 'Молдова', iso: 'MD' },
                    { code: '+995', country: 'Грузия', iso: 'GE' },
                  ]"
                  label="Номер телефона"
                  required
                />
              </AppTooltip>
              <AppTooltip
                :text="authStore.smsError"
                type="error"
                :show="!!authStore.smsError"
                @update:show="(value) => (authStore.smsError = value ? '' : '')"
              >
                <AppButton
                  variant="primary"
                  :content="authStore.phoneButtonContent"
                  :disabled="authStore.phoneButtonDisabled"
                  custom-class="w-full mt-4"
                  @click="handleClick('phone')"
                />
              </AppTooltip>
              <span
                class="font-[Manrope] text-xs font-light text-[#5E5B58] mt-8 cursor-pointer self-center"
                @click="authStore.type = 'Регистрация'"
              >
                Нет аккаунта? Регистрация
              </span>
            </template>
            <template v-else>
              <AppTooltip
                text="Это поле обязательно для заполнения"
                type="error"
                :show="emailRef?.showError"
              >
                <AppInput
                  id="email"
                  ref="emailRef"
                  v-model="authStore.email"
                  type="email"
                  label="Почта"
                  required
                  custom-class="w-full"
                />
              </AppTooltip>
              <AppTooltip
                text="Это поле обязательно для заполнения"
                type="error"
                :show="passwordRef?.showError"
              >
                <AppInput
                  id="password"
                  ref="passwordRef"
                  v-model="authStore.password"
                  type="password"
                  label="Пароль"
                  required
                  custom-class="w-full mt-4"
                />
              </AppTooltip>
              <AppTooltip
                :text="authStore.smsError"
                type="error"
                :show="!!authStore.smsError"
                @update:show="(value) => (authStore.smsError = value ? '' : '')"
              >
                <AppButton
                  variant="primary"
                  :content="authStore.emailButtonContent"
                  :disabled="authStore.emailButtonDisabled"
                  custom-class="w-full mt-4"
                  @click="handleClick('email')"
                />
              </AppTooltip>
              <span
                class="font-[Manrope] text-xs font-light text-[#5E5B58] mt-4 cursor-pointer self-center"
                @click="authStore.type = 'Восстановление'"
              >
                Забыли пароль?
              </span>
              <span
                class="font-[Manrope] text-xs font-light text-[#5E5B58] mt-4 cursor-pointer self-center"
                @click="authStore.type = 'Регистрация'"
              >
                Нет аккаунта? Регистрация
              </span>
            </template>
          </template>
          <template v-else>
            <AppTooltip
              text="Это поле обязательно для заполнения"
              type="error"
              :show="smsRef?.showError"
            >
              <AppInput
                id="sms"
                ref="smsRef"
                v-model="authStore.sms"
                type="text"
                label="Код из СМС"
                required
                custom-class="w-full"
              />
            </AppTooltip>
            <AppTooltip
              :text="authStore.smsError2"
              type="error"
              :show="!!authStore.smsError2"
              @update:show="(value) => (authStore.smsError2 = value ? '' : '')"
            >
              <AppButton
                variant="primary"
                :content="authStore.smsButtonContent"
                :disabled="authStore.smsButtonDisabled"
                custom-class="w-full mt-8"
                @click="handleSmsClick"
              />
            </AppTooltip>
            <span
              v-if="remainingSeconds > 0"
              class="font-[Manrope] text-xs font-light text-[#211D1D] mt-8 self-center text-center"
            >
              Запросить код повторно <br >
              можно через <span class="font-normal">{{ remainingSeconds }} секунд</span>
            </span>
            <span
              v-else
              class="font-[Manrope] text-xs font-light text-[#211D1D] mt-8 self-center text-center cursor-pointer"
              :class="{ 'cursor-not-allowed opacity-50': authStore.resendLoading }"
              @click="handleResend"
            >
              {{ authStore.resendLoading ? "Отправка..." : "Отправить ещё раз" }}
            </span>
          </template>
        </template>

        <template v-else-if="authStore.type === 'Восстановление'">
          <h2 class="mb-4 font-[Manrope] text-sm text-[#211D1D] text-center uppercase">Восстановление пароля</h2>
          <span class="font-[Manrope] font-light text-sm text-[#414141] text-center mb-8">Восстановить пароль</span>

          <AppTooltip
            text="Это поле обязательно для заполнения"
            type="error"
            :show="resetEmailRef?.showError"
          >
            <AppInput
              id="resetEmail"
              ref="resetEmailRef"
              v-model="authStore.resetEmail"
              type="email"
              label="Почта"
              required
              custom-class="w-full"
            />
          </AppTooltip>

          <AppTooltip
            :text="authStore.resetError"
            type="error"
            :show="!!authStore.resetError"
            @update:show="(value) => (authStore.resetError = value ? '' : '')"
          >
            <AppButton
              variant="primary"
              :content="authStore.resetButtonContent"
              :disabled="authStore.resetButtonDisabled"
              custom-class="w-full mt-4"
              @click="handleResetPassword"
            />
          </AppTooltip>

          <span
            class="font-[Manrope] text-xs font-light text-[#5E5B58] mt-8 cursor-pointer self-center"
            @click="authStore.type = 'Авторизация'"
          >
            Вернуться к входу
          </span>
        </template>

        <template v-else-if="authStore.type === 'Успех восстановления'">
          <div class="flex flex-col items-center text-center">
            <span class="font-[Manrope] font-light text-sm text-[#414141] mb-4">Пароль сброшен</span>
            <span class="font-[Manrope] font-light text-xs text-[#211D1D] mb-8"
              >На вашу почту отправлено письмо с информацией для восстановления пароля.</span
            >

            <AppButton
              variant="primary"
              content="Перейти к авторизации"
              custom-class="w-full"
              @click="authStore.type = 'Авторизация'"
            />
          </div>
        </template>

        <template v-else>
          <h2 class="mb-8 font-[Manrope] text-sm text-[#211D1D] text-center uppercase">Регистрация</h2>
          <template v-if="!authStore.regStep">
            <AppTooltip
              text="Это поле обязательно для заполнения"
              type="error"
              :show="emailRegRef?.showError"
            >
              <AppInput
                id="emailReg"
                ref="emailRegRef"
                v-model="authStore.emailReg"
                type="text"
                label="Почта"
                required
                custom-class="w-full"
              />
            </AppTooltip>
            <AppTooltip
              text="Это поле обязательно для заполнения"
              type="error"
              :show="phoneRegRef?.showError"
            >
              <SelectInput
                id="phoneReg"
                ref="phoneRegRef"
                v-model="authStore.phoneReg"
                custom-class="w-full mt-4"
                :options="[
                  { code: '+7', country: 'Россия', iso: 'RU' },
                  { code: '+375', country: 'Беларусь', iso: 'BY' },
                  { code: '+380', country: 'Украина', iso: 'UA' },
                  { code: '+77', country: 'Казахстан', iso: 'KZ' },
                  { code: '+998', country: 'Узбекистан', iso: 'UZ' },
                  { code: '+992', country: 'Таджикистан', iso: 'TJ' },
                  { code: '+993', country: 'Туркменистан', iso: 'TM' },
                  { code: '+996', country: 'Кыргызстан', iso: 'KG' },
                  { code: '+374', country: 'Армения', iso: 'AM' },
                  { code: '+994', country: 'Азербайджан', iso: 'AZ' },
                  { code: '+373', country: 'Молдова', iso: 'MD' },
                  { code: '+995', country: 'Грузия', iso: 'GE' },
                ]"
                label="Номер телефона"
                required
              />
            </AppTooltip>
            <AppTooltip
              text="Это поле обязательно для заполнения"
              type="error"
              :show="nameRef?.showError"
            >
              <AppInput
                id="name"
                ref="nameRef"
                v-model="authStore.name"
                type="text"
                label="Имя"
                required
                custom-class="w-full mt-4"
              />
            </AppTooltip>
            <AppTooltip
              text="Это поле обязательно для заполнения"
              type="error"
              :show="surnameRef?.showError"
            >
              <AppInput
                id="surname"
                ref="surnameRef"
                v-model="authStore.surname"
                type="text"
                label="Фамилия"
                required
                custom-class="w-full mt-4"
              />
            </AppTooltip>
            <AppTooltip
              :text="authStore.regError"
              type="error"
              :show="!!authStore.regError"
              @update:show="(value) => (authStore.regError = value ? '' : '')"
            >
              <AppButton
                variant="primary"
                :content="authStore.regButtonContent"
                :disabled="authStore.regButtonDisabled"
                custom-class="w-full mt-4"
                @click="handleRegClick"
              />
            </AppTooltip>
            <span
              class="font-[Manrope] text-xs font-light text-[#5E5B58] mt-8 cursor-pointer self-center"
              @click="authStore.type = 'Авторизация'"
            >
              Есть аккаунт? Вход
            </span>
          </template>
          <template v-else>
            <AppTooltip
              text="Это поле обязательно для заполнения"
              type="error"
              :show="smsRef?.showError"
            >
              <AppInput
                id="sms"
                ref="smsRef"
                v-model="authStore.sms"
                type="text"
                label="Код из СМС"
                required
                custom-class="w-full"
              />
            </AppTooltip>
            <AppTooltip
              :text="authStore.regError"
              type="error"
              :show="!!authStore.regError"
              @update:show="(value) => (authStore.regError = value ? '' : '')"
            >
              <AppButton
                variant="primary"
                :content="authStore.smsButtonContent"
                :disabled="authStore.smsButtonDisabled"
                custom-class="w-full mt-8"
                @click="handleRegSmsClick"
              />
            </AppTooltip>
            <span class="font-[Commissioner] font-light text-[11px] text-[#8C8785] text-center mt-4">
              Нажимая на кнопку "подтвердить", я соглашаюсь на обработку моих персональных данных и ознакомлен(а) с
              политикой конфиденциальности.
            </span>
            <span
              v-if="remainingSeconds > 0"
              class="font-[Manrope] text-xs font-light text-[#211D1D] mt-8 self-center text-center"
            >
              Запросить код повторно <br >
              можно через <span class="font-normal">{{ remainingSeconds }} секунд</span>
            </span>
            <span
              v-else
              class="font-[Manrope] text-xs font-light text-[#211D1D] mt-8 self-center text-center cursor-pointer"
              :class="{ 'cursor-not-allowed opacity-50': authStore.resendLoading }"
              @click="handleRegResend"
            >
              {{ authStore.resendLoading ? "Отправка..." : "Отправить ещё раз" }}
            </span>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
