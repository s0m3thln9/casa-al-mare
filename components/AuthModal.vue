<script setup lang="ts">
const phone = ref('')

const authStore = useAuthStore()
const authModalStore = useAuthModalStore()

const handleClick = () => {
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
			  <AppInput id="phone" type="text" label="Введите номер телефона" :model-value="phone"/>
			  <AppButton variant="primary" content="Войти" custom-class="w-full mt-4" @click="handleClick" />
		  </div>
	  </div>
  </div>
</template>

<style scoped>

</style>