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

interface PvzData {
  address: string
  [key: string]: any // Для других полей от CDEK (код, координаты и т.д.)
}

interface PointsResponse {
  success: boolean
  points: number
}

interface CityData {
  label: string
  name: string
  kladr: string
  fias: string
  region?: string
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

// interface PromoResponse { //   success: boolean //   promo: PromoCode // }

interface CheckOrderStatusResponse {
  success: boolean
  order?: OrderState
  error?: string
  orderId?: number
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
  addresses?: string[]
}

export interface OrderState {
  deliveryMethod?: string | null
  city?: CityData | null
  currentAddress?: string | null
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
      variant: string // Только размер
      count: number
      updated_at: number | null
      name: string
      colorName: string // Название цвета
      sizes: string[]
      images: Record<number, string>
      vector: Record<string, { quantity: number; comingSoon: number }>
      type: string
      material: string[]
      useType: string[]
      colors: any[] // Пустой массив
      price: string // На верхнем уровне
      oldPrice: string // На верхнем уровне
    }
  >
}
interface PaymentMethodsResponse {
  success: boolean
  data: Record<string, string>
}

export type CartItem = {
  id: number
  variant: string // Только размер (XS/S, S/M и т.д.)
  count: number
  updated_at?: number
  name: string
  colorName: string // Название цвета из API
  sizes: string[]
  images: Record<number, string>
  vector: Record<string, { quantity: number; comingSoon: boolean }>
  type: string
  material: string[]
  useType: string[]
  price: number // На верхнем уровне
  oldPrice: number // На верхнем уровне
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
  const currentAddress = ref<string | null>(null)
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

  // ЗАКОММЕНТИРОВАНО: промокоды
  // const addPromoCodeError = ref<string>("")
  // const currentPromoCodes = ref<PromoCode[]>([])
  // const isExpandedPromoCode = ref<boolean>(false)
  // const pendingPromoCode = ref<string | null>(null)
  // const promoCode = ref<string>("")
  // const selectedPromoCode = ref<string | null>(null)
  // const isLoadingPromo = ref<boolean>(false)

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
    courier_prim: { price: number; term: { min: number; max: number } }
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
      const { data: pointsData, error } = await useFetch<PointsResponse>("https://back.casaalmare.com/api/getPoints", {
        method: "POST",
        body: { token },
      })

      if (error.value) {
        console.error("Network error loading points:", error.value)
        return
      }

      if (userStore.user?.profile?.extended.city?.label && !city.value) {
        city.value = userStore.user.profile.extended.city
      }

      if (!city.value) {
        try {
          const response = await $fetch<CityData>("https://back.casaalmare.com/api/getCityByIP")
          if (response && response.name) {
            city.value = response
          }
        } catch (error) {
          console.error("Ошибка определения города по IP:", error)
        }
      }

      if (pointsData.value?.success && pointsData.value.points !== undefined) {
        if (userStore.user) {
          userStore.user.points = pointsData.value.points
        }
      }

      let allAddresses: string[] = []
      if (userStore.user?.profile?.address && userStore.user.profile.address.trim()) {
        const mainAddress = userStore.user.profile.address.trim()
        allAddresses = [mainAddress]
      }
      if (userStore.user?.addresses && Array.isArray(userStore.user.addresses)) {
        const extendedAddresses = userStore.user.addresses.filter(
          (addr) => addr.trim() && addr !== userStore.user?.profile?.address?.trim(),
        )
        allAddresses = [...allAddresses, ...extendedAddresses]
      }
      addresses.value = allAddresses
    } catch (error) {
      console.error("Ошибка загрузки user data:", error)
    }
  }

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

        // Новое: всегда переинициализируем полный массив перед обновлением
        deliveryTypes.value = [
          { id: 1, name: "Курьер СДЭК", term: { min: 0, max: 0 }, cost: 0 },
          { id: 2, name: "Курьер СДЭК с примеркой", term: { min: 0, max: 0 }, cost: 0 },
          { id: 3, name: "Экспресс-доставка", isExpress: true },
          { id: 4, name: "СДЭК (ПВЗ)", term: { min: 0, max: 0 }, cost: 0 },
        ]

        // Обновляем типы доставки только если данные валидны
        if (data.courier && data.courier.term && typeof data.courier.price === "number") {
          updateDeliveryType(1, data.courier.term, data.courier.price)
        }
        if (data.courier_prim && data.courier_prim.term && typeof data.courier_prim.price === "number") {
          updateDeliveryType(2, data.courier_prim.term, data.courier_prim.price)
        }
        if (data.pvz && data.pvz.term && typeof data.pvz.price === "number") {
          updateDeliveryType(4, data.pvz.term, data.pvz.price)
        }

        isMoscow.value = city.value.name.toLowerCase().includes("москва")
        if (!isMoscow.value) {
          deliveryTypes.value = deliveryTypes.value.filter((type) => type.id !== 3)
        }

        // Новое: если выбранный метод больше недоступен (например, экспресс в не-Москве), сбрасываем выбор
        if (deliveryMethod.value && !deliveryTypes.value.some((t) => t.id === Number(deliveryMethod.value))) {
          deliveryMethod.value = null
          deliveryTime.value = null
          deliveryCost.value = 0
        }

        // Принудительно обновляем детали после загрузки данных
        await nextTick()
        updateDeliveryDetails()
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
        if (loadedOrder.city) {
          city.value = loadedOrder.city
        } else if (userStore.user?.profile?.extended.city) {
          city.value = userStore.user.profile.extended.city
        } else if (!city.value) {
        }
        if (loadedOrder.currentAddress) currentAddress.value = loadedOrder.currentAddress
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
          if (loadedOrder.userInfo.addresses) addresses.value = loadedOrder.userInfo.addresses
        }

        orderState.value = loadedOrder
        console.log("Order state loaded successfully:", loadedOrder)
      } else {
        console.error("Server error loading order state:", data.value?.error)
      }
    } catch (error) {
      console.error("Ошибка загрузки состояния заказа:", error)
    } finally {
      isLoaded.value = true
      if (city.value) {
        await loadCdekData()
        updateDeliveryDetails()
      }
    }
  }

  const updateOrderState = async () => {
    if (isPaymentSuccessful.value !== null) return

    const token = await userStore.loadToken()
    if (!token) return

    const orderStateObj: Partial<OrderState> = {
      deliveryMethod: deliveryMethod.value,
      deliveryTime: deliveryTime.value, // Теперь строка или null
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
    return cartItems.value.map((cartItem) => {
      if (!cartItem.variant) return

      const size = cartItem.variant // Теперь variant - это размер
      const colorName = cartItem.colorName || "Цвет не указан" // Значение по умолчанию

      // Получаем массив изображений из объекта images
      const imagesArray = Object.values(cartItem.images).filter((img) => img) // Фильтруем пустые

      return {
        id: cartItem.id,
        vector: cartItem.variant,
        count: cartItem.count,
        name: cartItem.name,
        color: colorName,
        images: imagesArray,
        size,
        price: cartItem.price,
        oldPrice: cartItem.oldPrice,
      }
    })
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
    let price = totalSum.value

    if (pointsToUse.value > 0 && userStore.user) {
      price -= Math.min(pointsToUse.value, price)
    }

    if (selectedCertificates.value.length > 0 && userStore.user) {
      const certSum = selectedCertificates.value.reduce((sum, code) => {
        const cert = userStore.user!.certificates.find((c) => c.code === code)
        return cert ? sum + cert.value_now : sum
      }, 0)
      price -= Math.min(certSum, price)
    }

    let deliveryFee = deliveryCost.value
    if (totalSum.value >= 30000) {
      deliveryFee = 0
    }
    price += deliveryFee

    return Math.max(price, 0.01)
  })

  async function syncCartToBackend() {
    const token = await userStore.loadToken()
    if (!token) return

    try {
      const backendItems = cartItems.value.map((item) => ({
        id: item.id,
        variant: item.variant,
        count: item.count,
      }))
      const { data, error } = await useFetch<UpdateCartResponse>("https://back.casaalmare.com/api/updateCart", {
        method: "POST",
        body: {
          token,
          items: backendItems,
        },
      })

      if (error.value) {
        console.error("Network error syncing cart:", error.value)
        return
      }

      if (data.value?.success && data.value?.cart) {
        const rawCart = data.value.cart
        const parsedCart: CartItem[] = Object.entries(rawCart).map(([_, item]) => ({
          id: item.id,
          variant: item.variant, // Только размер
          count: item.count,
          updated_at: item.updated_at,
          name: item.name,
          colorName: item.colorName || "", // Добавляем значение по умолчанию
          sizes: item.sizes,
          images: item.images,
          vector: item.vector,
          type: item.type,
          material: item.material,
          useType: item.useType,
          price: parseInt(item.price) || 0,
          oldPrice: parseInt(item.oldPrice) || 0,
        }))
        setCartItems(parsedCart)
      } else {
        console.error("Server error syncing cart:", data.value?.error)
      }
    } catch (error) {
      console.error("Ошибка синхронизации корзины:", error)
    }
  }

  function decrementQuantity(id: number, variant: string) {
    const item = cartItems.value.find((i) => i.id === id && i.variant === variant)
    if (item && item.count > 1) {
      item.count--
      syncCartToBackend()
    }
  }

  function incrementQuantity(id: number, variant: string) {
    const item = cartItems.value.find((i) => i.id === id && i.variant === variant)
    if (item) {
      item.count++
      syncCartToBackend()
    }
  }

  function removeItemFromCart(id: number, variant: string) {
    cartItems.value = cartItems.value.filter((item) => !(item.id === id && item.variant === variant))
    syncCartToBackend()
  }

  function setCartItems(items: CartItem[] | null | undefined) {
    cartItems.value = Array.isArray(items) ? items : []
  }

  async function saveNewAddress() {
    const firstLine = newAddressFirstLine.value.trim()
    const secondLine = newAddressSecondLine.value.trim()

    if (!firstLine) return

    const newAddress = secondLine ? `${firstLine}, ${secondLine}` : firstLine

    if (authStore.isAuth) {
      // Авторизованный: сохраняем через API в user.extended
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
          // Сначала добавляем в addresses.value
          if (!addresses.value.includes(newAddress)) {
            addresses.value.push(newAddress)
          }

          // Затем обновляем currentAddress
          currentAddress.value = newAddress
          newAddressFirstLine.value = ""
          newAddressSecondLine.value = ""

          // Синхронизируем с user.extended
          if (userStore.user) {
            if (!userStore.user.extended) {
              userStore.user.extended = { addresses: [] }
            }
            if (!userStore.user.extended.addresses) {
              userStore.user.extended.addresses = []
            }
            // Обновляем user.extended.addresses из addresses.value
            userStore.user.extended.addresses = [...addresses.value]
          }
        } else {
          console.error("Ошибка сохранения адреса:", data.value?.error)
        }
      } catch (error) {
        console.error("Ошибка API saveAddress:", error)
      }
    } else {
      // Гость: сохраняем локально и в orderState
      if (!addresses.value.includes(newAddress)) {
        addresses.value.push(newAddress)
      }
      currentAddress.value = newAddress
      newAddressFirstLine.value = ""
      newAddressSecondLine.value = ""
      debouncedUpdateOrderState()
    }
  }

  function resetOrder() {
    // Сбрасываем все состояния, связанные с заказом
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

    // ЗАКОММЕНТИРОВАНО: промокоды
    // addPromoCodeError.value = ""
    // currentPromoCodes.value = []
    // isExpandedPromoCode.value = false
    // pendingPromoCode.value = null
    // promoCode.value = ""
    // selectedPromoCode.value = null

    isExpandedPoints.value = false
    pendingPoints.value = ""
    pointsError.value = ""
    pointsToUse.value = 0
    usedPointsBackup.value = 0

    certificateError.value = ""
    isExpandedCert.value = false
    newCertificateCode.value = ""
    selectedCertificates.value = []

    // Не сбрасываем пользовательские данные
    // email.value = ""
    // name.value = ""
    // phone.value = null
    // surname.value = ""

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
        isPaymentSuccessful.value = data.value.success // true/false

        // Если success=true, загружаем данные
        if (data.value.success && data.value.order) {
          // Восстанавливаем состояние заказа (аналогично loadOrderState)
          const loadedOrder = data.value.order
          if (data.value.orderId) orderId.value = data.value.orderId

          if (loadedOrder.deliveryMethod) deliveryMethod.value = loadedOrder.deliveryMethod
          if (loadedOrder.city) city.value = loadedOrder.city
          if (loadedOrder.currentAddress) currentAddress.value = loadedOrder.currentAddress
          if (loadedOrder.commentForCourier) commentForCourier.value = loadedOrder.commentForCourier
          if (loadedOrder.paymentMethod) paymentMethod.value = loadedOrder.paymentMethod
          // ЗАКОММЕНТИРОВАНО: промокоды
          // if (loadedOrder.promoCode) selectedPromoCode.value = loadedOrder.promoCode
          if (loadedOrder.points !== undefined) {
            pointsToUse.value = loadedOrder.points
            if (userStore.user) userStore.user.points += usedPointsBackup.value - loadedOrder.points
          }
          if (loadedOrder.certificates) selectedCertificates.value = loadedOrder.certificates

          // ЗАКОММЕНТИРОВАНО: промокоды
          // if (loadedOrder.promoCodes && Array.isArray(loadedOrder.promoCodes)) {
          //   currentPromoCodes.value = loadedOrder.promoCodes
          // }
          // if (loadedOrder.pendingPromoCode) {
          //   pendingPromoCode.value = loadedOrder.pendingPromoCode
          // }

          if (!authStore.isAuth && loadedOrder.userInfo) {
            if (loadedOrder.userInfo.name) name.value = loadedOrder.userInfo.name
            if (loadedOrder.userInfo.surname) surname.value = loadedOrder.userInfo.surname
            if (loadedOrder.userInfo.phone) phone.value = loadedOrder.userInfo.phone
            if (loadedOrder.userInfo.email) email.value = loadedOrder.userInfo.email
            if (loadedOrder.userInfo.addresses) addresses.value = loadedOrder.userInfo.addresses
          }

          // Синхронизируем корзину
          if (data.value.cart) {
            const parsedCart: CartItem[] = Object.entries(data.value.cart).map(([_, item]) => ({
              id: item.id,
              variant: item.variant, // Только размер
              count: item.count,
              updated_at: item.updated_at,
              name: item.name,
              colorName: item.colorName || "", // Добавляем значение по умолчанию
              sizes: item.sizes,
              images: item.images,
              vector: item.vector,
              type: item.type,
              material: item.material,
              useType: item.useType,
              price: parseInt(item.price) || 0,
              oldPrice: parseInt(item.oldPrice) || 0,
            }))
            setCartItems(parsedCart)
          }
          if (!data.value.success) {
            isWidgetOpen.value = false
          }
        }
        return data.value
      }
    } catch (error) {
      console.error("Ошибка проверки статуса заказа:", error)
    }
    return null
  }

  // ЗАКОММЕНТИРОВАНО: промокоды
  // async function addPromoCode() {
  //   if (isLoadingPromo.value) return
  //
  //   isLoadingPromo.value = true
  //   addPromoCodeError.value = ""
  //
  //   const code = promoCode.value.trim()
  //
  //   if (!code) {
  //     addPromoCodeError.value = "Введите промокод"
  //     isLoadingPromo.value = false
  //     return
  //   }
  //
  //   const token = await userStore.loadToken()
  //
  //   try {
  //     const { data, error } = await useFetch<PromoResponse>("https://back.casaalmare.com/api/checkPromoCode", {
  //       method: "POST",
  //       body: { token, code },
  //     })
  //
  //     if (error.value) {
  //       addPromoCodeError.value = "Ошибка сети"
  //       isLoadingPromo.value = false
  //       return
  //     }
  //
  //     if (data.value?.success && data.value.promo) {
  //       const alreadyAdded = currentPromoCodes.value.some((p) => p.code === data.value!.promo.code)
  //
  //       if (!alreadyAdded) {
  //         currentPromoCodes.value.push(data.value.promo)
  //         promoCode.value = ""
  //         addPromoCodeError.value = ""
  //         updateOrderState()
  //       } else {
  //         addPromoCodeError.value = "Промокод уже добавлен"
  //       }
  //     } else {
  //       addPromoCodeError.value = "Промокод не найден"
  //     }
  //   } catch (error) {
  //     addPromoCodeError.value = "Ошибка проверки промокода"
  //     console.error(error)
  //   } finally {
  //     isLoadingPromo.value = false
  //   }
  // }

  // ЗАКОММЕНТИРОВАНО: промокоды
  // function applyPromoCode() {
  //   if (!pendingPromoCode.value) {
  //     return
  //   }
  //
  //   selectedPromoCode.value = pendingPromoCode.value
  //
  //   if (pointsToUse.value > 0 && userStore.user) {
  //     userStore.user.points += pointsToUse.value
  //   }
  //   pointsToUse.value = 0
  //   pendingPoints.value = ""
  //
  //   pendingPromoCode.value = null
  //
  //   updateOrderState()
  // }

  // ЗАКОММЕНТИРОВАНО: промокоды
  // function savedMoney(promoValue: number): number {
  //   const promo = currentPromoCodes.value.find((p) => p.value === promoValue)
  //   if (!promo) return 0
  //
  //   const sumWithoutDiscount = cartDetailed.value.reduce((sum, item) => {
  //     const isNonDiscounted = item.oldPrice === 0 || item.oldPrice === item.price
  //     return isNonDiscounted ? sum + item.price * item.count : sum
  //   }, 0)
  //
  //   if (promo.percent) {
  //     return Math.round(sumWithoutDiscount * promo.value)
  //   } else {
  //     return Math.min(promo.value, sumWithoutDiscount)
  //   }
  // }

  // ЗАКОММЕНТИРОВАНО: промокоды
  // function togglePromoCode() {
  //   isExpandedPromoCode.value = !isExpandedPromoCode.value
  // }

  async function applyPoints() {
    if (isLoadingPoints.value) return

    isLoadingPoints.value = true
    pointsError.value = ""

    // ЗАКОММЕНТИРОВАНО: промокоды
    // selectedPromoCode.value = null
    // pendingPromoCode.value = null

    const points = Number(pendingPoints.value)

    if (isNaN(points) || points <= 0) {
      pointsError.value = "Введите корректное количество баллов"
      isLoadingPoints.value = false
      return
    }

    const maxPoints = Math.floor(totalSum.value * 0.2)

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
    pointsToUse.value = points
    if (userStore.user) {
      userStore.user.points -= points
    }
    pendingPoints.value = ""

    isLoadingPoints.value = false
  }

  function togglePoints() {
    isExpandedPoints.value = !isExpandedPoints.value
  }

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
      const { data, error } = await useFetch<ApiResponse & { certificate: Certificate }>(
        "https://back.casaalmare.com/api/addCertificate",
        {
          method: "POST",
          body: { token, code },
        },
      )

      if (error.value) {
        certificateError.value = "Ошибка сети"
        isLoadingCert.value = false
        return
      }

      if (data.value?.success && data.value?.certificate) {
        if (userStore.user) {
          if (!userStore.user.certificates) {
            userStore.user.certificates = []
          }
          userStore.user.certificates.push(data.value.certificate)
        }
        newCertificateCode.value = ""
        certificateError.value = ""
      } else {
        certificateError.value = data.value?.error || "Сертификат не найден"
      }
    } catch (error) {
      certificateError.value = "Ошибка API"
      console.error(error)
    } finally {
      isLoadingCert.value = false
    }
  }

  function toggleCert() {
    isExpandedCert.value = !isExpandedCert.value
  }

  function priceFormatter(value: number): string {
    const formattedValue = new Intl.NumberFormat("ru-RU").format(Math.round(value))
    return `${formattedValue} ₽`
  }

  watchEffect(() => {
    let newAddresses: string[] = []
    if (userStore?.user?.profile?.address && userStore.user.profile.address.trim()) {
      const mainAddress = userStore.user.profile.address.trim()
      newAddresses = [mainAddress]
    }
    if (userStore?.user?.addresses && Array.isArray(userStore.user.addresses)) {
      const extendedAddresses = userStore.user.addresses.filter(
        (addr) => addr.trim() && addr !== userStore?.user?.profile?.address?.trim(),
      )
      newAddresses = [...newAddresses, ...extendedAddresses]
    }
    addresses.value = newAddresses
  })

  watch(
    () => userStore.city,
    (newCity) => {
      if (newCity && !city.value) {
        city.value = newCity
      }
    },
    { immediate: true },
  )

  watch(
    () => city.value,
    async (newCity) => {
      if (newCity) {
        await loadCdekData() // Уже было, но теперь с улучшенной логикой внутри
        // Принудительно обновляем метод доставки, если он был выбран ранее
        if (deliveryMethod.value) {
          updateDeliveryDetails()
        }
      }
    },
    { immediate: true, deep: true },
  )

  function updateDeliveryDetails() {
    const methodId = Number(deliveryMethod.value)
    const type = deliveryTypes.value.find((t) => t.id === methodId)

    if (type) {
      if (type.term && type.term.min !== undefined && type.term.max !== undefined) {
        deliveryTime.value = `${type.term.min}-${type.term.max}` // Новое: формируем строку периода
      } else if (type.isExpress) {
        deliveryTime.value = null // Для экспресса — null
      } else {
        deliveryTime.value = null // По умолчанию null, если term отсутствует
      }
      deliveryCost.value = type.cost || 0

      // Специально для ПВЗ (id=4): если selectedPvz есть, можно скорректировать цену
      if (methodId === 4 && selectedPvz.value && selectedPvz.value.price) {
        deliveryCost.value = selectedPvz.value.price
      }
    } else {
      deliveryTime.value = null
      deliveryCost.value = 0
    }

    // Применяем логику бесплатной доставки
    if (totalSum.value >= 30000) {
      deliveryCost.value = 0
    }
  }

  watch(deliveryMethod, () => {
    updateDeliveryDetails()
    debouncedUpdateOrderState()
  })

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

  return {
    cartItems,
    addresses,
    city,
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
    // ЗАКОММЕНТИРОВАНО: промокоды
    // addPromoCodeError,
    // currentPromoCodes,
    // isExpandedPromoCode,
    // pendingPromoCode,
    // promoCode,
    // selectedPromoCode,
    // isLoadingPromo,
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
    // ЗАКОММЕНТИРОВАНО: промокоды
    // addPromoCode,
    // applyPromoCode,
    // savedMoney,
    // togglePromoCode,
    selectedPvz,
    applyPoints,
    togglePoints,
    addCertificate,
    toggleCert,
    priceFormatter,
  }
})
