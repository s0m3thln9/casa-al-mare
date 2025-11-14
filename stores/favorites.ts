import type { AddOrRemoveFavorites, GetFavorites } from "~/types"

type FavoriteId = number

export const useFavoritesStore = defineStore("favorites", () => {
  const favorites = ref<FavoriteId[]>([])
  const userStore = useUserStore()

  const syncFavorites = async () => {
    const token = await userStore.loadToken()
    const response = await $fetch<GetFavorites>("https://back.casaalmare.com/api/getFavorites", {
      method: "POST",
      body: JSON.stringify({ token }),
    })

    if (response.success) {
      favorites.value = response.favorites
    } else {
      console.error("Ошибка при загрузке избранного:", response.error)
    }
  }

  const toggleFavorite = async (id: number) => {
    const token = await userStore.loadToken()
    const wasFavorite = favorites.value.includes(id)
    if (wasFavorite) {
      favorites.value = favorites.value.filter((favId) => favId !== id)
    } else {
      favorites.value = [...favorites.value, id]
    }

    try {
      const response = await $fetch<AddOrRemoveFavorites>("https://back.casaalmare.com/api/addOrRemoveFavorites", {
        method: "POST",
        body: JSON.stringify({ id, token }),
      })

      if (!response.success) {
        if (wasFavorite) {
          favorites.value = [...favorites.value, id]
        } else {
          favorites.value = favorites.value.filter((favId) => favId !== id)
        }
      }
    } catch (error) {
      if (wasFavorite) {
        favorites.value = [...favorites.value, id]
      } else {
        favorites.value = favorites.value.filter((favId) => favId !== id)
      }
      console.error("Ошибка при обновлении избранного:", error)
      throw error
    }
  }

  const isFavorite = (id: number) => favorites.value.includes(id)

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    syncFavorites,
  }
})
