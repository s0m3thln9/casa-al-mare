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
      maxHeight || 'max-h-[500px]',
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
	    class="absolute bottom-6 right-6 px-4 py-2 bg-[#FFFFFA] rounded-2xl font-[Manrope] text-[#211D1D] uppercase text-base/5"
    >
      {{ text }}
    </div>
  </div>
</template>