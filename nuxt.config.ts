// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/image", "@nuxtjs/tailwindcss", "@pinia/nuxt", "nuxt-viewport", '@nuxtjs/sitemap'],
  
  site: {
    url: 'https://casaalmare.com',
  },
  
  hooks: {
    'nitro:config': async (nitroConfig) => {
      try {
        console.log('Fetching routes from API for prerendering...');
        
        const response = await fetch('https://back.casaalmare.com/api/getNuxtLinks');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const links = await response.json();
        console.log('Links received from API:', links);
        
        // Инициализируем routes как массив, если он еще не существует
        nitroConfig.prerender = nitroConfig.prerender || {};
        nitroConfig.prerender.routes = nitroConfig.prerender.routes || [];
        
        // Если API возвращает массив, добавляем все пути
        if (Array.isArray(links)) {
          const allRoutes = links.includes('/') ? links : ['/', ...links];
          allRoutes.forEach(link => {
            const cleanLink = link.startsWith('/') ? link : `/${link}`;
            if (!nitroConfig.prerender.routes.includes(cleanLink)) {
              nitroConfig.prerender.routes.push(cleanLink);
            }
          });
        } else if (links && typeof links === 'object') {
          // Если API возвращает объект, возможно нужно извлечь пути
          // Например: { pages: ['/about', '/contact'] }
          // Адаптируйте этот блок под структуру вашего API
          console.warn('API returned object, not array. Structure:', links);
          
          // Добавляем корневой путь
          if (!nitroConfig.prerender.routes.includes('/')) {
            nitroConfig.prerender.routes.push('/');
          }
        }
        
        console.log('Final prerender routes:', nitroConfig.prerender.routes);
      } catch (error) {
        console.error('Failed to fetch links for prerendering:', error);
        // Гарантируем, что есть хотя бы корневой путь
        nitroConfig.prerender = nitroConfig.prerender || {};
        nitroConfig.prerender.routes = ['/'];
      }
    }
  },

  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },

  nitro: {
    externals: {
      inline: ['vue']
    },
    prerender: {
      // sitemap на статическом хостинге должен быть сгенерен в dist
      routes: ['/sitemap.xml'],
    },
  },
  
  sitemap: {
    urls: async () => {
      try {
        const response = await fetch('https://back.casaalmare.com/api/getNuxtLinks')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const links = await response.json()
        
        if (!Array.isArray(links)) {
          return [{ loc: '/' }]
        }
        
        const allRoutes = links.includes('/') ? links : ['/', ...links]
        
        return allRoutes.map(link => {
          const cleanLink = link.startsWith('/') ? link : `/${link}`
          
          return {
            loc: cleanLink,
          }
        })
      } catch (error) {
        console.error('Failed to fetch links for sitemap:', error)
        return [{ loc: '/' }]
      }
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
      script: [
        { src: 'https://back.casaalmare.com/template/js/counters.js' },
      ],
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