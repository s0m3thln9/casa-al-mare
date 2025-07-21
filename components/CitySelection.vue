<script setup lang="ts">
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
const emit = defineEmits<{
	(e: 'select-city'): void
}>()

const selectedCity = ref("Москва")

const options = ["Москва", "Питер"]

const handleClick = (e: MouseEvent) => {
	e.stopPropagation()
	emit('select-city')
}

</script>

<template>
	<div class="fixed bottom-0 left-0 z-50 w-full p-2 pt-6 bg-[#FFFFFA] sm:p-0 sm:bg-transparent sm:w-[300px] sm:left-auto sm:right-4 sm:bottom-16">
		<div class="flex p-2.5 rounded-2xl bg-[#FFFFFA] justify-between gap-6 items-center border border-[#BBB8B6] sm:h-[65px]">
	    <span class="text-xs font-[Manrope] text-[#1A1A1A] sm:text-[15px] sm:font-light sm:text-[#211D1D]">Ваш город</span>
			<div class="flex items-center gap-2">
				<v-select v-model="selectedCity" :options="options" :clearable="false"/>
	      <AppButton content="да" variant="secondary" custom-class="px-10 sm:px-3" @click="handleClick" />
			</div>
    </div>
	</div>
</template>

<style scoped>
:deep(.vs__dropdown-toggle) {
	padding: 8px;
	border: 0.7px solid #BFBFBF;
	border-radius: 8px;
	width: 120px;
	font-size: 14px;
	font-family: Manrope, sans-serif;
	display: flex;
	align-items: center;
	justify-content: center;
}
:deep(.vs__search) {
	display: none !important;
}

:deep(.vs__selected) {
	margin-top: 0;
}

:deep(.vs__actions) {
	padding: 0;
	justify-self: end;
}

:deep(.vs--single.vs--open .vs__selected) {
	position: unset !important;
}
</style>