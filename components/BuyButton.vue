<script setup lang="ts">
const props = defineProps<{
  isParametersSelected?: boolean
  inStock?: boolean
  availableQuantity?: boolean
  items?: Array<{ id: number; size: string }>
  id?: number
  size?: string
  missingParams?: string | null
}>()

const isLoading = ref(false)
const showSuccess = ref(false)
const isInCart = ref(false)
const errorMessage = ref("")
const showError = ref(false)
const userStore = useUserStore()
const orderStore = useOrderStore()

const styleBase =
  "flex justify-center items-center w-full py-4 border rounded-[18px] text-[13px]/snug font-[Manrope] sm:text-sm/snug "
const styleVariants = {
  default: "bg-[#211D1D] border-[#211D1D] text-[#FFFFFA] cursor-pointer hover:bg-[#F3A454] hover:border-[#F3A454]",
  preload: "bg-[#FFFFFA] border-[#F3A454] text-[#F3A454] cursor-default",
  success: "bg-[#FFF4A4] border-[#211D1D] text-[#211D1D] cursor-default",
  outOfStock: "bg-[#FFFFFA] border-[#8C8785] text-[#8C8785] cursor-default",
  notify: "bg-[#FFFFFA] border-[#211D1D] text-[#211D1D] cursor-pointer hover:bg-[#211D1D] hover:text-[#FFFFFA]",
}

const getMissingParamText = (param: string | null): string => {
  if (!param) return "Выберите все параметры"

  if (param === "size") return "Выберите размер"
  if (param === "all") return "Выберите все параметры"

  // Для динамических типов товаров из комплекта
  return `Выберите ${param.toLowerCase()}`
}

const currentState = computed(() => {
  let content: string
  let style: string
  let disabled: boolean

  if (!props.inStock) {
    content = "Нет в наличии"
    style = styleBase + styleVariants.outOfStock
    disabled = true
  } else if (!props.availableQuantity) {
    content = "Уведомить о размерах"
    style = styleBase + styleVariants.notify
    disabled = false
  } else if (props.isParametersSelected) {
    if (isLoading.value) {
      content = "Добавление..."
      style = styleBase + styleVariants.preload
      disabled = true
    } else if (showSuccess.value) {
      content = "Добавлено"
      style = styleBase + styleVariants.success
      disabled = true
    } else if (isInCart.value) {
      content = "Перейти в корзину"
      style = styleBase + styleVariants.default
      disabled = false
    } else {
      content = props.items ? "Добавить комплект в корзину" : "Добавить в корзину"
      style = styleBase + styleVariants.default
      disabled = false
    }
  } else {
    content = getMissingParamText(props.missingParams)
    style = styleBase + styleVariants.default
    disabled = false
  }

  return { content, style, disabled }
})

watch(
  [() => props.size, () => props.items],
  () => {
    showSuccess.value = false
    isInCart.value = false
    isLoading.value = false
    showError.value = false
  },
  { deep: true, immediate: false },
)

const handleClick = async () => {
  if (!props.inStock) return
  if (!props.availableQuantity) {
    alert("Уведомление о поступлении товара настроено")
    return
  }
  if (!props.isParametersSelected) {
    errorMessage.value = currentState.value.content
    showError.value = true
    return
  }
  if (isInCart.value) {
    navigateTo("/order")
    return
  }
  if (!isLoading.value && !showSuccess.value) {
    isLoading.value = true
    try {
      const token = await userStore.loadToken()

      let successfulCount = 0
      const totalItems = props.items ? props.items.length : 1

      if (props.items && props.items.length > 0) {
        const results = await Promise.allSettled(
          props.items.map((item) => {
            return $fetch("https://back.casaalmare.com/api/addToCart", {
              method: "POST",
              body: {
                id: item.id,
                size: item.size,
                count: 1,
                token: token,
              },
            })
          }),
        )

        for (let i = 0; i < results.length; i++) {
          const r = results[i]
          if (r.status === "fulfilled" && r.value?.success) {
            const item = props.items![i]
            const newItem: CartItem = { id: item.id, size: item.size, count: 1 }
            const existing = orderStore.cartItems.find((e: CartItem) => e.id === newItem.id && e.size === newItem.size)
            if (existing) {
              existing.count += 1
            } else {
              orderStore.cartItems.push(newItem)
            }
            successfulCount++
          }
        }

        const failedItems = totalItems - successfulCount
        if (failedItems === 0) {
          showSuccess.value = true
          setTimeout(() => {
            showSuccess.value = false
            isInCart.value = true
          }, 1500)
        } else {
          errorMessage.value = `Добавлено ${successfulCount} из ${totalItems} товаров`
          showError.value = true
        }
      } else {
        const response = await $fetch("https://back.casaalmare.com/api/addToCart", {
          method: "POST",
          body: {
            id: props.id,
            size: props.size,
            count: 1,
            token: token,
          },
        })
        if (response.success) {
          const newItem: CartItem = { id: props.id!, size: props.size!, count: 1 }
          const existing = orderStore.cartItems.find((e: CartItem) => e.id === newItem.id && e.size === newItem.size)
          if (existing) {
            existing.count += 1
          } else {
            orderStore.cartItems.push(newItem)
          }
          showSuccess.value = true
          setTimeout(() => {
            showSuccess.value = false
            isInCart.value = true
          }, 1500)
        } else {
          errorMessage.value = response.error || "Ошибка добавления"
          showError.value = true
        }
      }
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : "Ошибка"
      showError.value = true
    } finally {
      isLoading.value = false
    }
  }
}
</script>

<template>
  <AppTooltip
    :text="errorMessage"
    :show="showError"
    type="error"
  >
    <button
      :class="currentState.style"
      :disabled="currentState.disabled"
      @click="handleClick"
    >
      {{ currentState.content }}
    </button>
  </AppTooltip>
</template>

<style scoped></style>
