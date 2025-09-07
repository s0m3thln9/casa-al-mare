export type CartItem = {
  id: string
  vector: string
  count: number
}

export const useOrderStore = defineStore('order', () => {
  const catalogStore = useCatalogStore()
  const userStore = useUserStore()
	
  const cartItems = ref<CartItem[]>([])
  
  const addresses = ref<string[]>([
    'Ул. Заречная, дом 19, кв. 5',
    'Ул. Октябрьская, дом 32, к. 4, офис 219'
  ])
  const city = ref<string | null>(null)
  const commentForCourier = ref('')
  const currentAddress = ref<string | null>(null)
  const deliveryMethod = ref<string | null>(null)
  const newAddressFirstLine = ref('')
  const newAddressSecondLine = ref('')
  const showErrorDeliveryMethod = ref<boolean>(false)
	
  const isPaymentSuccessful = ref<boolean | null>(null)
  const paymentMethod = ref<string | null>(null)
  const showErrorPaymentMethod = ref<boolean>(false)
	
  const addPromoCodeError = ref('')
  const availablePromoCodes = ref<{ code: string, discount: number }[] | null>([
    { code: '12345678', discount: 10 },
    { code: '87654321', discount: 20 }
  ])
  const currentPromoCodes = ref<{ code: string, discount: number }[]>([])
  const isExpandedPromoCode = ref(false)
  const pendingPromoCode = ref<string | null>(null)
  const promoCode = ref('')
  const selectedPromoCode = ref<string | null>(null)
  const usePromoCodeError = ref('')
	
  const isExpandedPoints = ref(false)
  const pendingPoints = ref('')
  const pointsError = ref('')
  const pointsToUse = ref(0)

  const availableCertificates = ref<{ code: string, sum: number }[]>([
    { code: 'CERT1000', sum: 1000 },
    { code: 'CERT2000', sum: 2000 },
    { code: 'CERT6000', sum: 6000 }
  ])
  const certificateError = ref('')
  const isExpandedCert = ref(false)
  const newCertificateCode = ref('')
  const selectedCertificates = ref<string[]>([])
	
  const email = ref('')
  const name = ref('')
  const phone = ref('')
  const surname = ref('')
	
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

  const finalPrice = computed(() => {
    let price = totalSum.value
    if (selectedPromoCode.value) {
      const promo = availablePromoCodes.value?.find(p => p.code === selectedPromoCode.value)
      if (promo) {
        const sumWithoutDiscount = cartDetailed.value.reduce((sum, item) => {
          const isNonDiscounted = item.oldPrice === 0 || item.oldPrice === item.price
          return isNonDiscounted ? sum + item.price * item.count : sum
        }, 0)
        price -= sumWithoutDiscount * (promo.discount / 100)
      }
    }
    if (pointsToUse.value > 0) {
      price -= Math.min(pointsToUse.value, price)
    }
    if (selectedCertificates.value.length > 0) {
      const certSum = selectedCertificates.value.reduce((sum, code) => {
        const cert = userStore.user.certificates.find(c => c.code === code)
        return cert ? sum + cert.sum : sum
      }, 0)
      price -= certSum
    }
    return Math.max(price, 0.01)
  })

  const totalOldSum = computed(() => {
    return cartItems.value.reduce((sum, cartItem) => {
      const product = catalogStore.items.find(p => p.id === cartItem.id)
      if (!product) return sum
      const vectorData = product.vector[cartItem.vector]
      if (!vectorData) return sum
      return sum + (vectorData.oldPrice > 0 ? vectorData.oldPrice : vectorData.price) * cartItem.count
    }, 0)
  })

  const totalSum = computed(() => {
    return cartItems.value.reduce((sum, cartItem) => {
      const product = catalogStore.items.find(p => p.id === cartItem.id)
      if (!product) return sum
      const vectorData = product.vector[cartItem.vector]
      if (!vectorData) return sum
      return sum + vectorData.price * cartItem.count
    }, 0)
  })

  function decrementQuantity(id: string, vector: string) {
    const item = cartItems.value.find(i => i.id === id && i.vector === vector)
    if (item && item.count > 1) {
      item.count--
    }
  }

  function incrementQuantity(id: string, vector: string) {
    const item = cartItems.value.find(i => i.id === id && i.vector === vector)
    if (item) {
      item.count++
    }
  }

  function removeItemFromCart(id: string, vector: string) {
    cartItems.value = cartItems.value.filter(
      item => !(item.id === id && item.vector === vector)
    )
  }

  function setCartItems(items: CartItem[] | null | undefined) {
    cartItems.value = Array.isArray(items) ? items : []
  }

  function saveNewAddress() {
    let newAddress = `${newAddressFirstLine.value}, ${newAddressSecondLine.value}`.trim()
    if (newAddressSecondLine.value.trim() === '') {
      newAddress = newAddressFirstLine.value.trim()
    }
    if (newAddress) {
      addresses.value.push(newAddress)
      currentAddress.value = newAddress
      newAddressFirstLine.value = ''
      newAddressSecondLine.value = ''
    }
  }

  function attemptPayment() {
    isPaymentSuccessful.value = Math.random() >= 0.5
  }

  function addPromoCode() {
    const promo = availablePromoCodes.value?.find(p => p.code === promoCode.value)
    if (!promo) {
      addPromoCodeError.value = 'Данного промокода не существует'
      return
    }
    const alreadyAdded = currentPromoCodes.value.some(p => p.code === promo.code)
    if (!alreadyAdded) {
      currentPromoCodes.value.push(promo)
      promoCode.value = ''
    }
    addPromoCodeError.value = ''
  }

  function applyPromoCode() {
    pendingPoints.value = ''
    pointsToUse.value = 0
    if (!pendingPromoCode.value) {
      usePromoCodeError.value = 'Выберите промокод'
      return
    }
    const hasNonDiscountedItems = cartDetailed.value.some(
      item => item.oldPrice === 0 || item.oldPrice === item.price
    )
    if (!hasNonDiscountedItems) {
      usePromoCodeError.value = 'Промокод не применяется к товарам со скидкой'
      return
    }
    selectedPromoCode.value = pendingPromoCode.value
    usePromoCodeError.value = ''
  }
  
  function savedMoney(discount: number) {
    const sumWithoutDiscount = cartDetailed.value.reduce((sum, item) => {
      const isNonDiscounted = item.oldPrice === 0
      return isNonDiscounted ? sum + item.price * item.count : sum
    }, 0)
    return sumWithoutDiscount * (discount / 100)
  }

  function togglePromoCode() {
    isExpandedPromoCode.value = !isExpandedPromoCode.value
  }

  function applyPoints() {
    selectedPromoCode.value = null
    pendingPromoCode.value = null
    const maxPoints = totalSum.value * 0.2
    const points = +pendingPoints.value
    if (points > userStore.user.points) {
      pointsError.value = 'Недостаточно баллов'
      return
    }
    if (points > maxPoints) {
      pointsError.value = `Нельзя списать больше ${maxPoints} баллов (20% от суммы заказа)`
      return
    }
    pointsError.value = ''
    pointsToUse.value = points
  }

  function togglePoints() {
    isExpandedPoints.value = !isExpandedPoints.value
  }

  function addCertificate() {
    const code = newCertificateCode.value.trim()
    if (!code) {
      certificateError.value = 'Введите код сертификата'
      return
    }
    const certFromServer = availableCertificates.value.find(c => c.code === code)
    if (!certFromServer) {
      certificateError.value = 'Сертификат не найден'
      return
    }
    if (userStore.user.certificates.some(c => c.code === code)) {
      return
    }
    userStore.user.certificates.push({ ...certFromServer })
    newCertificateCode.value = ''
    certificateError.value = ''
  }

  function toggleCert() {
    isExpandedCert.value = !isExpandedCert.value
  }

  function priceFormatter(value: number) {
    const formattedValue = new Intl.NumberFormat('ru-RU').format(value)
    return `${formattedValue} ₽`
  }
  
  watch(pendingPromoCode, (newVal) => {
    if (newVal === null && selectedPromoCode.value) {
      selectedPromoCode.value = null
    }
  })

  return {
    cartItems,
    cartDetailed,

    addresses,
    city,
    commentForCourier,
    currentAddress,
    deliveryMethod,
    newAddressFirstLine,
    newAddressSecondLine,
    showErrorDeliveryMethod,

    isPaymentSuccessful,
    paymentMethod,
    showErrorPaymentMethod,

    addPromoCodeError,
    availablePromoCodes,
    currentPromoCodes,
    isExpandedPromoCode,
    pendingPromoCode,
    promoCode,
    selectedPromoCode,
    usePromoCodeError,

    isExpandedPoints,
    pendingPoints,
    pointsError,
    pointsToUse,

    availableCertificates,
    certificateError,
    isExpandedCert,
    newCertificateCode,
    selectedCertificates,

    email,
    name,
    phone,
    surname,

    finalPrice,
    savedMoney,
    totalOldSum,
    totalSum,

    addCertificate,
    addPromoCode,
    applyPoints,
    applyPromoCode,
    attemptPayment,
    decrementQuantity,
    incrementQuantity,
    priceFormatter,
    removeItemFromCart,
    saveNewAddress,
    setCartItems,
    toggleCert,
    togglePoints,
    togglePromoCode,
  }
})
