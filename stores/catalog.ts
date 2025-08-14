type SortAndFilter = {
	type: string | null,
	color: string | null,
	top: string | null,
	bottom: string | null,
	pantsType: string | null,
	price: string | null,
	priceLimit: string | null,
	material: string | null,
	useType: string | null,
}

export const useCatalogStore = defineStore('catalog', () => {
	const desktopStrokeCardCount = ref<string>('4')
	const mobileStrokeCardCount = ref<string>('2')
	const sortAndFilter = ref<SortAndFilter>({
		type: null,
		color: null,
		top: null,
		bottom: null,
		pantsType: null,
		price: null,
		priceLimit: null,
		material: null,
		useType: null,
	})
	
	const reset = () => {
		for (const key in sortAndFilter.value) {
			sortAndFilter.value[key as keyof SortAndFilter] = null
		}
	}
	
	return {
		desktopStrokeCardCount,
		mobileStrokeCardCount,
		sortAndFilter,
		reset,
	}
})