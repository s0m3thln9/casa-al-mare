<script setup lang="ts">
const tabs = ["Профиль", "Заказы", "Сертификаты", "Избранное"]
const currentTab = ref(0)
const images = {
	card1: "/item-page-1.jpg",
}
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] flex justify-center items-center pt-16 pb-8 flex-col">
	  <div class="px-2 flex flex-col justify-center items-center w-full sm:px-0" :class="currentTab === 3 ? '' : 'max-w-[600px]'">
		  <div class="w-full flex justify-between items-center" :class="currentTab === 3 ? 'max-w-[600px]' : ''">
			  <span class="font-[Inter] text-[17px] text-[#1A1A1A] uppercase">Личный кабинет</span>
			  <button class="flex justify-center items-center px-4 py-2 rounded-xl border border-transparent cursor-pointer text-[13px]/snug font-light hover:border-[#211D1D] sm:text-sm/snug sm:font-normal">Выйти</button>
		  </div>
		  <SelectButton :variants="tabs" :custom-class="currentTab === 3 ? 'max-w-[600px] w-full mt-5' : 'w-full mt-5'" custom-button-class="flex-1" @select="value => currentTab = value" />
		  <div v-if="currentTab === 0" class="w-full">
			  <div class="flex w-full flex-col mt-8 gap-4">
				  <input
					  type="text" placeholder="E-mail"
					  class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
				  >
				  <AppButton content="Сменить пароль" />
				  <input
					  type="text" placeholder="Имя"
					  class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
				  >
				  <input
					  type="text" placeholder="Фамилия"
					  class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
				  >
				  <input
					  type="text" placeholder="Телефон"
					  class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
				  >
				  <div class="w-full flex items-center gap-4">
					  <select class="w-full px-2.5 py-3 rounded-lg border-[0.7px] border-[#BFBFBF] font-light text-xs font-[Manrope] text-[#211D1D]">
						  <option value="День">День</option>
					  </select>
					  <select class="w-full px-2.5 py-3 rounded-lg border-[0.7px] border-[#BFBFBF] font-light text-xs font-[Manrope] text-[#211D1D]">
						  <option value="Месяц">Месяц</option>
					  </select>
					  <select class="w-full px-2.5 py-3 rounded-lg border-[0.7px] border-[#BFBFBF] font-light text-xs font-[Manrope] text-[#211D1D]">
						  <option value="Год">Год</option>
					  </select>
				  </div>
			  </div>
			  <span class="w-full font-light text-xs text-[#F3A454] mt-2">Получайте поздравления и дополнительные скидки</span>
		    <div class="w-full flex flex-col mt-8 gap-4">
			    <span class="font-light text-xs">Адрес доставки</span>
			    <input
				    type="text" placeholder="Город"
				    class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
			    >
			    <input
				    type="text" placeholder="Улица, дом"
				    class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
			    >
			    <input
				    type="text" placeholder="Подъезд, этаж, квартира"
				    class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
			    >
		    </div>
			  <AppButton variant="primary" content="Сохранить" custom-class="w-full mt-8" />
		  </div>
		  <div v-if="currentTab === 1" class="w-full">
			  <div class="mt-8 gap-4 flex flex-col w-full justify-center items-center">
				  <OrderBox :state="{ orderId: 720, orderDate: '16.09.25', status: 'pending', deliveryDate: '20.10.25 12:00-15:00', address: 'Москва; Ленинский проспект 62; кв 13', deliveryMethod: 'Доставка курьером', paymentMethod: 'Оплата при получении', receiver: 'Иванова Елена Сергеевна', items: [{ bottom: 'XS', color: 'Цвет', img: '/order.jpg', count: 2, name: 'Название', top: 'XS', price: 10000 }] }" />
			  </div>
		  </div>
		  <div v-if="currentTab === 2" class="w-full">
			  <div class="mt-8 flex flex-col w-full justify-center items-center gap-6">
				  <div class="grid grid-cols-2 gap-4 w-full items-center">
					  <input
						  type="text" placeholder="Введите код"
						  class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
					  >
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
		  <div v-if="currentTab === 3" class="w-full">
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