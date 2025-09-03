<script setup lang="ts">
const props = defineProps<{
  imageUrl: string
  text?: string
  plus?: boolean
  maxHeight?: string
  customClass?: string
  objectPosition?: string
  link?: string
}>()

const areImagesLoaded = ref(false)

const handleClick = () => {
  if (props.link) {
    navigateTo(props.link)
  }
}
</script>

<template>
  <div
    :class="['relative w-full overflow-hidden cursor-pointer', maxHeight || '', customClass]"
    @click="handleClick"
  >
    <NuxtImg
      v-slot="{ src, isLoaded, imgAttrs }"
      :src="imageUrl"
      alt="banner"
      :custom="true"
      sizes="sm:100vw md:50vw lg:25vw"
    >
      <div
        v-if="!isLoaded"
        :class="['bg-[#F9F6EC] w-full h-full', customClass]"
      />
      <img
        v-else
        v-bind="imgAttrs"
        :src="src"
        class="w-full h-full object-cover"
        :style="{ objectPosition: objectPosition || 'center' }"
        loading="lazy"
      />
    </NuxtImg>
    <div
      v-if="text"
      class="absolute bottom-2 right-2 px-2 py-1 bg-[#FFFFFA99] backdrop-blur-sm rounded-2xl font-[Commissioner] font-light text-[#211D1D] uppercase text-[10px] sm:backdrop-blur-none sm:text-base/5 sm:font-[Manrope] sm:font-normal sm:px-4 sm:py-2 sm:bottom-4 sm:right-4 sm:bg-[#FFFFFA]"
    >
      {{ text }}
    </div>
    <div
      v-if="plus"
      class="absolute bottom-2 right-2 p-1 bg-[#FFFFFA99] rounded-sm font-[Commissioner] font-light text-[#211D1D] uppercase text-[10px] sm:rounded-lg sm:text-base/5 sm:font-[Manrope] sm:font-normal sm:bottom-4 sm:right-4"
    >
      <NuxtImg
        src="/grid.svg"
        alt="grid"
        class="w-3"
      />
    </div>
  </div>
</template>
