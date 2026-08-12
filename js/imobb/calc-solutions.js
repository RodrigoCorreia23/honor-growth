(function (App) {
  /* Conteúdo de cada modal, indexado pelo data-solution do card. */
  var SOLUTIONS = {
    inactivity: {
      eyebrow: "1 · Equipa inativa",
      title: "Como pomos a equipa toda a angariar",
      lead: "Quando só uma parte da equipa faz prospeção, o resultado depende sempre das mesmas pessoas. O problema quase nunca é falta de vontade — é falta de rotina, de material e de acompanhamento.",
      items: [
        "<strong>Rotina de prospeção definida.</strong> Cada consultor sabe quantos contactos faz por dia, a quem e com que abordagem. Deixa de ser iniciativa individual e passa a ser processo.",
        "<strong>Scripts e materiais prontos.</strong> Abordagem a proprietários, resposta às objeções mais comuns e apresentação de angariação — testados, não improvisados.",
        "<strong>Metas por consultor e painel semanal.</strong> Toda a gente vê os números da semana. O que não é medido não muda.",
        "<strong>Acompanhamento próximo nas primeiras semanas.</strong> Estamos com a equipa até a rotina pegar, não entregamos um manual e desaparecemos."
      ],
      outcome: "O objetivo é simples: que a produção deixe de depender de duas ou três pessoas e passe a ser da equipa."
    },
    conversion: {
      eyebrow: "2 · Baixa conversão de leads",
      title: "Como transformamos mais leads em vendas",
      lead: "Gerar leads é a parte fácil. A maior parte perde-se no que acontece a seguir: demora na resposta, follow-up inconsistente e falta de método no fecho.",
      items: [
        "<strong>Resposta em minutos, não em dias.</strong> Automatizamos o primeiro contacto para que nenhuma lead fique à espera — é aí que se ganha ou perde a maioria.",
        "<strong>Qualificação antes da visita.</strong> A equipa passa o tempo com quem tem intenção e capacidade de compra, em vez de o gastar em visitas que não levam a lado nenhum.",
        "<strong>Follow-up estruturado.</strong> Sequências definidas para quem não responde à primeira. A maioria das vendas acontece depois do quinto contacto.",
        "<strong>Formação em fecho.</strong> Trabalhamos objeções, negociação e proposta com a equipa, com casos reais da vossa operação."
      ],
      outcome: "Subir a conversão de 2% para 4% não exige mais leads nem mais investimento em anúncios — exige tratar melhor as que já entram."
    },
    database: {
      eyebrow: "3 · Base de dados adormecida",
      title: "Como reativamos a base de dados",
      lead: "As leads que não compraram no mês passado não desapareceram — mudaram de timing. Sem reativação, ficam no CRM a perder valor todos os meses.",
      items: [
        "<strong>Limpeza e segmentação.</strong> Separamos quem ainda está no mercado, quem mudou de critério e quem já comprou, para falar a cada grupo do que interessa.",
        "<strong>Campanhas de reativação.</strong> Sequências de email, SMS e WhatsApp com motivo concreto para voltar ao contacto — imóvel novo na zona, mudança de preço, alteração de mercado.",
        "<strong>Requalificação assistida por IA.</strong> Retoma conversas antigas em escala e devolve à equipa apenas quem responde com intenção real.",
        "<strong>Devolução ao pipeline.</strong> Quem reage entra no processo comercial normal, com o mesmo follow-up de uma lead nova."
      ],
      outcome: "Converter 1% de uma base parada costuma ser o retorno mais rápido de toda a operação — o custo de aquisição já foi pago."
    },
    listings: {
      eyebrow: "4 · Possibilidade de angariação",
      title: "Como chegamos ao objetivo de angariações",
      lead: "A distância entre o que a equipa angaria hoje e o objetivo raramente se fecha com mais esforço. Fecha-se com um sistema de captação que produz todos os meses.",
      items: [
        "<strong>Captação previsível de proprietários.</strong> Campanhas de avaliação de imóvel e conteúdo de zona que geram contactos de quem está a pensar vender.",
        "<strong>Farming de zona.</strong> A equipa passa a ter território definido e presença constante, em vez de angariar ao acaso.",
        "<strong>Processo de angariação padronizado.</strong> Da avaliação à assinatura, com argumentário de comissão e prazos — menos angariações perdidas para a concorrência.",
        "<strong>Objetivo desdobrado por consultor.</strong> O número da equipa transforma-se em metas individuais semanais, com acompanhamento."
      ],
      outcome: "Mais angariações significam mais stock, mais visitas e mais vendas — é o topo do funil que puxa todo o resto."
    }
  };

  var modal, panel, closeBtn, eyebrowEl, titleEl, leadEl, listEl, outcomeEl;
  var isOpen = false;
  var prevFocus = null;

  function getFocusable() {
    if (!panel) return [];
    return Array.prototype.slice.call(
      panel.querySelectorAll('a[href], button:not([disabled])')
    ).filter(function (el) { return el.offsetParent !== null; });
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== "Tab") return;
    var focusable = getFocusable();
    if (!focusable.length) return;
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function open(key) {
    var content = SOLUTIONS[key];
    if (!content || !modal || isOpen) return;

    eyebrowEl.textContent = content.eyebrow;
    titleEl.textContent   = content.title;
    leadEl.textContent    = content.lead;
    outcomeEl.textContent = content.outcome;
    listEl.innerHTML = content.items.map(function (item) {
      return "<li>" + item + "</li>";
    }).join("");

    modal.setAttribute("data-theme", key);
    prevFocus = document.activeElement;
    modal.removeAttribute("inert");
    modal.removeAttribute("aria-hidden");
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    isOpen = true;

    requestAnimationFrame(function () { closeBtn.focus(); });
    document.addEventListener("keydown", onKeydown, true);

    if (window.HonorIntegrations) {
      window.HonorIntegrations.trackAnalytics("calc_solution_open", { card: key });
    }
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("inert", "");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown, true);
    if (prevFocus && typeof prevFocus.focus === "function") {
      prevFocus.focus();
      prevFocus = null;
    }
  }

  function init() {
    modal = document.getElementById("hg-solution-modal");
    if (!modal) return;
    panel     = modal.querySelector(".solution-modal__panel");
    closeBtn  = document.getElementById("hg-solution-close");
    eyebrowEl = document.getElementById("hg-solution-eyebrow");
    titleEl   = document.getElementById("hg-solution-title");
    leadEl    = document.getElementById("hg-solution-lead");
    listEl    = document.getElementById("hg-solution-list");
    outcomeEl = document.getElementById("hg-solution-outcome");

    document.addEventListener("click", function (e) {
      var card = e.target.closest("[data-solution]");
      if (card) {
        open(card.getAttribute("data-solution"));
        return;
      }
      /* CTA do modal: fecha e leva ao formulário de contacto. */
      if (e.target.closest("[data-solution-cta]")) {
        e.preventDefault();
        close();
        var target = document.getElementById("contacto");
        if (!target) return;
        if (window.HonorIntegrations) {
          window.HonorIntegrations.trackAnalytics("cta_click", { label: "modal solucao" });
        }
        var y = target.getBoundingClientRect().top + window.scrollY - 74;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });

    /* Os cards são divs com role="button" — replicam o teclado de um botão. */
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
      var card = e.target.closest && e.target.closest("[data-solution]");
      if (!card) return;
      e.preventDefault();
      open(card.getAttribute("data-solution"));
    });

    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) close();
    });
  }

  document.addEventListener("DOMContentLoaded", init);

  App.solutions = { open: open, close: close };
})((window.App = window.App || {}));
