import { Preferences } from "@capacitor/preferences"

interface UserData {
  [key: string]: unknown
}

export const useUserStore = defineStore("user", () => {
  const user = ref<UserData | null>(null)
  const token = ref("")

  const loadToken = async (): Promise<string> => {
    if (import.meta.client) {
      const { value } = await Preferences.get({ key: "token" })
      token.value = value || ""
    }
    return token.value
  }

  const saveToken = async (newToken: string): Promise<void> => {
    token.value = newToken
    if (import.meta.client) {
      await Preferences.set({ key: "token", value: newToken })
    }
  }

  const removeToken = async (): Promise<void> => {
    token.value = ""
    if (import.meta.client) {
      await Preferences.set({ key: "token", value: "" })
    }
  }

  const fetchUser = async (): Promise<void> => {
    const userData: UserData = await $fetch("https://swimwear.kyokata.wtf/api/testUser", {
      method: "POST",
      body: JSON.stringify({ token: token.value }),
    })
    
    if (user.value) {
      Object.assign(user.value, userData)
    } else {
      user.value = userData
    }
    
    if (userData?.token) await saveToken(userData.token)
  }

  return {
    user,
    token,
    loadToken,
    saveToken,
    removeToken,
    fetchUser,
  }
})
