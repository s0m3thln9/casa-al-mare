<script setup lang="ts">
const items = [{ bottom: 'XS', color: 'Цвет', img: '/order.jpg', count: 2, name: 'Название', top: 'XS', price: 10000 }, { bottom: 'XS', color: 'Цвет', img: '/order.jpg', count: 2, name: 'Название', top: 'XS', price: 10000 }]

const isExpandedPromo = ref(false)
const isExpandedCert = ref(false)
const deliveryMethod = ref<number | undefined>(undefined)
const paymentMethod = ref<number | undefined>(undefined)
const currentAddress = ref<number | undefined>(undefined)

const toggleDeliveryMethod = (value?: number) => {
	deliveryMethod.value = value
}

const togglePaymentMethod = (value?: number) => {
	paymentMethod.value = value
}

const toggleCurrentAddress = (value?: number) => {
	currentAddress.value = value
}

const toggleExpandPromo = () => {
	isExpandedPromo.value = !isExpandedPromo.value
}

const toggleExpandCert = () => {
	isExpandedCert.value = !isExpandedCert.value
};

const priceFormatter = (value: number) => {
	const formattedValue = new Intl.NumberFormat('ru-RU').format(value)
	return `${formattedValue} ₽`
}

const calculateSum = () => {
	return items.map(item => item.price * item.count).reduce((acc, c) => acc + c, 0)
}

</script>

<template>
	<main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] flex justify-start items-center pt-8 pb-8 flex-col">
		<h2 class="uppercase">Оформление</h2>
		<div class="mt-8 flex max-w-[1264px] flex-col px-2 sm:px-0 sm:flex-row h-fit w-full gap-12">
			<div class="p-10 w-full max-w-[652px] rounded-4xl border-[0.7px] border-[#BBB8B6]">
				<div class="flex flex-col gap-6">
					<span class="font-light text-sm">Доставка</span>
					<select class="w-full px-2.5 py-3 rounded-lg border-[0.7px] border-[#BFBFBF] font-light text-xs font-[Manrope] text-[#211D1D]">
						<option value="Москва">Москва</option>
					</select>
					<div class="flex flex-col gap-6">
						<AppCheckbox size="M" label="Самовывоз" :value="0" :current-value="deliveryMethod" @toggle="value => toggleDeliveryMethod(value)" />
						<AppCheckbox size="M" label="Курьер (# дней)" :value="1" :current-value="deliveryMethod" @toggle="value => toggleDeliveryMethod(value)" />
					</div>
					<div class="flex flex-col gap-4">
						<AppCheckbox size="S" label="Ул. Заречная, дом 19, кв. 5" :value="0" :current-value="currentAddress" @toggle="value => toggleCurrentAddress(value)" />
						<AppCheckbox size="S" label="Ул. Октябрьская, дом 32, к. 4, офис 219" :value="1" :current-value="currentAddress" @toggle="value => toggleCurrentAddress(value)" />
						<AppCheckbox size="S" label="Новый адрес" :value="2" :current-value="currentAddress" @toggle="value => toggleCurrentAddress(value)" />
						<input
							type="text" placeholder="Улица, дом, корпус, строение, квартира"
							class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
						>
				    <input
					    type="text" placeholder="Номер дома и домофон / офис"
					    class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
				    >
						<AppButton custom-class="w-full" content="Сохранено" variant="primary" />
						<AppCheckbox size="M" disabled label="СДЭК (ПВЗ)" :value="2" :current-value="deliveryMethod" @toggle="value => toggleDeliveryMethod(value)" />
					</div>
					<input
						type="text" placeholder="Пожелания и комментарии для курьера"
						class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
					>
					<div class="flex flex-col gap-6">
						<span class="font-light text-sm">Способ оплаты</span>
						<div class="flex flex-col gap-4">
							<AppCheckbox size="S" label="Картой на сайте" :value="1" :current-value="paymentMethod" @toggle="value => togglePaymentMethod(value)" />
							<AppCheckbox size="S" label="Оплата при получении" :value="1" :current-value="paymentMethod" @toggle="value => togglePaymentMethod(value)" />
						</div>
					</div>
				</div>
			</div>
			<div class="p-8 w-full max-w-[564px] h-fit rounded-lg border-[0.7px] border-[#BBB8B6]">
				<div class="flex flex-col gap-8">
					<div class="flex flex-col gap-6">
						<div v-for="(item, index) in items" :key="index" class="flex items-center justify-between w-full">
						  <div class="flex items-center gap-2">
							  <NuxtImg :src="item.img" alt="order-img" width="57" height="72" class="rounded-2xl border-[0.5px] border-[#211D1D]" />
							  <div class="flex flex-col gap-1">
								  <span class="font-light text-sm text-[#414141]">{{item.name}}</span>
								  <span class="font-light text-[13px]">Топ: {{item.top}} Низ: {{item.bottom}} {{item.color}}</span>
								  <span class="text-xs text-[#414141]">{{priceFormatter(item.price)}} <span class="font-light text-[#606060]">за шт.</span></span>
							  </div>
						  </div>
						  <div class="flex flex-col items-end gap-4">
							  <div class="flex items-center gap-2">
								  <div class="py-1 px-2 flex gap-1 rounded-xl border-[0.7px] border-[#211D1D] text-xs font-light"><button class="w-4 h-4 flex items-center justify-center cursor-pointer"><NuxtImg src="/minus.svg" alt="minus" class="w-full" /></button> {{item.count}} <button class="w-4 h-4 flex items-center justify-center cursor-pointer"><NuxtImg src="/plus.svg" alt="plus" class="w-full" /></button></div>
								  <button class="w-4 h-4 flex items-center justify-center cursor-pointer">
									  <NuxtImg src="/x.svg" alt="x" class="w-full" />
								  </button>
							  </div>
							  <span class="text-xs font-light">{{priceFormatter(item.price * item.count)}} <span class="line-through">{{priceFormatter(item.price * item.count + 1000)}}</span></span>
						  </div>
					  </div>
						<div class="flex flex-col gap-4">
							<div class="flex items-center justify-between">
								<span class="font-light text-sm">Промокод</span>
								<button class="w-4 h-4 flex items-center justify-center cursor-pointer" @click="toggleExpandPromo" :class="isExpandedPromo ? 'rotate-0' : 'rotate-180'">
								  <NuxtImg src="/order-arrow.svg" class="w-full"/>
							  </button>
							</div>
							<div class="collapsible-div flex flex-col gap-4 transition-max-height duration-300 ease-in-out overflow-hidden" :class="{ 'max-h-500 opacity-100': isExpandedPromo, 'max-h-0 opacity-0': !isExpandedPromo }">
								<input
									type="text" placeholder="Введите код"
									class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
								>
								<AppButton variant="primary" custom-class="w-full" content="Использовать" />
								<div class="flex gap-2 items-center">
								  <input type="checkbox" class="w-4 h-4">
								  <span class="text-[13px]">Промокод “name” -10% Выгода 500 ₽</span>
						    </div>
								<span class="font-light text-[13px] text-[#E57979]">Промокод не применяется к товарам со скидкой</span>
								<AppButton variant="primary" custom-class="w-full" content="Применить промокод" />
							</div>
						</div>
						<div class="flex flex-col gap-4">
							<div class="flex items-center justify-between">
								<span class="font-light text-sm">Сертификат</span>
								<button class="w-4 h-4 flex items-center justify-center cursor-pointer" @click="toggleExpandCert" :class="isExpandedCert ? 'rotate-0' : 'rotate-180'">
								  <NuxtImg src="/order-arrow.svg" class="w-full"/>
							  </button>
							</div>
							<div class="collapsible-div flex flex-col gap-4 transition-max-height duration-300 ease-in-out overflow-hidden" :class="{ 'max-h-500 opacity-100': isExpandedCert, 'max-h-0 opacity-0': !isExpandedCert }">
								<input
									type="text" placeholder="Введите код"
									class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
								>
								<div class="flex gap-2 items-center">
								  <input type="checkbox" class="w-4 h-4">
								  <span class="text-[13px]">Сертификат на сумму 1 000 рублей</span>
						    </div>
								<input
									type="text" placeholder="Введите сумму для списания"
									class="w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
								>
								<AppButton variant="primary" custom-class="w-full" content="Списать 1 000 рублей" />
							</div>
						</div>
						<div class="flex flex-col gap-1 text-sm font-light">
							<div class="flex items-center justify-between">
								<span>Доставка:</span>
								<span>0 ₽ при сумме заказа от 30 000 ₽</span>
							</div>
							<div class="flex items-center justify-between">
								<span>Стоимость товаров:</span>
								<span class="flex items-center gap-2">{{priceFormatter(calculateSum())}} <span class="font-extralight line-through">{{priceFormatter(calculateSum())}}</span></span>
							</div>
						</div>
						<div class="flex flex-col gap-2">
							<AppButton class="w-full" content="Оплатить заказ " />
							<p class="text-xs text-[#8C8785]">Нажимая на кнопку «Оплатить», Вы соглашаетесь с условиями публичной оферты, принимаете политику защиты и обработки персональных данных и даете свое согласие на их обработку.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<style scoped>
.collapsible-div {
	transition-property: max-height, opacity;
}
</style>