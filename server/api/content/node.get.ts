import type { DocNode } from "~/types"

// Документ по пути в дереве (например, "blog/<alias>" или "catalog/kupalniki/verx").
// trail — полные документы по каждому сегменту пути (null, если сегмент не найден),
// node — последний документ с облегчёнными (или полными при children=full) детьми.
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const segments = String(query.path ?? "")
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)
  if (segments.length === 0) throw createError({ statusCode: 400, statusMessage: "path is required" })

  const children = query.children === "full" ? "full" : "light"
  const tree = await getDocTree()

  const trail: (DocNode | null)[] = []
  let current: DocNode | undefined = tree.data[segments[0]!]
  trail.push(current ? fullDoc(current) : null)
  for (const segment of segments.slice(1)) {
    current = current ? findChild(current, segment) : undefined
    trail.push(current ? fullDoc(current) : null)
  }

  if (!current && query.strict) throw createError({ statusCode: 404, statusMessage: "Document not found" })

  return { trail, node: current ? fullDocWithChildren(current, children) : null }
})
