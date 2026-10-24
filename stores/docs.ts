import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { DocNode, DocTree } from "~/types"

export const useDocsStore = defineStore("docs", () => {
  const rawState = ref<{
    tree: DocTree | null
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

  let loadingPromise: Promise<void> | null = null

  // Облегчённое дерево документов (без content/metatags) — для меню и списков.
  // Полные документы страницы получают через useContentNode/useContentDoc.
  const fetchTree = (force = false): Promise<void> => {
    if (rawState.value.tree && !force) return Promise.resolve()
    if (loadingPromise) return loadingPromise

    rawState.value.loading = true
    rawState.value.error = null
    loadingPromise = $fetch<DocTree>("/api/content/tree", { timeout: 10000 })
      .then((response) => {
        rawState.value.tree = response
      })
      .catch((err) => {
        if (err instanceof Error && (err.name === "AbortError" || err.name === "TimeoutError")) {
          rawState.value.error = "Таймаут загрузки, попробуйте позже"
        } else {
          rawState.value.error = `Ошибка: ${err instanceof Error ? err.message : String(err)}`
        }
        console.error("Fetch error:", err)
      })
      .finally(() => {
        rawState.value.loading = false
        loadingPromise = null
      })
    return loadingPromise
  }

  const findDocById = (nodes: Record<string, DocNode> | DocNode[], id: number | string): DocNode | null => {
    const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);
    for (const node of nodesArray) {
      if (Number(node.id) === Number(id)) return node;
      if (node.subitems) {
        const found = findDocById(node.subitems, id);
        if (found) return found;
      }
    }
    return null;
  };

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
    findDocById,
    tree,
    loading,
    error,
    fetchTree,
    getDocBySlug,
  }
})
