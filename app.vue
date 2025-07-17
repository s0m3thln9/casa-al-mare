<script setup lang="ts">
const route = useRoute();

const showRunningLine = computed(() => route.path === '/');

</script>
<template>
	<AppHeader />
	<NuxtPage />
	<AppFooter />
	<RunningLine v-if="showRunningLine" :messages="['Сообщение об акции и эксклюзивных условиях', 'Сообщение об акции и эксклюзивных условиях', 'Сообщение об акции и эксклюзивных условиях', 'Сообщение об акции и эксклюзивных условиях', 'Сообщение об акции и эксклюзивных условиях', 'Сообщение об акции и эксклюзивных условиях', 'Сообщение об акции и эксклюзивных условиях']" />
</template>
<style>
</style>
