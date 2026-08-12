(function (App) {
  var formatEUR        = App.formatters.formatEUR;
  var formatPercent    = App.formatters.formatPercent;
  var formatMultiplier = App.formatters.formatMultiplier;
  var formatInteger    = App.formatters.formatInteger;

  var TEAM_FIELDS = [
    {
      id: "t_totalConsultants",
      key: "totalConsultants",
      label: "Consultores na equipa",
      help: "Total de consultores, incluindo os que não estão a fazer prospeção ativa.",
      unit: "count",
      min: 1, max: 200, step: 1, default: 10,
      minLabel: "1", maxLabel: "200"
    },
    {
      id: "t_activeProspecting",
      key: "activeProspecting",
      label: "Consultores a fazer prospeção ativa",
      help: "Quantos consultores fizeram prospeção de proprietários este mês.",
      unit: "count",
      min: 0, max: 200, step: 1, default: 4,
      minLabel: "0", maxLabel: "200"
    },
    {
      id: "t_currentListings",
      key: "currentListings",
      label: "Angariações atuais/ mês (equipa total)",
      help: "Total de contratos de angariação assinados por toda a equipa por mês.",
      unit: "count",
      min: 0, max: 500, step: 1, default: 8,
      minLabel: "0", maxLabel: "500"
    },
    {
      id: "t_targetListings",
      key: "targetListings",
      label: "Objetivo de Angariações",
      help: "Quantos contratos de angariação a equipa quer assinar por mês.",
      unit: "count",
      min: 0, max: 500, step: 1, default: 16,
      minLabel: "0", maxLabel: "500"
    },
    {
      id: "t_monthlyLeads",
      key: "monthlyLeads",
      label: "Leads de compradores / mês",
      help: "Leads geradas pelos anúncios (Idealista, Meta) e outros canais por mês.",
      unit: "count",
      min: 0, max: 10000, step: 10, default: 150,
      minLabel: "0", maxLabel: "10 000"
    },
    {
      id: "t_monthlySales",
      key: "monthlySales",
      label: "Vendas concretizadas / mês",
      help: "Transações imobiliárias fechadas (escrituras ou CPCV) por mês.",
      unit: "count",
      min: 0, max: 200, step: 1, default: 3,
      minLabel: "0", maxLabel: "200"
    },
    {
      id: "t_totalLeadsDB",
      key: "totalLeadsDB",
      label: "Leads na base de dados (total)",
      help: "Soma total de leads de compradores acumuladas no CRM / base de dados.",
      unit: "count",
      min: 0, max: 100000, step: 100, default: 1500,
      minLabel: "0", maxLabel: "100 000"
    },
    {
      id: "t_adsInvestment",
      key: "adsInvestment",
      label: "Investimento em anúncios / mês",
      help: "Total mensal em Idealista, Meta Ads e outras plataformas pagas.",
      unit: "eur",
      min: 0, max: 50000, step: 100, default: 1500,
      minLabel: "EUR 0", maxLabel: "EUR 50 000"
    },
    {
      id: "t_ticketMedio",
      key: "ticketMedio",
      label: "Ticket médio do imóvel",
      help: "Valor médio dos imóveis comercializados pela equipa.",
      unit: "eur",
      min: 50000, max: 2000000, step: 5000, default: 280000,
      minLabel: "EUR 50 000", maxLabel: "EUR 2 000 000"
    },
    {
      id: "t_commissionRate",
      key: "commissionRate",
      label: "Comissão imobiliária",
      help: "Percentagem de comissão média sobre o valor de venda.",
      unit: "pct",
      min: 0, max: 10, step: 0.1, default: 3,
      minLabel: "0%", maxLabel: "10%"
    }
  ];

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getFieldsById() {
    var map = {};
    TEAM_FIELDS.forEach(function (f) { map[f.id] = f; });
    return map;
  }

  function buildControl(field) {
    var symBefore = field.unit === "eur" ? '<span class="control__symbol">EUR</span>' : "";
    var symAfter  = field.unit === "pct" ? '<span class="control__symbol">%</span>' : "";
    return (
      '<div class="control" data-field="' + field.id + '">' +
      '<div class="control__header"><div>' +
      '<label class="control__label" for="' + field.id + '-input">' + field.label + '</label>' +
      '<p class="control__help">' + field.help + '</p>' +
      '</div></div>' +
      '<div class="control__stepper">' +
      '<button type="button" class="control__step" data-tstep="' + field.id + ':-1" aria-label="Diminuir">-</button>' +
      '<div class="control__value">' + symBefore +
      '<input type="text" inputmode="numeric" id="' + field.id + '-input" class="control__input" data-tinput="' + field.id +
      '" value="' + App.formatters.formatInputVal(field.default, field.step) + '" />' +
      symAfter + '</div>' +
      '<button type="button" class="control__step" data-tstep="' + field.id + ':1" aria-label="Aumentar">+</button>' +
      '</div>' +
      '<input type="range" class="control__range" data-trange="' + field.id +
      '" min="' + field.min + '" max="' + field.max + '" step="' + field.step + '" value="' + field.default + '" />' +
      '<div class="control__scale">' +
      '<span class="control__min">' + field.minLabel + '</span>' +
      '<span class="control__max"' + (field.id === "t_activeProspecting" ? ' id="t_activeProspecting-maxlabel"' : '') + '>' + field.maxLabel + '</span>' +
      '</div></div>'
    );
  }

  function updateRangeFill(id, fieldsById) {
    var field = fieldsById[id];
    if (!field) return;
    var range = document.querySelector('[data-trange="' + id + '"]');
    if (!range) return;
    var min = parseFloat(range.min);
    var max = parseFloat(range.max);
    if (!Number.isFinite(min)) min = field.min;
    if (!Number.isFinite(max) || max === 0) max = field.max;
    var pct = ((parseFloat(range.value) - min) / (max - min)) * 100;
    range.style.setProperty("--fill-n", pct);
  }

  function writeField(id, value) {
    var field = getFieldsById()[id];
    var ni = document.querySelector('[data-tinput="' + id + '"]');
    var ri = document.querySelector('[data-trange="' + id + '"]');
    if (ni) ni.value = App.formatters.formatInputVal(value, field ? field.step : 1);
    if (ri) ri.value = value;
  }

  function renderTeamControls(container) {
    container.innerHTML = TEAM_FIELDS.map(buildControl).join("");
  }

  function readTeamInputs() {
    var inputs = {};
    TEAM_FIELDS.forEach(function (f) {
      var el = document.querySelector('[data-tinput="' + f.id + '"]');
      var v  = el ? App.formatters.parseInputVal(el.value) : f.default;
      if (!Number.isFinite(v)) v = f.default;
      inputs[f.key] = clamp(v, f.min, f.max);
    });
    return inputs;
  }

  function bindTeamControls(onChange) {
    var fieldsById = getFieldsById();

    function activeProspectingMax() {
      var totalEl = document.querySelector('[data-tinput="t_totalConsultants"]');
      if (!totalEl) return Infinity;
      var v = App.formatters.parseInputVal(totalEl.value);
      return Number.isFinite(v) ? v : Infinity;
    }

    document.querySelectorAll("[data-tinput]").forEach(function (input) {
      input.addEventListener("input", function () {
        var id    = input.dataset.tinput;
        var field = fieldsById[id];
        if (!field) return;
        var v = App.formatters.parseInputVal(input.value);
        if (!Number.isFinite(v)) v = field.default;
        v = clamp(v, field.min, field.max);
        if (id === "t_activeProspecting") v = clamp(v, field.min, activeProspectingMax());
        var ri = document.querySelector('[data-trange="' + id + '"]');
        if (ri) ri.value = v;
        updateRangeFill(id, fieldsById);
        if (id === "t_totalConsultants") syncActiveMax(v);
        onChange();
      });
      input.addEventListener("blur", function () {
        var id    = input.dataset.tinput;
        var field = fieldsById[id];
        if (!field) return;
        var v = App.formatters.parseInputVal(input.value);
        if (!Number.isFinite(v)) v = field.default;
        v = clamp(v, field.min, field.max);
        if (id === "t_activeProspecting") v = clamp(v, field.min, activeProspectingMax());
        writeField(id, v);
      });
    });

    document.querySelectorAll("[data-trange]").forEach(function (range) {
      range.addEventListener("input", function () {
        var id    = range.dataset.trange;
        var field = fieldsById[id];
        if (!field) return;
        var v = clamp(parseFloat(range.value), field.min, field.max);
        writeField(id, v);
        updateRangeFill(id, fieldsById);
        if (id === "t_totalConsultants") syncActiveMax(v);
        onChange();
      });
    });

    document.querySelectorAll("[data-tstep]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var parts = btn.dataset.tstep.split(":");
        var id    = parts[0];
        var dir   = parseInt(parts[1], 10);
        var field = fieldsById[id];
        if (!field) return;
        var ni = document.querySelector('[data-tinput="' + id + '"]');
        var v  = App.formatters.parseInputVal(ni.value) + field.step * dir;
        v = Math.round(v / field.step) * field.step;
        v = clamp(Math.round(v * 100) / 100, field.min, field.max);
        writeField(id, v);
        updateRangeFill(id, fieldsById);
        if (id === "t_totalConsultants") syncActiveMax(v);
        onChange();
      });
    });

    TEAM_FIELDS.forEach(function (f) { updateRangeFill(f.id, fieldsById); });

    var totalInput = document.querySelector('[data-tinput="t_totalConsultants"]');
    if (totalInput) {
      var initTotal = App.formatters.parseInputVal(totalInput.value);
      if (Number.isFinite(initTotal)) syncActiveMax(initTotal);
    }
  }

  function syncActiveMax(totalValue) {
    var fieldsById = getFieldsById();
    var ni = document.querySelector('[data-tinput="t_activeProspecting"]');
    var ri = document.querySelector('[data-trange="t_activeProspecting"]');
    if (ni) {
      if (App.formatters.parseInputVal(ni.value) > totalValue) {
        writeField("t_activeProspecting", totalValue);
        if (ri) ri.value = totalValue;
      }
    }
    if (ri) ri.max = totalValue;
    var maxLabel = document.getElementById("t_activeProspecting-maxlabel");
    if (maxLabel) maxLabel.textContent = totalValue;
    updateRangeFill("t_activeProspecting", fieldsById);
  }

  // ── Render helpers ───────────────────────────────────────────

  function pulse(el) {
    if (!el) return;
    el.classList.remove("pulse");
    void el.offsetWidth;
    el.classList.add("pulse");
  }

  function setText(id, text, withPulse) {
    var el = document.getElementById(id);
    if (!el || el.textContent === text) return;
    el.textContent = text;
    if (withPulse) pulse(el);
  }

  function setMetricState(valueId, state) {
    var el = document.getElementById(valueId);
    if (!el) return;
    el.classList.toggle("is-negative", state === "danger");
    el.classList.toggle("metric__value--ok", state === "ok");
    var metric = el.closest(".metric");
    if (metric) {
      metric.classList.toggle("metric--warning", state === "danger");
      metric.classList.toggle("metric--ok",      state === "ok");
    }
  }

  function plural(n, singular, plural) {
    return n === 1 ? singular : plural;
  }

  function formatDecimal(value, decimals) {
    var safe = Number.isFinite(value) ? value : 0;
    return safe.toFixed(decimals).replace(".", ",");
  }

  // ── Main render ──────────────────────────────────────────────

  function renderTeamResults(d) {
    // Hero
    setText("team-total-loss", formatEUR(d.totalMonthlyLoss), true);

    // Metric grid
    setText("team-inactive-count",
      d.inactiveConsultants + " " + plural(d.inactiveConsultants, "inativo", "inativos") +
      " de " + d.totalConsultants);
    setMetricState("team-inactive-count", d.inactiveConsultants > 0 ? "danger" : "ok");

    setText("team-potential-listings", formatInteger(d.potentialListings));

    setText("team-conversion-rate", formatPercent(d.currentConversionRate, 1));
    setMetricState("team-conversion-rate",
      d.monthlyLeads > 0
        ? (d.currentConversionRate < d.minConversionRate ? "danger" : "ok")
        : "");

    setText("team-sales-at-rates",
      d.monthlyLeads > 0
        ? formatInteger(d.salesAtCurrentRate) + " → " + formatInteger(d.salesAtMinRate)
        : "— → —");
    setText("team-sales-at-rates-caption",
      d.monthlyLeads > 0
        ? formatInteger(d.monthlyLeads) + " leads: " +
          formatPercent(d.currentConversionRate, 1) + " → " + formatPercent(d.minConversionRate, 0)
        : "introduz as leads / mês");

    setText("team-listings-per-consultant", formatDecimal(d.listingsPerConsultant, 1));
    setText("team-listings-per-consultant-caption",
      d.totalConsultants > 0
        ? "a " + d.listingsPerHeadTarget + " por consultor: " +
          formatInteger(d.listingsAtTwoPerHead) + " angariações / mês"
        : "introduz o número de consultores");

    setText("team-current-revenue", formatEUR(d.currentMonthlyRevenue));
    setText("team-cost-per-lead",   d.costPerLead > 0 ? formatEUR(d.costPerLead, 2) : "—");
    setText("team-ads-roi",         d.roiFromSales > 0 ? formatMultiplier(d.roiFromSales) : "—");

    // ── Card 1: Inactivity ───────────────────────────────────
    setText("tl-inactive-stat",
      d.inactiveConsultants + " " + plural(d.inactiveConsultants, "consultor inativo", "consultores inativos"));

    var inactiveCopy;
    if (d.totalConsultants === 0) {
      inactiveCopy = "Introduz o número de consultores para calcular o potencial.";
    } else if (d.activeProspecting === 0) {
      inactiveCopy = "Nenhum consultor está a fazer prospeção ativa este mês. Sem prospeção não há angariações previsíveis.";
    } else if (d.inactiveConsultants === 0) {
      inactiveCopy = "Toda a equipa está a fazer prospeção ativa. O potencial já está a ser aproveitado.";
    } else {
      var extraSales = Math.ceil(d.additionalSalesFromListings);
      inactiveCopy =
        "Tens " + d.activeProspecting + plural(d.activeProspecting, " consultor ativo", " consultores ativos") +
        " num total de " + d.totalConsultants + ". " +
        "Se toda a equipa produzisse como os ativos, passavas de " +
        formatInteger(d.currentListings) + " para " + formatInteger(d.potentialListings) +
        " angariações/mês (+" + formatInteger(d.additionalListings) + " imóveis" +
        (d.listingsToSalesRatio > 0
          ? ", ≈ +" + formatInteger(extraSales) + plural(extraSales, " venda", " vendas") + " à taxa atual"
          : "") +
        ").";
    }
    setText("tl-inactivity-copy", inactiveCopy);
    setText("tl-inactivity-amount", formatEUR(d.lostFromInactivity), true);

    // ── Card 2: Listings target ──────────────────────────────
    setText("tl-listings-stat",
      d.listingsGapToTarget > 0
        ? formatInteger(d.listingsGapToTarget) + " abaixo do objetivo"
        : "Objetivo atingido");

    var listingsCopy;
    if (d.targetListings === 0) {
      listingsCopy = "Define o objetivo de angariações/mês para ver quanto vale a distância até lá.";
    } else if (d.listingsGapToTarget === 0) {
      listingsCopy =
        "Estás a assinar " + formatInteger(d.currentListings) +
        " angariações/mês, no ou acima do objetivo de " + formatInteger(d.targetListings) +
        ". Sobe a fasquia para continuares a crescer.";
    } else if (d.listingsToSalesRatio === 0) {
      listingsCopy =
        "Faltam " + formatInteger(d.listingsGapToTarget) + " angariações/mês para chegares ao objetivo de " +
        formatInteger(d.targetListings) + ". Introduz as vendas concretizadas para calcular quanto isso vale.";
    } else {
      var targetSales = Math.ceil(d.salesFromTargetGap);
      listingsCopy =
        "O teu objetivo é " + formatInteger(d.targetListings) + " angariações/mês e estás em " +
        formatInteger(d.currentListings) + ". Faltam " + formatInteger(d.listingsGapToTarget) +
        " imóveis, que à taxa atual valem ≈ " + formatInteger(targetSales) +
        plural(targetSales, " venda", " vendas") + "/mês.";
    }
    setText("tl-listings-copy", listingsCopy);
    setText("tl-listings-amount", formatEUR(d.potentialFromTarget), true);

    // ── Card 3: Conversion ───────────────────────────────────
    setText("tl-conversion-stat", formatPercent(d.currentConversionRate, 1) + " taxa atual");

    var convCopy;
    if (d.monthlyLeads === 0) {
      convCopy = "Introduz as leads geradas por mês para calcular a taxa de conversão.";
    } else if (d.gapToTarget <= 0) {
      convCopy =
        "Estás a converter " + formatPercent(d.currentConversionRate, 1) +
        " das leads — acima do mínimo de 4%. " +
        "Continua a escalar sem baixar a qualidade.";
    } else {
      convCopy =
        "Estás a gerar " + formatInteger(d.monthlyLeads) + " leads/mês e a fechar " +
        formatInteger(d.monthlySales) + " vendas (" + formatPercent(d.currentConversionRate, 1) + "). " +
        "O mínimo recomendado é 4%. " +
        "Ao atingires esse objetivo, fecharías mais " +
        formatInteger(Math.ceil(d.additionalSales)) + plural(Math.ceil(d.additionalSales), " venda", " vendas") + "/mês.";
    }
    setText("tl-conversion-copy", convCopy);
    setText("tl-conversion-amount", formatEUR(d.lostFromConversion), true);

    // ── Card 4: Database ─────────────────────────────────────
    setText("tl-db-stat", formatInteger(d.totalLeadsDB) + " leads acumuladas");

    var dbCopy;
    if (d.totalLeadsDB === 0) {
      dbCopy = "Introduz o total de leads na base de dados para ver o potencial adormecido.";
    } else {
      dbCopy =
        "Tens " + formatInteger(d.totalLeadsDB) + " leads no CRM. " +
        "Convertendo apenas 1% (" + formatInteger(Math.ceil(d.onePercentSales)) +
        plural(Math.ceil(d.onePercentSales), " venda", " vendas") + "), geras " +
        formatEUR(d.onePercentCommission) + " em comissões. " +
        "Este é o potencial adormecido da tua base de dados.";
    }
    setText("tl-db-copy", dbCopy);
    setText("tl-db-amount", formatEUR(d.onePercentCommission), true);

    // ── Total card ───────────────────────────────────────────
    setText("team-total-monthly", formatEUR(d.totalMonthlyLoss), true);
    var annualEl = document.getElementById("team-total-annual");
    if (annualEl) {
      annualEl.textContent =
        "Em doze meses, isso são " +
        formatEUR(d.totalMonthlyLoss * 12) +
        " de comissão que pode estar a escapar pela inatividade da equipa, baixa conversão de leads e base de dados não trabalhada.";
    }
  }

  App.teamSection = {
    renderTeamControls: renderTeamControls,
    readTeamInputs:     readTeamInputs,
    bindTeamControls:   bindTeamControls,
    renderTeamResults:  renderTeamResults
  };
})((window.App = window.App || {}));
