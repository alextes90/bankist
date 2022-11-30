'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const allButtons = document.getElementsByTagName('button');
const header = document.querySelector('.header');
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const contanier = document.querySelector('.operations__tab-container');
const content = document.querySelectorAll('.operations__content');
const tabs = document.querySelectorAll('.operations__tab');
const message = document.createElement('div');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(n => n.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////
/////////////////////////////////////////////////////

// Insert Cookies information

message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!<button>';

header.append(message);

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

message.style.background = '#37383d';
// message.style.width = '120%';
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// SmoothScrolling

btnScroll.addEventListener('click', function (e) {
  const section1Coords = section1.getBoundingClientRect();
  // console.log(section1Coords);
  // console.log(e.target.getBoundingClientRect());
  //scroling to Section1

  // window.scrollTo(
  //   section1Coords.left + window.pageXOffset,
  //   section1Coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: section1Coords.left + window.pageXOffset,
  //   top: section1Coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

//Smoth scrolling to sections

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

document.querySelector('.nav__logo').addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

//Tab elements

contanier.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //guard clause
  if (!clicked) return;

  //Make tabs and content active
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  content.forEach(c => c.classList.remove('operations__content--active'));
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Fade navigation

const fadeFunction = function (e, number) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', fadeFunction.bind(0.5));

nav.addEventListener('mouseout', fadeFunction.bind(1));

// Sticky navigation

// const sec1Cords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > sec1Cords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//Intersection Observer API (Sticky navigation)

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px `,
});

headerObserver.observe(header);

//Reveal section
const allSections = document.querySelectorAll('.section');

const revealSection = function (entr, observer) {
  const [entry] = entr;

  //guard
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(function (n) {
  sectionObserver.observe(n);
  n.classList.add('section--hidden');
});

//Img Lazy Loading

const lazyImg = document.querySelectorAll('img[data-src]');

const lazyimgLoad = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(lazyimgLoad, {
  root: null,
  threshold: 0.2,
  rootMargin: '-200px',
});

lazyImg.forEach(im => imgObserver.observe(im));

// Slider

const slider = function () {
  const slide = document.querySelectorAll('.slide');
  const rightBtn = document.querySelector('.slider__btn--right');
  const leftBtn = document.querySelector('.slider__btn--left');
  const maxSlide = slide.length;
  let curSlide = 0;
  const dotsContainer = document.querySelector('.dots');
  const activeBtn = function (slid) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(n => n.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slid}"]`)
      .classList.add('dots__dot--active');
  };

  const createDots = function () {
    slide.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const goToSlide = function (slid) {
    slide.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slid)}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activeBtn(curSlide);
  };

  const previousSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else curSlide--;

    goToSlide(curSlide);
    activeBtn(curSlide);
  };
  const int = function () {
    createDots();
    goToSlide(0);
    activeBtn(0);
  };
  int();
  rightBtn.addEventListener('click', nextSlide);
  leftBtn.addEventListener('click', previousSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') previousSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activeBtn(slide);
    }
  });
};

slider();
