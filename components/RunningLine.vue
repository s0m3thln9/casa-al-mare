<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	messages: string[];
}>();

const repeatCount = computed(() => {
	const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
	const estimatedMessageWidth = 300;
	const totalMessagesWidth = estimatedMessageWidth * props.messages.length;
	return Math.ceil(screenWidth / totalMessagesWidth) * 2;
});
</script>

<template>
  <div
	  class="fixed bottom-0 left-0 w-full bg-[#211D1DB2] border-b-[0.3px] backdrop-blur-2xl border-[#181818] py-3 z-10 overflow-hidden"
  >
    <div class="line flex gap-2 whitespace-nowrap">
      <template v-for="(_n, cycle) in repeatCount" :key="`cycle-${cycle}`">
        <template v-for="(message, index) in props.messages" :key="`${cycle}-${index}`">
          <span
	          class="font-[Commissioner] font-light text-[10px] text-[#FFFFFA] uppercase sm:font-[Manrope] sm:text-sm sm:normal-case"
          >
            {{ message }}
          </span>
          <span class="font-[Commissioner] font-light text-[10px] text-[#FFFFFA] uppercase sm:font-[Manrope] sm:text-sm sm:normal-case">*</span>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.line {
	display: inline-flex;
	animation: marquee 20s linear infinite;
	will-change: transform;
}

.line:hover {
	animation-play-state: paused;
}

@keyframes marquee {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(-50%);
	}
}

@media screen and (max-width: 640px) {
	.line {
		animation-duration: 12s;
	}
}
</style>