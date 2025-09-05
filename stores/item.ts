export const useItemStore = defineStore('item', () => {
	const color = ref<string | null>(null)
	const size = ref<string | null>(null)
	const pantsType = ref<string | null>(null)
	
	const canAddToCart = computed(() => {
		return color.value !== null && size.value !== null
	})
	
	return {
		color,
		size,
		pantsType,
		canAddToCart
	}
})