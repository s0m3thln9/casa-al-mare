// Канонические адреса сайта заканчиваются на "/" (см. canonical в app.vue и ссылки),
// поэтому адреса страниц без слэша постоянно перенаправляем на версию со слэшем,
// чтобы у каждой страницы был один URL.
const SKIP_PREFIXES = ["/api/", "/_nuxt/", "/__", "/_fonts/", "/_ipx/"]

export default defineEventHandler((event) => {
  const method = event.method
  if (method !== "GET" && method !== "HEAD") return

  const [path = "/", search] = event.path.split("?", 2) as [string, string | undefined]
  if (path.endsWith("/")) return
  if (SKIP_PREFIXES.some((prefix) => path.startsWith(prefix))) return
  // Файлы (sitemap.xml, robots.txt, картинки и т.п.) не трогаем.
  if (/\.[a-z0-9]+$/i.test(path.slice(path.lastIndexOf("/") + 1))) return

  return sendRedirect(event, `${path}/${search ? `?${search}` : ""}`, 301)
})
