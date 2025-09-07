export const useUserStore = defineStore('user', () => {
	const user = ref({
		name: 'user',
		surname: 'user',
		phone: '+375293132144',
		email: 'user@user',
		points: 5000,
		addresses: [],
		certificates: [{ code: '1234567890', sum: 1000 }, { code: '0987654321', sum: 5000 }],
	})
	
	return { user  }
})