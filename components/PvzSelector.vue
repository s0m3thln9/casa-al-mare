<template>
  <div class="pvz-selector">
    <button
      :class="modelValue ? 'button_green' : 'activnaya'"
      :disabled="!loaded"
      @click="showPVZWidget"
    >
      <span
        v-if="!loaded"
        class="spinner"
      />
      <span
        v-else
        v-html="modelValue ? modelValue.address : 'Выберите ПВЗ'"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
interface PvzData {
  address: string
  [key: string]: any
}

const props = defineProps<{
  city?: { name: string }
  modelValue?: PvzData | null
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: PvzData): void
}>()

const { city, modelValue } = toRefs(props)

const widget = ref<any>(null)
const loaded = ref(false)

const loadWidget = () => {
  if (typeof window === "undefined") return

  widget.value = new (window as any).CDEKWidget({
    defaultLocation: city.value?.name || "Москва",
    from: "Москва",
    country: "Россия",
    root: false,
    popup: true,
    servicePath: "https://back.casaalmare.com/lib/pvzwidget/service.php",
    hideFilters: {
      have_cashless: true,
      have_cash: true,
      is_dressing_room: true,
      type: true,
    },
    hideDeliveryOptions: {
      office: false,
      door: true,
      pickup: true,
    },
    tariffs: {
      office: [138],
      door: [],
      pickup: [139],
    },
    apiKey: "a8d017e7-f4d0-4fc5-be61-1f404eb0af86",
    goods: [
      {
        length: 20,
        width: 30,
        height: 10,
        weight: 500,
      },
    ],
    onReady: () => {
      loaded.value = true
    },
    onChoose: (type: string, tariff: any, addressData: PvzData) => {
      emit("update:modelValue", addressData)
      widget.value.close()
    },
  })
}

const showPVZWidget = () => {
  if (widget.value) {
    widget.value.open()
  }
}

onMounted(() => {
  if (typeof window === "undefined") return

  const script = document.createElement("script")
  script.src = "https://back.casaalmare.com/lib/cdek_widget.js"
  script.async = true
  script.onload = loadWidget
  document.head.appendChild(script)
})

onUnmounted(() => {
  if (widget.value) {
    widget.value.destroy?.()
  }
})
</script>

<style scoped>
.button_green {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  background-color: #fff4a4;
  color: #211d1d;
  padding: 8px 20px;
  border: 1px solid #211d1d;
  border-radius: 1rem;
  cursor: pointer;
}

.activnaya {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  background-color: #211d1d;
  color: #fffffa;
  padding: 8px 20px;
  border: 1px solid #211d1d;
  border-radius: 1rem;
  cursor: pointer;
}

.activnaya:hover {
  background-color: #fffffa;
  color: #211d1d;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.6);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
