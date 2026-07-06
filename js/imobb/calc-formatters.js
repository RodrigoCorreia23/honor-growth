(function (App) {
  function formatEUR(value, decimals) {
    decimals = decimals || 0;
    var safe = Number.isFinite(value) ? value : 0;
    var fixed = safe.toFixed(decimals);
    var parts = fixed.split(".");
    var intPart = parts[0];
    var decPart = parts[1];
    var sign = intPart.indexOf("-") === 0 ? "-" : "";
    var digits = intPart.replace("-", "");
    var withSpaces = digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return decPart
      ? sign + withSpaces + "," + decPart + " €"
      : sign + withSpaces + " €";
  }

  function formatPercent(value, decimals) {
    decimals = decimals || 0;
    var safe = Number.isFinite(value) ? value : 0;
    return safe.toFixed(decimals).replace(".", ",") + "%";
  }

  function formatMultiplier(value, decimals) {
    decimals = decimals === undefined ? 1 : decimals;
    var safe = Number.isFinite(value) ? value : 0;
    return safe.toFixed(decimals).replace(".", ",") + "x";
  }

  function formatInteger(value) {
    var safe = Math.round(Number.isFinite(value) ? value : 0);
    return safe.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function formatInputVal(value, step) {
    var num = Number.isFinite(value) ? value : 0;
    var isDecimal = step && Math.floor(step) !== step;
    var decimals = 0;
    if (isDecimal && num !== Math.floor(num)) {
      decimals = String(step).split(".")[1].length;
    }
    var fixed = num.toFixed(decimals);
    var parts = fixed.split(".");
    var intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return decimals > 0 ? intPart + "," + parts[1] : intPart;
  }

  function parseInputVal(str) {
    if (typeof str !== "string") return parseFloat(str);
    return parseFloat(str.replace(/\s/g, "").replace(",", "."));
  }

  App.formatters = {
    formatEUR: formatEUR,
    formatPercent: formatPercent,
    formatMultiplier: formatMultiplier,
    formatInteger: formatInteger,
    formatInputVal: formatInputVal,
    parseInputVal: parseInputVal
  };
})((window.App = window.App || {}));
