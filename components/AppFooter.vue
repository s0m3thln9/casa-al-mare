<script setup lang="ts">

</script>

<template>
	<footer class="py-6 px-4 font-[Manrope] font-light text-sm text-[#211D1D] bg-[#FFFFFA]">
		<div
			class="border border-[#BBB8B6] rounded-lg px-6 py-8 hidden justify-between flex-wrap sm:flex"
		>
			<div class="flex flex-col gap-4">
				<h3 class="font-normal text-base uppercase">Каталог</h3>
				<ul class="flex flex-col gap-4">
					<li><NuxtLink to="/">Купальники</NuxtLink></li>
					<li><NuxtLink to="/">Нижняя часть купальника</NuxtLink></li>
					<li><NuxtLink to="/">Верхняя часть купальника</NuxtLink></li>
					<li><NuxtLink to="/">Головные уборы</NuxtLink></li>
					<li><NuxtLink to="/">Аксессуары</NuxtLink></li>
				</ul>
			</div>
			<div class="flex flex-col gap-4">
				<h3 class="font-normal text-base uppercase">Покупателям</h3>
				<ul class="flex flex-col gap-4">
					<li><NuxtLink to="/">Доставка и оплата</NuxtLink></li>
					<li><NuxtLink to="/">Возврат</NuxtLink></li>
					<li><NuxtLink to="/">Реквизиты</NuxtLink></li>
					<li><NuxtLink to="/">Обратная связь</NuxtLink></li>
					<li><NuxtLink to="/">Уход за изделиями</NuxtLink></li>
				</ul>
			</div>
			<div class="flex flex-col gap-4">
				<h3 class="font-normal text-base uppercase">О бренде</h3>
				<ul class="flex flex-col gap-4">
					<li><NuxtLink to="/public">О нас</NuxtLink></li>
					<li><NuxtLink to="/">Telegram</NuxtLink></li>
					<li><NuxtLink to="/">WhatsApp</NuxtLink></li>
					<li><NuxtLink to="/">Pinterest</NuxtLink></li>
				</ul>
			</div>
			<div class="flex flex-col gap-4">
				<h3 class="font-normal text-base uppercase">Аккаунт</h3>
				<ul class="flex flex-col gap-4">
					<li><NuxtLink to="/">В личный кабинет</NuxtLink></li>
					<li><NuxtLink to="/">Избранное</NuxtLink></li>
					<li><NuxtLink to="/">Заказы</NuxtLink></li>
					<li><NuxtLink to="/">Сертификат</NuxtLink></li>
				</ul>
			</div>
			<div class="flex flex-col gap-4 w-full lg:w-auto">
				<h3 class="font-normal text-base uppercase">Аккаунт</h3>
				<div class="flex flex-col items-start gap-4 xl:flex-row">
					<input
						type="email" placeholder="Введите e-mail для получения новостей"
						class="min-w-[245px] h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]"
					>
					<AppButton content="Подписаться" variant="primary" custom-class="max-xl:w-[245px]"/>
				</div>
				<p
					class="max-w-[300px] text-[10px] font-[Commissioner] xl:max-w-[416px]"
				>
					Нажимая на кнопку «Подписаться», я соглашаюсь на обработку моих персональных данных и ознакомлен(а) с условиями конфиденциальности.
				</p>
				<span class="text-xs">Политика конфиденциальности и оферта</span>
				<span class="text-xs">CASA AL MARE © 2025</span>
			</div>
		</div>
		<div class="flex flex-col items-center gap-12 sm:hidden">
			<div class="w-full flex flex-col gap-2">
				<div class="flex gap-2">
					<button
						class="w-full py-3 px-2 rounded-2xl bg-[#F9F6EC] font-normal text-[11px]"
					>Whatsapp</button>
					<button
						class="w-full py-3 px-2 rounded-2xl bg-[#F9F6EC] font-normal text-[11px]"
					>Telegram</button>
					<button
						class="w-full py-3 px-2 rounded-2xl bg-[#F9F6EC] font-normal text-[11px]"
					>Рассылка</button>
				</div>
				<button
					class="w-full py-3 px-2 rounded-2xl bg-[#F9F6EC] font-normal text-[11px]"
				>Обратная связь</button>
				<button
					class="w-full py-3 px-2 rounded-2xl bg-[#F9F6EC] font-normal text-[11px]"
				>Реквизиты</button>
				<button
					class="w-full py-3 px-2 rounded-2xl bg-[#F9F6EC] font-normal text-[11px]"
				>Политика конфиденциальности и оферта</button>
			</div>
			<NuxtImg src="/logo-3.svg" alt="CASA AL MARE" width="156" height="174" />
			<span class="text-xs text-[#BBB8B6]">CASA AL MARE © 2025</span>
		</div>
	</footer>
</template>