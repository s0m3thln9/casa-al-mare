// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/image", "@nuxtjs/tailwindcss", "@pinia/nuxt", "nuxt-viewport"],
  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
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
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "ru",
        prefix: "og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#",
      },
      link: [{ rel: "icon", sizes: "any", href: "/favicon.svg" }],
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
