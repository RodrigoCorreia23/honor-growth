(function () {
  'use strict';

  var IFRAME_ID = 'calc-gate-ghl-iframe';
  var LEAD_STORAGE_KEY = 'embedded_iframe_' + IFRAME_ID;
  var _done = false;

  function unlock() {
    if (_done) return;
    _done = true;
    var results = document.getElementById('hg-team-results-area');
    var gate    = document.getElementById('calc-gate');
    if (results) results.classList.remove('calc-results--gated');
    if (gate)    gate.classList.add('calc-gate--hidden');
    if (window.HonorIntegrations) {
      window.HonorIntegrations.trackAnalytics('calc_gate_submit');
    }
  }

  function cfg() {
    return (window.HonorIntegrations && window.HonorIntegrations.CONFIG) || {};
  }

  function isSubmitMessage(data) {
    /*
     * O embed oficial do GHL envia este evento apenas depois de guardar o
     * contacto. A chave identifica este iframe e evita aceitar mensagens de
     * outros formulários existentes na página.
     */
    if (
      Array.isArray(data) &&
      data[0] === 'set-sticky-contacts' &&
      data[1] === LEAD_STORAGE_KEY
    ) {
      return true;
    }

    if (
      window.HonorIntegrations &&
      typeof window.HonorIntegrations.isGhlSubmitMessage === 'function'
    ) {
      return window.HonorIntegrations.isGhlSubmitMessage(data);
    }

    if (!data) return false;
    if (data.type === 'form:submit') return true;
    if (data.action === 'formSubmit') return true;
    if (typeof data === 'string' && data.indexOf('formSubmit') !== -1) return true;
    return false;
  }

  function loadGhlEmbed() {
    var src = cfg().ghlEmbedScriptUrl;
    if (!src || document.querySelector('script[src="' + src + '"]')) return;
    var s = document.createElement('script');
    s.src = src;
    document.body.appendChild(s);
  }

  function buildIframe() {
    var c      = cfg();
    var formId = c.ghlFormId || '';
    var iframe = document.createElement('iframe');
    iframe.id  = IFRAME_ID;
    iframe.src = (c.ghlIframeBaseUrl || '') + formId;
    iframe.style.cssText = 'width:100%;height:420px;border:none;border-radius:8px;display:block;';
    iframe.setAttribute('data-layout',             "{'id':'INLINE'}");
    iframe.setAttribute('data-trigger-type',       'alwaysShow');
    iframe.setAttribute('data-trigger-value',      '');
    iframe.setAttribute('data-activation-type',    'alwaysActivated');
    iframe.setAttribute('data-activation-value',   '');
    iframe.setAttribute('data-deactivation-type',  'neverDeactivate');
    iframe.setAttribute('data-deactivation-value', '');
    iframe.setAttribute('data-form-name',          'calc gate');
    iframe.setAttribute('data-height',             '420');
    iframe.setAttribute('data-layout-iframe-id',   IFRAME_ID);
    iframe.setAttribute('data-form-id',            formId);
    iframe.setAttribute('title',                   'Ver a tua análise');
    return iframe;
  }

  function bindSubmitUnlock(iframe) {
    var origin = cfg().ghlOrigin || 'https://api.leadconnectorhq.com';

    window.addEventListener('message', function (e) {
      if (_done) return;
      if (e.origin !== origin) return;
      if (!iframe || e.source !== iframe.contentWindow) return;
      if (!isSubmitMessage(e.data)) return;
      unlock();
    });
  }

  function init() {
    var container = document.getElementById('calc-gate-ghl-container');
    if (!container) return;

    var iframe = buildIframe();
    container.appendChild(iframe);
    loadGhlEmbed();
    bindSubmitUnlock(iframe);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
