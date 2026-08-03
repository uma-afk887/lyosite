#!/usr/bin/env node
/* build-villes.js — Génère /villes/ (pages locales par bassin) depuis
   data/villes.json. Contenu différencié par ville (filières, distance,
   chaîne du froid, matières typiques).  node tools/build-villes.js       */
'use strict';
const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'); const OUT = path.join(ROOT, 'villes');
const villes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'villes.json'), 'utf8'));
const matieres = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'matieres.json'), 'utf8'));
const matBySlug = {}; matieres.forEach(m => { matBySlug[m.slug] = m; });

const MARK = '<svg class="mark" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#12b5c9"/><stop offset="1" stop-color="#0a5f6e"/></linearGradient></defs><circle cx="24" cy="24" r="22" fill="url(#g1)"/><g stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M24 9v30M11 24h26M15 15l18 18M33 15L15 33"/><path d="M24 9l-3 3M24 9l3 3M24 39l-3-3M24 39l3-3M11 24l3-3M11 24l3 3M37 24l-3-3M37 24l-3 3"/></g></svg>';
const FMARK = '<svg class="mark" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#0f8b9e"/><g stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M24 9v30M11 24h26M15 15l18 18M33 15L15 33"/></g></svg>';
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function attr(s) { return esc(s).replace(/"/g, '&quot;'); }
function paras(t) { return String(t).split(/\n\n+/).map(p => '        <p>' + esc(p.trim()) + '</p>').join('\n'); }

function header() {
  return `  <a class="skip-link" href="#main">Aller au contenu</a>
  <header class="site-header"><div class="container nav">
      <a class="brand" href="../index.html" aria-label="Accueil LyoSurgères">${MARK}<span>LyoSurgères<small>Lyophilisation à façon</small></span></a>
      <nav aria-label="Navigation principale"><ul class="nav-links"><li><a href="../index.html">Accueil</a></li><li><a href="../services.html">Prestations</a></li><li><a href="../matieres/index.html">Matières</a></li><li><a href="../journal/index.html">Journal</a></li><li><a href="../a-propos.html">À propos</a></li><li><a href="../contact.html">Contact</a></li></ul></nav>
      <div class="nav-cta"><a class="btn btn--primary" href="../reservation.html">Réserver un créneau</a><button class="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false"><span></span></button></div>
  </div></header>`;
}
function footer() {
  const links = villes.map(v => `<li><a href="${v.slug}.html">${esc(v.nom)}</a></li>`).join('');
  return `  <footer class="site-footer"><div class="container"><div class="footer-grid">
        <div><div class="brand" style="color:#fff;">${FMARK}<span data-brand>LyoSurgères<small>Lyophilisation à façon</small></span></div><p class="footer-note">Atelier et laboratoire de lyophilisation à façon à Surgères (17700), près de La Rochelle. Nous desservons toute la Nouvelle-Aquitaine et au-delà.</p></div>
        <div><h4>Zones desservies</h4><ul>${links}</ul></div>
        <div><h4>Navigation</h4><ul><li><a href="../index.html">Accueil</a></li><li><a href="../services.html">Prestations</a></li><li><a href="../lyophilisation-a-facon.html">Lyophilisation à façon</a></li><li><a href="../contact.html">Contact</a></li></ul></div>
        <div><h4>Contact</h4><ul><li data-cfg-address></li><li>Tél. <a data-cfg="phone" data-cfg-href="tel:">05 46 00 00 00</a></li><li><a data-cfg="email" data-cfg-href="mailto:">contact@lyosurgeres.fr</a></li></ul></div>
      </div><div class="footer-bottom"><span>© <span data-year>2026</span> <span data-brand>LyoSurgères</span> · Tous droits réservés</span><span><a href="../mentions-legales.html">Mentions légales</a></span></div>
  </div></footer>`;
}
function metaHead(title, desc, canonical, kw, ld) {
  return `  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${attr(desc)}">
  <meta name="keywords" content="${attr(kw)}">
  <meta name="author" content="LyoSurgères">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="fr" href="${canonical}">
  <link rel="alternate" hreflang="x-default" href="${canonical}">
  <meta name="theme-color" content="#0f8b9e">
  <meta name="geo.region" content="FR-17"><meta name="geo.placename" content="Surgères"><meta name="geo.position" content="46.108;-0.748"><meta name="ICBM" content="46.108, -0.748">
  <meta property="og:type" content="article"><meta property="og:site_name" content="LyoSurgères"><meta property="og:locale" content="fr_FR">
  <meta property="og:title" content="${attr(title)}"><meta property="og:description" content="${attr(desc)}"><meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://www.lyosurgeres.fr/og-cover.svg"><meta property="og:image:alt" content="LyoSurgères — lyophilisation à façon à Surgères, près de La Rochelle">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${attr(title)}"><meta name="twitter:description" content="${attr(desc)}"><meta name="twitter:image" content="https://www.lyosurgeres.fr/og-cover.svg">
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='22' fill='%230f8b9e'/%3E%3Cg stroke='white' stroke-width='2.4' stroke-linecap='round'%3E%3Cpath d='M24 9v30M11 24h26M15 15l18 18M33 15L15 33'/%3E%3C/g%3E%3C/svg%3E">
${ld}`;
}

function ville(v) {
  const url = `https://www.lyosurgeres.fr/villes/${v.slug}.html`;
  const title = `Lyophilisation à façon près de ${v.nom} (${v.dept}) | LyoSurgères`;
  const desc = `Lyophilisation à façon pour ${v.nom} et ${v.dept}, à ${v.distanceKm} km de notre atelier de Surgères (~${v.tempsMin} min). Filières locales, transport, chaîne du froid et matières typiques du bassin.`;
  const kw = `lyophilisation ${v.nom}, lyophilisation à façon ${v.nom}, prestataire lyophilisation ${v.nom}, séchage à froid ${v.nom}, ${v.dept}, Surgères`;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Service', name: `Lyophilisation à façon près de ${v.nom}`, provider: { '@type': 'LocalBusiness', '@id': 'https://www.lyosurgeres.fr/#business', name: 'LyoSurgères', url: 'https://www.lyosurgeres.fr/' }, areaServed: { '@type': 'City', name: v.nom }, description: desc },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.lyosurgeres.fr/index.html' },
      { '@type': 'ListItem', position: 2, name: 'Zones desservies', item: 'https://www.lyosurgeres.fr/villes/index.html' },
      { '@type': 'ListItem', position: 3, name: v.nom, item: url },
    ] },
  ];
  const mats = (v.related || []).filter(s => matBySlug[s]).map(s =>
    `<li><a href="../matieres/${s}.html">Lyophiliser ${esc(matBySlug[s].nomDe.replace(/^de /, ''))}</a></li>`).join('\n            ');
  return `<!DOCTYPE html>
<html lang="fr">
<head>
${metaHead(title, desc, url, kw, ld.map(x => `  <script type="application/ld+json">\n  ${JSON.stringify(x)}\n  </script>`).join('\n'))}
</head>
<body>
${header()}
  <main id="main">
    <section class="page-hero"><div class="container">
      <div class="breadcrumb"><a href="../index.html">Accueil</a> · <a href="index.html">Zones desservies</a> · ${esc(v.nom)}</div>
      <h1>Lyophilisation à façon près de ${esc(v.nom)}</h1>
      <p>${esc(v.intro)}</p>
    </div></section>

    <section class="section"><div class="container">
      <div class="dluo-grid" style="max-width:820px;margin:0 auto;">
        <div class="dluo-cell"><span class="dluo-k">Bassin</span><span class="dluo-v">${esc(v.nom)} — ${esc(v.dept)}</span></div>
        <div class="dluo-cell"><span class="dluo-k">Distance de l'atelier</span><span class="dluo-v"><b>${v.distanceKm} km</b></span></div>
        <div class="dluo-cell"><span class="dluo-k">Temps de route</span><span class="dluo-v">~${v.tempsMin} min depuis Surgères</span></div>
      </div>
    </div></section>

    <section class="section section--frost"><div class="container" style="max-width:820px;">
      <span class="eyebrow">Filières locales</span>
      <h2>Ce que produit le bassin de ${esc(v.nom)}</h2>
${paras(v.filieres)}
    </div></section>

    <section class="section"><div class="container" style="max-width:820px;">
      <span class="eyebrow">Transport &amp; chaîne du froid</span>
      <h2>De ${esc(v.nom)} à notre atelier</h2>
${paras(v.transport)}
    </div></section>

    <section class="section section--frost"><div class="container split">
      <div>
        <span class="eyebrow">Matières typiques</span>
        <h2>Exemples pour ce bassin</h2>
        <p>${esc(v.exemples)}</p>
      </div>
      <div><div class="panel">
        <h3 style="margin-top:0;">Fiches matières associées</h3>
        <ul style="list-style:none;padding:0;margin:0;line-height:2;">
            ${mats}
        </ul>
        <p style="margin-top:12px;"><a href="../matieres/index.html">Toute la bibliothèque →</a></p>
      </div></div>
    </div></section>

    <section class="section"><div class="container">
      <div class="cta-band">
        <h2>Un produit à lyophiliser près de ${esc(v.nom)}&nbsp;?</h2>
        <p>Commencez par le test à 200&nbsp;g, ou parlons transport et volumes pour organiser une collecte.</p>
        <a class="btn btn--primary btn--lg" href="../test-echantillon.html">Tester mon produit</a>
      </div>
    </div></section>
  </main>
${footer()}
  <script src="../js/config.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
`;
}

function index() {
  const cards = villes.map(v => `        <a class="card mat-card" href="${v.slug}.html">
          <span class="tag">${esc(v.dept)}</span>
          <h3 style="margin-top:12px;">${esc(v.nom)}</h3>
          <p style="font-size:.92rem;">${v.distanceKm} km · ~${v.tempsMin} min de l'atelier</p>
        </a>`).join('\n');
  const url = 'https://www.lyosurgeres.fr/villes/index.html';
  const desc = 'Zones desservies par LyoSurgères depuis Surgères : La Rochelle, Niort, Rochefort, Saintes, Angoulême, Poitiers, Nantes, Bordeaux. Lyophilisation à façon pour toute la Nouvelle-Aquitaine.';
  const ld = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Zones desservies — lyophilisation à façon', url, inLanguage: 'fr', description: desc };
  return `<!DOCTYPE html>
<html lang="fr">
<head>
${metaHead('Zones desservies — lyophilisation à façon en Nouvelle-Aquitaine | LyoSurgères', desc, url, 'lyophilisation Nouvelle-Aquitaine, La Rochelle, Niort, Rochefort, Saintes, Angoulême, Poitiers, Nantes, Bordeaux, prestataire lyophilisation', '  <script type="application/ld+json">\n  ' + JSON.stringify(ld) + '\n  </script>')}
</head>
<body>
${header()}
  <main id="main">
    <section class="page-hero"><div class="container">
      <div class="breadcrumb"><a href="../index.html">Accueil</a> · Zones desservies</div>
      <h1>Zones desservies</h1>
      <p>Depuis Surgères (17700), nous rayonnons sur toute la Nouvelle-Aquitaine et au-delà. Chaque bassin a ses filières et ses matières&nbsp;: choisissez le vôtre.</p>
    </div></section>
    <section class="section"><div class="container">
      <div class="grid grid-3" style="margin-top:10px;">
${cards}
      </div>
    </div></section>
  </main>
${footer()}
  <script src="../js/config.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
`;
}

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
villes.forEach(v => fs.writeFileSync(path.join(OUT, v.slug + '.html'), ville(v)));
fs.writeFileSync(path.join(OUT, 'index.html'), index());
console.log('Villes : ' + villes.length + ' pages + index');
console.log('SITEMAP:');
console.log('  <url><loc>https://www.lyosurgeres.fr/villes/index.html</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>');
villes.forEach(v => console.log('  <url><loc>https://www.lyosurgeres.fr/villes/' + v.slug + '.html</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>'));
