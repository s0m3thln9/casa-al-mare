import type { DocNode, DocTree } from "~/types"
import type { Item } from "~/stores/catalog"

// Данные бэкенда кэшируются в памяти Nitro: 60 секунд свежие, дальше отдаются
// устаревшие (stale-while-revalidate), пока в фоне идёт обновление. Так SSR не
// ждёт бэкенд на каждый запрос, а правки в админке видны примерно через минуту.
const CACHE_MAX_AGE = 60

const backendFetch = <T>(path: string, query?: Record<string, string | number>) => {
  const { backendUrl } = useRuntimeConfig()
  return $fetch<T>(path, { baseURL: backendUrl, query, timeout: 15000, retry: 1 })
}

const cacheOptions = (name: string) => ({
  name,
  group: "backend",
  maxAge: CACHE_MAX_AGE,
  swr: true,
})

export const getProducts = defineCachedFunction(
  async (): Promise<Item[]> => {
    const response = await backendFetch<Item[]>("/api/getProducts")
    if (!Array.isArray(response)) throw new Error("getProducts: unexpected response")
    return response
  },
  { ...cacheOptions("products"), getKey: () => "all" },
)

export const getDocTree = defineCachedFunction(
  async (): Promise<DocTree> => {
    const response = await backendFetch<DocTree>("/api/getdocTree")
    if (!response?.data) throw new Error("getdocTree: unexpected response")
    return response
  },
  { ...cacheOptions("doc-tree"), getKey: () => "all" },
)

export const getMainVideo = defineCachedFunction(
  () => backendFetch<unknown>("/api/getMainVideo"),
  { ...cacheOptions("main-video"), getKey: () => "main" },
)

export const getVideoById = defineCachedFunction(
  (id: number) => backendFetch<unknown>("/api/getVideoByID", { id }),
  { ...cacheOptions("video"), getKey: (id: number) => String(id) },
)

export const getBannerConfig = defineCachedFunction(
  () => backendFetch<unknown>("/api/getBannerConfig"),
  { ...cacheOptions("banner-config"), getKey: () => "top" },
)

export const getNuxtLinks = defineCachedFunction(
  async (): Promise<string[]> => {
    const response = await backendFetch<unknown>("/api/getNuxtLinks")
    return Array.isArray(response) ? response.filter((l): l is string => typeof l === "string") : []
  },
  { ...cacheOptions("nuxt-links"), maxAge: 600, getKey: () => "all" },
)

// Поля документа, нужные для списков, меню и карточек.
const LIGHT_DOC_FIELDS = [
  "id",
  "type",
  "pagetitle",
  "alias",
  "template",
  "menuindex",
  "publishedon",
  "createdon",
  "image",
  "activeImage",
  "video",
  "set",
  "parent",
] as const

// Плюс поля для SEO и тела страницы.
const FULL_DOC_FIELDS = [...LIGHT_DOC_FIELDS, "longtitle", "description", "meta_descr", "content", "metatags"] as const

const pick = (node: DocNode, fields: readonly string[]): DocNode => {
  const source = node as unknown as Record<string, unknown>
  const result: Record<string, unknown> = {}
  for (const field of fields) {
    const value = source[field]
    if (value !== undefined && value !== null && value !== "") result[field] = value
  }
  return result as unknown as DocNode
}

const mapSubitems = (
  subitems: Record<string, DocNode> | undefined,
  map: (node: DocNode) => DocNode,
): Record<string, DocNode> | undefined => {
  if (!subitems || typeof subitems !== "object") return undefined
  return Object.fromEntries(Object.entries(subitems).map(([key, child]) => [key, map(child)]))
}

export const lightDoc = (node: DocNode): DocNode => {
  const result = pick(node, LIGHT_DOC_FIELDS)
  const subitems = mapSubitems(node.subitems, lightDoc)
  if (subitems) result.subitems = subitems
  return result
}

export const fullDoc = (node: DocNode): DocNode => pick(node, FULL_DOC_FIELDS)

export const fullDocWithChildren = (node: DocNode, children: "light" | "full"): DocNode => {
  const result = fullDoc(node)
  const subitems = mapSubitems(
    node.subitems,
    children === "full" ? (child) => ({ ...lightDoc(child), ...fullDoc(child) }) : lightDoc,
  )
  if (subitems) result.subitems = subitems
  return result
}

export const lightTree = (tree: DocTree): DocTree => ({
  data: Object.fromEntries(Object.entries(tree.data).map(([key, node]) => [key, lightDoc(node)])) as DocTree["data"],
})

export const findChild = (node: DocNode | undefined, segment: string): DocNode | undefined => {
  if (!node?.subitems) return undefined
  return node.subitems[segment] ?? Object.values(node.subitems).find((child) => child?.alias === segment)
}

export const findDocByAlias = (nodes: Record<string, DocNode> | undefined, alias: string): DocNode | null => {
  if (!nodes) return null
  for (const node of Object.values(nodes)) {
    if (!node || typeof node !== "object") continue
    if (node.alias === alias) return node
    const found = findDocByAlias(node.subitems, alias)
    if (found) return found
  }
  return null
}

// Поля товара, которые нужны только на странице самого товара.
const PRODUCT_DETAIL_FIELDS = ["content", "metatags", "description", "complex", "withItems", "stest", "template"]

export const lightProduct = (item: Item): Item =>
  Object.fromEntries(Object.entries(item).filter(([field]) => !PRODUCT_DETAIL_FIELDS.includes(field))) as unknown as Item
