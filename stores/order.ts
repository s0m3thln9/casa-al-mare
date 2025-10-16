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

interface PromoCode {
  code: string
  value: number
  percent: boolean
}

interface CheckOrderStatusResponse {
  success: boolean
  order?: OrderState
  error?: string
  orderId?: number
  cart?: Record<string, CartItem>
}

// interface PromoResponse {
//   success: boolean
//   promo: PromoCode
// }

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
  city?: string | null
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
  cart: Record<string, CartItem>
}

export type CartItem = {
  id: number
  variant: string
  count: number
  updated_at?: number
  name: string
  colors: Record<string, { name: string; value: string; images: number[] }>
  sizes: string[]
  images: Record<number, string>
  vector: Record<string, { oldPrice: number; price: number; quantity: number; comingSoon: boolean }>
  type: string
  material: string[]
  useType: string[]
}

export const useOrderStore = defineStore("order", () => {
  const userStore = useUserStore()
  const authStore = useAuthStore()

  const cartItems = ref<CartItem[]>([])

  const addresses = ref<string[]>([])
  const city = ref<string | null>(null)
  const commentForCourier = ref("")
  const currentAddress = ref<string | null>(null)
  const deliveryMethod = ref<string | null>(null)
  const newAddressFirstLine = ref("")
  const newAddressSecondLine = ref("")
  const showErrorDeliveryMethod = ref<boolean>(false)

  const isPaymentSuccessful = ref<boolean | null>(null)
  const paymentMethod = ref<string | null>(null)
  const showErrorPaymentMethod = ref<boolean>(false)
  const isLoadingPayment = ref<boolean>(false)

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

        // ИСПРАВЛЕНО: Сохраняем ID заказа
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

        orderState.value = loadedOrder
        console.log("Order state loaded successfully:", loadedOrder)
      } else {
        console.error("Server error loading order state:", data.value?.error)
      }
    } catch (error) {
      console.error("Ошибка загрузки состояния заказа:", error)
    } finally {
      isLoaded.value = true
    }
  }

  const updateOrderState = async () => {
    if (isPaymentSuccessful.value !== null) return

    const token = await userStore.loadToken()
    if (!token) return

    const orderStateObj: Partial<OrderState> = {
      deliveryMethod: deliveryMethod.value,
      city: city.value,
      currentAddress: currentAddress.value,
      commentForCourier: commentForCourier.value,
      paymentMethod: paymentMethod.value,
      // ЗАКОММЕНТИРОВАНО: промокоды
      // promoCode: selectedPromoCode.value,
      points: pointsToUse.value,
      certificates: selectedCertificates.value,
      // ЗАКОММЕНТИРОВАНО: промокоды
      // promoCodes: currentPromoCodes.value,
      // pendingPromoCode: pendingPromoCode.value,
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
      const [colorKey, size] = cartItem.variant.split("_")
      const vectorData = cartItem.vector[cartItem.variant] ?? {
        price: 0,
        oldPrice: 0,
      }
      const colorData = cartItem.colors[colorKey] ?? { name: "", images: [] }

      return {
        id: cartItem.id,
        vector: cartItem.variant,
        count: cartItem.count,
        name: cartItem.name,
        color: colorData.name,
        images: (colorData.images ?? []).map((id) => cartItem.images[id] ?? "") ?? [],
        size,
        price: vectorData.price,
        oldPrice: vectorData.oldPrice,
      }
    })
  })

  const totalOldSum = computed(() => {
    return cartItems.value.reduce((sum, cartItem) => {
      const vectorData = cartItem.vector[cartItem.variant]
      if (!vectorData) return sum
      return sum + (vectorData.oldPrice > 0 ? vectorData.oldPrice : vectorData.price) * cartItem.count
    }, 0)
  })

  const totalSum = computed(() => {
    return cartItems.value.reduce((sum, cartItem) => {
      const vectorData = cartItem.vector[cartItem.variant]
      if (!vectorData) return sum
      return sum + vectorData.price * cartItem.count
    }, 0)
  })

  const finalPrice = computed(() => {
    let price = totalSum.value

    // ЗАКОММЕНТИРОВАНО: промокоды
    // if (selectedPromoCode.value) {
    //   const promo = currentPromoCodes.value.find((p) => p.code === selectedPromoCode.value)
    //   if (promo) {
    //     const sumWithoutDiscount = cartDetailed.value.reduce((sum, item) => {
    //       const isNonDiscounted = item.oldPrice === 0 || item.oldPrice === item.price
    //       return isNonDiscounted ? sum + item.price * item.count : sum
    //     }, 0)
    //
    //     if (promo.percent) {
    //       price -= sumWithoutDiscount * promo.value
    //     } else {
    //       price -= Math.min(promo.value, sumWithoutDiscount)
    //     }
    //   }
    // }

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
          variant: item.variant,
          count: item.count,
          updated_at: item.updated_at,
          name: item.name,
          colors: item.colors,
          sizes: item.sizes,
          images: item.images,
          vector: item.vector,
          type: item.type,
          material: item.material,
          useType: item.useType,
        }))
        setCartItems(parsedCart) // Синхронизируем клиент с сервером
        console.log("Cart synced from server:", parsedCart) // Для дебага
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
    newAddressFirstLine.value = ""
    newAddressSecondLine.value = ""
    showErrorDeliveryMethod.value = false

    isPaymentSuccessful.value = null
    paymentMethod.value = null
    showErrorPaymentMethod.value = false

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
  }

  async function createOrder() {
    if (isLoadingPayment.value) return

    if (cartItems.value.length === 0) {
      return
    }

    if (!orderId.value) {
      console.error("Нет ID заказа для оплаты")
      return
    }

    isLoadingPayment.value = true
    const token = await userStore.loadToken()

    if (!token) {
      isLoadingPayment.value = false
      return
    }

    usedPointsBackup.value = pointsToUse.value

    try {
      const { data, error } = await useFetch<ApiResponse>("https://back.casaalmare.com/api/createOrder", {
        method: "POST",
        body: {
          token,
          orderId: orderId.value,
        },
      })

      if (error.value) {
        console.error("Network error during payment:", error.value)
        return
      }

      if (data.value?.success) {
        await navigateTo(`/order-result/${orderId.value}`)
        resetOrder()
      } else {
        console.error("Ошибка создания заказа:", data.value?.error)
      }
    } catch (error) {
      console.error("Ошибка оплаты:", error)
    } finally {
      isLoadingPayment.value = false
    }
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
              variant: item.variant,
              count: item.count,
              updated_at: item.updated_at,
              name: item.name,
              colors: item.colors,
              sizes: item.sizes,
              images: item.images,
              vector: item.vector,
              type: item.type,
              material: item.material,
              useType: item.useType,
            }))
            setCartItems(parsedCart)
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
    console.log("WatchEffect: Addresses updated:", addresses.value)
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
      // ЗАКОММЕНТИРОВАНО: промокоды
      // selectedPromoCode,
      pointsToUse,
      selectedCertificates,
      // ЗАКОММЕНТИРОВАНО: промокоды
      // currentPromoCodes,
      // pendingPromoCode,
      name,
      surname,
      phone,
      email,
      () => authStore.isAuth,
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
    startGuestCountdown,
    resetGuestAuth,
    loadUserData,
    loadOrderState,
    decrementQuantity,
    incrementQuantity,
    removeItemFromCart,
    setCartItems,
    saveNewAddress,
    createOrder,
    checkOrderStatus,
    // ЗАКОММЕНТИРОВАНО: промокоды
    // addPromoCode,
    // applyPromoCode,
    // savedMoney,
    // togglePromoCode,
    applyPoints,
    togglePoints,
    addCertificate,
    toggleCert,
    priceFormatter,
  }
})
