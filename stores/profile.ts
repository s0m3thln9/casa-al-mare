import { defineStore } from "pinia"
import type { CityData, EditUser, ProfileData, ProfileExtended, ResetPassword } from "~/types"

interface Body {
  token: string
  fullname: string
  birthdate: string
  address: string[]
  city: CityData
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
    city: {} as CityData,
  })

  const originalProfileData = ref<ProfileData | null>(null)

  const hasChanges = computed(() => {
    if (!originalProfileData.value) return false
    return JSON.stringify(profileData.value) !== JSON.stringify(originalProfileData.value)
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
      const data = await $fetch<ResetPassword>("https://back.casaalmare.com/api/resetPassword", {
        method: "POST",
        body: { email },
        headers: {
          "Content-Type": "application/json",
        },
      })

      isResetLoading.value = false

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
    } catch (err: unknown) {
      console.error("Unexpected error in resetPassword:", err)
      isResetLoading.value = false
      resetMessage.value = (err as string) || "Ошибка сети или сервера"
      resetMessageType.value = "error"
      resetButtonContent.value = "Попробовать снова"
      resetButtonDisabled.value = false
      return false
    }
  }

  const loadProfile = async () => {
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

      if (profile.extended?.city) {
        profileData.value.city = profile.extended.city || {}
      } else {
        profileData.value.city = {} as CityData
      }

      if (profile.address && Array.isArray(profile.address)) {
        profileData.value.adr1 = profile.address[0] || ""
        profileData.value.adr2 = profile.address[1] || ""
      } else if (
        profile.extended.addresses &&
        Array.isArray(profile.extended.addresses) &&
        profile.extended.addresses.length > 0
      ) {
        const mainAddress = profile.extended.addresses[0]
        if (Array.isArray(mainAddress)) {
          profileData.value.adr1 = mainAddress[0] || ""
          profileData.value.adr2 = mainAddress[1] || ""
        }
      } else {
        profileData.value.adr1 = ""
        profileData.value.adr2 = ""
      }

      originalProfileData.value = { ...profileData.value }
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

    const address = [profileData.value.adr1.trim(), profileData.value.adr2.trim()]

    const body: Body = {} as Body
    body.token = token

    if (fullName) body.fullname = fullName
    if (!isNaN(date.getTime()) && profileData.value.day && profileData.value.month && profileData.value.year) {
      body.birthdate = birthdateStr
    }
    if (address[0]) body.address = address
    if (profileData.value.city && Object.keys(profileData.value.city).length > 0) body.city = profileData.value.city

    if (Object.keys(body).length <= 1) {
      saveError.value = "Нет данных для обновления"
      return false
    }

    isSaving.value = true
    saveError.value = ""
    buttonContent.value = "Сохранение..."

    try {
      const data = await $fetch<EditUser>("https://back.casaalmare.com/api/editUser", {
        method: "POST",
        body,
      })

      if (!data?.success) {
        saveError.value = data?.error || "Неизвестная ошибка сервера"
        buttonContent.value = "Попробовать снова"
        isSaving.value = false
        return false
      }

      if (userStore.user?.profile) {
        if (fullName) userStore.user.profile.fullname = fullName
        if (!isNaN(date.getTime())) userStore.user.profile.birthdate = birthdateStr
        if (address[0]) {
          userStore.user.profile.address = address
        }
        if (profileData.value.city && Object.keys(profileData.value.city).length > 0) {
          if (!userStore.user.profile.extended) userStore.user.profile.extended = {} as ProfileExtended
          if (!userStore.user.profile.extended.city) userStore.user.profile.extended.city = {} as CityData
          userStore.user.profile.extended.city = profileData.value.city
        }
      }

      originalProfileData.value = { ...profileData.value }

      buttonContent.value = "Сохранено!"
      isSaving.value = false
      return true
    } catch (err: unknown) {
      saveError.value = (err as string) || "Ошибка сети или сервера"
      buttonContent.value = "Попробовать снова"
      console.error("Ошибка API editUser:", err)
      isSaving.value = false
      return false
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
    hasChanges,
  }
})
