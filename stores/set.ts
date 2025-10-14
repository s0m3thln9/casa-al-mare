export const useSetStore = defineStore('set', () => {
	const top = ref<string>('')
	const bottom = ref<string>('')
	const accessory = ref<string>('')
	const topId = ref<number | null>(null)
	const bottomId = ref<number | null>(null)
	const accessoryId = ref<number | null>(null)
	
	const canAddToCart = computed(() => {
		return !!(top.value.trim() && bottom.value.trim() && accessory.value.trim())
	})
	
	const missingParams = computed<"top" | "bottom" | "accessory" | "all" | null>(() => {
		if (canAddToCart.value) return null
		const missing: string[] = []
		if (!top.value.trim()) missing.push('top')
		if (!bottom.value.trim()) missing.push('bottom')
		if (!accessory.value.trim()) missing.push('accessory')
		return missing.length === 3 ? 'all' : (missing[0] as any)
	})
	
	return { top, bottom, accessory, topId, bottomId, accessoryId, canAddToCart, missingParams }
})