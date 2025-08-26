<script setup lang="ts">
const emit = defineEmits<{
	(e: 'select-city'): void
}>()

const handleClick = (e: MouseEvent) => {
	e.stopPropagation()
	emit('select-city')
}

</script>

<template>
	<div class="fixed bottom-0 left-0 z-50 w-full p-2 pt-6 bg-[#FFFFFA] sm:p-0 sm:bg-transparent sm:w-[300px] sm:left-auto sm:right-1 sm:bottom-5">
		<div class="flex p-2.5 rounded-2xl bg-[#FFFFFA] justify-between gap-6 items-center border border-[#BBB8B6] sm:h-[65px]">
	    <span class="text-xs font-[Manrope] text-[#1A1A1A] sm:text-[15px] sm:font-light sm:text-[#211D1D]">Ваш город</span>
			<div class="flex items-center gap-2">
				<MiniSelect label="Город" :options="['Москва', 'Питер', 'Ростов']" custom-class="min-w-[85px]" />
	      <AppButton content="да" variant="secondary" custom-class="px-10 sm:px-3" @click="handleClick" />
			</div>
    </div>
	</div>
</template>

<style scoped>

</style>