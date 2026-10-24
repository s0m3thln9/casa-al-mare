// Бэкенд отдаёт товары несколько секунд — прогреваем кэш при старте,
// чтобы первый посетитель после деплоя не ждал.
export default defineNitroPlugin(() => {
  if (import.meta.prerender) return

  Promise.all([getProducts(), getDocTree(), getMainVideo(), getBannerConfig()]).catch((error) => {
    console.error("[warmup] не удалось прогреть кэш бэкенда:", error)
  })
})
