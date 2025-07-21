<script setup lang="ts">

</script>

<template>
  <div class="absolute h-[100svh] top-0 right-0 p-8">
	  <div class="flex">
		  <NuxtImg src="/arrow-left.svg" alt="arrow" />
		  <span>Подпишитевь на рассыылку</span>
	  </div>
	  <div class="flex flex-col gap-6">
		  <NuxtImg src="/pop-up-sub.jpg" alt="sub" width="390" height="532" />
		  <div class="flex flex-col items-start gap-4 xl:flex-row">
			  <input
				  type="email" placeholder="Введите e-mail для получения новостей"
				  class="min-w-[245px] h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
			  >
			  <AppButton content="Подписаться" variant="primary" custom-class="w-full px-0 max-xl:w-[245px]"/>
		  </div>
		  <p
			  class="max-w-[300px] text-[10px] font-[Commissioner] xl:max-w-[416px]"
		  >
			  Нажимая на кнопку «Подписаться», я соглашаюсь на обработку моих персональных данных и ознакомлен(а) с условиями конфиденциальности.
		  </p>
	  </div>
  </div>
</template>

<style scoped>

</style>