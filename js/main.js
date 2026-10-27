(function () {
  var nav = document.getElementById('topNav');
  var links = document.querySelectorAll('#navLinks a');
  var sections = document.querySelectorAll('section[id], header[id]');
  var lang = document.getElementById('lang');
  var toggle = document.getElementById('langToggle');
  var menu = document.getElementById('langMenu');

  // Nav: elevated state + active link
  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
    var current = '';
    for (var i = 0; i < sections.length; i++) {
      if (window.scrollY >= sections[i].offsetTop - 120) current = '#' + sections[i].id;
    }
    for (var j = 0; j < links.length; j++) {
      links[j].classList.toggle('active', links[j].getAttribute('href') === current);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Language menu
  function setMenu(open) {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    setMenu(menu.hidden);
  });
  document.addEventListener('click', function (e) {
    if (!lang.contains(e.target) || e.target.closest('[data-lang]')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { el.classList.add('pre'); io.observe(el); });
  }
})();
