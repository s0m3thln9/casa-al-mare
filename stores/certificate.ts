export const useCertificateStore = defineStore("certificate", () => {
  const step = ref(1)
  const certificateType = ref("Электронный")
  const selectedSum = ref<string | null>(null)
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

  const canGoNext = computed(() => {
    if (step.value === 1) {
      return selectedSum.value !== null
    } else if (step.value === 2) {
      return selectedDesign.value !== null
    } else if (step.value === 3) {
      if (selectedWay.value === "Электронной почтой") {
        return recipientEmail.value.trim() !== ""
      } else if (selectedWay.value === "По SMS") {
        // Проверяем, что объект телефона существует и поля не пустые
        return (
          recipientPhone.value !== null &&
          recipientPhone.value.code.trim() !== "" &&
          recipientPhone.value.phone.trim() !== ""
        )
      } else {
        // Например, "Получу сам" — тогда способ выбран, и доп. данных не нужно
        return selectedWay.value !== null
      }
    } else if (step.value === 4) {
      return selectedDetails.value !== null && recipientName.value.trim() !== ""
    }
    return false
  })

  const nextStep = () => {
    if (step.value < 4) {
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
    selectedDesign,
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
