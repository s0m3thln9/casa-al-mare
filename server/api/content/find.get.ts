export default defineEventHandler(async (event) => {
  const alias = String(getQuery(event).alias ?? "").trim()
  if (!alias) throw createError({ statusCode: 400, statusMessage: "alias is required" })

  const tree = await getDocTree()
  const doc = findDocByAlias(tree.data, alias)
  if (!doc) throw createError({ statusCode: 404, statusMessage: "Document not found" })

  return fullDocWithChildren(doc, "light")
})
