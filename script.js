'use strict';


const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling

btnScrollTo.addEventListener('click', function(e) {
  section1.scrollIntoView({ behavior: 'smooth'});
})

///////////////////////////////////////
// Page navigation

document.querySelector('.nav__links')
  .addEventListener('click', function(e) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth'});
  })

///////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab');
  // Guard clause
  if(!clicked) return;

  // Active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Active content area
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
})

///////////////////////////////////////
// Menu fade animation

const handleHover = function(e) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    })
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky header
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver
  (stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
  });
headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section'); 

const revealSection = function(entries, observer) {
  const [entry] = entries;

  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target)
}

const sectionObserver = new IntersectionObserver
  (revealSection, {
    root: null,
    threshold: 0.15
  })

allSections.forEach(function(section) {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
})

///////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // Replace src with data-src

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  })

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, 
  {
    root: null,
    threshold: 0,
    rootMargin: '200px'
  })

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Slider

const carouselSlide = document.querySelector('.carousel-slide');
const sliders = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.slider__btn--left');
const nextBtn = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

// Stablish the carouselSlider width depending on how many sliders are in.
carouselSlide.style.width = `${sliders.length}00%`;

// Counter
let counter = 1;
let size = sliders[1].getBoundingClientRect().width;
window.addEventListener('resize', () => {
  size = sliders[1].getBoundingClientRect().width;
  carouselSlide.style.transform = `translateX(${-size * counter}px)`;
});
carouselSlide.style.transform = `translateX(${-size * counter}px)`;

/*---------------- Functions --------------------*/

// Creating the dots
const createDots = function () {
  for (let i = 0; i < sliders.length - 2; i++) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i + 1}"></button>`
    );
  }
};

const activateDot = function (slide) {
  if (slide > sliders.length - 2) slide = 1;
  if (slide < 1) slide = sliders.length - 2;
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const goToSlide = function (slide) {
  if (counter >= sliders.length - 1) return;
  counter = slide;
  carouselSlide.style.transition = 'transform 0.4s ease-in-out';
  carouselSlide.style.transform = `translateX(${-size * counter}px)`;
};

const nextSlide = function () {
  if (counter >= sliders.length - 1) return;
  carouselSlide.style.transition = 'transform 0.4s ease-in-out';
  counter++;
  carouselSlide.style.transform = `translateX(${-size * counter}px)`;
  activateDot(counter);
};

const prevSlide = function () {
  if (counter <= 0) return;
  carouselSlide.style.transition = 'transform 0.4s ease-in-out';
  counter--;
  carouselSlide.style.transform = `translateX(${-size * counter}px)`;
  activateDot(counter);
};

const init = function () {
  createDots();
  activateDot(1);
};
init();


/*-------------- Event Listeners ----------------*/

// Button Listener
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Carousel Listener
carouselSlide.addEventListener('transitionend', () => {
  if (sliders[counter].id === 'lastClone') {
    carouselSlide.style.transition = 'none';
    counter = sliders.length - 2;
    carouselSlide.style.transform = `translateX(${-size * counter}px)`;
  }
  if (sliders[counter].id === 'firstClone') {
    carouselSlide.style.transition = 'none';
    counter = sliders.length - counter;
    carouselSlide.style.transform = `translateX(${-size * counter}px)`;
  }
});

// Move the slides with the keyboard arrows
document.addEventListener('keydown', event => {
  // console.log(event.key);
  if (event.key === 'ArrowLeft') prevSlide();
  event.key === 'ArrowRight' && nextSlide();
});

// dotContainer Listener
dotContainer.addEventListener('click', event => {
  if (event.target.classList.contains('dots__dot')) {
    const slideIndex = event.target.dataset.slide;
    goToSlide(slideIndex);
    activateDot(slideIndex);
  }
});
