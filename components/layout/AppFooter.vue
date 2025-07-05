<script setup lang="ts">

</script>

<template>
	<footer class="py-6 px-4 font-[Manrope] font-light text-sm text-[#211D1D]">
		<div class="border border-[#BBB8B6] rounded-lg px-6 py-8 flex justify-between">
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
					<li><NuxtLink to="/">О нас</NuxtLink></li>
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
			<div class="flex flex-col gap-4">
				<h3 class="font-normal text-base uppercase">Аккаунт</h3>
				<div class="flex gap-4">
					<input type="text" placeholder="Введите e-mail для получения новостей" class="w-[245px] h-[44px] px-2 py-2.5 border-[#5E5B58] border-[0.7px] rounded-lg text-xs placeholder:text-[#5E5B58]">
					<button class="w-[155px] h-[35px] px-8 pt-[7px] pb-[9px] bg-[#211D1D] text-[#FFFFFA] rounded-2xl border border-[#211D1D] font-normal ">Подписаться</button>
				</div>
				<p class="w-[416px] text-[10px] font-[Commissioner]">Нажимая на кнопку «Подписаться», я соглашаюсь на обработку моих персональных данных и ознакомлен(а) с условиями конфиденциальности.</p>
				<span class="text-xs">Политика конфиденциальности и оферта</span>
				<span class="text-xs">CASA AL MARE © 2025</span>
			</div>
		</div>
	</footer>
</template>