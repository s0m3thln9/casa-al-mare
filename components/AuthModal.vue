<script setup lang="ts">
const authStore = useAuthStore()
const authModalStore = useAuthModalStore()
const userStore = useUserStore()

interface SmsResponse {
  success?: string
  error?: string
}

const phoneRef = ref<{
  validate: () => boolean
  showError: boolean
} | null>(null)
const smsRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const timeoutId = ref<number | null>(null)

const handleClick = async (): Promise<void> => {
  if (!phoneRef.value?.validate()) return

  const code = authStore.phone?.code
  const phone = authStore.phone?.phone

  if (!code || !phone) return

  authStore.isSending = true
  authStore.phoneButtonDisabled = true
  authStore.phoneButtonContent = "Отправка..."

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
      authStore.isSending = false
      authStore.phoneButtonDisabled = false
      authStore.phoneButtonContent = "Отправить код"
      timeoutId.value = null
    }, 45000)
  } catch (error) {
    console.error(error)
    authStore.smsError = "Ошибка сети или сервера"
    authStore.phoneButtonContent = "Попробовать снова"
    authStore.phoneButtonDisabled = false
    authStore.isSending = false
    authStore.smsStep = false
  }
}

const handleSmsClick = async () => {
  if (!smsRef.value?.validate()) return

  const code = authStore.phone?.code
  const phone = authStore.phone?.phone
  const smsCode = authStore.sms

  if (!code || !phone || !smsCode) return

  authStore.isSending = true
  authStore.smsButtonDisabled = true
  authStore.smsButtonContent = "Проверка..."

  try {
	  const token = await userStore.loadToken()
    const { data } = await useFetch<{
      success: boolean
      error?: string
      token?: string
    }>("https://swimwear.kyokata.wtf/api/login", {
      method: "POST",
      body: {
        phone: {
          code,
          phone,
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
		  authStore.login()
		  authStore.smsStep = false
		  if (response.token) {
			  await userStore.saveToken(response.token)
		  }
		  authModalStore.close()
    } else {
		authStore.smsError2 = response?.error || "Неверный код или ошибка сервера"
		authStore.smsButtonContent = "Попробовать снова"
	}
} catch (err) {
	console.error("SMS verification error:", err)
	authStore.smsError2 = "Ошибка сети или сервера"
	authStore.smsButtonContent = "Попробовать снова"
} finally {
	authStore.isSending = false
	authStore.smsButtonDisabled = false
}
}

onUnmounted(() => {
  if (timeoutId.value) clearTimeout(timeoutId.value)
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
        <h2 class="mb-8 font-[Manrope] text-sm text-[#211D1D] text-center uppercase">Присоединиться</h2>
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
                @click="handleClick"
              />
            </AppTooltip>
            <span class="font-[Manrope] text-xs font-light text-[#5E5B58] mt-8 cursor-pointer self-center"
              >Нет аккаунта? Регистрация</span
            >
          </template>
          <template v-else>
            <AppInput
              id="email"
              v-model="authStore.email"
              type="email"
              label="Почта"
              required
              custom-class="w-full"
            />
            <AppInput
              id="password"
              v-model="authStore.password"
              type="password"
              label="Пароль"
              required
              custom-class="w-full mt-4"
            />
            <AppButton
              variant="primary"
              :content="authStore.emailButtonContent"
              :disabled="authStore.emailButtonDisabled"
              custom-class="w-full mt-4"
              @click="handleClick"
            />
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
          <span class="font-[Manrope] text-xs font-light text-[#211D1D] mt-8 self-center text-center">
            Запросить код повторно <br />
            можно через <span class="font-normal">45 секунд</span>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
