(function (App) {
  var MIN_CONVERSION_RATE = 4;
  var LISTINGS_PER_HEAD_TARGET = 2;

  function safeCount(value) {
    var parsed = parseFloat(value);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }

  function safePercent(value) {
    var parsed = parseFloat(value);
    if (!Number.isFinite(parsed)) return 0;
    return Math.min(100, Math.max(0, parsed));
  }

  function calculateTeam(inputs) {
    var totalConsultants   = safeCount(inputs.totalConsultants);
    var activeProspecting  = Math.min(safeCount(inputs.activeProspecting), totalConsultants);
    var currentListings    = safeCount(inputs.currentListings);
    var targetListings     = safeCount(inputs.targetListings);
    var monthlySales       = safeCount(inputs.monthlySales);
    var monthlyLeads       = safeCount(inputs.monthlyLeads);
    var totalLeadsDB       = safeCount(inputs.totalLeadsDB);
    var adsInvestment      = safeCount(inputs.adsInvestment);
    var ticketMedio        = safeCount(inputs.ticketMedio);
    var commissionRate     = safePercent(inputs.commissionRate);
    var commissionPerSale  = ticketMedio * (commissionRate / 100);

    // ── Listings → sales ratio (how many sales each listing generates) ──
    var listingsToSalesRatio = currentListings > 0 ? monthlySales / currentListings : 0;

    // ── Consultant analysis ──────────────────────────────────
    var inactiveConsultants      = Math.max(0, totalConsultants - activeProspecting);
    var listingsPerActive        = activeProspecting > 0 ? currentListings / activeProspecting : 0;
    var potentialListings        = totalConsultants > 0
      ? Math.round(listingsPerActive * totalConsultants * 10) / 10
      : currentListings;
    var additionalListings       = Math.max(0, potentialListings - currentListings);
    var additionalSalesFromListings = additionalListings * listingsToSalesRatio;
    var lostFromInactivity       = additionalSalesFromListings * commissionPerSale;

    // ── Listings target analysis ─────────────────────────────
    var listingsGapToTarget   = Math.max(0, targetListings - currentListings);
    var salesFromTargetGap    = listingsGapToTarget * listingsToSalesRatio;
    var potentialFromTarget   = salesFromTargetGap * commissionPerSale;

    // ── Conversion analysis ──────────────────────────────────
    var currentConversionRate = monthlyLeads > 0 ? (monthlySales / monthlyLeads) * 100 : 0;
    var gapToTarget           = Math.max(0, MIN_CONVERSION_RATE - currentConversionRate);
    var additionalSales       = monthlyLeads * (gapToTarget / 100);
    var lostFromConversion    = additionalSales * commissionPerSale;

    // ── Vendas à taxa atual vs mínimo recomendado ────────────
    var salesAtCurrentRate = monthlySales;
    var salesAtMinRate     = monthlyLeads * (MIN_CONVERSION_RATE / 100);

    // ── Angariações por consultor (equipa toda) ──────────────
    var listingsPerConsultant   = totalConsultants > 0 ? currentListings / totalConsultants : 0;
    var listingsAtTwoPerHead    = totalConsultants * LISTINGS_PER_HEAD_TARGET;

    // ── Ads / ROI ────────────────────────────────────────────
    var costPerLead          = monthlyLeads > 0 ? adsInvestment / monthlyLeads : 0;
    var currentMonthlyRevenue = monthlySales * commissionPerSale;
    var roiFromSales          = adsInvestment > 0 ? currentMonthlyRevenue / adsInvestment : 0;

    // ── Database potential (1%) ──────────────────────────────
    var onePercentSales      = totalLeadsDB * 0.01;
    var onePercentCommission = onePercentSales * commissionPerSale;

    // ── Total monthly loss (inactivity + conversion gap) ─────
    var totalMonthlyLoss = lostFromInactivity + lostFromConversion + onePercentCommission;

    return {
      totalConsultants:      totalConsultants,
      activeProspecting:     activeProspecting,
      inactiveConsultants:   inactiveConsultants,
      currentListings:       currentListings,
      targetListings:        targetListings,
      monthlySales:          monthlySales,
      monthlyLeads:          monthlyLeads,
      totalLeadsDB:          totalLeadsDB,
      adsInvestment:         adsInvestment,
      ticketMedio:           ticketMedio,
      commissionRate:        commissionRate,
      commissionPerSale:     commissionPerSale,

      listingsToSalesRatio:        listingsToSalesRatio,
      listingsPerActive:           listingsPerActive,
      potentialListings:           potentialListings,
      additionalListings:          additionalListings,
      additionalSalesFromListings: additionalSalesFromListings,
      lostFromInactivity:          lostFromInactivity,

      listingsGapToTarget:   listingsGapToTarget,
      salesFromTargetGap:    salesFromTargetGap,
      potentialFromTarget:   potentialFromTarget,

      currentConversionRate: currentConversionRate,
      minConversionRate:     MIN_CONVERSION_RATE,
      gapToTarget:           gapToTarget,
      additionalSales:       additionalSales,
      lostFromConversion:    lostFromConversion,

      salesAtCurrentRate:    salesAtCurrentRate,
      salesAtMinRate:        salesAtMinRate,

      listingsPerConsultant:    listingsPerConsultant,
      listingsPerHeadTarget:    LISTINGS_PER_HEAD_TARGET,
      listingsAtTwoPerHead:     listingsAtTwoPerHead,

      costPerLead:           costPerLead,
      currentMonthlyRevenue: currentMonthlyRevenue,
      roiFromSales:          roiFromSales,

      onePercentSales:       onePercentSales,
      onePercentCommission:  onePercentCommission,

      totalMonthlyLoss:      totalMonthlyLoss
    };
  }

  App.teamCalculator = {
    calculateTeam: calculateTeam,
    MIN_CONVERSION_RATE: MIN_CONVERSION_RATE,
    LISTINGS_PER_HEAD_TARGET: LISTINGS_PER_HEAD_TARGET
  };
})((window.App = window.App || {}));
