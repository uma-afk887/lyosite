/* =============================================================
   campagne.js — Simulateur de campagne industrielle
   S'active s'il trouve #campagne. État en mémoire, pas de stockage.
   ============================================================= */
(function () {
  var box = document.getElementById('campagne');
  if (!box) return;
  var cap = ((window.SITE_CONFIG || {}).pricing || {}).capacite || {};
  var kgCycle = cap.kgParCycle || 150;
  var cyclesSem = cap.cyclesParSemaine || 10;
  var prixT = cap.prixTonne || { standard: 9000, premium: 12000, sensible: 16000 };

  var elT = box.querySelector('#cmp-tonnage');
  var elTout = box.querySelector('#cmp-tonnage-val');
  var elFam = box.querySelector('#cmp-famille');
  var elMois = box.querySelector('#cmp-mois');

  function eur(n) { return Math.round(n).toLocaleString('fr-FR') + ' €'; }
  function render() {
    var t = parseFloat(elT.value) || 0;
    var fam = elFam.value;
    var mois = parseInt(elMois.value, 10) || 12;
    if (elTout) elTout.textContent = t;
    var cycles = Math.ceil((t * 1000) / kgCycle);
    var semaines = Math.ceil(cycles / cyclesSem);
    var budget = t * (prixT[fam] || prixT.standard);
    box.querySelector('#cmp-cycles').textContent = cycles.toLocaleString('fr-FR');
    box.querySelector('#cmp-duree').textContent = semaines + (semaines > 1 ? ' semaines' : ' semaine');
    box.querySelector('#cmp-budget').textContent = eur(budget);
    var note = box.querySelector('#cmp-note');
    if (note) {
      var faisable = semaines <= mois * 4.3;
      note.textContent = faisable
        ? 'Campagne réalisable dans votre fenêtre de ' + mois + ' mois (' + semaines + ' semaines de production en continu).'
        : 'Volume élevé : ' + semaines + ' semaines de production nécessaires. Nous étalons sur plusieurs fenêtres ou renforçons la capacité — parlons-en.';
    }
  }
  box.querySelectorAll('input, select').forEach(function (el) { el.addEventListener('input', render); el.addEventListener('change', render); });
  render();
})();
