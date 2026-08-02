/* =============================================================
   CONFIGURATION DU SITE — À PERSONNALISER
   =============================================================
   Ce fichier centralise tous les réglages que vous pouvez
   modifier sans toucher au reste du code.
   ============================================================= */

window.SITE_CONFIG = {
  // --- Identité de l'entreprise -------------------------------
  brand: "LyoSurgères",
  city: "Surgères",
  region: "Charente-Maritime (17)",

  // --- Coordonnées (affichées dans le pied de page / contact) -
  email: "contact@lyosurgeres.fr",
  phone: "05 46 00 00 00",
  address: {
    line1: "Zone d'activités de Surgères",
    line2: "17700 Surgères",
    country: "France",
  },

  // --- Réception des réservations -----------------------------
  // Le formulaire de réservation envoie la demande par e-mail.
  //
  // Deux modes possibles :
  //
  // 1) MODE "mailto" (par défaut, aucune configuration) :
  //    laissez `formEndpoint` vide ("").
  //    Le bouton ouvrira le logiciel de messagerie du visiteur
  //    avec un e-mail pré-rempli à vous envoyer.
  //
  // 2) MODE "endpoint" (recommandé, envoi automatique) :
  //    créez un formulaire gratuit sur Formspree (formspree.io)
  //    ou Web3Forms (web3forms.com), puis collez l'URL ci-dessous.
  //    Exemple Formspree : "https://formspree.io/f/xxxxxxx"
  //    Le visiteur n'a alors rien à faire : l'e-mail vous arrive
  //    automatiquement.
  formEndpoint: "",

  // Adresse qui reçoit les réservations (utilisée en mode mailto).
  bookingRecipient: "contact@lyosurgeres.fr",

  // --- Horaires & créneaux de dépôt ---------------------------
  // Jours ouvrés : 0 = dimanche, 1 = lundi, ... 6 = samedi
  openDays: [1, 2, 3, 4, 5, 6], // lundi à samedi
  // Créneaux horaires proposés à la réservation
  timeSlots: [
    "09:00", "10:00", "11:00",
    "14:00", "15:00", "16:00", "17:00",
  ],
  // Réservation possible à partir de J+1, jusqu'à 3 mois à l'avance
  minDaysAhead: 1,
  maxMonthsAhead: 3,

  // --- Réseaux sociaux (laisser vide pour masquer) ------------
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
  },

  // --- Localisation (cohérence NAP — adresse physique unique) -
  // L'adresse du LocalBusiness est Surgères. La Rochelle n'est
  // qu'une zone desservie (contenu / SEO), jamais l'adresse.
  geo: { lat: 46.108, lng: -0.748, placename: "Surgères" },
  areaServed: ["La Rochelle", "Surgères", "Charente-Maritime", "Nouvelle-Aquitaine", "France"],

  // --- Numéro d'urgence sinistres (7j/7) ----------------------
  emergencyPhone: "06 00 00 00 00",

  // --- Tarifs indicatifs (affichés sur le site) ---------------
  // Modifiez librement : ces valeurs alimentent les pages et widgets.
  pricing: {
    testEchantillon: { min: 250, max: 500, unit: "par échantillon (200 g)" },
    developpementCycle: { min: 800, max: 2500, unit: "par essai" },
    analyseStabilite: { min: 1500, max: 4000, unit: "par produit" },
    abonnementRemiseSeuil: 24, // cycles/an au-delà desquels s'applique la remise
    abonnementRemisePct: 10,   // % de remise
    // Simulateur d'abonnement capacité (valeurs indicatives, à ajuster)
    capacite: {
      cycleBase: 600,   // € pour un cycle à 1 chariot
      chariot: 250,     // € par chariot supplémentaire
      mult: { standard: 1, premium: 1.2, sensible: 1.35 }, // selon la famille de produit
      // Simulateur de campagne industrielle (valeurs indicatives)
      kgParCycle: 150,        // kg humides traités par cycle
      cyclesParSemaine: 10,   // en fonctionnement continu
      prixTonne: { standard: 9000, premium: 12000, sensible: 16000 }, // € par tonne humide traitée
    },
  },
};
