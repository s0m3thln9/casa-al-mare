export default defineEventHandler((event) => {
  const id = Number(getQuery(event).id)
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, statusMessage: "id is required" })
  return getVideoById(id)
})
