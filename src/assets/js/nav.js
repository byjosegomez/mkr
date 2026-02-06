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

class Slideshow {
	constructor() {
		// Initialize DOM elements for the slideshow
		// Converts NodeList to Array for better method availability
		this.slides = Array.from(document.querySelectorAll('.cs-slide'));
		this.nextButton = document.querySelector('.cs-slideshow-next');
		this.prevButton = document.querySelector('.cs-slideshow-prev');

		// Track the currently displayed slide and animation state
		this.currentIndex = 0;
		this.isMoving = false;

		// Setup event listeners and initial slide positions
		this.init();
	}

	init() {
		// Attach click handlers for navigation, using optional chaining for null safety
		this.nextButton?.addEventListener('click', () => this.moveSlide('next'));
		this.prevButton?.addEventListener('click', () => this.moveSlide('prev'));

		// Position slides in their starting configuration
		this.updateSlideStates();
	}

	updateSlideStates() {
		this.slides.forEach((slide, index) => {
			// Clear existing position classes to prevent conflicts
			slide.classList.remove('active', 'prev', 'next', 'initial');

			// Apply appropriate positioning class based on slide's relation to current slide
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
		// Calculate the index of the next/previous slide with wrapping
		// Using modulo to create circular navigation
		if (direction === 'next') {
			return (this.currentIndex + 1) % totalSlides;
		} else {
			return (this.currentIndex - 1 + totalSlides) % totalSlides;
		}
	}

	moveSlide(direction) {
		// Prevent animation overlap by checking if transition is in progress
		if (this.isMoving) return;
		this.isMoving = true;

		// Update the current slide index based on navigation direction
		this.currentIndex = this.getAdjacentIndex(direction);

		// Apply new positioning classes to slides
		this.updateSlideStates();

		// Re-enable navigation after transition animation completes
		setTimeout(() => {
			this.isMoving = false;
		}, 300); // Timeout should match CSS transition-duration
	}
}

// Create slideshow instance once DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
	new Slideshow();
});



document.addEventListener('DOMContentLoaded', () => {
	const dropdowns = document.querySelectorAll('#cs-navigation .cs-dropdown');

	dropdowns.forEach(dropdown => {
		const link = dropdown.querySelector('.cs-li-link');

		link.addEventListener('click', (e) => {
			e.preventDefault(); // prevents page jump if it's a link

			// Toggle the active class
			dropdown.classList.toggle('cs-active');

			const dropMenu = dropdown.querySelector('.cs-drop-ul');

			if (dropdown.classList.contains('cs-active')) {
				// Open dropdown
				dropMenu.style.height = dropMenu.scrollHeight + 'px';
				dropMenu.style.opacity = '1';
				dropMenu.style.visibility = 'visible';
				dropMenu.style.transform = 'scale(1)';
			} else {
				// Close dropdown
				dropMenu.style.height = '0';
				dropMenu.style.opacity = '0';
				dropMenu.style.visibility = 'hidden';
				dropMenu.style.transform = 'scale(0)';
			}
		});
	});
});
