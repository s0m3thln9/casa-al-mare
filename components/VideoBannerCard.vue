<script setup lang="ts">
defineProps<{
	imageUrl: string
	text?: string
}>()
</script>

<template>
  <div
	  class="w-full h-[900px] bg-cover bg-[50%_75%] relative"
	  :style="{ backgroundImage: `url(${imageUrl})` }"
  >
	  <div
		  v-if="text"
		  class="absolute bottom-6 right-6 px-4 py-2 bg-[#FFFFFA] rounded-2xl font-[Manrope] text-[#211D1D] uppercase text-base/5"
	  >
      {{ text }}
    </div>
  </div>
</template>
