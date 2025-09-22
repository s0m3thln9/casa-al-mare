import { useAuthStore } from "~/stores/auth"

export const useAuthModalStore = defineStore("authModal", () => {
  const authStore = useAuthStore()

  const isOpen = ref(!authStore.isAuth)

  const open = () => {
    isOpen.value = true
  }
  const close = () => {
    isOpen.value = false
  }

  watchEffect(() => {
    isOpen.value = !authStore.isAuth
  })

  return { isOpen, open, close }
})
