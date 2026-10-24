<script setup lang="ts">
useHead({
  title: "Уход за изделиями - CASA AL MARE",
})

const breadcrumsItems: { name: string; path?: string }[] = [
  {
    name: "Главная",
    path: "/",
  },
  { name: "Уход за изделиями" },
]

const { data: careDoc } = await useContentNode("docs/care")

const careContent = computed(() => careDoc.value?.node?.content ?? "")
</script>

<template>
  <main class="font-[Manrope] bg-[#FFFFFA] text-[#211D1D] px-2 sm:px-4">
    <div class="py-2 sm:py-6">
      <AppBreadcrumbs :items="breadcrumsItems" />
    </div>
    <div class="grid grid-cols-1 items-start my-6 xl:grid-cols-2">
      <img
        src="/care.png"
        alt="care"
        width="909"
        height="692"
        class="rounded-lg"
      >
      <div
        class="care-content flex flex-col gap-2"
        v-html="careContent"
      />
    </div>
  </main>
</template>

<style scoped>
.care-content :deep(h2) {
  font-size: 20px;
  font-weight: 400;
  color: #0a0e11;
}

.care-content :deep(p) {
  font-size: 14px;
  font-weight: 300;
}

@media screen and (max-width: 640px) {
  .care-content :deep(h2) {
    font-size: 15px;
    font-weight: 300;
  }
}
</style>
