<script setup lang="ts">
defineProps<{
	imageUrl: string
	text?: string
	maxHeight?: string
	customClass?: string
	objectPosition?: string
}>()
</script>

<template>
  <div
	  :class="[
      'relative w-full overflow-hidden',
      maxHeight || '',
      customClass
    ]"
  >
    <NuxtImg
	    :src="imageUrl"
	    alt="banner"
	    class="w-full h-full object-cover"
	    :style="{ objectPosition: objectPosition || 'center' }"
	    loading="lazy"
	    sizes="sm:100vw md:50vw lg:25vw"
    />
    <div
	    v-if="text"
	    class="absolute bottom-2 right-2 px-2 py-1 bg-[#FFFFFA99] rounded-2xl font-[Manrope] text-[#211D1D] uppercase text-[10px] sm:text-base/5 sm:px-4 sm:py-2 sm:bottom-6 sm:right-6 sm:bg-[#FFFFFA]"
    >
      {{ text }}
    </div>
  </div>
</template>