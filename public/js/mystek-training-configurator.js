(function () {
  const configurators = document.querySelectorAll('[data-training-configurator]');

  if (!configurators.length) {
    return;
  }

  configurators.forEach(function (configurator) {
    if (configurator.hasAttribute('data-training-configurator-ready')) {
      return;
    }

    configurator.setAttribute('data-training-configurator-ready', 'true');
    const selected = new Map();
    const tabs = Array.from(configurator.querySelectorAll('[data-training-tab]'));
    const panels = Array.from(configurator.querySelectorAll('[data-training-panel]'));
    const items = Array.from(configurator.querySelectorAll('[data-training-item]'));
    const selectedList = configurator.querySelector('[data-training-selected]');
    const emptyState = configurator.querySelector('[data-training-empty]');
    const total = configurator.querySelector('[data-training-total]');
    const clearButton = configurator.querySelector('[data-training-clear]');
    const pricePrefix = configurator.getAttribute('data-training-price-prefix') || '';

    function setActiveTab(tab) {
      const target = tab.getAttribute('data-training-tab');

      tabs.forEach(function (candidate) {
        const isActive = candidate === tab;
        candidate.setAttribute('aria-selected', String(isActive));
        candidate.classList.toggle('border-brand-primary', isActive);
        candidate.classList.toggle('bg-brand-primary', isActive);
        candidate.classList.toggle('text-white', isActive);
        candidate.classList.toggle('border-brand-dark/10', !isActive);
        candidate.classList.toggle('bg-white', !isActive);
        candidate.classList.toggle('text-brand-dark', !isActive);
      });

      panels.forEach(function (panel) {
        panel.hidden = panel.getAttribute('data-training-panel') !== target;
      });
    }

    function setItemState(item, isSelected) {
      item.setAttribute('aria-pressed', String(isSelected));
      item.classList.toggle('border-brand-primary', isSelected);
      item.classList.toggle('bg-brand-primary/5', isSelected);
      item.classList.toggle('shadow-lg', isSelected);
    }

    function renderSelection() {
      const values = Array.from(selected.values());
      const sum = values.reduce(function (result, item) {
        return result + item.price;
      }, 0);

      if (selectedList) {
        selectedList.hidden = values.length === 0;
        selectedList.replaceChildren();
        values.forEach(function (item) {
          const row = document.createElement('li');
          row.className = 'flex items-start justify-between gap-4 border-b border-brand-dark/10 pb-3 last:border-0 last:pb-0';

          const title = document.createElement('span');
          title.className = 'text-sm text-brand-dark/80';
          title.textContent = item.title;

          const price = document.createElement('span');
          price.className = 'shrink-0 text-sm font-semibold text-brand-dark';
          price.textContent = pricePrefix + ' ' + item.price.toLocaleString('pl-PL') + ' PLN';

          row.append(title, price);
          selectedList.append(row);
        });
      }

      if (emptyState) {
        emptyState.hidden = values.length > 0;
      }

      if (total) {
        total.textContent = sum.toLocaleString('pl-PL') + ' PLN';
      }
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        setActiveTab(tab);
      });

      tab.addEventListener('keydown', function (event) {
        let nextIndex = index;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        tabs[nextIndex].focus();
        setActiveTab(tabs[nextIndex]);
      });
    });

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        const id = item.getAttribute('data-training-id');
        const title = item.getAttribute('data-training-title') || '';
        const price = Number(item.getAttribute('data-training-price'));
        const isSelected = selected.has(id);

        if (isSelected) {
          selected.delete(id);
          setItemState(item, false);
        } else if (id && Number.isFinite(price)) {
          selected.set(id, { title: title, price: price });
          setItemState(item, true);
        }

        renderSelection();
      });
    });

    if (clearButton) {
      clearButton.addEventListener('click', function () {
        selected.clear();
        items.forEach(function (item) {
          setItemState(item, false);
        });
        renderSelection();
      });
    }

    if (tabs[0]) {
      setActiveTab(tabs[0]);
    }
    renderSelection();
  });
})();
