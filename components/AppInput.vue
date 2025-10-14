<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    type: "email" | "password" | "text"
    id: string
    modelValue: string
    required?: boolean
    customClass?: string
    errorHideDelay?: number
    disabled?: boolean
  }>(),
  {
    required: false,
    customClass: "",
    errorHideDelay: 3000,
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

const isActive = ref(props.modelValue !== "")
const isHidden = ref(true)
const inputRef = ref<HTMLInputElement | null>(null)
const showError = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.modelValue,
  (newValue) => {
    isActive.value = newValue !== ""
    if (props.required && newValue === "") {
      triggerError()
    } else {
      clearError()
    }
  },
)

const toggleVisibility = () => {
  isHidden.value = !isHidden.value
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit("update:modelValue", value)
  if (props.required && value === "") {
    triggerError()
  } else {
    clearError()
  }
}

const validate = () => {
  if (props.required && props.modelValue.trim() === "") {
    triggerError()
    return false
  }
  clearError()
  return true
}

const triggerError = () => {
  showError.value = true
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    showError.value = false
  }, props.errorHideDelay)
}

const clearError = () => {
  showError.value = false
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

defineExpose({ validate, showError })
</script>

<template>
  <div
    class="relative"
    :class="customClass"
  >
    <label
      :for="id"
      class="absolute top-3.5 left-2.5 font-[Manrope] font-light text-sm transition-all duration-200 pointer-events-none sm:text-xs"
      :class="{ '!top-[3px] text-[#8C8785]': isActive, 'text-[#5E5B58]': !isActive }"
    >
      {{ label }}
      <span class="text-[#E29650]">{{ required ? "*" : "" }}</span>
    </label>
    <input
      :id="id"
      ref="inputRef"
      :value="modelValue"
      :type="isHidden && type === 'password' ? 'password' : type === 'password' ? 'text' : type"
      class="h-[44px] w-full px-2.5 pt-[21.5px] pb-1.5 border-[0.7px] rounded-lg text-sm font-light text-[#211D1D] font-[Manrope] outline-none sm:text-xs"
      :class="{
        'border-[#E29650]': showError,
        'border-[#211D1D]': isActive && !showError,
        'border-[#B8B8B6]': !isActive && !showError,
        'pr-12': type === 'password',
      }"
      :readonly="disabled"
      @focus="isActive = true"
      @blur="
        () => {
          isActive = modelValue !== ''
          validate()
        }
      "
      @input="handleInput"
    />
    <button
      v-if="type === 'password'"
      class="cursor-pointer absolute top-1/2 -translate-y-1/2 right-[10.5px] w-fit"
      aria-label="Переключить видимость пароля"
      @click="toggleVisibility"
    >
      <NuxtImg
        :src="isHidden ? '/eye.svg' : '/eye-off.svg'"
        class="w-[23px]"
        :alt="isHidden ? 'Показать пароль' : 'Скрыть пароль'"
      />
    </button>
  </div>
</template>

<style scoped></style>
