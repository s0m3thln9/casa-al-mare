<script setup lang="ts">
const isCookieAccepted = ref(false)
const isCitySelected = ref(false)
const isPopupOpen = ref(false)

const acceptCookie = () => {
	isCookieAccepted.value = true
}

const selectCity = () => {
	isCitySelected.value = true
}

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
};

const openPopup = () => {
	isPopupOpen.value = true
	const scrollbarWidth = getScrollbarWidth()
	document.body.style.overflow = 'hidden'
	document.body.style.paddingRight = `${scrollbarWidth}px`
}

const closePopup = () => {
	isPopupOpen.value = false
	document.body.style.overflow = 'auto'
	document.body.style.paddingRight = '0'
}

</script>
<template>
	<AppHeader @open-popup="openPopup" />
	<NuxtPage :is-popup-open="isPopupOpen" @close-popup="closePopup" />
	<AppFooter @open-popup="openPopup" />
	<CitySelection v-show="!isCitySelected" @select-city="selectCity" />
	<CookieConsent v-show="!isCookieAccepted" @accept-cookie="acceptCookie" />
	<AppPopup v-if="isPopupOpen" @close-popup="closePopup" />
</template>
<style>
</style>
