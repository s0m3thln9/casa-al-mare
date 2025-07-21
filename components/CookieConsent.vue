<script setup lang="ts">
const emit = defineEmits<{
	(e: 'accept-cookie'): void
}>()

const handleClick = () => {
	emit('accept-cookie')
}

</script>

<template>
	<div class="fixed bottom-0 left-0 z-50 w-full p-2 pt-6 bg-[#FFFFFA] sm:p-0 sm:bg-transparent sm:w-[300px] sm:left-auto sm:right-4 sm:bottom-16">
		<div class="flex p-2.5 rounded-2xl bg-[#FFFFFA] justify-between gap-6 items-center border border-[#BBB8B6] sm:h-[65px]">
	    <span class="text-xs font-[Manrope] text-[#1A1A1A] sm:text-[15px] sm:font-light sm:text-[#211D1D]">Согласие на cookies</span>
	    <AppButton content="принять" variant="secondary" custom-class="px-10 sm:px-3" @click="handleClick" />
    </div>
	</div>
</template>

<style scoped>

</style>