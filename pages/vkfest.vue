<script setup lang="ts">
interface VideoSource {
  mp4: string
  ogv: string
  webm: string
}

interface VideoData {
  pc: VideoSource
  mob: VideoSource
}

interface RegisterByLinkResponse {
  success?: boolean
  registered?: boolean
  errorCode?: string
  code?: string
  status?: string
  error?: string
  message?: string
  token?: string
}

interface SmsResponse {
  success?: boolean | string
  error?: string
  errorCode?: string
}

interface LoginResponse {
  success?: boolean
  error?: { code?: string } | string
  errorCode?: string
  token?: string
}

definePageMeta({ layout: "blank" })

useHead({
  title: "Программа лояльности - CASA AL MARE",
})

const userStore = useUserStore()
const authStore = useAuthStore()
const authModalStore = useAuthModalStore()
const viewport = useViewport()

const { data: videoData } = await useFetch<VideoData>("https://back.casaalmare.com/api/getMainVideo")

const isMobile = computed(() => viewport.isLessThan("sm"))
const currentVideo = computed(() => (isMobile.value ? videoData.value?.mob : videoData.value?.pc))

const phoneOptions = [
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

// 'checking' — проверяем авторизацию/статус бонуса (для авторизованных)
// 'form' — форма регистрации (обычный неавторизованный пользователь)
// 'sms' — подтверждение номера телефона кодом из СМС
// 'success' — бонусы начислены (экран «Готово»)
// 'exists' — аккаунт уже существует, нужно авторизоваться
// 'already' — бонус уже был получен (показываем только висячий блок)
const view = ref<"checking" | "form" | "sms" | "success" | "exists" | "already">("checking")
const bonusMessage = ref("")

const firstname = ref("")
const lastname = ref("")
const birthdate = ref("")
const birthFocused = ref(false)
const phone = ref<{ code: string | null; phone: string; country: string | null } | null>(null)
const email = ref("")
const agree = ref<number | null>(null)

const firstnameRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const lastnameRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const phoneRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const emailRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const birthError = ref(false)
const agreeError = ref(false)

const submitError = ref("")
const buttonContent = ref("Создать карту и получить бонусы")
const buttonDisabled = ref(false)

// Шаг подтверждения телефона по СМС (как в регистрации).
const sms = ref("")
const smsRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const smsError = ref("")
const smsButtonContent = ref("Подтвердить")
const smsButtonDisabled = ref(false)
const resendLoading = ref(false)
const remainingSeconds = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

// Маска для даты рождения ДД.ММ.ГГГГ
const handleBirthInput = (event: Event) => {
  const digits = (event.target as HTMLInputElement).value.replace(/\D/g, "").slice(0, 8)
  let formatted = digits
  if (digits.length > 4) {
    formatted = `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`
  } else if (digits.length > 2) {
    formatted = `${digits.slice(0, 2)}.${digits.slice(2)}`
  }
  birthdate.value = formatted
  if (isBirthValid.value) birthError.value = false
}

const isBirthValid = computed(() => /^\d{2}\.\d{2}\.\d{4}$/.test(birthdate.value))

// Коды ответа registerByLink. Если бэкенд использует другие — поправить здесь.
const ALREADY_CODES = ["BONUS_ALREADY_RECEIVED", "ALREADY_RECEIVED", "BONUS_EXISTS", "USER_HAS_BONUS"]
const EXISTS_CODES = ["USER_ALREADY_EXISTS", "USER_EXISTS", "PHONE_EXISTS", "PHONE_ALREADY_EXISTS"]

const responseCode = (res: RegisterByLinkResponse) =>
  String(res?.errorCode ?? res?.code ?? res?.status ?? "").toUpperCase()

// Бонус считается полученным ТОЛЬКО когда бэкенд явно вернул success: true.
// success: false — это не ошибка, а «бонус ещё не начислен».
const isBonusReceived = (res: RegisterByLinkResponse) => res?.success === true

// Бонус мог быть получен ранее — тогда у пользователя проставлен profile.vkbonus.
const hasVkBonus = (): boolean => {
  const v = userStore.user?.profile?.vkbonus
  return Boolean(v) && v !== "0"
}

const callRegisterByLink = (body: Record<string, unknown>) =>
  $fetch<RegisterByLinkResponse>("https://back.casaalmare.com/api/registerByLink", { method: "POST", body })

const phoneBody = () => ({ code: phone.value!.code, phone: phone.value!.phone })

// Отправка СМС-кода на телефон (универсальный эндпоинт, как при входе).
const sendSmsCode = async (): Promise<{ ok: boolean; error?: string }> => {
  try {
    const res = await $fetch<SmsResponse>("https://back.casaalmare.com/api/createSmsCode", {
      method: "POST",
      body: { phone: phoneBody() },
    })
    if (res?.success) return { ok: true }
    return { ok: false, error: res?.error || "Не удалось отправить код" }
  } catch (e) {
    const error = (e as { data?: { error?: string } })?.data?.error
    return { ok: false, error: error || "Ошибка сети или сервера" }
  }
}

// Обратный отсчёт до повторной отправки СМС.
const startCountdown = () => {
  remainingSeconds.value = 45
  if (countdownTimer) clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    remainingSeconds.value = remainingSeconds.value > 0 ? remainingSeconds.value - 1 : 0
    if (remainingSeconds.value <= 0 && countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

// Вход по телефону с уже введённым СМС-кодом (для сценария «аккаунт существует»).
const loginByPhone = async (code: string): Promise<boolean> => {
  const token = await userStore.loadToken()
  const res = await $fetch<LoginResponse>("https://back.casaalmare.com/api/login", {
    method: "POST",
    body: { phone: phoneBody(), code, loginType: 1, token },
  })
  if (res?.success && res.token) {
    await userStore.saveToken(res.token)
    return true
  }
  return false
}

// Разбираем ответ registerByLink. Возвращаем целевой экран или null,
// если бонус ещё не начислен (success: false) и код не распознан.
const resolveResponse = (res: RegisterByLinkResponse): "success" | "already" | "exists" | null => {
  if (res?.message) bonusMessage.value = res.message
  const code = responseCode(res)
  if (EXISTS_CODES.some((c) => code.includes(c))) return "exists"
  if (ALREADY_CODES.some((c) => code.includes(c))) return "already"
  if (isBonusReceived(res)) return "success"
  return null
}

// Запрос бонуса по токену — для авторизованного пользователя и после входа из сценария «аккаунт есть».
const requestBonusByToken = async (): Promise<void> => {
  const token = await userStore.loadToken()
  view.value = resolveResponse(await callRegisterByLink({ token })) ?? "form"
}

// Экран для авторизованного пользователя: уже получал бонус → 'already', иначе запрашиваем по токену.
const resolveAuthorizedView = async (): Promise<void> => {
  if (hasVkBonus()) {
    view.value = "already"
    return
  }
  try {
    await requestBonusByToken()
  } catch {
    view.value = "form"
  }
}

let submitErrorTimer: ReturnType<typeof setTimeout> | null = null
const showSubmitError = (message: string) => {
  submitError.value = message
  if (submitErrorTimer) clearTimeout(submitErrorTimer)
  submitErrorTimer = setTimeout(() => (submitError.value = ""), 3000)
}

const triggerBirthError = () => {
  birthError.value = true
  setTimeout(() => (birthError.value = false), 3000)
}

const triggerAgreeError = () => {
  agreeError.value = true
  setTimeout(() => (agreeError.value = false), 3000)
}

// Шаг 1 — валидируем форму и отправляем СМС-код на телефон.
const handleSubmit = async () => {
  submitError.value = ""

  let valid = true
  if (!firstnameRef.value?.validate()) valid = false
  if (!lastnameRef.value?.validate()) valid = false
  if (!isBirthValid.value) {
    triggerBirthError()
    valid = false
  }
  if (!phoneRef.value?.validate()) valid = false
  if (!emailRef.value?.validate()) valid = false
  if (agree.value !== 1) {
    triggerAgreeError()
    valid = false
  }
  if (!valid) return

  buttonDisabled.value = true
  buttonContent.value = "Отправка..."

  const { ok, error } = await sendSmsCode()

  buttonDisabled.value = false
  buttonContent.value = "Создать карту и получить бонусы"

  if (!ok) {
    showSubmitError(error || "Не удалось отправить код")
    return
  }

  sms.value = ""
  smsError.value = ""
  smsButtonContent.value = "Подтвердить"
  smsButtonDisabled.value = false
  view.value = "sms"
  startCountdown()
}

let smsErrorTimer: ReturnType<typeof setTimeout> | null = null
const showSmsError = (message: string) => {
  smsError.value = message
  if (smsErrorTimer) clearTimeout(smsErrorTimer)
  smsErrorTimer = setTimeout(() => (smsError.value = ""), 3000)
}

// Шаг 2 — подтверждаем код и завершаем начисление бонуса.
const handleConfirmSms = async () => {
  if (!smsRef.value?.validate()) return

  smsButtonDisabled.value = true
  smsButtonContent.value = "Проверка..."

  try {
    const token = await userStore.loadToken()
    const res = await callRegisterByLink({
      firstname: firstname.value,
      lastname: lastname.value,
      birthdate: birthdate.value,
      phone: phoneBody(),
      email: email.value,
      code: sms.value,
      token,
    })

    // Аккаунт уже существует — логиним по телефону с тем же кодом и продолжаем «на месте»
    // (без перезагрузки страницы, чтобы не мигал фон и экран загрузки).
    if (res?.registered) {
      if (res.message) bonusMessage.value = res.message
      const loggedIn = await loginByPhone(sms.value)
      if (loggedIn) {
        view.value = "checking"
        try {
          await userStore.fetchUser()
        } catch {
          // игнорируем — resolveAuthorizedView сам покажет запасной экран
        }
        await resolveAuthorizedView()
        return
      }
      showSmsError(res.message || "Не удалось войти, попробуйте позже")
      smsButtonContent.value = "Попробовать снова"
      return
    }

    const resolved = resolveResponse(res)
    if (resolved === "success") {
      // Новый аккаунт создан — если бэкенд вернул токен, авторизуем пользователя,
      // чтобы после «Перейти к покупкам» сохранялись корзина/избранное/профиль.
      if (res.token) {
        await userStore.saveToken(res.token)
        try {
          await userStore.fetchUser()
        } catch {
          // не критично для экрана «Готово»
        }
      }
      view.value = "success"
      return
    }
    if (resolved) {
      view.value = resolved
      return
    }
    showSmsError(typeof res?.error === "string" && res.error ? res.error : "Неверный код")
    smsButtonContent.value = "Попробовать снова"
  } catch {
    showSmsError("Ошибка сети или сервера")
    smsButtonContent.value = "Попробовать снова"
  } finally {
    smsButtonDisabled.value = false
  }
}

// Повторная отправка СМС-кода.
const handleResendSms = async () => {
  if (resendLoading.value || remainingSeconds.value > 0) return
  resendLoading.value = true
  smsError.value = ""
  const { ok, error } = await sendSmsCode()
  resendLoading.value = false
  if (ok) startCountdown()
  else showSmsError(error || "Не удалось отправить код")
}

useSmsAutoSubmit(
  sms,
  handleConfirmSms,
  computed(() => smsButtonDisabled.value),
)

onMounted(async () => {
  await userStore.loadToken()

  // Нет токена — точно неавторизованный пользователь, показываем форму.
  if (!userStore.token) {
    view.value = "form"
    return
  }

  if (!userStore.user) {
    try {
      await userStore.fetchUser()
    } catch {
      // игнорируем — покажем форму
    }
  }

  // Проверяем пользователя напрямую по uid: authStore.isAuth обновляется через
  // watchEffect асинхронно и сразу после fetchUser() ещё содержит старое значение.
  const isAuthed = Number(userStore.user?.uid ?? 0) > 0

  if (isAuthed) {
    // Авторизован — форму пропускаем: либо 'already' (бонус был), либо запрос по токену.
    await resolveAuthorizedView()
  } else {
    view.value = "form"
  }
})

// После входа из сценария «аккаунт уже существует» — продолжаем: запрашиваем бонус по токену.
watch(
  () => authStore.isAuth,
  async (isAuth) => {
    if (isAuth && view.value === "exists") {
      try {
        await requestBonusByToken()
      } catch {
        view.value = "success"
      }
    }
  },
)

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

const goToCatalog = () => navigateTo("/catalog/")
const openAuth = () => authModalStore.open()
</script>

<template>
  <div class="relative min-h-[100dvh] w-full overflow-hidden font-[Manrope] text-[#211D1D]">
    <AuthModal v-if="authModalStore.isOpen" />

    <!-- Фоновое видео с главной -->
    <video
      v-if="currentVideo"
      autoplay
      muted
      playsinline
      loop
      class="fixed inset-0 -z-10 h-full w-full object-cover"
    >
      <source
        :src="currentVideo.mp4"
        type="video/mp4"
      >
      <source
        :src="currentVideo.ogv"
        type="video/ogv"
      >
      <source
        :src="currentVideo.webm"
        type="video/webm"
      >
    </video>

    <div class="relative flex min-h-[100dvh] flex-col items-center px-4 py-8 sm:py-12">
      <div class="flex w-full flex-1 items-center justify-center">
        <div class="w-full max-w-[470px]">
        <!-- Проверка статуса (для авторизованного пользователя) -->
        <template v-if="view === 'checking'">
          <div class="rounded-[20px] border border-[#E3E0DD] bg-[#FFFFFA] p-8 text-center">
            <p class="text-sm font-light text-[#5E5B58]">Загрузка...</p>
          </div>
        </template>

        <!-- Форма -->
        <template v-else-if="view === 'form'">
          <div class="rounded-[20px] border border-[#E3E0DD] bg-[#FFFFFA] p-6 sm:p-8">
            <span class="text-[11px] uppercase tracking-[0.08em] text-[#8C8785]">Программа лояльности</span>
            <h1 class="mt-2 text-[26px] font-normal leading-tight sm:text-[28px]">Создадим вашу карту</h1>
            <p class="mt-2 text-sm font-light text-[#5E5B58]">
              Заполните короткую форму — и мы начислим 1500 бонусов после регистрации.
            </p>

            <div class="mt-6 flex flex-col gap-5">
              <AppTooltip
                text="Это поле обязательно для заполнения"
                type="error"
                :show="firstnameRef?.showError"
              >
                <AppInput
                  id="firstname"
                  ref="firstnameRef"
                  v-model="firstname"
                  type="text"
                  label="Имя"
                  required
                  custom-class="w-full"
                />
              </AppTooltip>

              <AppTooltip
                text="Это поле обязательно для заполнения"
                type="error"
                :show="lastnameRef?.showError"
              >
                <AppInput
                  id="lastname"
                  ref="lastnameRef"
                  v-model="lastname"
                  type="text"
                  label="Фамилия"
                  required
                  custom-class="w-full"
                />
              </AppTooltip>

              <AppTooltip
                text="Введите дату в формате ДД.ММ.ГГГГ"
                type="error"
                :show="birthError"
              >
                <div class="relative w-full">
                  <label
                    for="birthdate"
                    class="absolute left-2.5 top-3.5 pointer-events-none font-[Manrope] text-sm font-light transition-all duration-200 sm:text-xs"
                    :class="birthdate || birthFocused ? '!top-[3px] text-[#8C8785]' : 'text-[#5E5B58]'"
                  >
                    Дата рождения
                    <span class="text-[#E29650]">*</span>
                  </label>
                  <input
                    id="birthdate"
                    :value="birthdate"
                    type="text"
                    inputmode="numeric"
                    placeholder="ДД.ММ.ГГГГ"
                    class="h-[44px] w-full rounded-lg border-[0.7px] px-2.5 pb-1.5 pt-[21.5px] font-[Manrope] text-sm font-light text-[#211D1D] outline-none placeholder:text-transparent sm:text-xs"
                    :class="{
                      'border-[#E29650]': birthError,
                      'border-[#211D1D]': birthdate && !birthError,
                      'border-[#B8B8B6]': !birthdate && !birthError,
                    }"
                    @focus="birthFocused = true"
                    @blur="birthFocused = false"
                    @input="handleBirthInput"
                  >
                </div>
              </AppTooltip>

              <AppTooltip
                text="Некорректный номер телефона или его отсутствие"
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
                :show="emailRef?.showError"
              >
                <AppInput
                  id="email"
                  ref="emailRef"
                  v-model="email"
                  type="email"
                  label="Email"
                  required
                  custom-class="w-full"
                />
              </AppTooltip>

              <AppTooltip
                text="Необходимо согласие на обработку персональных данных"
                type="error"
                :show="agreeError"
              >
                <AppCheckbox
                  v-model="agree"
                  size="S"
                  :value="1"
                  label="Согласен(-на) с обработкой персональных данных"
                />
              </AppTooltip>

              <AppTooltip
                :text="submitError"
                type="error"
                :show="!!submitError"
                @update:show="(value) => (submitError = value ? submitError : '')"
              >
                <AppButton
                  variant="primary"
                  :content="buttonContent"
                  :disabled="buttonDisabled"
                  custom-class="w-full mt-1"
                  @click="handleSubmit"
                />
              </AppTooltip>
            </div>
          </div>

          <!-- Информационный блок снизу с отступом -->
          <div class="mt-4 rounded-[16px] border border-[#E3E0DD] bg-[#FFFFFA] px-5 py-4">
            <p class="text-sm font-light text-[#5E5B58]">
              1500 приветственных бонусов будут начислены на карту лояльности после регистрации.
            </p>
          </div>
        </template>

        <!-- Подтверждение телефона по СМС -->
        <template v-else-if="view === 'sms'">
          <div class="rounded-[20px] border border-[#E3E0DD] bg-[#FFFFFA] p-6 sm:p-8">
            <span class="text-[11px] uppercase tracking-[0.08em] text-[#8C8785]">Подтверждение номера</span>
            <h1 class="mt-2 text-[26px] font-normal leading-tight sm:text-[28px]">Введите код из СМС</h1>
            <p class="mt-2 text-sm font-light text-[#5E5B58]">
              Мы отправили код подтверждения на номер
              <span class="text-[#211D1D]">{{ phone?.code }} {{ phone?.phone }}</span>.
            </p>

            <div class="mt-6 flex flex-col gap-5">
              <AppTooltip
                text="Это поле обязательно для заполнения"
                type="error"
                :show="smsRef?.showError"
              >
                <AppInput
                  id="sms"
                  ref="smsRef"
                  v-model="sms"
                  type="text"
                  label="Код из СМС"
                  required
                  custom-class="w-full"
                />
              </AppTooltip>

              <AppTooltip
                :text="smsError"
                type="error"
                :show="!!smsError"
                @update:show="(value) => (smsError = value ? smsError : '')"
              >
                <AppButton
                  variant="primary"
                  :content="smsButtonContent"
                  :disabled="smsButtonDisabled"
                  custom-class="w-full mt-1"
                  @click="handleConfirmSms"
                />
              </AppTooltip>

              <span
                v-if="remainingSeconds > 0"
                class="self-center text-center text-xs font-light text-[#211D1D]"
              >
                Запросить код повторно<br>
                можно через <span class="font-normal">{{ remainingSeconds }} секунд</span>
              </span>
              <span
                v-else
                class="cursor-pointer self-center text-center text-xs font-light text-[#211D1D]"
                :class="{ 'cursor-not-allowed opacity-50': resendLoading }"
                @click="handleResendSms"
              >
                {{ resendLoading ? "Отправка..." : "Отправить ещё раз" }}
              </span>
            </div>
          </div>
        </template>

        <!-- Готово: бонусы начислены -->
        <template v-else-if="view === 'success'">
          <div class="rounded-[20px] border border-[#E3E0DD] bg-[#FFFFFA] p-8 text-center">
            <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F1EAB6]">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#211D1D"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 12.5l5 5L20 6.5" />
              </svg>
            </div>
            <h1 class="mt-6 text-[24px] font-normal">Готово</h1>
            <p class="mt-4 text-sm font-light leading-relaxed text-[#5E5B58]">
              Ваша карта лояльности создана.<br>
              1500 бонусов уже начислены<br>
              и ждут вашего визита.
            </p>
            <AppButton
              variant="primary"
              content="Перейти к покупкам"
              custom-class="w-full mt-8"
              @click="goToCatalog"
            />
          </div>
        </template>

        <!-- Телефон уже есть — нужно авторизоваться -->
        <template v-else-if="view === 'exists'">
          <div class="rounded-[20px] border border-[#E3E0DD] bg-[#FFFFFA] p-8 text-center">
            <h1 class="text-[24px] font-normal">Почти готово</h1>
            <p class="mt-4 text-sm font-light leading-relaxed text-[#5E5B58]">
              Такой номер телефона уже есть на сайте.<br>
              Авторизуйтесь, чтобы получить бонусы.
            </p>
            <AppButton
              variant="primary"
              content="Войти и получить бонусы"
              custom-class="w-full mt-8"
              @click="openAuth"
            />
          </div>
        </template>

        <!-- Бонус уже получен — только висячий блок с текстом из message -->
        <template v-else>
          <div class="rounded-[16px] border border-[#E3E0DD] bg-[#FFFFFA] px-5 py-4 text-center">
            <p class="text-sm font-light text-[#5E5B58]">
              {{ bonusMessage || "Вы уже получали бонус." }}
            </p>
          </div>
        </template>
        </div>
      </div>

      <!-- Ссылки снизу -->
      <div class="mt-auto flex flex-col items-center gap-2 pt-14 text-center">
        <NuxtLink
          to="/info/confidence/"
          class="text-sm font-light text-[#211D1D] hover:underline"
        >
          Политика конфиденциальности
        </NuxtLink>
        <NuxtLink
          to="/info/confidence/"
          class="text-sm font-light text-[#211D1D] hover:underline"
        >
          Согласие на получение рекламных рассылок
        </NuxtLink>
        <NuxtLink
          to="/info/confidence/"
          class="text-sm font-light text-[#211D1D] hover:underline"
        >
          Согласие на обработку персональных данных
        </NuxtLink>
        <span class="mt-6 text-sm font-light text-[#211D1D]">CASA AL MARE © 2026</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
video {
  display: block !important;
}
</style>
