/* =============================================================
   booking.js — calendrier de réservation + formulaire
   ============================================================= */
(function () {
  var cfg = window.SITE_CONFIG || {};
  var form = document.getElementById('booking-form');
  if (!form) return; // pas sur la page réservation

  var openDays = cfg.openDays || [1, 2, 3, 4, 5, 6];
  var timeSlots = cfg.timeSlots || ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  var minDaysAhead = cfg.minDaysAhead != null ? cfg.minDaysAhead : 1;
  var maxMonthsAhead = cfg.maxMonthsAhead != null ? cfg.maxMonthsAhead : 3;

  var MONTHS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  var DOW = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

  var state = { view: startOfMonth(new Date()), date: null, slot: null };

  // Bornes
  var today = stripTime(new Date());
  var minDate = addDays(today, minDaysAhead);
  var maxDate = addMonths(startOfMonth(today), maxMonthsAhead);
  maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0); // fin de mois

  // Éléments
  var elMonth   = document.getElementById('cal-month');
  var elGrid    = document.getElementById('cal-grid');
  var elPrev    = document.getElementById('cal-prev');
  var elNext    = document.getElementById('cal-next');
  var elSlots   = document.getElementById('slots');
  var elService = document.getElementById('f-service');

  // Récap
  var sumService = document.getElementById('sum-service');
  var sumDate    = document.getElementById('sum-date');
  var sumSlot    = document.getElementById('sum-slot');

  // Champs cachés soumis avec le formulaire
  var hidDate = document.getElementById('f-date');
  var hidSlot = document.getElementById('f-slot');

  /* ---------- Utilitaires dates ---------- */
  function stripTime(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
  function sameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function isoDate(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function frDate(d) {
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  function isSelectable(d) {
    if (d < minDate || d > maxDate) return false;
    return openDays.indexOf(d.getDay()) !== -1;
  }

  /* ---------- Rendu du calendrier ---------- */
  function renderCalendar() {
    var view = state.view;
    elMonth.textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();

    // En-têtes jours
    var html = DOW.map(function (d) { return '<div class="cal-dow">' + d + '</div>'; }).join('');

    // Décalage (lundi = début de semaine)
    var first = startOfMonth(view);
    var lead = (first.getDay() + 6) % 7; // 0 = lundi
    for (var i = 0; i < lead; i++) html += '<div class="cal-day is-empty"></div>';

    var daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (var day = 1; day <= daysInMonth; day++) {
      var d = new Date(view.getFullYear(), view.getMonth(), day);
      var cls = 'cal-day';
      var sel = isSelectable(d);
      if (!sel) cls += ' is-disabled';
      if (sameDay(d, today)) cls += ' is-today';
      if (state.date && sameDay(d, state.date)) cls += ' is-selected';
      html += '<button type="button" class="' + cls + '"' +
              (sel ? ' data-date="' + isoDate(d) + '"' : ' disabled aria-disabled="true"') +
              '>' + day + '</button>';
    }
    elGrid.innerHTML = html;

    // Bornes de navigation
    elPrev.disabled = startOfMonth(view) <= startOfMonth(minDate);
    elNext.disabled = startOfMonth(view) >= startOfMonth(maxDate);
  }

  /* ---------- Rendu des créneaux ---------- */
  function renderSlots() {
    if (!state.date) {
      elSlots.innerHTML = '<p class="slots-empty">Sélectionnez d\'abord une date dans le calendrier.</p>';
      return;
    }
    elSlots.innerHTML = timeSlots.map(function (t) {
      var active = state.slot === t ? ' is-selected' : '';
      return '<button type="button" class="slot' + active + '" data-slot="' + t + '">' + t + '</button>';
    }).join('');
  }

  /* ---------- Récapitulatif ---------- */
  function renderSummary() {
    var svc = elService.value;
    var svcLabel = svc ? elService.options[elService.selectedIndex].text : null;
    sumService.textContent = svcLabel || '—';
    sumService.classList.toggle('empty', !svcLabel);

    if (state.date) {
      sumDate.textContent = frDate(state.date);
      sumDate.classList.remove('empty');
      hidDate.value = isoDate(state.date);
    } else {
      sumDate.textContent = 'à choisir';
      sumDate.classList.add('empty');
      hidDate.value = '';
    }

    if (state.slot) {
      sumSlot.textContent = state.slot;
      sumSlot.classList.remove('empty');
      hidSlot.value = state.slot;
    } else {
      sumSlot.textContent = 'à choisir';
      sumSlot.classList.add('empty');
      hidSlot.value = '';
    }
  }

  /* ---------- Événements calendrier ---------- */
  elGrid.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-date]');
    if (!btn) return;
    var parts = btn.getAttribute('data-date').split('-');
    state.date = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    state.slot = null;
    renderCalendar(); renderSlots(); renderSummary();
    elSlots.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  elSlots.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-slot]');
    if (!btn) return;
    state.slot = btn.getAttribute('data-slot');
    renderSlots(); renderSummary();
  });

  elPrev.addEventListener('click', function () { state.view = addMonths(state.view, -1); renderCalendar(); });
  elNext.addEventListener('click', function () { state.view = addMonths(state.view, 1); renderCalendar(); });
  elService.addEventListener('change', renderSummary);

  /* ---------- Pré-sélection du service via ?service= ---------- */
  var qs = new URLSearchParams(location.search);
  var preService = qs.get('service');
  if (preService) {
    for (var i = 0; i < elService.options.length; i++) {
      if (elService.options[i].value === preService) { elService.selectedIndex = i; break; }
    }
  }

  /* ---------- Validation ---------- */
  function setInvalid(field, invalid) {
    var wrap = field.closest('.field');
    if (wrap) wrap.classList.toggle('invalid', invalid);
  }
  function validate() {
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (f) {
      var bad = (f.type === 'checkbox') ? !f.checked : !String(f.value).trim();
      setInvalid(f, bad);
      if (bad) ok = false;
    });
    var email = document.getElementById('f-email');
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setInvalid(email, true); ok = false;
    }
    if (!state.date || !state.slot) {
      showAlert('error', 'Merci de choisir une date et un créneau horaire dans le calendrier.');
      ok = false;
    }
    return ok;
  }

  var alertBox = document.getElementById('form-alert');
  function showAlert(type, msg) {
    alertBox.className = 'form-alert show ' + type;
    alertBox.textContent = msg;
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ---------- Construction du message ---------- */
  function buildSummaryText(data) {
    return [
      'NOUVELLE DEMANDE DE RÉSERVATION',
      '--------------------------------',
      'Prestation  : ' + data.serviceLabel,
      'Date        : ' + frDate(state.date),
      'Créneau     : ' + data.slot,
      '',
      'Client      : ' + data.prenom + ' ' + data.nom,
      'Société     : ' + (data.societe || '—'),
      'E-mail      : ' + data.email,
      'Téléphone   : ' + data.telephone,
      'Volume est. : ' + (data.volume || '—'),
      '',
      'Détails du produit / de l\'objet :',
      (data.details || '—'),
    ].join('\n');
  }

  /* ---------- Soumission ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    alertBox.className = 'form-alert';
    if (!validate()) return;

    var data = {
      serviceLabel: elService.options[elService.selectedIndex].text,
      slot: state.slot,
      nom: val('f-nom'), prenom: val('f-prenom'),
      societe: val('f-societe'), email: val('f-email'),
      telephone: val('f-telephone'), volume: val('f-volume'),
      details: val('f-details'),
    };

    var summaryText = buildSummaryText(data);
    var submitBtn = document.getElementById('booking-submit');

    if (cfg.formEndpoint) {
      // Envoi automatique via un service de formulaire (Formspree, etc.)
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
      var fd = new FormData(form);
      fd.append('_date_lisible', frDate(state.date));
      fd.append('_recapitulatif', summaryText);
      fd.append('_subject', 'Réservation ' + cfg.brand + ' — ' + data.serviceLabel + ' le ' + isoDate(state.date));

      fetch(cfg.formEndpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          onSuccess();
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Envoyer ma demande de réservation';
          showAlert('error', "L'envoi automatique a échoué. Vous pouvez nous écrire directement à " + (cfg.email || '') + ".");
        });
    } else {
      // Repli mailto : ouvre le logiciel de messagerie du visiteur
      var to = cfg.bookingRecipient || cfg.email || '';
      var subject = 'Réservation ' + cfg.brand + ' — ' + data.serviceLabel + ' le ' + isoDate(state.date);
      var href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(summaryText);
      window.location.href = href;
      onSuccess();
    }

    function onSuccess() {
      form.reset();
      state.date = null; state.slot = null;
      renderCalendar(); renderSlots(); renderSummary();
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Envoyer ma demande de réservation'; }
      showAlert('success',
        'Merci ' + data.prenom + ' ! Votre demande de réservation a bien été prise en compte. ' +
        'Nous vous recontactons rapidement pour confirmer le créneau. ' +
        (cfg.formEndpoint ? '' : 'Si votre messagerie ne s\'est pas ouverte, écrivez-nous à ' + to + '.'));
    }
  });

  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }

  // Nettoyer l'état "invalide" à la saisie
  form.querySelectorAll('input, select, textarea').forEach(function (f) {
    f.addEventListener('input', function () { setInvalid(f, false); });
    f.addEventListener('change', function () { setInvalid(f, false); });
  });

  /* ---------- Premier rendu ---------- */
  renderCalendar();
  renderSlots();
  renderSummary();
})();
