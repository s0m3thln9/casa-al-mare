export const useItemStore = defineStore("item", () => {
  const color = ref<{ code: string; name: string; value: string } | null>(null)
  const size = ref<string | null>(null)
  const pantsType = ref<string | null>(null)

  return {
    color,
    size,
    pantsType,
  }
})
