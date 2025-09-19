export const useAuthStore = defineStore("auth", () => {
  const email = ref("")
  const emailButtonContent = ref("Войти")
  const emailButtonDisabled = ref(true)
  const isAuth = ref(false)
  const isSending = ref(false)
  const method = ref("По телефону")
  const password = ref("")
  const phone = ref<{ code: string | null; phone: string; country: string | null } | null>(null)
  const phoneButtonContent = ref("Отправить СМС-код")
  const phoneButtonDisabled = ref(true)
  const sms = ref("")
  const smsError = ref("")
  const smsError2 = ref("")
  const smsStep = ref(false)
  const smsButtonContent = ref("Отправить СМС-код")
  const smsButtonDisabled = ref(true)

  const login = () => {
    isAuth.value = true
  }

  const logout = () => {
    isAuth.value = false
  }

  watch(
    phone,
    () => {
      phoneButtonDisabled.value = !phone.value
    },
    { immediate: true },
  )

  watch(
    email,
    () => {
      emailButtonDisabled.value = !email.value
    },
    { immediate: true },
  )

  watch(
    sms,
    () => {
      smsButtonDisabled.value = !sms.value
    },
    { immediate: true },
  )

  return {
    email,
    emailButtonContent,
    emailButtonDisabled,
    isAuth,
    isSending,
    method,
    password,
    phone,
    phoneButtonContent,
    phoneButtonDisabled,
    sms,
    smsError,
    smsError2,
    smsStep,
    smsButtonContent,
    smsButtonDisabled,
    login,
    logout,
  }
})
