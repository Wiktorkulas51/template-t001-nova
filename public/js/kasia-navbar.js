(() => {
  const nav = document.querySelector('[data-kasia-navbar]');
  if (!nav) return;

  const toggle = nav.querySelector('[data-kasia-navbar-toggle]');
  const drawer = nav.querySelector('[data-kasia-navbar-drawer]');
  const links = nav.querySelectorAll('[data-kasia-navbar-link]');
  const lines = nav.querySelectorAll('[data-kasia-line]');
  let open = false;
  let frame = 0;

  const setOpen = (next) => {
    open = next;
    drawer?.classList.toggle('is-open', open);
    drawer?.setAttribute('aria-hidden', String(!open));
    toggle?.setAttribute('aria-expanded', String(open));
    lines.forEach((line) => line.classList.toggle('is-open', open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  const updateDensity = () => {
    nav.classList.toggle('is-compact', window.scrollY > 50);
    frame = 0;
  };

  toggle?.addEventListener('click', () => setOpen(!open));
  links.forEach((link) => link.addEventListener('click', () => setOpen(false)));
  window.addEventListener('scroll', () => {
    if (frame) return;
    frame = window.requestAnimationFrame(updateDensity);
  }, { passive: true });
  updateDensity();
})();
