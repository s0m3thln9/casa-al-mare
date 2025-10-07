<script setup lang="ts">
import type { NuxtImg } from "#components"

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
  numImages,
  barIndices,
} = useCatalogCard(props.variant, props.id, props.link)

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && newValue !== selectedSize.value) {
      selectedSize.value = newValue
    }
  },
)

watch(selectedSize, (newValue) => {
  emit("update:modelValue", newValue)
})

if (props.modelValue) {
  selectedSize.value = props.modelValue
}

const starRef = ref<InstanceType<typeof NuxtImg> | null>(null)
const isStarPressed = ref(false)
const isFavoriteLocal = ref(favoritesStore.isFavorite(props.id))

const getPriceData = () => {
  const firstColor = Object.keys(item?.colors || {})[0] || ""
  const sizeKey = selectedSize.value || item?.sizes?.[0] || ""
  const key = `${firstColor}_${sizeKey}`
  return item?.vector?.[key]
}

const handleStarClick = async (e: MouseEvent | TouchEvent) => {
  e.stopPropagation()
  if (isStarPressed.value) {
    e.preventDefault()
    return
  }

  isStarPressed.value = true

  const starEl = starRef.value?.$el as HTMLElement | null
  if (starEl) {
    starEl.style.pointerEvents = "none"
  }

  isFavoriteLocal.value = !isFavoriteLocal.value

  try {
    await favoritesStore.toggleFavorite(props.id)
  } catch (error) {
    isFavoriteLocal.value = !isFavoriteLocal.value
    console.error("Не удалось обновить избранное:", error)
  }

  setTimeout(() => {
    if (starEl) {
      starEl.style.pointerEvents = "auto"
    }
    isStarPressed.value = false
  }, 250)
}

const handleStarMouseDown = (e: MouseEvent) => {
  e.stopPropagation()
  if (isStarPressed.value) {
    e.preventDefault()
  }
}

const handleStarTouchStart = (e: TouchEvent) => {
  e.stopPropagation()
  if (isStarPressed.value) {
    e.preventDefault()
  }
}

watch(
  () => favoritesStore.isFavorite(props.id),
  (newValue) => {
    isFavoriteLocal.value = newValue
  },
)
</script>

<template>
  <div
    v-if="variant === 'mini'"
    :class="[
      'flex flex-col items-center relative font-[Commissioner] text-[#211D1D] font-light text-[11px] text-center cursor-pointer sm:font-[Manrope] sm:text-xs',
      customClass,
      isWideScreen && 'justify-between flex-1',
    ]"
    @mouseenter="!popup && (isHovered = true)"
    @mouseleave="!popup && (isHovered = false)"
    @click="handleClick"
  >
    <div
      class="w-full rounded-lg relative"
      :style="{ height: !popup && isHovered ? 'calc(100% + 20px)' : '100%' }"
    >
      <div class="overflow-hidden rounded-lg h-full">
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
            :class="[
              'w-full h-full object-cover transition-all duration-300 ease-out rounded-lg',
              customImageClass,
              popup && 'hover:scale-[1.05]',
            ]"
            :style="{
              height: !popup && isHovered ? 'calc(100% + 20px)' : '100%',
              objectPosition: !popup && isHovered ? 'center top' : 'center center',
            }"
            alt="card"
          />
        </NuxtImg>
      </div>
    </div>
    <h4 class="mt-1 sm:mt-2">{{ item!.name }}</h4>
    <span
      v-if="getPriceData()"
      class="mt-0.5 block sm:mt-1"
      :class="{ 'mb-2': isHovered }"
    >
      {{ priceFormatter(getPriceData().price) }}
      <span
        v-if="getPriceData().oldPrice"
        class="text-[#5E5B58] line-through ml-1"
      >
        {{ priceFormatter(getPriceData().oldPrice) }}
      </span>
    </span>
    <span
      v-else
      class="mt-0.5 block sm:mt-1 text-gray-500"
      >Цена не указана</span
    >
    <span
      v-if="!isHovered || popup"
      class="my-1 hidden sm:block"
      :class="{ 'mb-2': popup }"
    >
      {{ Object.values(item!.colors)[0].name }}
    </span>
    <div :class="['hidden gap-1 2xl:flex', popup && 'flex-wrap justify-center']">
      <SingleSelectButton
        v-model="selectedSize"
        :content="item!.sizes"
        custom-class="text-xs mt-1"
      />
    </div>
    <NuxtImg
      v-if="!isWideScreen || (!popup && isHovered) || isFavoriteLocal"
      ref="starRef"
      :src="isFavoriteLocal ? '/star-filled.svg' : '/star.svg'"
      alt="star"
      :class="[
        'star-button absolute z-10 cursor-pointer',
        'w-5 h-5 right-2.5 top-2.5 md:w-6 md:h-6 md:right-4 md:top-4',
        isStarPressed && 'star-pressed',
      ]"
      @mousedown="handleStarMouseDown"
      @touchstart="handleStarTouchStart"
      @click.stop="handleStarClick"
    />
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
        v-else-if="numImages > 1"
        class="relative w-full aspect-[460/680] overflow-hidden"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
        @mousemove="handleMouseMove"
        @click="handleClick"
      >
        <NuxtImg
          v-for="(img, index) in Object.values(item!.images).slice(0, numImages)"
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
          />
        </NuxtImg>
      </div>
      <NuxtImg
        v-else-if="Object.values(item!.images).length === 1"
        v-slot="{ src, imgAttrs }"
        :src="Object.values(item!.images)[0]"
        width="460"
        height="680"
        :custom="true"
      >
        <img
          v-bind="imgAttrs"
          :src="src"
          :class="['rounded-lg sm:rounded-2xl w-full aspect-[460/680] object-cover', customImageClass]"
          alt="card"
          @click="handleClick"
        />
      </NuxtImg>
      <div
        v-if="!isLoaded"
        class="w-full h-0.5 bg-[#F9F6EC] rounded-lg mt-1"
      />
      <div
        v-else-if="numImages > 1"
        class="flex justify-center items-center gap-1 px-6 py-2"
      >
        <div
          v-for="index in barIndices"
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
        <span
          v-if="getPriceData()"
          class="mt-0.5"
          :class="{ 'mb-2': popup }"
          >{{ priceFormatter(getPriceData()!.price) }}</span
        >
        <span
          v-else
          class="mt-0.5 text-gray-500"
          >Цена не указана</span
        >
      </template>
    </NuxtImg>
    <NuxtImg
      v-if="!isWideScreen || (!popup && isHovered) || isFavoriteLocal"
      ref="starRef"
      :src="isFavoriteLocal ? '/star-filled.svg' : '/star.svg'"
      alt="star"
      :class="[
        'star-button absolute z-10 cursor-pointer',
        'w-5 h-5 right-2.5 top-2.5 md:w-6 md:h-6 md:right-4 md:top-4',
        isStarPressed && 'star-pressed',
      ]"
      @mousedown="handleStarMouseDown"
      @touchstart="handleStarTouchStart"
      @click.stop="handleStarClick"
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
</style>
