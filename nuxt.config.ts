export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/image", "@nuxtjs/tailwindcss", "@pinia/nuxt", "nuxt-viewport", '@nuxtjs/sitemap'],

  ssr: true,

  site: {
    url: 'https://casaalmare.com',
    trailingSlash: true,
  },

  runtimeConfig: {
    // Переопределяется переменной окружения NUXT_BACKEND_URL
    backendUrl: 'https://back.casaalmare.com',
    public: {
      siteUrl: 'https://casaalmare.com'
    }
  },

  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },

  nitro: {
    preset: 'node-server',
    compressPublicAssets: true,
    externals: {
      inline: ['vue']
    },
  },

  routeRules: {
    // Внутренние API отдают кэшированные данные бэкенда — разрешаем браузеру/прокси держать их минуту
    '/api/**': { headers: { 'cache-control': 'public, max-age=60, stale-while-revalidate=300' } },
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    cacheMaxAgeSeconds: 600,
  },

  viewport: {
    breakpoints: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    },
    // На сервере брейкпоинт определяется по cookie/User-Agent — имена должны совпадать с breakpoints выше
    defaultBreakpoints: {
      desktop: 'lg',
      mobile: 'xs',
      tablet: 'md',
    },
    fallbackBreakpoint: 'lg',
  },

  app: {
    head: {
      script: [
        { src: 'https://back.casaalmare.com/template/js/counters.js', defer: true },
      ],
      htmlAttrs: {
        lang: "ru",
        prefix: "og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#",
      },
      link: [
        { rel: "icon", sizes: "any", href: "/favicon.svg" },
        { rel: "preconnect", href: "https://back.casaalmare.com" },
      ],
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no",
        },
        { name: "format-detection", content: "telephone=no" },
      ],
    },
  },
})
