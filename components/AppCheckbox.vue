<script setup lang="ts">
const props = defineProps<{
  size: "S" | "M" | "L" | "XL"
  modelValue: string | string[] | number | null
  label: string
  labelHtml?: boolean
  disabled?: boolean
  value: string | number
  multiple?: boolean
}>()

const orderStore = useOrderStore()

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | string[] | null): void
}>()

const isMultipleMode = computed(() => {
  if (props.multiple !== undefined) return props.multiple
  return Array.isArray(props.modelValue)
})

const isSelected = computed(() => {
  if (isMultipleMode.value && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(String(props.value))
  }
  return String(props.modelValue) === String(props.value)
})

const toggle = () => {
  if (props.disabled) return

  if (isMultipleMode.value) {
    const currentArray = Array.isArray(props.modelValue) ? props.modelValue : []
    if (isSelected.value) {
      emit(
        "update:modelValue",
        currentArray.filter((v) => String(v) !== String(props.value)),
      )
    } else {
      emit("update:modelValue", [...currentArray, props.value])
    }
  } else {
    emit("update:modelValue", isSelected.value ? null : props.value)
  }
}
</script>

<template>
  <div
    class="flex gap-2 items-center select-none"
    :class="!disabled && 'cursor-pointer'"
    role="checkbox"
    :aria-checked="isSelected"
    @click="toggle"
  >
    <button
      :disabled="disabled"
      :class="[
        'flex justify-center items-center rounded-3xl border border-[#BBB8B6] flex-shrink-0',
        disabled ? 'bg-[#F9F6EC]' : 'cursor-pointer',
        size === 'S' && 'w-4 h-4',
        size === 'M' && 'w-5 h-5',
        size === 'L' && 'w-6 h-6',
        size === 'XL' && 'w-8 h-8',
        isSelected && 'bg-[#211D1D] border-[#F9F6EC]',
      ]"
    >
      <div
        v-if="isSelected"
        class="check-icon"
      />
    </button>
    <span
      v-if="label"
      class="text-sm font-light"
    >
      {{ label }}
    </span>
    <span
      v-else-if="labelHtml"
      class="text-sm font-light"
    >
      Выгода {{orderStore.priceFormatter(orderStore.pointsBenefit.benefit)}}
      ({{orderStore.priceFormatter(orderStore.pointsBenefit.newPrice)}} <span
      class='line-through'>{{orderStore.priceFormatter(orderStore
      .pointsBenefit.oldPrice)}}</span>)
    </span>
  </div>
</template>

<style scoped>
.check-icon {
  background-image: url("/check.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
}
</style>
