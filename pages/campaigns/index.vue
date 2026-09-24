<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import type { DocNode, DocTree, DocVideo } from '~/types'

const docsStore = useDocsStore()

const { data: treeData } = await useFetch<DocTree>(
  "https://back.casaalmare.com/api/getdocTree"
)

const campaignsData = computed(() => docsStore.tree?.data?.campaigns ?? treeData.value?.data?.campaigns)

const campaigns = computed(() => {
  if (!campaignsData.value?.subitems) return []
  return Object.values(campaignsData.value.subitems)
    .slice()
    .sort((a, b) => (a.menuindex ?? 0) - (b.menuindex ?? 0))
})

const campaignMedia = (campaign: DocNode) => {
  if (!campaign.subitems) return []
  return Object.values(campaign.subitems)
    .slice()
    .sort((a, b) => (a.menuindex ?? 0) - (b.menuindex ?? 0))
}

type CampaignCover = { image?: string; video?: DocVideo[] }

const campaignCover = (campaign: DocNode): CampaignCover | undefined => {
  if (campaign.image) return { image: docImageUrl(campaign.id, campaign.image) }
  const media = campaignMedia(campaign).find(item => item.image || item.video?.length)
  if (!media) return undefined
  return { image: docImageUrl(media.id, media.image), video: media.video }
}

const breadcrumsItems: { name: string; path?: string }[] = [
  { name: "Главная", path: "/" },
  { name: "Вдохновение" },
]

const pageTitle = computed(() => campaignsData.value?.pagetitle ?? "")
const description = computed(() => campaignsData.value?.description ?? "")

const metaTags = computed(() => {
  const tags: Record<string, string> = {}

  campaignsData.value?.metatags?.forEach(tag => {
    if (tag.name.startsWith('og:')) {
      const ogKey = tag.name.replace('og:', '')
      const camelCaseKey = 'og' + ogKey.charAt(0).toUpperCase() + ogKey.slice(1)
      tags[camelCaseKey] = tag.content
    } else if (tag.name.startsWith('twitter:')) {
      const twitterKey = tag.name.replace('twitter:', '')
      const camelCaseKey = 'twitter' + twitterKey.charAt(0).toUpperCase() + twitterKey.slice(1)
      tags[camelCaseKey] = tag.content
    } else {
      tags[tag.name] = tag.content
    }
  })

  return tags
})

const updateSeo = () => {
  useSeoMeta({
    title: pageTitle.value,
    description: description.value,
    ...metaTags.value
  })
}

updateSeo()

watch([pageTitle, description, metaTags], () => {
  updateSeo()
}, { deep: true })

onMounted(async () => {
  if (!docsStore.tree) {
    await docsStore.fetchTree()
  }
})
</script>

<template>
  <main class="mb-5 font-[Manrope] bg-[#FFFFFA] text-[#211D1D] sm:mb-10">
    <div class="p-2 sm:px-4 sm:py-6">
      <AppBreadcrumbs :items="breadcrumsItems" />
    </div>

    <h2 class="uppercase text-center font-[Inter] text-[17px]">Вдохновение</h2>

    <div v-if="docsStore.loading && campaigns.length === 0" class="text-center py-10">Загрузка...</div>

    <div v-else-if="campaigns.length === 0" class="text-center py-10 text-gray-400">
      Пока нет ни одной кампании
    </div>

    <div v-else class="grid grid-cols-1 mt-4 px-2 gap-2 sm:gap-4 sm:px-4 sm:mt-10 sm:grid-cols-2">
      <template v-for="campaign in campaigns" :key="campaign.id">
        <VideoBanner
          v-if="campaignCover(campaign)?.video?.length"
          :video-data="{
            pc: campaignCover(campaign)!.video![0],
            mob: campaignCover(campaign)!.video![0],
          }"
          :text="campaign.pagetitle"
          :link="`/campaigns/${campaign.alias}/`"
          custom-class="rounded-lg aspect-[936/680]"
        />

        <BannerCard
          v-else
          :image-url="campaignCover(campaign)?.image ?? ''"
          :text="campaign.pagetitle"
          :link="`/campaigns/${campaign.alias}/`"
          custom-class="rounded-lg aspect-[936/680]"
        />
      </template>
    </div>
  </main>
</template>
