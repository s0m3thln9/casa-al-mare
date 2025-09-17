<script setup lang="ts">
const authStore = useAuthStore()
const authModalStore = useAuthModalStore()

const selectInputRef = ref()

const handleClick = () => {
  if (!selectInputRef.value?.validate()) return
  authStore.login()
  authModalStore.close()
}
</script>

<template>
  <div class="absolute inset-0 z-10 flex justify-center items-center">
    <div class="w-[300px] bg-[#FFFFFA] border-[0.7px] border-[#211D1D] rounded-2xl">
      <div class="flex justify-end items-center">
        <button
          class="p-2 cursor-pointer"
          @click="authModalStore.close"
        >
          <NuxtImg
            src="/x.svg"
            width="24"
          />
        </button>
      </div>
      <div class="px-6 pb-6 flex flex-col items-center">
        <h2 class="mb-8 font-[Manrope] text-sm text-[#211D1D] text-center uppercase">Присоединиться</h2>
        <SelectButton
          v-model="authStore.method"
          :variants="['По телефону', 'По почте']"
          custom-class="mb-8 w-fit"
        />
        <template v-if="authStore.method === 'По телефону'">
          <SelectInput
            id="phone"
            ref="selectInputRef"
            v-model="authStore.phone"
            :options="[
              { code: '+7', country: 'Россия' },
              { code: '+375', country: 'Беларусь' },
              { code: '+380', country: 'Украина' },
              { code: '+77', country: 'Казахстан' },
              { code: '+998', country: 'Узбекистан' },
              { code: '+992', country: 'Таджикистан' },
              { code: '+993', country: 'Туркменистан' },
              { code: '+996', country: 'Кыргызстан' },
              { code: '+374', country: 'Армения' },
              { code: '+994', country: 'Азербайджан' },
              { code: '+373', country: 'Молдова' },
              { code: '+7', country: 'Абхазия' },
              { code: '+995', country: 'Грузия' },
            ]"
            type="text"
            label="Номер телефона"
            required
            custom-class="w-full"
          />
          <AppButton
            variant="primary"
            :content="authStore.phoneButtonState.content"
            :disabled="authStore.phoneButtonState.disabled"
            custom-class="w-full mt-4"
            @click="handleClick"
          />
          <span class="font-[Manrope] text-xs font-light text-[#5E5B58] mt-8 cursor-pointer"
            >Нет аккаунта? Регистрация</span
          >
        </template>
        <template v-else>
          <AppInput
            id="email"
            v-model="authStore.email"
            type="email"
            label="Почта"
            required
            custom-class="w-full"
          />
          <AppInput
            id="password"
            v-model="authStore.password"
            type="password"
            label="Пароль"
            required
            custom-class="w-full mt-4"
          />
          <AppButton
            variant="primary"
            :content="authStore.emailButtonState.content"
            :disabled="authStore.emailButtonState.disabled"
            custom-class="w-full mt-4"
            @click="handleClick"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
