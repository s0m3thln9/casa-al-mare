<script setup lang="ts">
const props = defineProps<{
  id: string
  customClass?: string
  customImageClass?: string
  variant: "mini" | "large"
  link?: string
  popup?: boolean
  modelValue?: string | null
  name: string
  color: string
  sliderImages: string[]
  price: number
  oldPrice: number
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void
}>()

const sizes = ["XSS", "XS", "S", "M", "L", "XL"]

const {
  currentImageIndex,
  isHovered,
  isVisible,
  isWideScreen,
  favouritesStore,
  imageStyles,
  barStyles,
  priceFormatter,
  handleMouseMove,
  handleTouchStart,
  handleTouchEnd,
  handleClick,
} = useProductCard(props)
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
    <div
      class="w-full overflow-hidden rounded-lg"
      style="height: 450px"
    >
      <NuxtImg
        v-slot="{ src, isLoaded, imgAttrs }"
        :src="sliderImages[0]"
        alt="card"
        width="300"
        :custom="true"
        class="transition-all duration-300 ease-out"
        :style="{ height: isHovered && isWideScreen ? '470px' : '450px' }"
      >
        <div
          v-if="!isLoaded"
          class="w-full h-full bg-[#F9F6EC]"
        />
        <img
          v-else
          v-bind="imgAttrs"
          :src="src"
          :class="['w-full object-cover', customImageClass]"
          @click="handleClick"
        />
      </NuxtImg>
    </div>
    <h4 class="mt-1 sm:mt-2">{{ name }}</h4>
    <span class="mt-0.5 block sm:mt-1">
      {{ priceFormatter(price!) }}
      <span class="text-[#5E5B58] line-through">{{ priceFormatter(oldPrice!) }}</span>
    </span>
    <span
      v-if="!isHovered"
      class="my-1 hidden sm:block"
      >{{ color }}</span
    >
    <div :class="['hidden gap-1 2xl:flex', popup && 'flex-wrap justify-center']">
      <SingleSelectButton
        :content="sizes"
        custom-class="text-xs"
        :model-value="modelValue ?? null"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
    <NuxtImg
      v-if="!isWideScreen || isHovered"
      :src="favouritesStore.isFavourite(id) ? '/star-filled.svg' : '/star.svg'"
      alt="star"
      class="w-4 h-4 absolute z-10 right-2.5 top-2.5 sm:w-5 sm:h-5 sm:right-4 sm:top-4"
      @click="favouritesStore.toggle(id)"
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
      :src="sliderImages[currentImageIndex]"
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
          v-for="(img, index) in sliderImages"
          :key="index"
          v-slot="{ src, imgAttrs }"
          :src="img"
          alt="card"
          width="460"
          height="680"
          :custom="true"
        >
          <img
            v-bind="imgAttrs"
            :src="src"
            :class="['rounded-lg sm:rounded-2xl absolute top-0 left-0 w-full h-full', customImageClass]"
            :style="imageStyles(index)"
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
          v-for="(_, index) in sliderImages"
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
        <h4 class="mt-1">{{ name }}</h4>
        <span class="mt-0.5">{{ priceFormatter(price!) }}</span>
      </template>
    </NuxtImg>
    <NuxtImg
      v-if="!isWideScreen || isHovered"
      :src="favouritesStore.isFavourite(id) ? '/star-filled.svg' : '/star.svg'"
      alt="star"
      class="w-4 h-4 absolute z-10 right-2.5 top-2.5 sm:w-5 sm:h-5 sm:right-4 sm:top-4"
      @click="favouritesStore.toggle(id)"
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
