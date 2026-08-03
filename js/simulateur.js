/* =============================================================
   simulateur.js — Simulateur d'abonnement capacité
   S'active s'il trouve #simulator. État en mémoire, pas de stockage.
   ============================================================= */
(function () {
  var box = document.getElementById('simulator');
  if (!box) return;

  var cfg = (window.SITE_CONFIG && window.SITE_CONFIG.pricing) || {};
  var cap = cfg.capacite || { cycleBase: 600, chariot: 250, mult: { standard: 1, premium: 1.2, sensible: 1.35 } };
  var seuil = cfg.abonnementRemiseSeuil != null ? cfg.abonnementRemiseSeuil : 24;
  var pct = cfg.abonnementRemisePct != null ? cfg.abonnementRemisePct : 10;

  var elCycles = box.querySelector('#sim-cycles');
  var elCyclesOut = box.querySelector('#sim-cycles-val');
  var elFamille = box.querySelector('#sim-famille');
  var elChariots = box.querySelector('#sim-chariots');

  function eur(n) { return Math.round(n).toLocaleString('fr-FR') + ' €'; }

  function render() {
    var cycles = parseInt(elCycles.value, 10) || 0;
    var chariots = parseInt(elChariots.value, 10) || 1;
    var mult = cap.mult[elFamille.value] || 1;
    if (elCyclesOut) elCyclesOut.textContent = cycles;

    var unit = (cap.cycleBase + cap.chariot * (chariots - 1)) * mult;
    var spot = unit * cycles;                       // au coup par coup
    var remise = cycles >= seuil ? pct / 100 : 0;
    var abo = spot * (1 - remise);
    var save = spot - abo;

    box.querySelector('#sim-unit').textContent = eur(unit);
    box.querySelector('#sim-budget').textContent = eur(abo);
    box.querySelector('#sim-remise').textContent = remise ? ('−' + pct + ' %') : '0 %';
    box.querySelector('#sim-save').textContent = eur(save);

    var note = box.querySelector('#sim-note');
    if (note) {
      note.textContent = cycles >= seuil
        ? 'Remise de ' + pct + ' % appliquée : vous réservez ' + cycles + ' cycles (seuil de ' + seuil + ' atteint).'
        : 'Réservez au moins ' + seuil + ' cycles/an pour débloquer la remise de ' + pct + ' % (encore ' + (seuil - cycles) + ').';
    }
  }

  box.querySelectorAll('input, select').forEach(function (el) {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });
  render();
})();
