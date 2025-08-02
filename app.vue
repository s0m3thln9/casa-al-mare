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
	<AppFooter @open-popup="openPopup" />
	<CitySelection v-show="!isCitySelected" @select-city="selectCity" />
	<CookieConsent v-show="!isCookieAccepted" @accept-cookie="acceptCookie" />
	<AppPopup title="Подпишитесь на рассылку">
		<div class="flex flex-col items-center gap-6 mt-8 sm:mt-14 sm:items-start">
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
		</div>
	</AppPopup>
</template>
<style>
</style>
