import { Preferences } from "@capacitor/preferences"
import type { TestUser, User } from "~/types"

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null)
  const token = ref("")
  const favoritesStore = useFavoritesStore()

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
    const response = await $fetch<TestUser>("https://back.casaalmare.com/api/testUser", {
      method: "POST",
      body: JSON.stringify({ token: token.value }),
    })

    const { token: userToken, ...userData } = response

    if (user.value) {
      Object.assign(user.value, userData)
    } else {
      user.value = userData
    }

    if (userToken) await saveToken(userToken)

    await favoritesStore.syncFavorites()
  }

  const logout = async (): Promise<void> => {
    await removeToken()
    user.value = null

    await navigateTo("/")

    if (import.meta.client) {
      window.location.reload()
    }
  }

  return {
    user,
    token,
    loadToken,
    saveToken,
    removeToken,
    fetchUser,
    logout,
  }
})
