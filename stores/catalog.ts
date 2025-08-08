export const useCatalogStore = defineStore('catalog', () => {
	const desktopStrokeCardCount = ref<string>('4')
	const mobileStrokeCardCount = ref<string>('2')
	
	return {
		desktopStrokeCardCount,
		mobileStrokeCardCount
	}
})