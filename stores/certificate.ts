export const useCertificateStore = defineStore("certificate", () => {
  const step = ref(1)
  const certificateType = ref("Электронный")
  const selectedSum = ref<string | null>(null)
  const selectedWay = ref<string | null>(null)
  const recipientEmail = ref("")
  const recipientPhone = ref("")
  const selectedDetails = ref<string | null>(null)
  const recipientName = ref("")
  const message = ref("")

  const canGoNext = computed(() => {
    if (step.value === 1) {
      return selectedSum.value !== null
    } else if (step.value === 2) {
      if (selectedWay.value === "Электронной почтой") {
        return recipientEmail.value.trim() !== ""
      } else if (selectedWay.value === "По SMS") {
        return recipientPhone.value.trim() !== ""
      } else {
        return selectedWay.value !== null
      }
    } else if (step.value === 3) {
      return selectedDetails.value !== null && recipientName.value.trim() !== ""
    }
    return false
  })

  const nextStep = () => {
    if (step.value < 3) {
      step.value++
    } else {
      alert("Отправлено")
    }
  }

  const prevStep = () => {
    if (step.value > 1) {
      step.value--
    }
  }

  return {
    step,
    certificateType,
    selectedSum,
    selectedWay,
    recipientEmail,
    recipientPhone,
    selectedDetails,
    recipientName,
    message,
    canGoNext,
    nextStep,
    prevStep,
  }
})
