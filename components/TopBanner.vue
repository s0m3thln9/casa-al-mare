<script setup lang="ts">
import { topBannerConfig as config } from "~/config/topBanner"

const { content, behavior, appearance } = config

const STORAGE_KEY = `top-banner-closed:${config.id}`

const isInSchedule = () => {
  const now = Date.now()
  if (config.startAt && now < Date.parse(config.startAt)) return false
  return !(config.endAt && now > Date.parse(config.endAt));
  
}

const getStorage = () => {
  try {
    if (behavior.rememberClose === "session") return sessionStorage
    if (behavior.rememberClose === "local") return localStorage
  } catch { /* empty */ }
  return null
}

const isVisible = useState("top-banner-visible", () => config.enabled && content.messages.length > 0 && isInSchedule())

onMounted(() => {
  if (!isInSchedule()) {
    isVisible.value = false
    return
  }
  try {
    if (getStorage()?.getItem(STORAGE_KEY)) isVisible.value = false
  } catch { /* empty */ }
})

const close = () => {
  isVisible.value = false
  try {
    getStorage()?.setItem(STORAGE_KEY, "1")
  } catch { /* empty */ }
}

const linkTag = content.link ? resolveComponent("NuxtLink") : "div"

const height = `${appearance.height}px`
const speed = `${behavior.speed}s`
const halfSpeed = `${behavior.speed / 2}s`

useHead({
  htmlAttrs: {
    style: computed(() => `--top-banner-h: ${isVisible.value ? appearance.height : 0}px`),
  },
})
</script>

<template>
  <div
    v-if="isVisible"
    :class="['top-banner relative', { 'pause-on-hover': behavior.pauseOnHover }]"
  >
    <component
      :is="linkTag"
      :to="content.link || undefined"
      class="block h-full overflow-hidden"
      :aria-label="content.ariaLabel"
    >
      <div class="ticker flex h-full">
        <div
          v-for="copy in 2"
          :key="copy"
          class="wrap"
          :aria-hidden="copy === 2"
        >
          <template v-for="n in content.repeat" :key="n">
            <template v-for="message in content.messages" :key="message">
              <span v-if="content.showIcon" class="icon" />
              <span class="item">{{ message }}</span>
            </template>
          </template>
        </div>
      </div>
    </component>
    <button
      v-if="behavior.closable"
      type="button"
      aria-label="Закрыть баннер"
      class="close absolute top-0 right-0 z-[5] flex items-center justify-center cursor-pointer"
      @click="close"
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
        <path d="M1 1L7 7M1 7L7 1" stroke="currentColor" />
      </svg>
    </button>
  </div>
</template>

<style scoped>

.top-banner {
  height: v-bind(height);
  background-color: v-bind('appearance.background');
  color: v-bind('appearance.text');
}

.wrap {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  white-space: nowrap;
  animation: ticker-a v-bind(speed) linear infinite;
  animation-delay: calc(v-bind(speed) * -1);
  will-change: transform;
}

.wrap:nth-child(2) {
  animation: ticker-b v-bind(speed) linear infinite;
  animation-delay: calc(v-bind(halfSpeed) * -1);
}

.pause-on-hover:hover .wrap {
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
  line-height: v-bind(height);
  text-transform: uppercase;
}

.icon {
  flex-shrink: 0;
  width: 12px;
  height: 13px;
  background-color: v-bind('appearance.icon');
  mask: url("/logo-3.svg") center / contain no-repeat;
  -webkit-mask: url("/logo-3.svg") center / contain no-repeat;
}

.close {
  width: v-bind(height);
  height: v-bind(height);
  background-color: v-bind('appearance.closeBackground');
  color: v-bind('appearance.closeIcon');
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
