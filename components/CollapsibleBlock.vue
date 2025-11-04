<script setup lang="ts">
defineProps<{
  label: string
  description: string
}>()

const isOpen = ref(false)
</script>

<template>
  <div class="p-4 border border-[#BBB8B6] rounded-2xl flex flex-col">
    <div
      class="cursor-pointer w-full flex justify-center gap-2.5 items-center sm:justify-between sm:gap-0"
      @click="isOpen = !isOpen"
    >
      <span class="font-light text-sm">{{ label }}</span>
      <div class="help-icon" />
    </div>
    <div
      class="font-[Manrope] font-light text-xs text-[#211D1D] overflow-hidden"
      :class="isOpen ? 'h-auto mt-2' : 'h-0'"
    >
      {{ description }}
    </div>
  </div>
</template>

<style scoped>
.help-icon {
  background-image: url("/help.svg");
  background-size: contain;
  background-repeat: no-repeat;
  width: 16px;
  height: 16px;
}
</style>
