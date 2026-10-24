import type { DocNode } from "~/types"
import type { FetchError } from "ofetch"

interface ContentNodeResponse {
  trail: (DocNode | null)[]
  node: DocNode | null
}

interface ContentNodeOptions {
  // full — дочерние документы вместе с content/metatags (например, FAQ)
  children?: "light" | "full"
  // strict — 404, если документа нет
  strict?: boolean
}

export function useContentNode(path: MaybeRefOrGetter<string>, options: ContentNodeOptions = {}) {
  const children = options.children ?? "light"
  return useFetch<ContentNodeResponse>("/api/content/node", {
    key: computed(() => `content-node:${toValue(path)}:${children}`),
    query: {
      path: computed(() => toValue(path)),
      children,
      ...(options.strict ? { strict: 1 } : {}),
    },
  })
}

export function useContentDoc(alias: MaybeRefOrGetter<string>) {
  return useFetch<DocNode>("/api/content/find", {
    key: computed(() => `content-doc:${toValue(alias)}`),
    query: { alias: computed(() => toValue(alias)) },
  })
}

// Ошибка загрузки данных страницы превращается в настоящую страницу ошибки
// (с правильным HTTP-статусом при SSR), в том числе при смене параметров на клиенте.
export function useFetchErrorPage(error: Ref<FetchError | null | undefined>, notFoundMessage = "Страница не найдена") {
  const toNuxtError = (err: FetchError) => {
    const statusCode = err.statusCode === 404 ? 404 : 503
    return createError({
      statusCode,
      statusMessage: statusCode === 404 ? notFoundMessage : "Сервис временно недоступен",
      fatal: true,
    })
  }

  if (error.value) throw toNuxtError(error.value)

  watch(error, (err) => {
    if (err) showError(toNuxtError(err))
  })
}

// Детерминированное перемешивание: одинаковый результат на сервере и при гидрации.
export function seededShuffle<T>(items: T[], seed: number): T[] {
  const result = [...items]
  let state = seed >>> 0 || 1
  const next = () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return (state >>> 0) / 4294967296
  }
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1))
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}
