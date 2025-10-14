import { defineStore } from "pinia"
import type { EditUserResponse } from "~/pages/profile/index.vue"

interface ProfileData {
  email: string
  name: string
  surname: string
  phone: string
  day: string
  month: string
  year: string
  adr1: string
  adr2: string
  adr3: string
}

export const useProfileStore = defineStore("profile", () => {
  const userStore = useUserStore()

  const resetButtonContent = ref("Сменить пароль")
  const resetButtonDisabled = ref(false)
  const resetMessage = ref("")
  const resetMessageType = ref<"error" | "info">("error")
  const isResetLoading = ref(false)

  const profileData = ref<ProfileData>({
    email: "",
    name: "",
    surname: "",
    phone: "",
    day: "1",
    month: "Январь",
    year: "1980",
    adr1: "",
    adr2: "",
    adr3: "",
  })

  const isSaving = ref(false)
  const saveError = ref("")
  const buttonContent = ref("Сохранить")

  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ]
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => String(1980 + i))

  const days = computed(() => {
    const monthIndex = months.indexOf(profileData.value.month)
    const yearNum = parseInt(profileData.value.year)
    if (isNaN(monthIndex) || isNaN(yearNum)) return []
    const daysInMonth = new Date(yearNum, monthIndex + 1, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => String(i + 1))
  })

  async function resetPassword(): Promise<boolean> {
    const email = profileData.value.email.trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      resetMessage.value = "Неверный email"
      resetMessageType.value = "error"
      resetButtonContent.value = "Попробовать снова"
      resetButtonDisabled.value = false
      isResetLoading.value = false
      return false
    }

    isResetLoading.value = true
    resetButtonContent.value = "Отправка..."
    resetButtonDisabled.value = true
    resetMessage.value = ""

    try {
      const { data: responseData, error: fetchError } = await useFetch(
        "https://back.casaalmare.com/api/resetPassword",
        {
          method: "POST",
          body: { email },
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      isResetLoading.value = false

      if (fetchError.value) {
        console.error("Fetch error details:", fetchError.value)
        resetMessage.value = fetchError.value.data?.message || fetchError.value.message || "Ошибка сети или сервера"
        resetMessageType.value = "error"
        resetButtonContent.value = "Попробовать снова"
        resetButtonDisabled.value = false
        return false
      }

      const data = responseData.value
      if (data?.success) {
        resetMessage.value = `Письмо отправлено на ${email}`
        resetMessageType.value = "info"
        resetButtonContent.value = "Письмо отправлено"
        resetButtonDisabled.value = false

        setTimeout(() => {
          resetButtonContent.value = "Сменить пароль"
          resetMessage.value = ""
        }, 3000)
        return true
      } else {
        resetMessage.value = data?.error ?? "Неизвестная ошибка"
        resetMessageType.value = "error"
        resetButtonContent.value = "Попробовать снова"
        resetButtonDisabled.value = false
        return false
      }
    } catch (err) {
      console.error("Unexpected error in resetPassword:", err)
      resetMessage.value = "Ошибка сети или сервера"
      resetMessageType.value = "error"
      resetButtonContent.value = "Попробовать снова"
      resetButtonDisabled.value = false
      isResetLoading.value = false
      return false
    }
  }

  const loadProfile = async () => {
    await userStore.fetchUser()
    if (userStore.user?.profile) {
      const profile = userStore.user.profile

      profileData.value.email = profile.email || ""

      const fullNameParts = (profile.fullname || "").trim().split(" ")
      profileData.value.name = fullNameParts[0] || ""
      profileData.value.surname = fullNameParts.slice(1).join(" ") || ""

      profileData.value.phone = profile.phone || ""

      if (profile.birthdate) {
        const date = new Date(profile.birthdate)
        if (!isNaN(date.getTime())) {
          profileData.value.day = String(date.getDate())
          profileData.value.month = months[date.getMonth()] || "Январь"
          profileData.value.year = String(date.getFullYear())
        }
      }

      if (profile.address) {
        const addressParts = (profile.address || "").split(", ")
        profileData.value.adr1 = addressParts[0] || ""
        profileData.value.adr2 = addressParts[1] || ""
        profileData.value.adr3 = addressParts.slice(2).join(", ") || ""
      }
    }
  }

  const saveProfile = async (): Promise<boolean> => {
    const token = await userStore.loadToken()
    if (!token) {
      saveError.value = "Токен не найден"
      isSaving.value = false
      return false
    }

    const fullName = `${profileData.value.name.trim()} ${profileData.value.surname.trim()}`.trim()
    const birthdateStr = `${profileData.value.year}-${String(months.indexOf(profileData.value.month) + 1).padStart(2, "0")}-${profileData.value.day.padStart(2, "0")}`
    const date = new Date(birthdateStr)
    const fullAddress =
      `${profileData.value.adr1.trim()}, ${profileData.value.adr2.trim()}${profileData.value.adr3.trim() ? ", " + profileData.value.adr3.trim() : ""}`.trim()

    const body: any = { token }

    if (fullName) body.fullname = fullName
    if (!isNaN(date.getTime()) && profileData.value.day && profileData.value.month && profileData.value.year) {
      body.birthdate = birthdateStr
    }
    if (fullAddress) body.address = fullAddress

    if (Object.keys(body).length <= 1) {
      saveError.value = "Нет данных для обновления"
      return false
    }

    isSaving.value = true
    saveError.value = ""
    buttonContent.value = "Сохранение..."

    try {
      const { data, error } = await useFetch<EditUserResponse>("https://back.casaalmare.com/api/editUser", {
        method: "POST",
        body: JSON.stringify(body),
      })

      if (error.value || !data.value?.success) {
        saveError.value = data.value?.error || "Неизвестная ошибка сервера"
        buttonContent.value = "Попробовать снова"
        return false
      }

      if (userStore.user?.profile) {
        if (fullName) userStore.user.profile.fullname = fullName
        if (!isNaN(date.getTime())) userStore.user.profile.birthdate = birthdateStr
        if (fullAddress) userStore.user.profile.address = fullAddress
      }
      console.log("Профиль обновлен:", data.value.changes)
      buttonContent.value = "Сохранено!"
      return true
    } catch (err) {
      saveError.value = "Ошибка сети или сервера"
      buttonContent.value = "Попробовать снова"
      console.error("Ошибка API editUser:", err)
      return false
    } finally {
      isSaving.value = false
    }
  }

  return {
    profileData,
    months,
    years,
    days,
    resetButtonContent,
    resetButtonDisabled,
    resetMessage,
    resetMessageType,
    isResetLoading,
    resetPassword,
    loadProfile,
    saveProfile,
    isSaving,
    saveError,
    buttonContent,
  }
})
