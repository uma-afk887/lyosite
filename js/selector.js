/* =============================================================
   selector.js — Sélecteur de procédé (3 questions, 1 réponse)
   Composant réutilisable. S'active s'il trouve #decision.
   Aucune dépendance, état en mémoire (pas de localStorage).
   ============================================================= */
(function () {
  var dec = document.getElementById('decision');
  if (!dec) return;
  var res = document.getElementById('decision-result');
  if (!res) return;

  var cfg = (window.SITE_CONFIG || {});
  var p = (cfg.pricing && cfg.pricing.testEchantillon) || { min: 250, max: 500 };
  var testPrice = p.min + ' à ' + p.max + ' €';

  var ans = {};

  dec.querySelectorAll('.dq').forEach(function (row) {
    row.querySelectorAll('.dq-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        ans[row.getAttribute('data-q')] = b.getAttribute('data-v');
        row.querySelectorAll('.dq-btn').forEach(function (x) { x.classList.toggle('on', x === b); });
        update();
      });
    });
  });

  function cta() {
    return '<div class="decision-cta">' +
      '<a class="btn btn--primary" href="test-echantillon.html">Tester mon produit — ' + testPrice + '</a>' +
      '</div>';
  }

  function update() {
    if (ans.rehydrate === 'oui' || ans.vivant === 'oui') {
      res.innerHTML =
        '➜ Procédé recommandé : <b>Lyophilisation</b><br>' +
        '<span class="decision-why">Votre produit doit se réhydrater à l\'identique ou contient du vivant / une molécule thermosensible : seul le séchage à froid le préserve.</span>' +
        '<span class="decision-cost">Coût relatif : <b>élevé</b> — c\'est le procédé le plus qualitatif (3 à 10 kWh par kg d\'eau retirée).</span>' +
        cta();
    } else if (ans.dluo === 'oui') {
      res.innerHTML =
        '➜ Procédé recommandé : <b class="tag-mo">Séchage micro-ondes sous vide</b><br>' +
        '<span class="decision-why">Pas de réhydratation ni de thermosensibilité, et une DLUO longue au meilleur coût : le micro-ondes sous vide suffit.</span>' +
        '<span class="decision-cost">Coût relatif : <b>2 à 4× moins cher</b> que la lyophilisation (1 à 1,5 kWh par kg d\'eau retirée).</span>' +
        cta();
    } else if (ans.rehydrate && ans.vivant && ans.dluo) {
      res.innerHTML =
        'Aucun procédé ne s\'impose seul.<br>' +
        '<span class="decision-why">Le plus simple : on fait sortir votre produit une première fois et on tranche sur des chiffres.</span>' +
        cta();
    } else {
      res.textContent = 'Répondez aux 3 questions pour voir le procédé recommandé.';
    }
  }
})();
