<script setup lang="ts">
defineProps<{
	isPopupOpen: boolean
	title: string
}>()

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
  <div
	  class="fixed inset-0 z-40 bg-black/50 text-[#211D1D] transition-all duration-300 ease-in-out" :class="{
      'opacity-100': isPopupOpen,
      'opacity-0 pointer-events-none': !isPopupOpen
		}"
	  @click.self="emit('close-popup')"
   >
    <div
	    class="fixed w-full h-[100svh] overflow-y-auto bg-[#FFFFFA] z-30 top-0 right-0 py-8 px-4 transition-all duration-300 ease-in-out sm:w-[454px] sm:p-8"
	    :class="{
        'opacity-100 translate-x-0': isPopupOpen,
        'opacity-0 translate-x-[100%]': !isPopupOpen
      }"
    >
      <div class="flex gap-4">
        <button class="cursor-pointer" @click="emit('close-popup')">
          <NuxtImg src="/arrow-left.svg" alt="arrow" class="w-2" />
        </button>
        <span class="font-[Inter] text-[17px] uppercase sm:normal-case sm:text-2xl">{{ title }}</span>
      </div>
	    <slot/>
    </div>
  </div>
</template>

<style scoped>

</style>