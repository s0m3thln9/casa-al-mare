<script setup lang="ts">

useHead({
  title: "Профиль - CASA AL MARE",
})

const route = useRoute()
const router = useRouter()

const tabs = ["Профиль", "Заказы", "Сертификаты", "Избранное"]

const slugToTab: Record<string, string> = {
  profile: "Профиль",
  orders: "Заказы",
  certificates: "Сертификаты",
  favorites: "Избранное",
}

const tabToSlug: Record<string, string> = {
  Профиль: "profile",
  Заказы: "orders",
  Сертификаты: "certificates",
  Избранное: "favorites",
}

const slug = route.params.slug as string
const currentTab = ref(slugToTab[slug] || "Профиль")

const profileStore = useProfileStore()
const userStore = useUserStore()
const orderStore = useOrderStore()
const favoritesStore = useFavoritesStore()
const catalogStore = useCatalogStore()

const favoriteItems = computed(() => catalogStore.items.filter((item) => favoritesStore.favorites.includes(item.id)))

const nameRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const surnameRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const dayRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const monthRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const yearRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const cityRef = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const adr1Ref = ref<{ validate: () => boolean; showError: boolean } | null>(null)
const adr2Ref = ref<{ validate: () => boolean; showError: boolean } | null>(null)

const certificateCode = ref("")
const certificateError = ref("")
const showCertificateError = ref(false)
const isLoadingCertificate = ref(false)

const certificateBalance = computed(() => {
  return userStore.user?.certificates?.reduce((acc, cert) => acc + cert.value_now, 0) || 0
})

const handleResetPassword = async (): Promise<void> => {
  await profileStore.resetPassword()
}

const handleLogout = async () => {
  await userStore.logout()
}

const handleSaveProfile = async (): Promise<void> => {
  if (!profileStore.hasChanges) {
    profileStore.saveError = "Нет изменений для сохранения"
    return
  }

  const requiredRefs = [nameRef, surnameRef, dayRef, monthRef, yearRef, cityRef, adr1Ref]
  const isValid = requiredRefs.every((ref) => ref?.value?.validate() ?? false)
  if (!isValid) return

  if (adr2Ref.value && profileStore.profileData.adr2 && !adr2Ref.value.validate()) return

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(profileStore.profileData.email)) {
    profileStore.saveError = "Некорректный email"
    return
  }

  const success = await profileStore.saveProfile()
  if (success) {
    profileStore.buttonContent = "Сохранено!"
    setTimeout(() => {
      profileStore.buttonContent = "Сохранить"
    }, 2000)
    profileStore.saveError = ""
  } else {
    console.error("Ошибка сохранения")
  }
}

const handleAddCertificate = async (): Promise<void> => {
  if (isLoadingCertificate.value) return

  isLoadingCertificate.value = true
  certificateError.value = ""
  showCertificateError.value = false

  const code = certificateCode.value.trim()

  if (!code) {
    certificateError.value = "Введите код сертификата"
    showCertificateError.value = true
    isLoadingCertificate.value = false
    return
  }

  if (userStore.user?.certificates.some((c) => c.code === code)) {
    certificateError.value = "Сертификат уже добавлен"
    showCertificateError.value = true
    isLoadingCertificate.value = false
    return
  }

  const token = await userStore.loadToken()
  if (!token) {
    certificateError.value = "Ошибка авторизации"
    showCertificateError.value = true
    isLoadingCertificate.value = false
    return
  }

  try {
    const response = await $fetch<{ success: boolean; error?: string; certificates?: any[] }>(
      "https://back.casaalmare.com/api/addCertificate",
      {
        method: "POST",
        body: { token, code },
      },
    )

    if (response.success && response.certificates) {
      if (userStore.user) {
        userStore.user.certificates = response.certificates
      }
      certificateCode.value = ""
      certificateError.value = ""
      showCertificateError.value = false
    } else {
      certificateError.value = response.error || "Сертификат не найден"
      showCertificateError.value = true
    }
  } catch (error) {
    certificateError.value = "Ошибка сети или API"
    showCertificateError.value = true
    console.error("Ошибка добавления сертификата:", error)
  } finally {
    isLoadingCertificate.value = false
  }
}

const handleTabChange = (tab: string) => {
  currentTab.value = tab
  const newSlug = tabToSlug[tab]
  router.push(`/profile/${newSlug}`)
}

const authStore = useAuthStore()

function normalizeAddress(address: string | string[] | null): string {
  if (!address) return ""
  if (Array.isArray(address)) {
    return address.filter(Boolean).join(", ")
  }
  return address
}

onMounted(async () => {
  await profileStore.loadProfile()
  await orderStore.loadPaymentMethods()
})

watch(
  () => userStore.user,
  async () => {
    await profileStore.loadProfile()
  },
)

watch(
  () => route.params.slug,
  (newSlug) => {
    if (typeof newSlug === "string" && slugToTab[newSlug]) {
      currentTab.value = slugToTab[newSlug]
    }
  },
)
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] flex justify-center items-center pt-16 pb-8 flex-col">
    <div
      v-if="authStore.isAuth"
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
        @update:model-value="handleTabChange"
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
          <AppTooltip
            :text="profileStore.resetMessage"
            :type="profileStore.resetMessageType"
            :show="!!profileStore.resetMessage"
            @update:show="
              (value) => {
                if (!value) profileStore.resetMessage = ''
              }
            "
          >
            <AppButton
              variant="primary"
              :content="profileStore.resetButtonContent"
              :disabled="profileStore.resetButtonDisabled"
              custom-class="w-full"
              :loading="profileStore.isResetLoading"
              @click="handleResetPassword"
            />
          </AppTooltip>
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
          <div class="w-full flex items-start gap-4">
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
        <div class="w-full flex flex-col mt-4 gap-4">
          <span class="font-light text-xs">Адрес доставки</span>
          <AppTooltip
            text="Это поле обязательно для заполнения"
            type="error"
            :show="cityRef?.showError"
          >
            <AppSelect
              ref="cityRef"
              v-model="profileStore.profileData.city"
              label="Город"
              custom-class="w-full"
              required
              searchable
              async-search
              city-mode
              async-search-url="https://back.casaalmare.com/api/getCityByQuery"
            />
          </AppTooltip>
          <AppTooltip
            text="Это поле обязательно для заполнения"
            type="error"
            :show="adr1Ref?.showError"
          >
            <AppInput
              id="adr1"
              ref="adr1Ref"
              v-model="profileStore.profileData.adr1"
              label="Улица, дом, корпус, строение, квартира"
              type="text"
              required
              custom-class="w-full"
            />
          </AppTooltip>
          <AppInput
            id="adr2"
            ref="adr2Ref"
            v-model="profileStore.profileData.adr2"
            label="Подъезд, код домофона"
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
            :disabled="!profileStore.hasChanges || profileStore.isSaving"
            custom-class="w-full mt-8"
            @click="handleSaveProfile"
          />
        </AppTooltip>
        <div class="flex flex-col gap-4 mt-8">
              <div
                class="flex items-center justify-between cursor-pointer"
                @click="orderStore.togglePoints2"
              >
                <span class="font-light text-sm">Программа лояльности</span>
                <button
                  class="w-4 h-4 flex items-center justify-center cursor-pointer transition-transform duration-300"
                  :class="orderStore.isExpandedPoints2 ? 'rotate-0' :
                  'rotate-180'"
                >
                  <div class="arrow-icon" />
                </button>
              </div>
              <div
                class="collapsible-div flex flex-col gap-4 transition-max-height duration-300 ease-in-out overflow-hidden"
                :class="{
                  'max-h-500 opacity-100': orderStore.isExpandedPoints2,
                  'max-h-0 opacity-0': !orderStore.isExpandedPoints2,
                }"
              >
                <span class="text-sm text-[#1A1A1A] font-light">Ваш баланс: {{
                    userStore.user.points ?? 0
                                          }}</span>
                <div class="flex flex-col gap-2">
                  <div
                    class="p-6 border rounded-lg flex items-start gap-4 max-sm:flex-col"
                    :class="userStore.user.loyaltyLevel === 1 ? 'border-[#211D1D]' : 'border-[#BBB8B6]'"
                  >
                    <div
                      class="px-4 py-2 w-[100px] rounded-lg text-sm tracking-tighter"
                      :class="userStore.user.loyaltyLevel === 1 ?
                      'bg-[#F3A454] text-[#FFFFFA]' :
                      'border border-[#8C8785] text-[#8C8785]'"
                    >
                      1 уровень:
                    </div>
                    <p
class="text-sm"
                       :class="userStore.user.loyaltyLevel === 1 ? 'text-[#181818]' : 'text-[#8C8785]'"
                    >
                      Общая сумма покупок с использованием карты: 0 - 100 000<br>
  Процент начисления бонусов от суммы покупки: 5%<br>
  Процент возможного списания бонусов: До 10%
                    </p>
                  </div>
                  <div
                    class="p-6 border rounded-lg flex items-start gap-4 max-sm:flex-col"
                    :class="userStore.user.loyaltyLevel === 2 ?
                    'border-[#211D1D]' : 'border-[#BBB8B6]'"
                  >
                    <div
                      class="px-4 py-2 w-[100px] rounded-lg text-sm tracking-tighter"
                      :class="userStore.user.loyaltyLevel === 2 ?
                      'bg-[#F3A454] text-[#FFFFFA]' :
                      'border border-[#8C8785] text-[#8C8785]'"
                    >
                      2 уровень:
                    </div>
                    <p class="text-sm" :class="userStore.user.loyaltyLevel === 1 ? 'text-[#181818]' : 'text-[#8C8785]'">
                      Общая сумма покупок с использованием карты: 101 000 - 200
                      000<br>
  Процент начисления бонусов от суммы покупки: 5%<br>
  Процент возможного списания бонусов: До 15%
                    </p>
                  </div>
                  <div
                    class="p-6 border rounded-lg flex items-start gap-4 max-sm:flex-col"
                    :class="userStore.user.loyaltyLevel === 3 ?
                    'border-[#211D1D]' : 'border-[#BBB8B6]'"
                  >
                    <div
                      class="px-4 py-2 w-[100px] rounded-lg text-sm tracking-tighter"
                      :class="userStore.user.loyaltyLevel === 3 ?
                      'bg-[#F3A454] text-[#FFFFFA]' :
                      'border border-[#8C8785] text-[#8C8785]'"
                    >
                      3 уровень:
                    </div>
                    <p class="text-sm" :class="userStore.user.loyaltyLevel === 1 ? 'text-[#181818]' : 'text-[#8C8785]'">
                      Общая сумма покупок с использованием карты: 201 000 и
                      выше<br>
  Процент начисления бонусов от суммы покупки: 5%<br>
  Процент возможного списания бонусов: До 20%
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
              deliveryMethod:
                order.order.deliveryMethod === '1'
                  ? 'Курьер СДЭК'
                  : order.order.deliveryMethod === '2'
                    ? 'Курьер СДЭК с примеркой'
                    : order.order.deliveryMethod === '3'
                      ? 'Экспресс-доставка (Яндекс курьер, индивидуальный расчет)'
                      : order.order.deliveryMethod === '4'
                        ? 'СДЭК (ПВЗ)'
                        : null,
              paymentMethod:
                order.order.paymentMethod === '1'
                  ? 'Картой на сайте'
                  : order.order.paymentMethod === '2'
                    ? 'Долями'
                    : 'Яндекс сплит',
              receiver: userStore.user!.profile.fullname,
              address: normalizeAddress(order.order.currentAddress),
              finalPrice: order.order.orderCost || 0,
              deliveryCost: order.order.deliveryCost || 0,
              usedCertificates: order.order.used_certificates || [],
              points: order.order.points || 0,
              items: Object.values(order.cart).map((item) => ({
                id: item.id,
                alias: item.alias,
                images: Object.values(item.images || {}).filter((img) => img && img.trim() !== ''),
                name: item.name,
                size: item.variant,
                color: item.colorName,
                price: +item.price || 0,
                oldPrice: +item.oldPrice || 0,
                count: item.count,
                isCertificate: item.id === -1,
                isGame: item.template === 6,
                recipientName: item.options?.recipientName,
                deliveryDetails: item.options?.deliveryDetails,
                certificateType: item.options?.certificateType,
                deliveryMethod: item.options?.deliveryMethod,
                recipientEmail: item.options?.recipientEmail,
                recipientPhone: item.options?.recipientPhone,
              })),
            }"
          />
        </div>
      </div>
      <div
        v-if="currentTab === 'Сертификаты'"
        class="w-full"
      >
        <div
          v-if="(userStore.user?.certificates?.length || 0) > 0 || true"
          class="mt-8 flex flex-col w-full justify-center items-center gap-6"
        >
          <div class="grid grid-cols-2 gap-4 w-full items-center">
            <AppTooltip
              :text="certificateError"
              type="error"
              :show="showCertificateError"
              @update:show="
                (value) => {
                  if (!value) {
                    certificateError = ''
                    showCertificateError = false
                  }
                }
              "
            >
              <AppInput
                id="code"
                v-model="certificateCode"
                custom-class="w-full"
                label="Введите код"
                type="text"
                :disabled="isLoadingCertificate"
              />
            </AppTooltip>
            <AppButton
              content="Применить"
              variant="primary"
              custom-class="w-full"
              :loading="isLoadingCertificate"
              :disabled="isLoadingCertificate"
              @click="handleAddCertificate"
            />
          </div>
          <div class="flex flex-col gap-2 w-full">
            <template
              v-for="cert in userStore.user?.certificates ?? []"
              :key="cert.id"
            >
              <div
                v-if="cert.value_now > 0"
                class="flex w-full items-center rounded-lg gap-4 p-4 border-[0.7px] border-[#BFBFBF]"
              >
                <div class="px-4 py-2 bg-[#FFF4A4] rounded-lg font-light text-sm">{{ cert.code }}</div>
                <span class="font-light text-sm text-[#181818]">на {{ cert.value_now }} ₽</span>
              </div>
            </template>
          </div>
          <span class="font-light text-sm text-[#1A1A1A] self-start">Ваш баланс: {{ certificateBalance }} рублей</span>
        </div>
        <div
          v-else
          class="mt-8 text-center"
        >
          <p class="font-light text-sm text-[#414141]">Сертификаты отсутствуют. Добавьте новый код выше.</p>
        </div>
      </div>
      <div
        v-if="currentTab === 'Избранное'"
        class="w-full"
      >
        <div class="mt-8 grid grid-cols-1 px-2 gap-x-4 gap-y-6 sm:grid-cols-4 sm:px-4">
          <template
            v-for="item in favoriteItems"
            :key="item.id"
          >
            <CatalogCard
              :id="item.id"
              variant="large"
              link
            />
          </template>
        </div>
      </div>
    </div>
    <div v-else>
      <h2 class="uppercase text-center max-sm:text-[17px] max-sm:font-[Inter]">
        Авторизируйтесь для просмотра личного кабинета
      </h2>
    </div>
  </main>
</template>
<style scoped>
.arrow-icon {
  background-image: url("/order-arrow.svg");
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  background-position: center;
}

.arrow-icon.rotate-180 {
  transform: rotate(180deg);
}
</style>
