import { defineSitemapEventHandler } from "#imports"

export default defineSitemapEventHandler(async () => {
  const links = await getNuxtLinks()
  const paths = new Set(["/"])
  for (const link of links) {
    const clean = `/${link.replace(/^\/+|\/+$/g, "")}/`.replace(/^\/\/$/, "/")
    paths.add(clean)
  }
  return [...paths].map((loc) => ({ loc }))
})
