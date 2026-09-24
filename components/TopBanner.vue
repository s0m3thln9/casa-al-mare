<script setup lang="ts">

const STORAGE_KEY = "top-banner-closed:solo-noi-2026-09"
const LINK = "/blog/solo-noi-×-casa-al-mare-sentyabr-v-dome-na-italyanskom-poberezhe/"
const MESSAGES = ["Casa al mare × Solo Noi", "Pop-up и персиковое меню в итальянской фокаччерии"]

const REPEAT = 4

const isVisible = useState("top-banner-visible", () => true)

onMounted(() => {
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) isVisible.value = false
  } catch {
  }
})

const close = () => {
  isVisible.value = false
  try {
    sessionStorage.setItem(STORAGE_KEY, "1")
  } catch {
  }
}

useHead({
  htmlAttrs: {
    style: computed(() => (isVisible.value ? "--top-banner-h: 22px" : "--top-banner-h: 0px")),
  },
})
</script>

<template>
  <div
    v-if="isVisible"
    class="top-banner relative h-[22px] bg-[#FDF5BF] text-[#211D1D]"
  >
    <NuxtLink
      :to="LINK"
      class="block h-full overflow-hidden"
      aria-label="Casa al mare × Solo Noi: pop-up и персиковое меню в итальянской фокаччерии"
    >
      <div class="ticker flex h-full">
        <div
          v-for="copy in 2"
          :key="copy"
          class="wrap"
          :aria-hidden="copy === 2"
        >
          <template v-for="n in REPEAT" :key="n">
            <template v-for="message in MESSAGES" :key="message">
              <span class="icon" />
              <span class="item">{{ message }}</span>
            </template>
          </template>
        </div>
      </div>
    </NuxtLink>
    <button
      type="button"
      aria-label="Закрыть баннер"
      class="close absolute top-0 right-0 z-[5] flex items-center justify-center w-[22px] h-[22px] bg-[#F3A454] cursor-pointer"
      @click="close"
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
        <path d="M1 1L7 7M1 7L7 1" stroke="#FFFFFA" />
      </svg>
    </button>
  </div>
</template>

<style scoped>

.wrap {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  white-space: nowrap;
  animation: ticker-a 100s linear infinite;
  animation-delay: -100s;
  will-change: transform;
}

.wrap:nth-child(2) {
  animation: ticker-b 100s linear infinite;
  animation-delay: -50s;
}

.top-banner:hover .wrap {
  animation-play-state: paused;
}

@keyframes ticker-a {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes ticker-b {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-200%);
  }
}

.item {
  margin: 0 60px;
  font-family: Manrope, sans-serif;
  font-size: 10px;
  line-height: 22px;
  text-transform: uppercase;
}

.icon {
  flex-shrink: 0;
  width: 12px;
  height: 13px;
  background-color: #f3a454;
  mask: url("/logo-3.svg") center / contain no-repeat;
  -webkit-mask: url("/logo-3.svg") center / contain no-repeat;
}

.close svg {
  transition: transform 0.2s ease;
}

.close:hover svg {
  transform: scale(1.3);
}

@media (prefers-reduced-motion: reduce) {
  .wrap {
    animation-play-state: paused;
  }
}

@media screen and (max-width: 640px) {
  .item {
    margin: 0 32px;
  }
}
</style>
