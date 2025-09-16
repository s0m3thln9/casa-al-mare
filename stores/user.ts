import { Preferences } from "@capacitor/preferences"

interface UserData {
  token: string

  [key: string]: unknown
}

export const useUserStore = defineStore("user", () => {
  const user = useState<UserData | null>("user", () => null)
  const token = useState<string>("token", () => "")

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
    if (!token.value) await loadToken()

    const userData: UserData = await $fetch("https://swimwear.kyokata.wtf/api/testUser", {
      method: "POST",
      body: JSON.stringify({ token: token.value }),
    })

    user.value = userData
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
