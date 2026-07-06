(function (App) {
  function recalculate() {
    var inputs = App.teamSection.readTeamInputs();
    var data   = App.teamCalculator.calculateTeam(inputs);
    App.teamSection.renderTeamResults(data);
  }

  function initCalc() {
    var teamContainer = document.getElementById("hg-team-controls-container");
    if (!teamContainer) return;
    App.teamSection.renderTeamControls(teamContainer);
    App.teamSection.bindTeamControls(recalculate);
    recalculate();
  }

  document.addEventListener("DOMContentLoaded", initCalc);
})((window.App = window.App || {}));
