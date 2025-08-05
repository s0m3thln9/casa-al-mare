export const useCertificateStore = defineStore('certificate', () => {
	const step = ref(1)
	const selectedSum = ref<string | null>(null)
	const selectedWay = ref<string | null>(null)
	const selectedDetails = ref<string | null>(null)
	const recipientName = ref('')
	const message = ref('')
	
	const canGoNext = computed(() => {
		if (step.value === 1) {
			return selectedSum.value !== null
		} else if (step.value === 2) {
			return selectedWay.value !== null
		} else if (step.value === 3) {
			return selectedDetails.value !== null && recipientName.value.trim() !== ''
		}
		return false
	})
	
	const nextStep = () => {
		if (step.value < 3) {
			step.value++
		} else {
			alert('Отправлено')
		}
	}
	
	const prevStep = () => {
		if (step.value > 1) {
			step.value--
		}
	}
	
	return {
		step,
		selectedSum,
		selectedWay,
		selectedDetails,
		recipientName,
		message,
		canGoNext,
		nextStep,
		prevStep
	}
})