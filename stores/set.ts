export const useSetStore = defineStore("set", () => {
  const items = ref<Record<string, string>>({})
  const itemsIds = ref<Record<string, number | null>>({})
  const requiredTypes = ref<string[]>([]) // Добавляем список обязательных типов

  const setItem = (type: string, size: string, id: number) => {
    items.value[type] = size
    itemsIds.value[type] = id
  }

  const clearItem = (type: string) => {
    delete items.value[type]
    delete itemsIds.value[type]
  }

  const setRequiredTypes = (types: string[]) => {
    requiredTypes.value = types
  }

  const clear = () => {
    items.value = {}
    itemsIds.value = {}
    requiredTypes.value = []
  }

  const canAddToCart = computed(() => {
    // Проверяем, что все обязательные типы выбраны
    if (requiredTypes.value.length === 0) return false

    return requiredTypes.value.every((type) => {
      const size = items.value[type]
      return size && size.trim() !== ""
    })
  })

  const missingParams = computed<string | "all" | null>(() => {
    if (canAddToCart.value) return null

    const missing = requiredTypes.value.filter((type) => {
      const size = items.value[type]
      return !size || size.trim() === ""
    })

    if (missing.length === requiredTypes.value.length) return "all"
    return missing.length > 0 ? missing[0] : null
  })

  return {
    items,
    itemsIds,
    requiredTypes,
    setItem,
    clearItem,
    clear,
    setRequiredTypes,
    canAddToCart,
    missingParams,
  }
})
