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
	<AppPopup :is-popup-open="isPopupOpen" title="Подпишитесь на рассылку" @close-popup="closePopup">
		<NuxtImg src="/pop-up-sub.jpg" alt="sub" width="390" height="532" class="rounded-lg" />
		<input
			type="email" placeholder="Введите e-mail для получения новостей"
			class="min-w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
		>
		<AppButton content="Подписаться" variant="primary" custom-class="w-full px-0"/>
		<p
			class="w-full font-light text-[10px] text-[#5E5B58] font-[Commissioner] sm:w-[350px]"
		>
			Нажимая на кнопку «Подписаться», я соглашаюсь на обработку моих персональных данных и ознакомлен(а) с условиями конфиденциальности.
		</p>
	</AppPopup>
</template>
<style>
</style>
