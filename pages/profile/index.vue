<script setup lang="ts">
const tabs = ["Профиль", "Заказы", "Сертификаты", "Избранное"]
const currentTab = ref('Профиль')
const images = {
	card1: "/item-page-1.jpg",
}
const email = ref('')
const name = ref('')
const surname = ref('')
const phone = ref('')
const day = ref(null)
const month = ref(null)
const year = ref(null)
const adr1 = ref('')
const adr2 = ref('')
const adr3 = ref('')
const code = ref('')

</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] flex justify-center items-center pt-16 pb-8 flex-col">
	  <div class="px-2 flex flex-col justify-center items-center w-full sm:px-0" :class="currentTab === 'Избранное' ? '' : 'max-w-[600px]'">
		  <div class="w-full flex justify-between items-center" :class="currentTab === 'Избранное' ? 'max-w-[600px]' : ''">
			  <span class="font-[Inter] text-[17px] text-[#1A1A1A] uppercase">Личный кабинет</span>
			  <button class="flex justify-center items-center px-4 py-2 rounded-xl border border-transparent cursor-pointer text-[13px]/snug font-light hover:border-[#211D1D] sm:text-sm/snug sm:font-normal">Выйти</button>
		  </div>
		  <SelectButton v-model="currentTab" :variants="tabs" :custom-class="currentTab === 'Избранное' ? 'max-w-[600px] w-full mt-5' : 'w-full mt-5'" custom-button-class="flex-1" @update:model-value="value => currentTab = value" />
		  <div v-if="currentTab === 'Профиль'" class="w-full">
			  <div class="flex w-full flex-col mt-8 gap-4">
				  <AppInput
					  id="email"
					  v-model="email"
					  label="E-mail"
					  type="email"
				  />
				  <AppButton content="Сменить пароль" />
				  <AppInput
					  id="name"
					  v-model="name"
					  label="Имя"
					  type="text"
				  />
				  <AppInput
					  id="surname"
					  v-model="surname"
					  label="Фамилия"
					  type="text"
				  />
				  <SelectInput id="phone" v-model="phone" :options="[  { code: '+7', country: 'Россия' }, { code: '+375', country: 'Беларусь' }, { code: '+380', country: 'Украина' }, { code: '+77', country: 'Казахстан' }, { code: '+998', country: 'Узбекистан' }, { code: '+992', country: 'Таджикистан' }, { code: '+993', country: 'Туркменистан' }, { code: '+996', country: 'Кыргызстан' }, { code: '+374', country: 'Армения' }, { code: '+994', country: 'Азербайджан' }, { code: '+373', country: 'Молдова' }, { code: '+7', country: 'Абхазия' }, { code: '+995', country: 'Грузия' }]" type="text" label="Номер телефона" />
				  <div class="w-full flex gap-4">
					  <AppSelect v-model="day" label="День" :options="['1', '2', '3']" custom-class="w-full" />
					  <AppSelect v-model="month" label="Месяц" :options="['Январь', 'Февраль', 'Март']" custom-class="w-full" />
					  <AppSelect v-model="year" label="Год" :options="['2003', '2004', '2005']" custom-class="w-full" />
				  </div>
			  </div>
			  <span class="w-full font-light text-xs text-[#F3A454] mt-2">Получайте поздравления и дополнительные скидки</span>
		    <div class="w-full flex flex-col mt-8 gap-4">
			    <span class="font-light text-xs">Адрес доставки</span>
			    <AppInput
				    id="adr1"
				    v-model="adr1"
				    label="Город"
				    type="text"
			    />
			    <AppInput
				    id="adr2"
				    v-model="adr2"
				    label="Улица, дом"
				    type="text"
			    />
			    <AppInput
				    id="adr3"
				    v-model="adr3"
				    label="Подъезд, этаж, квартира"
				    type="text"
			    />
		    </div>
			  <AppButton variant="primary" content="Сохранить" custom-class="w-full mt-8" />
		  </div>
		  <div v-if="currentTab === 'Заказы'" class="w-full">
			  <div class="mt-8 gap-4 flex flex-col w-full justify-center items-center">
				  <OrderBox :state="{ orderId: 720, orderDate: '16.09.25', status: 'pending', deliveryDate: '20.10.25 12:00-15:00', address: 'Москва; Ленинский проспект 62; кв 13', deliveryMethod: 'Доставка курьером', paymentMethod: 'Оплата при получении', receiver: 'Иванова Елена Сергеевна', items: [{ bottom: 'XS', color: 'Цвет', img: '/order.jpg', count: 2, name: 'Название', top: 'XS', price: 10000 }] }" />
			  </div>
		  </div>
		  <div v-if="currentTab === 'Сертификаты'" class="w-full">
			  <div class="mt-8 flex flex-col w-full justify-center items-center gap-6">
				  <div class="grid grid-cols-2 gap-4 w-full items-center">
					  <AppInput
						  id="code"
						  v-model="code"
						  label="Введите код"
						  type="text"
					  />
					  <AppButton content="Применить" variant="primary" custom-class="w-full" />
				  </div>
				  <div class="flex flex-col gap-2 w-full">
					  <div class="flex w-full items-center rounded-lg gap-4 p-4 border-[0.7px] border-[#BFBFBF]">
						  <div class="px-4 py-2 bg-[#FFF4A4] rounded-lg font-light text-sm">
							  065040В9340
						  </div>
						  <span class="font-light text-sm text-[#181818]">на 1 000 ₽</span>
					  </div>
					  <div class="flex w-full items-center rounded-lg gap-4 p-4 border-[0.7px] border-[#BFBFBF]">
						  <div class="px-4 py-2 bg-[#FFF4A4] rounded-lg font-light text-sm">
							  065040В9340
						  </div>
						  <span class="font-light text-sm text-[#181818]">на 5 000 ₽</span>
					  </div>
					  <div class="flex w-full items-center rounded-lg gap-4 p-4 border-[0.7px] border-[#BFBFBF]">
						  <div class="px-4 py-2 bg-[#FFF4A4] rounded-lg font-light text-sm">
							  065040В9340
						  </div>
						  <span class="font-light text-sm text-[#181818]">на 500 ₽</span>
					  </div>
				  </div>
				  <span class="font-light text-sm text-[#1A1A1A] self-start">Ваш баланс: 8 500 рублей</span>
			  </div>
		  </div>
		  <div v-if="currentTab === 'Избранное'" class="w-full">
			  <div
				  class="mt-8 grid grid-cols-1 px-2 gap-x-4 gap-y-6 sm:grid-cols-4 sm:px-4"
			  >
				  <CatalogCard
					  :image-urls="[images.card1, images.card1, images.card1]"
					  text="Printed bikini top"
					  :price="25500"
					  variant="large"
				  />
				  <CatalogCard
					  :image-urls="[images.card1, images.card1, images.card1]"
					  text="Printed bikini top"
					  :price="25500"
					  variant="large"
				  />
				  <CatalogCard
					  :image-urls="[images.card1, images.card1, images.card1]"
					  text="Printed bikini top"
					  :price="25500"
					  variant="large"
				  />
				  <CatalogCard
					  :image-urls="[images.card1, images.card1, images.card1]"
					  text="Printed bikini top"
					  :price="25500"
					  variant="large"
				  />
			  </div>
		  </div>
	  </div>
  </main>
</template>

<style scoped>

</style>