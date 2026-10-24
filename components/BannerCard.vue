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

// С link карточка — настоящая ссылка <a href>, чтобы переходы видели поисковики
const NuxtLinkComponent = resolveComponent("NuxtLink")
const rootTag = computed(() => (props.link ? NuxtLinkComponent : "div"))
const rootAttrs = computed(() => (props.link ? { to: props.link } : {}))
</script>

<template>
  <component
    :is="rootTag"
    v-bind="rootAttrs"
    :class="['block relative w-full overflow-hidden cursor-pointer bg-[#F9F6EC]', maxHeight || '', customClass]"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      class="w-full h-full object-cover"
      :style="{ objectPosition: objectPosition || 'center' }"
      :alt="text || 'banner'"
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
  </component>
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
