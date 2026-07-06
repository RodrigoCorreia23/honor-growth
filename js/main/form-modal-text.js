window.HonorModal = (function () {
  'use strict';

  var opened = false;
  var previousFocus = null;
  var el = {};
  var iframeLoadTimer = null;
  var observer = null;

  function getFocusable() {
    return Array.from(
      el.modal.querySelectorAll(
        'button:not([disabled]),a[href],iframe,[tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function getModalIframeId() {
    var formId = (
      window.HonorIntegrations &&
      window.HonorIntegrations.CONFIG &&
      window.HonorIntegrations.CONFIG.ghlFormId
    ) || 'eQoZuhMtktMEHwP0Pxty';

    return 'inline-' + formId;
  }

  function revealFormIframe() {
    var iframe = document.getElementById(getModalIframeId());
    if (!iframe || iframe.dataset.honorRevealed === 'true') return;
    iframe.dataset.honorRevealed = 'true';
    iframe.style.opacity = '1';
  }

  function bindFormReady() {
    var iframe = document.getElementById(getModalIframeId());
    if (!iframe || iframe.dataset.honorModalLoadBound === 'true') return;
    if (iframe.dataset.honorRevealed === 'true') return;

    iframe.dataset.honorModalLoadBound = 'true';
    iframe.addEventListener('load', function () {
      clearTimeout(iframeLoadTimer);
      iframeLoadTimer = setTimeout(revealFormIframe, 1500);
    }, { once: true });
  }

  function observeFormMount() {
    bindFormReady();
    var container = document.getElementById('hg-ghl-modal');
    if (!container || observer) return;

    observer = new MutationObserver(bindFormReady);
    observer.observe(container, { childList: true, subtree: true });
  }

  function watchGhlMessages() {
    var GHL_ORIGIN = 'https://api.leadconnectorhq.com';

    window.addEventListener('message', function (e) {
      if (e.origin !== GHL_ORIGIN) return;

      var iframe = document.getElementById(getModalIframeId());
      if (!iframe || e.source !== iframe.contentWindow) return;

      var isSubmit = (
        (e.data && e.data.type === 'form:submit') ||
        (e.data && e.data.action === 'formSubmit') ||
        (typeof e.data === 'string' && e.data.includes('formSubmit'))
      );

      if (isSubmit) return;
      revealFormIframe();
    });
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close();
      return;
    }

    if (e.key !== 'Tab') return;

    var focusable = getFocusable();
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
      return;
    }

    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function open() {
    if (opened) return;

    observeFormMount();
    opened = true;
    previousFocus = document.activeElement;

    el.modal.removeAttribute('inert');
    el.modal.removeAttribute('aria-hidden');
    el.modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(function () {
      el.closeBtn.focus();
    });

    document.addEventListener('keydown', onKeydown, true);
  }

  function close() {
    if (!opened) return;

    opened = false;
    el.modal.classList.remove('is-open');
    el.modal.setAttribute('aria-hidden', 'true');
    el.modal.setAttribute('inert', '');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown, true);

    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
      previousFocus = null;
    }
  }

  function initAnalytics() {
    var GHL_ORIGIN = 'https://api.leadconnectorhq.com';
    var modalIframeId = 'inline-' + (
      window.HonorIntegrations
        ? window.HonorIntegrations.CONFIG.ghlFormId
        : 'eQoZuhMtktMEHwP0Pxty'
    );

    window.addEventListener('message', function (e) {
      if (e.origin !== GHL_ORIGIN) return;

      var modalIframe = document.getElementById(modalIframeId);
      if (!modalIframe || e.source !== modalIframe.contentWindow) return;

      var isSubmit = (
        (e.data && e.data.type === 'form:submit') ||
        (e.data && e.data.action === 'formSubmit') ||
        (typeof e.data === 'string' && e.data.includes('formSubmit'))
      );

      if (!isSubmit) return;

      var successEl = document.getElementById('ghl-form-success');
      modalIframe.style.display = 'none';
      if (successEl) successEl.style.display = 'block';

      if (window.HonorIntegrations) {
        window.HonorIntegrations.trackAnalytics('generate_lead', { form: 'ghl' });
      }
    });
  }

  function init() {
    el.modal = document.getElementById('hg-modal');
    if (!el.modal) return;

    el.modal.setAttribute('inert', '');
    el.closeBtn = document.getElementById('hg-modal-close');

    observeFormMount();
    watchGhlMessages();

    el.closeBtn.addEventListener('click', close);
    el.modal.addEventListener('click', function (e) {
      if (e.target === el.modal) close();
    });

    initAnalytics();
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-modal-trigger]');
    if (!trigger) return;

    e.preventDefault();
    if (window.HonorMenu) window.HonorMenu.close();
    open();
  });

  return { init: init, open: open, close: close };
}());
