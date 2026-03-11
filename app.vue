<script setup>
const route = useRoute()
const config = useRuntimeConfig()

const canonical = computed(() => {
  const url = new URL(route.fullPath, config.public.siteUrl)
  url.search = ''
  return url.toString()
})

useHead({
          link: [
            {
              rel: 'canonical',
              href: canonical
            }
          ]
        })
</script>

<template>
  <NuxtLayout />
</template>
