export default defineEventHandler(async (event) => {
  const alias = (getRouterParam(event, "alias") || "").replace(/^\/+|\/+$/g, "")
  if (!alias) throw createError({ statusCode: 400, statusMessage: "alias is required" })

  const [products, tree] = await Promise.all([getProducts(), getDocTree()])
  const item = products.find((product) => product.alias === alias)
  if (!item) throw createError({ statusCode: 404, statusMessage: "Product not found" })

  const doc = findDocByAlias(tree.data, alias)
  return { item, doc: doc ? fullDoc(doc) : null }
})
