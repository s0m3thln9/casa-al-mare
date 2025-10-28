<script setup lang="ts">
const props = defineProps<{
  customClass?: string
  content: { value: string; label: string }[]
  modelValue: string[]
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void
}>()

const select = (value: string) => {
  const currentValues = [...props.modelValue]
  const index = currentValues.indexOf(value)
  if (index > -1) {
    currentValues.splice(index, 1)
  } else {
    currentValues.push(value)
  }

  emit("update:modelValue", currentValues)
}

const isSelected = (value: string): boolean => {
  return props.modelValue.includes(value)
}
</script>

<template>
  <button
    v-for="(item, index) in content"
    :key="index"
    :class="[
      'font-[Manrope] p-2 flex justify-center gap-1 items-center border-[0.7px] rounded-lg text-sm cursor-pointer',
      customClass,
      {
        'bg-[#211D1D] border-[#211D1D] text-[#FFFFFA]': isSelected(item.value),
        'border-[#BBB8B6] hover:border-[#F3A454] hover:text-[#FFFFFA] hover:bg-[#F3A454]': !isSelected(item.value),
      },
    ]"
    @click="select(item.value)"
  >
    {{ item.label }}
  </button>
</template>

<style scoped></style>
