<script setup lang="ts">
const popupStore = usePopupStore()

const email = ref("")
const emailFooterRef = ref()

const buttonStateFooter = ref({
  content: "Подписаться",
  isLoading: false,
  showSuccess: false,
})

const authStore = useAuthStore()
const authModalStore = useAuthModalStore()

const handleSubscribeFooter = () => {
  if (emailFooterRef.value?.validate()) {
    buttonStateFooter.value.isLoading = true
    setTimeout(() => {
      buttonStateFooter.value.isLoading = false
      buttonStateFooter.value.content = "Вы подписаны"
      buttonStateFooter.value.showSuccess = true
      setTimeout(() => {
        buttonStateFooter.value.content = "Подписаться"
        buttonStateFooter.value.showSuccess = false
        email.value = ""
      }, 1000)
    }, 1000)
  } else {
    console.warn("Email не валиден для подписки")
  }
}

const handleProfileClick = () => {
  if (authStore.isAuth) {
    navigateTo("/profile/profile")
  } else {
    authModalStore.open()
  }
}

const handleFavClick = () => {
  if (authStore.isAuth) {
    navigateTo("/profile/favorites")
  } else {
    authModalStore.open()
  }
}

const handleOrdersClick = () => {
  if (authStore.isAuth) {
    navigateTo("/profile/orders")
  } else {
    authModalStore.open()
  }
}
</script>

<template>
  <footer class="py-6 px-4 font-[Manrope] font-light text-sm text-[#211D1D] bg-[#FFFFFA]">
    <AuthModal v-if="authModalStore.isOpen" />
    <div class="border border-[#BBB8B6] rounded-lg px-6 py-8 hidden justify-between flex-wrap sm:flex">
      <div class="flex flex-col gap-4">
        <h3 class="font-normal text-base uppercase">Каталог</h3>
        <ul class="flex flex-col gap-4">
          <li><NuxtLink to="/catalog/kupalniki">Купальники</NuxtLink></li>
          <li><NuxtLink to="/catalog/kupalniki/niz">Нижняя часть
                                                      купальника</NuxtLink></li>
          <li><NuxtLink to="/catalog/kupalniki/verx">Верхняя часть
                                                          купальника</NuxtLink></li>
          <li><NuxtLink to="/catalog/odezhda">Одежда
          </NuxtLink></li>
          <li><NuxtLink to="/certificate">Сертификаты</NuxtLink></li>
        </ul>
      </div>
      <div class="flex flex-col gap-4">
        <h3 class="font-normal text-base uppercase">Покупателям</h3>
        <ul class="flex flex-col gap-4">
          <li><NuxtLink to="/info/dostavka-i-oplata">Доставка и оплата</NuxtLink></li>
          <li><NuxtLink to="/info/vozvrat-i-obmen">Возврат и обмен</NuxtLink></li>
          <li><NuxtLink to="/info/rekvizity">Реквизиты</NuxtLink></li>
          <li
            class="cursor-pointer"
            @click="popupStore.open('reverse')"
          >
            Обратная связь
          </li>
          <li><NuxtLink to="/care">Уход за изделиями</NuxtLink></li>
        </ul>
      </div>
      <div class="flex flex-col gap-4">
        <h3 class="font-normal text-base uppercase">О бренде</h3>
        <ul class="flex flex-col gap-4">
          <li><NuxtLink to="/about-us">О нас</NuxtLink></li>
          <li><NuxtLink to="/contacts">Контакты</NuxtLink></li>
          <li>
            <a
              href="https://t.me/casaalmare_swim"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram
            </a>
          </li>
<!--          <li>-->
<!--            <a-->
<!--              href="https://wa.me/79300360494"-->
<!--              target="_blank"-->
<!--              rel="noopener noreferrer"-->
<!--            >-->
<!--              WhatsApp-->
<!--            </a>-->
<!--          </li>-->
          <li><NuxtLink to="/">Pinterest</NuxtLink></li>
        </ul>
      </div>
      <div class="flex flex-col gap-4">
        <h3 class="font-normal text-base uppercase">Аккаунт</h3>
        <ul class="flex flex-col gap-4">
          <li>
            <button
              aria-label="В личный кабинет"
              class="cursor-pointer"
              @click="handleProfileClick"
            >
              В личный кабинет
            </button>
          </li>
          <li>
            <button
              aria-label="Избранное"
              class="cursor-pointer"
              @click="handleFavClick"
            >
              Избранное
            </button>
          </li>
          <li>
            <button
              aria-label="Заказы"
              class="cursor-pointer"
              @click="handleOrdersClick"
            >
              Заказы
            </button>
          </li>
        </ul>
      </div>
      <div class="flex flex-col gap-1">
        <img
          src="/logo-3.svg"
          alt="CASA AL MARE"
          width="156"
          height="174"
          class="self-center"
        >
        <span class="text-xs text-[#BBB8B6]"
        ><NuxtLink
          class="hover:underline"
          to="/info/confidence"
        >Политика конфиденциальности</NuxtLink
        >
          и
          <NuxtLink
            class="hover:underline"
            to="/info/oferta"
          >оферта</NuxtLink
          ></span
        >
        <span class="text-xs text-[#BBB8B6]">CASA AL MARE © 2026</span>
      </div>
<!--      <div class="flex flex-col gap-4 w-full mt-4 lg:w-auto lg:mt-0">-->
<!--        <h3 class="font-normal text-base uppercase">Аккаунт</h3>-->
<!--        <div class="flex flex-col items-start gap-4 xl:flex-row">-->
<!--          <AppTooltip-->
<!--            text="Это поле обязательно для заполнения"-->
<!--            type="error"-->
<!--            :show="emailFooterRef?.showError"-->
<!--          >-->
<!--            <AppInput-->
<!--              id="email"-->
<!--              ref="emailFooterRef"-->
<!--              v-model="email"-->
<!--              label="Введите e-mail для получения новостей"-->
<!--              type="email"-->
<!--              custom-class="min-w-[245px]"-->
<!--              required-->
<!--            />-->
<!--          </AppTooltip>-->
<!--          <AppButton-->
<!--            :content="buttonStateFooter.content"-->
<!--            :is-loading="buttonStateFooter.isLoading"-->
<!--            :show-success="buttonStateFooter.showSuccess"-->
<!--            variant="primary"-->
<!--            custom-class="w-full px-0 max-xl:w-[245px]"-->
<!--            @click="handleSubscribeFooter"-->
<!--          />-->
<!--        </div>-->
<!--        <p class="max-w-[300px] text-[10px] font-[Commissioner] xl:max-w-[416px]">-->
<!--          Нажимая на кнопку «Подписаться», я соглашаюсь на обработку моих персональных данных и ознакомлен(а) с-->
<!--          условиями конфиденциальности.-->
<!--        </p>-->
<!--        <span class="text-xs"-->
<!--          ><NuxtLink-->
<!--            class="underline"-->
<!--            to="/info/confidence"-->
<!--            >Политика конфиденциальности</NuxtLink-->
<!--          >-->
<!--          и-->
<!--          <NuxtLink-->
<!--            class="underline"-->
<!--            to="/info/oferta"-->
<!--            >оферта</NuxtLink-->
<!--          ></span-->
<!--        >-->
<!--        <span class="text-xs">CASA AL MARE © 2026</span>-->
<!--      </div>-->
    </div>
    <div class="flex flex-col items-center gap-12 sm:hidden">
      <div class="w-full flex flex-col gap-2">
        <div class="flex gap-2">
          <a
            class="w-full h-full"
            href="https://wa.me/79300360494"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              aria-label="Whatsapp"
              class="w-full py-3 px-2 rounded-2xl bg-[#F9F6EC] font-normal text-[11px]"
            >
              Whatsapp
            </button>
          </a>
          <a
            class="w-full h-full"
            href="https://t.me/casaalmare_swim"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              aria-label="Telegram"
              class="w-full py-3 px-2 rounded-2xl bg-[#F9F6EC] font-normal text-[11px]"
            >
              Telegram
            </button>
          </a>
<!--          <button-->
<!--            aria-label="Рассылка"-->
<!--            class="w-full py-3 px-2 rounded-2xl bg-[#F9F6EC] font-normal text-[11px]"-->
<!--            @click="popupStore.open('subscription')"-->
<!--          >-->
<!--            Рассылка-->
<!--          </button>-->
        </div>
        <button
          aria-label="Обратная связь"
          class="w-full py-3 px-2 rounded-2xl bg-[#F9F6EC] font-normal text-[11px]"
          @click="popupStore.open('reverse')"
        >
          Обратная связь
        </button>
        <NuxtLink
          class="w-full h-full"
          to="/info/rekvizity"
        >
          <button class="w-full py-3 px-2 rounded-2xl bg-[#F9F6EC] font-normal text-[11px]">Реквизиты</button>
        </NuxtLink>
        <div class="flex gap-2">
          <button
            class="w-full py-3 px-2 rounded-2xl bg-[#F9F6EC] font-normal text-[11px]"
            aria-label="Политика конфиденциальности и оферта"
          >
            <NuxtLink to="/info/confidence">Политика конфиденциальности</NuxtLink>
          </button>
          <button
            class="w-full py-3 px-2 rounded-2xl bg-[#F9F6EC] font-normal text-[11px]"
            aria-label="Политика конфиденциальности и оферта"
          >
            <NuxtLink to="/info/oferta">Оферта</NuxtLink>
          </button>
        </div>
      </div>
      <img
        src="/logo-3.svg"
        alt="CASA AL MARE"
        width="156"
        height="174"
      >
      <span class="text-xs text-[#BBB8B6]">CASA AL MARE © 2026</span>
    </div>
  </footer>
</template>
