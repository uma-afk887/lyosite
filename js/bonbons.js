/* =============================================================
   bonbons.js — Petit simulateur pour la confiserie
   Quantité de bonbons → chariots, durée, prix indicatif.
   Valeurs indicatives (bonbons peu chargés en eau, cycles courts).
   ============================================================= */
(function () {
  var box = document.getElementById('bonbons');
  if (!box) return;
  var KG_CHARIOT = 15;   // kg de bonbons par chariot (chargement dense)
  var CYCLE_H = 13;      // durée de cycle indicative
  var PRIX_KG = 25;      // € par kg traité (indicatif)

  var elKg = box.querySelector('#bb-kg');
  var elKgOut = box.querySelector('#bb-kg-val');
  var elWeekend = box.querySelector('#bb-weekend');

  function eur(n) { return Math.round(n).toLocaleString('fr-FR') + ' €'; }
  function render() {
    var kg = parseFloat(elKg.value) || 0;
    var chariots = Math.max(1, Math.ceil(kg / KG_CHARIOT));
    var remise = elWeekend && elWeekend.checked ? 0.15 : 0;
    var prix = kg * PRIX_KG * (1 - remise);
    if (elKgOut) elKgOut.textContent = kg;
    box.querySelector('#bb-chariots').textContent = chariots + (chariots > 1 ? ' chariots' : ' chariot');
    box.querySelector('#bb-duree').textContent = '~' + CYCLE_H + ' h de cycle';
    box.querySelector('#bb-prix').textContent = eur(prix);
    var note = box.querySelector('#bb-note');
    if (note) note.textContent = remise
      ? 'Créneau week-end : −15 % appliqués. Prix indicatif de ' + Math.round(PRIX_KG * (1 - remise)) + ' €/kg.'
      : 'Prix indicatif de ' + PRIX_KG + ' €/kg. Cochez « créneau week-end » pour le tarif réduit.';
  }
  box.querySelectorAll('input').forEach(function (el) { el.addEventListener('input', render); el.addEventListener('change', render); });
  render();
})();
