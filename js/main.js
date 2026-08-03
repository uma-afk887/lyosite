/* =============================================================
   main.js — comportements partagés (navigation, config, année)
   ============================================================= */
(function () {
  var cfg = window.SITE_CONFIG || {};

  /* --- Injection des valeurs de configuration ---
     Tout élément portant data-cfg="chemin.dans.config"
     reçoit la valeur correspondante. Ex : data-cfg="email" */
  function resolve(path) {
    return path.split('.').reduce(function (o, k) {
      return (o && o[k] != null) ? o[k] : undefined;
    }, cfg);
  }
  document.querySelectorAll('[data-cfg]').forEach(function (el) {
    var val = resolve(el.getAttribute('data-cfg'));
    if (val == null || val === '') return;
    if (el.hasAttribute('data-cfg-href')) {
      var prefix = el.getAttribute('data-cfg-href'); // "tel:" ou "mailto:"
      el.setAttribute('href', prefix + String(val).replace(/\s+/g, (prefix === 'tel:' ? '' : ' ')));
    } else {
      el.textContent = val;
    }
  });

  /* --- Adresse complète (footer / contact) --- */
  document.querySelectorAll('[data-cfg-address]').forEach(function (el) {
    var a = cfg.address || {};
    el.innerHTML = [a.line1, a.line2, a.country].filter(Boolean).join('<br>');
  });

  /* --- Réseaux sociaux : masquer si non renseignés --- */
  document.querySelectorAll('[data-social]').forEach(function (el) {
    var key = el.getAttribute('data-social');
    var url = (cfg.social || {})[key];
    if (url) { el.setAttribute('href', url); } else { el.remove(); }
  });

  /* --- Menu mobile --- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* --- Lien de navigation actif --- */
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var target = a.getAttribute('href');
    if (target === here || (here === '' && target === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* --- Année courante dans le pied de page --- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* --- Nom de marque partout --- */
  document.querySelectorAll('[data-brand]').forEach(function (el) {
    if (cfg.brand) el.textContent = cfg.brand;
  });

  /* --- Formulaire de contact --- */
  var cform = document.getElementById('contact-form');
  if (cform) {
    var cAlert = document.getElementById('contact-alert');
    var cBtn = document.getElementById('contact-submit');

    function cInvalid(field, bad) {
      var w = field.closest('.field'); if (w) w.classList.toggle('invalid', bad);
    }
    cform.querySelectorAll('input, select, textarea').forEach(function (f) {
      f.addEventListener('input', function () { cInvalid(f, false); });
      f.addEventListener('change', function () { cInvalid(f, false); });
    });
    function cShow(type, msg) {
      cAlert.className = 'form-alert show ' + type;
      cAlert.textContent = msg;
      cAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    cform.addEventListener('submit', function (e) {
      e.preventDefault();
      cAlert.className = 'form-alert';
      var ok = true;
      cform.querySelectorAll('[required]').forEach(function (f) {
        var bad = (f.type === 'checkbox') ? !f.checked : !String(f.value).trim();
        cInvalid(f, bad); if (bad) ok = false;
      });
      var em = document.getElementById('c-email');
      if (em && em.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) { cInvalid(em, true); ok = false; }
      if (!ok) return;

      var g = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var prenom = g('c-prenom');
      var body = [
        'NOUVEAU MESSAGE DEPUIS LE SITE',
        '--------------------------------',
        'Sujet     : ' + g('c-sujet'),
        'Nom       : ' + prenom + ' ' + g('c-nom'),
        'E-mail    : ' + g('c-email'),
        'Téléphone : ' + (g('c-telephone') || '—'),
        '',
        'Message :',
        g('c-message'),
      ].join('\n');
      var subject = 'Contact ' + (cfg.brand || '') + ' — ' + g('c-sujet');

      function cDone() {
        cform.reset();
        if (cBtn) { cBtn.disabled = false; cBtn.textContent = 'Envoyer le message'; }
        cShow('success', 'Merci ' + prenom + ' ! Votre message a bien été envoyé. Nous vous répondrons rapidement.');
      }

      if (cfg.formEndpoint) {
        cBtn.disabled = true; cBtn.textContent = 'Envoi en cours…';
        var fd = new FormData(cform);
        fd.append('_subject', subject);
        fetch(cfg.formEndpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
          .then(function (r) { if (!r.ok) throw new Error(r.status); cDone(); })
          .catch(function () {
            cBtn.disabled = false; cBtn.textContent = 'Envoyer le message';
            cShow('error', "L'envoi automatique a échoué. Écrivez-nous à " + (cfg.email || '') + '.');
          });
      } else {
        var to = cfg.email || cfg.bookingRecipient || '';
        window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        cDone();
      }
    });
  }

})();
