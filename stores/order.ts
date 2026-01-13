interface ApiResponse {
  success: boolean
  error?: string
}

interface Certificate {
  id: number
  code: string
  value: number
  value_now: number
}

interface PointsResponse {
  success: boolean
  points: number
}

interface PaymentDataResponse {
  success: boolean
  type?: "widget" | string
  data?: any
  link?: string
  external?: boolean
  error?: string
}

interface PromoCode {
  code: string
  value: number
  percent: boolean
}

interface CheckOrderStatusResponse {
  success: boolean
  order?: OrderState
  error?: string
  status: number
  cart?: Record<string, CartItem>
}

interface UserInfo {
  name: string
  surname: string
  phone: {
    code: string
    phone: string
    country: string
  } | null
  email: string
  addresses?: string[][]
}

export interface OrderState {
  deliveryMethod?: string | null
  city?: CityData | null
  currentAddress?: string | string[] | null
  commentForCourier?: string
  paymentMethod?: string | null
  promoCode?: string | null
  points?: number
  certificates?: string[]
  promoCodes?: PromoCode[]
  pendingPromoCode?: string | null
  userInfo?: UserInfo | null
  cart?: Record<string, CartItem>
  pvz?: PvzData | null
  deliveryTime?: string | null
  deliveryCost?: number
}

interface UpdateOrderResponse {
  updated: boolean
  last_update: number
  orderId: number
}

interface GetOrderResponse {
  order: OrderState
  orderId: number
}

interface UpdateCartResponse {
  success: boolean
  message?: string
  cart_items_count?: number
  total_quantity?: number
  cart: Record<
    string,
    {
      id: number
      variant: string
      count: number
      updated_at: number | null
      name: string
      colorName: string
      sizes: string[]
      images: Record<number, string>
      vector: Record<string, { quantity: number; comingSoon: number }>
      type: string
      material: string[]
      useType: string[]
      colors: any[]
      price: string
      oldPrice: string
    }
  >
}
interface PaymentMethodsResponse {
  success: boolean
  data: Record<string, string>
}

export type CartItem = {
  key: string
  id: number
  variant: string
  count: number
  updated_at?: number
  name: string
  colorName: string
  sizes: string[]
  images: Record<number, string>
  vector: Record<string, { quantity: number; comingSoon: boolean }>
  type: string
  material: string[]
  useType: string[]
  price: number
  oldPrice: number
}

export interface PaymentMethod {
  id: string
  name: string
}

export const useOrderStore = defineStore("order", () => {
  const userStore = useUserStore()
  const authStore = useAuthStore()

  const cartItems = ref<CartItem[]>([])

  const addresses = ref<string[]>([])
  const city = ref<CityData | null>(null)
  const commentForCourier = ref("")
  const currentAddress = ref<string | string[] | null>(null)
  const deliveryMethod = ref<string | null>(null)
  const newAddressFirstLine = ref("")
  const newAddressSecondLine = ref("")
  const showErrorDeliveryMethod = ref<boolean>(false)
  const selectedPvz = ref<PvzData | null>(null)
  const isPaymentSuccessful = ref<boolean | null>(null)
  const paymentMethod = ref<string | null>(null)
  const showErrorPaymentMethod = ref<boolean>(false)
  const isLoadingPayment = ref<boolean>(false)
  const paymentMethods = ref<PaymentMethod[]>([])

  const isGuestAuthStep = ref(false)
  const guestLoginType = ref<number>(1)
  const guestSmsCode = ref("")
  const guestAuthError = ref("")
  const showGuestAuthError = ref(false)
  const showErrorAuth = ref(false)
  const isGuestAuthLoading = ref(false)
  const guestNextCode = ref(45)
  const guestRemainingSeconds = ref(0)
  const guestIntervalId = ref<number | null>(null)
  const guestSmsError = ref("")
  const errorDeliveryMethod = ref("")
  const showGuestSmsError = ref(false)

  const guestAuthButtonContent = ref("Авторизоваться / Зарегистрироваться")
  const guestAuthButtonDisabled = ref(false)
  const guestSmsButtonContent = ref("Подтвердить")
  const guestSmsButtonDisabled = ref(false)

  const isExpandedPoints = ref<boolean>(false)
  const pendingPoints = ref<string>("")
  const pointsError = ref<string>("")
  const pointsToUse = ref<number>(0)
  const usedPointsBackup = ref<number>(0)
  const isLoadingPoints = ref<boolean>(false)
  const isWidgetOpen = ref<boolean>(false)
  const certificateError = ref<string>("")
  const isExpandedCert = ref<boolean>(false)
  const newCertificateCode = ref<string>("")
  const selectedCertificates = ref<string[]>([])
  const isLoadingCert = ref<boolean>(false)

  const email = ref<string>("")
  const name = ref<string>("")
  const phone = ref<{
    code: string
    phone: string
    country: string
  } | null>(null)
  const surname = ref<string>("")
  const orderState = ref<OrderState>(<OrderState>{})
  const isLoaded = ref(false)
  const orderId = ref<number | null>(null)
  const cdekData = ref<{
    courier: { price: number; term: { min: number; max: number } }
    courierPrim: { price: number; term: { min: number; max: number } }
    pvz: { price: number; term: { min: number; max: number } }
  } | null>(null)
  const deliveryTypes = ref<
    Array<{ id: number; name: string; term?: { min: number; max: number }; cost?: number; isExpress?: boolean }>
  >([
    { id: 1, name: "Курьер СДЭК", term: { min: 0, max: 0 }, cost: 0 },
    { id: 2, name: "Курьер СДЭК с примеркой", term: { min: 0, max: 0 }, cost: 0 },
    { id: 3, name: "Экспресс-доставка", isExpress: true },
    { id: 4, name: "СДЭК (ПВЗ)", term: { min: 0, max: 0 }, cost: 0 },
  ])
  const deliveryTime = ref<string | null>(null)
  const deliveryCost = ref<number>(0)
  const isMoscow = ref<boolean>(false)

  async function loadPaymentMethods() {
    try {
      const { data, error } = await useFetch<PaymentMethodsResponse>("https://back.casaalmare.com/api/getPayments", {
        method: "GET",
      })

      if (error.value) {
        console.error("Network error loading payment methods:", error.value)
        return
      }

      if (data.value?.success && data.value.data) {
        paymentMethods.value = Object.entries(data.value.data).map(([id, name]) => ({ id, name }))
      }
    } catch (error) {
      console.error("Ошибка загрузки методов оплаты:", error)
    }
  }

  function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number,
  ): (...args: Parameters<T>) => ReturnType<T> {
    let timeout: NodeJS.Timeout | null = null
    return function (this: ThisParameterType<T> | undefined, ...args: Parameters<T>) {
      if (timeout !== null) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        timeout = null
        func.apply(this, args)
      }, wait)
    } as (...args: Parameters<T>) => ReturnType<T>
  }

  async function getPaymentData(): Promise<PaymentDataResponse | null> {
    const token = await userStore.loadToken()
    if (!token) {
      console.error("Нет токена для получения данных оплаты")
      return null
    }

    try {
      const { data, error } = await useFetch<PaymentDataResponse>("https://back.casaalmare.com/api/getPayData", {
        method: "POST",
        body: { token },
      })

      if (error.value) {
        console.error("Network error getting payment data:", error.value)
        return null
      }

      if (!data.value?.success) {
        console.error("Server error getting payment data:", data.value?.error)
        return null
      }

      return data.value
    } catch (error) {
      console.error("Ошибка получения данных для оплаты:", error)
      return null
    }
  }

  async function loadUserData() {
    const token = await userStore.loadToken()
    if (!token) return

    try {
      const { data: loyaltyData, error } = await useFetch<{
        balance: number
        ordersumm: number
        level: number
      }>(`https://back.casaalmare.com/api/getUserLoyality?user=${userStore.user?.uid}`, {
        method: "GET",
      })
      
      if (error.value) {
        console.error("Network error loading loyalty:", error.value)
        return
      }
      
      if (loyaltyData.value) {
        if (userStore.user) {
          userStore.user.points = loyaltyData.value.balance
          userStore.user.orderSum = loyaltyData.value.ordersumm
          userStore.user.loyaltyLevel = loyaltyData.value.level
        }
      }

      let allAddresses: string[] = []

      if (userStore.user?.profile?.address && Array.isArray(userStore.user.profile.address)) {
        const [adr1, adr2] = userStore.user.profile.address
        if (adr1?.trim()) {
          const mainAddress = adr2?.trim() ? `${adr1.trim()}, ${adr2.trim()}` : adr1.trim()
          allAddresses = [mainAddress]
        }
      }

      if (userStore.user?.profile.extended.addresses && Array.isArray(userStore.user.profile.extended.addresses)) {
        const extendedAddresses = userStore.user.profile.extended.addresses
          .filter((addr) => Array.isArray(addr) && addr[0]?.trim())
          .map((addr) => {
            const [adr1, adr2] = addr
            return adr2?.trim() ? `${adr1.trim()}, ${adr2.trim()}` : adr1.trim()
          })
          .filter((addr) => !allAddresses.includes(addr))

        allAddresses = [...allAddresses, ...extendedAddresses]
      }

      addresses.value = allAddresses
    } catch (error) {
      console.error("Ошибка загрузки user data:", error)
    }
  }
  
  const availablePoints = computed(() => {
    return (userStore.user?.points || 0) - pointsToUse.value
  })

  function updateDeliveryType(id: number, term: { min: number; max: number }, cost: number) {
    const type = deliveryTypes.value.find((t) => t.id === id)
    if (type) {
      type.term = term
      type.cost = cost
    }
  }

  async function loadCdekData() {
    if (!city.value?.fias) return

    try {
      const data = await $fetch(`https://back.casaalmare.com/api/getCdekByFias?fias=${city.value.fias}`)

      if (data) {
        cdekData.value = data

        deliveryTypes.value = [
          { id: 1, name: "Курьер СДЭК", term: { min: 0, max: 0 }, cost: 0 },
          { id: 2, name: "Курьер СДЭК с примеркой", term: { min: 0, max: 0 }, cost: 0 },
          { id: 3, name: "Экспресс-доставка", isExpress: true },
          { id: 4, name: "СДЭК (ПВЗ)", term: { min: 0, max: 0 }, cost: 0 },
        ]

        if (data.courier && data.courier.term && typeof data.courier.price === "number") {
          updateDeliveryType(1, data.courier.term, data.courier.price)
        }
        if (data.courierPrim && data.courierPrim.term && typeof data.courierPrim.price === "number") {
          updateDeliveryType(2, data.courierPrim.term, data.courierPrim.price)
        }
        if (data.pvz && data.pvz.term && typeof data.pvz.price === "number") {
          updateDeliveryType(4, data.pvz.term, data.pvz.price)
        }

        isMoscow.value = city.value.name.toLowerCase().includes("москва")
        if (!isMoscow.value) {
          deliveryTypes.value = deliveryTypes.value.filter((type) => type.id !== 3)
        }

        if (deliveryMethod.value && !deliveryTypes.value.some((t) => t.id === Number(deliveryMethod.value))) {
          deliveryMethod.value = null
          deliveryTime.value = null
          deliveryCost.value = 0
        }

        await nextTick()
        if (deliveryMethod.value) {
          updateDeliveryDetails()
        }
      }
    } catch (error) {
      console.error("Ошибка API getCdekByFias:", error)
    }
  }

  function startGuestCountdown() {
    guestRemainingSeconds.value = guestNextCode.value
    if (guestIntervalId.value) clearInterval(guestIntervalId.value)
    guestIntervalId.value = window.setInterval(() => {
      guestRemainingSeconds.value--
      if (guestRemainingSeconds.value <= 0) {
        clearInterval(guestIntervalId.value!)
        guestIntervalId.value = null
      }
    }, 1000)
  }

  function resetGuestAuth() {
    isGuestAuthStep.value = false
    guestSmsCode.value = ""
    guestAuthError.value = ""
    showErrorAuth.value = false
    showGuestAuthError.value = false
    isGuestAuthLoading.value = false
    guestSmsError.value = ""
    showGuestSmsError.value = false
    guestAuthButtonContent.value = "Авторизоваться / Зарегистрироваться"
    guestAuthButtonDisabled.value = false
    guestSmsButtonContent.value = "Подтвердить"
    guestSmsButtonDisabled.value = false
    if (guestIntervalId.value) {
      clearInterval(guestIntervalId.value)
      guestIntervalId.value = null
    }
  }

  function parseCart(rawCart: Record<string, any>): CartItem[] {
    return Object.entries(rawCart).map(([key, item]) => {
      const vector: Record<string, { quantity: number; comingSoon: boolean }> = {}
      if (item.vector) {
        for (const [size, vecData] of Object.entries(item.vector)) {
          vector[size] = {
            quantity: vecData.quantity || 0,
            comingSoon: !!vecData.comingSoon,
          }
        }
      }
      return {
        key,
        id: item.id,
        variant: item.variant || (item.id === -1 ? "certificate" : ""),
        count: item.count,
        updated_at: item.updated_at || undefined,
        name: item.name,
        colorName: item.colorName || "",
        sizes: item.sizes || [],
        images: item.images || {},
        vector,
        type: item.type || "",
        material: item.material || [],
        useType: item.useType || [],
        price: parseInt(item.price) || 0,
        oldPrice: parseInt(item.oldPrice) || 0,
        certificateType: item.options?.certificateType,
        deliveryMethod: item.options?.deliveryMethod,
        recipientEmail: item.options?.recipientEmail,
        recipientName: item.options?.recipientName,
        recipientPhone: item.options?.recipientPhone,
        deliveryDetails: item.options?.deliveryDetails,
        options: item.options,
        template: item.template,
      }
    })
  }

  const needsDelivery = computed(() => {
    const items = cartItems.value
    if (items.length === 0) return false
    return items.some((item) => item.id !== -1 || (item.id === -1 && item.certificateType === "Физический"))
  })

  async function loadOrderState() {
    const token = await userStore.loadToken()
    if (!token) return

    try {
      const { data, error } = await useFetch<ApiResponse & GetOrderResponse>(
        "https://back.casaalmare.com/api/getOrderState",
        {
          method: "POST",
          body: { token },
        },
      )

      if (error.value) {
        console.error("Network error loading order state:", error.value)
        return
      }

      if (data.value?.success && data.value?.order) {
        const loadedOrder: OrderState = data.value.order

        if (data.value.orderId) orderId.value = data.value.orderId

        if (loadedOrder.deliveryMethod) deliveryMethod.value = loadedOrder.deliveryMethod
        if (loadedOrder.deliveryTime !== undefined) deliveryTime.value = loadedOrder.deliveryTime
        if (loadedOrder.deliveryCost !== undefined) deliveryCost.value = loadedOrder.deliveryCost
        if (loadedOrder.pvz) {
          selectedPvz.value = loadedOrder.pvz
        }

        let targetCity: CityData | null = null
        if (loadedOrder.city) {
          targetCity = loadedOrder.city
        } else if (userStore.user?.profile?.extended?.city) {
          targetCity = userStore.user.profile.extended.city
        } else if (userStore.user?.city) {
          targetCity = userStore.user.city
        }

        if (!targetCity || targetCity.label === "" || targetCity === false) {
          city.value = null
        } else if (targetCity && targetCity !== city.value) {
          city.value = targetCity
        }

        await nextTick()

        if (loadedOrder.currentAddress) {
          if (Array.isArray(loadedOrder.currentAddress)) {
            const [adr1, adr2] = loadedOrder.currentAddress
            currentAddress.value = adr2?.trim() ? `${adr1.trim()}, ${adr2.trim()}` : adr1.trim()
          } else {
            currentAddress.value = loadedOrder.currentAddress
          }
        }

        if (loadedOrder.commentForCourier) commentForCourier.value = loadedOrder.commentForCourier
        if (loadedOrder.paymentMethod) paymentMethod.value = loadedOrder.paymentMethod
        if (loadedOrder.points !== undefined) {
          pointsToUse.value = loadedOrder.points
          if (userStore.user) userStore.user.points += usedPointsBackup.value - loadedOrder.points
        }
        if (loadedOrder.certificates) {
          selectedCertificates.value = Array.isArray(loadedOrder.certificates) ? loadedOrder.certificates : []
        } else {
          selectedCertificates.value = []
        }

        if (!authStore.isAuth && loadedOrder.userInfo) {
          if (loadedOrder.userInfo.name) name.value = loadedOrder.userInfo.name
          if (loadedOrder.userInfo.surname) surname.value = loadedOrder.userInfo.surname
          if (loadedOrder.userInfo.phone) phone.value = loadedOrder.userInfo.phone
          if (loadedOrder.userInfo.email) email.value = loadedOrder.userInfo.email

          if (loadedOrder.userInfo.addresses && Array.isArray(loadedOrder.userInfo.addresses)) {
            addresses.value = loadedOrder.userInfo.addresses
              .filter((addr) => Array.isArray(addr) && addr[0]?.trim())
              .map((addr) => {
                const [adr1, adr2] = addr
                return adr2?.trim() ? `${adr1.trim()}, ${adr2.trim()}` : adr1.trim()
              })
          }
        }

        orderState.value = loadedOrder
        if (!needsDelivery.value) {
          deliveryMethod.value = null
          city.value = null
          currentAddress.value = null
          selectedPvz.value = null
          deliveryTime.value = null
          deliveryCost.value = 0
          commentForCourier.value = ""
        }
      } else {
        console.error("Server error loading order state:", data.value?.error)
      }
    } catch (error) {
      console.error("Ошибка загрузки состояния заказа:", error)
    } finally {
      isLoaded.value = true
      if (city.value) {
        await loadCdekData()
        await nextTick()
        if (deliveryMethod.value) {
          updateDeliveryDetails()
        }
      }
    }
  }

  const updateOrderState = async () => {
    if (isPaymentSuccessful.value !== null) return

    if (!needsDelivery.value) {
      deliveryMethod.value = null
      city.value = null
      currentAddress.value = null
      selectedPvz.value = null
      commentForCourier.value = ""
    }

    const token = await userStore.loadToken()
    if (!token) return

    const orderStateObj: Partial<OrderState> = {
      deliveryMethod: deliveryMethod.value,
      deliveryTime: deliveryTime.value,
      deliveryCost: deliveryCost.value,
      pvz: selectedPvz.value,
      city: city.value,
      currentAddress: currentAddress.value,
      commentForCourier: commentForCourier.value,
      paymentMethod: paymentMethod.value,
      points: pointsToUse.value,
      certificates: selectedCertificates.value,
      userInfo: !authStore.isAuth
        ? {
            name: name.value,
            surname: surname.value,
            phone: phone.value,
            email: email.value,
            addresses: addresses.value,
          }
        : null,
    }

    const lastUpdate = Math.floor(Date.now() / 1000)

    try {
      const { data, error } = await useFetch<ApiResponse & UpdateOrderResponse>(
        "https://back.casaalmare.com/api/updateOrderState",
        {
          method: "POST",
          body: {
            token: token,
            orderState: orderStateObj,
            last_update: lastUpdate,
          },
        },
      )

      if (error.value) {
        console.error("Network error updating order state:", error.value)
        return
      }

      if (!data.value?.success) {
        console.error("Server error updating order state:", data.value?.error)
        return
      }

      if (data.value?.orderId) {
        orderId.value = data.value.orderId
      }

      if (data.value?.updated === false) {
        console.warn("Order state update ignored: timestamp too old", {
          lastUpdate,
          serverLastUpdate: data.value.last_update,
        })
      }
    } catch (error) {
      console.error("Ошибка обновления состояния заказа:", error)
    }
  }

  const debouncedUpdateOrderState = debounce(updateOrderState, 500)

  const cartDetailed = computed(() => {
    return cartItems.value
      .map((cartItem) => {
        const isCertificate = cartItem.id === -1
        const isGame = cartItem.template === 6

        if (isCertificate) {
          return {
            key: cartItem.key,
            id: cartItem.id,
            count: cartItem.count,
            name: cartItem.name,
            images: cartItem.images,
            price: cartItem.price,
            oldPrice: cartItem.oldPrice,
            certificateType: cartItem.certificateType || cartItem.options?.certificateType,
            deliveryMethod: cartItem.deliveryMethod || cartItem.options?.deliveryMethod,
            recipientEmail: cartItem.recipientEmail || cartItem.options?.recipientEmail,
            recipientName: cartItem.recipientName || cartItem.options?.recipientName,
            recipientPhone: cartItem.recipientPhone || cartItem.options?.recipientPhone,
            deliveryDetails: cartItem.deliveryDetails || cartItem.options?.deliveryDetails,
            vector: "certificate",
            isCertificate: true,
          }
        }

        if (!cartItem.variant) return null

        const size = cartItem.variant
        const colorName = cartItem.colorName || "Цвет не указан"

        const imagesArray = Object.values(cartItem.images).filter((img) => img)

        return {
          key: cartItem.key,
          id: cartItem.id,
          vector: cartItem.variant,
          count: cartItem.count,
          name: cartItem.name,
          color: colorName,
          images: imagesArray,
          size,
          price: cartItem.price,
          oldPrice: cartItem.oldPrice,
          isCertificate: false,
          isGame: isGame
        }
      })
      .filter(Boolean)
  })

  const goodsSum = computed(() => {
    return cartItems.value.reduce((sum, cartItem) => {
      if (cartItem.id === -1) return sum
      return sum + cartItem.price * cartItem.count
    }, 0)
  })

  const certsInCartSum = computed(() => {
    return totalSum.value - goodsSum.value
  })

  const totalOldSum = computed(() => {
    return cartItems.value.reduce((sum, cartItem) => {
      const oldPrice = cartItem.oldPrice > 0 ? cartItem.oldPrice : cartItem.price
      return sum + oldPrice * cartItem.count
    }, 0)
  })

  const totalSum = computed(() => {
    return cartItems.value.reduce((sum, cartItem) => {
      return sum + cartItem.price * cartItem.count
    }, 0)
  })

  const finalPrice = computed(() => {
    let price = goodsSum.value

    if (pointsToUse.value > 0 && userStore.user) {
      const pointsDeduction = Math.min(pointsToUse.value, price)
      price -= pointsDeduction
    }

    if (
      selectedCertificates.value &&
      Array.isArray(selectedCertificates.value) &&
      selectedCertificates.value.length > 0 &&
      userStore.user
    ) {
      const certDiscount = selectedCertificates.value.reduce((sum, code) => {
        const cert = userStore.user!.certificates.find((c) => c.code === code)
        if (cert) {
          return sum + cert.value_now
        } else {
          return sum
        }
      }, 0)
      const certDeduction = Math.min(certDiscount, price)
      price -= certDeduction
    }

    const deliveryFee = deliveryCost.value
    price += deliveryFee + certsInCartSum.value

    const result = Math.max(price, 0.01)
    return result
  })

  async function decrementQuantity(keyOrId: string) {
    let item: CartItem | undefined
    if (cartItems.value.some((i) => i.key === keyOrId)) {
      item = cartItems.value.find((i) => i.key === keyOrId)
    } else {
      item = cartItems.value.find((i) => i.id === Number(keyOrId))
    }
    if (!item || item.count <= 1) return

    const token = await userStore.loadToken()
    if (!token) return

    const key = item.key

    try {
      const { data, error } = await useFetch<UpdateCartResponse>("https://back.casaalmare.com/api/updateCart", {
        method: "POST",
        body: {
          token,
          key,
          change: -1,
        },
      })

      if (error.value) {
        console.error("Network error updating cart:", error.value)
        return
      }

      if (data.value?.success && data.value?.cart) {
        const rawCart = data.value.cart
        const parsedCart = parseCart(rawCart)
        setCartItems(parsedCart)
      } else {
        console.error("Server error updating cart:", data.value?.error)
      }
    } catch (error) {
      console.error("Ошибка изменения количества:", error)
    }
  }

  async function incrementQuantity(keyOrId: string) {
    let item: CartItem | undefined
    if (cartItems.value.some((i) => i.key === keyOrId)) {
      item = cartItems.value.find((i) => i.key === keyOrId)
    } else {
      item = cartItems.value.find((i) => i.id === Number(keyOrId))
    }
    if (!item) return

    const token = await userStore.loadToken()
    if (!token) return

    const key = item.key

    try {
      const { data, error } = await useFetch<UpdateCartResponse>("https://back.casaalmare.com/api/updateCart", {
        method: "POST",
        body: {
          token,
          key,
          change: 1,
        },
      })

      if (error.value) {
        console.error("Network error updating cart:", error.value)
        return
      }

      if (data.value?.success && data.value?.cart) {
        const rawCart = data.value.cart
        const parsedCart = parseCart(rawCart)
        setCartItems(parsedCart)
      } else {
        console.error("Server error updating cart:", data.value?.error)
      }
    } catch (error) {
      console.error("Ошибка изменения количества:", error)
    }
  }

  async function removeItemFromCart(keyOrId: string) {
    let item: CartItem | undefined
    if (cartItems.value.some((i) => i.key === keyOrId)) {
      item = cartItems.value.find((i) => i.key === keyOrId)
    } else {
      item = cartItems.value.find((i) => i.id === Number(keyOrId))
    }
    if (!item) return

    const token = await userStore.loadToken()
    if (!token) return

    const key = item.key

    try {
      const { data, error } = await useFetch<UpdateCartResponse>("https://back.casaalmare.com/api/updateCart", {
        method: "POST",
        body: {
          token,
          key,
          change: -item.count,
        },
      })

      if (error.value) {
        console.error("Network error removing item:", error.value)
        return
      }

      if (data.value?.success && data.value?.cart) {
        const rawCart = data.value.cart
        const parsedCart = parseCart(rawCart)
        setCartItems(parsedCart)
      } else {
        console.error("Server error removing item:", data.value?.error)
      }
    } catch (error) {
      console.error("Ошибка удаления товара:", error)
    }
  }

  function setCartItems(items: CartItem[] | null | undefined) {
    cartItems.value = Array.isArray(items) ? items : []
  }

  async function saveNewAddress() {
    const firstLine = newAddressFirstLine.value.trim()
    const secondLine = newAddressSecondLine.value.trim()

    if (!firstLine) return

    const newAddress = [firstLine, secondLine]

    if (authStore.isAuth) {
      const token = await userStore.loadToken()
      if (!token) return

      try {
        const { data, error } = await useFetch<ApiResponse>("https://back.casaalmare.com/api/saveAddress", {
          method: "POST",
          body: { token, address: newAddress },
        })

        if (error.value) {
          console.error("Network error saving address:", error.value)
          return
        }

        if (data.value?.success) {
          const addressString = secondLine ? `${firstLine}, ${secondLine}` : firstLine
          if (!addresses.value.includes(addressString)) {
            addresses.value.push(addressString)
          }

          currentAddress.value = addressString
          newAddressFirstLine.value = ""
          newAddressSecondLine.value = ""

          if (userStore.user) {
            if (!userStore.user.profile.extended.addresses) {
              userStore.user.profile.extended.addresses = []
            }
            const addressExists = userStore.user.profile.extended.addresses.some(
              (addr) => Array.isArray(addr) && addr[0] === firstLine && addr[1] === secondLine,
            )
            if (!addressExists) {
              userStore.user.profile.extended.addresses.push(newAddress)
            }
          }
        } else {
          console.error("Ошибка сохранения адреса:", data.value?.error)
        }
      } catch (error) {
        console.error("Ошибка API saveAddress:", error)
      }
    } else {
      const addressString = secondLine ? `${firstLine}, ${secondLine}` : firstLine
      if (!addresses.value.includes(addressString)) {
        addresses.value.push(addressString)
      }
      currentAddress.value = addressString
      newAddressFirstLine.value = ""
      newAddressSecondLine.value = ""
      debouncedUpdateOrderState()
    }
  }

  function resetOrder() {
    cartItems.value = []
    addresses.value = []
    city.value = null
    commentForCourier.value = ""
    currentAddress.value = null
    deliveryMethod.value = null
    deliveryTime.value = null
    deliveryCost.value = 0
    newAddressFirstLine.value = ""
    newAddressSecondLine.value = ""
    showErrorDeliveryMethod.value = false

    isPaymentSuccessful.value = null
    paymentMethod.value = null
    showErrorPaymentMethod.value = false
    selectedPvz.value = null

    isExpandedPoints.value = false
    pendingPoints.value = ""
    pointsError.value = ""
    pointsToUse.value = 0
    usedPointsBackup.value = 0

    certificateError.value = ""
    isExpandedCert.value = false
    newCertificateCode.value = ""
    selectedCertificates.value = []

    orderState.value = {}
    orderId.value = null
    isWidgetOpen.value = false
  }

  async function checkOrderStatus(id: number) {
    const token = await userStore.loadToken()
    if (!token) return null

    try {
      const { data, error } = await useFetch<CheckOrderStatusResponse>(
        "https://back.casaalmare.com/api/checkOrderStatus",
        {
          method: "POST",
          body: { token, orderId: id },
        },
      )

      if (error.value) {
        console.error("Network error checking order status:", error.value)
        return null
      }

      if (data.value?.success !== undefined) {
        isPaymentSuccessful.value = data.value.success

        if (data.value?.status === 1 || data.value?.status === 2) {
          resetOrder()
        }

        if (data.value.success && data.value.order) {
          const loadedOrder = data.value.order
          if (loadedOrder.deliveryMethod) deliveryMethod.value = loadedOrder.deliveryMethod
          if (loadedOrder.city) city.value = loadedOrder.city

          if (loadedOrder.currentAddress) {
            if (Array.isArray(loadedOrder.currentAddress)) {
              const [adr1, adr2] = loadedOrder.currentAddress
              currentAddress.value = adr2?.trim() ? `${adr1.trim()}, ${adr2.trim()}` : adr1.trim()
            } else {
              currentAddress.value = loadedOrder.currentAddress
            }
          }

          if (loadedOrder.commentForCourier) commentForCourier.value = loadedOrder.commentForCourier
          if (loadedOrder.paymentMethod) paymentMethod.value = loadedOrder.paymentMethod
          if (loadedOrder.points !== undefined) {
            pointsToUse.value = loadedOrder.points
            if (userStore.user) userStore.user.points += usedPointsBackup.value - loadedOrder.points
          }
          if (loadedOrder.certificates) selectedCertificates.value = loadedOrder.certificates

          if (!authStore.isAuth && loadedOrder.userInfo) {
            if (loadedOrder.userInfo.name) name.value = loadedOrder.userInfo.name
            if (loadedOrder.userInfo.surname) surname.value = loadedOrder.userInfo.surname
            if (loadedOrder.userInfo.phone) phone.value = loadedOrder.userInfo.phone
            if (loadedOrder.userInfo.email) email.value = loadedOrder.userInfo.email

            if (loadedOrder.userInfo.addresses && Array.isArray(loadedOrder.userInfo.addresses)) {
              addresses.value = loadedOrder.userInfo.addresses
                .filter((addr) => Array.isArray(addr) && addr[0]?.trim())
                .map((addr) => {
                  const [adr1, adr2] = addr
                  return adr2?.trim() ? `${adr1.trim()}, ${adr2.trim()}` : adr1.trim()
                })
            }
          }

          if (data.value.cart) {
            const parsedCart = parseCart(data.value.cart)
            setCartItems(parsedCart)
          }
          if (!data.value.success) {
            isWidgetOpen.value = false
          }
          if (!needsDelivery.value) {
            deliveryMethod.value = null
            city.value = null
            currentAddress.value = null
            selectedPvz.value = null
            deliveryTime.value = null
            deliveryCost.value = 0
            commentForCourier.value = ""
          }
        }
        return data.value
      }
    } catch (error) {
      console.error("Ошибка проверки статуса заказа:", error)
    } finally {
      await userStore.fetchUser()
    }
    return null
  }
  
  async function applyPoints() {
    if (isLoadingPoints.value) return
    
    isLoadingPoints.value = true
    pointsError.value = ""
    
    const points = Number(pendingPoints.value)
    
    if (isNaN(points) || points <= 0) {
      pointsError.value = "Введите корректное количество баллов"
      isLoadingPoints.value = false
      return
    }
    
    const maxPoints = Math.floor(goodsSum.value * 0.2)
    
    if (points > (userStore.user?.points || 0)) {
      pointsError.value = "Недостаточно баллов"
      isLoadingPoints.value = false
      return
    }
    
    if (points > maxPoints) {
      pointsError.value = `Нельзя списать больше ${maxPoints} баллов (20% от суммы заказа)`
      isLoadingPoints.value = false
      return
    }
    
    pointsError.value = ""
    
    const previousPointsToUse = pointsToUse.value
    
    pointsToUse.value = points
    
    if (userStore.user) {
      userStore.user.points = userStore.user.points - (points - previousPointsToUse)
    }
    
    pendingPoints.value = ""
    isLoadingPoints.value = false
  }

  function togglePoints() {
    isExpandedPoints.value = !isExpandedPoints.value
  }

  watch(goodsSum, () => {
    updateDeliveryDetails()
  })

  async function addCertificate() {
    if (isLoadingCert.value) return

    isLoadingCert.value = true
    certificateError.value = ""

    const code = newCertificateCode.value.trim()

    if (!code) {
      certificateError.value = "Введите код сертификата"
      isLoadingCert.value = false
      return
    }

    if (userStore.user?.certificates.some((c: Certificate) => c.code === code)) {
      certificateError.value = "Сертификат уже добавлен"
      isLoadingCert.value = false
      return
    }

    const token = await userStore.loadToken()

    try {
      const response = await $fetch<ApiResponse & { certificates: Certificate[] }>(
        "https://back.casaalmare.com/api/addCertificate",
        {
          method: "POST",
          body: { token, code },
        },
      )

      if (response.success && response.certificates) {
        if (userStore.user) {
          userStore.user.certificates = response.certificates

          if (!selectedCertificates.value.includes(code)) {
            const newCert = response.certificates.find((c: Certificate) => c.code === code)
            if (newCert && newCert.value_now <= goodsSum.value && selectedCertificates.value.length === 0) {
              selectedCertificates.value.push(code)
            }
          }
        }

        newCertificateCode.value = ""
        certificateError.value = ""
        await nextTick()
        debouncedUpdateOrderState()
      } else {
        certificateError.value = response.error || "Сертификат не найден"
      }
    } catch (error) {
      certificateError.value = "Ошибка сети или API"
      console.error(error)
    } finally {
      isLoadingCert.value = false
    }
  }

  function toggleCert() {
    isExpandedCert.value = !isExpandedCert.value
  }

  async function refreshCityForUI() {
    let targetCity: CityData | null = null
    if (orderState.value.city) {
      targetCity = orderState.value.city
    } else if (userStore.user?.profile?.extended?.city) {
      targetCity = userStore.user.profile.extended.city
    } else if (userStore.user?.city) {
      targetCity = userStore.user.city
    }

    if (!targetCity || targetCity.label === "" || targetCity === false) {
      city.value = null
    } else if (targetCity && targetCity !== city.value) {
      city.value = targetCity
      await nextTick()
    }

    if (city.value) {
      await loadCdekData()
      await nextTick()
      if (deliveryMethod.value) {
        updateDeliveryDetails()
      }
    }
  }

  function priceFormatter(value: number): string {
    const formattedValue = new Intl.NumberFormat("ru-RU").format(Math.round(value))
    return `${formattedValue} ₽`
  }

  watchEffect(() => {
    let newAddresses: string[] = []

    if (userStore?.user?.profile?.address && Array.isArray(userStore.user.profile.address)) {
      const [adr1, adr2] = userStore.user.profile.address
      if (adr1?.trim()) {
        const mainAddress = adr2?.trim() ? `${adr1.trim()}, ${adr2.trim()}` : adr1.trim()
        newAddresses = [mainAddress]
      }
    }

    if (userStore?.user?.profile.extended.addresses && Array.isArray(userStore.user.profile.extended.addresses)) {
      const extendedAddresses = userStore.user.profile.extended.addresses
        .filter((addr) => Array.isArray(addr) && addr[0]?.trim())
        .map((addr) => {
          const [adr1, adr2] = addr
          return adr2?.trim() ? `${adr1.trim()}, ${adr2.trim()}` : adr1.trim()
        })
        .filter((addr) => !newAddresses.includes(addr))

      newAddresses = [...newAddresses, ...extendedAddresses]
    }

    addresses.value = newAddresses
  })

  watch(
    () => userStore.city,
    (newCity) => {
      if (!newCity || newCity.label === "" || newCity === false) {
        if (city.value) city.value = null
      } else if (newCity && !city.value) {
        city.value = newCity
      }
    },
    { immediate: true },
  )

  watch(
    () => city.value,
    async (newCity) => {
      if (newCity) {
        await loadCdekData()
        if (deliveryMethod.value) {
          updateDeliveryDetails()
        }
      }
    },
    { immediate: true, deep: true },
  )

  const hasGoods = computed(() => goodsSum.value > 0)

  watch(
    () => userStore.user?.profile?.extended?.city,
    (newCity) => {
      if (!newCity || newCity.label === "" || newCity === false) {
        if (city.value) city.value = null
      } else if (newCity && !city.value) {
        city.value = newCity
      }
    },
    { immediate: true, deep: true },
  )

  function updateDeliveryDetails() {
    if (!needsDelivery.value) {
      deliveryCost.value = 0
      deliveryTime.value = null
      deliveryMethod.value = null
      city.value = null
      currentAddress.value = null
      selectedPvz.value = null
      return
    }

    if (!hasGoods.value) {
      deliveryCost.value = 0
      return
    }

    const methodId = Number(deliveryMethod.value)
    const type = deliveryTypes.value.find((t) => t.id === methodId)

    if (type) {
      if (type.term && type.term.min !== undefined && type.term.max !== undefined) {
        deliveryTime.value = `${type.term.min}-${type.term.max}`
      } else if (type.isExpress) {
        deliveryTime.value = null
      } else {
        deliveryTime.value = null
      }
      deliveryCost.value = type.cost || 0

      if (methodId === 4 && selectedPvz.value && selectedPvz.value.price) {
        deliveryCost.value = selectedPvz.value.price
      }
    } else {
      deliveryTime.value = null
      deliveryCost.value = 0
    }

    if (totalSum.value >= 30000) {
      deliveryCost.value = 0
    }
  }

  watch(deliveryMethod, () => {
    updateDeliveryDetails()
    debouncedUpdateOrderState()
  })

  watch(
    () => deliveryTypes.value,
    () => {
      if (deliveryMethod.value) {
        updateDeliveryDetails()
      }
    },
    { deep: true },
  )

  watch(
    () => authStore.isAuth,
    (newVal) => {
      if (newVal) resetGuestAuth()
    },
  )

  watch(
    [
      deliveryMethod,
      city,
      currentAddress,
      commentForCourier,
      paymentMethod,
      pointsToUse,
      selectedCertificates,
      selectedPvz,
      name,
      surname,
      phone,
      email,
      () => authStore.isAuth,
      deliveryTime,
      deliveryCost,
    ],
    () => {
      if (!isLoaded.value) return
      debouncedUpdateOrderState()
    },
    { deep: true },
  )

  watch(
    [addresses, deliveryMethod],
    ([newAddresses, newDeliveryMethod]) => {
      const isCourierMethod = ["1", "2", "3"].includes(newDeliveryMethod || "")
      if (newAddresses.length === 0 && isCourierMethod && !currentAddress.value) {
        currentAddress.value = "Новый адрес"
      }
    },
    { immediate: true, deep: true },
  )

  return {
    cartItems,
    addresses,
    city,
    hasGoods,
    commentForCourier,
    currentAddress,
    deliveryMethod,
    newAddressFirstLine,
    newAddressSecondLine,
    showErrorDeliveryMethod,
    errorDeliveryMethod,
    isPaymentSuccessful,
    paymentMethod,
    showErrorPaymentMethod,
    isLoadingPayment,
    paymentMethods,
    isExpandedPoints,
    pendingPoints,
    pointsError,
    pointsToUse,
    isLoadingPoints,
    certificateError,
    isExpandedCert,
    newCertificateCode,
    selectedCertificates,
    isLoadingCert,
    email,
    name,
    goodsSum,
    certsInCartSum,
    resetOrder,
    phone,
    surname,
    orderState,
    cartDetailed,
    totalOldSum,
    totalSum,
    finalPrice,
    orderId,
    isGuestAuthStep,
    guestLoginType,
    guestSmsCode,
    guestAuthError,
    showErrorAuth,
    isGuestAuthLoading,
    guestRemainingSeconds,
    showGuestAuthError,
    guestNextCode,
    guestSmsError,
    showGuestSmsError,
    guestAuthButtonContent,
    guestAuthButtonDisabled,
    guestSmsButtonContent,
    guestSmsButtonDisabled,
    loadPaymentMethods,
    startGuestCountdown,
    resetGuestAuth,
    loadUserData,
    loadOrderState,
    decrementQuantity,
    incrementQuantity,
    removeItemFromCart,
    setCartItems,
    saveNewAddress,
    getPaymentData,
    checkOrderStatus,
    cdekData,
    deliveryTypes,
    deliveryTime,
    deliveryCost,
    isMoscow,
    loadCdekData,
    updateDeliveryDetails,
    isWidgetOpen,
    selectedPvz,
    applyPoints,
    togglePoints,
    addCertificate,
    refreshCityForUI,
    toggleCert,
    priceFormatter,
    needsDelivery,
    parseCart,
    availablePoints,
  }
})
