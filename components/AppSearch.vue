<script setup lang="ts">
interface SearchResult {
  url: string
  value: string
  label: string
  class: string
}

const isOpen = ref(false)
const searchText = ref("")
const searchResults = ref<SearchResult[]>([])
const loading = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const emit = defineEmits<{
	searchToggle: [isOpen: boolean]
}>()

const debounceSearch = (text: string) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    if (text.trim().length === 0) {
      searchResults.value = []
      return
    }
    await performSearch(text)
  }, 300)
}

const performSearch = async (text: string) => {
  loading.value = true
  try {
    const data = await $fetch<SearchResult[]>(`/api/search?text=${encodeURIComponent(text)}`, {
      baseURL: "https://back.casaalmare.com",
      method: "GET",
    })
    searchResults.value = data || []
  } catch (error) {
    console.error("Ошибка поиска:", error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

const toggleSearch = () => {
  isOpen.value = !isOpen.value
	emit('searchToggle', isOpen.value)
}

const handleClickOutside = (event: MouseEvent) => {
  if (isOpen.value && inputRef.value && !inputRef.value.contains(event.target as Node)) {
    closeSearch()
  }
}

const closeSearch = () => {
  isOpen.value = false
	emit('searchToggle', false)
  searchText.value = ""
  searchResults.value = []
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeSearch()
  }
}

const handleSubmit = () => {
  if (searchText.value.trim()) {
    navigateTo(`/catalog/?query=${searchText.value}`)
    closeSearch()
  }
}

watch(searchText, debounceSearch)

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
  document.addEventListener("keydown", handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside)
  document.removeEventListener("keydown", handleKeydown)
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <div>
    <button
      class="hover:text-[#F3A454] cursor-pointer text-xs sm:text-sm font-[Manrope] text-[#211D1D] focus:outline-none"
      @click.stop="toggleSearch"
    >
      Поиск
    </button>

    <div
      v-if="isOpen"
      class="fixed inset-0 z-50"
    >
      <div
        class="max-w-[590px] w-full z-50 fixed top-[32px] sm:top-[62px] right-0 bg-[#FFFFFA] p-2 border-[0.7px] border-[#211D1D] rounded-bl-lg rounded-br-2xl"
      >
        <div class="relative mb-2.5 flex border-b-[0.7px] border-[#211D1D]">
          <input
            ref="inputRef"
            v-model="searchText"
            type="text"
            placeholder="Введите запрос, например 'Лиф'..."
            class="w-full py-2 text-[#211D1D] font-[Manrope] text-base focus:outline-none"
            @keydown.enter="handleSubmit"
          >
          <button
            class="cursor-pointer"
            @click="handleSubmit"
          >
            <NuxtImg
              src="/search.svg"
              width="24"
              height="24"
            />
          </button>
        </div>
        <ul
          v-if="searchResults.length > 0"
          class="max-h-64 overflow-y-auto"
        >
          <li
            v-for="(result, index) in searchResults"
            :key="index"
            :class="result.class"
          >
            <NuxtLink
              v-if="result.value !== 'Показать всё'"
              :to="result.url"
              class="block px-2 py-1 hover:bg-black/10 rounded text-[#211D1D] text-sm font-[Manrope]"
              @click="closeSearch"
            >
              {{ result.label }}
            </NuxtLink>
            <NuxtLink
              v-else
              :to="result.url"
              class="block px-2 py-1 hover:bg-black/10 rounded text-[#211D1D] text-sm font-[Manrope]"
              @click="closeSearch"
            >
              {{ result.label }}
            </NuxtLink>
          </li>
        </ul>
        <p
          v-else-if="!loading && searchText.trim()"
          class="text-[#211D1D]/60 text-sm font-[Manrope] text-center py-1"
        >
          Ничего не найдено. Попробуйте другой запрос.
        </p>
        <p
          v-else-if="!searchText.trim()"
          class="text-[#211D1D]/60 text-sm font-[Manrope] text-center py-1"
        >
          Начните вводить текст для поиска...
        </p>
      </div>
    </div>
  </div>
</template>
