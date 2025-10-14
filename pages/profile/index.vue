<script setup lang="ts">
const tabs = ["Профиль", "Заказы", "Сертификаты", "Избранное"]
const currentTab = ref("Профиль")
const images = {
  card1: "/item-page-1.jpg",
}
export type EditUserResponse = {
  success: boolean
  error?: string
  changes?: Record<string, string>
}

const profileStore = useProfileStore()
const userStore = useUserStore()

const nameRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const surnameRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const dayRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const monthRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const yearRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const adr1Ref = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const adr2Ref = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const adr3Ref = ref<{ validate: () => boolean; showError: boolean } | null>(null)

const handleLogout = async () => {
  await userStore.logout()
}

const handleSaveProfile = async (): Promise<void> => {
  const requiredRefs = [nameRef, surnameRef, dayRef, monthRef, yearRef, adr1Ref, adr2Ref]
  const isValid = requiredRefs.every((ref) => ref?.value?.validate() ?? false)
  if (!isValid) return

  if (adr3Ref.value && !adr3Ref.value.validate()) return

  const success = await profileStore.saveProfile()
  if (success) {
    profileStore.buttonContent = "Сохранено!"
    setTimeout(() => {
      profileStore.buttonContent = "Сохранить"
    }, 2000)
    console.log("Профиль сохранен!")
    profileStore.saveError = ""
  } else {
    console.error("Ошибка сохранения")
  }
}

onMounted(() => {
  profileStore.loadProfile()
})
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] flex justify-center items-center pt-16 pb-8 flex-col">
    <div
      class="px-2 flex flex-col justify-center items-center w-full sm:px-0"
      :class="currentTab === 'Избранное' ? '' : 'max-w-[600px]'"
    >
      <div
        class="w-full flex justify-between items-center"
        :class="currentTab === 'Избранное' ? 'max-w-[600px]' : ''"
      >
        <span class="font-[Inter] text-[17px] text-[#1A1A1A] uppercase">Личный кабинет</span>
        <button
          class="flex justify-center items-center px-4 py-2 rounded-xl border border-transparent cursor-pointer text-[13px]/snug font-light hover:border-[#211D1D] sm:text-sm/snug sm:font-normal"
          @click="handleLogout"
        >
          Выйти
        </button>
      </div>
      <SelectButton
        v-model="currentTab"
        :variants="tabs"
        :custom-class="
          currentTab === 'Избранное' ? 'max-w-[600px] w-full mt-5 !rounded-2xl' : 'w-full mt-5 !rounded-2xl'
        "
        custom-button-class="flex-1 py-2 !text-[13px]"
        @update:model-value="(value) => (currentTab = value)"
      />
      <div
        v-if="currentTab === 'Профиль'"
        class="w-full"
      >
        <div class="flex w-full flex-col mt-8 gap-4">
          <AppInput
            id="email"
            v-model="profileStore.profileData.email"
            label="E-mail"
            type="email"
            disabled
          />
          <AppButton content="Сменить пароль" />
          <AppTooltip
            text="Это поле обязательно для заполнения"
            type="error"
            :show="nameRef?.showError"
          >
            <AppInput
              id="name"
              ref="nameRef"
              v-model="profileStore.profileData.name"
              label="Имя"
              type="text"
              required
              custom-class="w-full"
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
              v-model="profileStore.profileData.surname"
              label="Фамилия"
              type="text"
              required
              custom-class="w-full"
            />
          </AppTooltip>
          <AppInput
            id="phone"
            v-model="profileStore.profileData.phone"
            label="Номер телефона"
            type="text"
            disabled
          />
          <div class="w-full flex gap-4">
            <AppTooltip
              text="Это поле обязательно для заполнения"
              type="error"
              :show="dayRef?.showError"
              class="w-full"
            >
              <AppSelect
                ref="dayRef"
                v-model="profileStore.profileData.day"
                label="День"
                :options="profileStore.days"
                custom-class="w-full"
                required
              />
            </AppTooltip>
            <AppTooltip
              text="Это поле обязательно для заполнения"
              type="error"
              :show="monthRef?.showError"
              class="w-full"
            >
              <AppSelect
                ref="monthRef"
                v-model="profileStore.profileData.month"
                label="Месяц"
                :options="profileStore.months"
                custom-class="w-full"
                required
              />
            </AppTooltip>
            <AppTooltip
              text="Это поле обязательно для заполнения"
              type="error"
              :show="yearRef?.showError"
              class="w-full"
            >
              <AppSelect
                ref="yearRef"
                v-model="profileStore.profileData.year"
                label="Год"
                :options="profileStore.years"
                custom-class="w-full"
                required
              />
            </AppTooltip>
          </div>
        </div>
        <span class="w-full font-light text-xs text-[#F3A454] mt-2">
          Получайте поздравления и дополнительные скидки
        </span>
        <div class="w-full flex flex-col mt-8 gap-4">
          <span class="font-light text-xs">Адрес доставки</span>
          <AppTooltip
            text="Это поле обязательно для заполнения"
            type="error"
            :show="adr1Ref?.showError"
          >
            <AppInput
              id="adr1"
              ref="adr1Ref"
              v-model="profileStore.profileData.adr1"
              label="Город"
              type="text"
              required
              custom-class="w-full"
            />
          </AppTooltip>
          <AppTooltip
            text="Это поле обязательно для заполнения"
            type="error"
            :show="adr2Ref?.showError"
          >
            <AppInput
              id="adr2"
              ref="adr2Ref"
              v-model="profileStore.profileData.adr2"
              label="Улица, дом"
              type="text"
              required
              custom-class="w-full"
            />
          </AppTooltip>
          <AppInput
            id="adr3"
            ref="adr3Ref"
            v-model="profileStore.profileData.adr3"
            label="Подъезд, этаж, квартира"
            type="text"
          />
        </div>
        <AppTooltip
          :text="profileStore.saveError"
          type="error"
          :show="!!profileStore.saveError"
          @update:show="
            (value) => {
              if (!value) profileStore.saveError = ''
            }
          "
        >
          <AppButton
            variant="primary"
            :content="profileStore.buttonContent"
            :disabled="profileStore.isSaving"
            custom-class="w-full mt-8"
            @click="handleSaveProfile"
          />
        </AppTooltip>
      </div>
      <div
        v-if="currentTab === 'Заказы'"
        class="w-full"
      >
        <div class="mt-8 gap-4 flex flex-col w-full justify-center items-center">
          <OrderBox
            v-for="(order, index) in userStore.user?.orders"
            :key="index"
            :state="{
              orderId: order.orderId,
              orderDate: order.orderDate,
              status: order.status,
              deliveryDate: order.deliveryDate,
              address: order.order.currentAddress,
              deliveryMethod: order.order.deliveryMethod,
              paymentMethod: order.order.paymentMethod,
              receiver: userStore.user!.profile.fullname,
              items: Object.values(order.cart).map((item) => ({
                id: item.id,
                size: item.variant.split('_')[1],
                color: item.colors[item.variant.split('_')[0]].name,
                image: item.images[item.colors[item.variant.split('_')[0]].images[0]],
                count: item.count,
                name: item.name,
                price: item.vector[item.variant].price,
                oldPrice: item.vector[item.variant].oldPrice,
              })),
            }"
          />
        </div>
      </div>
      <div
        v-if="currentTab === 'Сертификаты'"
        class="w-full"
      >
        <div class="mt-8 flex flex-col w-full justify-center items-center gap-6">
          <div class="grid grid-cols-2 gap-4 w-full items-center">
            <AppInput
              id="code"
              v-model="code"
              label="Введите код"
              type="text"
            />
            <AppButton
              content="Применить"
              variant="primary"
              custom-class="w-full"
            />
          </div>
          <div class="flex flex-col gap-2 w-full">
            <div class="flex w-full items-center rounded-lg gap-4 p-4 border-[0.7px] border-[#BFBFBF]">
              <div class="px-4 py-2 bg-[#FFF4A4] rounded-lg font-light text-sm">065040В9340</div>
              <span class="font-light text-sm text-[#181818]">на 1 000 ₽</span>
            </div>
            <div class="flex w-full items-center rounded-lg gap-4 p-4 border-[0.7px] border-[#BFBFBF]">
              <div class="px-4 py-2 bg-[#FFF4A4] rounded-lg font-light text-sm">065040В9340</div>
              <span class="font-light text-sm text-[#181818]">на 5 000 ₽</span>
            </div>
            <div class="flex w-full items-center rounded-lg gap-4 p-4 border-[0.7px] border-[#BFBFBF]">
              <div class="px-4 py-2 bg-[#FFF4A4] rounded-lg font-light text-sm">065040В9340</div>
              <span class="font-light text-sm text-[#181818]">на 500 ₽</span>
            </div>
          </div>
          <span class="font-light text-sm text-[#1A1A1A] self-start">Ваш баланс: 8 500 рублей</span>
        </div>
      </div>
      <div
        v-if="currentTab === 'Избранное'"
        class="w-full"
      >
        <div class="mt-8 grid grid-cols-1 px-2 gap-x-4 gap-y-6 sm:grid-cols-4 sm:px-4">
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
