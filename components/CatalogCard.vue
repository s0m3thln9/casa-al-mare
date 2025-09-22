<script setup lang="ts">
const props = defineProps<{
  id: string
  customClass?: string
  customImageClass?: string
  variant: "mini" | "large"
  popup?: boolean
  link?: boolean
}>()

const {
  currentImageIndex,
  isHovered,
  isVisible,
  isWideScreen,
  selectedSize,
  favoritesStore,
  imageStyles,
  barStyles,
  item,
  priceFormatter,
  handleMouseMove,
  handleTouchStart,
  handleTouchEnd,
  handleClick,
} = useCatalogCard(props.variant, props.id, props.link)
</script>

<template>
  <div
    v-if="variant === 'mini'"
    :class="[
      'flex flex-col items-center relative font-[Commissioner] text-[#211D1D] font-light text-[11px] text-center cursor-pointer sm:font-[Manrope] sm:text-xs',
      customClass,
      isWideScreen && 'justify-between flex-1',
    ]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="w-full overflow-hidden rounded-lg">
      <NuxtImg
        v-slot="{ src, isLoaded, imgAttrs }"
        :src="Object.values(item!.images)[0]"
        :custom="true"
        class="aspect-[300/450] transition-all duration-300 ease-out"
      >
        <div
          v-if="!isLoaded"
          class="w-full h-full aspect-[300/450] bg-[#F9F6EC]"
        />
        <img
          v-else
          v-bind="imgAttrs"
          :src="src"
          :class="['w-full object-cover', customImageClass]"
          alt="card"
          @click="handleClick"
        />
      </NuxtImg>
    </div>
    <h4 class="mt-1 sm:mt-2">{{ item!.name }}</h4>
    <span class="mt-0.5 block sm:mt-1">
      {{ priceFormatter(item!.vector[`${Object.keys(item!.colors)[0]}_${selectedSize ?? item!.sizes[0]}`].price) }}
      <span class="text-[#5E5B58] line-through">{{
        priceFormatter(item!.vector[`${Object.keys(item!.colors)[0]}_${selectedSize ?? item!.sizes[0]}`].oldPrice)
      }}</span>
    </span>
    <span
      v-if="!isHovered"
      class="my-1 hidden sm:block"
    >
      {{ Object.values(item!.colors)[0].name }}
    </span>
    <div :class="['hidden gap-1 2xl:flex', popup && 'flex-wrap justify-center']">
      <SingleSelectButton
        v-model="selectedSize"
        :content="item!.sizes"
        custom-class="text-xs"
      />
    </div>
    <NuxtImg
      v-if="!isWideScreen || isHovered"
      :src="favoritesStore.isFavorite(id) ? '/star-filled.svg' : '/star.svg'"
      alt="star"
      class="w-4 h-4 absolute z-10 right-2.5 top-2.5 sm:w-5 sm:h-5 sm:right-4 sm:top-4"
      @click="favoritesStore.toggleFavorite(id)"
    />
  </div>

  <div
    v-else
    :class="[
      'relative font-[Commissioner] font-light text-[10px] text-center text-[#211D1D] cursor-pointer sm:font-[Manrope] sm:text-sm',
      customClass,
      isVisible ? 'animate-card-appear' : '',
    ]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <NuxtImg
      v-slot="{ isLoaded }"
      :src="Object.values(item!.images)[currentImageIndex]"
      alt="card"
      width="460"
      height="680"
      :custom="true"
    >
      <div
        v-if="!isLoaded"
        class="aspect-[460/680] bg-[#F9F6EC] rounded-lg w-full"
      />
      <div
        v-else
        class="relative w-full aspect-[460/680] overflow-hidden"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
        @mousemove="handleMouseMove"
      >
        <NuxtImg
          v-for="(img, index) in Object.values(item!.images).slice(0, 3)"
          :key="index"
          v-slot="{ src, imgAttrs }"
          :src="img"
          width="460"
          height="680"
          :custom="true"
        >
          <img
            v-bind="imgAttrs"
            :src="src"
            :class="['rounded-lg sm:rounded-2xl absolute top-0 left-0 w-full h-full', customImageClass]"
            :style="imageStyles(index)"
            alt="card"
            @click="handleClick"
          />
        </NuxtImg>
      </div>
      <div
        v-if="!isLoaded"
        class="w-full h-0.5 bg-[#F9F6EC] rounded-lg mt-1"
      />
      <div
        v-else
        class="flex justify-center items-center gap-1 px-6 py-2"
      >
        <div
          v-for="(_, index) in Object.values(item!.images).slice(0, 3)"
          :key="index"
          class="flex-1 border-y border-[#A6CEFF]"
          :style="barStyles(index)"
        />
      </div>
      <div
        v-if="!isLoaded"
        class="w-full h-10 bg-[#F9F6EC] rounded-lg mt-1"
      />
      <template v-else>
        <h4 class="mt-1">{{ item!.name }}</h4>
        <span class="mt-0.5">{{
          priceFormatter(item!.vector[`${Object.keys(item!.colors)[0]}_${selectedSize ?? item!.sizes[0]}`].price)
        }}</span>
      </template>
    </NuxtImg>
    <NuxtImg
      v-if="!isWideScreen || isHovered"
      :src="favoritesStore.isFavorite(id) ? '/star-filled.svg' : '/star.svg'"
      alt="star"
      class="w-4 h-4 absolute z-10 right-2.5 top-2.5 sm:w-5 sm:h-5 sm:right-4 sm:top-4"
      @click="favoritesStore.toggleFavorite(id)"
    />
  </div>
</template>

<style scoped>
@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-card-appear {
  animation: card-appear 400ms ease-out forwards;
}
</style>
