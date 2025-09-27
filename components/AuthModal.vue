<script setup lang="ts">
const authStore = useAuthStore()
const authModalStore = useAuthModalStore()
const userStore = useUserStore()

interface SmsResponse {
  success?: string
  error?: string
  tel?: string
}

interface LoginResponse {
  success: boolean
  error?: {
    code?: string
  }
  token?: string
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
const timeoutId = ref<number | null>(null)

const resendAvailableAt = ref<number | null>(null)
const remainingSeconds = ref(0)
const intervalId = ref<number | null>(null)

const startCountdown = () => {
  resendAvailableAt.value = Date.now() + 45000
  remainingSeconds.value = 45

  if (intervalId.value) clearInterval(intervalId.value)

  intervalId.value = window.setInterval(() => {
    const diff = Math.floor((resendAvailableAt.value! - Date.now()) / 1000)
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
    if (!emailRef.value?.validate() && !passwordRef.value?.validate()) return
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
    try {
      const { data } = await useFetch<SmsResponse>("https://swimwear.kyokata.wtf/api/createSmsCode", {
        method: "POST",
        body: {
          phone: {
            code,
            phone,
          },
        },
      })

      if (data.value?.success) {
        console.log(data.value.success)
        authStore.smsError = ""
        authStore.phoneButtonContent = "Код отправлен"
        authStore.smsStep = true
      } else {
        console.error(data.value?.error)
        authStore.smsError = data.value?.error ?? "Неизвестная ошибка"
        authStore.phoneButtonContent = "Отправить код"
        authStore.smsStep = false
      }

      if (timeoutId.value) clearTimeout(timeoutId.value)

      timeoutId.value = window.setTimeout(() => {
        authStore.phoneButtonDisabled = false
        authStore.phoneButtonContent = "Отправить СМС-код"
        timeoutId.value = null
      }, 45000)
      startCountdown()
    } catch (error) {
      console.error(error)
      authStore.smsError = "Ошибка сети или сервера"
      authStore.phoneButtonContent = "Попробовать снова"
      authStore.phoneButtonDisabled = false
      authStore.smsStep = false
    }
  } else {
    try {
      const { data } = await useFetch<SmsResponse>("https://swimwear.kyokata.wtf/api/createSmsCode", {
        method: "POST",
        body: {
          email,
          password,
        },
      })

      if (data.value?.success) {
        console.log(data.value.success)
        authStore.smsError = ""
        authStore.emailButtonContent = "Успешно"
        if (data.value.token) {
          await userStore.saveToken(data.value.token)
          await userStore.loadToken()
          await userStore.fetchUser()
        }
        authModalStore.close()
      } else {
        console.error(data.value?.error)
        authStore.smsError = data.value?.error ?? "Неизвестная ошибка"
        authStore.emailButtonContent = "Попробовать снова"
      }
    } catch (error) {
      console.error(error)
      authStore.smsError = "Ошибка сети или сервера"
      authStore.emailButtonContent = "Попробовать снова"
      authStore.emailButtonDisabled = false
    }
  }
}

const handleSmsClick = async (): Promise<void> => {
  if (!smsRef.value?.validate()) return

  const code = authStore.phone?.code
  const phone = authStore.phone?.phone
  const telPhone = authStore.tel?.phone
  const telCode = authStore.tel?.code
  const smsCode = authStore.sms
  let code2 = code
  let phone2 = phone
  if (telPhone && telCode) {
    code2 = telCode
    phone2 = telPhone
    if (!smsCode) return
  } else {
    if (!code || !phone || !smsCode) return
  }

  authStore.smsButtonDisabled = true
  authStore.smsButtonContent = "Проверка..."

  try {
    const token = await userStore.loadToken()
    const { data } = await useFetch<LoginResponse>("https://swimwear.kyokata.wtf/api/login", {
      method: "POST",
      body: {
        phone: {
          code: code2,
          phone: phone2,
        },
        code: smsCode,
        loginType: 1,
        token,
      },
    })

    const response = data.value

    if (response?.success) {
      authStore.smsError2 = ""
      authStore.smsButtonContent = "Успешно"
      authStore.smsStep = false
      if (response.token) {
        await userStore.saveToken(response.token)
        await userStore.loadToken()
        await userStore.fetchUser()
      }
      authModalStore.close()
    } else {
      authStore.smsError2 = response?.error?.code || "Неверный код или ошибка сервера"
      authStore.smsButtonContent = "Попробовать снова"
    }
  } catch (err) {
    console.error("SMS verification error:", err)
    authStore.smsError2 = "Ошибка сети или сервера"
    authStore.smsButtonContent = "Попробовать снова"
  } finally {
    authStore.smsButtonDisabled = false
  }
}

const handleResend = () => {
  authStore.smsStep = false
}

const handleRegClick = async (): Promise<void> => {
  if (!emailRegRef.value?.validate()) return
  if (!phoneRegRef.value?.validate()) return
  if (!nameRef.value?.validate()) return
  if (!surnameRef.value?.validate()) return

  const email = authStore.emailReg
  const phone = authStore.phoneReg
  const name = authStore.name
  const surname = authStore.surname

  if (!email || !phone || !name || !surname) return

  authStore.regButtonDisabled = true
  authStore.regButtonContent = "Регистрация..."

  try {
    const token = await userStore.loadToken()
    const { data } = await useFetch<LoginResponse>("https://swimwear.kyokata.wtf/api/login", {
      method: "POST",
      body: {
        email,
        firstname: name,
        lastname: surname,
        phone: {
          code: phone.code,
          phone: phone.phone,
          country: phone.country,
        },
        loginType: 2,
        token,
      },
    })

    const response = data.value

    if (response?.success) {
      authStore.regError = ""
      authStore.regButtonContent = "Успешно"
      if (response.token) {
        await userStore.saveToken(response.token)
        await userStore.loadToken()
        await userStore.fetchUser()
      }
      authModalStore.close()
    } else {
      authStore.regError = response?.error?.code || "Неверный код или ошибка сервера"
      authStore.regButtonContent = "Попробовать снова"
      authStore.regStep = true
    }
  } catch (err) {
    console.error("SMS verification error:", err)
    authStore.regError = "Ошибка сети или сервера"
    authStore.regButtonContent = "Попробовать снова"
  } finally {
    authStore.regButtonDisabled = false
  }
}

onUnmounted(() => {
  if (timeoutId.value) clearTimeout(timeoutId.value)
  if (intervalId.value) clearInterval(intervalId.value)
})
</script>

<template>
  <div class="absolute inset-0 z-10 flex justify-center items-center">
    <div class="w-[300px] bg-[#FFFFFA] border-[0.7px] border-[#211D1D] rounded-2xl">
      <div class="flex justify-end items-center">
        <button
          class="p-2 cursor-pointer"
          @click="authModalStore.close"
        >
          <NuxtImg
            src="/x.svg"
            width="24"
          />
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
            <span class="font-[Commissioner] font-light text-[11px] text-[#8C8785] text-center mt-4">
              Нажимая на кнопку “подтвердить”, я соглашаюсь на обработку моих персональных данных и ознакомлен(а) с
              политикой конфиденциальности.
            </span>
            <span
              v-if="remainingSeconds > 0"
              class="font-[Manrope] text-xs font-light text-[#211D1D] mt-8 self-center text-center"
            >
              Запросить код повторно <br />
              можно через <span class="font-normal">{{ remainingSeconds }} секунд</span>
            </span>
            <span
              v-else
              class="font-[Manrope] text-xs font-light text-[#211D1D] mt-8 self-center text-center cursor-pointer"
              @click="handleResend"
            >
              Отправить ещё раз
            </span>
          </template>
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
            <span class="font-[Commissioner] font-light text-[11px] text-[#8C8785] text-center mt-4"
              >На почту выслано письмо с паролем</span
            >
            <AppButton
              variant="primary"
              content="Продолжить"
              custom-class="w-full mt-8"
              @click="authModalStore.close"
            />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
