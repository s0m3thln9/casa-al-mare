// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/image", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "ru",
        prefix: "og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#",
      },
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
