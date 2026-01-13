export const useCertificateStore = defineStore("certificate", () => {
  const step = ref(1)
  const certificateType = ref<"Электронный" | "Физический">("Электронный")
  
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

  
  const totalSteps = computed(() =>
    certificateType.value === "Физический" ? 3 : 4,
  )
  
  const logicalStep = computed(() => {
    if (certificateType.value === "Физический" && step.value >= 2) {
      return step.value + 1
    }
    return step.value
  })
  
  const canGoNext = computed(() => {
    switch (logicalStep.value) {
      case 1:
        return selectedSum.value !== null
      
      case 2:
        return certificateType.value === "Физический"
          ? true
          : selectedDesign.value !== null
      
      case 3:
        if (selectedWay.value === "Электронной почтой") {
          return recipientEmail.value.trim() !== ""
        }
        
        if (selectedWay.value === "По SMS") {
          return (
            recipientPhone.value !== null &&
            recipientPhone.value.code.trim() !== "" &&
            recipientPhone.value.phone.trim() !== ""
          )
        }
        
        return selectedWay.value !== null
      
      case 4:
        return recipientName.value.trim() !== ""
      
      default:
        return false
    }
  })
  
  const nextStep = () => {
    if (step.value < totalSteps.value) {
      step.value++
    }
  }
  
  const prevStep = () => {
    if (step.value > 1) {
      step.value--
    }
  }
  
  const submitCertificate = async () => {
    isSubmitting.value = true
    submitError.value = null
    
    const token = await userStore.loadToken()
    
    try {
      const response = await $fetch("https://back.casaalmare.com/api/addCert", {
        method: "POST",
        body: {
          certificateType: certificateType.value,
          nominal: selectedSum.value,
          design:
            certificateType.value === "Физический"
              ? null
              : selectedDesign.value,
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
          recipientName: recipientName.value.trim() || null,
          message: message.value || null,
          token,
        },
      })
      
      if (response.success) {
        return { success: true, data: response.data }
      }
      
      submitError.value = response.error || "Ошибка при оформлении сертификата"
      return { success: false, error: submitError.value }
    } catch (error) {
      submitError.value =
        error instanceof Error ? error.message : "Ошибка при отправке"
      return { success: false, error: submitError.value }
    } finally {
      isSubmitting.value = false
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
  
  watch(certificateType, (newType, oldType) => {
    if (newType !== oldType) {
      resetForm()
    }
  })
  
  
  return {
    step,
    totalSteps,
    logicalStep,
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
