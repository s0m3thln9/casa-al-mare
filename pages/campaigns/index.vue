<script setup lang="ts">
import type { DocNode, DocVideo } from '~/types'

const { data: campaignsContent, error: campaignsError } = await useContentNode("campaigns")
useFetchErrorPage(campaignsError)

const campaignsData = computed(() => campaignsContent.value?.node)

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

useDocSeo(() => ({
  title: campaignsData.value?.pagetitle,
  description: campaignsData.value?.description,
  metatags: campaignsData.value?.metatags,
}))
</script>

<template>
  <main class="mb-5 font-[Manrope] bg-[#FFFFFA] text-[#211D1D] sm:mb-10">
    <div class="p-2 sm:px-4 sm:py-6">
      <AppBreadcrumbs :items="breadcrumsItems" />
    </div>

    <h2 class="uppercase text-center font-[Inter] text-[17px]">Вдохновение</h2>



    <div v-if="campaigns.length === 0" class="text-center py-10 text-gray-400">
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
