(() => {
  const init = () => {
    document.querySelectorAll('[data-kasia-timeline]').forEach((root) => {
      const steps = [...root.querySelectorAll('[data-kasia-timeline-step]')];
      const progress = root.querySelector('[data-kasia-timeline-progress]');
      if (!steps.length || !progress || root.dataset.ready) return;
      root.dataset.ready = 'true';
      const update = () => {
        const threshold = window.innerHeight * 0.75;
        let active = -1;
        steps.forEach((step, index) => {
          const node = step.querySelector('[data-kasia-timeline-node]');
          const content = step.querySelector('[data-kasia-timeline-content]');
          const pill = step.querySelector('[data-kasia-timeline-pill]');
          const reached = step.getBoundingClientRect().top < threshold;
          if (reached) active = index;
          node?.classList.toggle('bg-brand-primary', reached);
          node?.classList.toggle('text-white', reached);
          node?.classList.toggle('bg-brand-primary/10', !reached);
          content?.classList.toggle('opacity-30', !reached);
          content?.classList.toggle('translate-x-4', !reached);
          pill?.classList.toggle('bg-brand-primary', reached);
          pill?.classList.toggle('text-white', reached);
          pill?.classList.toggle('bg-brand-primary/10', !reached);
          pill?.classList.toggle('text-brand-primary', !reached);
        });
        if (active >= 0) {
          const first = steps[0].querySelector('[data-kasia-timeline-node]')?.getBoundingClientRect().top ?? 0;
          const current = steps[active].querySelector('[data-kasia-timeline-node]')?.getBoundingClientRect().top ?? first;
          progress.style.height = `${Math.max(0, current - first)}px`;
        }
      };
      window.addEventListener('scroll', update, { passive: true });
      update();
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
