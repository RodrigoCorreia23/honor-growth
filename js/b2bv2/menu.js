window.HonorMenu = {
  panel: null,
  init() {
    this.panel = document.querySelector('.mobile-menu-panel');
    document.querySelectorAll('[data-menu-toggle]').forEach((button) => {
      button.addEventListener('click', () => this.toggle());
    });
  },
  toggle() { if (this.panel) this.panel.classList.toggle('is-hidden'); },
  close() { if (this.panel) this.panel.classList.add('is-hidden'); }
};
