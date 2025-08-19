type FavouriteId = string

export const useFavouritesStore = defineStore('favourites', () => {
	const favourites = ref<FavouriteId[]>([])
	
	const toggle = (id: string) => {
		const i = favourites.value.indexOf(id)
		if (i !== -1) {
			favourites.value.splice(i, 1)
		} else {
			favourites.value.push(id)
		}
	}
	
	const isFavourite = (id: string) => favourites.value.includes(id)
	
	return {
		favourites,
		toggle,
		isFavourite,
	}
})
