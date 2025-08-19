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
	color: string
	images: string[]
	sliderImages: string[]
	price: number
	oldPrice: number
	type: string
	material: string
	useType: string
	pantsType?: string
}

const temporaryItems: Item[] = [
	{
		id: '1',
		name: 'Printed bikini top',
		color: 'Оранжевый',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 25000,
		oldPrice: 26000,
		type: "Топ",
		material: "Махра",
		useType: "Пляж"
	},
	{
		id: '2',
		name: 'Striped swimsuit',
		color: 'Голубой',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 28000,
		oldPrice: 30000,
		type: "Купальник",
		material: "В рубчик",
		useType: "Пляж"
	},
	{
		id: '3',
		name: 'Floral bikini set',
		color: 'Фиолетовый',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 32000,
		oldPrice: 35000,
		type: "Купальник",
		material: "Вязаные",
		useType: "Пляж"
	},
	{
		id: '4',
		name: 'Solid one-piece',
		color: 'Зеленый',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 22000,
		oldPrice: 24000,
		type: "Купальник",
		material: "Махра",
		useType: "Пляж"
	},
	{
		id: '5',
		name: 'Tie-dye bikini',
		color: 'Зеленый',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 27000,
		oldPrice: 29000,
		type: "Купальник",
		material: "В рубчик",
		useType: "Пляж"
	},
	{
		id: '6',
		name: 'High-waist bikini',
		color: 'Краасный',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 31000,
		oldPrice: 33000,
		type: "Купальник",
		material: "Вязаные",
		useType: "Пляж"
	},
	{
		id: '7',
		name: 'Sporty swim top',
		color: 'Синий',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 24000,
		oldPrice: 26000,
		type: "Топ",
		material: "В рубчик",
		useType: "Пляж"
	},
	{
		id: '8',
		name: 'Cheeky bikini bottom',
		color: 'Желтый',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 18000,
		oldPrice: 20000,
		type: "Трусы",
		material: "Махра",
		useType: "Пляж",
		pantType: "Бразилиана"
	},
	{
		id: '9',
		name: 'Crochet cover-up',
		color: 'white',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 35000,
		oldPrice: 38000,
		type: "Туника",
		material: "Вязаные",
		useType: "Повседневная одежда"
	},
	{
		id: '10',
		name: 'Mesh swim dress',
		color: 'green',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 42000,
		oldPrice: 45000,
		type: "Купальник",
		material: "Махра",
		useType: "Пляж"
	},
	{
		id: '11',
		name: 'Bandeau bikini',
		color: 'purple',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 23000,
		oldPrice: 25000,
		type: "Купальник",
		material: "В рубчик",
		useType: "Пляж"
	},
	{
		id: '12',
		name: 'Ruffled swimsuit',
		color: 'teal',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 38000,
		oldPrice: 40000,
		type: "Купальник",
		material: "Вязаные",
		useType: "Пляж"
	},
	{
		id: '13',
		name: 'Cut-out one-piece',
		color: 'burgundy',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 41000,
		oldPrice: 44000,
		type: "Купальник",
		material: "Махра",
		useType: "Пляж"
	},
	{
		id: '14',
		name: 'Tropical print bikini',
		color: 'turquoise',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 29000,
		oldPrice: 32000,
		type: "Купальник",
		material: "В рубчик",
		useType: "Пляж"
	},
	{
		id: '15',
		name: 'Halter neck swimsuit',
		color: 'coral',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 34000,
		oldPrice: 36000,
		type: "Купальник",
		material: "Вязаные",
		useType: "Пляж"
	},
	{
		id: '16',
		name: 'Sheer cover-up',
		color: 'beige',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 26000,
		oldPrice: 28000,
		type: "Туника",
		material: "Махра",
		useType: "Повседневная одежда"
	},
	{
		id: '17',
		name: 'Belted swim dress',
		color: 'maroon',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 47000,
		oldPrice: 50000,
		type: "Купальник",
		material: "В рубчик",
		useType: "Пляж"
	},
	{
		id: '18',
		name: 'Off-shoulder swimsuit',
		color: 'mint',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 39000,
		oldPrice: 42000,
		type: "Купальник",
		material: "Вязаные",
		useType: "Пляж"
	},
	{
		id: '19',
		name: 'High-neck bikini',
		color: 'lavender',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 31000,
		oldPrice: 34000,
		type: "Купальник",
		material: "Махра",
		useType: "Пляж"
	},
	{
		id: '20',
		name: 'Side-tie bikini',
		color: 'peach',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 27000,
		oldPrice: 29000,
		type: "Купальник",
		material: "В рубчик",
		useType: "Пляж"
	},
	{
		id: '21',
		name: 'Animal print bikini',
		color: 'leopard',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 33000,
		oldPrice: 36000,
		type: "Купальник",
		material: "Вязаные",
		useType: "Пляж"
	},
	{
		id: '22',
		name: 'Retro high-waist',
		color: 'polka dot',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 36000,
		oldPrice: 39000,
		type: "Купальник",
		material: "Махра",
		useType: "Пляж"
	},
	{
		id: '23',
		name: 'Sporty one-piece',
		color: 'charcoal',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 29000,
		oldPrice: 32000,
		type: "Купальник",
		material: "В рубчик",
		useType: "Пляж"
	},
	{
		id: '24',
		name: 'Cropped swim top',
		color: 'sky blue',
		images: ['/item-1.jpg','/item-2.jpg','/item-3.jpg','/item-4.jpg','/item-5.jpg','/item-6.jpg'],
		sliderImages: ['/item-1.jpg','/item-2.jpg','/item-3.jpg'],
		price: 21000,
		oldPrice: 23000,
		type: "Топ",
		material: "Вязаные",
		useType: "Пляж"
	}
]


export const useCatalogStore = defineStore('catalog', () => {
	const desktopStrokeCardCount = ref<string>('4')
	const mobileStrokeCardCount = ref<string>('2')
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
			if (sortAndFilter.value.color && item.color !== sortAndFilter.value.color) return false
			if (sortAndFilter.value.priceLimit && item.price > parseInt(sortAndFilter.value.priceLimit.replace(/[^0-9.-]+/g, ""))) return false
			return true
		})
	})
	
	const reset = () => {
		for (const key in sortAndFilter.value) {
			sortAndFilter.value[key as keyof SortAndFilter] = null
		}
	}
	
	return {
		desktopStrokeCardCount,
		mobileStrokeCardCount,
		sortAndFilter,
		items,
		filteredItems,
		reset,
	}
})