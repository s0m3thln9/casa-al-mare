<script setup>
import ItemPage from "~/components/ItemPage.vue"

const route = useRoute()
const alias = computed(() =>
                         Array.isArray(route.params.alias) ? route.params.alias.join('/') : ''
)
</script>

<template>
  <ItemPage :alias="alias" />
</template>