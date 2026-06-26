document.getElementById('hgYear').textContent = new Date().getFullYear();

    (function () {
        const menuBtn = document.getElementById('hgMenuBtn');
        const mobileMenu = document.getElementById('hgMobileMenu');
        const menuOpen = document.getElementById('hgMenuOpen');
        const menuClose = document.getElementById('hgMenuClose');
        if (!menuBtn || !mobileMenu) return;

        const openMenu = () => {
            mobileMenu.classList.remove('hidden');
            requestAnimationFrame(() => mobileMenu.classList.add('hg-mobile-menu-open'));
            menuOpen.classList.add('hidden');
            menuClose.classList.remove('hidden');
            menuBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        };
        const closeMenu = () => {
            mobileMenu.classList.remove('hg-mobile-menu-open');
            menuOpen.classList.remove('hidden');
            menuClose.classList.add('hidden');
            menuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            setTimeout(() => {
                if (!mobileMenu.classList.contains('hg-mobile-menu-open')) {
                    mobileMenu.classList.add('hidden');
                }
            }, 350);
        };

        menuBtn.addEventListener('click', () => {
            if (mobileMenu.classList.contains('hg-mobile-menu-open')) closeMenu();
            else openMenu();
        });
        document.querySelectorAll('[data-mobile-link]').forEach(a => {
            a.addEventListener('click', closeMenu);
        });
    })();

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseFloat(el.dataset.revealDelay || 0);
                setTimeout(() => el.classList.add('scroll-visible'), delay);
                revealObserver.unobserve(el);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    const legalRoot = document.querySelector('.hg-legal');
    if (legalRoot) {
        let group = [];
        const flush = () => {
            group.forEach((el, i) => {
                el.classList.add('scroll-hidden');
                el.dataset.revealDelay = i * 60;
                revealObserver.observe(el);
            });
            group = [];
        };
        Array.from(legalRoot.children).forEach((el) => {
            if (el.tagName === 'H2') flush();
            group.push(el);
        });
        flush();
    }
