# LyoSurgères — site de réservation

Site vitrine et de **réservation en ligne** pour un atelier de **lyophilisation à façon** à Surgères (Charente-Maritime).
Les clients choisissent une date et un créneau dans un calendrier, décrivent leur produit, et la demande vous
est envoyée par e-mail.

Le site est **100 % statique** (HTML, CSS, JavaScript) : **aucun serveur, aucune base de données, aucune étape de
build**. Il se publie tel quel sur n'importe quel hébergeur statique (Netlify, Vercel, GitHub Pages, OVH, etc.).

---

## 1. Aperçu des pages

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : présentation, procédé, appels à l'action |
| `services.html` | Détail des prestations + FAQ |
| `reservation.html` | **Calendrier de réservation** + formulaire |
| `a-propos.html` | À propos de l'atelier et du procédé |
| `contact.html` | Coordonnées, carte, formulaire de contact |
| `mentions-legales.html` | Modèle de mentions légales (à compléter) |

Ressources : `css/styles.css`, `js/config.js`, `js/main.js`, `js/booking.js`.

---

## 2. Personnalisation (le plus important)

Tout se règle dans **`js/config.js`**. Ouvrez ce fichier et modifiez :

- **Nom, ville, région** de l'entreprise ;
- **E-mail, téléphone, adresse** (mis à jour automatiquement dans tout le site) ;
- **Jours ouvrés** et **créneaux horaires** proposés à la réservation ;
- La **réception des réservations** (voir section 3).

> Les coordonnées affichées (pied de page, page contact, mentions légales) proviennent de `js/config.js`.
> Vous n'avez pas besoin de les modifier dans chaque page HTML.

Le **nom de marque** « LyoSurgères » est un espace réservé : remplacez-le par le nom réel dans `js/config.js`
(champ `brand`) — il se met à jour partout — et, si vous le souhaitez, dans les logos en haut de chaque page.

---

## 3. Comment recevoir les réservations par e-mail

Deux modes, réglables via le champ `formEndpoint` de `js/config.js`.

### Mode A — « mailto » (par défaut, zéro configuration)
Laissez `formEndpoint: ""`. Quand un visiteur envoie une réservation, **son logiciel de messagerie s'ouvre**
avec un e-mail pré-rempli (récapitulatif complet) à vous adresser. Simple, mais dépend du visiteur.

### Mode B — envoi automatique (recommandé)
Le formulaire envoie directement l'e-mail, sans action du visiteur. Utilisez un service gratuit :

1. Créez un compte sur **[Formspree](https://formspree.io)** (ou **[Web3Forms](https://web3forms.com)**).
2. Créez un formulaire ; vous obtenez une URL du type `https://formspree.io/f/xxxxxxx`.
3. Collez-la dans `js/config.js` :
   ```js
   formEndpoint: "https://formspree.io/f/xxxxxxx",
   ```
4. C'est prêt : les réservations **et** les messages du formulaire de contact vous arrivent par e-mail.

> Astuce Netlify : si vous hébergez sur Netlify, vous pouvez aussi utiliser Netlify Forms.
> Il faudra alors ajouter l'attribut `netlify` aux balises `<form>` — dites-le-nous si besoin.

---

## 4. Mise en ligne

### Option 1 — Netlify (glisser-déposer, le plus simple)
1. Allez sur [app.netlify.com/drop](https://app.netlify.com/drop).
2. Glissez-déposez **le dossier du projet**.
3. Le site est en ligne. Configurez ensuite votre nom de domaine.

### Option 2 — GitHub Pages
1. Poussez ce dépôt sur GitHub.
2. **Settings → Pages → Branch : `main` (dossier `/root`)**.
3. Le site est publié sur `https://<utilisateur>.github.io/<dépôt>/`.

### Option 3 — Hébergement classique (OVH, Ionos…)
Envoyez tous les fichiers par FTP à la racine de votre espace web (`www/` ou `public_html/`).

Après la mise en ligne, pensez à mettre à jour votre domaine dans `robots.txt` et `sitemap.xml`.

---

## 5. Tester en local

Ouvrez simplement `index.html` dans un navigateur. Pour un rendu identique à la production
(et pour éviter les limites du protocole `file://`), lancez un petit serveur :

```bash
# avec Python
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

---

## 6. Bon à savoir sur le calendrier

- Le calendrier propose les dates futures des **jours ouvrés** définis dans `config.js`
  (par défaut lundi → samedi), jusqu'à 3 mois à l'avance.
- Comme le site est statique (sans base de données), **tous les créneaux apparaissent disponibles** :
  une réservation est une **demande** que vous confirmez ensuite. C'est le fonctionnement adapté à
  un envoi par e-mail. Pour bloquer réellement les créneaux déjà pris, il faudrait ajouter un
  service de réservation avec base de données — faisable dans un second temps.

---

## 7. Personnaliser le style

Les couleurs, arrondis et ombres sont centralisés en haut de `css/styles.css` (variables `:root`).
Modifiez `--brand`, `--accent`, etc. pour adapter la charte graphique.
