<script setup lang="ts">
const props = defineProps<{
	label: string
	type: "email" | "password" | "text"
	id: string
	modelValue: string
}>()

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void
}>()

const isActive = ref(props.modelValue !== '')
const isHidden = ref(true)
const inputRef = ref<HTMLInputElement | null>(null)

watch(() => props.modelValue, (newValue) => {
	isActive.value = newValue !== ''
})

const toggleVisibility = () => {
	isHidden.value = !isHidden.value
	nextTick(() => {
		inputRef.value?.focus()
	})
}

const handleInput = (event: Event) => {
	emit("update:modelValue", (event.target as HTMLInputElement).value)
}

</script>

<template>
  <div class="relative">
	  <label 
		  :for="id" 
		  class="absolute top-3.5 left-2.5 font-[Manrope] font-light text-sm text-[#8C8785] transition-all duration-200 pointer-events-none sm:text-xs"
		  :class="{'!top-[3px]': isActive}"
	  >
		  {{label}}
	  </label>
	  <input 
		  :id="id" 
		  ref="inputRef" 
		  :value="modelValue"
		  :type="(isHidden && type === 'password') ? 'password' : type === 'password' ? 'text' : type"
		  class="h-[44px] w-full px-2.5 pt-[21.5px] pb-1.5 border-[#5E5B58] border-[0.7px] rounded-lg text-sm font-light text-[#211D1D] font-[Manrope] focus:border-[#211D1D] focus:outline-0 sm:text-xs"
		  @focus="isActive = true"
		  @blur="isActive = modelValue !== ''"
		  @input="handleInput"
	  >
	  <button
		  v-if="type === 'password'"
		  class="cursor-pointer absolute top-1/2 -translate-y-1/2 right-[10.5px] w-fit"
		  @click="toggleVisibility"
	  >
		  <NuxtImg
			  :src="isHidden ? '/eye.svg' : '/eye-off.svg'"
			  class="w-[23px]"
		  />
	  </button>
  </div>
</template>

<style scoped>

</style>