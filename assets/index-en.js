(function () {
        const trustLogos = ["FLAVIOCAR", "NEURONIUM", "EASY GROWTH", "AKUAFONTIS", "HUBNOVA", "CENTURY 21 ALPHA", "RICARDO SILVA · RE/MAX VIP"];

        const modules = [
            { n: "01", tag: "Prospecting", title: "Automated acquisition", desc: "AI generates opportunities without your salesperson dialing by hand — they just close.", bullets: ["WhatsApp automation", "AI that manages opportunities", "Meetings booked by AI (text and voice)"], svg: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>' },
            { n: "02", tag: "Lead Management", title: "Inbound Scheduling", desc: "Every lead that enters the CRM is automatically qualified and scheduled.", bullets: ["Ads, partnerships, referrals", "Automatic qualification", "No human intervention"], svg: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>' },
            { n: "03", tag: "Nurturing", title: "Confirmation & show-up", desc: "A system built with you to make sure leads show up to the meeting.", bullets: ["Confirmation sequences", "Automatic lead warm-up", "Higher show-up rate"], svg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
            { n: "04", tag: "Reactivation", title: "No lead gets lost", desc: "The salesperson fills in the report after the meeting. The system triggers the right agent.", bullets: ['"No-show" agent calls', '"Cancellation" agent calls', "Reactivations bring leads back to the pipeline"], svg: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>' },
            { n: "05", tag: "Training", title: "Sales Training", desc: "SOP documentation and standardization of the entire sales operation and back office.", bullets: ["SOP documentation", "Standardized operation", "Sales + back office aligned"], svg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>' },
            { n: "06", tag: "Optimization", title: "Metrics Analysis", desc: "KPI analysis, funnel optimization and continuous improvements, month after month.", bullets: ["KPI analysis", "Funnel optimization", "Continuous improvements month after month"], svg: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>' },
        ];

        const testimonials = [
            { name: "Rodrigo", company: "Eleve Scale", metric: "", metricLabel: "", poster: "/assets/mov1-poster.jpg", videoUrl: "/assets/mov1-web.mp4" },
            { name: "Hugo", company: "HubNova · Energy Consulting", metric: "", metricLabel: "", poster: "", videoUrl: "/assets/hubnovahugo.mp4", cornerLogo: "/assets/hubnova-logo.png" },
        ];

        const cases = [
            { logo: "Honor", logoImg: "/assets/logo-honor1.png", desc: "Our own success story. We applied the AI ecosystem to Honor's own sales department to internally validate the system we use with clients.", headline: "Before: 100 calls → 3 meetings. Today: 50 calls → 8 meetings booked.", metricBig: "+167%", metricLabel: "meetings with -50% effort", desafios: [{ title: "Cold calls only", desc: "All acquisition depended on manual cold calls." }, { title: "High effort, low return", desc: "100 calls to get just 3 meetings booked." }], solucoes: [{ title: "WhatsApp + Automations", desc: "WhatsApp as the main outreach channel." }, { title: "AI Qualification", desc: "An AI agent qualifies leads at scale." }], resultados: [{ title: "50 calls → 8 meetings", desc: "Half the effort, more than double the meetings." }, { title: "Revenue ×2.5", desc: "We jumped from ~€15-20K/month to €45K/month." }] },
            { logo: "Flaviocar", logoImg: "/assets/flaviocarsvg.svg", desc: "B2C car dealership with a strong local presence.", headline: "+€120,000 in revenue in the 2nd month of the partnership.", metricBig: "€120k", metricLabel: "in the 2nd month", desafios: [{ title: "Limited acquisition", desc: "Almost total dependence on walk-in traffic and referrals." }], solucoes: [], resultados: [{ title: "+€120k in month 2", desc: "A digital pipeline fed by automated outreach." }] },
            { logo: "Neuronium", logoImg: "/assets/logo-site neuronium.svg", desc: "B2B marketing agency running as a one-man show.", headline: "+62% average pricing and €12,400 in closed contracts.", metricBig: "+62%", metricLabel: "average pricing", desafios: [{ title: "Single founder, low pricing", desc: "An operation entirely centered on the founder, with no sales leverage." }], solucoes: [], resultados: [{ title: "+62% average pricing", desc: "€12,400 in contracts closed after repositioning." }] },
            { logo: "Easy Growth", logoImg: "/assets/easy growth .webp", desc: "B2B marketing agency whose operation didn't match the partners' potential.", headline: "Revenue ×3 by month 4 and +40% net margin.", metricBig: "×3", metricLabel: "revenue by month 4", desafios: [{ title: "Misaligned operation", desc: "Sales processes lagged behind the partners' potential." }], solucoes: [], resultados: [{ title: "Revenue ×3 by month 4", desc: "+40% net margin with the same team." }] },
            { logo: "Click2Connect", logoImg: "/assets/click2connect.png", desc: "Digital agency focused on turning paid traffic into qualified meetings for B2B clients.", headline: "Revenue ×1.4 and double the daily bookings in the 1st month of the partnership.", metricBig: "×1.4", metricLabel: "revenue", desafios: [], solucoes: [], resultados: [{ title: "Revenue ×1.4", desc: "Revenue increase after implementing the ecosystem." }, { title: "+20% conversion", desc: "Qualified-lead-to-closed-deal rate, on average." }, { title: "2× bookings/day", desc: "In 1 month of partnership: from 2 to 4 daily meetings." }] },
            { logo: "HubNova", logoImg: "/assets/hubnova-logo.png", desc: "Energy consultancy that grew from €10-15K to €40K per month by structuring the sales operation, reducing no-shows and holding 11 AI-qualified meetings.", headline: "From €10-15K to €40K per month with 11 meetings qualified by AI.", metricBig: "€40K", metricLabel: "monthly revenue (from ~€13K)", desafios: [{ title: "High no-show rate", desc: "Many booked meetings never happened." }, { title: "Unstructured operation", desc: "Revenue stuck at €10-15K per month." }], solucoes: [], resultados: [{ title: "11 qualified meetings", desc: "AI-qualified bookings, with fewer no-shows." }, { title: "Repositioned offer", desc: "More qualified leads and a team converting more." }] },
        ];

        const team = [
            { name: "João", role: "CEO & Closer", photo: "/assets/joao-web.jpg" },
            { name: "Margarida", role: "Head of Delivery", photo: "/assets/margarida-web.jpg" },
            { name: "Diogo Veloso", role: "Prospecting Team", photo: "/assets/diogo-web.jpg" },
            { name: "David Sandu", role: "Senior Cold Caller", photo: "/assets/david.jpeg" },
            { name: "Érica", role: "Finance", photo: "/assets/Erica.jpeg" },
            { name: "Rodrigo Correia", role: "Software Engineer", photo: "/assets/rodrigo.jpg" },
            { name: "William Fox", role: "Cold Caller", photo: "/assets/last-person.jpeg" },
            { name: "Ricardo Rodrigues", role: "Software Engineer", photo: "/assets/ricardo.png" },
            { name: "Carlos", role: "AI Voice & Text Agent", photo: "/assets/Carlos2.jpg" },
        ];

        const marquee = document.getElementById('hgMarquee');
        [...trustLogos, ...trustLogos, ...trustLogos, ...trustLogos].forEach(l => {
            const div = document.createElement('div');
            div.className = "hg-display text-2xl md:text-3xl font-light flex-shrink-0";
            div.style.cssText = "color: var(--text-3); letter-spacing: 0.08em;";
            div.textContent = l;
            marquee.appendChild(div);
        });

        const setMarqueeDuration = () => {
            if (!marquee || !marquee.scrollWidth) return;
            const isMobile = window.innerWidth < 640;
            const pxPerSec = isMobile ? 95 : 80;
            const duration = (marquee.scrollWidth / 2) / pxPerSec;
            marquee.style.animationDuration = duration.toFixed(1) + 's';
            marquee.style.webkitAnimationDuration = duration.toFixed(1) + 's';
        };
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(setMarqueeDuration);
        }
        requestAnimationFrame(setMarqueeDuration);
        window.addEventListener('resize', setMarqueeDuration, { passive: true });

        const modulesEl = document.getElementById('hgModules');
        modules.forEach(m => {
            const div = document.createElement('div');
            div.className = "hg-card p-8 lg:p-10 relative";
            div.style.background = "var(--bg)";
            div.innerHTML = `
      <div class="flex items-start justify-between mb-8">
        <div class="hg-num text-5xl font-medium" style="line-height:1;">${m.n}</div>
        <div class="w-10 h-10 rounded-md flex items-center justify-center" style="background:var(--accent-soft);border:1px solid rgba(168,213,255,0.2);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent);">${m.svg}</svg>
        </div>
      </div>
      <div class="hg-tag inline-flex text-[10px] hg-mono uppercase tracking-wider px-2 py-1 rounded mb-3">${m.tag}</div>
      <h3 class="hg-display text-xl font-medium mb-3 leading-tight">${m.title}</h3>
      <p class="text-sm leading-relaxed mb-5" style="color:var(--text-2);">${m.desc}</p>
      <ul class="space-y-2">
        ${m.bullets.map(b => `<li class="flex items-start gap-2 text-xs" style="color:var(--text);"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent);margin-top:4px;flex-shrink:0;"><path d="M20 6 9 17l-5-5"/></svg><span>${b}</span></li>`).join('')}
      </ul>`;
            modulesEl.appendChild(div);
        });

        const renderTestimonialVideo = (mountEl, t, autoplay = true) => {
            if (!mountEl || !t) return;
            const card = document.createElement('div');
            card.className = "hg-video-card";
            const posterContent = t.poster ? `<img src="${t.poster}" alt="${t.name}" />` : `<div class="hg-display text-7xl font-medium" style="color:var(--text-3);opacity:0.4;">${t.name.charAt(0)}</div>`;
            const cornerLogo = t.cornerLogo ? `<img src="${t.cornerLogo}" alt="${t.name}" class="hg-video-corner-logo" />` : '';
            card.innerHTML = `
      <div class="hg-video-poster">${posterContent}</div>
      <div class="hg-video-play" style="width:72px;height:72px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style="color:#0a0a0a;margin-left:4px;"><polygon points="6 3 20 12 6 21 6 3"/></svg>
      </div>
      ${cornerLogo}
      <div class="hg-video-overlay">
        <div class="text-base font-medium" style="color:var(--text);">${t.name}</div>
        <div class="text-xs hg-mono uppercase tracking-wider" style="color:var(--text-3);">${t.company}</div>
      </div>`;
            let testimonialVideo = null;
            const startTestimonial = (muted) => {
                if (!t.videoUrl || testimonialVideo) return;
                const poster = card.querySelector('.hg-video-poster');
                const play = card.querySelector('.hg-video-play');
                const overlay = card.querySelector('.hg-video-overlay');
                testimonialVideo = document.createElement('video');
                testimonialVideo.src = t.videoUrl;
                testimonialVideo.controls = true;
                testimonialVideo.playsInline = true;
                testimonialVideo.muted = muted;
                testimonialVideo.preload = 'auto';
                if (t.poster) testimonialVideo.poster = t.poster;
                testimonialVideo.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;inset:0;z-index:3;opacity:0;transition:opacity 0.3s ease;';
                card.appendChild(testimonialVideo);
                card.style.cursor = 'default';
                if (overlay) {
                    overlay.style.transition = 'opacity 0.3s ease';
                    overlay.style.zIndex = '4';
                    overlay.style.pointerEvents = 'none';
                    card.addEventListener('mouseenter', () => { overlay.style.opacity = '0'; });
                    card.addEventListener('mouseleave', () => { overlay.style.opacity = '1'; });
                }
                const revealVideo = () => {
                    testimonialVideo.style.opacity = '1';
                    if (poster) poster.style.display = 'none';
                    if (play) play.style.display = 'none';
                };
                testimonialVideo.addEventListener('playing', revealVideo, { once: true });
                testimonialVideo.play().catch(() => {});
            };
            const cardClickHandler = (e) => {
                if (testimonialVideo) return;
                if (!t.videoUrl) { alert('Add videoUrl to the testimonials array'); return; }
                startTestimonial(false);
                card.removeEventListener('click', cardClickHandler);
            };
            card.addEventListener('click', cardClickHandler);
            mountEl.appendChild(card);

            if (!t.poster && t.videoUrl) {
                const posterEl = card.querySelector('.hg-video-poster');
                const probe = document.createElement('video');
                probe.src = t.videoUrl;
                probe.muted = true;
                probe.playsInline = true;
                probe.preload = 'metadata';
                probe.addEventListener('loadeddata', () => {
                    try { probe.currentTime = Math.min(0.1, (probe.duration || 1) - 0.01); } catch (e) {}
                });
                probe.addEventListener('seeked', () => {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = probe.videoWidth;
                        canvas.height = probe.videoHeight;
                        canvas.getContext('2d').drawImage(probe, 0, 0, canvas.width, canvas.height);
                        if (posterEl && !testimonialVideo) posterEl.innerHTML = `<img src="${canvas.toDataURL('image/jpeg', 0.82)}" alt="${t.name}" />`;
                    } catch (e) {}
                }, { once: true });
            }

            if (autoplay && 'IntersectionObserver' in window) {
                const testObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && !testimonialVideo) {
                            startTestimonial(true);
                            testObserver.disconnect();
                        }
                    });
                }, { threshold: 0.5 });
                testObserver.observe(card);
            }
        };
        renderTestimonialVideo(document.getElementById('hgFeaturedTestimonial'), testimonials[0], true);
        renderTestimonialVideo(document.getElementById('hgHubnovaTestimonial'), testimonials[1], false);

        const casesEl = document.getElementById('hgCases');
        cases.forEach(c => {
            const div = document.createElement('div');
            div.className = "hg-card p-8 md:p-10 relative";
            div.style.background = "var(--bg)";
            const logoStylesMap = {
                "Honor": "max-width:200px;height:56px;",
                "Flaviocar": "filter:brightness(0) invert(1);object-fit:contain;object-position:center center;",
                "Click2Connect": "filter:brightness(0) invert(1);object-fit:contain;object-position:center center;height:70px;max-width:220px;",
                "Neuronium": "filter:invert(1) grayscale(1) brightness(1.15) contrast(1.1);mix-blend-mode:lighten;",
                "Easy Growth": "mix-blend-mode:lighten;",
                "HubNova": "object-fit:contain;object-position:left center;height:44px;max-width:190px;"
            };
            const logoStyle = logoStylesMap[c.logo] ? ` style="${logoStylesMap[c.logo]}"` : '';
            const logoHtml = c.logoImg ? `<img src="${c.logoImg}" alt="${c.logo}" class="hg-case-logo"${logoStyle} />` : `<div class="hg-display text-2xl font-medium">${c.logo}</div>`;
            div.innerHTML = `
      <div class="grid md:grid-cols-12 gap-8 items-start">
        <div class="md:col-span-3">${logoHtml}<p class="text-sm leading-relaxed mt-4" style="color:var(--text-2);">${c.desc}</p></div>
        <div class="md:col-span-6">
          <p class="text-lg font-medium leading-snug mb-4" style="color:var(--text);">${c.headline}</p>
          ${c.desafios.length ? `<div class="space-y-3">${c.desafios.map(d => `<div><span class="text-xs hg-mono uppercase tracking-wider" style="color:var(--text-3);">${d.title} · </span><span class="text-sm" style="color:var(--text-2);">${d.desc}</span></div>`).join('')}</div>` : ''}
          ${c.resultados.length ? `<div class="mt-4 space-y-3">${c.resultados.map(r => `<div><span class="text-xs hg-mono uppercase tracking-wider" style="color:var(--accent);">${r.title} · </span><span class="text-sm" style="color:var(--text-2);">${r.desc}</span></div>`).join('')}</div>` : ''}
        </div>
        <div class="md:col-span-3 text-center md:text-right">
          <div class="hg-display text-4xl md:text-5xl font-medium mb-1" style="color:var(--accent);">${c.metricBig}</div>
          <div class="text-xs hg-mono uppercase tracking-wider" style="color:var(--text-3);">${c.metricLabel}</div>
        </div>
      </div>`;
            casesEl.appendChild(div);
        });

        const teamEl = document.getElementById('hgTeam');
        team.forEach(m => {
            const div = document.createElement('div');
            div.className = "hg-team-card";
            const initial = m.name.charAt(0);
            div.innerHTML = `
      <div class="hg-team-bg">${m.photo ? `<img src="${m.photo}" alt="${m.name}" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" />` : initial}</div>
      <div class="hg-team-overlay"></div>
      <div class="hg-team-info">
        <div class="text-sm font-medium" style="color:var(--text);">${m.name}</div>
        <div class="text-xs hg-mono uppercase tracking-wider mt-0.5" style="color:var(--text-3);">${m.role}</div>
      </div>`;
            teamEl.appendChild(div);
        });

        const yearEl = document.getElementById('hgYear');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        const nav = document.getElementById('hgNav');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) nav.classList.add('hg-nav-scrolled');
            else nav.classList.remove('hg-nav-scrolled');
        }, { passive: true });

        const menuBtn = document.getElementById('hgMenuBtn');
        const mobileMenu = document.getElementById('hgMobileMenu');
        const menuOpen = document.getElementById('hgMenuOpen');
        const menuClose = document.getElementById('hgMenuClose');

        const openMobileMenu = () => {
            mobileMenu.classList.remove('hidden');
            requestAnimationFrame(() => mobileMenu.classList.add('hg-mobile-menu-open'));
            menuOpen.classList.add('hidden');
            menuClose.classList.remove('hidden');
            menuBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        };
        const closeMobileMenu = () => {
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

        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                if (mobileMenu.classList.contains('hg-mobile-menu-open')) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            });
        }
        document.querySelectorAll('[data-mobile-link]').forEach(a => {
            a.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        const vslPlaceholder = document.getElementById('hgVslPlaceholder');
        const vslVideo = document.getElementById('hgVslVideo');
        if (vslPlaceholder && vslVideo) {
            const hidePlaceholder = () => vslPlaceholder.classList.add('hg-vsl-hidden');

            ['play', 'playing', 'loadeddata'].forEach(evt =>
                vslVideo.addEventListener(evt, hidePlaceholder, { once: true })
            );

            vslPlaceholder.addEventListener('click', () => {
                vslVideo.muted = false;
                hidePlaceholder();
                vslVideo.play().catch(() => {});
            });

            const vslSection = document.getElementById('vsl');
            if (vslSection && 'IntersectionObserver' in window) {
                const vslObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && vslVideo.paused) {
                            vslVideo.muted = true;
                            vslVideo.playsInline = true;
                            vslVideo.play().then(hidePlaceholder).catch(() => {
                            });
                            vslObserver.disconnect();
                        }
                    });
                }, { threshold: 0.5 });
                vslObserver.observe(vslSection);
            }
        }

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseFloat(el.dataset.revealDelay || 0);
                    setTimeout(() => el.classList.add('scroll-visible'), delay);
                    revealObserver.unobserve(el);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll(
            '#sobre, #promessa, #pilares, #ecossistema, #formula, #testemunhos, #cases, #equipa, #contacto'
        ).forEach(section => {
            section.querySelectorAll('h2, .hg-eyebrow').forEach((el, i) => {
                el.classList.add('scroll-hidden');
                el.dataset.revealDelay = i * 60;
                revealObserver.observe(el);
            });
            section.querySelectorAll('.hg-card, .hg-team-card, .hg-video-card').forEach((el, i) => {
                el.classList.add('scroll-hidden');
                el.dataset.revealDelay = i * 80;
                revealObserver.observe(el);
            });
            section.querySelectorAll('p.text-xl, p.text-lg').forEach((el, i) => {
                el.classList.add('scroll-hidden');
                el.dataset.revealDelay = i * 50 + 80;
                revealObserver.observe(el);
            });
            section.querySelectorAll('.hg-method-step').forEach((el, i) => {
                el.classList.add('scroll-hidden');
                el.dataset.revealDelay = i * 90;
                revealObserver.observe(el);
            });
        });

        const counterEls = document.querySelectorAll('[data-counter]');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.counter, 10);
                    const suffix = el.dataset.suffix || '';
                    let current = 0;
                    const duration = 900;
                    const steps = 40;
                    const increment = target / steps;
                    const interval = duration / steps;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            el.textContent = target + suffix;
                            clearInterval(timer);
                        } else {
                            el.textContent = Math.floor(current) + suffix;
                        }
                    }, interval);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counterEls.forEach(el => counterObserver.observe(el));

        document.querySelectorAll('a[href="#contacto"]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.umami) umami.track('home_en_cta_click', { lp: 'home_en', label: btn.textContent.trim().substring(0, 50) });
            });
        });

        document.addEventListener('click', (e) => {
            const card = e.target.closest('.hg-video-card');
            if (!card || card.querySelector('video')) return;
            const name = card.querySelector('.text-base')?.textContent || 'unknown';
            if (window.umami) umami.track('home_en_video_play', { lp: 'home_en', label: name });
        });

        if (vslPlaceholder) {
            vslPlaceholder.addEventListener('click', () => {
                if (window.umami) umami.track('home_en_vsl_play', { lp: 'home_en' });
            }, { once: true });
        }

        window.addEventListener('message', (e) => {
            if (e.data && (e.data.type === 'form:submit' || e.data.action === 'formSubmit' ||
                (typeof e.data === 'string' && e.data.includes('formSubmit')))) {
                if (window.umami) umami.track('home_en_generate_lead', { lp: 'home_en', form: 'ghl' });
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                window.open('/analytics.html', '_blank');
            }
        });

    })();
