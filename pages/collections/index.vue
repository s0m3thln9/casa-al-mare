<script setup lang="ts">
const images = {
	col1: "/col-1.jpg",
	col2: "/col-2.jpg",
	col3: "/col-3.jpg",
	col4: "/col-4.jpg",
	col5: "/col-5.jpg",
	col6: "/col-6.jpg",
	col7: "/col-7.jpg",
	col8: "/col-8.jpg",
	col9: "/col-9.jpg",
	col10: "/col-10.jpg",
}
</script>

<template>
	<main class="my-5 font-[Manrope] bg-[#FFFFFA] text-[#211D1D] sm:my-10">
		<h2 class="hidden uppercase text-center font-[Inter] text-[17px] sm:block">Campaigns</h2>
		<h2 class="uppercase text-center font-[Inter] text-[17px] sm:hidden">Collections</h2>
		<div class="grid mt-4 px-2 gap-2 sm:gap-4 sm:px-4 sm:mt-10 md:grid-cols-2">
			<BannerCard
				:image-url="images.col1"
				text="capsule deep sea"
				custom-class="rounded-lg aspect-[936/670]"
				object-position="center"
				link="/collections/collection"
			/>
      <BannerCard
	      :image-url="images.col2"
	      text="SS26 solar power"
	      custom-class="rounded-lg aspect-[936/670]"
	      object-position="center"
	      link="/collections/collection"
      />
			<BannerCard
				:image-url="images.col3"
				text="ss24 elle"
				custom-class="rounded-lg aspect-[936/670]"
				object-position="center"
				link="/collections/collection"
			/>
      <BannerCard
	      :image-url="images.col4"
	      text="capsule white clouds"
	      custom-class="rounded-lg aspect-[936/670]"
	      object-position="center"
	      link="/collections/collection"
      />
			<BannerCard
				:image-url="images.col5"
				text="sunset story f23"
				custom-class="rounded-lg aspect-[936/670]"
				object-position="center"
				link="/collections/collection"
			/>
      <BannerCard
	      :image-url="images.col6"
	      text="ss 23 lookbook"
	      custom-class="rounded-lg aspect-[936/670]"
	      object-position="center"
	      link="/collections/collection"
      />
			<BannerCard
				:image-url="images.col7"
				text="COLLECTION"
				custom-class="rounded-lg aspect-[936/670]"
				object-position="50% 10%"
				link="/collections/collection"
			/>
      <BannerCard
	      :image-url="images.col8"
	      text="COLLECTION"
	      custom-class="rounded-lg aspect-[936/670]"
	      object-position="center"
	      link="/collections/collection"
      />
			<BannerCard
				:image-url="images.col9"
				text="COLLECTION"
				custom-class="rounded-lg aspect-[936/670]"
				object-position="50% 10%"
				link="/collections/collection"
			/>
      <BannerCard
	      :image-url="images.col10"
	      text="COLLECTION"
	      custom-class="rounded-lg aspect-[936/670]"
	      object-position="50% 0%"
	      link="/collections/collection"
      />
		</div>
	</main>
</template>

<style scoped>

</style>