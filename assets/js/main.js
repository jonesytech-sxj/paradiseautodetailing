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

/* --- Scroll-reveal animation ------------------------------- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const revealSelectors = [
    '.section__head',
    '.package',
    '.step',
    '.gallery__item',
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
