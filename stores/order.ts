export type CartItem = {
	id: string
	vector: string
	count: number
}

export const useOrderStore = defineStore('order', () => {
	const catalogStore = useCatalogStore()
	const cartItems = ref<CartItem[]>([])
	const deliveryMethod = ref<string | null>(null)
	const showErrorDeliveryMethod = ref<boolean>(false)
	const name = ref('')
	const showErrorName = ref<boolean>(false)
	const surname = ref('')
	const showErrorSurname = ref<boolean>(false)
	const phone = ref('')
	const showErrorPhone = ref<boolean>(false)
	const email = ref('')
	const showErrorEmail = ref<boolean>(false)
	const paymentMethod = ref<string | null>(null)
	const showErrorPaymentMethod = ref<boolean>(false)
	const addresses = ref<string[]>([
		'Ул. Заречная, дом 19, кв. 5',
		'Ул. Октябрьская, дом 32, к. 4, офис 219'
	])
	const city = ref<string | null>(null)
	const currentAddress = ref<string | null>(null)
	const newAddressFirstLine = ref('')
	const newAddressSecondLine = ref('')
	const commentForCourier = ref('')
	const isExpandedPromo = ref(false)
	const isExpandedCert = ref(false)
	const isPaymentSuccessful = ref<boolean | null>(null)
	const promocode = ref('')
	const promocodeCheckbox = ref<string | null>(null)
	const certificate = ref('')
	const certificateCheckbox = ref<string | null>(null)
	const certificateSum = ref('')
	
	const totalSum = computed(() => {
		return cartItems.value.reduce((sum, cartItem) => {
			const product = catalogStore.items.find(p => p.id === cartItem.id)
			if (!product) return sum
			const vectorData = product.vector[cartItem.vector]
			if (!vectorData) return sum
			return sum + vectorData.price * cartItem.count
		}, 0)
	})
	
	const totalOldSum = computed(() => {
		return cartItems.value.reduce((sum, cartItem) => {
			const product = catalogStore.items.find(p => p.id === cartItem.id)
			if (!product) return sum
			const vectorData = product.vector[cartItem.vector]
			if (!vectorData) return sum
			return sum + vectorData.oldPrice * cartItem.count
		}, 0)
	})
	
	const cartDetailed = computed(() => {
		return cartItems.value.map(cartItem => {
			const product = catalogStore.items.find(p => p.id === cartItem.id)
			const vectorData = product?.vector?.[cartItem.vector]
			const [colorKey, size] = cartItem.vector.split('_')
			const colorData = product?.colors?.[colorKey]
			
			return {
				id: cartItem.id,
				vector: cartItem.vector,
				count: cartItem.count,
				name: product?.name || '',
				color: colorData?.name || '',
				images: colorData?.images?.map(id => product?.images?.[id]) || [],
				size,
				price: vectorData?.price ?? 0,
				oldPrice: vectorData?.oldPrice ?? 0
			}
		})
	})
	
	
	function setCartItems(items: CartItem[] | null | undefined) {
		cartItems.value = Array.isArray(items) ? items : []
	}
	
	function clearCart() {
		cartItems.value = []
	}
	
	function removeItemFromCart(id: string, vector: string) {
		cartItems.value = cartItems.value.filter(
			item => !(item.id === id && item.vector === vector)
		)
	}
	
	function incrementQuantity(id: string, vector: string) {
		const item = cartItems.value.find(i => i.id === id && i.vector === vector)
		if (item) {
			item.count++
		}
	}
	
	function decrementQuantity(id: string, vector: string) {
		const item = cartItems.value.find(i => i.id === id && i.vector === vector)
		if (item && item.count > 1) {
			item.count--
		}
	}
	
	function saveNewAddress() {
		let newAddress = `${newAddressFirstLine.value}, ${newAddressSecondLine.value}`
		if (newAddressSecondLine.value.trim() === '') {
			newAddress = newAddressFirstLine.value
		}
		addresses.value.push(newAddress)
		currentAddress.value = newAddress
		newAddressFirstLine.value = ''
		newAddressSecondLine.value = ''
	}
	
	function togglePromo() {
		isExpandedPromo.value = !isExpandedPromo.value
	}
	
	function toggleCert() {
		isExpandedCert.value = !isExpandedCert.value
	}
	
	return {
		cartItems,
		cartDetailed,
		setCartItems,
		clearCart,
		removeItemFromCart,
		incrementQuantity,
		decrementQuantity,
		deliveryMethod,
		showErrorDeliveryMethod,
		paymentMethod,
		showErrorPaymentMethod,
		addresses,
		city,
		currentAddress,
		newAddressFirstLine,
		newAddressSecondLine,
		commentForCourier,
		isExpandedPromo,
		isExpandedCert,
		promocode,
		promocodeCheckbox,
		certificate,
		certificateCheckbox,
		certificateSum,
		name,
		showErrorName,
		surname,
		showErrorSurname,
		phone,
		showErrorPhone,
		email,
		showErrorEmail,
		totalSum,
		totalOldSum,
		isPaymentSuccessful,
		saveNewAddress,
		togglePromo,
		toggleCert
	}
})