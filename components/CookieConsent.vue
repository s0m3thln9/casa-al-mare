<script setup lang="ts">
import { Preferences } from "@capacitor/preferences"

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

const isVisible = ref(props.modelValue)

onMounted(async () => {
  try {
    const { value } = await Preferences.get({ key: "cookies" })
    if (value === "1") {
      isVisible.value = false
      emit("update:modelValue", false)
    } else {
      isVisible.value = true
    }
  } catch (error) {
    console.error("Ошибка чтения Preferences для cookies:", error)
    isVisible.value = true
  }
})

const handleClick = async (e: MouseEvent) => {
  e.stopPropagation()
  try {
    await Preferences.set({ key: "cookies", value: "1" })
    isVisible.value = false
    emit("update:modelValue", false)
  } catch (error) {
    console.error("Ошибка сохранения согласия на cookies:", error)
  }
}
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed bottom-0 left-0 z-50 w-full p-2 pt-6 bg-[#FFFFFA] sm:p-0 sm:bg-transparent sm:w-[300px] sm:left-auto sm:right-1 sm:bottom-5"
  >
    <div
      class="flex p-2.5 rounded-2xl bg-[#FFFFFA] justify-between gap-6 items-center border border-[#BBB8B6] sm:h-[65px]"
    >
      <span class="text-xs font-[Manrope] text-[#1A1A1A] sm:text-[15px] sm:font-light sm:text-[#211D1D]">
        Согласие на cookies
      </span>
      <AppButton
        content="принять"
        variant="secondary"
        custom-class="px-10 sm:px-3"
        aria-label="Принять cookies"
        @click="handleClick"
      />
    </div>
  </div>
</template>

<style scoped></style>
