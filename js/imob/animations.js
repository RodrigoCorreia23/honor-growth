window.HonorAnimations = {
  init() {
    this.applyAccent();
    this.initHeader();
    this.initReveal();
    this.initCounters();
  },
  applyAccent() {
    const root = document.querySelector('[data-honor-root]');
    if (root) root.style.setProperty('--accent', '#3a7dff');
  },
  initHeader() {
    const onScroll = () => {
      const sc = window.scrollY || document.documentElement.scrollTop;
      const h = document.querySelector('[data-honor-header]');
      if (h) {
        if (sc > 14) {
          h.style.background = 'rgba(10,10,12,.82)';
          h.style.backdropFilter = 'blur(14px)';
          h.style.webkitBackdropFilter = 'blur(14px)';
          h.style.borderBottomColor = 'rgba(255,255,255,.08)';
        } else {
          h.style.background = 'transparent';
          h.style.backdropFilter = 'blur(0px)';
          h.style.webkitBackdropFilter = 'blur(0px)';
          h.style.borderBottomColor = 'transparent';
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  },
  initReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    els.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity .75s cubic-bezier(.22,.61,.36,1), transform .75s cubic-bezier(.22,.61,.36,1)';
      el.style.transitionDelay = (el.getAttribute('data-reveal-delay') || '0') + 'ms';
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.style.opacity = '1';
          en.target.style.transform = 'none';
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -7% 0px' });
    els.forEach((el) => io.observe(el));
  },
  initCounters() {
    const els = document.querySelectorAll('[data-count]');
    const formatNumber = (value, decimals) => value.toFixed(decimals).replace('.', ',');
    els.forEach((el) => {
      const pre = el.getAttribute('data-pre') || '';
      const suf = el.getAttribute('data-suf') || '';
      const dec = parseInt(el.getAttribute('data-dec') || '0', 10);
      el.textContent = pre + formatNumber(0, dec) + suf;
    });
    const run = (el) => {
      const target = parseFloat(el.getAttribute('data-count'));
      const dec = parseInt(el.getAttribute('data-dec') || '0', 10);
      const pre = el.getAttribute('data-pre') || '';
      const suf = el.getAttribute('data-suf') || '';
      const dur = 1300;
      const start = performance.now();
      const step = (now) => {
        let p = Math.min(1, (now - start) / dur);
        p = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + formatNumber(target * p, dec) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.5 });
    els.forEach((el) => io.observe(el));
  }
};
