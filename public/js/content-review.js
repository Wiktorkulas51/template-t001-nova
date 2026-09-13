(function () {
  'use strict';

  if (window.__contentReviewLoaded) return;
  window.__contentReviewLoaded = true;

  var state = {
    pagePath: window.location.pathname,
    originalValues: new Map(),
    changes: new Map(),
    history: [],
    activeElement: null,
    activeBefore: null,
    lastEditedKey: null,
    submissionId: null,
  };

  var editIndicator = null;

  function isReviewMode() {
    return new URLSearchParams(window.location.search).get('edit') === '1';
  }

  function navigateReviewMode(enabled) {
    var url = new URL(window.location.href);
    if (enabled) {
      url.searchParams.set('edit', '1');
    } else {
      url.searchParams.delete('edit');
    }
    window.location.assign(url.toString());
  }

  function storageKey() {
    return 'webscale-content-review:' + window.location.origin + window.location.pathname;
  }

  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function removeStorage(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      // Brak localStorage nie może blokować samej edycji.
    }
  }

  function readText(element) {
    return (element.innerText || element.textContent || '')
      .replace(/\u00a0/g, ' ')
      .trim();
  }

  function findTargets(key) {
    return Array.prototype.filter.call(
      document.querySelectorAll('[data-content-key]'),
      function (element) {
        return element.getAttribute('data-content-key') === key;
      }
    );
  }

  function updateButtonMirrors(key, value) {
    document.querySelectorAll('[data-review-mirror-key]').forEach(function (mirror) {
      if (mirror.getAttribute('data-review-mirror-key') === key && mirror.getAttribute('data-review-mirror-mode') === 'same') {
        mirror.textContent = value;
      }
    });
  }

  function updateTarget(element, value) {
    element.textContent = value;
    updateButtonMirrors(element.getAttribute('data-content-key'), value);
  }

  function syncStoredValue(key, value) {
    var original = state.originalValues.get(key) || '';
    if (value === original) {
      state.changes.delete(key);
    } else {
      state.changes.set(key, { key: key, before: original, after: value });
    }

    findTargets(key).forEach(function (element) {
      updateTarget(element, value);
    });
    updateButtonMirrors(key, value);
    state.submissionId = null;
    persistDraft();
  }

  function pushHistory(key, before, after) {
    if (before === after) return;
    state.history.push({ key: key, before: before, after: after });
    if (state.history.length > 50) state.history.shift();
  }

  function getChanges() {
    return Array.from(state.changes.values());
  }

  function persistDraft() {
    var payload = {
      version: 1,
      updatedAt: new Date().toISOString(),
      changes: getChanges(),
    };
    writeStorage(storageKey(), JSON.stringify(payload));
  }

  function loadDraft() {
    state.changes.clear();
    var raw = readStorage(storageKey());
    if (!raw) return;

    try {
      var draft = JSON.parse(raw);
      (draft.changes || []).forEach(function (change) {
        state.changes.set(change.key, change);
      });
    } catch (error) {
      removeStorage(storageKey());
    }
  }

  function scanTargets() {
    document.querySelectorAll('[data-content-key]').forEach(function (element) {
      var key = element.getAttribute('data-content-key');
      if (!key || state.originalValues.has(key)) return;

      state.originalValues.set(key, readText(element));
      element.classList.add('content-review-target');
    });

    state.changes.forEach(function (change) {
      findTargets(change.key).forEach(function (element) {
        updateTarget(element, change.after);
      });
    });
  }

  function createElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function setStatus(message, type) {
    var status = document.querySelector('[data-review-status]');
    if (!status) return;
    status.textContent = message;
    status.dataset.statusType = type || 'info';
  }

  function updateModeToggle() {
    var toggle = document.querySelector('[data-review-toggle]');
    if (!toggle) return;

    var enabled = isReviewMode();
    toggle.textContent = enabled ? 'Tryb edycji: włączony' : 'Włącz edycję treści';
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.setAttribute('title', enabled ? 'Wyłącz tryb edycji' : 'Włącz tryb edycji');
  }

  function createModeToggle() {
    if (document.querySelector('[data-review-toggle]')) return;

    var toggle = createElement('button', 'content-review-mode-toggle', '');
    toggle.type = 'button';
    toggle.dataset.reviewToggle = '';
    toggle.setAttribute('aria-pressed', 'false');
    document.body.appendChild(toggle);
    updateModeToggle();
  }

  function createEditIndicator() {
    if (editIndicator) return;
    editIndicator = createElement('span', 'content-review-edit-indicator', '');
    editIndicator.innerHTML = '<i class="ph ph-pencil" aria-hidden="true"></i>';
    editIndicator.setAttribute('aria-hidden', 'true');
    editIndicator.hidden = true;
    document.body.appendChild(editIndicator);
  }

  function positionEditIndicator(element) {
    if (!element || !isReviewMode()) return;
    createEditIndicator();
    var rect = element.getBoundingClientRect();
    var left = Math.min(rect.right + 6, window.innerWidth - 24);
    var top = Math.max(8, Math.min(rect.top + (rect.height / 2) - 10, window.innerHeight - 28));
    editIndicator.style.left = left + 'px';
    editIndicator.style.top = top + 'px';
    editIndicator.hidden = false;
  }

  function hideEditIndicator() {
    if (editIndicator) editIndicator.hidden = true;
  }

  function setEditing(element, enabled) {
    if (!element) return;

    if (enabled) {
      element.setAttribute('contenteditable', 'true');
      element.setAttribute('spellcheck', 'true');
      element.setAttribute('aria-label', 'Edytowana treść');
      element.classList.add('content-review-target--editing');
      return;
    }

    element.removeAttribute('contenteditable');
    element.removeAttribute('spellcheck');
    element.removeAttribute('aria-label');
    element.classList.remove('content-review-target--editing');
  }

  function selectContents(element) {
    var range = document.createRange();
    range.selectNodeContents(element);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function recordChange(element) {
    var key = element.getAttribute('data-content-key');
    var before = state.originalValues.get(key) || '';
    var after = readText(element);

    if (!after) {
      setStatus('Treść nie może być pusta.', 'error');
      return;
    }

    if (after === before) {
      state.changes.delete(key);
    } else {
      state.changes.set(key, { key: key, before: before, after: after });
    }

    state.lastEditedKey = key;
    state.submissionId = null;
    updateButtonMirrors(key, after);
    persistDraft();
    setStatus(state.changes.size + ' zmian zapisanych lokalnie.', 'info');
  }

  function closeInlineEdit() {
    if (!state.activeElement) return;
    setEditing(state.activeElement, false);
    state.activeElement = null;
    state.activeBefore = null;
    hideEditIndicator();
  }

  function commitInlineEdit() {
    if (!state.activeElement) return;

    var element = state.activeElement;
    var key = element.getAttribute('data-content-key');
    var before = state.activeBefore === null ? state.originalValues.get(key) || '' : state.activeBefore;
    if (!readText(element)) {
      updateTarget(element, before);
      syncStoredValue(key, before);
      setStatus('Treść nie może być pusta.', 'error');
    } else {
      recordChange(element);
      pushHistory(key, before, readText(element));
    }
    closeInlineEdit();
  }

  function cancelInlineEdit() {
    if (!state.activeElement) return;

    var element = state.activeElement;
    var key = element.getAttribute('data-content-key');
    syncStoredValue(key, state.activeBefore === null ? state.originalValues.get(key) || '' : state.activeBefore);
    closeInlineEdit();
    setStatus('Zmiana została anulowana.', 'info');
  }

  function openInlineEdit(element) {
    if (!isReviewMode()) return;
    if (state.activeElement === element) return;
    if (state.activeElement) commitInlineEdit();

    state.activeElement = element;
    state.activeBefore = readText(element);
    state.lastEditedKey = element.getAttribute('data-content-key');
    setEditing(element, true);
    element.focus();
    selectContents(element);
    positionEditIndicator(element);
    setStatus('Pisz bezpośrednio w tekście. Zmiany zapisują się automatycznie.', 'info');
  }

  function undoLastChange() {
    commitInlineEdit();
    var entry = state.history.pop();
    if (!entry) {
      setStatus('Brak zmiany do cofnięcia.', 'info');
      return;
    }

    syncStoredValue(entry.key, entry.before);
    state.lastEditedKey = entry.key;
    setStatus('Cofnięto ostatnią zmianę.', 'success');
  }

  function restoreOriginal() {
    var activeKey = state.activeElement && state.activeElement.getAttribute('data-content-key');
    commitInlineEdit();
    var key = activeKey || state.lastEditedKey;
    if (!key && state.changes.size) key = Array.from(state.changes.keys()).pop();
    if (!key && state.history.length) key = state.history[state.history.length - 1].key;

    if (!key || !state.originalValues.has(key)) {
      setStatus('Wybierz najpierw treść do przywrócenia.', 'info');
      return;
    }

    syncStoredValue(key, state.originalValues.get(key));
    state.history = state.history.filter(function (entry) { return entry.key !== key; });
    state.lastEditedKey = key;
    setStatus('Przywrócono oryginalną treść.', 'success');
  }

  function buildPayload() {
    if (!state.submissionId) {
      state.submissionId = window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : String(Date.now()) + '-' + Math.random().toString(16).slice(2);
    }

    return {
      submissionId: state.submissionId,
      version: 1,
      project: document.body.getAttribute('data-review-project') || 'starter-kit-local',
      page: window.location.pathname,
      sourceUrl: window.location.href,
      submittedAt: new Date().toISOString(),
      changes: getChanges(),
    };
  }

  function copyText(value) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(value);
    }

    var helper = document.createElement('textarea');
    helper.value = value;
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
    return Promise.resolve();
  }

  function copyPayload() {
    copyText(JSON.stringify(buildPayload(), null, 2))
      .then(function () {
        setStatus('JSON skopiowany do schowka.', 'success');
      })
      .catch(function () {
        setStatus('Nie udało się skopiować JSON-u.', 'error');
      });
  }

  function submitPayload() {
    commitInlineEdit();
    if (state.changes.size === 0) {
      setStatus('Nie ma nowych zmian do wysłania.', 'error');
      return;
    }

    var payload = buildPayload();
    var apiUrl = document.body.getAttribute('data-review-api');
    var submitButton = document.querySelector('[data-review-action="submit"]');
    if (submitButton) submitButton.disabled = true;
    setStatus('Zapisywanie wersji...', 'info');

    if (!apiUrl) {
      writeStorage(storageKey() + ':last-submission', JSON.stringify(payload));
      setStatus('Wersja lokalnie zapisana. Backend nie jest jeszcze podłączony.', 'success');
      if (submitButton) submitButton.disabled = false;
      return;
    }

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json().catch(function () { return {}; });
      })
      .then(function () {
        setStatus('Wersja została zapisana i wysłana.', 'success');
      })
      .catch(function () {
        setStatus('Nie udało się wysłać wersji. Zmiany nadal są zapisane lokalnie.', 'error');
      })
      .finally(function () {
        if (submitButton) submitButton.disabled = false;
      });
  }

  function clearDraft() {
    removeStorage(storageKey());
    removeStorage(storageKey() + ':last-submission');
    window.location.reload();
  }

  function createActionButton(action, icon, label, className) {
    var button = createElement('button', 'content-review-action ' + (className || ''), '');
    button.type = 'button';
    button.dataset.reviewAction = action;
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    button.innerHTML = '<i class="ph ' + icon + '" aria-hidden="true"></i>';
    return button;
  }

  function createToolbar() {
    if (document.querySelector('[data-content-review-toolbar]')) return;

    var toolbar = createElement('aside', 'content-review-toolbar', '');
    toolbar.setAttribute('data-content-review-toolbar', '');
    toolbar.setAttribute('aria-label', 'Tryb edycji treści');

    var title = createElement('strong', 'content-review-toolbar__title', '');
    title.innerHTML = '<i class="ph ph-pencil" aria-hidden="true"></i><span>Edycja treści</span>';
    var hint = createElement('span', 'content-review-toolbar__hint', 'Kliknij tekst, aby go zmienić.');
    var actions = createElement('div', 'content-review-toolbar__actions', '');
    var undo = createActionButton('undo', 'ph-arrow-left', 'Cofnij ostatnią zmianę');
    var restore = createActionButton('restore', 'ph-arrow-right', 'Przywróć oryginalną treść');
    var copy = createActionButton('copy', 'ph-copy', 'Kopiuj JSON');
    var submit = createActionButton('submit', 'ph-check-circle', 'Wyślij wersję', 'content-review-action--primary');
    var clear = createActionButton('clear', 'ph-x', 'Wyczyść wszystkie zmiany', 'content-review-action--quiet');
    var status = createElement('output', 'content-review-toolbar__status', '');
    status.dataset.reviewStatus = '';
    status.setAttribute('aria-live', 'polite');

    actions.append(undo, restore, copy, submit, clear);
    toolbar.append(title, hint, actions, status);
    document.body.appendChild(toolbar);
  }

  function handleClick(event) {
    var toggle = event.target.closest('[data-review-toggle]');
    if (toggle) {
      event.preventDefault();
      if (state.activeElement) commitInlineEdit();
      navigateReviewMode(!isReviewMode());
      return;
    }

    var action = event.target.closest('[data-review-action]');
    if (action) {
      event.preventDefault();
      var actionName = action.getAttribute('data-review-action');
      if (actionName === 'submit') submitPayload();
      if (actionName === 'copy') copyPayload();
      if (actionName === 'undo') undoLastChange();
      if (actionName === 'restore') restoreOriginal();
      if (actionName === 'clear') clearDraft();
      return;
    }

    if (state.activeElement && !state.activeElement.contains(event.target)) {
      commitInlineEdit();
    }

    var target = event.target.closest('[data-content-key]');
    if (!target) {
      var buttonHost = event.target.closest('.ui-button');
      target = buttonHost ? buttonHost.querySelector('[data-content-key]') : null;
    }
    if (!target || !isReviewMode()) return;

    event.preventDefault();
    event.stopPropagation();
    openInlineEdit(target);
  }

  function handleInput(event) {
    if (!state.activeElement || event.target !== state.activeElement) return;
    recordChange(state.activeElement);
  }

  function handleKeydown(event) {
    if (!state.activeElement || event.target !== state.activeElement) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelInlineEdit();
      return;
    }

    if (event.key === 'Enter' && state.activeElement.getAttribute('data-review-type') === 'button') {
      event.preventDefault();
      commitInlineEdit();
    }
  }

  function handleFocusout(event) {
    if (!state.activeElement || event.target !== state.activeElement) return;
    window.setTimeout(function () {
      if (state.activeElement === event.target && document.activeElement !== event.target) {
        commitInlineEdit();
      }
    }, 0);
  }

  function handlePointerover(event) {
    if (!isReviewMode()) return;
    var target = event.target.closest('[data-content-key]');
    if (!target) {
      var buttonHost = event.target.closest('.ui-button');
      target = buttonHost ? buttonHost.querySelector('[data-content-key]') : null;
    }
    if (target) positionEditIndicator(target);
  }

  function handlePointerout(event) {
    if (!isReviewMode()) return;
    var target = event.target.closest('[data-content-key]');
    if (!target || target === state.activeElement) return;
    if (event.relatedTarget && target.contains(event.relatedTarget)) return;
    hideEditIndicator();
  }

  function resetPageState() {
    if (state.pagePath === window.location.pathname) return;
    state.pagePath = window.location.pathname;
    state.originalValues.clear();
    state.changes.clear();
    state.history = [];
    state.activeElement = null;
    state.activeBefore = null;
    state.lastEditedKey = null;
    state.submissionId = null;
  }

  function initialize() {
    resetPageState();
    createModeToggle();
    updateModeToggle();

    if (!isReviewMode()) {
      document.body.classList.remove('content-review-active');
      var toolbar = document.querySelector('[data-content-review-toolbar]');
      if (toolbar) toolbar.remove();
      return;
    }

    document.body.classList.add('content-review-active');
    createToolbar();
    createEditIndicator();
    loadDraft();
    scanTargets();
    setStatus(state.changes.size ? state.changes.size + ' zmian przywróconych z pamięci.' : 'Gotowe do edycji.', 'info');
  }

  document.addEventListener('click', handleClick, true);
  document.addEventListener('input', handleInput, true);
  document.addEventListener('keydown', handleKeydown, true);
  document.addEventListener('focusout', handleFocusout, true);
  document.addEventListener('pointerover', handlePointerover, true);
  document.addEventListener('pointerout', handlePointerout, true);
  document.addEventListener('astro:page-load', initialize);
  initialize();

  window.__contentReview = {
    getPayload: buildPayload,
    clear: clearDraft,
  };
})();
