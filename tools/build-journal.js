#!/usr/bin/env node
/* build-journal.js — Génère /journal/ (index + articles) depuis la
   liste ARTICLES ci-dessous. Ajoutez une entrée puis relancez :
       node tools/build-journal.js                                     */
'use strict';
const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'); const OUT = path.join(ROOT, 'journal');

// date passée en dur (pas de Date.now déterministe nécessaire ici)
const ARTICLES = [
  { slug: 'huitres-marennes', date: '2026-07-28', titre: 'Un lot d’huîtres de Marennes',
    matiere: 'Huître', ratio: '6:1', aw: '0,38',
    ok: ['Arôme iodé très concentré, texture tenue', 'Réhydratation nette en 10 minutes'],
    rate: ['Premier essai trop poussé (aw 0,22) : légère amertume grasse — cycle corrigé'],
    body: ['Objectif du client : une poudre d’huître pour la gastronomie. On a calé la congélation à cœur puis un palier de sublimation doux.',
      'La leçon : sur un marin gras, viser aw 0,30–0,50, pas plus bas. Le deuxième essai à 0,38 était nettement meilleur que le premier à 0,22.'] },
  { slug: 'spiruline-paillettes', date: '2026-07-21', titre: 'Spiruline fraîche en paillettes',
    matiere: 'Spiruline', ratio: '6:1', aw: '0,25',
    ok: ['Couleur bleu-vert préservée, aucune odeur de séchage', 'Paillettes régulières, faciles à conditionner'],
    rate: ['Une plaque trop chargée a allongé le cycle de 4 h — mieux répartir'],
    body: ['La spiruline fraîche est un cas d’école du froid : toute montée en température vire la couleur et détruit la phycocyanine.',
      'Conditionnement en barrière opaque immédiat pour éviter l’oxydation. Résultat premium, très au-dessus d’un séchage à chaud.'] },
  { slug: 'framboises-collapse', date: '2026-07-14', titre: 'Framboises : le collapse évité de justesse',
    matiere: 'Framboise', ratio: '9:1', aw: '0,26',
    ok: ['Croquant fondant, couleur intacte, akènes discrets'],
    rate: ['Rampe de température initiale trop rapide : début de collapse sur la première fournée', 'Cycle ralenti en phase primaire pour la seconde — parfait'],
    body: ['Les fruits très sucrés collapsent si on chauffe trop vite pendant la sublimation. La transition vitreuse est basse.',
      'On a rallongé la phase primaire à basse température : la structure a tenu. Un bon rappel que la vitesse n’est pas gratuite.'] },
];

const MARK = '<svg class="mark" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#12b5c9"/><stop offset="1" stop-color="#0a5f6e"/></linearGradient></defs><circle cx="24" cy="24" r="22" fill="url(#g1)"/><g stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M24 9v30M11 24h26M15 15l18 18M33 15L15 33"/><path d="M24 9l-3 3M24 9l3 3M24 39l-3-3M24 39l3-3M11 24l3-3M11 24l3 3M37 24l-3-3M37 24l-3 3"/></g></svg>';
const FMARK = '<svg class="mark" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#0f8b9e"/><g stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M24 9v30M11 24h26M15 15l18 18M33 15L15 33"/></g></svg>';

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function attr(s){ return esc(s).replace(/"/g,'&quot;'); }

function header(){ return `  <a class="skip-link" href="#main">Aller au contenu</a>
  <header class="site-header"><div class="container nav">
      <a class="brand" href="../index.html" aria-label="Accueil LyoSurgères">${MARK}<span>LyoSurgères<small>Lyophilisation à façon</small></span></a>
      <nav aria-label="Navigation principale"><ul class="nav-links"><li><a href="../index.html">Accueil</a></li><li><a href="../services.html">Prestations</a></li><li><a href="../matieres/index.html">Matières</a></li><li><a href="index.html">Journal</a></li><li><a href="../a-propos.html">À propos</a></li><li><a href="../contact.html">Contact</a></li></ul></nav>
      <div class="nav-cta"><a class="btn btn--primary" href="../reservation.html">Réserver un créneau</a><button class="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false"><span></span></button></div>
  </div></header>`; }
function footer(){ return `  <footer class="site-footer"><div class="container"><div class="footer-grid">
        <div><div class="brand" style="color:#fff;">${FMARK}<span data-brand>LyoSurgères<small>Lyophilisation à façon</small></span></div><p class="footer-note">Atelier et laboratoire de lyophilisation à façon à Surgères (17700), près de La Rochelle.</p>
          <div class="footer-social"><a data-social="facebook" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l1-4h-4V8c0-1 .3-2 2-2h2V2.1C18.5 2 17.5 2 16.5 2 13.9 2 12 3.7 12 6.7V10H9v4h3v8z"/></svg></a></div></div>
        <div><h4>Explorer</h4><ul><li><a href="index.html">Journal de l'atelier</a></li><li><a href="../matieres/index.html">Bibliothèque des matières</a></li><li><a href="../stabilite-dluo.html">Calculateur de DLUO</a></li><li><a href="../ce-qui-ne-marche-pas.html">Ce qui ne marche pas</a></li></ul></div>
        <div><h4>Navigation</h4><ul><li><a href="../index.html">Accueil</a></li><li><a href="../services.html">Prestations</a></li><li><a href="../a-propos.html">À propos</a></li><li><a href="../contact.html">Contact</a></li></ul></div>
        <div><h4>Contact</h4><ul><li data-cfg-address></li><li>Tél. <a data-cfg="phone" data-cfg-href="tel:">05 46 00 00 00</a></li><li><a data-cfg="email" data-cfg-href="mailto:">contact@lyosurgeres.fr</a></li></ul></div>
      </div><div class="footer-bottom"><span>© <span data-year>2026</span> <span data-brand>LyoSurgères</span> · Tous droits réservés</span><span><a href="../mentions-legales.html">Mentions légales</a></span></div>
  </div></footer>`; }
function metaHead(title, desc, canonical, kw, ld){ return `  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${attr(desc)}">
  <meta name="keywords" content="${attr(kw)}">
  <meta name="author" content="LyoSurgères">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <meta name="theme-color" content="#0f8b9e">
  <meta name="geo.region" content="FR-17"><meta name="geo.placename" content="Surgères"><meta name="geo.position" content="46.108;-0.748"><meta name="ICBM" content="46.108, -0.748">
  <meta property="og:type" content="article"><meta property="og:site_name" content="LyoSurgères"><meta property="og:locale" content="fr_FR">
  <meta property="og:title" content="${attr(title)}"><meta property="og:description" content="${attr(desc)}"><meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://www.lyosurgeres.fr/og-cover.svg"><meta property="og:image:alt" content="LyoSurgères">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${attr(title)}"><meta name="twitter:description" content="${attr(desc)}"><meta name="twitter:image" content="https://www.lyosurgeres.fr/og-cover.svg">
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='22' fill='%230f8b9e'/%3E%3Cg stroke='white' stroke-width='2.4' stroke-linecap='round'%3E%3Cpath d='M24 9v30M11 24h26M15 15l18 18M33 15L15 33'/%3E%3C/g%3E%3C/svg%3E">
${ld}`; }

function panel(a){ return `<div class="media-panel" aria-hidden="true" style="min-height:220px;"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M24 4v40M6 24h36M11 11l26 26M37 11L11 37"/></svg></div>`; }

function article(a){
  const url = `https://www.lyosurgeres.fr/journal/${a.slug}.html`;
  const desc = `Journal de l'atelier : ${a.titre}. Matière ${a.matiere}, ratio ${a.ratio}, aw ${a.aw}. Ce qui a marché, ce qui a raté.`;
  const ld = `  <script type="application/ld+json">\n  ${JSON.stringify({'@context':'https://schema.org','@type':'BlogPosting',headline:a.titre,datePublished:a.date,about:a.matiere,author:{'@type':'Organization',name:'LyoSurgères'},publisher:{'@type':'Organization',name:'LyoSurgères'},mainEntityOfPage:url})}\n  </script>`;
  const ok = a.ok.map(x=>`<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg> ${esc(x)}</li>`).join('\n            ');
  const rate = a.rate.map(x=>`<li>${esc(x)}</li>`).join('\n            ');
  const body = a.body.map(p=>`<p>${esc(p)}</p>`).join('\n          ');
  return `<!DOCTYPE html>
<html lang="fr">
<head>
${metaHead(a.titre + " — Journal de l'atelier | LyoSurgères", desc, url, `journal atelier lyophilisation, ${a.matiere.toLowerCase()} lyophilisé, retour d'expérience, ratio, aw`, ld)}
</head>
<body>
${header()}
  <main id="main">
    <section class="page-hero"><div class="container">
      <div class="breadcrumb"><a href="../index.html">Accueil</a> · <a href="index.html">Journal</a> · ${esc(a.matiere)}</div>
      <h1>${esc(a.titre)}</h1>
      <p>${esc(a.date)} · matière traitée : <strong>${esc(a.matiere)}</strong></p>
    </div></section>
    <section class="section"><div class="container split">
      <div>
        <div class="dluo-grid" style="grid-template-columns:1fr 1fr;">
          <div class="dluo-cell"><span class="dluo-k">Matière</span><span class="dluo-v">${esc(a.matiere)}</span></div>
          <div class="dluo-cell"><span class="dluo-k">Ratio frais → sec</span><span class="dluo-v"><b>${esc(a.ratio)}</b></span></div>
          <div class="dluo-cell"><span class="dluo-k">a<sub>w</sub> finale</span><span class="dluo-v">${esc(a.aw)}</span></div>
          <div class="dluo-cell"><span class="dluo-k">Verdict</span><span class="dluo-v">À reproduire</span></div>
        </div>
        <h3 style="margin-top:24px;">Ce qui a marché</h3>
        <ul class="check-list">
            ${ok}
        </ul>
        <h3 style="margin-top:20px;">Ce qui a raté</h3>
        <ul>
            ${rate}
        </ul>
        <div style="margin-top:20px;">
          ${body}
        </div>
        <p style="margin-top:24px;"><a class="btn btn--primary" href="../test-echantillon.html">Tester mon produit (200 g)</a></p>
        <p style="margin-top:14px;"><a href="index.html">← Retour au journal</a></p>
      </div>
      ${panel(a)}
    </div></section>
  </main>
${footer()}
  <script src="../js/config.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
`;
}

function index(){
  const cards = ARTICLES.map(a=>`        <a class="card journal-card" href="${a.slug}.html">
          <span class="tag">${esc(a.matiere)}</span>
          <h3 style="margin-top:12px;">${esc(a.titre)}</h3>
          <div class="jmeta"><span>${esc(a.date)}</span><span>ratio <b>${esc(a.ratio)}</b></span><span>a<sub>w</sub> ${esc(a.aw)}</span></div>
        </a>`).join('\n');
  const url='https://www.lyosurgeres.fr/journal/index.html';
  const desc="Le journal de l'atelier LyoSurgères : chaque semaine, une matière lyophilisée, son ratio, son aw finale, ce qui a marché et ce qui a raté.";
  const ld=`  <script type="application/ld+json">\n  ${JSON.stringify({'@context':'https://schema.org','@type':'Blog',name:"Journal de l'atelier LyoSurgères",url,inLanguage:'fr',description:desc})}\n  </script>`;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
${metaHead("Journal de l'atelier — retours d'expérience lyophilisation | LyoSurgères", desc, url, "journal lyophilisation, retour d'expérience, atelier, ratio, aw, matières lyophilisées", ld)}
</head>
<body>
${header()}
  <main id="main">
    <section class="page-hero"><div class="container">
      <div class="breadcrumb"><a href="../index.html">Accueil</a> · Journal</div>
      <h1>Journal de l'atelier</h1>
      <p>Chaque semaine, une matière qui passe par nos chambres : la photo, le ratio obtenu, l'a<sub>w</sub> finale, ce qui a bien marché et ce qui a raté. La preuve par le travail.</p>
    </div></section>
    <section class="section"><div class="container">
      <div class="journal-grid">
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
ARTICLES.forEach(a => fs.writeFileSync(path.join(OUT, a.slug + '.html'), article(a)));
fs.writeFileSync(path.join(OUT, 'index.html'), index());
console.log('Journal : ' + ARTICLES.length + ' articles + index');
console.log('SITEMAP:');
console.log('  <url><loc>https://www.lyosurgeres.fr/journal/index.html</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>');
ARTICLES.forEach(a=>console.log('  <url><loc>https://www.lyosurgeres.fr/journal/'+a.slug+'.html</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>'));
