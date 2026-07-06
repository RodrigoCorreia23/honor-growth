document.addEventListener('click', function (e) {
        var trigger = e.target.closest('[data-modal-trigger]');
        if (!trigger) return;
        e.preventDefault();
        if (window.HonorModal) window.HonorModal.open();
      });
