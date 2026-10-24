import type { DocMetaTag } from "~/types"

interface DocSeoInput {
  title?: string | null
  description?: string | null
  metatags?: DocMetaTag[] | null
}

// Мета-теги документа из админки: og:* уходят в property, остальные — в name.
export const docMetaTagsToHead = (metatags: DocMetaTag[] | null | undefined) =>
  (metatags ?? [])
    .filter((tag) => tag?.name && tag.content)
    .map((tag) =>
      tag.name.startsWith("og:")
        ? { key: tag.name, property: tag.name, content: tag.content }
        : { key: tag.name, name: tag.name, content: tag.content },
    )

export function useDocSeo(input: () => DocSeoInput) {
  useHead(() => {
    const { title, description, metatags } = input()
    const meta = docMetaTagsToHead(metatags)
    if (description && !meta.some((tag) => tag.key === "description")) {
      meta.unshift({ key: "description", name: "description", content: description })
    }
    return { ...(title ? { title } : {}), meta }
  })
}
