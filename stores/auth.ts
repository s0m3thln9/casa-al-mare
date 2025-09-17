export const useAuthStore = defineStore("auth", () => {
  const isAuth = ref(false)
  const method = ref("По телефону")
  const phone = ref("")
  const email = ref("")
  const password = ref("")

  const login = () => {
    isAuth.value = true
  }
  const logout = () => {
    isAuth.value = false
  }

  const phoneButtonState = computed(() => ({
    content: method.value === "По телефону" ? "Отправить СМС-код" : "Войти",
    disabled: !phone.value,
  }))

  const emailButtonState = computed(() => ({
    content: method.value === "По почте" ? "Войти" : "Войти",
    disabled: !email.value,
  }))

  return { isAuth, method, phone, email, password, phoneButtonState, emailButtonState, login, logout }
})
