<script setup lang="ts">
interface AppComponentExposed {
  validate: () => boolean
  showError: boolean
}

const cityRef = ref<ComponentPublicInstance<object, AppComponentExposed> | null>(null)
const emailRef = ref<ComponentPublicInstance<object, AppComponentExposed> | null>(null)
const nameRef = ref<ComponentPublicInstance<object, AppComponentExposed> | null>(null)
const newAddressRef = ref<ComponentPublicInstance<object, AppComponentExposed> | null>(null)
const phoneRef = ref<ComponentPublicInstance<object, AppComponentExposed> | null>(null)
const surnameRef = ref<ComponentPublicInstance<object, AppComponentExposed> | null>(null)

const authStore = useAuthStore()
const orderStore = useOrderStore()
const userStore = useUserStore()

onMounted(async () => {
  const getCart = async (): Promise<void> => {
    const token = await userStore.loadToken()
    try {
      const { data } = await useFetch("https://swimwear.kyokata.wtf/api/getCart", {
        method: "POST",
        body: {
          token: token,
        },
      })
      if (data.value?.success && data.value.cart) {
        const rawCart = data.value.cart
        const parsedCart = Object.entries(rawCart).map(([_, item]) => {
          return {
            id: String(item.productId),
            vector: item.variant,
            count: item.count,
          }
        })
        orderStore.setCartItems(parsedCart)
      }
    } catch (error) {
      console.error("Ошибка при получении корзины:", error)
    }
  }
  await getCart()
})

function handlePay() {
  if (orderStore.isPaymentSuccessful === null) {
    if (!authStore.isAuth) {
      const inputs = [nameRef.value, surnameRef.value, phoneRef.value, emailRef.value]
      const isValid = inputs.every((input) => input?.validate?.())
      if (!isValid) return
    }
    if (!cityRef.value?.validate()) return
    if (
      orderStore.deliveryMethod === null ||
      (orderStore.deliveryMethod === "Курьер" && !orderStore.currentAddress) ||
      (orderStore.deliveryMethod === "Курьер" && orderStore.currentAddress === "Новый адрес")
    ) {
      orderStore.showErrorDeliveryMethod = true
      return
    }
  }
  if (orderStore.paymentMethod === null) {
    orderStore.showErrorPaymentMethod = true
    return
  }
  orderStore.attemptPayment()
}

function handleSave() {
  if (!newAddressRef.value?.validate()) return
  orderStore.saveNewAddress()
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
          <div
            v-if="!authStore.isAuth"
            class="flex flex-col gap-4"
          >
            <span class="text-xs"
              >Есть аккаунт?
              <span
                class="cursor-pointer"
                @click="authStore.login"
                >Войти</span
              ></span
            >
            <AppTooltip
              text="Это поле обязательно для заполнения"
              type="error"
              :show="nameRef?.showError"
            >
              <AppInput
                id="name"
                ref="nameRef"
                v-model="orderStore.name"
                type="text"
                label="Имя"
                custom-class="w-full"
                required
              />
            </AppTooltip>
            <AppTooltip
              text="Это поле обязательно для заполнения"
              type="error"
              :show="surnameRef?.showError"
            >
              <AppInput
                id="surname"
                ref="surnameRef"
                v-model="orderStore.surname"
                type="text"
                label="Фамилия"
                custom-class="w-full"
                required
              />
            </AppTooltip>
            <AppTooltip
              text="Это поле обязательно для заполнения"
              type="error"
              :show="phoneRef?.showError"
            >
              <SelectInput
                id="phone"
                ref="phoneRef"
                v-model="orderStore.phone"
                custom-class="w-full"
                :options="[
                  { code: '+7', country: 'Россия', iso: 'RU' },
                  { code: '+375', country: 'Беларусь', iso: 'BY' },
                  { code: '+380', country: 'Украина', iso: 'UA' },
                  { code: '+77', country: 'Казахстан', iso: 'KZ' },
                  { code: '+998', country: 'Узбекистан', iso: 'UZ' },
                  { code: '+992', country: 'Таджикистан', iso: 'TJ' },
                  { code: '+993', country: 'Туркменистан', iso: 'TM' },
                  { code: '+996', country: 'Кыргызстан', iso: 'KG' },
                  { code: '+374', country: 'Армения', iso: 'AM' },
                  { code: '+994', country: 'Азербайджан', iso: 'AZ' },
                  { code: '+373', country: 'Молдова', iso: 'MD' },
                  { code: '+995', country: 'Грузия', iso: 'GE' },
                ]"
                label="Номер телефона"
                required
              />
            </AppTooltip>
            <AppTooltip
              text="Это поле обязательно для заполнения"
              type="error"
              :show="emailRef?.showError"
            >
              <AppInput
                id="email"
                ref="emailRef"
                v-model="orderStore.email"
                type="text"
                label="E-mail"
                custom-class="w-full"
                required
              />
            </AppTooltip>
          </div>
          <AppTooltip
            text="Выберите способ доставки"
            type="error"
            :show="orderStore.showErrorDeliveryMethod"
            @update:show="(value) => (orderStore.showErrorDeliveryMethod = value)"
          >
            <div class="relative flex flex-col gap-6 w-full">
              <span class="font-light text-sm">Доставка</span>
              <AppTooltip
                text="Это поле обязательно для заполнения"
                type="error"
                :show="cityRef?.showError"
              >
                <AppSelect
                  ref="cityRef"
                  v-model="orderStore.city"
                  :options="['Москва', 'Питер', 'Ростов', 'Краснодар', 'Мурманск', 'Брянск']"
                  label="Город"
                  custom-class="w-full"
                  required
                />
              </AppTooltip>
              <div class="flex flex-col gap-6">
                <AppCheckbox
                  v-model="orderStore.deliveryMethod"
                  size="M"
                  label="Самовывоз"
                  value="Самовывоз"
                />
                <AppCheckbox
                  v-model="orderStore.deliveryMethod"
                  size="M"
                  label="Курьер (# дней)"
                  value="Курьер"
                />
              </div>
              <div
                v-if="orderStore.deliveryMethod === 'Курьер'"
                class="flex flex-col gap-4"
              >
                <AppCheckbox
                  v-for="(address, index) in orderStore.addresses"
                  :key="index"
                  v-model="orderStore.currentAddress"
                  size="S"
                  :label="address"
                  :value="address"
                />
                <AppCheckbox
                  v-model="orderStore.currentAddress"
                  size="S"
                  label="Новый адрес"
                  value="Новый адрес"
                />
                <div
                  v-if="orderStore.currentAddress === 'Новый адрес'"
                  class="flex flex-col gap-4"
                >
                  <AppTooltip
                    text="Это поле обязательно для заполнения"
                    type="error"
                    :show="newAddressRef?.showError"
                  >
                    <AppInput
                      id="address1"
                      ref="newAddressRef"
                      v-model="orderStore.newAddressFirstLine"
                      type="text"
                      label="Улица, дом, корпус, строение, квартира"
                      custom-class="w-full"
                      required
                    />
                  </AppTooltip>
                  <AppInput
                    id="address2"
                    v-model="orderStore.newAddressSecondLine"
                    type="text"
                    label="Номер дома и домофон / офис"
                  />
                  <AppButton
                    custom-class="w-full"
                    content="Сохранить"
                    variant="primary"
                    @click="handleSave"
                  />
                </div>
              </div>
              <AppCheckbox
                v-model="orderStore.deliveryMethod"
                size="M"
                disabled
                label="СДЭК (ПВЗ)"
                value="СДЭК (ПВЗ)"
              />
              <AppInput
                id="forCourier"
                v-model="orderStore.commentForCourier"
                type="text"
                label="Пожелания и комментарии для курьера"
              />
            </div>
          </AppTooltip>
          <AppTooltip
            text="Выберите способ оплаты"
            type="error"
            :show="orderStore.showErrorPaymentMethod"
            @update:show="(value) => (orderStore.showErrorPaymentMethod = value)"
          >
            <div class="relative flex flex-col gap-6">
              <span class="font-light text-sm">Способ оплаты</span>
              <div class="flex flex-col gap-4">
                <AppCheckbox
                  v-model="orderStore.paymentMethod"
                  size="S"
                  label="Картой на сайте"
                  value="Картой на сайте"
                />
                <AppCheckbox
                  v-model="orderStore.paymentMethod"
                  size="S"
                  label="Оплата при получении"
                  value="Оплата при получении"
                />
              </div>
            </div>
          </AppTooltip>
        </template>
        <div
          v-else-if="orderStore.isPaymentSuccessful"
          class="flex flex-col gap-4"
        >
          <h2 class="font-[Inter] text-[17px] text-[#211D1D] uppercase">Благодарим Вас за заказ №31388!</h2>
          <p class="font-[Manrope] text-sm text-[#211D1D] font-light">
            Мы уже проверяем ваш платеж и в течение 30 минут информация появится в вашем личном кабинете
          </p>
          <p class="font-[Manrope] text-sm text-[#211D1D] font-light">
            В случае возникновения вопросов свяжитесь с нами, пожалуйста, написав на почту clients@ или по телефону
            +7999 999 99 99
          </p>
        </div>
        <div
          v-else
          class="flex flex-col gap-4"
        >
          <h2 class="font-[Inter] text-[17px] text-[#E29650] uppercase">Оплата заказа не прошла</h2>
          <p class="font-[Manrope] text-sm text-[#211D1D] font-light">
            При оплате картами может возникать задержка до 5-ти минут. Если оплата была проведена, то она обязательно
            будет принята и обработана.
          </p>
          <p class="font-[Manrope] text-sm text-[#211D1D] font-light">
            Если вы отменили оплату, можете оплатить через личный кабинет, или изменить заказ.
          </p>
        </div>
      </div>
      <div class="p-8 w-full max-w-[564px] h-fit rounded-lg border-[0.7px] border-[#BBB8B6]">
        <template v-if="orderStore.isPaymentSuccessful === null">
          <div class="flex flex-col gap-8">
            <div class="flex flex-col gap-6">
              <div
                v-for="(item, index) in orderStore.cartDetailed"
                :key="index"
                class="flex items-center justify-between w-full"
              >
                <div class="flex items-center gap-2">
                  <NuxtImg
                    :src="item?.images[0]"
                    alt="order-img"
                    width="57"
                    height="72"
                    class="rounded-2xl border-[0.5px] border-[#211D1D]"
                  />
                  <div class="flex flex-col gap-1">
                    <span
                      class="font-light text-sm text-[#414141] cursor-pointer"
                      @click="navigateTo(`/catalog/${item.id}`)"
                    >
                      {{ item!.name }}
                    </span>
                    <span class="font-light text-[13px]"
                      >Размер: {{ item!.size }} <span class="ml-1">Цвет: {{ item!.color }}</span></span
                    >
                    <span class="text-xs text-[#414141]"
                      >{{ orderStore.priceFormatter(item!.price) }}
                      <span class="font-light text-[#606060] ml-1">за шт.</span></span
                    >
                  </div>
                </div>
                <div class="flex flex-col items-end gap-4">
                  <div class="flex items-center gap-2">
                    <div class="py-1 px-2 flex gap-1 rounded-xl border-[0.7px] border-[#211D1D] text-xs font-light">
                      <button
                        class="w-4 h-4 flex items-center justify-center cursor-pointer"
                        @click="orderStore.decrementQuantity(item!.id, item!.vector)"
                      >
                        <NuxtImg
                          src="/minus.svg"
                          alt="minus"
                          class="w-full"
                        />
                      </button>
                      {{ item!.count }}
                      <button
                        class="w-4 h-4 flex items-center justify-center cursor-pointer"
                        @click="orderStore.incrementQuantity(item!.id, item!.vector)"
                      >
                        <NuxtImg
                          src="/plus.svg"
                          alt="plus"
                          class="w-full"
                        />
                      </button>
                    </div>
                    <button
                      class="w-6 h-6 flex items-center justify-center cursor-pointer"
                      @click="orderStore.removeItemFromCart(item!.id, item!.vector)"
                    >
                      <NuxtImg
                        src="/x.svg"
                        alt="x"
                        class="w-full"
                      />
                    </button>
                  </div>
                  <span class="text-xs font-light"
                    >{{ orderStore.priceFormatter(item!.price * item!.count) }}
                    <span
                      v-if="item!.oldPrice > 0"
                      class="line-through ml-1"
                      >{{ orderStore.priceFormatter(item!.oldPrice * item!.count) }}</span
                    ></span
                  >
                </div>
              </div>
              <div class="flex flex-col gap-4">
                <div
                  class="flex items-center justify-between cursor-pointer"
                  @click="orderStore.togglePromoCode"
                >
                  <span class="font-light text-sm">Промокод</span>
                  <button
                    class="w-4 h-4 flex items-center justify-center cursor-pointer"
                    :class="orderStore.isExpandedPromoCode ? 'rotate-0' : 'rotate-180'"
                  >
                    <NuxtImg
                      src="/order-arrow.svg"
                      class="w-full"
                    />
                  </button>
                </div>
                <div
                  class="collapsible-div flex flex-col gap-4 transition-max-height duration-300 ease-in-out overflow-hidden"
                  :class="{
                    'max-h-500 opacity-100': orderStore.isExpandedPromoCode,
                    'max-h-0 opacity-0': !orderStore.isExpandedPromoCode,
                  }"
                >
                  <AppInput
                    id="promoCode"
                    v-model="orderStore.promoCode"
                    label="Введите код"
                    type="text"
                  />
                  <AppButton
                    v-if="orderStore.promoCode"
                    variant="primary"
                    custom-class="w-full"
                    content="Использовать"
                    @click="orderStore.addPromoCode"
                  />
                  <span
                    v-if="orderStore.addPromoCodeError"
                    class="font-light text-[13px] text-[#E57979]"
                    >{{ orderStore.addPromoCodeError }}</span
                  >
                  <template
                    v-for="promoCode in orderStore.currentPromoCodes"
                    :key="promoCode.code"
                  >
                    <AppCheckbox
                      v-model="orderStore.pendingPromoCode"
                      size="S"
                      :label="`Промокод “${promoCode.code}” -${promoCode.discount}% Выгода ${orderStore.savedMoney(promoCode.discount)} ₽`"
                      :value="promoCode.code"
                    />
                  </template>
                  <AppButton
                    variant="primary"
                    custom-class="w-full"
                    content="Применить промокод"
                    @click="orderStore.applyPromoCode"
                  />
                  <span
                    v-if="orderStore.usePromoCodeError"
                    class="font-light text-[13px] text-[#E57979]"
                    >{{ orderStore.usePromoCodeError }}</span
                  >
                </div>
              </div>
              <div
                v-if="authStore.isAuth"
                class="flex flex-col gap-4"
              >
                <div
                  class="flex items-center justify-between cursor-pointer"
                  @click="orderStore.togglePoints"
                >
                  <span class="font-light text-sm">Баллы</span>
                  <button
                    class="w-4 h-4 flex items-center justify-center cursor-pointer"
                    :class="orderStore.isExpandedPoints ? 'rotate-0' : 'rotate-180'"
                  >
                    <NuxtImg
                      src="/order-arrow.svg"
                      class="w-full"
                    />
                  </button>
                </div>
                <div
                  class="collapsible-div flex flex-col gap-4 transition-max-height duration-300 ease-in-out overflow-hidden"
                  :class="{
                    'max-h-500 opacity-100': orderStore.isExpandedPoints,
                    'max-h-0 opacity-0': !orderStore.isExpandedPoints,
                  }"
                >
                  <span class="text-[13px]">Сумма баллов: {{ userStore.user?.points }}</span>
                  <AppInput
                    id="points"
                    v-model="orderStore.pendingPoints"
                    label="Введите сумму баллов для списания"
                    type="text"
                  />
                  <AppButton
                    variant="primary"
                    custom-class="w-full"
                    :content="`Списать ${orderStore.pendingPoints || 0} рублей`"
                    @click="orderStore.applyPoints"
                  />
                  <span
                    v-if="orderStore.pointsError"
                    class="font-light text-[13px] text-[#E57979]"
                    >{{ orderStore.pointsError }}</span
                  >
                </div>
              </div>
              <div
                v-if="authStore.isAuth"
                class="flex flex-col gap-4"
              >
                <div
                  class="flex items-center justify-between cursor-pointer"
                  @click="orderStore.toggleCert"
                >
                  <span class="font-light text-sm">Сертификат</span>
                  <button
                    class="w-4 h-4 flex items-center justify-center cursor-pointer"
                    :class="orderStore.isExpandedCert ? 'rotate-0' : 'rotate-180'"
                  >
                    <NuxtImg
                      src="/order-arrow.svg"
                      class="w-full"
                    />
                  </button>
                </div>
                <div
                  class="collapsible-div flex flex-col gap-4 transition-max-height duration-300 ease-in-out overflow-hidden"
                  :class="{
                    'max-h-500 opacity-100': orderStore.isExpandedCert,
                    'max-h-0 opacity-0': !orderStore.isExpandedCert,
                  }"
                >
                  <AppInput
                    id="certificate"
                    v-model="orderStore.newCertificateCode"
                    label="Введите код"
                    type="text"
                  />
                  <AppButton
                    v-if="orderStore.newCertificateCode"
                    variant="primary"
                    custom-class="w-full"
                    content="Добавить сертификат"
                    @click="orderStore.addCertificate"
                  />
                  <span
                    v-if="orderStore.certificateError"
                    class="font-light text-[13px] text-[#E57979]"
                    >{{ orderStore.certificateError }}</span
                  >
                  <template
                    v-for="cert in userStore.user?.certificates"
                    :key="cert.code"
                  >
                    <AppCheckbox
                      v-model="orderStore.selectedCertificates"
                      size="S"
                      :label="`Сертификат ${cert.code} на сумму ${cert.sum} рублей`"
                      :value="cert.code"
                    />
                  </template>
                </div>
              </div>
              <div class="flex flex-col gap-1 text-sm font-light">
                <div class="flex items-center justify-between">
                  <span>Доставка:</span>
                  <span>0 ₽ при сумме заказа от 30 000 ₽</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>Стоимость товаров:</span>
                  <span class="flex items-center gap-2"
                    >{{ orderStore.priceFormatter(orderStore.totalSum) }}
                    <span
                      v-if="orderStore.totalOldSum > orderStore.totalSum"
                      class="font-extralight line-through"
                      >{{ orderStore.priceFormatter(orderStore.totalOldSum) }}</span
                    ></span
                  >
                </div>
                <div class="flex items-center justify-between">
                  <span>Окончательная стоимость:</span>
                  <span class="flex items-center gap-2"
                    >{{ orderStore.priceFormatter(orderStore.finalPrice) }}
                    <span
                      v-if="orderStore.totalSum > orderStore.finalPrice"
                      class="font-extralight line-through"
                      >{{ orderStore.priceFormatter(orderStore.totalSum) }}</span
                    ></span
                  >
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <AppButton
                  class="w-full"
                  content="Оплатить заказ"
                  @click="handlePay"
                />
                <p class="text-xs text-[#8C8785]">
                  Нажимая на кнопку «Оплатить», Вы соглашаетесь с условиями публичной оферты, принимаете политику защиты
                  и обработки персональных данных и даете свое согласие на их обработку.
                </p>
              </div>
            </div>
          </div>
        </template>
        <div v-else-if="orderStore.isPaymentSuccessful">
          <h2 class="font-[Inter] text-[17px] text-[#211D1D] uppercase">заказанные товары</h2>
          <div class="flex flex-col gap-6 mt-8">
            <div
              v-for="(item, index) in orderStore.cartDetailed"
              :key="index"
              class="flex items-center justify-between w-full"
            >
              <div class="flex items-center gap-2">
                <NuxtImg
                  :src="item!.images[0]"
                  alt="order-img"
                  width="57"
                  height="72"
                  class="rounded-2xl border-[0.5px] border-[#211D1D]"
                />
                <div class="flex flex-col gap-1">
                  <span
                    class="font-light text-sm text-[#414141] cursor-pointer"
                    @click="navigateTo(`/catalog/${item.id}`)"
                  >
                    {{ item!.name }}
                  </span>
                  <span class="font-light text-[13px]"
                    >Размер: {{ item!.size }} <span class="ml-1">Цвет: {{ item!.color }}</span></span
                  >
                  <span class="text-xs text-[#414141]"
                    >{{ orderStore.priceFormatter(item!.price) }}
                    <span class="font-light text-[#606060] ml-1">за шт.</span></span
                  >
                </div>
              </div>
              <div class="flex flex-col items-end gap-4">
                <div class="flex items-center gap-2">
                  <div class="py-1 px-3 flex gap-1 rounded-xl border-[0.7px] border-[#211D1D] text-xs font-light">
                    {{ item!.count }}
                  </div>
                </div>
                <span class="text-xs font-light"
                  >{{ orderStore.priceFormatter(item!.price * item!.count) }}
                  <span
                    v-if="item!.oldPrice > 0"
                    class="line-through ml-1"
                    >{{ orderStore.priceFormatter(item!.oldPrice * item!.count) }}</span
                  ></span
                >
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between mt-8">
            <span>Стоимость товаров:</span>
            <span class="flex items-center gap-2"
              >{{ orderStore.priceFormatter(orderStore.finalPrice) }}
              <span
                v-if="orderStore.finalPrice !== orderStore.totalOldSum"
                class="font-extralight line-through"
                >{{ orderStore.priceFormatter(orderStore.totalOldSum) }}</span
              ></span
            >
          </div>
        </div>
        <div v-else>
          <div class="flex flex-col gap-6">
            <div
              v-for="(item, index) in orderStore.cartDetailed"
              :key="index"
              class="flex items-center justify-between w-full"
            >
              <div class="flex items-center gap-2">
                <NuxtImg
                  :src="item!.images[0]"
                  alt="order-img"
                  width="57"
                  height="72"
                  class="rounded-2xl border-[0.5px] border-[#211D1D]"
                />
                <div class="flex flex-col gap-1">
                  <span
                    class="font-light text-sm text-[#414141] cursor-pointer"
                    @click="navigateTo(`/catalog/${item.id}`)"
                  >
                    {{ item!.name }}
                  </span>
                  <span class="font-light text-[13px]">Размер: {{ item!.size }} Цвет: {{ item!.color }}</span>
                  <span class="text-xs text-[#414141]"
                    >{{ orderStore.priceFormatter(item!.price) }}
                    <span class="font-light text-[#606060]">за шт.</span></span
                  >
                </div>
              </div>
              <div class="flex flex-col items-end gap-4">
                <div class="flex items-center gap-2">
                  <div class="py-1 px-2 flex gap-1 rounded-xl border-[0.7px] border-[#211D1D] text-xs font-light">
                    <button
                      class="w-4 h-4 flex items-center justify-center cursor-pointer"
                      @click="orderStore.decrementQuantity(item!.id, item!.vector)"
                    >
                      <NuxtImg
                        src="/minus.svg"
                        alt="minus"
                        class="w-full"
                      />
                    </button>
                    {{ item!.count }}
                    <button
                      class="w-4 h-4 flex items-center justify-center cursor-pointer"
                      @click="orderStore.incrementQuantity(item!.id, item!.vector)"
                    >
                      <NuxtImg
                        src="/plus.svg"
                        alt="plus"
                        class="w-full"
                      />
                    </button>
                  </div>
                  <button
                    class="w-6 h-6 flex items-center justify-center cursor-pointer"
                    @click="orderStore.removeItemFromCart(item!.id, item!.vector)"
                  >
                    <NuxtImg
                      src="/x.svg"
                      alt="x"
                      class="w-full"
                    />
                  </button>
                </div>
                <span class="text-xs font-light"
                  >{{ orderStore.priceFormatter(item!.price * item!.count) }}
                  <span
                    v-if="item!.oldPrice > 0"
                    class="line-through ml-1"
                    >{{ orderStore.priceFormatter(item!.oldPrice * item!.count) }}</span
                  ></span
                >
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between mt-8">
            <span>Стоимость товаров:</span>
            <span class="flex items-center gap-2"
              >{{ orderStore.priceFormatter(orderStore.finalPrice) }}
              <span
                v-if="orderStore.finalPrice !== orderStore.totalOldSum"
                class="font-extralight line-through"
                >{{ orderStore.priceFormatter(orderStore.totalOldSum) }}</span
              ></span
            >
          </div>
          <div class="relative flex flex-col gap-6 mt-8">
            <span class="font-light text-sm">Способ оплаты</span>
            <div class="flex flex-col gap-4">
              <AppCheckbox
                v-model="orderStore.paymentMethod"
                size="S"
                label="Картой на сайте"
                value="Картой на сайте"
              />
              <AppCheckbox
                v-model="orderStore.paymentMethod"
                size="S"
                label="Оплата при получении"
                value="Оплата при получении"
              />
            </div>
            <div
              class="absolute -top-[40px] left-3 bg-[#FFFFFA] transition-opacity duration-300 border border-[#A6CEFF] text-[#211D1D] text-[13px] font-light font-[Manrope] p-4 shadow-md z-10 rounded-t-3xl rounded-r-3xl"
              :class="orderStore.showErrorPaymentMethod ? 'opacity-100' : 'opacity-0'"
            >
              Выберите способ оплаты
            </div>
          </div>
          <AppButton
            class="w-full mt-8"
            content="Оплатить заказ"
            @click="handlePay"
          />
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
