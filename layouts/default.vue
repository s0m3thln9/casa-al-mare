<script setup lang="ts">
// import { useCatalogStore } from '~/stores/catalog'

const isCookieAccepted = ref(false)
const isCitySelected = ref(false)
const email = ref('')

const acceptCookie = () => {
	isCookieAccepted.value = true
}

const selectCity = () => {
	isCitySelected.value = true
}

// const catalogStore = useCatalogStore()
//
// const { data } = await useAsyncData('products', () =>
// 	$fetch('https://swimwear.kyokata.wtf/api/getProducts')
// )
//
// if (data.value) {
// 	catalogStore.items = data.value
// }

</script>

<template>
    <AppHeader />
    <NuxtPage />
    <AppFooter />
    <CitySelection v-show="!isCitySelected" @select-city="selectCity" />
    <CookieConsent v-show="!isCookieAccepted" @accept-cookie="acceptCookie" />
    <AppPopup title="Подпишитесь на рассылку" popup-id="subscription">
        <div class="flex flex-col items-center gap-6 mt-8 sm:mt-14 sm:items-start">
            <NuxtImg src="/pop-up-sub.jpg" alt="sub" width="390" height="532" class="rounded-lg" />
            <AppInput
	            id="email"
	            v-model="email"
	            label="Введите e-mail для получения новостей"
	            type="email"
	            custom-class="min-w-full"
            />
            <AppButton content="Подписаться" variant="primary" custom-class="w-full px-0" />
            <p class="w-full font-light text-[10px] text-[#5E5B58] font-[Commissioner] sm:w-[350px]">
                Нажимая на кнопку «Подписаться», я соглашаюсь на обработку моих персональных данных и ознакомлен(а) с условиями конфиденциальности.
            </p>
        </div>
    </AppPopup>
</template>

<style scoped>
body {
	width: 100%;
}

* {
	scrollbar-width: thin !important;
	scrollbar-color: #211D1D #F9F6EC !important;
}

::-webkit-scrollbar {
	width: 4px !important;
	height: 4px !important;
}

::-webkit-scrollbar-track {
	background: #f1f1f1 !important;
	border-radius: 23px !important;
	margin: 1px 0 !important;
}

::-webkit-scrollbar-thumb {
	background: #211D1D !important;
	border-radius: 23px !important;
	transition: background 0.3s ease !important;
}

::-webkit-scrollbar-button {
	display: none !important;
	width: 0 !important;
	height: 0 !important;
	background: transparent !important;
}
</style>
