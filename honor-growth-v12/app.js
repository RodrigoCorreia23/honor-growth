(() => {
  'use strict';

  // Preserve inbound links from the existing campaigns and legal pages.
  const legacyAnchors = { sobre:'principios', ecossistema:'software', formula:'metodo', cases:'casos', resultados:'casos' };
  const legacyTarget = legacyAnchors[window.location.hash.slice(1)];
  if (legacyTarget) window.addEventListener('load', () => {
    history.replaceState(null, '', `#${legacyTarget}`);
    document.getElementById(legacyTarget)?.scrollIntoView({ behavior:'instant' });
  }, { once:true });

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smoothstep = (a, b, value) => {
    const t = clamp((value - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  const renderedProgress = new WeakMap();
  const sectionProgress = (section) => {
    if (!section) return 0;
    if (section.dataset.returnProgress) return Number(section.dataset.returnProgress);
    const rect = section.getBoundingClientRect();
    const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
    const progress=clamp(-rect.top / distance);
    renderedProgress.set(section,progress);
    return progress;
  };
  const pad = (value) => String(value).padStart(2, '0');

  const body = document.body;
  const header = document.getElementById('site-header');
  const nav = document.getElementById('main-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const cursor = document.querySelector('.cursor-orbit');
  const scrollMeter = document.querySelector('.scroll-meter span');

  const hero = document.querySelector('.hero-scroll');
  const heroSticky = document.querySelector('.hero-sticky');
  const principles = document.querySelector('.principles-scroll');
  const principleScenes = [...document.querySelectorAll('.principle-scene')];
  const principleRail = [...document.querySelectorAll('.principles-rail span')];
  const method = document.querySelector('.method-scroll');
  const methodScenes = [...document.querySelectorAll('.method-scene')];
  const methodVisual = document.querySelector('.method-visual');
  const processMap = document.querySelector('.process-map');
  const processPath = document.querySelector('.process-draw');
  const methodPulse = document.querySelector('.method-pulse');
  const capabilities = document.querySelector('.capabilities');
  const capabilityRows = [...document.querySelectorAll('.capability-row')];
  const crm = document.querySelector('.crm-scroll');
  const crmSticky = document.querySelector('.crm-sticky');
  const crmBuildLabels = [...document.querySelectorAll('.crm-build-label span')];
  const cases = document.querySelector('.cases-scroll');
  const casesSticky = document.querySelector('.cases-sticky');
  const caseTrack = document.querySelector('.case-track');
  const caseCounterCurrent = document.querySelector('.case-counter span');
  const team = document.querySelector('.team-scroll');
  const teamScenes = [...document.querySelectorAll('.team-scene')];
  const teamProgress = [...document.querySelectorAll('.team-progress span')];
  const crmTip = document.querySelector('.crm-tip');
  const allSections = [...document.querySelectorAll('main > section')];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileExperienceQuery = window.matchMedia('(max-width: 820px), (max-width: 960px) and (orientation: landscape)');
  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
  let isMobile = mobileExperienceQuery.matches;
  let lastScrollY = window.scrollY;
  let latestScrollY = window.scrollY;
  let dirty = true;
  let activeCaseIndex = 0;
  let heroProgress = 0;
  const movement = window.HonorMotion;
  const pinnedSections = [hero,principles,method,cases,team].filter(Boolean);
  // The opening is a reversible film. Only later content chapters take the short return path.
  const returnSections = pinnedSections.filter(section=>section!==hero);
  let previousFrameY = window.scrollY;
  let navigationFrame = 0;
  let navigationTimer = 0;
  let navigating = false;
  const caseSlides = [...document.querySelectorAll('.case-slide')];
  const manualStory = {cases:null};
  const manualStoryY = {cases:0};
  const compactStoryLayout = () => (viewportWidth<=820 && viewportHeight<=720)||(viewportHeight<=540 && viewportWidth>viewportHeight);
  let upwardIntentUntil=0,touchScrollY=null;
  window.addEventListener('wheel',event=>{upwardIntentUntil=event.deltaY<0?performance.now()+450:0;},{passive:true});
  window.addEventListener('touchstart',event=>{touchScrollY=event.touches[0]?.clientY;upwardIntentUntil=0;},{passive:true});
  window.addEventListener('touchmove',event=>{const y=event.touches[0]?.clientY;if(touchScrollY!==null && y!==undefined){upwardIntentUntil=y>touchScrollY?performance.now()+700:0;touchScrollY=y;}},{passive:true});
  window.addEventListener('keydown',event=>{if(event.target.closest('input,textarea,select,[contenteditable]'))return;if(['ArrowUp','PageUp','Home'].includes(event.key))upwardIntentUntil=performance.now()+450;});
  document.addEventListener('pointerdown',()=>{upwardIntentUntil=0;},{passive:true});

  // Keep native wheel/touch scrolling. On the way back, remove only the extra
  // animation runway and preserve the visible frame and document position.
  const updateReturnJourney = () => {
    const y=window.scrollY;
    if(reduceMotion || navigating || body.style.position==='fixed') { previousFrameY=y; return; }
    if(y < previousFrameY-2 && performance.now()<upwardIntentUntil) {
      for(const section of returnSections) {
        const rect=section.getBoundingClientRect();
        if(section.classList.contains('is-return-pass') || rect.top>=-16) continue;
        const height=section.offsetHeight;
        const viewport=section.firstElementChild?.offsetHeight || viewportHeight;
        if(height<=viewport+1) continue;
        const p=rect.bottom<=0 ? .96 : (renderedProgress.get(section)??sectionProgress(section));
        const plan=movement.returnLayout({top:rect.top,height,viewport,scrollY:window.scrollY});
        section.dataset.returnProgress=String(p);
        section.classList.add('is-return-pass');
        section.style.setProperty('--return-height',`${viewport}px`);
        window.scrollTo({top:plan.scrollY,behavior:'instant'});
      }
    } else if(y>previousFrameY+2) {
      for(const section of returnSections) {
        if(section.classList.contains('is-return-pass') && section.getBoundingClientRect().top>viewportHeight) {
          section.classList.remove('is-return-pass');
          delete section.dataset.returnProgress;
          section.style.removeProperty('--return-height');
        }
      }
    }
    previousFrameY=window.scrollY;
  };

  const showStory = (kind,p) => {
    const slides=caseSlides;
    const section=cases;
    const naturalLayout=reduceMotion;
    const staged=kind==='cases' && compactStoryLayout() && !reduceMotion;
    if(Math.abs(window.scrollY-manualStoryY[kind])>16 && !section.classList.contains('is-return-pass')) manualStory[kind]=null;
    const index=manualStory[kind]??movement.storyIndex(p,slides.length);
    const step=manualStory[kind]===null?movement.storyStep(p,slides.length):0;
    slides.forEach((slide,i)=>{
      const active=naturalLayout||i===index;
      slide.classList.toggle('is-active',active);
      slide.inert=!active;
      slide.setAttribute('aria-hidden',String(!active));
      // Short screens reveal Antes → Honor → Depois inside each case, using
      // the page scroll itself. No inner scrollbar or wheel interception.
      slide.querySelectorAll('.case-three section').forEach((detail,j)=>{
        const visible=!staged || j===step;
        detail.classList.toggle('is-story-step',visible);
        detail.setAttribute('aria-hidden',String(!visible));
      });
    });
    section?.querySelectorAll('[data-story]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.story)===index)));
    return index;
  };
  document.querySelectorAll('[data-story-picker]').forEach(picker=>{
    picker.addEventListener('click',event=>{
      const button=event.target.closest('[data-story]');
      if(!button) return;
      const kind=picker.dataset.storyPicker;
      const section=cases;
      const slides=caseSlides;
      if(reduceMotion){slides[Number(button.dataset.story)]?.scrollIntoView({behavior:'smooth',block:'start'});return;}
      if(!section.classList.contains('is-return-pass')) window.scrollTo({top:window.scrollY+section.getBoundingClientRect().top+(section.offsetHeight-viewportHeight)*movement.storyProgress(Number(button.dataset.story),slides.length),behavior:'instant'});
      manualStory[kind]=Number(button.dataset.story);
      manualStoryY[kind]=window.scrollY;
      showStory(kind,0);
      dirty=true;
    });
  });

  const cancelNavigation = () => {
    // Ordinary wheel/touch events must not reset the previous animation frame.
    // Doing so loses small upward gestures on high-resolution trackpads.
    if(!navigating) return;
    cancelAnimationFrame(navigationFrame);
    clearTimeout(navigationTimer);
    body.classList.remove('is-navigating');
    navigating=false;
    previousFrameY=window.scrollY;
  };
  window.addEventListener('wheel',cancelNavigation,{passive:true});
  window.addEventListener('touchstart',cancelNavigation,{passive:true});
  window.addEventListener('keydown',event=>{
    if(['Escape','ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key)) cancelNavigation();
  });
  document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
    if(event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target=document.getElementById(link.hash.slice(1));
    if(!target) return;
    event.preventDefault();
    cancelNavigation();
    navigating=true;
    const arrive=()=>{
      history.pushState(null,'',link.hash);
      target.setAttribute('tabindex','-1');
      target.focus({preventScroll:true});
      cancelNavigation();
      // A menu selection must leave its navigation visible at the destination.
      lastScrollY=window.scrollY;
      header?.classList.remove('is-hidden');
      dirty=true;
    };
    const destination=()=>{
      target.classList.remove('is-return-pass');
      delete target.dataset.returnProgress;
      if(target===cases) manualStory.cases=null;
      if(target===crm)delete crmSticky.dataset.exploring;
      return Math.max(0,target.getBoundingClientRect().top+window.scrollY-(pinnedSections.includes(target)?0:(header?.offsetHeight||0)+16));
    };
    const start=window.scrollY;
    const end=destination();
    if(reduceMotion){window.scrollTo({top:end,behavior:'instant'});arrive();return;}
    // Distant chapters dissolve instead of racing through thousands of pixels.
    if(Math.abs(end-start)>viewportHeight*1.8){
      body.classList.add('is-navigating');
      navigationTimer=setTimeout(()=>{
        window.scrollTo({top:destination(),behavior:'instant'});
        dirty=true;
        navigationFrame=requestAnimationFrame(()=>{navigationFrame=requestAnimationFrame(arrive);});
      },410);
    }else{
      const started=performance.now(),duration=movement.navigationDuration(end-start);
      const tick=now=>{
        const p=clamp((now-started)/duration);
        window.scrollTo({top:lerp(start,end,movement.ease(p)),behavior:'instant'});
        dirty=true;
        if(p<1) navigationFrame=requestAnimationFrame(tick); else arrive();
      };
      navigationFrame=requestAnimationFrame(tick);
    }
  }));

  const mobileRevealTargets = [
    document.querySelector('.capabilities-head'),
    ...document.querySelectorAll('.capability-row'),
    document.querySelector('.capability-detail'),
    document.querySelector('.video-stories__copy'),
    ...document.querySelectorAll('.video-story'),
    document.querySelector('.founder-story'),
    document.querySelector('.team-directory__head'),
    ...document.querySelectorAll('.team-card'),
    document.querySelector('.diagnostic-copy'),
    document.querySelector('.bot-shell'),
    document.querySelector('.contact-copy'),
    document.querySelector('.contact-form')
  ].filter(Boolean);
  mobileRevealTargets.forEach((target, index) => {
    target.classList.add('mobile-reveal-target');
    target.style.setProperty('--mobile-reveal-order', String(index % 6));
  });
  const mobileRevealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.target.classList.toggle('is-in-view', entry.isIntersecting));
      }, { threshold: .12, rootMargin: '0px 0px -8% 0px' })
    : null;
  mobileRevealTargets.forEach((target) => mobileRevealObserver?.observe(target));

  const syncExperienceMode = () => {
    body.classList.toggle('mobile-immersive', isMobile && !reduceMotion);
    if (crmTip) {
      crmTip.textContent = isMobile
        ? 'Explora o menu, muda o setor e toca nas oportunidades para as fazer avançar.'
        : 'Explora o menu, muda o setor e arrasta ou seleciona oportunidades para as fazer avançar.';
    }
  };
  syncExperienceMode();

  // Header and mobile navigation
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('is-open', !open);
    body.classList.toggle('menu-open', !open);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    body.classList.remove('menu-open');
  }));

  // Pointer treatment
  if (window.matchMedia('(pointer:fine)').matches && cursor) {
    body.classList.add('has-pointer');
    window.addEventListener('pointermove', (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    }, { passive: true });
    document.addEventListener('pointerover', (event) => {
      if (event.target.closest('a,button,.crm-card')) body.classList.add('pointer-large');
    });
    document.addEventListener('pointerout', (event) => {
      if (event.target.closest('a,button,.crm-card')) body.classList.remove('pointer-large');
    });
  }

  const updateHeader = () => {
    const scrollY = window.scrollY;
    header?.classList.toggle('is-scrolled', scrollY > 12);
    if (scrollY > lastScrollY + 6 && scrollY > 180 && !isMobile && !navigating) header?.classList.add('is-hidden');
    if (scrollY < lastScrollY - 6 || scrollY < 180) header?.classList.remove('is-hidden');
    lastScrollY = scrollY;

    const sampleY = (header?.offsetHeight || 70) + 3;
    const section = allSections.find((item) => {
      const rect = item.getBoundingClientRect();
      return rect.top <= sampleY && rect.bottom > sampleY;
    });
    let light = section && (['capacidades', 'equipa'].includes(section.id) || section.classList.contains('team-directory'));
    header?.classList.toggle('is-light', !!light);
  };

  const updateHero = () => {
    if (!hero || !heroSticky) return;
    const p = sectionProgress(hero);
    heroProgress = p;

    const copyExit = smoothstep(.07, .28, p);
    const splitOut = smoothstep(.16, .46, p);
    const splitBack = smoothstep(.46, .67, p);
    const splitAmount = splitOut * (1 - splitBack);
    const close = smoothstep(.63, .82, p);
    const logoFade = 1 - smoothstep(.72, .86, p);

    heroSticky.style.setProperty('--hero-copy-opacity', String(1 - copyExit));
    heroSticky.style.setProperty('--hero-copy-y', `${-72 * copyExit}px`);
    heroSticky.style.setProperty('--hero-copy-blur', `${8 * copyExit}px`);
    const splitDistance = isMobile ? 16 : 24;
    heroSticky.style.setProperty('--hero-h-x', `${-splitDistance * splitAmount}px`);
    heroSticky.style.setProperty('--hero-g-x', `${splitDistance * splitAmount}px`);
    heroSticky.style.setProperty('--hero-h-y', `${-18 * splitAmount}px`);
    heroSticky.style.setProperty('--hero-g-y', `${18 * splitAmount}px`);
    heroSticky.style.setProperty('--hero-h-r', `${-2.6 * splitAmount}deg`);
    heroSticky.style.setProperty('--hero-g-r', `${2.6 * splitAmount}deg`);
    heroSticky.style.setProperty('--hero-logo-scale', String(1 + (isMobile ? .42 : .62) * splitAmount - .22 * close));
    const mobileLogoLeft = viewportWidth > viewportHeight ? lerp(76, 68, smoothstep(.08, .34, p)) : 50;
    heroSticky.style.setProperty('--hero-logo-left', `${isMobile ? mobileLogoLeft : lerp(69, 50, smoothstep(.08, .28, p))}%`);
    heroSticky.style.setProperty('--hero-logo-opacity', String(logoFade));
    heroSticky.style.setProperty('--hero-mark-turn', `${-18 * splitAmount}deg`);
    heroSticky.style.setProperty('--hero-caption-opacity', String(1 - smoothstep(.08, .25, p)));
    heroSticky.style.setProperty('--hero-note-opacity', String(1 - smoothstep(0, .12, p)));
    heroSticky.style.setProperty('--hero-ambient-scale', String(1 + p * 1.2));
    heroSticky.style.setProperty('--hero-close-scale', String(close));
    heroSticky.style.setProperty('--hero-word-opacity', String(smoothstep(.72, .86, p)));
    heroSticky.style.setProperty('--hero-word-scale', String(lerp(.76, 1.04, smoothstep(.72, .9, p))));
  };

  const activatePrinciple = (index) => {
    principleScenes.forEach((scene, i) => scene.classList.toggle('is-active', i === index));
    principleRail.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  };
  const updatePrinciples = () => {
    if (!principles) return;
    const p = sectionProgress(principles);
    const index = p < .31 ? 0 : p < .62 ? 1 : 2;
    activatePrinciple(index);
    const sticky = principles.querySelector('.principles-sticky');
    sticky?.style.setProperty('--principles-image-y', `${-55 * p}px`);
    sticky?.style.setProperty('--principles-image-scale', String(1.12 - .06 * p));
    sticky?.style.setProperty('--principles-crop-top', `${8 * (1 - p)}%`);
    sticky?.style.setProperty('--principles-crop-bottom', `${8 * (1 - p)}%`);
    const statement = smoothstep(.78, .94, p);
    sticky?.style.setProperty('--principles-statement-opacity', String(statement));
    sticky?.style.setProperty('--principles-statement-y', `${35 * (1 - statement)}px`);
    sticky?.style.setProperty('--principles-scenes-opacity', String(isMobile ? 1 - smoothstep(.76, .88, p) : 1));
  };

  const activateMethod = (index) => {
    methodScenes.forEach((scene, i) => scene.classList.toggle('is-active', i === index));
    if (methodVisual) methodVisual.dataset.step = String(index);
  };
  const updateMethodPulse = (progress) => {
    if (!processPath || !processMap || !methodPulse) return;
    const length = processPath.getTotalLength();
    const point = processPath.getPointAtLength(length * progress);
    const svgPoint = processMap.createSVGPoint();
    svgPoint.x = point.x;
    svgPoint.y = point.y;
    const ctm = processMap.getScreenCTM();
    if (!ctm) return;
    const screenPoint = svgPoint.matrixTransform(ctm);
    const visualRect = methodVisual.getBoundingClientRect();
    methodPulse.style.left = `${screenPoint.x - visualRect.left}px`;
    methodPulse.style.top = `${screenPoint.y - visualRect.top}px`;
  };
  const updateMethod = () => {
    if (!method || !methodVisual) return;
    const p = sectionProgress(method);
    const index = Math.min(5, Math.floor(p * 6));
    activateMethod(index);
    methodVisual.style.setProperty('--method-path', String(p));
    methodVisual.style.setProperty('--method-progress', String(p));
    methodVisual.style.setProperty('--scatter-opacity', String(1 - smoothstep(.08, .68, p)));
    methodVisual.style.setProperty('--method-word-opacity', String(smoothstep(.83, .96, p)));
    methodVisual.style.setProperty('--method-word-y', `${42 * (1 - smoothstep(.83, .96, p))}px`);
    methodVisual.style.setProperty('--method-pulse-opacity', String(1 - smoothstep(.94, 1, p)));
    if (processPath) {
      processPath.style.strokeDasharray = '1';
      processPath.style.strokeDashoffset = String(1 - p);
    }
    updateMethodPulse(p);
  };

  const setCapability = (row) => {
    const open=row.getAttribute('aria-expanded')!=='true';
    capabilityRows.forEach((item) => {
      const active=item===row&&open;
      item.classList.toggle('is-active',active);
      item.setAttribute('aria-expanded',String(active));
      const panel=document.getElementById(item.getAttribute('aria-controls'));
      if(panel)panel.hidden=!active;
    });
    if(open)requestAnimationFrame(()=>{
      const top=row.getBoundingClientRect().top;
      const safeTop=(header?.getBoundingClientRect().height||64)+16;
      // Collapsing the previous product must not leave the new title behind the header.
      if(top<safeTop||top>viewportHeight*.6)window.scrollTo({top:window.scrollY+top-safeTop,behavior:reduceMotion?'instant':'smooth'});
    });
  };
  capabilityRows.forEach((row) => {
    row.addEventListener('click', () => setCapability(row));
  });

  // CRM demo data and drag/drop
  const crmData = {
    imobiliario: {
      title: 'Imobiliário', context: 'Motor de Angariação', heading: 'Oportunidades em movimento',
      stages: ['Nova oportunidade', 'Qualificação', 'Reunião', 'Proposta', 'Exclusivo'],
      metrics: ['68%', '24', '€186K'], signal: '18 leads sem resposta estão prontas para reativação.',
      cards: [
        [{t:'Proprietário · Braga',m:'T3 · 285K€',tag:'Origem: anúncio'},{t:'Proprietário · Guimarães',m:'Moradia · 410K€',tag:'Contacto há 8 min'},{t:'Base antiga · Famalicão',m:'Apartamento · intenção alta',tag:'Reativação'}],
        [{t:'Lead 024',m:'Motivação confirmada',tag:'Score 86'},{t:'Lead 031',m:'Prazo inferior a 90 dias',tag:'Score 79'}],
        [{t:'Reunião · 15:30',m:'Dossier preparado',tag:'Confirmada'},{t:'Reunião · amanhã',m:'Objeção: exclusividade',tag:'Preparar closer'}],
        [{t:'Proposta enviada',m:'Comissão e plano definidos',tag:'Aguardar decisão'}],
        [{t:'Angariação fechada',m:'Exclusivo · 6 meses',tag:'Onboarding'}]
      ]
    },
    energia: {
      title: 'Energia', context: 'Consultoria Energética', heading: 'Contratos em análise',
      stages: ['Lead', 'Auditoria', 'Reunião', 'Proposta', 'Contrato'],
      metrics: ['74%', '19', '€412K'], signal: 'Três renovações entram na janela ideal de contacto esta semana.',
      cards: [
        [{t:'PME · Porto',m:'Eletricidade + gás',tag:'Consumo elevado'},{t:'Indústria · Braga',m:'Renovação em 120 dias',tag:'Trigger ativo'},{t:'Hotel · Norte',m:'Auditoria solicitada',tag:'Inbound'}],
        [{t:'Faturas recebidas',m:'12 meses validados',tag:'A calcular'},{t:'Perfil de consumo',m:'Picos identificados',tag:'Poupança provável'}],
        [{t:'Reunião financeira',m:'Decisor confirmado',tag:'Hoje 16:00'},{t:'Reunião técnica',m:'Operação + compras',tag:'Amanhã'}],
        [{t:'Proposta multi-energia',m:'Poupança projetada',tag:'Em revisão'}],
        [{t:'Contrato aprovado',m:'24 meses',tag:'Implementação'}]
      ]
    },
    automovel: {
      title: 'Automóvel', context: 'Operação de Stand', heading: 'Procura até à entrega',
      stages: ['Interesse', 'Contacto', 'Test-drive', 'Financiamento', 'Entrega'],
      metrics: ['71%', '16', '€238K'], signal: 'Quatro leads com intenção alta ainda não receberam simulação de financiamento.',
      cards: [
        [{t:'SUV premium',m:'Entrada até 8K€',tag:'Meta Ads'},{t:'Sedan executivo',m:'Retoma disponível',tag:'Website'},{t:'Elétrico usado',m:'Entrega imediata',tag:'WhatsApp'}],
        [{t:'Lead 118',m:'Orçamento validado',tag:'Ligar hoje'},{t:'Lead 124',m:'Retoma por avaliar',tag:'Documentos recebidos'}],
        [{t:'Test-drive 11:00',m:'Viatura preparada',tag:'Confirmado'},{t:'Test-drive sábado',m:'Casal decisor',tag:'Follow-up'}],
        [{t:'Simulação aprovada',m:'TAEG aceite',tag:'Assinatura pendente'}],
        [{t:'Entrega agendada',m:'Documentação concluída',tag:'Sexta-feira'}]
      ]
    },
    b2b: {
      title: 'Serviços B2B', context: 'Revenue Pipeline', heading: 'Da prospeção ao onboarding',
      stages: ['Prospeção', 'Diagnóstico', 'Reunião', 'Decisão', 'Onboarding'],
      metrics: ['62%', '28', '€264K'], signal: 'A objeção preço aparece em 38% das chamadas e pede ajuste de argumentário.',
      cards: [
        [{t:'Empresa · 45 pessoas',m:'Founder como decisor',tag:'Cold email'},{t:'Grupo · 3 unidades',m:'Equipa comercial interna',tag:'LinkedIn'},{t:'SaaS · Portugal',m:'MRR em crescimento',tag:'Indicação'}],
        [{t:'Diagnóstico concluído',m:'Gargalo: follow-up',tag:'Alta prioridade'},{t:'Operação mapeada',m:'Sem SOP comercial',tag:'Fit forte'}],
        [{t:'Reunião de proposta',m:'Direção presente',tag:'Hoje'},{t:'Workshop de oferta',m:'Pricing em análise',tag:'Quinta-feira'}],
        [{t:'Condições enviadas',m:'Decisão em 7 dias',tag:'Follow-up'}],
        [{t:'Kickoff confirmado',m:'Equipa de 8 pessoas',tag:'Plano 60 dias'}]
      ]
    }
  };

  const crmBoard = document.getElementById('crm-board');
  const crmSectorTitle = document.getElementById('crm-sector-title');
  const crmContext = document.getElementById('crm-context');
  const crmHeading = document.getElementById('crm-heading');
  const metricResponse = document.getElementById('metric-response');
  const metricMeetings = document.getElementById('metric-meetings');
  const metricValue = document.getElementById('metric-value');
  const crmSignal = document.getElementById('crm-ai-signal');
  const sectorButtons = [...document.querySelectorAll('.sector-switcher button')];
  let draggedCard = null;

  const updateColumnCount = (column) => {
    const count = column.querySelectorAll('.crm-card').length;
    const badge = column.querySelector('header b');
    if (badge) badge.textContent = String(count);
    document.dispatchEvent(new CustomEvent('honor:crm-updated'));
  };
  const enableDrag = (card) => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Avançar oportunidade: ${card.querySelector('strong')?.textContent || 'oportunidade'}`);
    card.addEventListener('dragstart', () => {
      draggedCard = card;
      card.classList.add('is-dragging');
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('is-dragging');
      draggedCard = null;
      document.querySelectorAll('.crm-column').forEach((column) => column.classList.remove('is-over'));
    });
    const advanceByTouch = () => {
      if (!crmSticky?.classList.contains('is-interactive')) return;
      const current = card.closest('.crm-column');
      const next = current?.nextElementSibling;
      if (!current || !next?.classList.contains('crm-column')) return;
      next.querySelector('.crm-cards')?.appendChild(card);
      updateColumnCount(current);
      updateColumnCount(next);
      card.classList.remove('is-touch-moved');
      requestAnimationFrame(() => card.classList.add('is-touch-moved'));
      setTimeout(() => card.classList.remove('is-touch-moved'), 520);
    };
    card.addEventListener('click', advanceByTouch);
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      advanceByTouch();
    });
  };
  const renderCRM = (sector = 'imobiliario') => {
    const data = crmData[sector];
    if (!data || !crmBoard) return;
    crmSectorTitle.textContent = data.title;
    crmContext.textContent = data.context;
    crmHeading.textContent = data.heading;
    metricResponse.textContent = data.metrics[0];
    metricMeetings.textContent = data.metrics[1];
    metricValue.textContent = data.metrics[2];
    crmSignal.textContent = data.signal;

    [...crmBoard.querySelectorAll('.crm-column')].forEach((column, index) => {
      column.querySelector('header span').textContent = data.stages[index];
      const cardsWrap = column.querySelector('.crm-cards');
      cardsWrap.innerHTML = '';
      data.cards[index].forEach((item, cardIndex) => {
        const card = document.createElement('article');
        card.className = 'crm-card';
        card.draggable = true;
        card.style.transitionDelay = `${cardIndex * 55}ms`;
        card.innerHTML = `<strong>${item.t}</strong><p>${item.m}</p><span>${item.tag}</span>`;
        cardsWrap.appendChild(card);
        enableDrag(card);
      });
      updateColumnCount(column);
    });
    sectorButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.sector === sector));
  };

  document.querySelectorAll('.crm-column').forEach((column) => {
    column.addEventListener('dragover', (event) => { event.preventDefault(); column.classList.add('is-over'); });
    column.addEventListener('dragleave', () => column.classList.remove('is-over'));
    column.addEventListener('drop', (event) => {
      event.preventDefault();
      column.classList.remove('is-over');
      if (!draggedCard) return;
      const previous = draggedCard.closest('.crm-column');
      column.querySelector('.crm-cards').appendChild(draggedCard);
      updateColumnCount(column);
      if (previous) updateColumnCount(previous);
    });
  });
  sectorButtons.forEach((button) => button.addEventListener('click', () => renderCRM(button.dataset.sector)));
  renderCRM();

  document.querySelectorAll('.crm-nav button').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.crm-nav button').forEach((item) => item.classList.toggle('is-active', item === button));
  }));
  document.getElementById('crm-ai-action')?.addEventListener('click', (event) => {
    const button = event.currentTarget;
    button.textContent = 'Ação preparada';
    crmSignal.textContent = 'Segmento criado, mensagem preparada e revisão humana pedida antes da ativação.';
    setTimeout(() => { button.textContent = 'Preparar ação'; }, 2600);
  });

  const updateCRM = () => {
    if (!crm || !crmSticky) return;
    // The product is in normal document flow: no nested vertical scroll or runway.
    // Build it once as it enters view, then keep every control available on return.
    const windowPanel=crmSticky.querySelector('.crm-window');
    if (windowPanel?.getBoundingClientRect().top < viewportHeight * .92 || reduceMotion) crmSticky.dataset.revealed='true';
    const p = crmSticky.dataset.revealed || crmSticky.dataset.exploring ? 1 : 0;
    const introOut = smoothstep(.12, .27, p);
    const shell = smoothstep(.24, .39, p);
    const structure = smoothstep(.31, .45, p);
    const navIn = smoothstep(.38, .51, p);
    const dataIn = smoothstep(.44, .58, p);
    const boardIn = smoothstep(.51, .65, p);
    const cardsIn = smoothstep(.60, .74, p);
    const intelligence = smoothstep(.72, .87, p);
    const interactive = reduceMotion || p > .58;

    crmSticky.style.setProperty('--crm-intro-opacity', String(1 - introOut));
    crmSticky.style.setProperty('--crm-intro-y', `${-58 * introOut}px`);
    crmSticky.style.setProperty('--crm-window-opacity', String(shell));
    crmSticky.style.setProperty('--crm-window-reveal', String(shell));
    crmSticky.style.setProperty('--crm-window-scale', String(lerp(.86, 1, shell)));
    crmSticky.style.setProperty('--crm-window-y', `${110 * (1 - shell)}px`);
    crmSticky.style.setProperty('--crm-window-top', `${lerp(isMobile ? 44 : 46, isMobile ? 8 : 8, smoothstep(.27, .56, p))}%`);
    crmSticky.style.setProperty('--crm-window-height', `${lerp(isMobile ? 44 : 48, isMobile ? 82 : 82, smoothstep(.27, .56, p))}vh`);
    crmSticky.style.setProperty('--crm-structure-opacity', String(structure));
    crmSticky.style.setProperty('--crm-nav-opacity', String(navIn));
    crmSticky.style.setProperty('--crm-data-opacity', String(dataIn));
    crmSticky.style.setProperty('--crm-board-opacity', String(boardIn));
    crmSticky.style.setProperty('--crm-cards-opacity', String(cardsIn));
    crmSticky.style.setProperty('--crm-intelligence-opacity', String(intelligence));
    crmSticky.style.setProperty('--crm-tip-opacity', String(smoothstep(.82, .94, p)));
    crmSticky.style.setProperty('--crm-progress', String(p));
    crmSticky.classList.toggle('is-interactive', interactive);
    if(windowPanel)windowPanel.inert=!interactive;
    crmBuildLabels.forEach((label, index) => label.classList.toggle('is-active', p >= index / 5 - .02));
  };

  const updateCases = () => {
    if (!cases || !caseTrack || !casesSticky) return;
    const p = manualStory.cases===null ? sectionProgress(cases) : Math.max(.4,sectionProgress(cases));
    const travel = isMobile ? smoothstep(.13, .96, p) : smoothstep(.12, .94, p);
    const trackIn = smoothstep(.06, .14, p);
    if (!reduceMotion) {
      caseTrack.style.setProperty('--cases-x', '0px');
    } else {
      caseTrack.style.removeProperty('--cases-x');
    }
    activeCaseIndex = showStory('cases',p);
    if (caseCounterCurrent) caseCounterCurrent.textContent = pad(activeCaseIndex + 1);
    casesSticky.style.setProperty('--cases-progress', String(travel));
    casesSticky.style.setProperty('--cases-head-opacity', String(1 - smoothstep(.01,.06,p)));
    casesSticky.style.setProperty('--cases-head-y', `${-34 * smoothstep(.025,.12,p)}px`);
    casesSticky.classList.toggle('has-stories',trackIn>.95 || reduceMotion);
    const picker=casesSticky.querySelector('[data-story-picker]');
    if(picker)picker.inert=trackIn<=.95 && !reduceMotion;
    casesSticky.style.setProperty('--cases-track-opacity', String(trackIn));
    casesSticky.style.setProperty('--cases-track-y', `${32 * (1 - trackIn)}px`);
    const mobileExpand = isMobile ? smoothstep(.1, .22, p) : 0;
    casesSticky.style.setProperty('--cases-track-top', `${lerp(viewportWidth > viewportHeight ? 24 : 25, 7, mobileExpand)}%`);
    casesSticky.style.setProperty('--cases-track-height', `${lerp(viewportWidth > viewportHeight ? 73 : 72, 90, mobileExpand)}%`);
    casesSticky.classList.toggle('is-dark-counter', [0, 1, 5].includes(activeCaseIndex));
  };

  const updateTeam = () => {
    if (!team) return;
    const p = sectionProgress(team);
    const index = p < .34 ? 0 : p < .68 ? 1 : 2;
    teamScenes.forEach((scene, i) => {
      scene.classList.toggle('is-active', i === index);
      scene.inert=!reduceMotion && i!==index;
      scene.setAttribute('aria-hidden',String(!reduceMotion && i!==index));
    });
    teamProgress.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    const active = teamScenes[index];
    active?.querySelectorAll('img').forEach((image) => {
      image.style.transform = 'none';
    });
  };

  // Non-intrusive video stories: native modal keeps the visitor at the same scroll position.
  const videoDialog = document.getElementById('video-dialog');
  const storyVideo = document.getElementById('story-video');
  const videoDialogTitle = document.getElementById('video-dialog-title');
  const videoDialogClose = document.getElementById('video-dialog-close');
  let lockedScrollY = 0;
  const hoverPreview=document.getElementById('video-hover-preview');
  const hoverVideo=hoverPreview?.querySelector('video');
  let hoveredVideoButton=null;
  const closeVideoPreview=()=>{
    hoveredVideoButton=null;
    if(!hoverPreview || hoverPreview.hidden)return;
    hoverPreview.hidden=true;
    hoverVideo.pause();hoverVideo.removeAttribute('src');hoverVideo.load();
  };
  const openVideoPreview=button=>{
    if(videoDialog?.open || !hoverPreview || !window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    hoveredVideoButton=button;
    const width=Math.min(640,viewportWidth-48),height=Math.min(520,viewportHeight-120);
    hoverPreview.style.left=`${(viewportWidth-width)/2}px`;
    hoverPreview.style.top=`${(viewportHeight-height)/2}px`;
    hoverPreview.style.width=`${width}px`;hoverPreview.style.height=`${height}px`;
    hoverPreview.hidden=false;hoverVideo.muted=true;
    hoverVideo.poster=button.dataset.videoPoster||'';hoverVideo.src=button.dataset.videoSrc;
    hoverVideo.play().catch(()=>{});
  };

  const fitStoryVideo = () => {
    if (!storyVideo?.videoWidth || !storyVideo.videoHeight || !videoDialog) return;
    const aspect = clamp(storyVideo.videoWidth / storyVideo.videoHeight, .45, 2.4);
    videoDialog.style.setProperty('--video-aspect', String(aspect));
    videoDialog.classList.toggle('is-portrait', aspect < .9);
  };

  const lockPageForVideo = () => {
    lockedScrollY = window.scrollY;
    body.style.position = 'fixed';
    body.style.top = `${-lockedScrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
  };
  const unlockPageFromVideo = () => {
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    window.scrollTo({ top: lockedScrollY, left: 0, behavior: 'instant' });
    dirty = true;
  };
  const clearStoryVideo = () => {
    if (!storyVideo) return;
    storyVideo.pause();
    storyVideo.removeAttribute('src');
    storyVideo.removeAttribute('poster');
    storyVideo.load();
    videoDialog?.classList.remove('is-portrait');
    videoDialog?.style.removeProperty('--video-aspect');
  };
  const closeStoryVideo = () => {
    if (videoDialog?.open) videoDialog.close();
  };

  document.querySelectorAll('[data-video-src]').forEach((button) => {
    button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')openVideoPreview(button);});
    button.addEventListener('pointerleave',()=>{if(hoveredVideoButton===button)closeVideoPreview();});
    button.addEventListener('click', () => {
      const src = button.dataset.videoSrc;
      if (!src || !videoDialog || !storyVideo) return;
      closeVideoPreview();
      videoDialogTitle.textContent = button.dataset.videoTitle || 'Testemunho Honor Growth';
      storyVideo.src = src;
      if (button.dataset.videoPoster) storyVideo.poster = button.dataset.videoPoster;
      lockPageForVideo();
      videoDialog.showModal();
      storyVideo.play().catch(() => {});
    });
  });
  videoDialogClose?.addEventListener('click', closeStoryVideo);
  const closeOnScrollIntent=()=>{closeVideoPreview();closeStoryVideo();};
  window.addEventListener('wheel',closeOnScrollIntent,{passive:true});
  window.addEventListener('scroll',()=>{closeVideoPreview();if(videoDialog?.open && body.style.position!=='fixed')closeStoryVideo();},{passive:true});
  window.addEventListener('keydown',event=>{if(['PageDown','PageUp','Home','End','ArrowDown','ArrowUp'].includes(event.key))closeOnScrollIntent();});
  let videoTouchY=null;
  videoDialog?.addEventListener('touchstart',event=>{videoTouchY=event.touches[0]?.clientY;},{passive:true});
  videoDialog?.addEventListener('touchmove',event=>{if(videoTouchY!==null && Math.abs((event.touches[0]?.clientY||0)-videoTouchY)>24)closeStoryVideo();},{passive:true});
  storyVideo?.addEventListener('loadedmetadata', fitStoryVideo);
  videoDialog?.addEventListener('click', (event) => {
    if (event.target === videoDialog) closeStoryVideo();
  });
  videoDialog?.addEventListener('close', () => {
    clearStoryVideo();
    unlockPageFromVideo();
  });

  // Corporate portraits fall back to a branded monogram if an asset is unavailable.
  document.querySelectorAll('.team-card__media img').forEach((image) => {
    const markMissing = () => image.parentElement?.classList.add('is-missing');
    if (image.complete && image.naturalWidth === 0) markMissing();
    image.addEventListener('error', markMissing, { once:true });
  });

  // Local diagnostic bot
  const botMessages = document.getElementById('bot-messages');
  const botOptions = document.getElementById('bot-options');
  const botResult = document.getElementById('bot-result');
  const botRestart = document.getElementById('bot-restart');
  let botIssue = '';
  const botIssues = {
    leads: { label:'Leads sem resposta', reply:'O problema pode estar menos na procura e mais no tempo de resposta, na priorização e no seguimento.', title:'Valor a perder-se entre entrada e contacto', copy:'O primeiro diagnóstico deve medir origem, tempo de resposta, tentativas, canais, qualificação e motivos de abandono.' },
    noshow: { label:'Reuniões sem comparência', reply:'No-show raramente é apenas falta de interesse. Pode resultar de qualificação, contexto, confirmação ou distância até à reunião.', title:'A marcação não está a preparar a decisão', copy:'É necessário rever qualificação, janela de agendamento, confirmação, nutrição e handoff para o comercial.' },
    equipa: { label:'Equipa sem método', reply:'Quando cada pessoa vende à sua maneira, a empresa não consegue aprender nem repetir o que funciona.', title:'Execução dependente de improvisação', copy:'O diagnóstico deve mapear processo, scripts, objeções, handoffs, coaching, KPIs e responsabilidade por cada etapa.' },
    crm: { label:'CRM não reflete o processo', reply:'Quando o CRM é apenas arquivo, a equipa contorna-o e a gestão perde visibilidade sobre decisões importantes.', title:'Ferramenta desligada da operação real', copy:'É preciso redesenhar pipeline, campos, permissões, automações, alertas e reporting à volta do método comercial.' }
  };
  const addMessage = (text, type = 'assistant') => {
    const message = document.createElement('div');
    message.className = `bot-message bot-message--${type}`;
    message.innerHTML = `<p>${text}</p>`;
    botMessages.appendChild(message);
    botMessages.scrollTop = botMessages.scrollHeight;
  };
  const renderSecondQuestion = () => {
    botOptions.innerHTML = '';
    ['Há pouco volume', 'Há volume sem qualidade', 'Há oportunidades mas não fecham', 'Não conseguimos medir'].forEach((label, index) => {
      const button = document.createElement('button');
      button.textContent = label;
      button.dataset.depth = String(index);
      botOptions.appendChild(button);
    });
  };
  const showBotResult = (depth) => {
    const issue = botIssues[botIssue];
    const depthNotes = [
      'A prioridade é criar procura com direção e garantir que o sistema consegue responder a ela.',
      'A prioridade é alinhar ICP, mensagem, critérios e qualificação antes de aumentar o volume.',
      'A prioridade é observar as conversas, o processo de decisão e a execução da equipa.',
      'A prioridade é criar uma fonte de verdade para poder decidir e melhorar com confiança.'
    ];
    botOptions.hidden = true;
    botResult.hidden = false;
    botResult.querySelector('strong').textContent = issue.title;
    botResult.querySelector('p').textContent = `${issue.copy} ${depthNotes[depth] || ''}`;
  };
  botOptions?.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.value) {
      botIssue = button.dataset.value;
      const issue = botIssues[botIssue];
      addMessage(issue.label, 'user');
      botOptions.innerHTML = '';
      window.setTimeout(() => {
        addMessage(issue.reply, 'assistant');
        window.setTimeout(() => {
          addMessage('Qual destas situações descreve melhor o efeito no negócio?', 'assistant');
          renderSecondQuestion();
        }, 420);
      }, 360);
      return;
    }
    if (button.dataset.depth) {
      const depth = Number(button.dataset.depth);
      addMessage(button.textContent, 'user');
      botOptions.innerHTML = '';
      window.setTimeout(() => showBotResult(depth), 420);
    }
  });
  botRestart?.addEventListener('click', () => {
    botIssue = '';
    botMessages.innerHTML = '<div class="bot-message bot-message--assistant"><p>Antes de falar em solução, onde sentes que a operação perde mais valor?</p></div>';
    botResult.hidden = true;
    botOptions.hidden = false;
    botOptions.innerHTML = '<button data-value="leads">Leads sem resposta</button><button data-value="noshow">Reuniões sem comparência</button><button data-value="equipa">Equipa sem método</button><button data-value="crm">CRM não reflete o processo</button>';
  });

  // Contact data is validated in the browser and persisted only by the protected server route.
  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');
  const contactMessage=contactForm?.elements.namedItem('message');
  const updateContactCount=()=>{const counter=document.getElementById('contact-count');if(counter)counter.textContent=`${contactMessage?.value.length||0}/500`;};
  contactMessage?.addEventListener('input',updateContactCount);
  const newContactKey = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  let contactKey = newContactKey();
  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    contactStatus?.classList.remove('is-success','is-error');
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      if (contactStatus) {
        contactStatus.textContent = 'Confirma os campos obrigatórios antes de enviar.';
        contactStatus.classList.add('is-error');
      }
      return;
    }
    const submit = contactForm.querySelector('button[type="submit"]');
    const data = new FormData(contactForm);
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      company: String(data.get('company') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      formVersion: 2,
      urgency: String(data.get('urgency') || ''),
      message: String(data.get('message') || '').trim(),
      website: String(data.get('website') || ''),
      consent: data.get('consent') === 'on',
      diagnosticIssue: botIssue || '',
      idempotencyKey: contactKey
    };
    if (submit) submit.disabled = true;
    contactForm.setAttribute('aria-busy','true');
    if (contactStatus) contactStatus.textContent = 'A enviar o pedido…';
    try {
      const response = await fetch('/api/honor-growth/contact', {
        method:'POST',
        headers:{ 'content-type':'application/json', 'accept':'application/json' },
        body:JSON.stringify(payload),
        credentials:'same-origin'
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Não foi possível enviar o pedido.');
      contactForm.reset();
      updateContactCount();
      contactKey = newContactKey();
      if (contactStatus) {
        contactStatus.textContent = `Pedido recebido com a referência ${result.reference}.`;
        contactStatus.classList.add('is-success');
      }
    } catch (error) {
      if (contactStatus) {
        contactStatus.textContent = error instanceof Error ? error.message : 'Não foi possível enviar. Escreve-nos para hello@honor-growth.com.';
        contactStatus.classList.add('is-error');
      }
    } finally {
      if (submit) submit.disabled = false;
      contactForm.removeAttribute('aria-busy');
    }
  });

  const updateScrollMeter = () => {
    const max = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
    scrollMeter.style.transform = `scaleX(${clamp(window.scrollY / max)})`;
  };

  const updateAll = () => {
    updateHero();
    updatePrinciples();
    updateMethod();
    updateCRM();
    updateCases();
    updateTeam();
    updateHeader();
    updateScrollMeter();
  };

  const frame = () => {
    if (dirty) {
      updateReturnJourney();
      updateAll();
      dirty = false;
    }
    requestAnimationFrame(frame);
  };

  window.addEventListener('scroll', () => {
    latestScrollY = window.scrollY;
    dirty = true;
  }, { passive: true });
  window.addEventListener('resize', () => {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    isMobile = mobileExperienceQuery.matches;
    syncExperienceMode();
    pinnedSections.filter(section=>section.classList.contains('is-return-pass')).forEach(section=>{
      section.style.setProperty('--return-height',`${section.firstElementChild?.offsetHeight || viewportHeight}px`);
    });
    dirty = true;
  });
  window.addEventListener('load', () => {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    dirty = true;
  });

  requestAnimationFrame(frame);
})();
