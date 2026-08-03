#!/usr/bin/env node
/* =============================================================
   build-matieres.js — Générateur statique de la bibliothèque
   des matières. Lit data/matieres.json et écrit des pages HTML
   statiques dans /matieres/. À exécuter une fois après édition :
       node tools/build-matieres.js
   Le rendu final est du HTML statique pur (aucun build côté site).
   ============================================================= */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'matieres');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'matieres.json'), 'utf8'));

const FAM = {
  fruits: 'Fruits', legumes: 'Légumes', marin: 'Marin', carne: 'Carné',
  laitier: 'Laitier', botanique: 'Botanique', ferments: 'Ferments',
  champignons: 'Champignons', boissons: 'Boissons', souvenirs: 'Souvenirs', special: 'Spécial',
};
const bySlug = {};
data.forEach(m => { bySlug[m.slug] = m; });

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function attr(s) { return esc(s).replace(/"/g, '&quot;'); }
function clip(s, n) { return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s; }

const HEAD_SVG = `<svg class="mark" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#12b5c9"/><stop offset="1" stop-color="#0a5f6e"/></linearGradient></defs><circle cx="24" cy="24" r="22" fill="url(#g1)"/><g stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M24 9v30M11 24h26M15 15l18 18M33 15L15 33"/><path d="M24 9l-3 3M24 9l3 3M24 39l-3-3M24 39l3-3M11 24l3-3M11 24l3 3M37 24l-3-3M37 24l-3 3"/></g></svg>`;
const FOOT_SVG = `<svg class="mark" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#0f8b9e"/><g stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M24 9v30M11 24h26M15 15l18 18M33 15L15 33"/></g></svg>`;

function header() {
  return `  <a class="skip-link" href="#main">Aller au contenu</a>
  <header class="site-header">
    <div class="container nav">
      <a class="brand" href="../index.html" aria-label="Accueil LyoSurgères">${HEAD_SVG}<span>LyoSurgères<small>Lyophilisation à façon</small></span></a>
      <nav aria-label="Navigation principale">
        <ul class="nav-links">
          <li><a href="../index.html">Accueil</a></li>
          <li><a href="../services.html">Prestations</a></li>
          <li><a href="index.html">Matières</a></li>
          <li><a href="../journal/index.html">Journal</a></li>
          <li><a href="../a-propos.html">À propos</a></li>
          <li><a href="../contact.html">Contact</a></li>
        </ul>
      </nav>
      <div class="nav-cta">
        <a class="btn btn--primary" href="../reservation.html">Réserver un créneau</a>
        <button class="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false"><span></span></button>
      </div>
    </div>
  </header>`;
}

function footer() {
  return `  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="brand" style="color:#fff;">${FOOT_SVG}<span data-brand>LyoSurgères<small>Lyophilisation à façon</small></span></div>
          <p class="footer-note">Atelier et laboratoire de lyophilisation à façon à Surgères (17700), près de La Rochelle. Nous déshydratons vos produits par le froid, sans conservateur.</p>
          <div class="footer-social">
            <a data-social="facebook" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l1-4h-4V8c0-1 .3-2 2-2h2V2.1C18.5 2 17.5 2 16.5 2 13.9 2 12 3.7 12 6.7V10H9v4h3v8z"/></svg></a>
            <a data-social="instagram" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
            <a data-social="linkedin" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.1c.5-1 1.8-2 3.6-2 3.9 0 4.6 2.5 4.6 5.8V21h-4v-5c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6V21h-4z"/></svg></a>
          </div>
        </div>
        <div>
          <h4>Outils &amp; prestations</h4>
          <ul>
            <li><a href="index.html">Bibliothèque des matières</a></li>
            <li><a href="../stabilite-dluo.html">Calculateur de DLUO</a></li>
            <li><a href="../test-echantillon.html">Test échantillon (200 g)</a></li>
            <li><a href="../developpement-cycle.html">Développement de cycle</a></li>
          </ul>
        </div>
        <div>
          <h4>Navigation</h4>
          <ul>
            <li><a href="../index.html">Accueil</a></li>
            <li><a href="../services.html">Prestations</a></li>
            <li><a href="../a-propos.html">À propos</a></li>
            <li><a href="../contact.html">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li data-cfg-address></li>
            <li>Tél. <a data-cfg="phone" data-cfg-href="tel:">05 46 00 00 00</a></li>
            <li><a data-cfg="email" data-cfg-href="mailto:">contact@lyosurgeres.fr</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span data-year>2026</span> <span data-brand>LyoSurgères</span> · Tous droits réservés</span>
        <span><a href="../mentions-legales.html">Mentions légales</a></span>
      </div>
    </div>
  </footer>`;
}

// Matières disposant d'une page produit anglaise (hreflang réciproque).
const EN_ALT = {
  huitre: 'freeze-dried-oysters.html',
  spiruline: 'freeze-dried-spirulina.html',
};

function metaHead(title, desc, canonical, keywords, ogImage, enHref) {
  ogImage = ogImage || 'https://www.lyosurgeres.fr/og-cover.svg';
  const enLine = enHref ? `\n  <link rel="alternate" hreflang="en" href="${enHref}">` : '';
  return `  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${attr(desc)}">
  <meta name="keywords" content="${attr(keywords)}">
  <meta name="author" content="LyoSurgères">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${canonical}">${enLine}
  <link rel="alternate" hreflang="fr" href="${canonical}">
  <link rel="alternate" hreflang="x-default" href="${canonical}">
  <meta name="theme-color" content="#0f8b9e">
  <meta name="geo.region" content="FR-17">
  <meta name="geo.placename" content="Surgères">
  <meta name="geo.position" content="46.108;-0.748">
  <meta name="ICBM" content="46.108, -0.748">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="LyoSurgères">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:title" content="${attr(title)}">
  <meta property="og:description" content="${attr(desc)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${attr(title)}">
  <meta name="twitter:description" content="${attr(desc)}">
  <meta name="twitter:image" content="${ogImage}">
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='22' fill='%230f8b9e'/%3E%3Cg stroke='white' stroke-width='2.4' stroke-linecap='round'%3E%3Cpath d='M24 9v30M11 24h26M15 15l18 18M33 15L15 33'/%3E%3C/g%3E%3C/svg%3E">`;
}

// Paragraphes : découpe sur double saut de ligne, échappe le HTML.
function paras(txt) {
  return String(txt).split(/\n\n+/).map(function (p) { return '          <p>' + esc(p.trim()) + '</p>'; }).join('\n');
}
function section(eyebrow, title, content) {
  if (!content) return '';
  return `
    <section class="section">
      <div class="container" style="max-width:820px;">
        <span class="eyebrow">${esc(eyebrow)}</span>
        <h2>${esc(title)}</h2>
${paras(content)}
      </div>
    </section>`;
}

// Liste des 4 emplacements d'image (auto si le JSON n'en fournit pas).
const IMG_TYPES = [
  { type: 'avant-apres', label: 'Avant / après', w: 1200, h: 630 },
  { type: 'macro', label: 'Macro / texture', w: 800, h: 600 },
  { type: 'plateau', label: 'Sur plateau de lyophilisation', w: 800, h: 600 },
  { type: 'rehydratation', label: 'Réhydratation', w: 800, h: 600 },
];
function imageList(m) {
  if (m.images && m.images.length) {
    return m.images.map(function (i) {
      var t = IMG_TYPES.filter(function (x) { return x.type === i.type; })[0] || IMG_TYPES[1];
      return { fichier: i.fichier || ('lyophiliser-' + m.slug + '-' + i.type), alt: i.alt, legende: i.legende || t.label, type: i.type, w: t.w, h: t.h };
    });
  }
  return IMG_TYPES.map(function (t) {
    return { fichier: 'lyophiliser-' + m.slug + '-' + t.type, alt: m.nom + ' lyophilisé — ' + t.label.toLowerCase(), legende: t.label, type: t.type, w: t.w, h: t.h };
  });
}
// Placeholder SVG « liste de tournage » (dimensions réelles, nom du fichier attendu).
function placeholderSVG(m, im) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${im.w}" height="${im.h}" viewBox="0 0 ${im.w} ${im.h}" role="img" aria-label="${attr(im.alt)}">
  <rect width="${im.w}" height="${im.h}" fill="#eef8fa"/>
  <rect x="8" y="8" width="${im.w - 16}" height="${im.h - 16}" fill="none" stroke="#0f8b9e" stroke-width="3" stroke-dasharray="12 8"/>
  <g fill="#0a5f6e" font-family="'Segoe UI',Roboto,Arial,sans-serif" text-anchor="middle">
    <text x="${im.w / 2}" y="${im.h / 2 - 26}" font-size="30" font-weight="700">${esc(m.nom)}</text>
    <text x="${im.w / 2}" y="${im.h / 2 + 12}" font-size="22" font-weight="600">Prise de vue : ${esc(im.legende)}</text>
    <text x="${im.w / 2}" y="${im.h / 2 + 48}" font-size="16" font-family="monospace" fill="#33505f">${esc(im.fichier)}.webp</text>
    <text x="${im.w / 2}" y="${im.h - 28}" font-size="14" fill="#6b8391">Photo à venir · ${im.w}×${im.h}</text>
  </g>
</svg>`;
}

function faqOf(m) {
  if (m.faq && m.faq.length) return m.faq.map(function (f) { return { q: f.q, a: f.a }; });
  return [
    { q: `Peut-on lyophiliser ${m.nomDe.replace(/^de /, '')} ?`, a: `${m.procede} recommandé. ${m.procedeWhy}` },
    { q: `Quel est le ratio frais vers sec ${m.nomDe} ?`, a: `Environ ${m.ratio}, pour une teneur en eau de départ d'environ ${m.eau}. Durée de cycle indicative : ${m.cycle}.` },
    { q: `Quelle DLUO pour ${m.nomDe.replace(/^de /, '')} lyophilisé ?`, a: `${m.dluoTxt} L'aw cible recommandée est de ${m.aw}.` },
  ];
}

function fiche(m) {
  const url = `https://www.lyosurgeres.fr/matieres/${m.slug}.html`;
  const title = `${m.titre} — ratio, cycle, DLUO & procédé | LyoSurgères`;
  const desc = clip((m.intro ? m.intro.split(/(?<=[.!?])\s/)[0] + ' ' : '') + `${m.titre} : ratio ${m.ratio}, cycle ${m.cycle}, aw ${m.aw}. Procédé recommandé : ${m.procede}.`, 158);
  const kw = `lyophiliser ${m.nom}, ${m.nom} lyophilisé, ${m.titre}, lyophilisation ${m.famille}, DLUO ${m.nom}, ratio frais sec, séchage à froid, Surgères, La Rochelle`;

  const imgs = imageList(m);
  const lead = imgs[0];
  const ogImg = `https://www.lyosurgeres.fr/img/matieres/${lead.fichier}.webp`;
  const gallery = imgs.slice(1);
  const fig = (im, isLead) => `<figure class="fiche-fig${isLead ? ' fiche-fig--lead' : ''}">
          <img src="../img/matieres/${im.fichier}.svg" width="${im.w}" height="${im.h}" loading="lazy" decoding="async" alt="${attr(im.alt)}">
          <figcaption>${esc(im.legende)} <span class="hint">· visuel à venir : ${esc(im.fichier)}.webp</span></figcaption>
        </figure>`;

  const faq = faqOf(m);
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: m.titre, about: m.nom, inLanguage: 'fr', mainEntityOfPage: url, author: { '@type': 'Organization', name: 'LyoSurgères' }, publisher: { '@type': 'Organization', name: 'LyoSurgères' },
      image: imgs.map(im => ({ '@type': 'ImageObject', contentUrl: `https://www.lyosurgeres.fr/img/matieres/${im.fichier}.webp`, caption: im.legende, description: im.alt, width: im.w, height: im.h })) },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.lyosurgeres.fr/index.html' },
      { '@type': 'ListItem', position: 2, name: 'Bibliothèque des matières', item: 'https://www.lyosurgeres.fr/matieres/index.html' },
      { '@type': 'ListItem', position: 3, name: m.titre, item: url },
    ] },
  ];

  const related = (m.related || []).filter(s => bySlug[s]).slice(0, 6).map(s =>
    `<li><a href="${s}.html">Lyophiliser ${esc(bySlug[s].nomDe.replace(/^de /, ''))}</a></li>`).join('\n            ');
  const pieges = (m.pieges || []).map(p => `<li>${esc(p)}</li>`).join('\n            ');
  const apps = (m.applications || []).map(a => `<li>${esc(a)}</li>`).join('\n            ');
  const faqHtml = faq.map(f => `          <details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
${metaHead(title, desc, url, kw, ogImg, EN_ALT[m.slug] ? 'https://www.lyosurgeres.fr/en/' + EN_ALT[m.slug] : '')}
${ld.map(x => `  <script type="application/ld+json">\n  ${JSON.stringify(x)}\n  </script>`).join('\n')}
</head>
<body>
${header()}
  <main id="main">
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumb"><a href="../index.html">Accueil</a> · <a href="index.html">Matières</a> · ${esc(m.nom)}</div>
        <h1>${esc(m.titre)}</h1>
        <p>${esc(m.intro || m.procedeWhy)}</p>
      </div>
    </section>

    <section class="section">
      <div class="container" style="max-width:960px;">
        ${fig(lead, true)}
      </div>
    </section>

    <section class="section section--frost">
      <div class="container">
        <div class="center"><span class="eyebrow">${esc(FAM[m.famille] || m.famille)}</span><h2>En bref</h2></div>
        <div class="dluo-grid" style="max-width:820px;margin:30px auto 0;">
          <div class="dluo-cell"><span class="dluo-k">Ratio frais → sec</span><span class="dluo-v"><b>${esc(m.ratio)}</b></span></div>
          <div class="dluo-cell"><span class="dluo-k">Teneur en eau de départ</span><span class="dluo-v">${esc(m.eau)}</span></div>
          <div class="dluo-cell"><span class="dluo-k">Durée de cycle indicative</span><span class="dluo-v">${esc(m.cycle)}</span></div>
          <div class="dluo-cell"><span class="dluo-k">a<sub>w</sub> cible recommandée</span><span class="dluo-v">${esc(m.aw)}</span></div>
          <div class="dluo-cell"><span class="dluo-k">Procédé recommandé</span><span class="dluo-v"><b>${esc(m.procede)}</b></span></div>
        </div>
      </div>
    </section>
${section('Le procédé en détail', 'Comment ' + m.nom + ' se comporte à la lyophilisation', m.comportement)}
${section('Réglages', 'Paramètres de cycle', m.parametres)}
    <section class="section section--frost">
      <div class="container" style="max-width:820px;">
        <span class="eyebrow">Points de vigilance</span>
        <h2>Pièges connus</h2>
        <ul class="check-list" style="margin-top:16px;">
            ${pieges}
        </ul>
      </div>
    </section>
${gallery.length ? `
    <section class="section">
      <div class="container">
        <div class="fiche-gallery">
          ${gallery.map(im => fig(im, false)).join('\n          ')}
        </div>
      </div>
    </section>` : ''}
${section('Selon la matière', 'Variantes & provenance', m.variantes)}
    <section class="section section--frost">
      <div class="container split">
        <div>
          <span class="eyebrow">Conservation</span>
          <h2>Conservation &amp; DLUO</h2>
${m.conservation ? paras(m.conservation) : '          <p>' + esc(m.dluoTxt) + '</p>'}
        </div>
        <div>
          <div class="panel">
            <span class="eyebrow">DLUO indicative</span>
            <p style="margin-top:8px;">${esc(m.dluoTxt)}</p>
            <p style="margin-top:14px;font-weight:600;color:var(--ink);">Estimez selon votre emballage&nbsp;:</p>
            <div class="dluo-widget" data-famille="${attr(m.dluoFamille)}" data-lipides="${attr(m.dluoLipides)}" data-emballage="sachet" data-temp="t20" style="margin-top:12px;"></div>
          </div>
        </div>
      </div>
    </section>
${section('Comparaison', 'Face aux autres procédés de séchage', m.comparaison)}
    <section class="section">
      <div class="container" style="max-width:820px;">
        <span class="eyebrow">Débouchés</span>
        <h2>Marchés &amp; applications</h2>
${m.debouches ? paras(m.debouches) : ''}
        <ul class="check-list" style="margin-top:14px;">
            ${apps}
        </ul>
      </div>
    </section>

    <section class="section section--frost">
      <div class="container" style="max-width:820px;">
        <div class="center"><span class="eyebrow">FAQ</span><h2>Questions fréquentes — ${esc(m.nom)}</h2></div>
        <div class="faq" style="margin-top:30px;">
${faqHtml}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <div>
          <div class="nextstep">
            <span class="nextstep-label">Marche 1 · Comprendre → Marche 2 · Tester</span>
            <h2>Prochaine étape : envoyez-nous 200&nbsp;g</h2>
            <p>Vous avez les repères ${esc(m.nomDe)}. La suite logique&nbsp;: nous envoyer un échantillon et repartir avec une fiche technique sur <em>votre</em> produit — rendement, a<sub>w</sub> finale, coût au kilo.</p>
            <a class="btn btn--primary btn--lg" href="../test-echantillon.html">Tester ${esc(m.nomDe.replace(/^de /, ''))} — 250 à 500 €</a>
            <p class="hint" style="margin-top:10px;">Déductible de votre premier lot.</p>
          </div>
        </div>
        <div>
          <div class="panel">
            <h3 style="margin-top:0;">Matières proches</h3>
            <ul style="list-style:none;padding:0;margin:0;line-height:2;">
            ${related}
            </ul>
            <p style="margin-top:14px;"><a href="index.html">← Toute la bibliothèque des matières</a></p>
          </div>
        </div>
      </div>
    </section>
  </main>
${footer()}
  <script src="../js/config.js"></script>
  <script src="../js/main.js"></script>
  <script src="../js/dluo.js"></script>
</body>
</html>
`;
}

function indexPage() {
  const famsPresent = [];
  data.forEach(m => { if (famsPresent.indexOf(m.famille) === -1) famsPresent.push(m.famille); });
  const filters = ['<button type="button" class="mat-filter on" data-fam="all">Toutes</button>']
    .concat(famsPresent.map(f => `<button type="button" class="mat-filter" data-fam="${f}">${esc(FAM[f] || f)}</button>`)).join('\n          ');

  const cards = data.map(m => {
    const resume = clip(`${m.procede} · ratio ${m.ratio} · DLUO ${m.dluoTxt}`, 110);
    return `        <a class="card mat-card" href="${m.slug}.html" data-fam="${m.famille}" data-nom="${attr((m.nom + ' ' + m.titre).toLowerCase())}">
          <span class="tag">${esc(FAM[m.famille] || m.famille)}</span>
          <h3 style="margin-top:12px;">${esc(m.titre)}</h3>
          <p style="font-size:.92rem;">${esc(resume)}</p>
        </a>`;
  }).join('\n');

  const url = 'https://www.lyosurgeres.fr/matieres/index.html';
  const desc = `Bibliothèque de la lyophilisation : ${data.length} matières, avec ratio frais/sec, durée de cycle, aw cible, procédé recommandé et DLUO. Lyophiliser fruits, marin, botanique, ferments et plus.`;
  const kw = 'lyophiliser, bibliothèque matières, lyophilisation fruits, lyophilisation marin, DLUO, ratio frais sec, procédé, Surgères, La Rochelle';
  const ld = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Bibliothèque des matières — lyophilisation', url, inLanguage: 'fr', description: desc };

  return `<!DOCTYPE html>
<html lang="fr">
<head>
${metaHead('Bibliothèque des matières — lyophiliser du X | LyoSurgères', desc, url, kw)}
  <script type="application/ld+json">
  ${JSON.stringify(ld)}
  </script>
</head>
<body>
${header()}
  <main id="main">
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumb"><a href="../index.html">Accueil</a> · Bibliothèque des matières</div>
        <h1>Bibliothèque des matières</h1>
        <p>« Lyophiliser du X »&nbsp;: <strong><span id="mat-count">${data.length}</span> matières</strong> passées en revue — ratio frais/sec, durée de cycle, a<sub>w</sub> cible, procédé recommandé et DLUO indicative. Cherchez la vôtre.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="mat-search">
          <input type="search" id="mat-q" placeholder="Rechercher une matière (huître, fraise, curcuma…)" aria-label="Rechercher une matière">
        </div>
        <div class="mat-filters">
          ${filters}
        </div>
        <p class="mat-empty" id="mat-empty" hidden>Aucune matière ne correspond. <a href="../contact.html">Décrivez-nous votre produit →</a></p>
        <div class="grid grid-3 mat-grid" id="mat-grid" style="margin-top:24px;">
${cards}
        </div>
      </div>
    </section>
  </main>
${footer()}
  <script src="../js/config.js"></script>
  <script src="../js/main.js"></script>
  <script>
  (function () {
    var q = document.getElementById('mat-q');
    var grid = document.getElementById('mat-grid');
    var count = document.getElementById('mat-count');
    var empty = document.getElementById('mat-empty');
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.mat-card'));
    var fam = 'all';
    function norm(s){ return s.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase(); }
    function apply() {
      var term = norm(q.value.trim());
      var n = 0;
      cards.forEach(function (c) {
        var okF = (fam === 'all' || c.getAttribute('data-fam') === fam);
        var okQ = (!term || norm(c.getAttribute('data-nom')).indexOf(term) !== -1);
        var show = okF && okQ;
        c.hidden = !show; if (show) n++;
      });
      count.textContent = n;
      empty.hidden = n !== 0;
    }
    q.addEventListener('input', apply);
    document.querySelectorAll('.mat-filter').forEach(function (b) {
      b.addEventListener('click', function () {
        fam = b.getAttribute('data-fam');
        document.querySelectorAll('.mat-filter').forEach(function (x) { x.classList.toggle('on', x === b); });
        apply();
      });
    });
  })();
  </script>
</body>
</html>
`;
}

// Compte de mots du contenu <main> (hors balises).
function wordCount(html) {
  var body = (html.match(/<main[\s\S]*?<\/main>/) || [''])[0];
  var text = body.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
  return (text.trim().match(/\S+/g) || []).length;
}

// --- Écriture ---
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const IMG_OUT = path.join(ROOT, 'img', 'matieres');
if (!fs.existsSync(IMG_OUT)) fs.mkdirSync(IMG_OUT, { recursive: true });
let n = 0, thin = [], imgN = 0;
data.forEach(m => {
  const html = fiche(m);
  fs.writeFileSync(path.join(OUT, m.slug + '.html'), html);
  n++;
  const wc = wordCount(html);
  if (wc < 800) thin.push(m.slug + ' (' + wc + ')');
  // Placeholders images « liste de tournage »
  imageList(m).forEach(im => {
    const p = path.join(IMG_OUT, im.fichier + '.svg');
    if (!fs.existsSync(p)) { fs.writeFileSync(p, placeholderSVG(m, im)); imgN++; }
  });
});
fs.writeFileSync(path.join(OUT, 'index.html'), indexPage());
console.log('Généré : ' + n + ' fiches + index dans /matieres/ ; ' + imgN + ' placeholders images créés');
if (thin.length) console.log('⚠ Fiches sous 800 mots (' + thin.length + '/' + n + ') : ' + thin.join(', '));
else console.log('✓ Toutes les fiches dépassent 800 mots');
// Lignes sitemap (à intégrer dans sitemap.xml)
console.log('SITEMAP:');
console.log('  <url><loc>https://www.lyosurgeres.fr/matieres/index.html</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>');
data.forEach(m => console.log('  <url><loc>https://www.lyosurgeres.fr/matieres/' + m.slug + '.html</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>'));
