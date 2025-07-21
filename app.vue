<script setup lang="ts">
const isCookieAccepted = ref(false)
const isCitySelected = ref(false)

const acceptCookie = () => {
	isCookieAccepted.value = true
}

const selectCity = () => {
	isCitySelected.value = true
}

</script>
<template>
	<AppHeader />
	<NuxtPage />
	<AppFooter />
	<CitySelection v-show="!isCitySelected" @select-city="selectCity" />
	<CookieConsent v-show="!isCookieAccepted" @accept-cookie="acceptCookie" />
</template>
<style>
</style>
