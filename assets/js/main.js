/* Paradise Auto Detailing | main.js */

/* --- Frame protection for hosts that can't set X-Frame headers --- */
/* Attempts to break out of top-level framing. This is a best-effort
   fallback for GitHub Pages where server response headers can't be set. */
(function frameBreaker(){
  try {
    if (window.self !== window.top) {
      window.top.location.replace(window.location.href);
    }
  } catch (e) {
    // Cross-origin frame; we can't access top. Silently ignore.
  }
})();

/* --- Mobile nav toggle ------------------------------------- */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.hidden = expanded;
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
    });
  });
}

/* --- Active nav link on scroll ----------------------------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

if (sections.length && navLinks.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(s => navObserver.observe(s));
}

/* --- Gallery comparison viewer ---------------------------- */
const gallery = document.querySelector('[data-gallery]');

if (gallery) {
  const slider = gallery.querySelector('[data-gallery-slider]');
  const beforeImage = gallery.querySelector('[data-gallery-before]');
  const afterImage = gallery.querySelector('[data-gallery-after]');
  const range = gallery.querySelector('[data-gallery-range]');
  const title = gallery.querySelector('[data-gallery-title]');
  const description = gallery.querySelector('[data-gallery-description]');
  const mode = gallery.querySelector('[data-gallery-mode]');
  const hint = gallery.querySelector('[data-gallery-hint]');
  const items = Array.from(gallery.querySelectorAll('[data-gallery-item]'));

  if (slider && beforeImage && afterImage && range && title && description && mode && hint && items.length) {
    const setSliderPosition = (value) => {
      slider.style.setProperty('--comparison-position', `${value}%`);
    };

    const setActiveItem = (item) => {
      const hasComparison = Boolean(item.dataset.before && item.dataset.after);

      gallery.dataset.mode = hasComparison ? 'comparison' : 'single';
      title.textContent = item.dataset.title || '';
      description.textContent = item.dataset.description || '';
      mode.textContent = item.dataset.tag || (hasComparison ? 'Before / After' : 'Result');

      if (hasComparison) {
        const sliderPosition = item.dataset.position || '50';

        beforeImage.src = item.dataset.before;
        beforeImage.alt = item.dataset.beforeAlt || '';
        afterImage.src = item.dataset.after;
        afterImage.alt = item.dataset.afterAlt || '';
        range.value = sliderPosition;
        setSliderPosition(sliderPosition);
        hint.textContent = 'Drag the handle left or right to compare the result.';
      } else {
        beforeImage.src = item.dataset.result || '';
        beforeImage.alt = item.dataset.resultAlt || '';
        range.value = '100';
        setSliderPosition(100);
        hint.textContent = 'Single result photo from a completed detail.';
      }

      items.forEach(button => {
        const isActive = button === item;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
    };

    range.addEventListener('input', (event) => {
      setSliderPosition(event.target.value);
    });

    items.forEach(item => {
      item.addEventListener('click', () => {
        setActiveItem(item);
      });
    });

    const initialItem = gallery.querySelector('[data-active]') || items[0];
    setActiveItem(initialItem);
  }
}

/* --- Scroll-reveal animation ------------------------------- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const revealSelectors = [
    '.section__head',
    '.package',
    '.step',
    '.gallery__feature',
    '.gallery__thumb',
    '.contact-card',
    '.extras',
    '.pricing-note',
    '.reviews',
    '.gallery__instagram',
  ].join(', ');

  const revealEls = document.querySelectorAll(revealSelectors);
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

  revealEls.forEach(el => revealObserver.observe(el));
}
