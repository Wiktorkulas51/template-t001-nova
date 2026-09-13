(() => {
  const init = () => {
    document.querySelectorAll('[data-bmi-calculator]').forEach((root) => {
      if (!(root instanceof HTMLElement) || root.dataset.ready === 'true') return;
      root.dataset.ready = 'true';

      const input = (name) => root.querySelector(`[data-bmi-input="${name}"]`);
      const output = (name) => root.querySelector(`[data-bmi-value="${name}"]`);
      const result = (name) => root.querySelector(`[data-bmi-result="${name}"]`);
      const screens = [...root.querySelectorAll('[data-bmi-screen]')];
      let gender = 'female';

      const categories = {
        under: { label: root.dataset.bmiUnderLabel || 'Niedowaga', tip: root.dataset.bmiUnderTip || '' },
        healthy: { label: root.dataset.bmiHealthyLabel || 'Waga prawidłowa', tip: root.dataset.bmiHealthyTip || '' },
        over: { label: root.dataset.bmiOverLabel || 'Nadwaga', tip: root.dataset.bmiOverTip || '' },
        obesity: { label: root.dataset.bmiObesityLabel || 'Otyłość', tip: root.dataset.bmiObesityTip || '' },
      };

      const getCategory = (value) => {
        if (value < 18.5) return categories.under;
        if (value < 25) return categories.healthy;
        if (value < 30) return categories.over;
        return categories.obesity;
      };

      const showScreen = (name) => {
        screens.forEach((screen) => {
          const visible = screen.dataset.bmiScreen === name;
          screen.classList.toggle('hidden', !visible);
        });
      };

      const calculate = () => {
        const height = Number(input('height')?.value || 170);
        const weight = Number(input('weight')?.value || 70);
        const age = Number(input('age')?.value || 30);
        const activity = Number(input('activity')?.value || 1.2);
        const bmi = weight / ((height / 100) ** 2);
        // Mifflin St Jeor gives neutral TDEE calculation without sending data.
        const bmr = gender === 'male'
          ? (10 * weight) + (6.25 * height) - (5 * age) + 5
          : (10 * weight) + (6.25 * height) - (5 * age) - 161;
        const tdee = Math.round(bmr * activity);
        const category = getCategory(bmi);

        if (output('height')) output('height').textContent = `${height} cm`;
        if (output('weight')) output('weight').textContent = `${weight} kg`;
        if (output('age')) output('age').textContent = `${age} lat`;
        if (result('bmi')) result('bmi').textContent = bmi.toFixed(1);
        if (result('category')) result('category').textContent = category.label;
        if (result('tdee')) result('tdee').textContent = String(tdee);
        if (result('tip')) result('tip').textContent = category.tip;
        const ctaKcal = root.querySelector('[data-bmi-cta-kcal]');
        if (ctaKcal) ctaKcal.textContent = String(tdee);
      };

      root.querySelectorAll('[data-bmi-gender]').forEach((button) => {
        button.addEventListener('click', () => {
          gender = button.dataset.bmiGender || 'female';
          root.querySelectorAll('[data-bmi-gender]').forEach((item) => {
            const active = item === button;
            item.classList.toggle('bg-brand-primary', active);
            item.classList.toggle('text-white', active);
            item.classList.toggle('text-brand-dark/55', !active);
            item.setAttribute('aria-pressed', String(active));
          });
          calculate();
        });
      });

      root.querySelectorAll('[data-bmi-input]').forEach((field) => field.addEventListener('input', calculate));
      root.querySelector('[data-bmi-lead-start]')?.addEventListener('click', () => showScreen('lead'));
      root.querySelector('[data-bmi-back]')?.addEventListener('click', () => showScreen('calculator'));
      root.querySelector('[data-bmi-again]')?.addEventListener('click', () => showScreen('calculator'));
      root.querySelector('[data-bmi-lead-form]')?.addEventListener('submit', (event) => {
        event.preventDefault();
        showScreen('success');
      });

      calculate();
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
  document.addEventListener('astro:page-load', init);
})();
