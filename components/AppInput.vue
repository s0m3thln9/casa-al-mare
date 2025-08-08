<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
	label: string
	type: "email" | "password" | "text"
	id: string
	modelValue: string
	required?: boolean
}>()

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void
}>()

const isActive = ref(props.modelValue !== '')
const isHidden = ref(true)
const inputRef = ref<HTMLInputElement | null>(null)
const showError = ref(false)

watch(() => props.modelValue, (newValue) => {
	isActive.value = newValue !== ''
	showError.value = props.required && newValue === ''
})

const toggleVisibility = () => {
	isHidden.value = !isHidden.value
	nextTick(() => {
		inputRef.value?.focus()
	})
}

const handleInput = (event: Event) => {
	const value = (event.target as HTMLInputElement).value
	emit("update:modelValue", value)
	showError.value = props.required && value === ''
}

const validateInput = () => {
	showError.value = props.required && props.modelValue === ''
	return !showError.value
}

defineExpose({ validateInput })

</script>

<template>
  <div class="relative">
    <label
	    :for="id"
	    class="absolute top-3.5 left-2.5 font-[Manrope] font-light text-sm text-[#8C8785] transition-all duration-200 pointer-events-none sm:text-xs"
	    :class="{ '!top-[3px]': isActive }"
    >
      {{ label }}
      <span class="text-[#E29650]">{{ required ? '*' : '' }}</span>
    </label>
    <input
	    :id="id"
	    ref="inputRef"
	    :value="modelValue"
	    :type="(isHidden && type === 'password') ? 'password' : type === 'password' ? 'text' : type"
	    class="h-[44px] w-full px-2.5 pt-[21.5px] pb-1.5 border-[0.7px] rounded-lg text-sm font-light text-[#211D1D] font-[Manrope] focus:outline-0 sm:text-xs"
	    :class="{ 'border-[#5E5B58]': !showError, 'border-[#E29650]': showError }"
	    @focus="isActive = true"
	    @blur="isActive = modelValue !== ''; validateInput()"
	    @input="handleInput"
    >
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
    <button
	    v-if="props.required"
	    class="absolute top-1/2 -translate-y-1/2 right-[40px] w-fit"
	    aria-label="Проверить поле"
	    @click="validateInput"
    >
      <NuxtImg
	      src="/check.svg"
	      class="w-[23px]"
	      alt="Проверить поле"
      />
    </button>
    <div
	    v-if="showError"
	    class="absolute -top-[40px] left-3 bg-[#FFFFFA] border border-[#A6CEFF] text-[#211D1D] text-[13px] font-light font-[Manrope] p-4 shadow-md z-10 rounded-t-3xl rounded-r-3xl"
    >
      Это поле обязательно для заполнения
    </div>
  </div>
</template>

<style scoped>
div[role="tooltip"] {
	opacity: 0;
	transition: opacity 0.2s ease-in-out;
}
div[role="tooltip"].visible {
	opacity: 1;
}
</style>