(function () {
  var shell = document.querySelector('[data-dev-tools]');
  if (!shell) return;

  var trigger = shell.querySelector('#developer-tools-trigger');
  var panel = shell.querySelector('#developer-tools-panel');
  if (!trigger || !panel) return;

  function setOpen(open) {
    shell.setAttribute('data-open', String(open));
    trigger.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
  }

  trigger.addEventListener('click', function () {
    setOpen(shell.getAttribute('data-open') !== 'true');
  });

  document.addEventListener('click', function (event) {
    if (!shell.contains(event.target)) setOpen(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setOpen(false);
  });
})();
