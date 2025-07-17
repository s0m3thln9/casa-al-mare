<script setup lang="ts">

const props = defineProps<{
	variant?: "primary" | "secondary"
	customClass?: string
	disabled?: boolean
	isExpanded?: boolean
}>()

const emit = defineEmits<{
	(e: 'toggle-expand'): void
}>()

const isLoading = ref(false)
const showSuccess = ref(false)

const styleBase = computed(() =>
	"flex justify-center items-center px-4 py-2 rounded-xl border text-xs/snug font-[Manrope] font-light sm:font-normal " +
	(props.customClass ? props.customClass + ' ' : ' ')
)
const styleVariants = {
	default: "bg-transparent border-transparent text-[#211D1D] cursor-pointer hover:border-[#211D1D] hover:text-[#211D1D]",
	preload: "bg-[#FFFFFA] border-transparent text-[#211D1D] cursor-default",
	success: "bg-[#FFFFFA] border-[#211D1D] text-[#211D1D] cursor-default",
}

const currentState = computed(() => {
	let content: string
	let style: string
	let disabled: boolean
	
	if (isLoading.value) {
		content = "Загрузка..."
		style = styleBase.value + styleVariants.preload
		disabled = true
	} else if (showSuccess.value) {
		content = props.isExpanded ? "Свернуть" : "Подробнее"
		style = styleBase.value + styleVariants.success
		disabled = true
	} else {
		content = props.isExpanded ? "Свернуть" : "Подробнее"
		style = styleBase.value + styleVariants.default
		disabled = props.disabled || false
	}
	
	return { content, style, disabled }
})

const handleClick = () => {
	if (!isLoading.value && !showSuccess.value) {
		emit('toggle-expand')
	}
}

</script>

<template>
  <button
	  :class="currentState.style"
	  :disabled="currentState.disabled"
	  @click="handleClick"
  >
    {{ currentState.content }}
  </button>
</template>

<style scoped>

</style>