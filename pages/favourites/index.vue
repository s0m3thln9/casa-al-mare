<script setup lang="ts">
import AuthModal from "~/components/AuthModal.vue"
import {useAuthStore} from "~/stores/auth"
import {useAuthModalStore} from "~/stores/authModal"

const images = {
	card1: "/item-page-1.jpg",
}

const authStore = useAuthStore()
const authModalStore = useAuthModalStore()

</script>

<template>
	<AuthModal v-if="authModalStore.isOpen" />
  <main
	  class="relative my-5 font-[Manrope] bg-[#FFFFFA] text-[#211D1D] sm:my-10"
	  :class="authModalStore.isOpen && 'opacity-22'"
  >
	  <h2 class="uppercase text-center font-[Inter] text-[17px]">Избранное</h2>
	  <h3
		  v-if="!authStore.isAuth"
		  class="uppercase text-center font-[Inter] mt-8"
	  >
		  Авторизируйтесь для добавления в избранное
	  </h3>
	  <template v-else>
		  <div
			  class="mt-4 grid grid-cols-2 px-2 gap-x-1 gap-y-2 sm:mt-10 sm:grid-cols-4 sm:px-4 sm:gap-x-4 sm:gap-y-6"
		  >
			  <CatalogCard
				  :image-urls="[images.card1, images.card1, images.card1]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
			  />
			  <CatalogCard
				  :image-urls="[images.card1, images.card1, images.card1]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
			  />
			  <CatalogCard
				  :image-urls="[images.card1, images.card1, images.card1]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
			  />
			  <CatalogCard
				  :image-urls="[images.card1, images.card1, images.card1]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
			  />
			  <CatalogCard
				  :image-urls="[images.card1, images.card1, images.card1]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
			  />
			  <CatalogCard
				  :image-urls="[images.card1, images.card1, images.card1]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
			  />
			  <CatalogCard
				  :image-urls="[images.card1, images.card1, images.card1]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
			  />
			  <CatalogCard
				  :image-urls="[images.card1, images.card1, images.card1]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
			  />
			  <div
				  class="col-span-2 w-full flex justify-center items-center mt-5 mb-3 sm:hidden"
			  >
				  <button class="font-light text-xs">Показать больше</button>
			  </div>
		  </div>
		  <h2 class="hidden mt-10 font-[Inter] text-4xl text-center sm:block">Вам может понравится</h2>
		  <div
			  class="hidden mt-12 grid-cols-4 px-4 gap-x-4 gap-y-6 sm:grid"
		  >
			  <CatalogCard
				  :image-urls="[images.card1, images.card1, images.card1]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
			  />
			  <CatalogCard
				  :image-urls="[images.card1, images.card1, images.card1]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
			  />
			  <CatalogCard
				  :image-urls="[images.card1, images.card1, images.card1]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
			  />
			  <CatalogCard
				  :image-urls="[images.card1, images.card1, images.card1]"
				  text="Printed bikini top"
				  :price="25500"
				  variant="large"
			  />
		  </div>
		  <AppSEO
			  :paragraphs="['CASA AL MARE — эстетика тела, свобода выбора.\n'+
	'Каталог CASA AL MARE создан для женщин, которые ищут не просто купальник или комплект белья, а выражение своей индивидуальности. Мы создаём коллекции, вдохновлённые побережьями, архитектурой юга и непринуждённой элегантностью.', 'В каталоге CASA AL MARE вы найдете:\n'+
	'купальники: раздельные и слитные;\n'+
	'комплекты нижнего белья: браллеты, трусики, боди;\n'+
	'аксессуары: пляжные полотенца, сумки, косметички.\n'+
	'мы используем премиальные материалы, адаптированные к разным типам фигуры и формам.\n'+
	'каждое изделие проходит ручную проверку, а дизайн продуман до мелочей.', 'Быстрая доставка по всей России и миру. Поддержка клиентов работает ежедневно. Вся продукция произведена с заботой об экологии.\n'+
	'Выбирайте купальники и бельё CASA AL MARE — сочетание модных решений, комфорта и женственности.\n'+
	'Следите за новыми коллекциями, подписывайтесь на наш telegram, vk и открывайте красоту каждый день.']"
			  custom-class="sm:hidden"
		  />
	  </template>
  </main>
</template>

<style scoped>

</style>