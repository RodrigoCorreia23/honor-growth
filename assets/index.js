(function () {
        const trustLogos = ["FLAVIOCAR", "NEURONIUM", "EASY GROWTH", "AKUAFONTIS", "HUBNOVA", "CENTURY 21 ALPHA", "RICARDO SILVA · RE/MAX VIP"];

        const phases = [
            { n: "01", title: "Análise & Direção", phase: "FASE 1 · FUNDAÇÃO", phaseSub: "Dia 0 → Dia 60", desc: "Diagnóstico ao negócio para identificar bloqueios comerciais e definir o plano de ação.", svg: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="m16 16-1.9-1.9"/>' },
            { n: "02", title: "Proposta de Valor", phase: "FASE 1 · FUNDAÇÃO", phaseSub: "Dia 0 → Dia 60", desc: "Reestruturação da oferta e definição de pontos de exclusividade que elevam o ticket.", svg: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>' },
            { n: "03", title: "Ecossistema IA", phase: "FASE 1 · FUNDAÇÃO", phaseSub: "Dia 0 → Dia 60", desc: "Implementação em 60 dias de IA para gestão e prospecção de leads inbound + outbound.", svg: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>', link: "#ecossistema" },
            { n: "04", title: "Formação Comercial", phase: "FASE 2 · ESCALA & OTIMIZAÇÃO", phaseSub: "Mês 2 → Mês 4", desc: "Acompanhamento contínuo da equipa durante 4 meses, com role-plays e análise de chamadas.", svg: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>' },
            { n: "05", title: "Padronização", phase: "FASE 2 · ESCALA & OTIMIZAÇÃO", phaseSub: "Mês 2 → Mês 4", desc: "Documentação de SOPs e padronização de toda a operação comercial e back office.", svg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>' },
            { n: "06", title: "Otimização Contínua", phase: "FASE 2 · ESCALA & OTIMIZAÇÃO", phaseSub: "Mês 2 → Mês 4", desc: "Análise de KPIs, otimização de funis e melhorias contínuas, mês após mês.", svg: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>' },
        ];

        const modules = [
            { n: "01", tag: "Prospecção", title: "Aquisição automática", desc: "A IA gera oportunidades sem o teu comercial ter de ligar à mão — só fecha.", bullets: ["WhatsApp automation", "IA que gere oportunidades", "Reuniões agendadas por IA (texto e voz)"], svg: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>' },
            { n: "02", tag: "Gestão de Leads", title: "Agendamento Inbound", desc: "Qualquer lead que entre no CRM é qualificada e agendada automaticamente.", bullets: ["Anúncios, parcerias, referências", "Qualificação automática", "Sem intervenção humana"], svg: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>' },
            { n: "03", tag: "Nutrição", title: "Confirmação & aparecimento", desc: "Sistema construído contigo para garantir que as leads aparecem à reunião.", bullets: ["Sequências de confirmação", "Aquecimento automático da lead", "Taxa de aparecimento mais alta"], svg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
            { n: "04", tag: "Reativação", title: "Nenhuma lead se perde", desc: "Comercial preenche o relatório no fim da reunião. O sistema dispara o agente certo.", bullets: ['Agente "no-show" liga', 'Agente "cancelamento" liga', "Reativações trazem leads à pipeline"], svg: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>' },
        ];

        const testimonials = [
            { name: "Rodrigo", company: "Eleve Scale", metric: "", metricLabel: "", poster: "assets/mov1-poster.jpg", videoUrl: "assets/mov1-web.mp4" },
            { name: "Flaviocar", company: "Stand Automóvel B2C", metric: "", metricLabel: "", poster: "", videoUrl: "assets/flaviocar-video.mp4", cornerLogo: "assets/flaviocarsvg.svg" },
        ];

        const cases = [
            { logo: "Honor", logoImg: "assets/logo-honor1.png", desc: "O nosso próprio caso de sucesso. Aplicámos o ecossistema de IA ao departamento comercial da Honor para validar internamente o sistema que usamos com os clientes.", headline: "Antes 100 chamadas → 3 reuniões. Hoje 50 chamadas → 8 reuniões agendadas.", metricBig: "+167%", metricLabel: "reuniões com -50% esforço", desafios: [{ title: "Só chamadas a frio", desc: "Toda a aquisição dependia de chamadas frias manuais." }, { title: "Esforço alto, retorno baixo", desc: "100 chamadas para conseguir apenas 3 reuniões agendadas." }], solucoes: [{ title: "WhatsApp + Automatismos", desc: "WhatsApp como canal principal de outreach." }, { title: "IA na Qualificação", desc: "Agente de IA qualifica leads em escala." }], resultados: [{ title: "50 chamadas → 8 reuniões", desc: "Metade do esforço, mais do dobro das reuniões." }, { title: "Faturação ×2,5", desc: "Saltámos de ~15-20K€/mês para 45K€/mês." }] },
            { logo: "Flaviocar", logoImg: "assets/flaviocarsvg.svg", desc: "Stand de venda automóvel B2C com forte presença local.", headline: "+120.000€ faturados no 2º mês de parceria.", metricBig: "120k€", metricLabel: "no 2º mês", desafios: [{ title: "Aquisição limitada", desc: "Dependência quase total de tráfego presencial e referências." }], solucoes: [], resultados: [{ title: "+120k€ no 2º mês", desc: "Pipeline digital alimentado por outreach automatizado." }] },
            { logo: "Neuronium", logoImg: "assets/logo-site neuronium.svg", desc: "Agência de marketing B2B que operava em modelo 'one-man-show'.", headline: "+62% de pricing médio e 12.400€ em contratos fechados.", metricBig: "+62%", metricLabel: "de pricing médio", desafios: [{ title: "Sócio único e pricing baixo", desc: "Operação totalmente centrada no fundador, sem leverage comercial." }], solucoes: [], resultados: [{ title: "+62% pricing médio", desc: "12.400€ em contratos fechados após reposicionamento." }] },
            { logo: "Easy Growth", logoImg: "assets/easy growth .webp", desc: "Agência de marketing B2B com operação desalinhada com o potencial dos sócios.", headline: "Faturação ×3 ao 4º mês e +40% de margem líquida.", metricBig: "×3", metricLabel: "faturação ao 4º mês", desafios: [{ title: "Operação desalinhada", desc: "Processos comerciais não acompanhavam o potencial dos sócios." }], solucoes: [], resultados: [{ title: "×3 faturação ao 4º mês", desc: "+40% margem líquida com a mesma equipa." }] },
            { logo: "Click2Connect", logoImg: "assets/click2connect.png", desc: "Agência digital focada em transformar tráfego pago em reuniões qualificadas para clientes B2B.", headline: "Faturação ×1,4 e o dobro de agendamentos diários ao 1º mês de parceria.", metricBig: "×1,4", metricLabel: "de faturação", desafios: [], solucoes: [], resultados: [{ title: "Faturação ×1,4", desc: "Aumento da faturação após implementação do ecossistema." }, { title: "+20% conversão", desc: "Taxa de lead qualificada para negócio fechado, em média." }, { title: "2× agendamentos/dia", desc: "Em 1 mês de parceria: de 2 para 4 reuniões diárias." }] },
        ];

        const team = [
            { name: "João", role: "CEO & Closer", photo: "assets/joao-web.jpg" },
            { name: "Margarida", role: "Head of Delivery", photo: "assets/margarida-web.jpg" },
            { name: "Diogo Veloso", role: "Equipa de Prospecção", photo: "assets/diogo-web.jpg" },
            { name: "David Sandu", role: "Cold Caller Sénior", photo: "assets/david.jpeg" },
            { name: "Érica", role: "Financeira", photo: "assets/Erica.jpeg" },
            { name: "Rodrigo Correia", role: "Software Engineer", photo: "assets/rodrigo.jpg" },
            { name: "William Fox", role: "Cold Caller", photo: "assets/last-person.jpeg" },
            { name: "Ricardo Rodrigues", role: "Software Engineer", photo: "assets/ricardo.png" },
            { name: "Carlos", role: "AI Voice & Text Agent", photo: "assets/Carlos2.jpg" },
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

        const methodEl = document.getElementById('hgMethod');
        phases.forEach((p, i) => {
            const div = document.createElement('div');
            div.className = "hg-method-step";
            if (i === 3) div.dataset.phaseStart = "2";
            const mobilePhase = (i === 0 || i === 3) ? `<div class="hg-method-mobile-phase"><div class="hg-method-phase-tag">${p.phase}</div><div class="hg-method-phase-sub">${p.phaseSub}</div></div>` : '';
            if (p.link) { div.style.cursor = 'pointer'; div.addEventListener('click', () => document.querySelector(p.link).scrollIntoView({ behavior: 'smooth' })); }
            div.innerHTML = `${mobilePhase}<div class="hg-method-circle">${p.n}</div><div class="hg-method-content"><h3 class="hg-method-title">${p.title}</h3><p class="hg-method-desc">${p.desc}</p></div>`;
            methodEl.appendChild(div);
        });

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
                if (!t.videoUrl) { alert('Adiciona videoUrl no array testimonials'); return; }
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
        renderTestimonialVideo(document.getElementById('hgFlaviocarTestimonial'), testimonials[1], false);

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
                "Easy Growth": "mix-blend-mode:lighten;"
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
                umami.track('cta_click', { label: btn.textContent.trim().substring(0, 50) });
            });
        });

        document.addEventListener('click', (e) => {
            const card = e.target.closest('.hg-video-card');
            if (!card || card.querySelector('video')) return;
            const name = card.querySelector('.text-base')?.textContent || 'unknown';
            umami.track('video_play', { label: name });
        });

        if (vslPlaceholder) {
            vslPlaceholder.addEventListener('click', () => {
                umami.track('vsl_play');
            }, { once: true });
        }

        window.addEventListener('message', (e) => {
            if (e.data && (e.data.type === 'form:submit' || e.data.action === 'formSubmit' ||
                (typeof e.data === 'string' && e.data.includes('formSubmit')))) {
                umami.track('generate_lead', { form: 'ghl' });
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                window.open('analytics.html', '_blank');
            }
        });

    })();
