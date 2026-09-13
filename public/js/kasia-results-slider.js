(() => {
  const init = () => {
    document.querySelectorAll('[data-kasia-results-slider]').forEach((root) => {
      const input = root.querySelector('[data-kasia-results-input]');
      const after = root.querySelector('[data-kasia-results-after]');
      if (!input || !after || root.dataset.ready) return;
      root.dataset.ready = 'true';
      const update = () => { after.style.width = `${input.value}%`; };
      input.addEventListener('input', update);
      update();
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
