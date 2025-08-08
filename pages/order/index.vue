<script setup lang="ts">
import {type AppInput, AppSelect} from "#components"

const orderStore = useOrderStore()
const authStore = useAuthStore()

const inputRefs = ref<InstanceType<typeof AppInput>[]>([])
const inputNewAddressRef = ref<InstanceType<typeof AppInput>>()
const selectRef = ref<InstanceType<typeof AppSelect>>()

const priceFormatter = (value: number) => {
	const formattedValue = new Intl.NumberFormat('ru-RU').format(value)
	return `${formattedValue} ₽`
}

const handlePay = () => {
	if (orderStore.isPaymentSuccessful === null) {
		if (!authStore.isAuth) {
			let isValid = true
			inputRefs.value.forEach((input) => {
				if (input.validateInput) {
					const valid = input.validateInput()
					isValid = isValid && valid
				}
			})
			if (!isValid) {
				return
			}
		}
		if (!selectRef.value?.validateSelect()) return
		if (orderStore.deliveryMethod === null || (orderStore.deliveryMethod === 'Курьер' && !orderStore.currentAddress)) {
			orderStore.showErrorDeliveryMethod = true
			setTimeout(() => {
				orderStore.showErrorDeliveryMethod = false
			}, 2000)
			return
		}
	}
	if (orderStore.paymentMethod === null) {
		orderStore.showErrorPaymentMethod = true
		setTimeout(() => {
			orderStore.showErrorPaymentMethod = false
		}, 2000)
		return
	}
	orderStore.isPaymentSuccessful = Math.random() >= 0.5
}

const handleSave = () => {
	if (!inputNewAddressRef.value?.validateInput()) return
	orderStore.saveNewAddress()
}

const addInputRef = (el: InstanceType<typeof AppInput> | null) => {
	if (el && !inputRefs.value.includes(el)) {
		inputRefs.value.push(el)
	}
}

</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] flex justify-start items-center pt-8 pb-8 flex-col">
    <h2 class="uppercase">Оформление</h2>
    <div class="mt-8 flex max-w-[1264px] flex-col px-2 sm:px-0 sm:flex-row h-fit w-full gap-12">
      <div
	      class="p-10 flex flex-col gap-12 w-full max-w-[652px] rounded-4xl border-[0.7px] border-[#BBB8B6] h-fit"
	      :class="orderStore.isPaymentSuccessful && 'bg-[#F9F6EC]'"
      >
	      <template v-if="orderStore.isPaymentSuccessful === null">
		      <div v-if="!authStore.isAuth" class="flex flex-col gap-4">
	          <span class="text-xs">Есть аккаунт? <span class="cursor-pointer" @click="authStore.login">Войти</span></span>
	          <AppInput id="name" v-model="orderStore.userInfo.name" type="text" label="Имя" required :ref="addInputRef" />
	          <AppInput id="surname" v-model="orderStore.userInfo.surname" type="text" label="Фамилия" required :ref="addInputRef" />
	          <AppInput id="phone" v-model="orderStore.userInfo.phone" type="text" label="Номер телефона" required :ref="addInputRef" />
	          <AppInput id="email" v-model="orderStore.userInfo.email" type="email" label="E-mail" required :ref="addInputRef" />
	        </div>
	        <div class="relative flex flex-col gap-6">
	          <span class="font-light text-sm">Доставка</span>
	          <AppSelect v-model="orderStore.city" :options="['Москва', 'Питер', 'Ростов', 'Краснодар', 'Мурманск', 'Брянск']" label="Город" ref="selectRef" required />
	          <div class="flex flex-col gap-6">
	            <AppCheckbox v-model="orderStore.deliveryMethod" size="M" label="Самовывоз" value="Самовывоз" />
	            <AppCheckbox v-model="orderStore.deliveryMethod" size="M" label="Курьер (# дней)" value="Курьер" />
	          </div>
	          <div v-if="orderStore.deliveryMethod === 'Курьер'" class="flex flex-col gap-4">
	            <AppCheckbox v-for="(address, index) in orderStore.addresses" :key="index" v-model="orderStore.currentAddress" size="S" :label="address" :value="address" />
	            <AppCheckbox v-model="orderStore.currentAddress" size="S" label="Новый адрес" value="Новый адрес" />
	            <div v-if="orderStore.currentAddress === 'Новый адрес'" class="flex flex-col gap-4">
	              <AppInput id="address1" v-model="orderStore.newAddressFirstLine" type="text" label="Улица, дом, корпус, строение, квартира" required ref="inputNewAddressRef"/>
	              <AppInput id="address2" v-model="orderStore.newAddressSecondLine" type="text" label="Номер дома и домофон / офис" />
	              <AppButton custom-class="w-full" content="Сохранить" variant="primary" @click="handleSave" />
	            </div>
	          </div>
		        <AppCheckbox v-model="orderStore.deliveryMethod" size="M" disabled label="СДЭК (ПВЗ)" value="СДЭК (ПВЗ)" />
	          <AppInput id="forCourier" v-model="orderStore.commentForCourier" type="text" label="Пожелания и комментарии для курьера" />
		        <div
			        class="absolute -top-[40px] left-3 bg-[#FFFFFA] transition-opacity duration-300 border border-[#A6CEFF] text-[#211D1D] text-[13px] font-light font-[Manrope] p-4 shadow-md z-10 rounded-t-3xl rounded-r-3xl"
			        :class="orderStore.showErrorDeliveryMethod ? 'opacity-100' : 'opacity-0'"
		        >
              Выберите способ доставки
            </div>
	        </div>
	        <div class="relative flex flex-col gap-6">
	          <span class="font-light text-sm">Способ оплаты</span>
	          <div class="flex flex-col gap-4">
	            <AppCheckbox v-model="orderStore.paymentMethod" size="S" label="Картой на сайте" value="Картой на сайте" />
	            <AppCheckbox v-model="orderStore.paymentMethod" size="S" label="Оплата при получении" value="Оплата при получении" />
	          </div>
		        <div
			        class="absolute -top-[40px] left-3 bg-[#FFFFFA] transition-opacity duration-300 border border-[#A6CEFF] text-[#211D1D] text-[13px] font-light font-[Manrope] p-4 shadow-md z-10 rounded-t-3xl rounded-r-3xl"
		          :class="orderStore.showErrorPaymentMethod ? 'opacity-100' : 'opacity-0'"
		        >
              Выберите способ оплаты
            </div>
	        </div>
	      </template>
	      <div v-else-if="orderStore.isPaymentSuccessful" class="flex flex-col gap-4">
		      <h2 class="font-[Inter] text-[17px] text-[#211D1D] uppercase">Благодарим Вас за заказ №31388!</h2>
		      <p class="font-[Manrope] text-sm text-[#211D1D] font-light">Мы уже проверяем ваш платеж и в течение 30 минут информация появится в вашем личном кабинете</p>
		      <p class="font-[Manrope] text-sm text-[#211D1D] font-light">В случае возникновения вопросов свяжитесь с нами, пожалуйста, написав на почту clients@ или по телефону +7999 999 99 99</p>
	      </div>
	      <div v-else class="flex flex-col gap-4">
		      <h2 class="font-[Inter] text-[17px] text-[#E29650] uppercase">Оплата заказа не прошла</h2>
		      <p class="font-[Manrope] text-sm text-[#211D1D] font-light">При оплате картами может возникать задержка до 5-ти минут. Если оплата была проведена,  то она обязательно будет принята и обработана.</p>
		      <p class="font-[Manrope] text-sm text-[#211D1D] font-light">Если вы отменили оплату, можете оплатить через личный кабинет, или изменить заказ.</p>
	      </div>
      </div>
      <div class="p-8 w-full max-w-[564px] h-fit rounded-lg border-[0.7px] border-[#BBB8B6]">
	      <template v-if="orderStore.isPaymentSuccessful === null">
		      <div class="flex flex-col gap-8">
	          <div class="flex flex-col gap-6">
	            <div v-for="(item, index) in orderStore.cartItems" :key="index" class="flex items-center justify-between w-full">
	              <div class="flex items-center gap-2">
	                <NuxtImg :src="item.img" alt="order-img" width="57" height="72" class="rounded-2xl border-[0.5px] border-[#211D1D]" />
	                <div class="flex flex-col gap-1">
	                  <span class="font-light text-sm text-[#414141]">{{ item.name }}</span>
	                  <span class="font-light text-[13px]">Топ: {{ item.top }} Низ: {{ item.bottom }} {{ item.color }}</span>
	                  <span class="text-xs text-[#414141]">{{ priceFormatter(item.price) }} <span class="font-light text-[#606060]">за шт.</span></span>
	                </div>
	              </div>
	              <div class="flex flex-col items-end gap-4">
	                <div class="flex items-center gap-2">
	                  <div class="py-1 px-2 flex gap-1 rounded-xl border-[0.7px] border-[#211D1D] text-xs font-light">
	                    <button class="w-4 h-4 flex items-center justify-center cursor-pointer" @click="orderStore.decrementQuantity(item.id)">
	                      <NuxtImg src="/minus.svg" alt="minus" class="w-full" />
	                    </button>
	                    {{ item.count }}
	                    <button class="w-4 h-4 flex items-center justify-center cursor-pointer" @click="orderStore.incrementQuantity(item.id)">
	                      <NuxtImg src="/plus.svg" alt="plus" class="w-full" />
	                    </button>
	                  </div>
	                  <button class="w-6 h-6 flex items-center justify-center cursor-pointer" @click="orderStore.removeItemFromCart(item.id)">
	                    <NuxtImg src="/x.svg" alt="x" class="w-full" />
	                  </button>
	                </div>
	                <span class="text-xs font-light">{{ priceFormatter(item.price * item.count) }} <span class="line-through">{{ priceFormatter(item.price * item.count + 1000) }}</span></span>
	              </div>
	            </div>
	            <div class="flex flex-col gap-4">
	              <div class="flex items-center justify-between">
	                <span class="font-light text-sm">Промокод</span>
	                <button class="w-4 h-4 flex items-center justify-center cursor-pointer" :class="orderStore.isExpandedPromo ? 'rotate-0' : 'rotate-180'" @click="orderStore.togglePromo">
	                  <NuxtImg src="/order-arrow.svg" class="w-full"/>
	                </button>
	              </div>
	              <div class="collapsible-div flex flex-col gap-4 transition-max-height duration-300 ease-in-out overflow-hidden" :class="{ 'max-h-500 opacity-100': orderStore.isExpandedPromo, 'max-h-0 opacity-0': !orderStore.isExpandedPromo }">
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
	                <button class="w-4 h-4 flex items-center justify-center cursor-pointer" :class="orderStore.isExpandedCert ? 'rotate-0' : 'rotate-180'" @click="orderStore.toggleCert">
	                  <NuxtImg src="/order-arrow.svg" class="w-full"/>
	                </button>
	              </div>
	              <div class="collapsible-div flex flex-col gap-4 transition-max-height duration-300 ease-in-out overflow-hidden" :class="{ 'max-h-500 opacity-100': orderStore.isExpandedCert, 'max-h-0 opacity-0': !orderStore.isExpandedCert }">
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
	                <span class="flex items-center gap-2">{{ priceFormatter(orderStore.totalSum) }} <span class="font-extralight line-through">{{ priceFormatter(orderStore.totalSum) }}</span></span>
	              </div>
	            </div>
	            <div class="flex flex-col gap-2">
	              <AppButton class="w-full" content="Оплатить заказ" @click="handlePay" />
	              <p class="text-xs text-[#8C8785]">Нажимая на кнопку «Оплатить», Вы соглашаетесь с условиями публичной оферты, принимаете политику защиты и обработки персональных данных и даете свое согласие на их обработку.</p>
	            </div>
	          </div>
	        </div>
	      </template>
	      <div v-else-if="orderStore.isPaymentSuccessful">
		      <h2 class="font-[Inter] text-[17px] text-[#211D1D] uppercase">заказанные товары</h2>
					<div class="flex flex-col gap-6 mt-8">
						<div v-for="(item, index) in orderStore.cartItems" :key="index" class="flex items-center justify-between w-full">
							<div class="flex items-center gap-2">
								<NuxtImg :src="item.img" alt="order-img" width="57" height="72" class="rounded-2xl border-[0.5px] border-[#211D1D]" />
								<div class="flex flex-col gap-1">
									<span class="font-light text-sm text-[#414141]">{{ item.name }}</span>
									<span class="font-light text-[13px]">Топ: {{ item.top }} Низ: {{ item.bottom }} {{ item.color }}</span>
									<span class="text-xs text-[#414141]">{{ priceFormatter(item.price) }} <span class="font-light text-[#606060]">за шт.</span></span>
								</div>
							</div>
							<div class="flex flex-col items-end gap-4">
								<div class="flex items-center gap-2">
									<div class="py-1 px-2 flex gap-1 rounded-xl border-[0.7px] border-[#211D1D] text-xs font-light">
										{{ item.count }}
									</div>
								</div>
								<span class="text-xs font-light">{{ priceFormatter(item.price * item.count) }} <span class="line-through">{{ priceFormatter(item.price * item.count + 1000) }}</span></span>
							</div>
						</div>
					</div>
		      <div class="flex items-center justify-between mt-8">
			      <span>Стоимость товаров:</span>
			      <span class="flex items-center gap-2">{{ priceFormatter(orderStore.totalSum) }} <span class="font-extralight line-through">{{ priceFormatter(orderStore.totalSum) }}</span></span>
		      </div>
	      </div>
	      <div v-else>
		      <div class="flex flex-col gap-6">
			      <div v-for="(item, index) in orderStore.cartItems" :key="index" class="flex items-center justify-between w-full">
				      <div class="flex items-center gap-2">
					      <NuxtImg :src="item.img" alt="order-img" width="57" height="72" class="rounded-2xl border-[0.5px] border-[#211D1D]" />
					      <div class="flex flex-col gap-1">
						      <span class="font-light text-sm text-[#414141]">{{ item.name }}</span>
						      <span class="font-light text-[13px]">Топ: {{ item.top }} Низ: {{ item.bottom }} {{ item.color }}</span>
						      <span class="text-xs text-[#414141]">{{ priceFormatter(item.price) }} <span class="font-light text-[#606060]">за шт.</span></span>
					      </div>
				      </div>
				      <div class="flex flex-col items-end gap-4">
					      <div class="flex items-center gap-2">
						      <div class="py-1 px-2 flex gap-1 rounded-xl border-[0.7px] border-[#211D1D] text-xs font-light">
							      <button class="w-4 h-4 flex items-center justify-center cursor-pointer" @click="orderStore.decrementQuantity(item.id)">
								      <NuxtImg src="/minus.svg" alt="minus" class="w-full" />
							      </button>
							      {{ item.count }}
							      <button class="w-4 h-4 flex items-center justify-center cursor-pointer" @click="orderStore.incrementQuantity(item.id)">
								      <NuxtImg src="/plus.svg" alt="plus" class="w-full" />
							      </button>
						      </div>
						      <button class="w-6 h-6 flex items-center justify-center cursor-pointer" @click="orderStore.removeItemFromCart(item.id)">
							      <NuxtImg src="/x.svg" alt="x" class="w-full" />
						      </button>
					      </div>
					      <span class="text-xs font-light">{{ priceFormatter(item.price * item.count) }} <span class="line-through">{{ priceFormatter(item.price * item.count + 1000) }}</span></span>
				      </div>
			      </div>
		      </div>
		      <div class="flex items-center justify-between mt-8">
			      <span>Стоимость товаров:</span>
			      <span class="flex items-center gap-2">{{ priceFormatter(orderStore.totalSum) }} <span class="font-extralight line-through">{{ priceFormatter(orderStore.totalSum) }}</span></span>
		      </div>
		      <div class="relative flex flex-col gap-6 mt-8">
	          <span class="font-light text-sm">Способ оплаты</span>
	          <div class="flex flex-col gap-4">
	            <AppCheckbox v-model="orderStore.paymentMethod" size="S" label="Картой на сайте" value="Картой на сайте" />
	            <AppCheckbox v-model="orderStore.paymentMethod" size="S" label="Оплата при получении" value="Оплата при получении" />
	          </div>
			      <div
				      class="absolute -top-[40px] left-3 bg-[#FFFFFA] transition-opacity duration-300 border border-[#A6CEFF] text-[#211D1D] text-[13px] font-light font-[Manrope] p-4 shadow-md z-10 rounded-t-3xl rounded-r-3xl"
				      :class="orderStore.showErrorPaymentMethod ? 'opacity-100' : 'opacity-0'"
			      >
              Выберите способ оплаты
            </div>
	        </div>
		      <AppButton class="w-full mt-8" content="Оплатить заказ" @click="handlePay" />
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