<script setup lang="ts">
defineProps<{
	items: {
		name: string
		path?: string
	}[]
}>()
</script>

<template>
	<nav>
		<ol class="flex items-center gap-1 text-[10px] sm:text-sm">
			<li
				v-for="(item, index) in items"
				:key="index"
				class="flex items-center font-light text-[#211D1D] font-[Commissioner] sm:font-[Manrope]"
			>
				<template v-if="item.path">
					<RouterLink
						:to="item.path"
						class="cursor-pointer"
					>
						{{ item.name }}
					</RouterLink>
				</template>
				<template v-else>
					<span class="text-current">{{ item.name }}</span>
				</template>
				<span
					v-if="index < items.length - 1"
					class="ml-1"
				>
					/
				</span>
			</li>
		</ol>
	</nav>
</template>

<style scoped>

</style>