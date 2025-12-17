<script setup lang="ts">
import { useCatalogCard } from "~/composables/useCatalogCard"

const props = defineProps<{
  id: number
  customClass?: string
  customImageClass?: string
  variant: "mini" | "large"
  popup?: boolean
  link?: boolean
  modelValue?: string
}>()

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const {
  currentImageIndex,
  isHovered,
  isVisible,
  isNarrowScreen,
  selectedSize,
  imageStyles,
  barStyles,
  item,
  numImages,
  barIndices,
  priceFormatter,
  handleMouseMove,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleClick,
  handleSizeClick,
  currentColorImages,
  getPriceData,
  isFavoriteLocal,
  isStarPressed,
  starRef,
  handleStarClick,
  handleStarMouseDown,
  handleStarTouchStart,
  availableSizes,
} = useCatalogCard({
  variant: props.variant,
  id: props.id,
  link: props.link || false,
})

const videoSource = computed(() => {
  if (!props.popup && item.value?.video?.length) {
    return item.value.video[0]
  }
  return null
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && newValue !== selectedSize.value) {
      selectedSize.value = newValue
    }
  },
)

watch(selectedSize, (newValue) => {
  emit("update:modelValue", newValue || "")
})

if (props.modelValue) {
  selectedSize.value = props.modelValue
}
</script>

<template>
  <div
    v-if="variant === 'mini'"
    :class="[
      'flex flex-col items-center relative font-[Commissioner] text-[#211D1D] font-light text-[11px] text-center cursor-pointer sm:font-[Manrope] sm:text-xs',
      customClass,
      isNarrowScreen && 'justify-between flex-1',
    ]"
    @mouseenter="!popup && (isHovered = true)"
    @mouseleave="!popup && (isHovered = false)"
    @click="handleClick"
  >
    <div class="w-full rounded-lg relative">
      <div class="overflow-hidden rounded-lg h-full">
        
        <video
          v-if="videoSource"
          autoplay
          loop
          muted
          playsinline
          :poster="videoSource.image"
          :class="[
            'w-full h-full object-cover transition-all duration-300 ease-out rounded-lg aspect-[300/450]',
            customImageClass,
          ]"
        >
          <source v-if="videoSource.webm" :src="videoSource.webm" type="video/webm">
          <source v-if="videoSource.mp4" :src="videoSource.mp4" type="video/mp4">
          <source v-if="videoSource.ogv" :src="videoSource.ogv" type="video/ogg">
        </video>

        <NuxtImg
          v-else-if="item && currentColorImages.length > 0"
          v-slot="{ src, isLoaded, imgAttrs }"
          :src="currentColorImages[0]"
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
            :class="[
              'w-full h-full object-cover transition-all duration-300 ease-out rounded-lg',
              customImageClass,
            ]"
            alt="card"
          >
        </NuxtImg>
        
        <div
          v-else
          class="w-full h-full aspect-[300/450] bg-[#F9F6EC]"
        />
      </div>
    </div>

    <template v-if="!item">
      <div class="w-full h-4 bg-[#F9F6EC] rounded mt-1 sm:mt-2" />
      <div class="w-20 h-4 bg-[#F9F6EC] rounded mt-0.5 sm:mt-1" />
      <div
        v-if="!isHovered || popup"
        class="w-16 h-4 bg-[#F9F6EC] rounded my-1 hidden sm:block"
        :class="{ 'mb-2': popup }"
      />
    </template>

    <template v-else>
      <h4 class="mt-1 sm:mt-2 line-clamp-1 min-h-4">
        {{ item.name }}
      </h4>

      <span
        v-if="getPriceData()"
        class="mt-0.5 block sm:mt-1"
      >
        {{ priceFormatter(getPriceData().price) }}
        <span
          v-if="getPriceData().oldPrice && getPriceData().oldPrice > 0"
          class="text-[#5E5B58] line-through ml-1"
        >
          {{ priceFormatter(getPriceData().oldPrice) }}
        </span>
      </span>
      <span
        v-else
        class="mt-0.5 block sm:mt-1 text-gray-500"
      >
        Цена не указана
      </span>

      <div
        v-if="popup"
        class="flex gap-1 flex-wrap justify-center mt-1"
        @click.stop
      >
        <SingleSelectButton
          v-model="selectedSize"
          :content="availableSizes"
          custom-class="text-xs"
          @update:model-value="(val) => link ? handleSizeClick(val) : null"
        />
      </div>

      <div
        v-else
        :class="['hidden gap-1 2xl:flex']"
        @click.stop
      >
        <SingleSelectButton
          v-model="selectedSize"
          :content="availableSizes"
          custom-class="text-xs mt-1"
          @update:model-value="(val) => link ? handleSizeClick(val) : null"
        />
      </div>
      <div
        class="absolute z-7 w-7 h-7 right-2 top-2 md:w-8 md:h-8 md:right-3 md:top-3 flex items-center justify-center cursor-pointer group"
        @click.stop="handleStarClick"
      >
        <div
          :class="[
            'absolute inset-0 rounded-full',
            'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_70%)]',
            'opacity-0',
            (isNarrowScreen || (!popup && isHovered) || isFavoriteLocal) && 'opacity-100',
          ]"
        />
        <div
          v-if="isNarrowScreen || (!popup && isHovered) || isFavoriteLocal"
          ref="starRef"
          :style="{ backgroundImage: `url(${isFavoriteLocal ? '/star-filled.svg' : '/star.svg'})` }"
          :class="[
            'star-button star-icon relative',
            'w-5 h-5 md:w-6 md:h-6',
            isStarPressed && 'star-pressed',
          ]"
          @mousedown="handleStarMouseDown"
          @touchstart="handleStarTouchStart"
        />
      </div>
    </template>
  </div>

  <div
    v-else
    :class="[
      'relative font-[Commissioner] font-light text-[10px] text-center text-[#211D1D] cursor-pointer sm:font-[Manrope] sm:text-sm',
      customClass,
      !popup && isVisible ? 'animate-card-appear' : '',
    ]"
    @mouseenter="!popup && (isHovered = true)"
    @mouseleave="!popup && (isHovered = false)"
    @click="handleClick(null)"
  >
    <template v-if="!item">
      <div class="aspect-[460/680] bg-[#F9F6EC] rounded-lg w-full" />
      <div class="w-full h-0.5 bg-[#F9F6EC] rounded-lg mt-1" />
      <div class="w-full h-10 bg-[#F9F6EC] rounded-lg mt-1" />
    </template>

    <template v-else>
      
      <template v-if="videoSource">
         <video
           autoplay
           loop
           muted
           playsinline
           :poster="videoSource.image"
           :class="[
              'rounded-2xl w-full aspect-[460/680] object-cover',
              customImageClass
            ]"
         >
            <source v-if="videoSource.webm" :src="videoSource.webm" type="video/webm">
            <source v-if="videoSource.mp4" :src="videoSource.mp4" type="video/mp4">
            <source v-if="videoSource.ogv" :src="videoSource.ogv" type="video/ogg">
         </video>
      </template>

      <template v-else>
        <template v-if="currentColorImages.length === 0">
          <div class="aspect-[460/680] bg-[#F9F6EC] rounded-lg w-full" />
        </template>

        <NuxtImg
          v-else
          v-slot="{ isLoaded }"
          :src="currentColorImages[currentImageIndex]"
          alt="card"
          width="460"
          height="680"
          :custom="true"
        >
          <div
            v-if="!isLoaded"
            class="aspect-[460/680] bg-[#F9F6EC] rounded-lg w-full"
          />

          <template v-else>
            <div
              v-if="numImages > 1"
              class="relative w-full aspect-[460/680] overflow-hidden"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="handleTouchEnd"
              @mousemove="handleMouseMove"
            >
              <NuxtImg
                v-for="(img, index) in currentColorImages.slice(0, numImages)"
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
                  :class="['rounded-2xl absolute top-0 left-0 w-full h-full', customImageClass]"
                  :style="imageStyles(index)"
                  alt="card"
                >
              </NuxtImg>
            </div>

            <NuxtImg
              v-else
              v-slot="{ src, imgAttrs }"
              :src="currentColorImages[0]"
              width="460"
              height="680"
              :custom="true"
            >
              <img
                v-bind="imgAttrs"
                :src="src"
                :class="['rounded-2xl w-full aspect-[460/680] object-cover', customImageClass]"
                alt="card"
                @click="handleClick(null)"
              >
            </NuxtImg>

            <div
              v-if="numImages > 1"
              class="flex justify-center items-center gap-1 px-6 py-2"
            >
              <div
                v-for="index in barIndices"
                :key="index"
                class="flex-1 border-y border-[#A6CEFF]"
                :style="barStyles(index)"
              />
            </div>
          </template>
        </NuxtImg>
      </template>

      <h4 class="mt-1 line-clamp-1 min-h-4">{{ item.name }}</h4>
      <span
        v-if="getPriceData()"
        class="mt-0.5"
        :class="{ 'mb-2': popup }"
      >
        {{ priceFormatter(getPriceData().price) }}
      </span>
      <span
        v-else
        class="mt-0.5 text-gray-500"
      >
        Цена не указана
      </span>

      <div
        class="absolute z-10 w-7 h-7 right-2 top-2 md:w-8 md:h-8 md:right-3 md:top-3 flex items-center justify-center cursor-pointer group"
        @click.stop="handleStarClick"
      >
        <div
          :class="[
            'absolute inset-0 rounded-full transition-opacity duration-300',
            'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_70%)]',
            'opacity-0',
            (isNarrowScreen || (!popup && isHovered) || isFavoriteLocal) && 'opacity-100',
          ]"
        />
      
        <div
          v-if="isNarrowScreen || (!popup && isHovered) || isFavoriteLocal"
          ref="starRef"
          :style="{ backgroundImage: `url(${isFavoriteLocal ? '/star-filled.svg' : '/star.svg'})` }"
          alt="star"
          :class="[
            'star-button cursor-pointer star-icon relative z-20',
            'w-5 h-5 md:w-6 md:h-6',
            isStarPressed && 'star-pressed',
          ]"
          @mousedown="handleStarMouseDown"
          @touchstart="handleStarTouchStart"
        />
      </div>
    </template>
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

.animate-card-appear:not(.popup) {
  animation: card-appear 400ms ease-out forwards;
}

.star-button {
  transform-origin: center;
}

.star-button:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.star-pressed {
  animation: star-press 250ms ease-in-out;
}

@keyframes star-press {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.85);
  }
  100% {
    transform: scale(1);
  }
}

@media (min-width: 475px) {
  .star-button {
    transition: filter 0.2s ease-out;
  }

  .star-button:hover {
    transition:
      transform 0.2s ease-in-out,
      filter 0.2s ease-out;
  }
}

.star-icon {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
