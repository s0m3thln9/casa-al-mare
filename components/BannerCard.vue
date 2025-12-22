<script setup lang="ts">
import { ref, onMounted } from "vue"
import { navigateTo } from "#app"

const props = defineProps<{
  imageUrl: string
  text?: string
  plus?: boolean
  maxHeight?: string
  customClass?: string
  objectPosition?: string
  link?: string
}>()

const isLoaded = ref(false)
const imageSrc = ref("")

const handleClick = () => {
  if (props.link) {
    navigateTo(props.link)
  }
}

onMounted(() => {
  imageSrc.value = props.imageUrl
  const img = new Image()
  img.src = props.imageUrl
  img.onload = () => {
    isLoaded.value = true
  }
  img.onerror = () => {
    isLoaded.value = true
  }
})
</script>

<template>
  <div
    :class="['relative w-full overflow-hidden cursor-pointer', maxHeight || '', customClass]"
    @click="handleClick"
  >
    <div
      v-if="!isLoaded"
      :class="['bg-[#F9F6EC] w-full h-full', customClass]"
    />
    <img
      v-else
      :src="imageSrc"
      class="w-full h-full object-cover"
      :style="{ objectPosition: objectPosition || 'center' }"
      alt="banner"
      fetchpriority="high"
    >
    <div
      v-if="text"
      class="absolute bottom-2 right-2 px-2 py-1 bg-[#FFFFFA99] backdrop-blur-sm rounded-2xl font-[Commissioner] font-light text-[#211D1D] uppercase text-[10px] sm:backdrop-blur-none sm:text-[13px]/5 sm:font-[Manrope] sm:font-normal sm:px-2.5 sm:py-2 sm:bottom-2.5 sm:right-2.5 sm:bg-[#FFFFFA]"
    >
      {{ text }}
    </div>
    <div
      v-if="plus"
      class="absolute bottom-2 right-2 p-1 bg-[#FFFFFA99] rounded-sm font-[Commissioner] font-light text-[#211D1D] uppercase text-[10px] sm:rounded-lg sm:text-base/5 sm:font-[Manrope] sm:font-normal sm:bottom-4 sm:right-4"
    >
      <div class="w-3 h-3">
        <div class="grid-icon" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-icon {
  background-image: url("/grid.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
}
</style>
