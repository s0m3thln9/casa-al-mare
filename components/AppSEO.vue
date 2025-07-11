<script setup lang="ts">
defineProps<{
	content: string
}>()
</script>

<template>
	<div class="px-4 py-3 flex justify-center items-center sm:py-0">
		<div
			class="flex flex-col items-center gap-6 pt-10 pb-6 px-6 border border-[#BBB8B6] rounded-2xl w-full sm:pt-12"
		>
			<NuxtImg src="/logo-2.svg" alt="CASA AL MARE" width="230" height="31" />
			<p
				class="font-[Manrope] text-[11px] text-[#8F8F8F] font-light text-center w-full sm:text-xs md:w-[660px]"
			>
				{{ content }}
			</p>
			<button class="font-[Manrope] text-xs text-[#211D1D] font-light">
				Подробнее
			</button>
		</div>
	</div>
</template>

<style scoped>

</style>