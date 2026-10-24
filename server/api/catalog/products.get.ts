export default defineEventHandler(async () => {
  const products = await getProducts()
  return products.map(lightProduct)
})
