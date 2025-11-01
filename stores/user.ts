import { Preferences } from "@capacitor/preferences"

interface Certificate {
  id: number
  code: string
  value: number
  value_now: number
}

interface UserExtended {
  addresses: string[]
}

interface CityData {
  label: string
  name: string
  kladr: string
  fias: string
  region?: string
}

export interface User {
  uid: number
  points: number
  certificates: Certificate[]
  orders?: {
    orderId: number
    cart: Record<string, import("~/stores/order").CartItem>
    order: {
      order_cost?: number
      deliveryMethod: string
      paymentMethod: string
      currentAddress?: string
    }
    status: number
    orderDate: string
    deliveryDate: string
  }[]
  profile: {
    fullname: string
    phone: string
    email: string
    address: string[] // Новый формат [adr1, adr2]
    birthdate: string
    extended: {
      city?: CityData
    }
    [key: string]: any
  }
  addresses: string[][] // Новый формат: массив массивов [adr1, adr2]
  extended?: UserExtended
  token?: string
}

export interface UserStore {
  user: Ref<User | null>
  token: Ref<string>
  loadToken: () => Promise<string>
  saveToken: (newToken: string) => Promise<void>
  removeToken: () => Promise<void>
  fetchUser: () => Promise<void>
  logout: () => Promise<void>
}

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
    const response: Partial<User> & { token?: string } = await $fetch("https://back.casaalmare.com/api/testUser", {
      method: "POST",
      body: JSON.stringify({ token: token.value }),
    })

    const { token: userToken, ...userData } = response

    if (user.value) {
      Object.assign(user.value, userData)
    } else {
      user.value = userData as User
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
  } satisfies UserStore
})
