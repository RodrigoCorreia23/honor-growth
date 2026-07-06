/* Abre o modal GHL ao clicar num CTA [data-modal-trigger].
   Externalizado do HTML: a CSP (script-src 'self', sem 'unsafe-inline')
   bloqueia scripts inline. Nas páginas B2B não existe #contacto inline,
   por isso o handler do form.js retorna cedo — este é o único que abre o modal. */
document.addEventListener('click', function (e) {
  var trigger = e.target.closest('[data-modal-trigger]');
  if (!trigger) return;
  e.preventDefault();
  if (window.HonorModal) window.HonorModal.open();
});
