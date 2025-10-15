export const useSmsAutoSubmit = (
	smsCode: Ref<string>,
	onSubmit: () => Promise<void>,
	isDisabled: Ref<boolean> = ref(false)
) => {
	watch(smsCode, async (newValue) => {
		if (newValue && /^\d{6}$/.test(newValue) && !isDisabled.value) {
			await onSubmit()
		}
	})
}