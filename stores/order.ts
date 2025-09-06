type Item = {
	id: string
	name: string
	color: string
	images: string[]
	sliderImages: string[]
	price: number
	oldPrice: number
	type: string
	material: string
	useType: string
	pantsType?: string
}

export type CartItem = Item & {
	count: number
}

export type UserInfo = {
	name: string
	surname: string
	phone: string
	email: string
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
		return cartItems.value.reduce((sum, item) => sum + item.price * item.count, 0)
	})
	
	const totalOldSum = computed(() => {
		return cartItems.value.reduce((sum, item) => sum + item.oldPrice * item.count, 0)
	})
	
	function removeItemFromCart(id: string) {
		cartItems.value = cartItems.value.filter(item => item.id !== id)
	}
	
	function incrementQuantity(id: string) {
		const item = cartItems.value.find(item => item.id === id)
		if (item) {
			item.count++
		}
	}
	
	function decrementQuantity(id: string) {
		const item = cartItems.value.find(item => item.id === id)
		if (item && item.count > 1) {
			item.count--
		}
	}
	
	const addToCart = (id: string) => {
		const existingItem = cartItems.value.find(item => item.id === id)
		if (existingItem) {
			existingItem.count += 1
		} else {
			const item = catalogStore.items.find(item => item.id === id)
			if (item) {
				cartItems.value.push({...item, count: 1})
			}
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
		promocode,
		promocodeCheckbox,
		certificate,
		certificateCheckbox,
		certificateSum,
		removeItemFromCart,
		incrementQuantity,
		decrementQuantity,
		addToCart,
		saveNewAddress,
		togglePromo,
		toggleCert,
	}
})