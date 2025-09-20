export const useAuthStore = defineStore("auth", () => {
  const email = ref("")
  const emailButtonContent = ref("Отправить СМС-код")
  const emailButtonDisabled = ref(true)
  const emailReg = ref("")
  const isSending = ref(false)
  const method = ref("По телефону")
  const type = ref("Авторизация")
  const password = ref("")
  const phone = ref<{ code: string | null; phone: string; country: string | null } | null>(null)
  const tel = ref<{ code: string | null; phone: string; country: string | null } | null>(null)
  const phoneButtonContent = ref("Отправить СМС-код")
  const phoneButtonDisabled = ref(true)
  const phoneReg = ref<{ code: string | null; phone: string; country: string | null } | null>(null)
  const sms = ref("")
  const smsError = ref("")
  const smsError2 = ref("")
  const smsStep = ref(false)
  const smsButtonContent = ref("Подтвердить")
  const smsButtonDisabled = ref(true)
  const name = ref("")
  const surname = ref("")
  const regButtonContent = ref("Отправить СМС-код")
  const regButtonDisabled = ref(true)

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
  
  watch(
    [emailReg, phoneReg, name, surname],
    () => {
      regButtonDisabled.value = !emailReg.value && !phoneReg.value && !name.value && !surname.value
    },
    { immediate: true },
  )

  return {
    email,
    emailButtonContent,
    emailButtonDisabled,
    emailReg,
    isSending,
    method,
    type,
    password,
    phone,
    tel,
    phoneButtonContent,
    phoneButtonDisabled,
    phoneReg,
    sms,
    smsError,
    smsError2,
    smsStep,
    smsButtonContent,
    smsButtonDisabled,
    name,
    surname,
    regButtonContent,
    regButtonDisabled,
  }
})
