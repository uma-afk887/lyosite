#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build-en.py — génère la section anglaise réelle sous /en/.

Pages produites (contenu rédigé, pas un "coming soon") :
  en/index.html                 <-> index.html
  en/contract-freeze-drying.html<-> lyophilisation-a-facon.html
  en/sample-test.html           <-> test-echantillon.html
  en/about.html                 <-> a-propos.html
  en/contact.html               <-> contact.html

Design system partagé avec le site FR (css/styles.css, js/config.js,
js/main.js). Chaque page : meta EN, canonical, hreflang réciproque
(en <-> fr), Open Graph, JSON-LD (WebPage/Service/FAQ/HowTo/Breadcrumb),
navigation EN et bascule "Français" vers la page FR équivalente.
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://www.lyosurgeres.fr"
BIZ = f"{BASE}/#business"

MARK = ('<svg class="mark" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
        '<defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#12b5c9"/>'
        '<stop offset="1" stop-color="#0a5f6e"/></linearGradient></defs><circle cx="24" cy="24" r="22" fill="url(#g1)"/>'
        '<g stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M24 9v30M11 24h26M15 15l18 18M33 15L15 33"/></g></svg>')

CHECK = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" '
         'stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>')

NAV_ITEMS = [
    ("index.html", "Home"),
    ("contract-freeze-drying.html", "Contract freeze-drying"),
    ("sample-test.html", "Sample test"),
    ("about.html", "About"),
    ("contact.html", "Contact"),
]


def nav(active):
    def li(href, label):
        cur = ' aria-current="page"' if href == active else ''
        return f'<li><a href="{href}"{cur}>{label}</a></li>'
    lis = "".join(li(href, label) for href, label in NAV_ITEMS)
    return f'''  <header class="site-header">
    <div class="container nav">
      <a class="brand" href="index.html" aria-label="LyoSurgères home">
        {MARK}
        <span>LyoSurgères<small>Contract freeze-drying</small></span>
      </a>
      <nav aria-label="Main navigation">
        <ul class="nav-links">{lis}</ul>
      </nav>
      <div class="nav-cta">
        <a class="btn btn--primary" href="contact.html">Get a quote</a>
        <button class="nav-toggle" aria-label="Open menu" aria-expanded="false"><span></span></button>
      </div>
    </div>
  </header>'''


def footer(fr_page):
    return f'''  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="brand" style="color:#fff;">
            <svg class="mark" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#0f8b9e"/><g stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M24 9v30M11 24h26M15 15l18 18M33 15L15 33"/></g></svg>
            <span>LyoSurgères<small>Contract freeze-drying</small></span>
          </div>
          <p class="footer-note">Contract freeze-drying and vacuum microwave drying workshop in Surgères, near La Rochelle (France). We dry your products by cold, without preservatives, and ship across France and Europe.</p>
          <div class="footer-social">
            <a data-social="linkedin" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.1c.5-1 1.8-2 3.6-2 3.9 0 4.6 2.5 4.6 5.8V21h-4v-5c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6V21h-4z"/></svg></a>
          </div>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            <li><a href="contract-freeze-drying.html">Contract freeze-drying</a></li>
            <li><a href="sample-test.html">Sample test (200 g)</a></li>
            <li><a href="contract-freeze-drying.html#technologies">Vacuum microwave drying</a></li>
            <li><a href="contract-freeze-drying.html#packaging">Barrier packaging</a></li>
            <li><a href="contract-freeze-drying.html#randd">R&amp;D &amp; pilot runs</a></li>
          </ul>
        </div>
        <div>
          <h4>Navigation</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="../{fr_page}">Version française</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li>Surgères (17700), near La Rochelle, France</li>
            <li>Phone <a data-cfg="phone" data-cfg-href="tel:">+33 5 46 00 00 00</a></li>
            <li><a data-cfg="email" data-cfg-href="mailto:">contact@lyosurgeres.fr</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span data-year>2026</span> LyoSurgères · All rights reserved</span>
        <span><a href="../{fr_page}">Français</a></span>
      </div>
    </div>
  </footer>'''


def page(slug, title, desc, fr_page, body, jsonld, og_image="og-cover.svg"):
    canonical = f"{BASE}/en/{slug}"
    fr_url = f"{BASE}/{fr_page}"
    ld = "\n".join(
        '  <script type="application/ld+json">\n  ' + json.dumps(block, ensure_ascii=False) + "\n  </script>"
        for block in jsonld
    )
    active = slug
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="keywords" content="contract freeze drying, freeze drying service France, toll lyophilization, contract freeze drying Europe, vacuum microwave drying, freeze dried, private label freeze drying, La Rochelle, Surgères">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{canonical}">
  <meta name="theme-color" content="#0f8b9e">
  <link rel="alternate" hreflang="en" href="{canonical}">
  <link rel="alternate" hreflang="fr" href="{fr_url}">
  <link rel="alternate" hreflang="x-default" href="{fr_url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="LyoSurgères">
  <meta property="og:locale" content="en_GB">
  <meta property="og:locale:alternate" content="fr_FR">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{BASE}/{og_image}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='22' fill='%230f8b9e'/%3E%3Cg stroke='white' stroke-width='2.4' stroke-linecap='round'%3E%3Cpath d='M24 9v30M11 24h26M15 15l18 18M33 15L15 33'/%3E%3C/g%3E%3C/svg%3E">
{ld}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
{nav(active)}
  <main id="main">
{body}
  </main>
{footer(fr_page)}
  <script src="../js/config.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
'''


def breadcrumb(items):
    return {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": name, "item": url}
            for i, (name, url) in enumerate(items)
        ],
    }


def service_ld(name, desc):
    return {
        "@context": "https://schema.org", "@type": "Service", "name": name,
        "serviceType": "Contract freeze-drying", "description": desc,
        "provider": {"@type": "LocalBusiness", "@id": BIZ, "name": "LyoSurgères", "url": f"{BASE}/"},
        "areaServed": ["France", "Europe"],
    }


# ============================ CONTENT ============================
PAGES = []

# ---- 1. Home -------------------------------------------------------------
home_body = f'''    <section class="hero">
      <div class="container">
        <div class="hero-grid">
          <div>
            <span class="eyebrow">Surgères · near La Rochelle · France</span>
            <h1>Contract freeze-drying in France, for the whole of Europe</h1>
            <p class="lead">LyoSurgères is a contract freeze-drying (lyophilization) workshop and laboratory in Surgères (17700), near La Rochelle. We run <strong>two complementary technologies</strong> — freeze-drying for premium and heat-sensitive products, and vacuum microwave drying for larger volumes — plus R&amp;D, pilot runs, shelf-life work and market-ready packaging. Send us your product; we tell you the cheapest process that keeps it stable.</p>
            <div class="hero-actions">
              <a class="btn btn--primary btn--lg" href="sample-test.html">Start with a 200 g sample test</a>
              <a class="btn btn--ghost btn--lg" href="contract-freeze-drying.html">How contract freeze-drying works</a>
            </div>
            <div class="hero-badges">
              <span class="hero-badge">{CHECK} No additives, no preservatives</span>
              <span class="hero-badge">{CHECK} Up to 98% of water removed</span>
              <span class="hero-badge">{CHECK} Clear quote within 48 h</span>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-card">
              <h3>How it works</h3>
              <div class="step"><span class="step-num">1</span><p><strong>You send 200 g</strong>Frozen, by courier, to our lab in Surgères.</p></div>
              <div class="step"><span class="step-num">2</span><p><strong>We run a trial</strong>Freeze-drying or vacuum microwave drying — whichever fits.</p></div>
              <div class="step"><span class="step-num">3</span><p><strong>You get a spec sheet</strong>Yield, final water activity (aw), cycle time, recommended process and packaging.</p></div>
              <div class="step"><span class="step-num">4</span><p><strong>We scale up</strong>Pilot run, then production and packaging under your brand.</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <span class="eyebrow">What we do</span>
        <h2>A contract freeze-drying partner, not just a machine</h2>
        <p class="section-lead">Most clients don't actually need freeze-drying — they need a <strong>stable product</strong>. We tell you which of the two processes costs less for your goal, and we take the product all the way to a market-ready pack.</p>
        <div class="grid grid--3">
          <article class="card"><h3>Freeze-drying (lyophilization)</h3><p>Cold sublimation under vacuum. Preserves colour, aroma, nutrients and structure, and lets the product rehydrate. The right choice for heat-sensitive or living matter — probiotics, ferments, spirulina, seafood, botanicals, fine gastronomy.</p></article>
          <article class="card"><h3>Vacuum microwave drying</h3><p>Accelerated drying for larger volumes. Remarkable finished quality and far shorter lead times when the goal is a long shelf life at the best cost, without the need to rehydrate.</p></article>
          <article class="card"><h3>Packaging &amp; shelf life</h3><p>Barrier packaging (EVOH or aluminium), nitrogen flushing, oxygen absorbers, and an argued best-before date backed by water-activity and accelerated-ageing data.</p></article>
        </div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container">
        <span class="eyebrow">Who we work with</span>
        <h2>Brands, producers, labs — across Europe</h2>
        <div class="grid grid--3">
          <article class="card"><h3>Food &amp; premium</h3><p>Fruit, vegetables, ready meals, coffee, herbs, snacks — and freeze-dried candy.</p></article>
          <article class="card"><h3>Seafood &amp; algae</h3><p>Oysters, sea urchins, shellfish, seaweed, spirulina and chlorella with colour and protein preserved.</p></article>
          <article class="card"><h3>Actives &amp; supplements</h3><p>Botanical extracts, ferments, probiotics, proteins — for nutraceutical and cosmetic formulators.</p></article>
        </div>
        <div style="margin-top:26px;">
          <a class="btn btn--primary btn--lg" href="sample-test.html">Send us 200 g &amp; get a spec sheet</a>
          <a class="btn btn--ghost btn--lg" href="contact.html">Talk to us</a>
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container">
        <h2>Looking for a contract freeze-drying company in France?</h2>
        <p>We answer every serious enquiry with a clear, no-obligation quote — usually within 48 hours.</p>
        <a class="btn btn--light btn--lg" href="contact.html">Get a quote</a>
      </div>
    </section>'''
PAGES.append(dict(
    slug="index.html", fr="index.html",
    title="Contract Freeze-Drying in France & Europe | LyoSurgères",
    desc="Contract freeze-drying (lyophilization) and vacuum microwave drying near La Rochelle, France. Sample test from 200 g, R&D, pilot runs, private label and barrier packaging. Ships across Europe.",
    body=home_body,
    jsonld=[
        {"@context": "https://schema.org", "@type": "WebPage",
         "name": "Contract Freeze-Drying in France & Europe",
         "url": f"{BASE}/en/index.html", "inLanguage": "en",
         "isPartOf": {"@type": "WebSite", "name": "LyoSurgères", "url": f"{BASE}/"},
         "about": {"@type": "LocalBusiness", "@id": BIZ}},
        service_ld("Contract freeze-drying & vacuum microwave drying",
                   "Contract freeze-drying and vacuum microwave drying of premium, heat-sensitive and high-volume products, with R&D, pilot runs, shelf-life analysis and market-ready packaging."),
        breadcrumb([("Home", f"{BASE}/en/index.html")]),
    ],
))

# ---- 2. Contract freeze-drying (pillar) ---------------------------------
faq_qs = [
    ("What is contract freeze-drying?",
     "Contract (or toll) freeze-drying means you send us your product and we lyophilize it for you — no need to own a freeze-dryer. We handle freezing, sublimation under vacuum, quality control and packaging, and return a stable, shelf-stable product ready to sell or formulate."),
    ("Do you serve clients outside France?",
     "Yes. We are based in Surgères, near La Rochelle, and ship finished product across France and the rest of Europe. Frozen samples and production batches travel by refrigerated courier."),
    ("Freeze-drying or vacuum microwave drying — which one?",
     "Three questions decide it. Does the product need to rehydrate? Does it contain living cultures or a heat-sensitive molecule? Or do you simply want a long shelf life at the lowest cost? The first two point to freeze-drying; the third often points to vacuum microwave drying. The sample test settles it with real data."),
    ("What is the minimum order?",
     "There is no industrial minimum to start: the 200 g sample test lets us qualify your product first. From there we run a pilot batch, then scale to production and a capacity subscription if you need recurring cycles."),
]
contract_body = f'''    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Pillar guide</span>
        <h1>Contract freeze-drying in Europe</h1>
        <p>Everything a brand, producer or lab needs to outsource freeze-drying: what it is, when to use it versus vacuum microwave drying, how the project runs, and how it is priced. Based in Surgères (France), we work as your <strong>toll lyophilization</strong> partner from first trial to packaged product.</p>
      </div>
    </section>

    <section class="section">
      <div class="container" style="max-width:820px;">
        <h2>What contract freeze-drying means</h2>
        <p>Freeze-drying (lyophilization) removes water from a frozen product by sublimation under vacuum: the ice turns straight to vapour without a liquid stage and without heating the product. The result keeps its colour, aroma, active molecules and micro-structure, weighs almost nothing, and stays stable for years — with no additive or preservative. <em>Contract</em> freeze-drying simply means we do it for you, on our equipment, so you never invest in a freeze-dryer of your own.</p>

        <h2 id="technologies">Two technologies under one roof</h2>
        <p>Not every product needs the premium route. We run both processes and recommend the one that costs you less for the result you want:</p>
        <ul class="check-list">
          <li>{CHECK} <strong>Freeze-drying</strong> — for products that must rehydrate, or that contain living cultures or heat-sensitive molecules (probiotics, ferments, spirulina, seafood, botanical actives, fine gastronomy).</li>
          <li>{CHECK} <strong>Vacuum microwave drying</strong> — for larger volumes where the goal is a long best-before date at the best cost, with remarkable finished quality and much shorter cycles.</li>
        </ul>

        <h2 id="randd">R&amp;D, pilot runs and scale-up</h2>
        <p>Our laboratory is open to brands and producers developing a product. We qualify the material, build the drying cycle, measure yield and final water activity (aw), and de-risk your launch before you commit to volume. When the cycle is proven, we scale to pilot batches and production.</p>

        <h2 id="packaging">Packaging &amp; shelf life</h2>
        <p>A freeze-dried product is only as stable as its pack. We finish with barrier packaging (EVOH or aluminium), nitrogen flushing and oxygen absorbers, and we back your best-before date with water-activity measurement, sorption isotherms and accelerated ageing.</p>

        <h2>How a project runs</h2>
        <div class="grid grid--2">
          <article class="card"><h3>1 · Sample test (200 g)</h3><p>You send 200 g frozen. Within about 15 days you get your freeze-dried sample plus a spec sheet: yield, final aw, cycle time, recommended process and packaging, estimated cost per kilo. €250–500, deductible from your first industrial batch.</p></article>
          <article class="card"><h3>2 · Cycle development</h3><p>A pilot trial with a drying curve, measured yield, final aw and a process &amp; packaging recommendation. €800–2,500 per trial, deductible from the first industrial batch.</p></article>
          <article class="card"><h3>3 · Stability &amp; shelf life</h3><p>aw measurement, sorption isotherm, accelerated ageing and an argued best-before date for your label. €1,500–4,000 per product.</p></article>
          <article class="card"><h3>4 · Production &amp; private label</h3><p>Recurring cycles, capacity subscription, and packaging or labelling under your own brand.</p></article>
        </div>
        <div style="margin-top:26px;"><a class="btn btn--primary btn--lg" href="sample-test.html">Start with a sample test</a> <a class="btn btn--ghost btn--lg" href="contact.html">Get a quote</a></div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container" style="max-width:820px;">
        <h2>Frequently asked questions</h2>
        <div class="faq-group">
          {"".join(f'<details class="faq-item"><summary>{q}</summary><div class="faq-body"><p>{a}</p></div></details>' for q, a in faq_qs)}
        </div>
      </div>
    </section>'''
PAGES.append(dict(
    slug="contract-freeze-drying.html", fr="lyophilisation-a-facon.html",
    title="Contract Freeze-Drying in Europe — Toll Lyophilization | LyoSurgères",
    desc="Contract (toll) freeze-drying and vacuum microwave drying in France for the whole of Europe: R&D, pilot runs, stability & shelf-life analysis, private label and barrier packaging. Sample test from 200 g.",
    body=contract_body,
    jsonld=[
        service_ld("Contract freeze-drying (toll lyophilization)",
                   "Outsourced freeze-drying and vacuum microwave drying for brands, producers and labs: R&D, pilot runs, stability and shelf-life analysis, private label and barrier packaging, across France and Europe."),
        {"@context": "https://schema.org", "@type": "FAQPage",
         "mainEntity": [{"@type": "Question", "name": q,
                         "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq_qs]},
        breadcrumb([("Home", f"{BASE}/en/index.html"),
                    ("Contract freeze-drying", f"{BASE}/en/contract-freeze-drying.html")]),
    ],
))

# ---- 3. Sample test ------------------------------------------------------
howto_steps = [
    ("Freeze your 200 g", "Freeze a representative 200 g of your product and keep it frozen."),
    ("Ship it to Surgères", "Send it by refrigerated courier to our laboratory near La Rochelle, with a short note on what you are trying to achieve."),
    ("We run the trial", "We freeze-dry (or vacuum-microwave-dry) the sample and measure yield, final water activity and cycle time."),
    ("You receive sample + spec sheet", "Within about 15 days you get your dried sample and a technical spec sheet with our process and packaging recommendation and an estimated cost per kilo."),
]
sample_body = f'''    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Start here</span>
        <h1>Freeze-drying sample test — send us 200 g</h1>
        <p>The fastest, lowest-risk way to know whether your product freeze-dries well. Send 200 g; get back your dried sample and a real technical spec sheet. <strong>€250–500, fully deductible from your first industrial batch.</strong></p>
        <div style="margin-top:18px;"><a class="btn btn--primary btn--lg" href="contact.html">Request a sample test</a></div>
      </div>
    </section>

    <section class="section">
      <div class="container" style="max-width:820px;">
        <h2>What you get</h2>
        <ul class="check-list">
          <li>{CHECK} Your freeze-dried (or vacuum-microwave-dried) sample.</li>
          <li>{CHECK} A spec sheet: fresh-to-dry ratio, final water activity (aw), cycle time.</li>
          <li>{CHECK} Our recommended process and packaging.</li>
          <li>{CHECK} An estimated transformation cost per kilo, to plan your economics.</li>
        </ul>

        <h2>How it works</h2>
        <div class="grid grid--2">
          {"".join(f'<article class="card"><h3>{i+1} · {t}</h3><p>{d}</p></article>' for i, (t, d) in enumerate(howto_steps))}
        </div>

        <div class="panel" style="margin-top:28px;">
          <h2>Why 200 g?</h2>
          <p>200 g is enough to run a real cycle and measure yield and aw accurately, while staying cheap to ship frozen. It is the single best first step before any pilot or production commitment — and its cost comes off your first industrial batch.</p>
          <div style="margin-top:16px;"><a class="btn btn--primary btn--lg" href="contact.html">Request a sample test</a> <a class="btn btn--ghost btn--lg" href="contract-freeze-drying.html">See the full process</a></div>
        </div>
      </div>
    </section>'''
PAGES.append(dict(
    slug="sample-test.html", fr="test-echantillon.html",
    title="Freeze-Drying Sample Test — Send Us 200 g | LyoSurgères",
    desc="Test your product before committing: send 200 g frozen and receive your freeze-dried sample plus a technical spec sheet (yield, water activity, cycle, cost per kilo). €250–500, deductible from your first batch.",
    body=sample_body,
    jsonld=[
        service_ld("Freeze-drying sample test (200 g)",
                   "Send 200 g of your product frozen and receive a freeze-dried sample and a technical spec sheet with yield, final water activity, cycle time and process recommendation."),
        {"@context": "https://schema.org", "@type": "HowTo",
         "name": "How the 200 g freeze-drying sample test works",
         "step": [{"@type": "HowToStep", "position": i + 1, "name": t, "text": d}
                  for i, (t, d) in enumerate(howto_steps)]},
        breadcrumb([("Home", f"{BASE}/en/index.html"),
                    ("Sample test", f"{BASE}/en/sample-test.html")]),
    ],
))

# ---- 4. About ------------------------------------------------------------
about_body = f'''    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">About us</span>
        <h1>A freeze-drying company near La Rochelle</h1>
        <p>LyoSurgères is a contract freeze-drying workshop and laboratory in Surgères (17700), Charente-Maritime, in the La Rochelle area of western France.</p>
      </div>
    </section>

    <section class="section">
      <div class="container" style="max-width:820px;">
        <h2>What we believe</h2>
        <p>Most clients don't need freeze-drying — they need a product that stays stable, keeps its qualities and reaches the market at the right cost. So we start from the goal, not the machine. We run two technologies, freeze-drying and vacuum microwave drying, and we tell you honestly which one costs less for your result.</p>

        <h2>Our capabilities</h2>
        <ul class="check-list">
          <li>{CHECK} Premium freeze-drying (cold sublimation under vacuum) for heat-sensitive and living matter.</li>
          <li>{CHECK} Vacuum microwave drying for larger volumes and long shelf life at the best cost.</li>
          <li>{CHECK} Barrier packaging (EVOH / aluminium), nitrogen flushing, oxygen absorbers.</li>
          <li>{CHECK} A laboratory open to brands and producers in R&amp;D, with pilot runs and shelf-life work.</li>
        </ul>

        <h2>Where we are</h2>
        <p>Our workshop is in Surgères, in the La Rochelle agglomeration — well connected to the ports, farms and food producers of Nouvelle-Aquitaine. We serve clients across France and Europe, receiving frozen material and shipping finished, packaged product by refrigerated courier.</p>
        <div style="margin-top:24px;"><a class="btn btn--primary btn--lg" href="contact.html">Contact us</a> <a class="btn btn--ghost btn--lg" href="contract-freeze-drying.html">Our services</a></div>
      </div>
    </section>'''
PAGES.append(dict(
    slug="about.html", fr="a-propos.html",
    title="About LyoSurgères — Freeze-Drying Company near La Rochelle",
    desc="LyoSurgères is a contract freeze-drying workshop and lab in Surgères, near La Rochelle (France). Two technologies — freeze-drying and vacuum microwave drying — R&D, pilot runs and packaging, for clients across Europe.",
    body=about_body,
    jsonld=[
        {"@context": "https://schema.org", "@type": "AboutPage",
         "name": "About LyoSurgères", "url": f"{BASE}/en/about.html", "inLanguage": "en",
         "about": {"@type": "LocalBusiness", "@id": BIZ, "name": "LyoSurgères", "url": f"{BASE}/"}},
        breadcrumb([("Home", f"{BASE}/en/index.html"),
                    ("About", f"{BASE}/en/about.html")]),
    ],
))

# ---- 5. Contact ----------------------------------------------------------
contact_body = f'''    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Contact</span>
        <h1>Get a freeze-drying quote</h1>
        <p>Tell us about your product and your goal. We reply to every serious enquiry with a clear, no-obligation quote — usually within 48 hours.</p>
      </div>
    </section>

    <section class="section">
      <div class="container" style="max-width:720px;">
        <div class="panel">
          <h2>How to reach us</h2>
          <ul class="check-list">
            <li>{CHECK} Email: <a data-cfg="email" data-cfg-href="mailto:">contact@lyosurgeres.fr</a></li>
            <li>{CHECK} Phone: <a data-cfg="phone" data-cfg-href="tel:">+33 5 46 00 00 00</a></li>
            <li>{CHECK} Workshop &amp; lab: Surgères (17700), near La Rochelle, France</li>
          </ul>
          <p style="margin-top:18px;">The quickest way to a precise answer is the <a href="sample-test.html">200 g sample test</a>: send us a representative sample and we come back with real figures and a recommendation.</p>
          <div style="margin-top:20px;"><a class="btn btn--primary btn--lg" data-cfg="email" data-cfg-href="mailto:">Email us</a> <a class="btn btn--ghost btn--lg" href="sample-test.html">Request a sample test</a></div>
        </div>
        <p class="footer-note" style="margin-top:18px;">Client information is only published with the client's written consent.</p>
      </div>
    </section>'''
PAGES.append(dict(
    slug="contact.html", fr="contact.html",
    title="Contact — Get a Freeze-Drying Quote | LyoSurgères",
    desc="Contact LyoSurgères for a contract freeze-drying quote in France and Europe. Email, phone and a 200 g sample test to qualify your product. Clear, no-obligation quote within 48 hours.",
    body=contact_body,
    jsonld=[
        {"@context": "https://schema.org", "@type": "ContactPage",
         "name": "Contact LyoSurgères", "url": f"{BASE}/en/contact.html", "inLanguage": "en",
         "about": {"@type": "LocalBusiness", "@id": BIZ, "name": "LyoSurgères",
                   "url": f"{BASE}/", "email": "contact@lyosurgeres.fr",
                   "telephone": "+33546000000"}},
        breadcrumb([("Home", f"{BASE}/en/index.html"),
                    ("Contact", f"{BASE}/en/contact.html")]),
    ],
))

# ============================ WRITE ============================
out_dir = os.path.join(ROOT, "en")
os.makedirs(out_dir, exist_ok=True)
for p in PAGES:
    html = page(p["slug"], p["title"], p["desc"], p["fr"], p["body"], p["jsonld"])
    with open(os.path.join(out_dir, p["slug"]), "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote en/" + p["slug"])
print(f"{len(PAGES)} English pages generated.")
