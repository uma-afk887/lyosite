#!/usr/bin/env node
/* build-fiches.js — Génère /fiches/ : une fiche imprimable (PDF via
   impression navigateur, @media print) par famille de matières, plus un
   index avec capture d'e-mail. Source : data/matieres.json.
       node tools/build-fiches.js                                        */
'use strict';
const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'); const OUT = path.join(ROOT, 'fiches');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'matieres.json'), 'utf8'));

const FAM = { fruits:'Fruits', legumes:'Légumes', marin:'Marin', carne:'Carné', laitier:'Laitier', botanique:'Botanique', ferments:'Ferments', champignons:'Champignons', boissons:'Boissons', souvenirs:'Souvenirs', special:'Spécial' };
const groups = {};
data.forEach(m => { (groups[m.famille] = groups[m.famille] || []).push(m); });
const order = Object.keys(groups);

const MARK = '<svg class="mark" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#12b5c9"/><stop offset="1" stop-color="#0a5f6e"/></linearGradient></defs><circle cx="24" cy="24" r="22" fill="url(#g1)"/><g stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M24 9v30M11 24h26M15 15l18 18M33 15L15 33"/></g></svg>';
const FMARK = MARK;
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function attr(s){ return esc(s).replace(/"/g,'&quot;'); }

function header(){ return `  <a class="skip-link" href="#main">Aller au contenu</a>
  <header class="site-header"><div class="container nav">
      <a class="brand" href="../index.html" aria-label="Accueil LyoSurgères">${MARK}<span>LyoSurgères<small>Lyophilisation à façon</small></span></a>
      <nav aria-label="Navigation principale"><ul class="nav-links"><li><a href="../index.html">Accueil</a></li><li><a href="../services.html">Prestations</a></li><li><a href="../matieres/index.html">Matières</a></li><li><a href="index.html">Guides</a></li><li><a href="../a-propos.html">À propos</a></li><li><a href="../contact.html">Contact</a></li></ul></nav>
      <div class="nav-cta"><a class="btn btn--primary" href="../reservation.html">Réserver un créneau</a><button class="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false"><span></span></button></div>
  </div></header>`; }
function footer(){ return `  <footer class="site-footer"><div class="container"><div class="footer-grid">
        <div><div class="brand" style="color:#fff;">${FMARK}<span data-brand>LyoSurgères<small>Lyophilisation à façon</small></span></div><p class="footer-note">Atelier et laboratoire de lyophilisation à façon à Surgères (17700), près de La Rochelle.</p></div>
        <div><h4>Explorer</h4><ul><li><a href="index.html">Guides à télécharger</a></li><li><a href="../matieres/index.html">Bibliothèque des matières</a></li><li><a href="../stabilite-dluo.html">Calculateur de DLUO</a></li></ul></div>
        <div><h4>Navigation</h4><ul><li><a href="../index.html">Accueil</a></li><li><a href="../services.html">Prestations</a></li><li><a href="../contact.html">Contact</a></li></ul></div>
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
  <meta property="og:type" content="website"><meta property="og:site_name" content="LyoSurgères"><meta property="og:locale" content="fr_FR">
  <meta property="og:title" content="${attr(title)}"><meta property="og:description" content="${attr(desc)}"><meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://www.lyosurgeres.fr/og-cover.svg"><meta property="og:image:alt" content="LyoSurgères">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${attr(title)}"><meta name="twitter:description" content="${attr(desc)}"><meta name="twitter:image" content="https://www.lyosurgeres.fr/og-cover.svg">
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='22' fill='%230f8b9e'/%3E%3Cg stroke='white' stroke-width='2.4' stroke-linecap='round'%3E%3Cpath d='M24 9v30M11 24h26M15 15l18 18M33 15L15 33'/%3E%3C/g%3E%3C/svg%3E">
${ld}`; }

function guide(fam){
  const items = groups[fam];
  const label = FAM[fam] || fam;
  const url = `https://www.lyosurgeres.fr/fiches/${fam}.html`;
  const rows = items.map(m=>`            <tr><th scope="row">${esc(m.nom)}</th><td>${esc(m.ratio)}</td><td>${esc(m.cycle)}</td><td>${esc(m.aw)}</td><td>${esc(m.procede)}</td><td>${esc(m.dluoTxt)}</td></tr>`).join('\n');
  const desc = `Guide de lyophilisation — famille ${label} : ratio frais/sec, durée de cycle, aw cible, procédé recommandé et DLUO pour ${items.length} matières. Fiche imprimable en PDF.`;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
${metaHead(`Guide lyophilisation — ${label} | LyoSurgères`, desc, url, `guide lyophilisation ${label.toLowerCase()}, fiche technique lyophilisation, ratio, aw, DLUO, PDF`, '')}
</head>
<body>
${header()}
  <main id="main">
    <section class="page-hero"><div class="container">
      <div class="breadcrumb"><a href="../index.html">Accueil</a> · <a href="index.html">Guides</a> · ${esc(label)}</div>
      <h1>Guide lyophilisation — ${esc(label)}</h1>
      <p>Les repères techniques pour ${items.length} matières de la famille « ${esc(label)} » : ratio frais/sec, durée de cycle, a<sub>w</sub> cible, procédé recommandé et DLUO indicative.</p>
      <div class="print-actions no-print"><button type="button" class="btn btn--primary" onclick="window.print()">Imprimer / enregistrer en PDF</button></div>
    </div></section>
    <section class="section"><div class="container">
      <div class="print-cover" style="display:none;"><strong>LyoSurgères</strong> — Guide lyophilisation « ${esc(label)} » — www.lyosurgeres.fr</div>
      <div style="overflow-x:auto;">
        <table class="guide-table">
          <thead><tr><th>Matière</th><th>Ratio frais→sec</th><th>Cycle</th><th>a<sub>w</sub> cible</th><th>Procédé</th><th>DLUO indicative</th></tr></thead>
          <tbody>
${rows}
          </tbody>
        </table>
      </div>
      <p class="hint" style="margin-top:14px;">Repères indicatifs. Pour une DLUO opposable, voir l'<a href="../stabilite-dluo.html">analyse de stabilité</a>. Pour tester votre produit, le <a href="../test-echantillon.html">test 200 g</a>.</p>
      <p class="no-print" style="margin-top:18px;"><a href="index.html">← Tous les guides</a></p>
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
  const cards = order.map(fam=>`          <li class="dl-item"><a href="${fam}.html">Guide « ${esc(FAM[fam]||fam)} »</a> <span class="hint">(${groups[fam].length} matières)</span></li>`).join('\n');
  const url='https://www.lyosurgeres.fr/fiches/index.html';
  const desc="Téléchargez nos guides de lyophilisation par famille (fruits, marin, botanique, ferments…) : ratio, cycle, aw, procédé et DLUO. Fiches imprimables en PDF.";
  return `<!DOCTYPE html>
<html lang="fr">
<head>
${metaHead("Guides de lyophilisation à télécharger (PDF) | LyoSurgères", desc, url, "guides lyophilisation PDF, fiche technique lyophilisation, télécharger, ratio, aw, DLUO", '')}
</head>
<body>
${header()}
  <main id="main">
    <section class="page-hero"><div class="container">
      <div class="breadcrumb"><a href="../index.html">Accueil</a> · Guides</div>
      <h1>Guides à télécharger</h1>
      <p>Un guide technique par famille de produits : ratio, cycle, a<sub>w</sub>, procédé et DLUO, prêt à imprimer en PDF. Laissez votre e-mail pour recevoir la collection complète et ses mises à jour.</p>
    </div></section>
    <section class="section"><div class="container" style="max-width:720px;">
      <div class="panel">
        <div id="dl-alert" class="form-alert" role="status"></div>
        <form id="dl-form" novalidate>
          <div class="field"><label for="dl-email">Votre e-mail <span class="req">*</span></label><input id="dl-email" name="Email" type="email" required autocomplete="email" placeholder="vous@exemple.fr"><span class="error-msg">Adresse e-mail invalide.</span></div>
          <label class="checkbox"><input type="checkbox" id="dl-consent" required><span>J'accepte de recevoir les guides et informations de LyoSurgères. <span class="req">*</span></span></label>
          <button type="submit" class="btn btn--primary btn--block btn--lg" style="margin-top:14px;">Accéder aux guides</button>
        </form>
        <div id="dl-links" hidden style="margin-top:22px;border-top:1px solid var(--line);padding-top:18px;">
          <h3 style="margin-top:0;">Vos guides</h3>
          <ul style="list-style:none;padding:0;line-height:2.1;">
${cards}
          </ul>
          <p class="hint">Ouvrez un guide puis « Imprimer / enregistrer en PDF ».</p>
        </div>
      </div>
    </div></section>
  </main>
${footer()}
  <script src="../js/config.js"></script>
  <script src="../js/main.js"></script>
  <script>
  (function(){
    var f=document.getElementById('dl-form'); if(!f) return;
    var email=document.getElementById('dl-email'), consent=document.getElementById('dl-consent');
    var links=document.getElementById('dl-links'), alertBox=document.getElementById('dl-alert');
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var okE=email.value && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.value);
      if(!okE){ email.closest('.field').classList.add('invalid'); return; }
      if(!consent.checked){ return; }
      var cfg=window.SITE_CONFIG||{};
      if(cfg.formEndpoint){ try{ var fd=new FormData(); fd.append('Email',email.value); fd.append('_subject','Téléchargement guides PDF'); fetch(cfg.formEndpoint,{method:'POST',body:fd,headers:{Accept:'application/json'}}); }catch(x){} }
      links.hidden=false;
      alertBox.className='form-alert show success';
      alertBox.textContent='Merci ! Vos guides sont accessibles ci-dessous.';
      links.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
  })();
  </script>
</body>
</html>
`;
}

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
order.forEach(fam => fs.writeFileSync(path.join(OUT, fam + '.html'), guide(fam)));
fs.writeFileSync(path.join(OUT, 'index.html'), index());
console.log('Fiches : ' + order.length + ' guides + index');
console.log('SITEMAP:');
console.log('  <url><loc>https://www.lyosurgeres.fr/fiches/index.html</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>');
order.forEach(fam=>console.log('  <url><loc>https://www.lyosurgeres.fr/fiches/'+fam+'.html</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>'));
