<script setup lang="ts">
const props = defineProps<{
  items: {
    alias: string
    name: string
    image: string
    activeImage: string
  }[]
  modelValue: string | string[] | null
  multiple?: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[] | null): void
}>()

const select = (alias: string) => {
  if (props.multiple) {
    // Режим множественного выбора
    const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = currentValues.indexOf(alias)
    if (index > -1) {
      currentValues.splice(index, 1)
    } else {
      currentValues.push(alias)
    }
    emit("update:modelValue", currentValues)
  } else {
    // Режим одиночного выбора
    if (props.modelValue === alias) {
      emit("update:modelValue", null)
    } else {
      emit("update:modelValue", alias)
    }
  }
}

const isSelected = (alias: string) => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(alias)
  }
  return props.modelValue === alias
}

const decodeSvg = (dataUrl: string) => {
  if (!dataUrl || !dataUrl.startsWith("data:image/svg+xml")) {
    return dataUrl
  }

  const svgContent = dataUrl.replace(/^data:image\/svg\+xml;utf8,/, "")

  return decodeURIComponent(svgContent)
}
</script>

<template>
  <div
    v-for="(item, index) in items"
    :key="index"
    class="flex flex-col justify-center gap-2 items-center"
  >
    <button
      class="cursor-pointer w-[52px] h-[52px] flex items-center justify-center"
      @click="select(item.alias)"
    >
      <div
        class="w-full h-full flex items-center justify-center"
        v-html="decodeSvg(isSelected(item.alias) ? item.activeImage : item.image)"
      />
    </button>
    <span class="text-xs font-[Manrope] text-center">{{ item.name }}</span>
  </div>
</template>

<style scoped></style>
