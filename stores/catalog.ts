type Item = {
  id: string
  name: string
  colors: {
    [color: string]: {
      name: string
      value: string
      images: number[]
    }
  }
  sizes: string[]
  images: {
    [id: number]: string
  }
  vector: {
    [vector: string]: {
      oldPrice: number
      price: number
      quantity: number
      comingSoon: boolean
    }
  }
  type: string
  material: string
  useType: string
}

type SortAndFilter = {
  types: string[]
  colors: { code: string, name: string, value: string }[]
  sizes: string[]
  maxPrice: number | null
  sortType: string | null
  withDiscount: string | null
  inStock: string | null
  materials: string[]
  useTypes: string[]
}

const temporaryItems: Item[] = [
  {
    id: "1",
    name: "Cropped swim top",
    colors: {
      red: {
        name: "Красный",
        value: "#D85959",
        images: [1, 2, 3, 4, 5, 6],
      },
      green: {
        name: "Зеленый",
        value: "#68C768",
        images: [7, 8, 9, 10, 11, 12],
      },
    },
    sizes: ["XS-S", "S-M", "M-L"],
    images: {
      1: "/item-1.jpg",
      2: "/item-2.jpg",
      3: "/item-3.jpg",
      4: "/item-4.jpg",
      5: "/item-5.jpg",
      6: "/item-6.jpg",
      7: "/item-7.jpg",
      8: "/item-8.jpg",
      9: "/item-9.jpg",
      10: "/item-10.jpg",
      11: "/item-11.jpg",
      12: "/item-12.jpg",
    },
    vector: {
      "red_XS-S": {
        oldPrice: 21000,
        price: 20000,
        quantity: 10,
        comingSoon: false,
      },
      "red_S-M": {
        oldPrice: 10000,
        price: 9000,
        quantity: 0,
        comingSoon: true,
      },
      "red_M-L": {
        oldPrice: 15000,
        price: 12000,
        quantity: 0,
        comingSoon: false,
      },
      "green_XS-S": {
        oldPrice: 22000,
        price: 21000,
        quantity: 12,
        comingSoon: false,
      },
      "green_S-M": {
        oldPrice: 20000,
        price: 19000,
        quantity: 4,
        comingSoon: false,
      },
      "green_M-L": {
        oldPrice: 16000,
        price: 11000,
        quantity: 0,
        comingSoon: true,
      },
    },
    type: "Топ",
    material: "Вязаные",
    useType: "Пляж",
  },
  {
    id: "2",
    name: "Beach shorts",
    colors: {
      blue: {
        name: "Синий",
        value: "#4A66C5",
        images: [13, 14, 15, 16, 17, 18],
      },
      yellow: {
        name: "Желтый",
        value: "#F2D06C",
        images: [19, 20, 21, 22, 23, 24],
      },
    },
    sizes: ["XS-S", "S-M", "M-L"],
    images: {
      13: "/item-1.jpg",
      14: "/item-2.jpg",
      15: "/item-3.jpg",
      16: "/item-4.jpg",
      17: "/item-5.jpg",
      18: "/item-6.jpg",
      19: "/item-7.jpg",
      20: "/item-8.jpg",
      21: "/item-9.jpg",
      22: "/item-10.jpg",
      23: "/item-11.jpg",
      24: "/item-12.jpg",
    },
    vector: {
      "blue_XS-S": {
        oldPrice: 0,
        price: 15000,
        quantity: 8,
        comingSoon: false,
      },
      "blue_S-M": {
        oldPrice: 0,
        price: 16000,
        quantity: 5,
        comingSoon: false,
      },
      "blue_M-L": {
        oldPrice: 0,
        price: 17000,
        quantity: 0,
        comingSoon: true,
      },
      "yellow_XS-S": {
        oldPrice: 0,
        price: 14500,
        quantity: 0,
        comingSoon: false,
      },
      "yellow_S-M": {
        oldPrice: 0,
        price: 15500,
        quantity: 7,
        comingSoon: false,
      },
      "yellow_M-L": {
        oldPrice: 0,
        price: 16500,
        quantity: 2,
        comingSoon: false,
      },
    },
    type: "Шорты",
    material: "Хлопок",
    useType: "Пляж",
  },
  {
    id: "3",
    name: "Bikini set",
    colors: {
      black: {
        name: "Черный",
        value: "#000000",
        images: [25, 26, 27, 28, 29, 30],
      },
      pink: {
        name: "Розовый",
        value: "#FFC0CB",
        images: [31, 32, 33, 34, 35, 36],
      },
    },
    sizes: ["XS-S", "S-M", "M-L"],
    images: {
      25: "/item-1.jpg",
      26: "/item-2.jpg",
      27: "/item-3.jpg",
      28: "/item-4.jpg",
      29: "/item-5.jpg",
      30: "/item-6.jpg",
      31: "/item-7.jpg",
      32: "/item-8.jpg",
      33: "/item-9.jpg",
      34: "/item-10.jpg",
      35: "/item-11.jpg",
      36: "/item-12.jpg",
    },
    vector: {
      "black_XS-S": {
        oldPrice: 25000,
        price: 22000,
        quantity: 6,
        comingSoon: false,
      },
      "black_S-M": {
        oldPrice: 26000,
        price: 23000,
        quantity: 0,
        comingSoon: true,
      },
      "black_M-L": {
        oldPrice: 27000,
        price: 24000,
        quantity: 4,
        comingSoon: false,
      },
      "pink_XS-S": {
        oldPrice: 24000,
        price: 21000,
        quantity: 8,
        comingSoon: false,
      },
      "pink_S-M": {
        oldPrice: 25000,
        price: 22000,
        quantity: 3,
        comingSoon: false,
      },
      "pink_M-L": {
        oldPrice: 26000,
        price: 23000,
        quantity: 0,
        comingSoon: false,
      },
    },
    type: "Комплект бикини",
    material: "Полиэстер",
    useType: "Пляж",
  },
  {
    id: "4",
    name: "Summer dress",
    colors: {
      white: {
        name: "Белый",
        value: "#FFFFFF",
        images: [37, 38, 39, 40, 41, 42],
      },
      floral: {
        name: "Цветочный",
        value: "#FF9E9E",
        images: [43, 44, 45, 46, 47, 48],
      },
    },
    sizes: ["XS-S", "S-M", "M-L"],
    images: {
      37: "/item-1.jpg",
      38: "/item-2.jpg",
      39: "/item-3.jpg",
      40: "/item-4.jpg",
      41: "/item-5.jpg",
      42: "/item-6.jpg",
      43: "/item-7.jpg",
      44: "/item-8.jpg",
      45: "/item-9.jpg",
      46: "/item-10.jpg",
      47: "/item-11.jpg",
      48: "/item-12.jpg",
    },
    vector: {
      "white_XS-S": {
        oldPrice: 35000,
        price: 30000,
        quantity: 5,
        comingSoon: false,
      },
      "white_S-M": {
        oldPrice: 36000,
        price: 31000,
        quantity: 0,
        comingSoon: true,
      },
      "white_M-L": {
        oldPrice: 37000,
        price: 32000,
        quantity: 7,
        comingSoon: false,
      },
      "floral_XS-S": {
        oldPrice: 38000,
        price: 33000,
        quantity: 4,
        comingSoon: false,
      },
      "floral_S-M": {
        oldPrice: 39000,
        price: 34000,
        quantity: 6,
        comingSoon: false,
      },
      "floral_M-L": {
        oldPrice: 40000,
        price: 35000,
        quantity: 0,
        comingSoon: false,
      },
    },
    type: "Платье",
    material: "Лен",
    useType: "Повседневное",
  },
  {
    id: "5",
    name: "Swim trunks",
    colors: {
      navy: {
        name: "Синий",
        value: "#4A66C5",
        images: [49, 50, 51, 52, 53, 54],
      },
      coral: {
        name: "Оранжевый",
        value: "#FDBF81",
        images: [55, 56, 57, 58, 59, 60],
      },
    },
    sizes: ["XS-S", "S-M", "M-L"],
    images: {
      49: "/item-1.jpg",
      50: "/item-2.jpg",
      51: "/item-3.jpg",
      52: "/item-4.jpg",
      53: "/item-5.jpg",
      54: "/item-6.jpg",
      55: "/item-7.jpg",
      56: "/item-8.jpg",
      57: "/item-9.jpg",
      58: "/item-10.jpg",
      59: "/item-11.jpg",
      60: "/item-12.jpg",
    },
    vector: {
      "navy_XS-S": {
        oldPrice: 15000,
        price: 12000,
        quantity: 10,
        comingSoon: false,
      },
      "navy_S-M": {
        oldPrice: 16000,
        price: 13000,
        quantity: 8,
        comingSoon: false,
      },
      "navy_M-L": {
        oldPrice: 17000,
        price: 14000,
        quantity: 0,
        comingSoon: true,
      },
      "coral_XS-S": {
        oldPrice: 15500,
        price: 12500,
        quantity: 6,
        comingSoon: false,
      },
      "coral_S-M": {
        oldPrice: 16500,
        price: 13500,
        quantity: 0,
        comingSoon: false,
      },
      "coral_M-L": {
        oldPrice: 17500,
        price: 14500,
        quantity: 4,
        comingSoon: false,
      },
    },
    type: "Трусы",
    material: "Быстросохнущая ткань",
    useType: "Пляж",
  },
  {
    id: "6",
    name: "Beach cover-up",
    colors: {
      beige: {
        name: "Бежевый",
        value: "#F5F5DC",
        images: [61, 62, 63, 64, 65, 66],
      },
      striped: {
        name: "Полосатый",
        value: "#6B93DD",
        images: [67, 68, 69, 70, 71, 72],
      },
    },
    sizes: ["XS-S", "S-M", "M-L"],
    images: {
      61: "/item-1.jpg",
      62: "/item-2.jpg",
      63: "/item-3.jpg",
      64: "/item-4.jpg",
      65: "/item-5.jpg",
      66: "/item-6.jpg",
      67: "/item-7.jpg",
      68: "/item-8.jpg",
      69: "/item-9.jpg",
      70: "/item-10.jpg",
      71: "/item-11.jpg",
      72: "/item-12.jpg",
    },
    vector: {
      "beige_XS-S": {
        oldPrice: 28000,
        price: 24000,
        quantity: 7,
        comingSoon: false,
      },
      "beige_S-M": {
        oldPrice: 28000,
        price: 24000,
        quantity: 7,
        comingSoon: false,
      },
      "beige_M-L": {
        oldPrice: 28000,
        price: 24000,
        quantity: 7,
        comingSoon: false,
      },
      "striped_XS-S": {
        oldPrice: 29000,
        price: 25000,
        quantity: 0,
        comingSoon: true,
      },
      "striped_S-M": {
        oldPrice: 29000,
        price: 25000,
        quantity: 0,
        comingSoon: true,
      },
      "striped_M-L": {
        oldPrice: 29000,
        price: 25000,
        quantity: 0,
        comingSoon: true,
      },
    },
    type: "Парео",
    material: "Шифон",
    useType: "Пляж",
  },
  {
    id: "7",
    name: "Sports top",
    colors: {
      gray: {
        name: "Серый",
        value: "#808080",
        images: [73, 74, 75, 76, 77, 78],
      },
      purple: {
        name: "Фиолетовый",
        value: "#BA97D6",
        images: [79, 80, 81, 82, 83, 84],
      },
    },
    sizes: ["XS-S", "S-M", "M-L"],
    images: {
      73: "/item-1.jpg",
      74: "/item-2.jpg",
      75: "/item-3.jpg",
      76: "/item-4.jpg",
      77: "/item-5.jpg",
      78: "/item-6.jpg",
      79: "/item-7.jpg",
      80: "/item-8.jpg",
      81: "/item-9.jpg",
      82: "/item-10.jpg",
      83: "/item-11.jpg",
      84: "/item-12.jpg",
    },
    vector: {
      "gray_XS-S": {
        oldPrice: 22000,
        price: 19000,
        quantity: 8,
        comingSoon: false,
      },
      "gray_S-M": {
        oldPrice: 23000,
        price: 20000,
        quantity: 5,
        comingSoon: false,
      },
      "gray_M-L": {
        oldPrice: 24000,
        price: 21000,
        quantity: 0,
        comingSoon: true,
      },
      "purple_XS-S": {
        oldPrice: 22500,
        price: 19500,
        quantity: 6,
        comingSoon: false,
      },
      "purple_S-M": {
        oldPrice: 23500,
        price: 20500,
        quantity: 4,
        comingSoon: false,
      },
      "purple_M-L": {
        oldPrice: 24500,
        price: 21500,
        quantity: 7,
        comingSoon: false,
      },
    },
    type: "Топ",
    material: "Спандекс",
    useType: "Спорт",
  },
  {
    id: "8",
    name: "Board shorts",
    colors: {
      orange: {
        name: "Оранжевый",
        value: "#FDBF81",
        images: [85, 86, 87, 88, 89, 90],
      },
      teal: {
        name: "Бирюзовый",
        value: "#97D6D1",
        images: [91, 92, 93, 94, 95, 96],
      },
    },
    sizes: ["XS-S", "S-M", "M-L"],
    images: {
      85: "/item-1.jpg",
      86: "/item-2.jpg",
      87: "/item-3.jpg",
      88: "/item-4.jpg",
      89: "/item-5.jpg",
      90: "/item-6.jpg",
      91: "/item-7.jpg",
      92: "/item-8.jpg",
      93: "/item-9.jpg",
      94: "/item-10.jpg",
      95: "/item-11.jpg",
      96: "/item-12.jpg",
    },
    vector: {
      "orange_XS-S": {
        oldPrice: 32000,
        price: 28000,
        quantity: 5,
        comingSoon: false,
      },
      "orange_S-M": {
        oldPrice: 33000,
        price: 29000,
        quantity: 0,
        comingSoon: true,
      },
      "orange_M-L": {
        oldPrice: 34000,
        price: 30000,
        quantity: 7,
        comingSoon: false,
      },
      "teal_XS-S": {
        oldPrice: 32500,
        price: 28500,
        quantity: 6,
        comingSoon: false,
      },
      "teal_S-M": {
        oldPrice: 33500,
        price: 29500,
        quantity: 4,
        comingSoon: false,
      },
      "teal_M-L": {
        oldPrice: 34500,
        price: 30500,
        quantity: 0,
        comingSoon: false,
      },
    },
    type: "Шорты",
    material: "Нейлон",
    useType: "Серфинг",
  },
  {
    id: "9",
    name: "Bikini bottom",
    colors: {
      red: {
        name: "Красный",
        value: "#D85959",
        images: [97, 98, 99, 100, 101, 102],
      },
      blue: {
        name: "Голубой",
        value: "#6B93DD",
        images: [103, 104, 105, 106, 107, 108],
      },
    },
    sizes: ["XS-S", "S-M", "M-L"],
    images: {
      97: "/item-1.jpg",
      98: "/item-2.jpg",
      99: "/item-3.jpg",
      100: "/item-4.jpg",
      101: "/item-5.jpg",
      102: "/item-6.jpg",
      103: "/item-7.jpg",
      104: "/item-8.jpg",
      105: "/item-9.jpg",
      106: "/item-10.jpg",
      107: "/item-11.jpg",
      108: "/item-12.jpg",
    },
    vector: {
      "red_XS-S": {
        oldPrice: 12000,
        price: 10000,
        quantity: 9,
        comingSoon: false,
      },
      "red_S-M": {
        oldPrice: 12500,
        price: 10500,
        quantity: 6,
        comingSoon: false,
      },
      "red_M-L": {
        oldPrice: 13000,
        price: 11000,
        quantity: 0,
        comingSoon: true,
      },
      "blue_XS-S": {
        oldPrice: 12200,
        price: 10200,
        quantity: 7,
        comingSoon: false,
      },
      "blue_S-M": {
        oldPrice: 12700,
        price: 10700,
        quantity: 5,
        comingSoon: false,
      },
      "blue_M-L": {
        oldPrice: 13200,
        price: 11200,
        quantity: 8,
        comingSoon: false,
      },
    },
    type: "Трусы",
    material: "Полиамид",
    useType: "Пляж",
  },
  {
    id: "10",
    name: "Rash guard",
    colors: {
      black: {
        name: "Черный",
        value: "#000000",
        images: [109, 110, 111, 112, 113, 114],
      },
      "neon green": {
        name: "Неоново-зеленый",
        value: "#39FF14",
        images: [115, 116, 117, 118, 119, 120],
      },
    },
    sizes: ["XS-S", "S-M", "M-L"],
    images: {
      109: "/item-1.jpg",
      110: "/item-2.jpg",
      111: "/item-3.jpg",
      112: "/item-4.jpg",
      113: "/item-5.jpg",
      114: "/item-6.jpg",
      115: "/item-7.jpg",
      116: "/item-8.jpg",
      117: "/item-9.jpg",
      118: "/item-10.jpg",
      119: "/item-11.jpg",
      120: "/item-12.jpg",
    },
    vector: {
      "black_XS-S": {
        oldPrice: 45000,
        price: 40000,
        quantity: 6,
        comingSoon: false,
      },
      "black_S-M": {
        oldPrice: 46000,
        price: 41000,
        quantity: 8,
        comingSoon: false,
      },
      "black_M-L": {
        oldPrice: 47000,
        price: 42000,
        quantity: 0,
        comingSoon: true,
      },
      "neon green_XS-S": {
        oldPrice: 45500,
        price: 40500,
        quantity: 7,
        comingSoon: false,
      },
      "neon green_S-M": {
        oldPrice: 46500,
        price: 41500,
        quantity: 5,
        comingSoon: false,
      },
      "neon green_M-L": {
        oldPrice: 47500,
        price: 42500,
        quantity: 9,
        comingSoon: false,
      },
    },
    type: "Футболка",
    material: "Лайкра",
    useType: "Серфинг",
  },
  {
    id: "11",
    name: "Beach skirt",
    colors: {
      white: {
        name: "Белый",
        value: "#FFFFFF",
        images: [121, 122, 123, 124, 125, 126],
      },
      navy: {
        name: "Синий",
        value: "#4A66C5",
        images: [127, 128, 129, 130, 131, 132],
      },
    },
    sizes: ["XS-S", "S-M", "M-L"],
    images: {
      121: "/item-1.jpg",
      122: "/item-2.jpg",
      123: "/item-3.jpg",
      124: "/item-4.jpg",
      125: "/item-5.jpg",
      126: "/item-6.jpg",
      127: "/item-7.jpg",
      128: "/item-8.jpg",
      129: "/item-9.jpg",
      130: "/item-10.jpg",
      131: "/item-11.jpg",
      132: "/item-12.jpg",
    },
    vector: {
      "white_XS-S": {
        oldPrice: 28000,
        price: 24000,
        quantity: 8,
        comingSoon: false,
      },
      "white_S-M": {
        oldPrice: 28000,
        price: 24000,
        quantity: 8,
        comingSoon: false,
      },
      "white_M-L": {
        oldPrice: 29000,
        price: 25000,
        quantity: 0,
        comingSoon: true,
      },
      "navy_XS-S": {
        oldPrice: 28500,
        price: 24500,
        quantity: 6,
        comingSoon: false,
      },
      "navy_S-M": {
        oldPrice: 28500,
        price: 24500,
        quantity: 6,
        comingSoon: false,
      },
      "navy_M-L": {
        oldPrice: 29500,
        price: 25500,
        quantity: 5,
        comingSoon: false,
      },
    },
    type: "Юбка",
    material: "Хлопок",
    useType: "Пляж",
  },
  {
    id: "12",
    name: "Swim briefs",
    colors: {
      black: {
        name: "Черный",
        value: "#000000",
        images: [133, 134, 135, 136, 137, 138],
      },
      yellow: {
        name: "Желтый",
        value: "#F2D06C",
        images: [139, 140, 141, 142, 143, 144],
      },
    },
    sizes: ["XS-S", "S-M", "M-L"],
    images: {
      133: "/item-1.jpg",
      134: "/item-2.jpg",
      135: "/item-3.jpg",
      136: "/item-4.jpg",
      137: "/item-5.jpg",
      138: "/item-6.jpg",
      139: "/item-7.jpg",
      140: "/item-8.jpg",
      141: "/item-9.jpg",
      142: "/item-10.jpg",
      143: "/item-11.jpg",
      144: "/item-12.jpg",
    },
    vector: {
      "black_XS-S": {
        oldPrice: 26000,
        price: 24000,
        quantity: 9,
        comingSoon: false,
      },
      "black_S-M": {
        oldPrice: 22000,
        price: 21000,
        quantity: 4,
        comingSoon: false,
      },
      "black_M-L": {
        oldPrice: 29000,
        price: 25000,
        quantity: 0,
        comingSoon: true,
      },
      "yellow_XS-S": {
        oldPrice: 21500,
        price: 20500,
        quantity: 2,
        comingSoon: false,
      },
      "yellow_S-M": {
        oldPrice: 28500,
        price: 24500,
        quantity: 6,
        comingSoon: false,
      },
      "yellow_M-L": {
        oldPrice: 28500,
        price: 24500,
        quantity: 7,
        comingSoon: false,
      },
    },
    type: "Трусы",
    material: "Полиэстер",
    useType: "Пляж",
  },
]

export const useCatalogStore = defineStore("catalog", () => {
  const desktopStrokeCardCount = ref("4")
  const mobileStrokeCardCount = ref("2")
  const currentVisibleCardCount = ref(12)
  const items = ref<Item[]>(temporaryItems)
  const pendingFilters = ref<SortAndFilter>({
    types: [],
    colors: [],
    sizes: [],
    maxPrice: null,
    sortType: null,
    withDiscount: null,
    inStock: null,
    materials: [],
    useTypes: []
  })
  
  const activeFilters = ref<SortAndFilter>({ ...pendingFilters.value })
  
  const filters = computed(() => {
    return {
      types: [...new Set(items.value.map(item => item.type))],
      colors: () => {
        const colorsSet = new Set()
        const colorsArray: { code: string, name: string, value: string }[] = []
        items.value.forEach(item => {
          Object.entries(item.colors).forEach(([code, colorData]) => {
            const colorKey = `${code}-${colorData.value}`
            if (!colorsSet.has(colorKey)) {
              colorsSet.add(colorKey)
              colorsArray.push({
                code: code,
                name: colorData.name,
                value: colorData.value
              })
            }
          })
        })
        return colorsArray
      },
      sizes: [...new Set(items.value.flatMap(item => item.sizes))],
      maxPrices: () => {
        const allPrices: number[] = []
        items.value.forEach(item => {
          Object.values(item.vector).forEach(variant => {
            allPrices.push(variant.price)
          })
        })
        const uniquePrices = [...new Set(allPrices)].sort((a, b) => a - b)
        const minPrice = uniquePrices[0]
        const maxPrice = uniquePrices[uniquePrices.length - 1]
        const ranges: { label: string; value: number }[] = []
        if (minPrice < 15000) ranges.push({ label: 'до 15000', value: 15000 })
        if (maxPrice > 20000) ranges.push({ label: 'до 20000', value: 20000 })
        if (maxPrice > 25000) ranges.push({ label: 'до 25000', value: 25000 })
        if (maxPrice > 30000) ranges.push({ label: 'до 30000', value: 30000 })
        if (maxPrice > 35000) ranges.push({ label: 'до 35000', value: 35000 })
        if (maxPrice > 40000) ranges.push({ label: 'до 40000', value: 40000 })
        if (maxPrice > 45000) ranges.push({ label: 'до 45000', value: 45000 })
        return ranges.filter(range => range.value <= maxPrice)
      },
      inStock: ['В наличии'],
      withDiscount: ['Со скидкой'],
      sortTypes: ['По умолчанию', 'По убыванию цены', 'По возрастанию цены'],
      materials: [...new Set(items.value.map(item => item.material))],
      useTypes: [...new Set(items.value.map(item => item.useType))],
    }
  })
  
  const filteredItems = computed(() => {
    let filtered = [...items.value]
    const f = activeFilters.value
    if (f.types.length > 0) {
      filtered = filtered.filter(item => f.types.includes(item.type))
    }
    if (f.colors.length > 0) {
      filtered = filtered.filter(item =>
        Object.keys(item.colors).some(colorCode =>
          f.colors.some(c => c.code === colorCode)
        )
      )
    }
    if (f.sizes.length > 0) {
      filtered = filtered.filter(item =>
        item.sizes.some(size => f.sizes.includes(size))
      )
    }
    if (f.maxPrice !== null) {
      filtered = filtered.filter(item =>
        Object.values(item.vector).some(variant =>
          variant.price <= f.maxPrice!
        )
      )
    }
    if (f.withDiscount) {
      filtered = filtered.filter(item =>
        Object.values(item.vector).some(variant =>
          variant.oldPrice > 0 && variant.oldPrice > variant.price
        )
      )
    }
    if (f.inStock) {
      filtered = filtered.filter(item =>
        Object.values(item.vector).some(variant => variant.quantity > 0)
      )
    }
    if (f.materials.length > 0) {
      filtered = filtered.filter(item => f.materials.includes(item.material))
    }
    if (f.useTypes.length > 0) {
      filtered = filtered.filter(item => f.useTypes.includes(item.useType))
    }
    if (f.sortType) {
      switch (f.sortType) {
        case 'По убыванию цены':
          filtered.sort((a, b) => {
            const firstPriceA = Object.values(a.vector)[0]?.price ?? 0
            const firstPriceB = Object.values(b.vector)[0]?.price ?? 0
            return firstPriceB - firstPriceA
          })
          break
        case 'По возрастанию цены':
          filtered.sort((a, b) => {
            const firstPriceA = Object.values(a.vector)[0]?.price ?? 0
            const firstPriceB = Object.values(b.vector)[0]?.price ?? 0
            return firstPriceA - firstPriceB
          })
          break
      }
    }
    return filtered
  })
  
  
  
  const reset = () => {
    activeFilters.value = {
      types: [],
      colors: [],
      sizes: [],
      maxPrice: null,
      sortType: null,
      withDiscount: null,
      inStock: null,
      materials: [],
      useTypes: []
    }
    pendingFilters.value = {
      types: [],
      colors: [],
      sizes: [],
      maxPrice: null,
      sortType: null,
      withDiscount: null,
      inStock: null,
      materials: [],
      useTypes: []
    }
    currentVisibleCardCount.value = 12
  }
  
  const applyFilters = () => {
    activeFilters.value = JSON.parse(JSON.stringify(pendingFilters.value))
    currentVisibleCardCount.value = 12
  }
  
  const getItemById = (id: string) => {
    return items.value.find((item) => item.id === id)
  }
  
  watch(filteredItems, () => {
    currentVisibleCardCount.value = 12
  })
  
  return {
    desktopStrokeCardCount,
    mobileStrokeCardCount,
    currentVisibleCardCount,
    pendingFilters,
    items,
    filters,
    filteredItems,
    getItemById,
    reset,
    applyFilters,
  }
})
