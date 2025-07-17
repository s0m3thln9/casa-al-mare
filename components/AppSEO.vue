<script setup lang="ts">
defineProps<{
	paragraphs: string[]
	customClass?: string
}>()

const isExpanded = ref(false)

</script>

<template>
	<div
		:class="['px-4 py-3 flex justify-center items-center sm:py-0', customClass]"
	>
		<div
			class="flex flex-col items-center gap-6 pt-10 pb-6 px-6 border border-[#BBB8B6] rounded-2xl w-full sm:pt-12"
		>
			<NuxtImg src="/logo-2.svg" alt="CASA AL MARE" width="230" height="31" />
			<p
				class="font-[Manrope] text-[11px] text-[#8F8F8F] font-light text-center w-full whitespace-pre-line sm:text-xs md:max-w-[800px]"
			>
				{{ isExpanded ? paragraphs.join("\n\n") : paragraphs[0] }}
			</p>
			<ExpandButton
				:is-expanded="isExpanded"
				@toggle-expand="isExpanded = !isExpanded"
			/>
		</div>
	</div>
</template>

<style scoped>

</style>