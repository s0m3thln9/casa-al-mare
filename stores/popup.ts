import {defineStore} from "pinia"
import {useBodyScrollLock} from "~/composables/useBodyScrollLock"

export const usePopupStore = defineStore('popup', () => {
	const activePopup = ref<string | null>(null)
	const { lockBodyScroll, unlockBodyScroll } = useBodyScrollLock()
	
	const open = (popupId: string) => {
		lockBodyScroll()
		activePopup.value = popupId
	}
	
	const close = () => {
		unlockBodyScroll()
		activePopup.value = null
	}
	
	const isOpen = (popupId: string) => activePopup.value === popupId
	
	return { isOpen, open, close, activePopup }
})