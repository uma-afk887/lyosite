/* =============================================================
   avis.js — Mur d'avis réutilisable (balisage Review)
   -------------------------------------------------------------
   S'active sur tout conteneur <div class="avis-wall" data-avis></div>.
   ⚠️ Les entrées ci-dessous sont des EXEMPLES marqués placeholder:true.
   Remplacez-les par de vrais témoignages — uniquement avec l'accord
   écrit du client. Le balisage Review / AggregateRating n'est émis
   QUE pour les avis réels (placeholder absent ou false), afin de ne
   jamais publier de faux avis dans les données structurées.
   ============================================================= */
(function () {
  var AVIS = [
    { name: 'Marc L.', role: 'Apiculteur — Charente-Maritime', rating: 5, placeholder: true,
      text: 'Notre pollen lyophilisé est devenu notre meilleure vente. Le cycle a été calé en deux essais, sans jamais chauffer le produit.' },
    { name: 'Julien M.', role: 'Ostréiculteur — Marennes-Oléron', rating: 5, placeholder: true,
      text: 'Un snack d\'huître qui se conserve un an et qui a séduit deux épiceries fines. On nous disait que c\'était impossible.' },
    { name: 'Responsable innovation', role: 'Maison de confiserie', rating: 5, placeholder: true,
      text: 'Les lots pilotes nous ont fait gagner des mois de R&D avant le lancement de notre bonbon lyophilisé.' },
  ];

  var walls = document.querySelectorAll('[data-avis]');
  if (!walls.length) return;

  function stars(n) { return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  var html = AVIS.map(function (a) {
    return '<figure class="avis-card">' +
      '<div class="avis-stars" aria-label="' + a.rating + ' sur 5">' + stars(a.rating) + '</div>' +
      (a.placeholder ? '<span class="avis-badge">Exemple — en attente de témoignage réel</span>' : '') +
      '<blockquote class="avis-text">« ' + esc(a.text) + ' »</blockquote>' +
      '<figcaption class="avis-who"><span class="avis-avatar" aria-hidden="true">' + esc(a.name.charAt(0)) + '</span>' +
      '<span><span class="avis-name">' + esc(a.name) + '</span><br><span class="avis-role">' + esc(a.role) + '</span></span></figcaption>' +
      '</figure>';
  }).join('');
  walls.forEach(function (w) { w.innerHTML = html; });

  // Données structurées Review/AggregateRating : uniquement pour les avis RÉELS.
  var real = AVIS.filter(function (a) { return !a.placeholder; });
  if (real.length) {
    var avg = (real.reduce(function (s, a) { return s + a.rating; }, 0) / real.length).toFixed(1);
    var ld = {
      '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'LyoSurgères',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: avg, reviewCount: real.length },
      review: real.map(function (a) {
        return { '@type': 'Review', author: { '@type': 'Person', name: a.name }, reviewBody: a.text, reviewRating: { '@type': 'Rating', ratingValue: a.rating, bestRating: 5 } };
      }),
    };
    var s = document.createElement('script'); s.type = 'application/ld+json';
    s.textContent = JSON.stringify(ld); document.head.appendChild(s);
  }
})();
