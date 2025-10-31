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
  city?: string
  cityCode?: string
  [key: string]: any
}

interface CityData {
  label: string
  name: string
  kladr: string
  fias: string
  region?: string
}

const props = defineProps<{
  city?: { name: string }
  modelValue?: PvzData | null
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: PvzData): void
  (e: "update:city", value: CityData): void
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
        length: 51,
        width: 37,
        height: 12,
        weight: 2000,
      },
    ],
    onReady: () => {
      loaded.value = true
    },
    onChoose: async (type: string, tariff: any, addressData: PvzData) => {
      emit("update:modelValue", addressData)

      if (addressData.city && addressData.city !== city.value?.name) {
        try {
          const response = await $fetch<{ data: Record<number, CityData>; success: boolean }>(
            `https://back.casaalmare.com/api/getCityByQuery?query=${encodeURIComponent(addressData.city)}`,
          )

          if (response?.data && response.success) {
            const newCity = response.data[0]
            emit("update:city", newCity)
          }
        } catch (error) {
          console.error("Ошибка обновления города:", error)
        }
      }

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

watch(
  () => city.value?.name,
  (newCityName) => {
    if (widget.value && newCityName) {
      widget.value.setLocation?.(newCityName)
    }
  },
)
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
  .spinner {
    border: 2px solid rgba(0, 0, 0, 0.6);
    border-top-color: #000;
  }
}

.button_green:hover {
  .spinner {
    border: 2px solid rgba(0, 0, 0, 0.6);
    border-top-color: #000;
  }
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
  .spinner {
    border: 2px solid rgba(255, 255, 255, 0.6);
    border-top-color: #fff;
  }
}

.activnaya:hover {
  background-color: #fffffa;
  color: #211d1d;
  .spinner {
    border: 2px solid rgba(0, 0, 0, 0.6);
    border-top-color: #000;
  }
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
