/* =============================================================
   dluo.js — Calculateur de DLUO indicative
   -------------------------------------------------------------
   Widget réutilisable et pré-remplissable. Sur toute page,
   chaque conteneur <div class="dluo-widget" data-famille="..."
   data-lipides="..."></div> devient un calculateur autonome.

   Base scientifique (voir encart pédagogique) :
   - L'aw, pas l'humidité, gouverne la stabilité. Sous aw 0,60,
     plus de croissance microbienne.
   - Pour les produits gras, l'optimum de stabilité oxydative se
     situe entre aw 0,30 et 0,50. Sous 0,30, on retire la
     monocouche d'eau qui protège les lipides : le rancissement
     s'accélère. Sur-sécher coûte du cycle ET raccourcit la DLUO.
   - Pour le maigre, descendre plus bas reste favorable.
   - Règle de Q10 : la vitesse d'oxydation double ~ tous les 10 °C.
   - Repère : coproduits de saumon (rejet 20 meq O2/kg), DLUO ~155 j
     en emballage PLA à 20 °C / 43 % HR, 136 puis 108 j plus chaud.
     Marins gras : 5–9 mois en sachet, 12–18 mois en barrière azotée.
   Ces sorties sont INDICATIVES. Seule l'analyse de stabilité
   (aw, isotherme, vieillissement accéléré) donne une DLUO opposable.
   ============================================================= */
(function () {
  var widgets = document.querySelectorAll('.dluo-widget');
  if (!widgets.length) return;

  var FAMILLES = [
    ['maigre-vegetal',  'Maigre végétal (fruit, légume)'],
    ['gras-vegetal',    'Gras végétal (oléagineux, graine)'],
    ['marin-gras',      'Marin gras (poisson, coproduit)'],
    ['carne',           'Carné (viande, abat)'],
    ['poudre-laitiere', 'Poudre laitière'],
    ['ferment',         'Ferment vivant / probiotique'],
  ];
  var LIPIDES = [['lt2', '< 2 %'], ['m2a10', '2 à 10 %'], ['gt10', '> 10 %']];
  var EMBALLAGE = [
    ['sachet',    'Sachet simple'],
    ['barriere',  'Barrière EVOH ou aluminium'],
    ['azote',     'Barrière + azote'],
    ['absorbeur', 'Barrière + azote + absorbeur d\'oxygène'],
  ];
  var TEMP = [['t20', 'Ambiante (20 °C)'], ['t12', 'Cave (12 °C)'], ['t4', 'Réfrigéré (4 °C)']];

  // Base : mois en sachet simple, à 20 °C, lipides moyens.
  var BASE = { 'maigre-vegetal': 14, 'gras-vegetal': 7, 'marin-gras': 6, 'carne': 8, 'poudre-laitiere': 12, 'ferment': 9 };
  var OXID = { 'gras-vegetal': 1, 'marin-gras': 1, 'carne': 1 }; // familles pilotées par l'oxydation
  var AW = {
    'maigre-vegetal': '0,20 – 0,30 (plus bas = plus stable)',
    'gras-vegetal':   '0,30 – 0,50 (ne pas descendre sous 0,30)',
    'marin-gras':     '0,30 – 0,50 (ne pas descendre sous 0,30)',
    'carne':          '0,30 – 0,40',
    'poudre-laitiere':'0,20 – 0,30',
    'ferment':        '0,10 – 0,20 (très sensible à l\'humidité et à l\'oxygène)',
  };
  var PACK = { 'sachet': 1.0, 'barriere': 1.6, 'azote': 2.2, 'absorbeur': 2.8 };
  var PACK_RANK = { 'sachet': 0, 'barriere': 1, 'azote': 2, 'absorbeur': 3 };
  var LIP = { 'lt2': 1.3, 'm2a10': 1.0, 'gt10': 0.7 };
  var TEMPMULT = { 't20': 1.0, 't12': Math.pow(2, 0.8), 't4': Math.pow(2, 1.6) }; // Q10 = 2, réf 20 °C

  function opts(list, sel) {
    return list.map(function (o) {
      return '<option value="' + o[0] + '"' + (o[0] === sel ? ' selected' : '') + '>' + o[1] + '</option>';
    }).join('');
  }

  function compute(v) {
    var oxid = !!OXID[v.famille];
    // Effet lipides : plein pour les familles oxydables, atténué sinon
    var lf = LIP[v.lipides] || 1;
    var lipEff = oxid ? lf : (1 + (lf - 1) * 0.3);
    var point = BASE[v.famille] * lipEff * (PACK[v.emballage] || 1) * (TEMPMULT[v.temp] || 1);
    var lo = Math.max(1, Math.round(point * 0.85));
    var hi = Math.max(lo + 1, Math.round(point * 1.15));

    // Facteur limitant
    var limiting;
    if (oxid) {
      limiting = (PACK_RANK[v.emballage] >= 2) ? 'Reprise d\'humidité (oxydation maîtrisée par l\'emballage)' : 'Oxydation lipidique';
    } else if (v.famille === 'poudre-laitiere') {
      limiting = 'Brunissement non enzymatique (Maillard)';
    } else if (v.famille === 'ferment') {
      limiting = 'Perte de viabilité et reprise d\'humidité';
    } else {
      limiting = 'Reprise d\'humidité';
    }

    // Conditionnement conseillé (rang minimal)
    var need;
    if (v.famille === 'ferment') need = 'absorbeur';
    else if (oxid) need = (v.lipides === 'gt10') ? 'absorbeur' : 'azote';
    else need = 'barriere';
    var needLabel = EMBALLAGE.filter(function (e) { return e[0] === need; })[0][1];
    var packOk = PACK_RANK[v.emballage] >= PACK_RANK[need];

    var note = '';
    if (oxid) note = 'Ne sur-séchez pas : visez une a<sub>w</sub> entre 0,30 et 0,50. En dessous, la monocouche d\'eau protectrice disparaît et le rancissement s\'accélère — vous perdez de la DLUO tout en payant plus de cycle.';
    else if (v.famille === 'poudre-laitiere') note = 'Gardez une a<sub>w</sub> basse et une bonne barrière : le brunissement de Maillard s\'accélère avec l\'humidité et la température.';

    return { lo: lo, hi: hi, aw: AW[v.famille], limiting: limiting, need: needLabel, packOk: packOk, note: note };
  }

  function init(w) {
    var state = {
      famille: w.getAttribute('data-famille') || 'marin-gras',
      lipides: w.getAttribute('data-lipides') || 'm2a10',
      emballage: w.getAttribute('data-emballage') || 'sachet',
      temp: w.getAttribute('data-temp') || 't20',
    };
    if (!BASE[state.famille]) state.famille = 'marin-gras';

    w.innerHTML =
      '<div class="dluo-fields">' +
        field('Famille de produit', 'famille', FAMILLES, state.famille) +
        field('Teneur en lipides', 'lipides', LIPIDES, state.lipides) +
        field('Emballage', 'emballage', EMBALLAGE, state.emballage) +
        field('Température de stockage', 'temp', TEMP, state.temp) +
      '</div>' +
      '<div class="dluo-out" aria-live="polite"></div>';

    var out = w.querySelector('.dluo-out');
    w.querySelectorAll('select').forEach(function (s) {
      s.addEventListener('change', function () { state[s.getAttribute('data-k')] = s.value; render(); });
    });

    function render() {
      var r = compute(state);
      out.innerHTML =
        '<div class="dluo-grid">' +
          cell('DLUO estimée', '<b>' + r.lo + ' – ' + r.hi + ' mois</b>') +
          cell('a<sub>w</sub> cible recommandée', r.aw) +
          cell('Facteur limitant', r.limiting) +
          cell('Conditionnement conseillé', r.need + (r.packOk ? ' <span class="dluo-ok">✓ votre choix convient</span>' : '')) +
        '</div>' +
        (r.note ? '<p class="dluo-note">' + r.note + '</p>' : '') +
        '<p class="dluo-disc">Estimation indicative. Pour une DLUO <strong>opposable sur étiquette</strong>, nous réalisons une analyse de stabilité (a<sub>w</sub>, isotherme de sorption, vieillissement accéléré) — 1 500 à 4 000 € par produit. <a href="contact.html">Demander une analyse →</a></p>';
    }
    render();
  }

  var uid = 0;
  function field(label, key, list, sel) {
    var id = 'dluo-' + key + '-' + (++uid);
    return '<div class="field"><label for="' + id + '">' + label + '</label>' +
      '<select id="' + id + '" data-k="' + key + '">' + opts(list, sel) + '</select></div>';
  }
  function cell(k, v) { return '<div class="dluo-cell"><span class="dluo-k">' + k + '</span><span class="dluo-v">' + v + '</span></div>'; }

  widgets.forEach(init);
})();
