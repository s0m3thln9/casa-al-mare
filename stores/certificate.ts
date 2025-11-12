export const useCertificateStore = defineStore("certificate", () => {
  const step = ref(1)
  const certificateType = ref("Электронный")
  const selectedSum = ref<number | null>(null)
  const selectedDesign = ref<number | null>(null)
  const selectedWay = ref<string | null>(null)
  const recipientEmail = ref("")
  const recipientPhone = ref<{
    code: string
    phone: string
    country: string
  } | null>(null)
  const selectedDetails = ref<string | null>(null)
  const recipientName = ref("")
  const message = ref("")
  const isSubmitting = ref(false)
  const submitError = ref<string | null>(null)
  const userStore = useUserStore()

  const submitCertificate = async () => {
    isSubmitting.value = true
    submitError.value = null

    const token = await userStore.loadToken()

    try {
      const formData = {
        certificateType: certificateType.value,
        nominal: selectedSum.value,
        design: selectedDesign.value,
        deliveryMethod: selectedWay.value,
        recipientEmail: recipientEmail.value || null,
        recipientPhone: recipientPhone.value
          ? {
              code: recipientPhone.value.code,
              phone: recipientPhone.value.phone,
              country: recipientPhone.value.country,
            }
          : null,
        deliveryDetails: selectedDetails.value,
        recipientName: selectedDetails.value === "Анонимно" ? null : recipientName.value.trim() || null,
        message: message.value || null,
        token: token,
      }

      const response = await $fetch("https://back.casaalmare.com/api/addCert", {
        method: "POST",
        body: formData,
      })

      if (response.success) {
        return { success: true, data: response.data }
      } else {
        submitError.value = response.error || "Ошибка при оформлении сертификата"
        return { success: false, error: submitError.value }
      }
    } catch (error) {
      console.error("Ошибка при отправке сертификата:", error)
      submitError.value = error instanceof Error ? error.message : "Произошла ошибка при отправке"
      return { success: false, error: submitError.value }
    } finally {
      isSubmitting.value = false
    }
  }

  const canGoNext = computed(() => {
    if (step.value === 1) {
      return selectedSum.value !== null
    } else if (step.value === 2) {
      return selectedDesign.value !== null
    } else if (step.value === 3) {
      if (selectedWay.value === "Электронной почтой") {
        return recipientEmail.value.trim() !== ""
      } else if (selectedWay.value === "По SMS") {
        return (
          recipientPhone.value !== null &&
          recipientPhone.value.code.trim() !== "" &&
          recipientPhone.value.phone.trim() !== ""
        )
      } else {
        return selectedWay.value !== null
      }
    } else if (step.value === 4) {
      if (selectedDetails.value === "Анонимно") {
        return true
      }
      return recipientName.value.trim() !== ""
    }
    return false
  })

  const nextStep = () => {
    if (step.value < 4) {
      step.value++
    }
  }

  const prevStep = () => {
    if (step.value > 1) {
      step.value--
    }
  }

  const resetForm = () => {
    step.value = 1
    selectedSum.value = null
    selectedDesign.value = null
    selectedWay.value = null
    recipientEmail.value = ""
    recipientPhone.value = null
    selectedDetails.value = null
    recipientName.value = ""
    message.value = ""
    submitError.value = null
  }

  watch(selectedDetails, (newValue) => {
    if (newValue === "Анонимно") {
      recipientName.value = ""
    }
  })

  return {
    step,
    certificateType,
    selectedSum,
    selectedDesign,
    selectedWay,
    recipientEmail,
    recipientPhone,
    selectedDetails,
    recipientName,
    message,
    canGoNext,
    isSubmitting,
    submitError,
    nextStep,
    prevStep,
    submitCertificate,
    resetForm,
  }
})
