type FavoriteId = number

export const useFavoritesStore = defineStore("favorites", () => {
  const favorites = ref<FavoriteId[]>([])
  const userStore = useUserStore()

  const syncFavorites = async () => {
    const token = await userStore.loadToken()
    const response = await $fetch("https://back.casaalmare.com/api/getFavorites", {
      method: "POST",
      body: JSON.stringify({ token }),
    })

    if (response.success) {
      favorites.value = response.favorites
    } else {
      console.error("Ошибка при загрузке избранного:", response.message)
    }
  }

  const toggleFavorite = async (id: number) => {
    const token = await userStore.loadToken()

    // Сохраняем предыдущее состояние для возможного отката
    const wasFavorite = favorites.value.includes(id)

    // Немедленно обновляем локальное состояние
    if (wasFavorite) {
      favorites.value = favorites.value.filter((favId) => favId !== id)
    } else {
      favorites.value = [...favorites.value, id]
    }

    try {
      const response = await $fetch("https://back.casaalmare.com/api/addOrRemoveFavorites", {
        method: "POST",
        body: JSON.stringify({ id, token }),
      })

      if (!response.success) {
        // Если сервер вернул ошибку - откатываем изменения
        if (wasFavorite) {
          favorites.value = [...favorites.value, id]
        } else {
          favorites.value = favorites.value.filter((favId) => favId !== id)
        }
        console.error("Ошибка при обновлении избранного:", response.message)
        throw new Error(response.message)
      }
    } catch (error) {
      // В случае ошибки сети или сервера - откатываем изменения
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
