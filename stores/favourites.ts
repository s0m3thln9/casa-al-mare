type FavouriteId = string

export const useFavouritesStore = defineStore("favourites", () => {
  const favourites = ref<FavouriteId[]>([])
  const userStore = useUserStore()

  const toggleFavourite = async (id: string, action: "add" | "remove"): Promise<FavouriteId[]> => {
    const token = await userStore.loadToken()
    const response = await $fetch("https://swimwear.kyokata.wtf/api/addOrRemoveFavourite", {
      method: "POST",
      body: JSON.stringify({ id: id, action: action, token: token }),
    })

    if (response.success) {
      return response.favorites
    } else {
      console.error("Ошибка при обновлении избранного:", response.message)
      return []
    }
  }

  const toggle = async (id: string) => {
    const action = favourites.value.includes(id) ? "remove" : "add"
    favourites.value = await toggleFavourite(id, action)
  }

  const isFavourite = (id: string) => favourites.value.includes(id)

  return {
    favourites,
    toggle,
    isFavourite,
  }
})
