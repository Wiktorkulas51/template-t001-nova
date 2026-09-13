(function () {
  function updateIndicator(tabList, activeTab, immediate) {
    var indicator = tabList.querySelector('[data-accommodation-indicator]');

    if (!indicator || !activeTab) return;

    var listRect = tabList.getBoundingClientRect();
    var tabRect = activeTab.getBoundingClientRect();

    if (immediate) {
      indicator.style.transition = 'none';
    }

    indicator.style.transform = 'translateX(' + (tabRect.left - listRect.left) + 'px)';
    indicator.style.width = tabRect.width + 'px';

    if (immediate) {
      requestAnimationFrame(function () {
        indicator.style.transition = '';
      });
    }
  }

  function setupTabs(root) {
    if (root.dataset.tabsReady === 'true') return;

    var tabList = root.querySelector('[data-accommodation-tablist]');
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-accommodation-tab]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('[data-accommodation-panel]'));

    if (!tabList || tabs.length < 2 || panels.length < 2) return;

    root.dataset.tabsReady = 'true';

    function activate(tab, shouldFocus) {
      var panelId = tab.getAttribute('aria-controls');

      tabs.forEach(function (candidate) {
        var isActive = candidate === tab;
        candidate.setAttribute('aria-selected', String(isActive));
        candidate.setAttribute('tabindex', isActive ? '0' : '-1');
        candidate.dataset.state = isActive ? 'active' : 'inactive';
      });

      panels.forEach(function (panel) {
        var isActive = panel.id === panelId;
        panel.hidden = !isActive;
        panel.dataset.state = isActive ? 'active' : 'inactive';
      });

      updateIndicator(tabList, tab, false);

      if (shouldFocus) tab.focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        activate(tab, false);
      });

      tab.addEventListener('keydown', function (event) {
        var nextIndex = index;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;

        if (nextIndex !== index) {
          event.preventDefault();
          activate(tabs[nextIndex], true);
        }
      });
    });

    var activeTab = tabs.find(function (tab) {
      return tab.getAttribute('aria-selected') === 'true';
    });

    updateIndicator(tabList, activeTab || tabs[0], true);

    if ('ResizeObserver' in window) {
      var observer = new ResizeObserver(function () {
        var currentTab = tabs.find(function (tab) {
          return tab.getAttribute('aria-selected') === 'true';
        });
        updateIndicator(tabList, currentTab || tabs[0], true);
      });
      observer.observe(tabList);
    } else {
      window.addEventListener('resize', function () {
        var currentTab = tabs.find(function (tab) {
          return tab.getAttribute('aria-selected') === 'true';
        });
        updateIndicator(tabList, currentTab || tabs[0], true);
      });
    }
  }

  function init() {
    document.querySelectorAll('[data-accommodation-tabs]').forEach(setupTabs);
  }

  document.addEventListener('astro:page-load', init);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
