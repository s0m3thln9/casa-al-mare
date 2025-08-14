export interface CartItem {
	id: number
	name: string
	top: string
	bottom: string
	color: string
	img: string
	price: number
	count: number
}

export interface UserInfo {
	name: string
	surname: string
	phone: string
	email: string
}

export const useOrderStore = defineStore('order', () => {
	const cartItems = ref<CartItem[]>([
		{ id: 1, bottom: 'XS', color: 'Цвет', img: '/order.jpg', count: 2, name: 'Название', top: 'XS', price: 10000 },
		{ id: 2, bottom: 'XS', color: 'Цвет', img: '/order.jpg', count: 2, name: 'Название', top: 'XS', price: 10000 }
	])
	const deliveryMethod = ref<string | null>(null)
	const showErrorDeliveryMethod = ref<boolean>(false)
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
	const userInfo = ref<UserInfo>({ name: '', surname: '', phone: '', email: '' })
	const isPaymentSuccessful = ref<boolean | null>(null)
	const promocode = ref('')
	const promocodeCheckbox = ref<string | null>(null)
	const certificate = ref('')
	const certificateCheckbox = ref<string | null>(null)
	const certificateSum = ref('')
	
	const totalSum = computed(() => {
		return cartItems.value.reduce((sum, item) => sum + item.price * item.count, 0)
	})
	
	function removeItemFromCart(id: number) {
		cartItems.value = cartItems.value.filter(item => item.id !== id)
	}
	
	function incrementQuantity(id: number) {
		const item = cartItems.value.find(item => item.id === id)
		if (item) {
			item.count++
		}
	}
	
	function decrementQuantity(id: number) {
		const item = cartItems.value.find(item => item.id === id)
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
		userInfo,
		totalSum,
		isPaymentSuccessful,
		promocode,
		promocodeCheckbox,
		certificate,
		certificateCheckbox,
		certificateSum,
		removeItemFromCart,
		incrementQuantity,
		decrementQuantity,
		saveNewAddress,
		togglePromo,
		toggleCert,
	}
})