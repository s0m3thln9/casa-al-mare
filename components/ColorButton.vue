<script setup lang="ts">
const props = defineProps<{
  colors: {
    code: string
    name: string
    value: string
  }[]
  modelValue: { code: string; name: string; value: string } | { code: string; name: string; value: string }[] | null
  text?: boolean
}>()

const emit = defineEmits<{
  (
    e: "update:modelValue",
    value: { code: string; name: string; value: string } | { code: string; name: string; value: string }[] | null,
  ): void
}>()

const isMultiple = Array.isArray(props.modelValue)

const select = (color: { code: string; name: string; value: string }) => {
  if (isMultiple) {
    const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = currentValues.findIndex((c) => c.code === color.code)
    if (index > -1) {
      currentValues.splice(index, 1)
    } else {
      currentValues.push({ code: color.code, name: color.name, value: color.value })
    }
    emit("update:modelValue", currentValues)
  } else {
    if ((props.modelValue as { code: string; name: string; value: string } | null)?.code === color.code) {
      emit("update:modelValue", null)
    } else {
      emit("update:modelValue", { code: color.code, name: color.name, value: color.value })
    }
  }
}

const isSelected = (color: { code: string; name: string; value: string }) => {
  if (isMultiple) {
    return Array.isArray(props.modelValue) && props.modelValue.some((c) => c.code === color.code)
  }
  return (props.modelValue as { code: string; name: string } | null)?.code === color.code
}

const isWhite = (color: { value: string }) => color.value.toLowerCase() === "#ffffff"
</script>

<template>
  <div
    v-for="(color, index) in colors"
    :key="index"
    class="flex flex-col justify-center gap-2 items-center"
  >
    <button
      class="cursor-pointer"
      @click="select(color)"
    >
      <div
        :class="[
          'w-6 h-6 rounded-lg',
          isSelected(color) && 'border-2 border-[#211D1D]',
          !isSelected(color) && isWhite(color) && 'border-1 border-[#211D1D]',
        ]"
        :style="{ backgroundColor: color.value }"
      />
    </button>
    <span
      v-if="text"
      class="text-xs font-[Manrope] text-center"
      >{{ color.name }}</span
    >
  </div>
</template>

<style scoped></style>
