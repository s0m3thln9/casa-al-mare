type FavoriteId = string

export const useFavoritesStore = defineStore("favorites", () => {
  const favorites = ref<FavoriteId[]>([])
  const userStore = useUserStore()

  const syncFavorites = async () => {
    const token = await userStore.loadToken()
    const response = await $fetch("https://swimwear.kyokata.wtf/api/getFavorites", {
      method: "POST",
      body: JSON.stringify({ token }),
    })

    if (response.success) {
      favorites.value = response.favorites
    } else {
      console.error("Ошибка при загрузке избранного:", response.message)
    }
  }

  const toggleFavorite = async (id: string) => {
    const token = await userStore.loadToken()
    const response = await $fetch("https://swimwear.kyokata.wtf/api/addOrRemoveFavorites", {
      method: "POST",
      body: JSON.stringify({ id, token }),
    })

    if (response.success) {
      await syncFavorites()
    } else {
      console.error("Ошибка при обновлении избранного:", response.message)
    }
  }

  const isFavorite = (id: string) => favorites.value.includes(id)

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    syncFavorites,
  }
})
