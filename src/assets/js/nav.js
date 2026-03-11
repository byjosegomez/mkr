// Wait for DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function () {

	// ===== Mobile Navigation Toggle =====
	var CSbody = document.querySelector("body");
	const CSnavbarMenu = document.querySelector("#cs-navigation");
	const CShamburgerMenu = document.querySelector("#cs-navigation .cs-toggle");

	if (CShamburgerMenu) {
		CShamburgerMenu.addEventListener('click', function () {
			CShamburgerMenu.classList.toggle("cs-active");
			CSnavbarMenu.classList.toggle("cs-active");
			CSbody.classList.toggle("cs-open");
			ariaExpanded();
		});
	}

	function ariaExpanded() {
		const csUL = document.querySelector('#cs-expanded');
		if (csUL) {
			const csExpanded = csUL.getAttribute('aria-expanded');
			if (csExpanded === 'false') {
				csUL.setAttribute('aria-expanded', 'true');
			} else {
				csUL.setAttribute('aria-expanded', 'false');
			}
		}
	}

	// ===== Mobile Nav Dropdown Toggle (mobile only) =====
	const dropDowns = Array.from(document.querySelectorAll('#cs-navigation .cs-dropdown'));
	for (const item of dropDowns) {
		const onClick = () => {
			if (window.innerWidth < 1024) {
				item.classList.toggle('cs-active');
			}
		}
		item.addEventListener('click', onClick);
	}

	// ===== Scroll-triggered Background =====
	const navigation = document.getElementById('cs-navigation');
	const scrollThreshold = 50;

	function handleScroll() {
		if (window.scrollY > scrollThreshold) {
			navigation.classList.add('scrolled');
		} else {
			navigation.classList.remove('scrolled');
		}
	}

	window.addEventListener('scroll', handleScroll);
	handleScroll();
});

// Carousel functionality for tablet view - ONLY runs between 768px and 1299px
function initServiceCarousel() {
	const carousel = document.getElementById('serviceCarousel');
	const prevBtn = document.querySelector('#projects-605 .cs-prev');
	const nextBtn = document.querySelector('#projects-605 .cs-next');
	const indicators = document.querySelectorAll('#projects-605 .cs-indicator');
	const items = document.querySelectorAll('#projects-605 .cs-item');

	if (!carousel || !prevBtn || !nextBtn || items.length === 0) {
		return;
	}

	let currentIndex = 0;

	function updateCarousel(index) {
		const itemWidth = items[0].offsetWidth;
		const gap = 20;
		carousel.scrollTo({
			left: (itemWidth + gap) * index,
			behavior: 'smooth'
		});

		indicators.forEach((indicator, i) => {
			indicator.classList.toggle('active', i === index);
		});

		currentIndex = index;
	}

	prevBtn.addEventListener('click', (e) => {
		e.preventDefault();
		const newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
		updateCarousel(newIndex);
	});

	nextBtn.addEventListener('click', (e) => {
		e.preventDefault();
		const newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
		updateCarousel(newIndex);
	});

	indicators.forEach((indicator, index) => {
		indicator.addEventListener('click', (e) => {
			e.preventDefault();
			updateCarousel(index);
		});
	});

	carousel.addEventListener('scroll', () => {
		const itemWidth = items[0].offsetWidth;
		const gap = 20;
		const scrollPosition = carousel.scrollLeft;
		const newIndex = Math.round(scrollPosition / (itemWidth + gap));

		if (newIndex !== currentIndex && newIndex >= 0 && newIndex < items.length) {
			indicators.forEach((indicator, i) => {
				indicator.classList.toggle('active', i === newIndex);
			});
			currentIndex = newIndex;
		}
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initServiceCarousel);
} else {
	initServiceCarousel();
}

class Slideshow {
	constructor() {
		this.slides = Array.from(document.querySelectorAll('.cs-slide'));
		this.nextButton = document.querySelector('.cs-slideshow-next');
		this.prevButton = document.querySelector('.cs-slideshow-prev');
		this.currentIndex = 0;
		this.isMoving = false;
		this.init();
	}

	init() {
		this.nextButton?.addEventListener('click', () => this.moveSlide('next'));
		this.prevButton?.addEventListener('click', () => this.moveSlide('prev'));
		this.updateSlideStates();
	}

	updateSlideStates() {
		this.slides.forEach((slide, index) => {
			slide.classList.remove('active', 'prev', 'next', 'initial');

			if (index === this.currentIndex) {
				slide.classList.add('active');
			} else if (index === this.getAdjacentIndex('prev')) {
				slide.classList.add('prev');
			} else if (index === this.getAdjacentIndex('next')) {
				slide.classList.add('next');
			}
		});
	}

	getAdjacentIndex(direction) {
		const totalSlides = this.slides.length;
		if (direction === 'next') {
			return (this.currentIndex + 1) % totalSlides;
		} else {
			return (this.currentIndex - 1 + totalSlides) % totalSlides;
		}
	}

	moveSlide(direction) {
		if (this.isMoving) return;
		this.isMoving = true;
		this.currentIndex = this.getAdjacentIndex(direction);
		this.updateSlideStates();
		setTimeout(() => {
			this.isMoving = false;
		}, 300);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new Slideshow();
});



// Auto-set active nav link based on current URL
const currentPath = window.location.pathname;
document.querySelectorAll('.cs-li-link').forEach(link => {
	link.classList.remove('cs-active');
	if (link.getAttribute('href') === currentPath) {
		link.classList.add('cs-active');
	}
});