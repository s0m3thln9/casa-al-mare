import {defineStore} from "pinia"
import {useBodyScrollLock} from "~/composables/useBodyScrollLock"

export const useMenuStore = defineStore('menu', () => {
	const isOpen = ref(false)
	const { lockBodyScroll, unlockBodyScroll } = useBodyScrollLock()
	
	const open = () => {
		lockBodyScroll()
		isOpen.value = true
	}
	const close = () => {
		unlockBodyScroll()
		isOpen.value = false
	}
	
	return { isOpen, open, close  }
})