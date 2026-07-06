window.HonorModal = (function () {
  'use strict';

  var _opened = false;
  var _prevFocus = null;
  var _el = {};
  var _pendingOpen = false;
  var _ready = { form: false };
  var _iframeLoadTimer = null;
  var _observer = null;
  var _maxWaitTimer = null;
  var MAX_WAIT_MS = 5000;

  /* ── focus trap ──────────────────────────────────────────────────────────── */
  function getFocusable() {
    return Array.from(
      _el.modal.querySelectorAll(
        'button:not([disabled]),a[href],iframe,[tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function _modalIframeId() {
    var formId = (
      window.HonorIntegrations &&
      window.HonorIntegrations.CONFIG &&
      window.HonorIntegrations.CONFIG.ghlFormId
    ) || 'eQoZuhMtktMEHwP0Pxty';
    return 'inline-' + formId;
  }

  /* ── readiness ───────────────────────────────────────────────────────────── */
  function _canOpen() {
    return _ready.form;
  }

  function _tryPendingOpen() {
    if (!_pendingOpen || !_canOpen()) return;
    clearTimeout(_maxWaitTimer);
    _maxWaitTimer = null;
    _pendingOpen = false;
    _openNow();
  }

  function _markFormReady() {
    if (_ready.form) return;
    _ready.form = true;
    _tryPendingOpen();
  }

  /* Revela o iframe (opacity 0→1) e sinaliza prontidão do formulário. */
  function _revealFormIframe() {
    var iframe = document.getElementById(_modalIframeId());
    if (!iframe || iframe.dataset.honorRevealed === 'true') return;
    iframe.dataset.honorRevealed = 'true';
    iframe.style.opacity = '1';
    _markFormReady();
  }

  /* ── formulário ──────────────────────────────────────────────────────────── */
  function _watchGhlPostMessage() {
    var GHL_ORIGIN = 'https://api.leadconnectorhq.com';
    window.addEventListener('message', function (e) {
      if (e.origin !== GHL_ORIGIN) return;
      if (_ready.form) return;
      var iframe = document.getElementById(_modalIframeId());
      if (!iframe || e.source !== iframe.contentWindow) return;
      var isSubmit = (
        (e.data && e.data.type   === 'form:submit') ||
        (e.data && e.data.action === 'formSubmit')  ||
        (typeof e.data === 'string' && e.data.includes('formSubmit'))
      );
      if (isSubmit) return;
      _revealFormIframe();
    });
  }

  /* Fallback: revela 1.5 s após o load do iframe. */
  function _bindFormReady() {
    var iframe = document.getElementById(_modalIframeId());
    if (!iframe || iframe.dataset.honorModalLoadBound === 'true') return;
    if (iframe.dataset.honorRevealed === 'true') { _markFormReady(); return; }
    iframe.dataset.honorModalLoadBound = 'true';
    iframe.addEventListener('load', function () {
      clearTimeout(_iframeLoadTimer);
      _iframeLoadTimer = setTimeout(_revealFormIframe, 1500);
    }, { once: true });
  }

  function _observeFormMount() {
    _bindFormReady();
    var container = document.getElementById('hg-ghl-modal');
    if (!container || _observer) return;
    _observer = new MutationObserver(_bindFormReady);
    _observer.observe(container, { childList: true, subtree: true });
  }

  /* ── open / close ────────────────────────────────────────────────────────── */
  function open() {
    if (_opened) return;
    _observeFormMount();
    _openNow();
  }

  function _openNow() {
    if (_opened) return;
    _opened = true;
    _markSeen();
    _prevFocus = document.activeElement;

    _el.modal.removeAttribute('inert');
    _el.modal.removeAttribute('aria-hidden');
    _el.modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(function () {
      _el.closeBtn.focus();
    });

    document.addEventListener('keydown', _onKeydown, true);
  }

  function close() {
    if (!_opened) return;
    _opened = false;
    _el.modal.classList.remove('is-open');
    _el.modal.setAttribute('aria-hidden', 'true');
    _el.modal.setAttribute('inert', '');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', _onKeydown, true);
    if (_prevFocus && typeof _prevFocus.focus === 'function') {
      _prevFocus.focus();
      _prevFocus = null;
    }
  }

  function _onKeydown(e) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    var focusable = getFocusable();
    if (!focusable.length) return;
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  /* ── analytics / postMessage de submit GHL ───────────────────────────────── */
  function _initAnalytics() {
    var GHL_ORIGIN = 'https://api.leadconnectorhq.com';
    var GHL_MODAL_ID = 'inline-' + (
      window.HonorIntegrations
        ? window.HonorIntegrations.CONFIG.ghlFormId
        : 'eQoZuhMtktMEHwP0Pxty'
    );

    window.addEventListener('message', function (e) {
      if (e.origin !== GHL_ORIGIN) return;
      var modalIframe = document.getElementById(GHL_MODAL_ID);
      if (!modalIframe) return;
      if (e.source !== modalIframe.contentWindow) return;

      var isSubmit = (
        (e.data && e.data.type   === 'form:submit') ||
        (e.data && e.data.action === 'formSubmit')  ||
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

  /* ── sessionStorage guard ────────────────────────────────────────────────── */
  var MODAL_KEY = 'ghl_lead_modal_seen_v3';

  function _shouldOpen() {
    try { return sessionStorage.getItem(MODAL_KEY) !== 'true'; } catch (e) { return true; }
  }

  function _markSeen() {
    try { sessionStorage.setItem(MODAL_KEY, 'true'); } catch (e) {}
  }

  /* ── init ────────────────────────────────────────────────────────────────── */
  function init() {
    _el.modal = document.getElementById('hg-modal');
    if (!_el.modal) return;

    _el.modal.setAttribute('inert', '');
    _el.closeBtn   = document.getElementById('hg-modal-close');

    _observeFormMount();
    _watchGhlPostMessage();

    _el.closeBtn.addEventListener('click', close);
    _el.modal.addEventListener('click', function (e) {
      if (e.target === _el.modal) close();
    });

    _initAnalytics();

    /* Auto-open na carga inicial — só se o utilizador ainda não viu o modal nesta sessão */
    if (_shouldOpen()) {
      _pendingOpen = true;
      _maxWaitTimer = setTimeout(function () {
        if (_pendingOpen) {
          _pendingOpen = false;
          _openNow();
        }
      }, MAX_WAIT_MS);
    }
  }

  /* Botões CTA: scroll suave até ao formulário fixo na secção #contacto */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-modal-trigger]');
    if (!trigger) return;
    e.preventDefault();
    var target = document.getElementById('contacto');
    if (!target) return;
    var y = target.getBoundingClientRect().top + window.scrollY - 74;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });

  return { init: init, open: open, close: close };
}());
