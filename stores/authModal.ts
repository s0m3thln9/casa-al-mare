import { useAuthStore } from "~/stores/auth"

export const useAuthModalStore = defineStore("authModal", () => {
  const authStore = useAuthStore()

  const isOpen = ref(false)

  const open = () => {
    isOpen.value = true
  }
  const close = () => {
    isOpen.value = false
  }
  watch(() => isOpen, (isOpen) => {
    if (!isOpen) {
      authStore.resetForm()
    }
  })

  return { isOpen, open, close }
})
