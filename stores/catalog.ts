type SortAndFilter = {
	type: string | null,
	color: string | null,
	top: string | null,
	bottom: string | null,
	pantsType: string | null,
	price: string | null,
	priceLimit: string | null,
	material: string | null,
	useType: string | null,
}

type Item = {
	id: string
	name: string
	colors: {
		[color: string]: number[]
	}
	sizes: string[]
	images: {
		[id: number]: string
	},
	vector: {
		[vector: string]: {
			oldPrice: number,
			price: number,
			quantity: number,
			comingSoon: boolean,
		}
	}
	type: string
	material: string
	useType: string
	pantsType?: string
}

const temporaryItems: Item[] = [
	{
		id: '1',
		name: 'Cropped swim top',
		colors: {
			'red': [1, 2, 3, 4, 5, 6],
			'green': [7, 8, 9, 10, 11, 12]
		},
		sizes: ['xs-s', 's-m', 'm-l'],
		images: {
			1: '/item-1.jpg',
			2: '/item-2.jpg',
			3: '/item-3.jpg',
			4: '/item-4.jpg',
			5: '/item-5.jpg',
			6: '/item-6.jpg',
			7: '/item-7.jpg',
			8: '/item-8.jpg',
			9: '/item-9.jpg',
			10: '/item-10.jpg',
			11: '/item-11.jpg',
			12: '/item-12.jpg'
		},
		vector: {
			'red_xs-s': {
				oldPrice: 21000,
				price: 20000,
				quantity: 10,
				comingSoon: false,
			},
			'red_s-m': {
				oldPrice: 10000,
				price: 9000,
				quantity: 0,
				comingSoon: true,
			},
			'red_m-l': {
				oldPrice: 15000,
				price: 12000,
				quantity: 0,
				comingSoon: false,
			},
			'green_xs-s': {
				oldPrice: 22000,
				price: 21000,
				quantity: 12,
				comingSoon: false,
			},
			'green_s-m': {
				oldPrice: 20000,
				price: 19000,
				quantity: 4,
				comingSoon: false,
			},
			'green_m-l': {
				oldPrice: 16000,
				price: 11000,
				quantity: 0,
				comingSoon: true,
			},
		},
		type: 'Топ',
		material: 'Вязаные',
		useType: 'Пляж',
	},
	{
		id: '2',
		name: 'Beach shorts',
		colors: {
			'blue': [13, 14, 15, 16, 17, 18],
			'yellow': [19, 20, 21, 22, 23, 24]
		},
		sizes: ['xs-s', 's-m', 'm-l'],
		images: {
			13: '/item-1.jpg',
			14: '/item-2.jpg',
			15: '/item-3.jpg',
			16: '/item-4.jpg',
			17: '/item-5.jpg',
			18: '/item-6.jpg',
			19: '/item-7.jpg',
			20: '/item-8.jpg',
			21: '/item-9.jpg',
			22: '/item-10.jpg',
			23: '/item-11.jpg',
			24: '/item-12.jpg'
		},
		vector: {
			'blue_xs-s': {
				oldPrice: 18000,
				price: 15000,
				quantity: 8,
				comingSoon: false,
			},
			'blue_s-m': {
				oldPrice: 19000,
				price: 16000,
				quantity: 5,
				comingSoon: false,
			},
			'blue_m-l': {
				oldPrice: 20000,
				price: 17000,
				quantity: 0,
				comingSoon: true,
			},
			'yellow_xs-s': {
				oldPrice: 17000,
				price: 14500,
				quantity: 0,
				comingSoon: false,
			},
			'yellow_s-m': {
				oldPrice: 18000,
				price: 15500,
				quantity: 7,
				comingSoon: false,
			},
			'yellow_m-l': {
				oldPrice: 19000,
				price: 16500,
				quantity: 2,
				comingSoon: false,
			},
		},
		type: 'Шорты',
		material: 'Хлопок',
		useType: 'Пляж',
		pantsType: 'Шорты'
	},
	{
		id: '3',
		name: 'Bikini set',
		colors: {
			'black': [25, 26, 27, 28, 29, 30],
			'pink': [31, 32, 33, 34, 35, 36]
		},
		sizes: ['xs-s', 's-m', 'm-l'],
		images: {
			25: '/item-1.jpg',
			26: '/item-2.jpg',
			27: '/item-3.jpg',
			28: '/item-4.jpg',
			29: '/item-5.jpg',
			30: '/item-6.jpg',
			31: '/item-7.jpg',
			32: '/item-8.jpg',
			33: '/item-9.jpg',
			34: '/item-10.jpg',
			35: '/item-11.jpg',
			36: '/item-12.jpg'
		},
		vector: {
			'black_xs-s': {
				oldPrice: 25000,
				price: 22000,
				quantity: 6,
				comingSoon: false,
			},
			'black_s-m': {
				oldPrice: 26000,
				price: 23000,
				quantity: 0,
				comingSoon: true,
			},
			'black_m-l': {
				oldPrice: 27000,
				price: 24000,
				quantity: 4,
				comingSoon: false,
			},
			'pink_xs-s': {
				oldPrice: 24000,
				price: 21000,
				quantity: 8,
				comingSoon: false,
			},
			'pink_s-m': {
				oldPrice: 25000,
				price: 22000,
				quantity: 3,
				comingSoon: false,
			},
			'pink_m-l': {
				oldPrice: 26000,
				price: 23000,
				quantity: 0,
				comingSoon: false,
			},
		},
		type: 'Комплект',
		material: 'Полиэстер',
		useType: 'Пляж',
		pantsType: 'Бикини'
	},
	{
		id: '4',
		name: 'Summer dress',
		colors: {
			'white': [37, 38, 39, 40, 41, 42],
			'floral': [43, 44, 45, 46, 47, 48]
		},
		sizes: ['xs-s', 's-m', 'm-l'],
		images: {
			37: '/item-1.jpg',
			38: '/item-2.jpg',
			39: '/item-3.jpg',
			40: '/item-4.jpg',
			41: '/item-5.jpg',
			42: '/item-6.jpg',
			43: '/item-7.jpg',
			44: '/item-8.jpg',
			45: '/item-9.jpg',
			46: '/item-10.jpg',
			47: '/item-11.jpg',
			48: '/item-12.jpg'
		},
		vector: {
			'white_xs-s': {
				oldPrice: 35000,
				price: 30000,
				quantity: 5,
				comingSoon: false,
			},
			'white_s-m': {
				oldPrice: 36000,
				price: 31000,
				quantity: 0,
				comingSoon: true,
			},
			'white_m-l': {
				oldPrice: 37000,
				price: 32000,
				quantity: 7,
				comingSoon: false,
			},
			'floral_xs-s': {
				oldPrice: 38000,
				price: 33000,
				quantity: 4,
				comingSoon: false,
			},
			'floral_s-m': {
				oldPrice: 39000,
				price: 34000,
				quantity: 6,
				comingSoon: false,
			},
			'floral_m-l': {
				oldPrice: 40000,
				price: 35000,
				quantity: 0,
				comingSoon: false,
			},
		},
		type: 'Платье',
		material: 'Лен',
		useType: 'Повседневное'
	},
	{
		id: '5',
		name: 'Swim trunks',
		colors: {
			'navy': [49, 50, 51, 52, 53, 54],
			'coral': [55, 56, 57, 58, 59, 60]
		},
		sizes: ['xs-s', 's-m', 'm-l'],
		images: {
			49: '/item-1.jpg',
			50: '/item-2.jpg',
			51: '/item-3.jpg',
			52: '/item-4.jpg',
			53: '/item-5.jpg',
			54: '/item-6.jpg',
			55: '/item-7.jpg',
			56: '/item-8.jpg',
			57: '/item-9.jpg',
			58: '/item-10.jpg',
			59: '/item-11.jpg',
			60: '/item-12.jpg'
		},
		vector: {
			'navy_xs-s': {
				oldPrice: 15000,
				price: 12000,
				quantity: 10,
				comingSoon: false,
			},
			'navy_s-m': {
				oldPrice: 16000,
				price: 13000,
				quantity: 8,
				comingSoon: false,
			},
			'navy_m-l': {
				oldPrice: 17000,
				price: 14000,
				quantity: 0,
				comingSoon: true,
			},
			'coral_xs-s': {
				oldPrice: 15500,
				price: 12500,
				quantity: 6,
				comingSoon: false,
			},
			'coral_s-m': {
				oldPrice: 16500,
				price: 13500,
				quantity: 0,
				comingSoon: false,
			},
			'coral_m-l': {
				oldPrice: 17500,
				price: 14500,
				quantity: 4,
				comingSoon: false,
			},
		},
		type: 'Трусы',
		material: 'Быстросохнущая ткань',
		useType: 'Пляж',
		pantsType: 'Плавки'
	},
	{
		id: '6',
		name: 'Beach cover-up',
		colors: {
			'beige': [61, 62, 63, 64, 65, 66],
			'striped': [67, 68, 69, 70, 71, 72]
		},
		sizes: ['xs-s', 's-m', 'm-l'],
		images: {
			61: '/item-1.jpg',
			62: '/item-2.jpg',
			63: '/item-3.jpg',
			64: '/item-4.jpg',
			65: '/item-5.jpg',
			66: '/item-6.jpg',
			67: '/item-7.jpg',
			68: '/item-8.jpg',
			69: '/item-9.jpg',
			70: '/item-10.jpg',
			71: '/item-11.jpg',
			72: '/item-12.jpg'
		},
		vector: {
			'beige_xs-s': {
				oldPrice: 28000,
				price: 24000,
				quantity: 7,
				comingSoon: false,
			},
			'beige_s-m': {
				oldPrice: 28000,
				price: 24000,
				quantity: 7,
				comingSoon: false,
			},
			'beige_m-l': {
				oldPrice: 28000,
				price: 24000,
				quantity: 7,
				comingSoon: false,
			},
			'striped_xs-s': {
				oldPrice: 29000,
				price: 25000,
				quantity: 0,
				comingSoon: true,
			},
			'striped_s-m': {
				oldPrice: 29000,
				price: 25000,
				quantity: 0,
				comingSoon: true,
			},
			'striped_m-l': {
				oldPrice: 29000,
				price: 25000,
				quantity: 0,
				comingSoon: true,
			},
		},
		type: 'Парео',
		material: 'Шифон',
		useType: 'Пляж'
	},
	{
		id: '7',
		name: 'Sports top',
		colors: {
			'gray': [73, 74, 75, 76, 77, 78],
			'purple': [79, 80, 81, 82, 83, 84]
		},
		sizes: ['xs-s', 's-m', 'm-l'],
		images: {
			73: '/item-1.jpg',
			74: '/item-2.jpg',
			75: '/item-3.jpg',
			76: '/item-4.jpg',
			77: '/item-5.jpg',
			78: '/item-6.jpg',
			79: '/item-7.jpg',
			80: '/item-8.jpg',
			81: '/item-9.jpg',
			82: '/item-10.jpg',
			83: '/item-11.jpg',
			84: '/item-12.jpg'
		},
		vector: {
			'gray_xs-s': {
				oldPrice: 22000,
				price: 19000,
				quantity: 8,
				comingSoon: false,
			},
			'gray_s-m': {
				oldPrice: 23000,
				price: 20000,
				quantity: 5,
				comingSoon: false,
			},
			'gray_m-l': {
				oldPrice: 24000,
				price: 21000,
				quantity: 0,
				comingSoon: true,
			},
			'purple_xs-s': {
				oldPrice: 22500,
				price: 19500,
				quantity: 6,
				comingSoon: false,
			},
			'purple_s-m': {
				oldPrice: 23500,
				price: 20500,
				quantity: 4,
				comingSoon: false,
			},
			'purple_m-l': {
				oldPrice: 24500,
				price: 21500,
				quantity: 7,
				comingSoon: false,
			},
		},
		type: 'Топ',
		material: 'Спандекс',
		useType: 'Спорт'
	},
	{
		id: '8',
		name: 'Board shorts',
		colors: {
			'orange': [85, 86, 87, 88, 89, 90],
			'teal': [91, 92, 93, 94, 95, 96]
		},
		sizes: ['xs-s', 's-m', 'm-l'],
		images: {
			85: '/item-1.jpg',
			86: '/item-2.jpg',
			87: '/item-3.jpg',
			88: '/item-4.jpg',
			89: '/item-5.jpg',
			90: '/item-6.jpg',
			91: '/item-7.jpg',
			92: '/item-8.jpg',
			93: '/item-9.jpg',
			94: '/item-10.jpg',
			95: '/item-11.jpg',
			96: '/item-12.jpg'
		},
		vector: {
			'orange_xs-s': {
				oldPrice: 32000,
				price: 28000,
				quantity: 5,
				comingSoon: false,
			},
			'orange_s-m': {
				oldPrice: 33000,
				price: 29000,
				quantity: 0,
				comingSoon: true,
			},
			'orange_m-l': {
				oldPrice: 34000,
				price: 30000,
				quantity: 7,
				comingSoon: false,
			},
			'teal_xs-s': {
				oldPrice: 32500,
				price: 28500,
				quantity: 6,
				comingSoon: false,
			},
			'teal_s-m': {
				oldPrice: 33500,
				price: 29500,
				quantity: 4,
				comingSoon: false,
			},
			'teal_m-l': {
				oldPrice: 34500,
				price: 30500,
				quantity: 0,
				comingSoon: false,
			},
		},
		type: 'Шорты',
		material: 'Нейлон',
		useType: 'Серфинг',
		pantsType: 'Бермуды'
	},
	{
		id: '9',
		name: 'Bikini bottom',
		colors: {
			'red': [97, 98, 99, 100, 101, 102],
			'blue': [103, 104, 105, 106, 107, 108]
		},
		sizes: ['xs-s', 's-m', 'm-l'],
		images: {
			97: '/item-1.jpg',
			98: '/item-2.jpg',
			99: '/item-3.jpg',
			100: '/item-4.jpg',
			101: '/item-5.jpg',
			102: '/item-6.jpg',
			103: '/item-7.jpg',
			104: '/item-8.jpg',
			105: '/item-9.jpg',
			106: '/item-10.jpg',
			107: '/item-11.jpg',
			108: '/item-12.jpg'
		},
		vector: {
			'red_xs-s': {
				oldPrice: 12000,
				price: 10000,
				quantity: 9,
				comingSoon: false,
			},
			'red_s-m': {
				oldPrice: 12500,
				price: 10500,
				quantity: 6,
				comingSoon: false,
			},
			'red_m-l': {
				oldPrice: 13000,
				price: 11000,
				quantity: 0,
				comingSoon: true,
			},
			'blue_xs-s': {
				oldPrice: 12200,
				price: 10200,
				quantity: 7,
				comingSoon: false,
			},
			'blue_s-m': {
				oldPrice: 12700,
				price: 10700,
				quantity: 5,
				comingSoon: false,
			},
			'blue_m-l': {
				oldPrice: 13200,
				price: 11200,
				quantity: 8,
				comingSoon: false,
			},
		},
		type: 'Трусы',
		material: 'Полиамид',
		useType: 'Пляж',
		pantsType: 'Бикини'
	},
	{
		id: '10',
		name: 'Rash guard',
		colors: {
			'black': [109, 110, 111, 112, 113, 114],
			'neon green': [115, 116, 117, 118, 119, 120]
		},
		sizes: ['xs-s', 's-m', 'm-l'],
		images: {
			109: '/item-1.jpg',
			110: '/item-2.jpg',
			111: '/item-3.jpg',
			112: '/item-4.jpg',
			113: '/item-5.jpg',
			114: '/item-6.jpg',
			115: '/item-7.jpg',
			116: '/item-8.jpg',
			117: '/item-9.jpg',
			118: '/item-10.jpg',
			119: '/item-11.jpg',
			120: '/item-12.jpg'
		},
		vector: {
			'black_xs-s': {
				oldPrice: 45000,
				price: 40000,
				quantity: 6,
				comingSoon: false,
			},
			'black_s-m': {
				oldPrice: 46000,
				price: 41000,
				quantity: 8,
				comingSoon: false,
			},
			'black_m-l': {
				oldPrice: 47000,
				price: 42000,
				quantity: 0,
				comingSoon: true,
			},
			'neon green_xs-s': {
				oldPrice: 45500,
				price: 40500,
				quantity: 7,
				comingSoon: false,
			},
			'neon green_s-m': {
				oldPrice: 46500,
				price: 41500,
				quantity: 5,
				comingSoon: false,
			},
			'neon green_m-l': {
				oldPrice: 47500,
				price: 42500,
				quantity: 9,
				comingSoon: false,
			},
		},
		type: 'Футболка',
		material: 'Лайкра',
		useType: 'Серфинг'
	},
	{
		id: '11',
		name: 'Beach skirt',
		colors: {
			'white': [121, 122, 123, 124, 125, 126],
			'navy': [127, 128, 129, 130, 131, 132]
		},
		sizes: ['xs-s', 's-m', 'm-l'],
		images: {
			121: '/item-1.jpg',
			122: '/item-2.jpg',
			123: '/item-3.jpg',
			124: '/item-4.jpg',
			125: '/item-5.jpg',
			126: '/item-6.jpg',
			127: '/item-7.jpg',
			128: '/item-8.jpg',
			129: '/item-9.jpg',
			130: '/item-10.jpg',
			131: '/item-11.jpg',
			132: '/item-12.jpg'
		},
		vector: {
			'white_xs-s': {
				oldPrice: 28000,
				price: 24000,
				quantity: 8,
				comingSoon: false,
			},
			'white_s-m': {
				oldPrice: 28000,
				price: 24000,
				quantity: 8,
				comingSoon: false,
			},
			'white_m-l': {
				oldPrice: 29000,
				price: 25000,
				quantity: 0,
				comingSoon: true,
			},
			'navy_xs-s': {
				oldPrice: 28500,
				price: 24500,
				quantity: 6,
				comingSoon: false,
			},
			'navy_s-m': {
				oldPrice: 28500,
				price: 24500,
				quantity: 6,
				comingSoon: false,
			},
			'navy_m-l': {
				oldPrice: 29500,
				price: 25500,
				quantity: 5,
				comingSoon: false,
			},
		},
		type: 'Юбка',
		material: 'Хлопок',
		useType: 'Пляж'
	},
	{
		id: '12',
		name: 'Swim briefs',
		colors: {
			'black': [133, 134, 135, 136, 137, 138],
			'yellow': [139, 140, 141, 142, 143, 144]
		},
		sizes: ['xs-s', 's-m', 'm-l'],
		images: {
			133: '/item-1.jpg',
			134: '/item-2.jpg',
			135: '/item-3.jpg',
			136: '/item-4.jpg',
			137: '/item-5.jpg',
			138: '/item-6.jpg',
			139: '/item-7.jpg',
			140: '/item-8.jpg',
			141: '/item-9.jpg',
			142: '/item-10.jpg',
			143: '/item-11.jpg',
			144: '/item-12.jpg',
		},
		vector: {
			'black_xs-s': {
				oldPrice: 26000,
				price: 24000,
				quantity: 9,
				comingSoon: false,
			},
			'black_s-m': {
				oldPrice: 22000,
				price: 21000,
				quantity: 4,
				comingSoon: false,
			},
			'black_m-l': {
				oldPrice: 29000,
				price: 25000,
				quantity: 0,
				comingSoon: true,
			},
			'yellow_xs-s': {
				oldPrice: 21500,
				price: 20500,
				quantity: 2,
				comingSoon: false,
			},
			'yellow_s-m': {
				oldPrice: 28500,
				price: 24500,
				quantity: 6,
				comingSoon: false,
			},
			'yellow_m-l': {
				oldPrice: 28500,
				price: 24500,
				quantity: 7,
				comingSoon: false,
			},
		},
		type: 'Юбка',
		material: 'Хлопок',
		useType: 'Пляж'
	}
]
			
			
export const useCatalogStore = defineStore('catalog', () => {
	const desktopStrokeCardCount = ref('4')
	const mobileStrokeCardCount = ref('2')
	const currentVisibleCardCount = ref(12)
	const sortAndFilter = ref<SortAndFilter>({
		type: null,
		color: null,
		top: null,
		bottom: null,
		pantsType: null,
		price: null,
		priceLimit: null,
		material: null,
		useType: null,
	})
	const items = ref<Item[]>(temporaryItems)
	const filteredItems = computed(() => {
		return items.value.filter((item) => {
			if (sortAndFilter.value.priceLimit) console.log(parseInt(sortAndFilter.value.priceLimit.replace(/[^0-9.-]+/g, "")))
			if (sortAndFilter.value.type && item.type !== sortAndFilter.value.type) return false
			if (sortAndFilter.value.material && item.material !== sortAndFilter.value.material) return false
			if (sortAndFilter.value.useType && item.useType !== sortAndFilter.value.useType) return false
			// if (sortAndFilter.value.color && item.color !== sortAndFilter.value.color) return false
			// if (sortAndFilter.value.priceLimit && item.price > parseInt(sortAndFilter.value.priceLimit.replace(/[^0-9.-]+/g, ""))) return false
			return true
		})
	})
	
	const reset = () => {
		for (const key in sortAndFilter.value) {
			sortAndFilter.value[key as keyof SortAndFilter] = null
		}
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
		sortAndFilter,
		items,
		filteredItems,
		getItemById,
		reset,
	}
})