<script setup lang="ts">
const emit = defineEmits<{
	(e: 'close-popup'): void
}>()

onMounted(() => {
	window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
	window.removeEventListener('keydown', handleKeydown)
})

const handleKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Escape') {
		emit('close-popup')
	}
}

</script>

<template>
  <div class="fixed inset-0 z-40 bg-black/50" @click.self="emit('close-popup')">
    <div class="fixed w-full h-[100svh] overflow-y-auto bg-[#FFFFFA] z-30 top-0 right-0 py-8 px-4 sm:w-auto sm:p-8">
      <div class="flex gap-4">
        <button class="cursor-pointer" @click="emit('close-popup')">
          <NuxtImg src="/arrow-left.svg" alt="arrow" class="w-2" />
        </button>
        <span class="font-[Inter] text-[17px] uppercase sm:normal-case sm:text-2xl">Подпишитесь на рассылку</span>
      </div>
      <div class="flex flex-col items-center gap-6 mt-8 sm:mt-14 sm:items-start">
        <NuxtImg src="/pop-up-sub.jpg" alt="sub" width="390" height="532" class="rounded-lg" />
        <input
	        type="email" placeholder="Введите e-mail для получения новостей"
	        class="min-w-full h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
        >
        <AppButton content="Подписаться" variant="primary" custom-class="w-full px-0"/>
        <p
	        class="w-full font-light text-[10px] text-[#5E5B58] font-[Commissioner] sm:w-[350px]"
        >
          Нажимая на кнопку «Подписаться», я соглашаюсь на обработку моих персональных данных и ознакомлен(а) с условиями конфиденциальности.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>