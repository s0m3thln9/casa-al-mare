<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
	isParametersSelected?: boolean
	inStock?: boolean
	availableQuantity?: boolean
	id: string
}>()

const isLoading = ref(false)
const showSuccess = ref(false)
const isInCart = ref(false)
const orderStore = useOrderStore()

const styleBase = 'flex justify-center items-center w-full py-4 border rounded-[18px] text-[13px]/snug font-[Manrope] sm:text-sm/snug '
const styleVariants = {
	default: 'bg-[#211D1D] border-[#211D1D] text-[#FFFFFA] cursor-pointer hover:bg-[#F3A454] hover:border-[#F3A454]',
	preload: 'bg-[#FFFFFA] border-[#F3A454] text-[#F3A454] cursor-default',
	success: 'bg-[#FFF4A4] border-[#211D1D] text-[#211D1D] cursor-default',
	outOfStock: 'bg-[#FFFFFA] border-[#8C8785] text-[#8C8785] cursor-default',
	notify: 'bg-[#FFFFFA] border-[#211D1D] text-[#211D1D] cursor-pointer hover:bg-[#211D1D] hover:text-[#FFFFFA]',
}

const currentState = computed(() => {
	let content: string
	let style: string
	let disabled: boolean
	
	if (!props.inStock) {
		content = 'Нет в наличии'
		style = styleBase + styleVariants.outOfStock
		disabled = true
	} else if (!props.availableQuantity) {
		content = 'Уведомить о размерах'
		style = styleBase + styleVariants.notify
		disabled = false
	} else if (!props.isParametersSelected) {
		content = 'Выберите все параметры'
		style = styleBase + styleVariants.default
		disabled = false
	} else if (isLoading.value) {
		content = 'Добавление...'
		style = styleBase + styleVariants.preload
		disabled = true
	} else if (showSuccess.value) {
		content = 'Добавлено'
		style = styleBase + styleVariants.success
		disabled = true
	} else if (isInCart.value) {
		content = 'Перейти в корзину'
		style = styleBase + styleVariants.default
		disabled = false
	} else {
		content = 'Добавить в корзину'
		style = styleBase + styleVariants.default
		disabled = false
	}
	
	return { content, style, disabled }
})

const handleClick = () => {
	if (!props.inStock) {
		return
	}
	if (!props.availableQuantity) {
		alert('Уведомление о поступлении товара настроено')
		return
	}
	if (!props.isParametersSelected) {
		alert('Пожалуйста, выберите все параметры')
		return
	}
	if (isInCart.value) {
		navigateTo("/order")
	}
	if (!isLoading.value && !showSuccess.value) {
		isLoading.value = true
		setTimeout(() => {
			isLoading.value = false
			isInCart.value = true
			showSuccess.value = true
			orderStore.addToCart(props.id)
			setTimeout(() => {
				showSuccess.value = false
			}, 1500)
		}, 3000)
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