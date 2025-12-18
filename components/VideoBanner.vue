<script setup lang="ts">
interface VideoSource {
  mp4: string
  ogv: string
  webm: string
}

interface VideoData {
  pc: VideoSource
  mob: VideoSource
}

const props = defineProps<{
  videoData: VideoData
  text?: string
  customClass?: string
  link?: string
  plus?: boolean
}>()

const viewport = useViewport()

const isMobile = computed(() => viewport.isLessThan("sm"))

const currentVideo = computed(() => (isMobile.value ? props.videoData.mob : props.videoData.pc))

const handleClick = () => {
  if (props.link) {
    navigateTo(props.link)
  }
}
</script>

<template>
  <div
    :class="['relative w-full overflow-hidden cursor-pointer', customClass]"
    @click="handleClick"
  >
    <video
      autoplay
      muted
      playsinline
      loop
      class="w-full h-full object-cover"
    >
      <source
        :src="currentVideo.mp4"
        type="video/mp4"
      >
      <source
        :src="currentVideo.ogv"
        type="video/ogv"
      >
      <source
        :src="currentVideo.webm"
        type="video/webm"
      >
    </video>

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

video { display: block !important; }
</style>
