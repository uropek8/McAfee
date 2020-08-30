document.addEventListener("DOMContentLoaded", function() {

	window.addEventListener('scroll', () => {
		document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
	});

	// Animation
	AOS.init({
		startEvent: 'load',
		duration: 1000,
		anchorPlacement: 'top-center'
	});

	// Smooth scroll
	$('.smooth').click(function(event){		
		event.preventDefault();
		document.body.classList.remove('active-mobile');
		const scrollY = document.body.style.top;
		document.body.style.position = '';
		document.body.style.top = '';
		window.scrollTo(0, parseInt(scrollY || '0') * -1);
        document.querySelector('.header__mobile-nav').classList.remove('active');
		$('html,body').animate({
			scrollTop: $(this.hash).offset().top
		}, 700);
	});

	// Menu
	$('.burger-btn').on('click', function () {
		$('.header__mobile-nav').toggleClass('active');
		$('body').toggleClass('active-mobile');
		$('body').hasClass('active-mobile') 
			? (document.body.style.position = 'fixed', document.body.style.top = '-'.concat(window.scrollY, 'px'))  
			: (document.body.style.position = '', document.body.style.top = '');
	});
	$(document).mouseup(function (e) {
		let mobileMenu = $('.header__mobile-nav');
		if (!mobileMenu.is(e.target) && mobileMenu.has(e.target).length === 0) {
			$("body").removeClass("active-mobile");
			(document.body.style.position = '', document.body.style.top = '');
			mobileMenu.removeClass("active");
		}
		let lang = $(".lang");
		if (!lang.is(e.target) && lang.has(e.target).length === 0) {
			$('.field').removeClass('active');
		}
	});

	// Language change
	$(".lang-btn").on('click', function () {
		let toggleBlock = $(this).children('.field');
		toggleBlock.toggleClass("active");
	});
	$('.lang-link').on('click', function (e) {
		e.preventDefault();
		let curLang = $(this).attr('data-lang');
		let btn = $('.lang-btn__text');
		btn.text(curLang);
		i18n.changeLanguage(curLang);
		if (curLang === 'en') {
			$('.feedback-form input[name="name"]').attr('placeholder', 'Your name');
			$('.feedback-form input[name="phone"]').attr('placeholder', 'Phone');
			$('.feedback-form textarea[name="message"]').attr('placeholder', 'Message');
		} else {
			$('.feedback-form input[name="name"]').attr('placeholder', 'Ваше имя');
			$('.feedback-form input[name="phone"]').attr('placeholder', 'Телефон');
			$('.feedback-form textarea[name="message"]').attr('placeholder', 'Сообщение');
		}
	});

	// Cookies
	let statusCookie = getCookie("user-ckecked");
	if (statusCookie == 'on') {
		$('.footer__top').fadeOut(400);
	}
	$('.footer-close').on('click', function () {
		$('.footer__top').fadeOut(400);
		setCookie("user-ckecked", 'on', 36);
	});

	// Countdown
	simplyCountdown('.timer', {
		year: 2020,
		month: 10,
		day: 1,
		hours: 0,
		minutes: 0,
		seconds: 0,
		words: {
			days: 'дней // days',
			hours: 'часов // hours',
			minutes: 'минут // minutes',
			seconds: 'секунд // seconds'
		},
		plural: false,
		inline: false,
		enableUtc: true,
		sectionClass: 'timer__item',
		amountClass: 'timer__count',
		wordClass: 'timer__text',
		zeroPad: true,
		countUp: false
	});

	// Swiper
	let readSlider = new Swiper('.slider-read', {
		loop: true,
		navigation: {
			nextEl: '.read-btn-next',
			prevEl: '.read-btn-prev',
		},
		breakpoints: {
			320: {
				slidesPerView: 1,
				spaceBetween: 0
			},
			640: {
				slidesPerView: 2,
				spaceBetween: 20
			},
			769: {
				slidesPerView: 2,
				spaceBetween: 30
			}
		}
	});

	// Send Form
	$(".feedback-form").submit(function(e) {
		e.preventDefault();
		let currentForm = $(this);
		let inputName = $('.feedback-form input[name="name"]');
		let inputPhone = $('.feedback-form input[name="phone"]');
		let textMessage = $('.feedback-form textarea[name="message"]');
		$.ajax({
			type: "POST",
			url: "send.php",
			data: currentForm.serialize(),
			success: function () {
				inputName.val('');
				inputPhone.val('');
				textMessage.val('');
			},
			error: function (error) {
				console.log('error: ', error.statusText);
				inputName.val('');
				inputPhone.val('');
				textMessage.val('');
			}
		});
	});

	// Translater
	let i18n = window.domI18n({
		selector: '[data-translate]',
		separator: ' // ',
		languages: ['ru', 'en'],
		defaultLanguage: 'ru'
	});

});

$(window).on('load', function () {
	$('.loader').delay(400).fadeOut('slow');
});

function openContent(e, meta) {
	e.preventDefault();
	let curNav;
	
	if ($(e.target)[0].tagName === 'A') {
		curNav = $(e.target)[0];
	} else {
		curNav = $(e.target).parents('a')[0];
	}

	if (curNav.classList.contains('active')) {
		return false;
	} else {
		const navs = $(".lection__nav");
		for (let i = 0; i < navs.length; i++) {
			$(navs[i]).removeClass('active')
		}
		curNav.classList.add('active');
		const content = $(".tab-content");
		for (let i = 0; i < content.length; i++) {
			$(content[i]).removeClass('active')
		}
		let current = $(`[data-meta="${meta}"]`);
		$(current).toggleClass('active');
	}
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};
function getCookie(cookieName) {
    let name = cookieName + "=";
    let all = document.cookie.split(';');
    for (let i = 0; i < all.length; i++) {
        let c = all[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};
function deleteCookie(cookieName) {
    setCookie(cookieName, '', -1);
}

const feedbackModal = plugin.modal({
	html: `
		<div class="modal__overlay" data-close="true">
			<div class="modal__content">
				<div class="modal__content-block">
					<div class="modal__content-inner">
						<h5 class="modal__title" data-translate><span>У вас есть <b>вопрос?</b></span> // <span>Do you have a <b>question?</b></span></h5>
						<form action="" class="modal__form feedback-form">
							<input type="hidden" name="site" value="McAfee SOC Forum">
							<input type="hidden" name="admin" value="marketing@softprom.com">
							<div class="modal__form-row">
								<label class="modal__label" data-translate>Ваше имя // Your name</label>
								<input class="modal__input" type="text" name="name" placeholder="Ваше имя" required>
							</div>
							<div class="modal__form-row">
								<label class="modal__label" data-translate>Телефон // Phone</label>
								<input class="modal__input" type="text" name="phone" placeholder="Телефон" required>
							</div>
							<div class="modal__form-row">
								<label class="modal__label" data-translate>Сообщение // Message</label>
								<textarea class="modal__textarea" name="message" placeholder="Сообщение"></textarea>
							</div>
							<button class="modal__btn" type="submit" data-translate>Задать вопрос // Ask a Question</button>
						</form>
					</div>
					<div class="modal__close-btn" data-close="true"></div>
				</div>
			</div>
		</div>
	`
});

const regModal = plugin.modal({
	html: `
		<div class="modal__overlay" data-close="true">
			<div class="modal__content">
				<div class="modal__content-block">
					<div class="modal__content-inner">
						<h5 class="modal__title"><b>Принять</b> участие</h5>
						<form action="" class="modal__form">
							<div class="modal__form-row">
								<label class="modal__label">Ваше имя</label>
								<input class="modal__input" type="text" name="name" placeholder="Ваше имя" required>
							</div>
							<div class="modal__form-row">
								<label class="modal__label">Должность</label>
								<input class="modal__input" type="text" name="position" placeholder="Должность" required>
							</div>
							<div class="modal__form-row">
								<label class="modal__label">Название компании</label>
								<input class="modal__input" type="text" name="company" placeholder="Название компании" required>
							</div>
							<div class="modal__form-row">
								<label class="modal__label">Корпоративный email</label>
								<input class="modal__input" type="email" name="email" placeholder="Корпоративный email" required>
							</div>
							<div class="modal__form-row">
								<label class="modal__label">Телефон (с кодом города и страны)</label>
								<input class="modal__input" type="text" name="phone-code" placeholder="Телефон (с кодом города и страны)" required>
							</div>
							<div class="modal__form-row">
								<label class="modal__label">Страна</label>
								<input class="modal__input" type="text" name="country" placeholder="Страна" required>
							</div>
							<div class="modal__form-row">
								<label class="modal__label">Отрасль</label>
								<input class="modal__input" type="text" name="branch" placeholder="Отрасль" required>
							</div>
							<button class="modal__btn" type="submit">Регистрация</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	`
});