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
			// run the function to check the aria-expanded value
			ariaExpanded();
		});
	}

	// checks the value of aria expanded on the cs-ul and changes it accordingly whether it is expanded or not 
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

	// ===== Mobile Nav Dropdown Toggle =====
	const dropDowns = Array.from(document.querySelectorAll('#cs-navigation .cs-dropdown'));
	for (const item of dropDowns) {
		const onClick = () => {
			item.classList.toggle('cs-active')
		}
		item.addEventListener('click', onClick)
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

	// Check if elements exist
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

		// Update indicators
		indicators.forEach((indicator, i) => {
			indicator.classList.toggle('active', i === index);
		});

		currentIndex = index;
	}

	// Previous button
	prevBtn.addEventListener('click', (e) => {
		e.preventDefault();
		const newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
		updateCarousel(newIndex);
	});

	// Next button
	nextBtn.addEventListener('click', (e) => {
		e.preventDefault();
		const newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
		updateCarousel(newIndex);
	});

	// Indicator buttons
	indicators.forEach((indicator, index) => {
		indicator.addEventListener('click', (e) => {
			e.preventDefault();
			updateCarousel(index);
		});
	});

	// Auto-detect scroll position and update indicators
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

// Initialize on page load
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initServiceCarousel);
} else {
	initServiceCarousel();
}