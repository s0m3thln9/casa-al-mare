<script setup lang="ts">
const props = defineProps<{
	messages: string[]
}>()

const repeatCount = computed(() => {
	const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
	const estimatedMessageWidth = 300;
	const messagesLength = props.messages.length;
	return Math.ceil(screenWidth / (estimatedMessageWidth * messagesLength)) + 1;
});

</script>

<template>
	<div class="fixed bottom-0 left-0 w-full bg-[#211D1DB2] border-b-[0.3px] backdrop-blur-2xl border-[#181818] py-3 z-10 overflow-hidden">
		<div class="flex gap-2 whitespace-nowrap line">
			<template v-for="(_n, cycle) in repeatCount" :key="`cycle-${cycle}`">
				<template v-for="(message, index) in messages" :key="`${cycle}-${index}`">
	        <span class="font-[Commissioner] font-light text-[10px] text-[#FFFFFA] uppercase sm:font-[Manrope] sm:text-sm sm:normal-case">{{ message }}</span>
	        <span class="font-[Manrope] font-light text-sm text-[#FFFFFA]">*</span>
	      </template>
			</template>
		</div>
	</div>
</template>

<style scoped>
.line {
	animation: marquee 30s linear infinite;
}

.line:hover {
	animation-play-state: paused;
}

@keyframes marquee {
	0% {
		transform: translateX(0%);
	}
	100% {
		transform: translateX(-100%);
	}
}

@media screen and (max-width: 640px) {
	.line {
		animation: marquee 15s linear infinite;
	}
}
</style>