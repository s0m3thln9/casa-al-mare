export const usePopupStore = defineStore('popup', () => {
	const activePopup = ref<string | null>(null)
	const { lockBodyScroll, unlockBodyScroll } = useBodyScrollLock()
	
	const open = (popupId: string): void => {
		lockBodyScroll()
		activePopup.value = popupId
	}
	
	const close = (): void => {
		unlockBodyScroll()
		activePopup.value = null
	}
	
	const isOpen = (popupId: string): boolean => activePopup.value === popupId
	
	return { isOpen, open, close, activePopup }
})