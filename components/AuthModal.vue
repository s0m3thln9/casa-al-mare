<script setup lang="ts">
import {SelectInput} from "#components"

const phone = ref('')

const authStore = useAuthStore()
const authModalStore = useAuthModalStore()

const selectInputRef = ref<InstanceType<typeof SelectInput>>()

const handleClick = () => {
	if (!selectInputRef.value?.validateInput()) return
	authStore.login()
	authModalStore.close()
}

</script>

<template>
  <div class="absolute inset-0 z-10 flex justify-center items-center">
	  <div class="w-[300px] bg-[#FFFFFA] border-[0.7px] border-[#211D1D] rounded-2xl">
		  <div class="flex justify-end items-center">
			  <button
				  class="p-4 cursor-pointer"
				  @click="authModalStore.close"
			  >
				  <NuxtImg src="/x.svg" width="24" />
			  </button>
		  </div>
		  <div class="px-6 pb-6">
			  <h2 class="mb-8 font-[Inter] text-2xl text-[#211D1D] text-center">Авторизуйтесь, чтобы сохранить избранное</h2>
			  <SelectInput ref="selectInputRef" id="phone" v-model="phone" :options="[  { code: '+7', country: 'Россия' }, { code: '+375', country: 'Беларусь' }, { code: '+380', country: 'Украина' }, { code: '+77', country: 'Казахстан' }, { code: '+998', country: 'Узбекистан' }, { code: '+992', country: 'Таджикистан' }, { code: '+993', country: 'Туркменистан' }, { code: '+996', country: 'Кыргызстан' }, { code: '+374', country: 'Армения' }, { code: '+994', country: 'Азербайджан' }, { code: '+373', country: 'Молдова' }, { code: '+7', country: 'Абхазия' }, { code: '+995', country: 'Грузия' }]" type="text" label="Номер телефона" required />
			  <AppButton variant="primary" content="Войти" custom-class="w-full mt-4" @click="handleClick" />
		  </div>
	  </div>
  </div>
</template>

<style scoped>

</style>