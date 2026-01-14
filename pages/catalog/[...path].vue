<script setup>
const route = useRoute()

const path = computed(() =>
                        Array.isArray(route.params.path) ? route.params.path.join('/') : ''
)
</script>

<template>
  <CatalogPage :path="path" />
</template>