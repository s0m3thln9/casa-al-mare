interface PhoneNumber {
  code: string | null
  phone: string
  country: string | null
}

export const useAuthStore = defineStore("auth", () => {
  const email = ref<string>("")
  const emailButtonContent = ref<string>("Войти")
  const emailButtonDisabled = ref<boolean>(true)
  const emailReg = ref<string>("")
  const method = ref<string>("По телефону")
  const type = ref<string>("Авторизация")
  const password = ref<string>("")
  const phone = ref<PhoneNumber | null>(null)
  const tel = ref<PhoneNumber | null>(null)
  const phoneButtonContent = ref<string>("Отправить СМС-код")
  const phoneButtonDisabled = ref<boolean>(true)
  const phoneReg = ref<PhoneNumber | null>(null)
  const sms = ref<string>("")
  const smsError = ref<string>("")
  const smsError2 = ref<string>("")
  const regError = ref<string>("")
  const smsStep = ref<boolean>(false)
  const regStep = ref<boolean>(false)
  const smsButtonContent = ref<string>("Подтвердить")
  const smsButtonDisabled = ref<boolean>(true)
  const name = ref<string>("")
  const surname = ref<string>("")
  const regButtonContent = ref<string>("Зарегистрироваться")
  const regButtonDisabled = ref<boolean>(true)
  const isAuth = ref<boolean>(false)
  const resetEmail = ref<string>("")
  const resetButtonContent = ref<string>("Отправить письмо")
  const resetButtonDisabled = ref<boolean>(true)
  const resetError = ref<string>("")
  const resendLoading = ref<boolean>(false)
  
  const userStore = useUserStore()
  
  const resetForm = () => {
    email.value = ''
    password.value = ''
    phone.value = null
    phoneReg.value = null
    sms.value = ''
    name.value = ''
    surname.value = ''
    emailReg.value = ''
    resetEmail.value = ''

    smsError.value = ''
    smsError2.value = ''
    regError.value = ''
    resetError.value = ''
    
    smsStep.value = false
    regStep.value = false
    smsButtonContent.value = 'Подтвердить'
    smsButtonDisabled.value = true
    phoneButtonContent.value = 'Отправить СМС-код'
    phoneButtonDisabled.value = true
    emailButtonContent.value = 'Войти'
    emailButtonDisabled.value = true
    regButtonContent.value = 'Зарегистрироваться'
    regButtonDisabled.value = true
    resetButtonContent.value = 'Отправить письмо'
    resetButtonDisabled.value = true

    method.value = 'По телефону'
    type.value = 'Авторизация'
    resendLoading.value = false
  }
  
  watch(
    phone,
    () => {
      phoneButtonDisabled.value = !phone.value
    },
    { immediate: true },
  )
  
  watch(
    [email, password],
    () => {
      emailButtonDisabled.value = !email.value && !password.value
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
  
  watch(
    resetEmail,
    () => {
      resetButtonDisabled.value = !resetEmail.value
    },
    { immediate: true },
  )
  
  watchEffect(() => {
    isAuth.value = (userStore.user?.uid as number) > 0
  })
  
  return {
    email,
    emailButtonContent,
    emailButtonDisabled,
    emailReg,
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
    regError,
    smsStep,
    regStep,
    smsButtonContent,
    smsButtonDisabled,
    name,
    surname,
    regButtonContent,
    regButtonDisabled,
    isAuth,
    resetEmail,
    resetButtonContent,
    resetButtonDisabled,
    resetError,
    resendLoading,
    resetForm,
  }
})