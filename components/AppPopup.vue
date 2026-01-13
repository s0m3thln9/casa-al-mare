<script setup lang="ts">
defineProps<{
  title: string
  popupId: string
}>()

const popupStore = usePopupStore()

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    popupStore.close()
  }
}

let startX = 0
let currentX = 0
const SWIPE_CLOSE_THRESHOLD = 80

const onTouchStart = (e: TouchEvent) => {
  startX = e.touches[0].clientX
}

const onTouchMove = (e: TouchEvent) => {
  currentX = e.touches[0].clientX
}

const onTouchEnd = () => {
  const diff = currentX - startX
  
  if (diff > SWIPE_CLOSE_THRESHOLD) {
    popupStore.close()
  }
  
  startX = 0
  currentX = 0
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown)
})
</script>


<template>
  <div
    class="fixed inset-0 z-40 bg-black/50 text-[#211D1D] transition-all duration-300 ease-in-out"
    :class="{
      'opacity-100': popupStore.isOpen(popupId),
      'opacity-0 pointer-events-none': !popupStore.isOpen(popupId),
    }"
    @click.self="popupStore.close"
  >
    <div
      class="fixed w-full h-[100dvh] overflow-y-auto bg-[#FFFFFA] z-30 top-0 right-0 py-8 px-4 transition-all duration-300 ease-in-out sm:w-[454px] sm:p-8"
      :class="{
        'opacity-100 translate-x-0': popupStore.isOpen(popupId),
        'opacity-0 translate-x-[100%]': !popupStore.isOpen(popupId),
      }"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div
        class="flex gap-4 items-center cursor-pointer"
        @click="popupStore.close"
      >
        <button
          class="cursor-pointer"
          aria-label="Закрыть"
        />
        <span class="font-[Inter] text-[17px] uppercase sm:normal-case sm:text-2xl">
          {{ title }}
        </span>
      </div>
  
      <slot />
    </div>
  </div>
</template>

<style scoped>
button {
  background-image: url("/arrow-left.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 1rem;
  height: 1rem;
  border: none;
}
</style>
