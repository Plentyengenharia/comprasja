(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var panel = document.querySelector('[data-nav-panel]');
  if (!toggle || !panel) return;

  // Header uses backdrop-filter, which creates a fixed containing block and
  // collapses the drawer. Reparent to <body> so inset uses the viewport.
  if (panel.parentElement !== document.body) {
    document.body.appendChild(panel);
  }

  var focusableSelector =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    panel.hidden = !open;
    document.body.classList.toggle('nav-open', open);
    if (open) {
      var first = panel.querySelector(focusableSelector);
      if (first) first.focus();
    } else {
      toggle.focus();
    }
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
    }
  });

  panel.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setOpen(false);
    });
  });

  // Contact form → mailto (no backend)
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var honeypot = form.querySelector('[name="company_url"]');
      if (honeypot && honeypot.value) return;
      var name = (form.querySelector('[name="name"]') || {}).value || '';
      var email = (form.querySelector('[name="email"]') || {}).value || '';
      var message = (form.querySelector('[name="message"]') || {}).value || '';
      var to = form.getAttribute('data-mailto') || 'contato@plentyengenharia.com.br';
      var subject = encodeURIComponent('Contato Compras Já — ' + name);
      var body = encodeURIComponent(
        'Nome: ' + name + '\nE-mail: ' + email + '\n\n' + message,
      );
      var status = form.querySelector('[data-contact-status]');
      if (status) {
        status.hidden = false;
        status.textContent =
          'Abrindo seu cliente de e-mail… Se nada abrir, escreva para ' + to + '.';
      }
      window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
    });
  }
})();
