export const useSetStore = defineStore('set', () => {
	const top = ref<string | null>(null)
	const bottom = ref<string | null>(null)
	const accessory = ref<string | null>(null)
	
	const canAddToCart = computed(() => {
		return top.value !== null && bottom.value !== null && accessory.value !== null
	})
	
	return {
		top,
		bottom,
		accessory,
		canAddToCart
	}
})