(() => {
  const init = () => {
    document.querySelectorAll('[data-qualification-quiz]').forEach((root) => {
      if (!(root instanceof HTMLElement) || root.dataset.ready === 'true') return;
      root.dataset.ready = 'true';

      const screens = [...root.querySelectorAll('[data-quiz-screen]')];
      let incompatible = false;

      const show = (name) => {
        screens.forEach((screen) => {
          screen.classList.toggle('hidden', screen.dataset.quizScreen !== name);
          screen.classList.toggle('flex', screen.dataset.quizScreen === name);
        });
      };

      root.querySelector('[data-quiz-start]')?.addEventListener('click', () => show('question-0'));

      root.querySelectorAll('[data-quiz-choice]').forEach((choice) => {
        choice.addEventListener('click', () => {
          const step = Number(choice.dataset.quizStep || '0');
          const answer = choice.dataset.quizChoice;
          // Only shortcut path answers show the no-match state.
          if ((step === 0 || step === 2) && answer === 'secondary') incompatible = true;
          show(step === 2 ? (incompatible ? 'no-match' : 'success') : `question-${step + 1}`);
        });
      });
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
  document.addEventListener('astro:page-load', init);
})();
