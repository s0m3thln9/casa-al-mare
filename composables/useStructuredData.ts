import type { Item } from "~/stores/catalog"

export interface Crumb {
  name: string
  /** Путь или абсолютный URL. Относительные пути дополняются siteUrl и слэшем. */
  url?: string
}

/**
 * Фильтрует список товаров так же, как каталог при отрисовке (filteredItems в сторе):
 * по уровням пути и query-параметрам. Вынесено чистой функцией, чтобы строить ItemList
 * микроразметки одинаково на сервере (SSR) и на клиенте из одних и тех же данных.
 */
export function filterCatalogItemsByPath(
  items: Item[],
  path: string,
  query: Record<string, unknown> = {},
): Item[] {
  let filtered = [...items]

  const segments = (path || "")
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter((s) => s.trim() !== "")

  if (segments[0]) {
    filtered = filtered.filter((i) => i.parents?.[0]?.alias === segments[0])
  }

  if (segments[1]) {
    const second = segments[1].split(",").filter((s) => s.trim() !== "")
    if (second.length) {
      filtered = filtered.filter((i) => {
        const alias = i.parents?.[1]?.alias
        return alias ? second.includes(alias) : false
      })
    }
  }

  if (segments[2]) {
    const third = segments[2].split(",").filter((s) => s.trim() !== "")
    if (third.length) {
      filtered = filtered.filter((i) => (i.parents?.[2] ? third.includes(i.parents[2].alias) : false))
    }
  }

  const color = typeof query.color === "string" ? query.color.trim() : ""
  if (color) {
    filtered = filtered.filter((i) => i.keys?.some((k) => k.type === "color" && k.alias === color))
  }

  const material = typeof query.material === "string" ? query.material.trim() : ""
  if (material) {
    const mats = material.split(",").map((m) => m.trim()).filter(Boolean)
    if (mats.length) {
      filtered = filtered.filter((i) => i.keys?.some((k) => k.type === "material" && mats.includes(k.alias)))
    }
  }

  const search = typeof query.query === "string" ? query.query.toLowerCase().trim() : ""
  if (search) {
    filtered = filtered.filter((i) => i.name.toLowerCase().includes(search))
  }

  const sortType = typeof query.sortType === "string" ? query.sortType.trim() : ""
  if (sortType) {
    filtered = [...filtered].sort((a, b) => {
      const pa = parseInt(a.price || "0")
      const pb = parseInt(b.price || "0")
      return sortType === "По убыванию цены" ? pb - pa : pa - pb
    })
  }

  return filtered
}

/**
 * Сериализует объект JSON-LD для вставки в <script type="application/ld+json">.
 * Экранирует "<", чтобы данные не могли закрыть тег раньше времени.
 */
export function jsonLdInnerHtml(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

export function useStructuredData() {
  const config = useRuntimeConfig()
  const siteUrl = ((config.public.siteUrl as string) || "https://casaalmare.com").replace(/\/+$/, "")

  const toAbsolute = (url?: string): string => {
    if (!url) return ""
    if (/^https?:\/\//i.test(url)) return url
    return `${siteUrl}${url.startsWith("/") ? "" : "/"}${url}`
  }

  const withTrailingSlash = (path: string): string => {
    if (/^https?:\/\//i.test(path)) return path
    if (path.includes("?") || path.includes("#")) return path
    return path.endsWith("/") ? path : `${path}/`
  }

  const productUrl = (item: Item): string => `${siteUrl}/product/${item.alias}/`

  // Видеофайлы (.mp4/.webm/.ogv) иногда лежат в images вперемешку с картинками,
  // но в schema.org Product image допустимы только изображения — отсекаем видео.
  const isImageSrc = (src: string): boolean =>
    !!src && !/\.(mp4|webm|ogv|ogg|mov|m4v)(\?|#|$)/i.test(src)

  const productImages = (item: Item): string[] =>
    Object.values(item.images || {})
      .filter(isImageSrc)
      .map((src) => toAbsolute(src))
      .filter(Boolean)

  const isInStock = (item: Item): boolean =>
    Object.values(item.vector || {}).some((v) => v && v.quantity > 0)

  const availability = (item: Item): string =>
    `https://schema.org/${isInStock(item) ? "InStock" : "OutOfStock"}`

  const priceValue = (item: Item): string => (item.price || "").toString().replace(/\D/g, "") || "0"

  const buildOffer = (item: Item): Record<string, unknown> => ({
    "@type": "Offer",
    "url": productUrl(item),
    "priceCurrency": "RUB",
    "price": priceValue(item),
    "availability": availability(item),
  })

  const buildProduct = (
    item: Item,
    { withContext = false }: { withContext?: boolean } = {},
  ): Record<string, unknown> => {
    const images = productImages(item)
    const data: Record<string, unknown> = {
      ...(withContext ? { "@context": "https://schema.org" } : {}),
      "@type": "Product",
      "name": item.name,
      "url": productUrl(item),
      "sku": item.alias,
      "brand": { "@type": "Brand", "name": "CASA AL MARE" },
      "offers": buildOffer(item),
    }
    if (images.length) data.image = images
    return data
  }

  const buildBreadcrumbList = (
    crumbs: Crumb[],
    { withContext = true }: { withContext?: boolean } = {},
  ): Record<string, unknown> => ({
    ...(withContext ? { "@context": "https://schema.org" } : {}),
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((c, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": c.name,
      ...(c.url ? { item: toAbsolute(withTrailingSlash(c.url)) } : {}),
    })),
  })

  const buildItemList = (items: Item[], name: string): Record<string, unknown> => ({
    "@type": "ItemList",
    name,
    "numberOfItems": items.length,
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": buildProduct(item),
    })),
  })

  return {
    siteUrl,
    toAbsolute,
    withTrailingSlash,
    productUrl,
    isImageSrc,
    productImages,
    isInStock,
    availability,
    priceValue,
    buildOffer,
    buildProduct,
    buildBreadcrumbList,
    buildItemList,
  }
}
