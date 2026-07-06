window.HonorModal = (function () {
  'use strict';

  var _opened = false;
  var _prevFocus = null;
  var _el = {};
  var _iframeLoadTimer = null;
  var _observer = null;

  /* ── focus trap ──────────────────────────────────────────────────────────── */
  function getFocusable() {
    return Array.from(
      _el.modal.querySelectorAll(
        'button:not([disabled]),a[href],iframe,[tabindex]:not([tabindex="-1"])'
      )
    );
  }

  /* ── video sync ──────────────────────────────────────────────────────────── */
  function syncSound() {
    var muted = _el.video.muted;
    _el.soundIcon.innerHTML   = muted ? SVG_MUTED : SVG_UNMUTED;
    _el.soundLabel.textContent = muted ? 'Ativar som' : 'Silenciar';
    _el.soundBtn.setAttribute('aria-label',   muted ? 'Ativar som' : 'Silenciar');
    _el.soundBtn.setAttribute('aria-pressed', muted ? 'false' : 'true');
    if (_el.soundOverlay) {
      if (!muted) {
        _soundOverlayDismissed = true;
        _el.soundOverlay.classList.add('is-hidden');
      } else if (!_soundOverlayDismissed) {
        _el.soundOverlay.classList.remove('is-hidden');
      }
    }
  }

  function syncPlay() {
    var stopped = _el.video.paused || _el.video.ended;
    _el.playIcon.innerHTML    = stopped ? SVG_PLAY : SVG_PAUSE;
    _el.playLabel.textContent = stopped ? 'Continuar' : 'Pausar';
    _el.playBtn.setAttribute('aria-label',   stopped ? 'Continuar reprodução' : 'Pausar vídeo');
    _el.playBtn.setAttribute('aria-pressed', stopped ? 'false' : 'true');
  }

  function _modalIframeId() {
    var formId = (
      window.HonorIntegrations &&
      window.HonorIntegrations.CONFIG &&
      window.HonorIntegrations.CONFIG.ghlFormId
    ) || 'eQoZuhMtktMEHwP0Pxty';
    return 'inline-' + formId;
  }

  /* Revela o iframe do formulário (opacity 0→1). */
  function _revealFormIframe() {
    var iframe = document.getElementById(_modalIframeId());
    if (!iframe || iframe.dataset.honorRevealed === 'true') return;
    iframe.dataset.honorRevealed = 'true';
    iframe.style.opacity = '1';
  }

  /* ── formulário ──────────────────────────────────────────────────────────── */
  function _watchGhlPostMessage() {
    var GHL_ORIGIN = 'https://api.leadconnectorhq.com';
    window.addEventListener('message', function (e) {
      if (e.origin !== GHL_ORIGIN) return;
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
    if (iframe.dataset.honorRevealed === 'true') return;
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
    _prevFocus = document.activeElement;

    _el.modal.removeAttribute('inert');
    _el.modal.removeAttribute('aria-hidden');
    _el.modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    _soundOverlayDismissed = false;
    if (_el.soundOverlay) _el.soundOverlay.classList.remove('is-hidden');
    _el.video.play().catch(function () {});

    if (window.HonorIntegrations) {
      window.HonorIntegrations.trackAnalytics('vsl_play');
    }

    requestAnimationFrame(function () {
      syncPlay();
      syncSound();
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
    _el.video.pause();
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

  /* ── init ────────────────────────────────────────────────────────────────── */
  function init() {
    _el.modal = document.getElementById('hg-modal');
    if (!_el.modal) return;

    _el.modal.setAttribute('inert', '');
    _el.container  = _el.modal.querySelector('.hg-modal-container');
    _el.closeBtn   = document.getElementById('hg-modal-close');
    _el.video      = document.getElementById('hg-modal-video');
    _el.soundBtn   = document.getElementById('hg-modal-sound');
    _el.soundIcon  = document.getElementById('hg-modal-sound-icon');
    _el.soundLabel = document.getElementById('hg-modal-sound-label');
    _el.playBtn    = document.getElementById('hg-modal-play');
    _el.playIcon   = document.getElementById('hg-modal-play-icon');
    _el.playLabel  = document.getElementById('hg-modal-play-label');
    _el.soundOverlay = document.getElementById('hg-modal-sound-overlay');

    _observeFormMount();
    _watchGhlPostMessage();

    _el.closeBtn.addEventListener('click', close);
    if (_el.soundOverlay) {
      _el.soundOverlay.addEventListener('click', function () {
        _el.video.muted = false;
        syncSound();
        if (_el.video.paused) _el.video.play().catch(function () {});
      });
    }
    _el.modal.addEventListener('click', function (e) {
      if (e.target === _el.modal) close();
    });

    _el.soundBtn.addEventListener('click', function () {
      _el.video.muted = !_el.video.muted;
      syncSound();
    });
    _el.playBtn.addEventListener('click', function () {
      if (_el.video.paused || _el.video.ended) {
        _el.video.play().catch(function () {});
      } else {
        _el.video.pause();
      }
      syncPlay();
    });

    _el.video.addEventListener('play',         syncPlay);
    _el.video.addEventListener('pause',        syncPlay);
    _el.video.addEventListener('ended',        syncPlay);
    _el.video.addEventListener('volumechange', syncSound);

    _initAnalytics();
  }

  /* Botões CTA: abrem o modal apenas após interação do utilizador. */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-modal-trigger]');
    if (!trigger) return;
    e.preventDefault();
    if (window.HonorMenu) window.HonorMenu.close();
    open();
  });

  return { init: init, open: open, close: close };
}());
