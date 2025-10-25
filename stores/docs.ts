import { defineStore } from "pinia"
import { ref, computed } from "vue"

interface DocNode {
  id: number
  type: string
  pagetitle: string
  longtitle: string
  description: string
  alias: string
  content: string
  subitems?: Record<string, DocNode>
  [key: string]: any
}

export const useDocsStore = defineStore("docs", () => {
  const rawState = ref<{
    tree: { data: { docs: DocNode } } | null
    loading: boolean
    error: string | null
  }>({
    tree: null,
    loading: false,
    error: null,
  })

  const tree = computed(() => rawState.value.tree)
  const loading = computed(() => rawState.value.loading)
  const error = computed(() => rawState.value.error)

  const fetchTree = async () => {
    rawState.value.loading = true
    rawState.value.error = null
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await $fetch<{ data: { docs: DocNode } }>("https://back.casaalmare.com/api/getdocTree", {
        signal: controller.signal,
      })
      rawState.value.tree = response
    } catch (err: any) {
      if (err.name === "AbortError") {
        rawState.value.error = "Таймаут загрузки, попробуйте позже"
      } else {
        rawState.value.error = `Ошибка: ${err.message}`
      }
      console.error("Fetch error:", err)
    } finally {
      clearTimeout(timeoutId)
      rawState.value.loading = false
    }
  }

  const getDocBySlug = (slug: string): DocNode | null => {
    if (!tree.value?.data?.docs?.subitems) return null
    return findDocByAlias(Object.values(tree.value.data.docs.subitems), slug)
  }

  const findDocByAlias = (nodes: DocNode[], slug: string): DocNode | null => {
    for (const node of nodes) {
      if (node.alias === slug) {
        return node
      }
      if (node.subitems) {
        const found = findDocByAlias(Object.values(node.subitems), slug)
        if (found) return found
      }
    }
    return null
  }

  return {
    tree,
    loading,
    error,
    fetchTree,
    getDocBySlug,
  }
})
