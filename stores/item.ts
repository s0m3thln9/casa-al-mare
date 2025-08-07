export const useItemStore = defineStore('item', () => {
	const color = ref<string | null>(null)
	const top = ref<string | null>(null)
	const bottom = ref<string | null>(null)
	const pantsType = ref<string | null>(null)
	
	const canAddToCart = computed(() => {
		return color.value !== null && top.value !== null && bottom.value !== null && pantsType.value !== null
	})
	
	return {
		color,
		top,
		bottom,
		pantsType,
		canAddToCart
	}
})