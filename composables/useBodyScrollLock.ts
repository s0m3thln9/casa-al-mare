export function useBodyScrollLock() {
	const getScrollbarWidth = () => {
		const outer = document.createElement('div')
		outer.style.visibility = 'hidden'
		outer.style.overflow = 'scroll'
		document.body.appendChild(outer)
		const inner = document.createElement('div')
		outer.appendChild(inner)
		const width = outer.offsetWidth - inner.offsetWidth
		outer.remove()
		return width
	}
	
	const lockBodyScroll = () => {
		const scrollbarWidth = getScrollbarWidth()
		document.body.style.overflow = 'hidden'
		document.body.style.paddingRight = `${scrollbarWidth}px`
	}
	
	const unlockBodyScroll = () => {
		document.body.style.overflow = 'auto'
		document.body.style.paddingRight = '0'
	}
	
	return { lockBodyScroll, unlockBodyScroll }
}