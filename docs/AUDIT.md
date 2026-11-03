# Audit technique et éditorial — SDBSNX / IDA Cours

**Phase :** 0 — audit sans modification du code

**Branche :** `refonte/phase0-audit`

**Périmètre :** dépôt Git courant, configuration Vite/Vercel, sources React, scripts de build, dépendances et ressources suivies.

**Date des vérifications :** 2 novembre 2026.

Cet audit décrit l’état observé dans le dépôt et, lorsque cela est précisé, une vérification HTTP ponctuelle du site public. Il ne prouve ni l’état de la base Supabase de production ni les autorisations relatives aux contenus.

## Résumé exécutif

- Le build de production réussit, mais signale un bundle JavaScript initial d’environ **1,14 Mo** et l’usage de `eval` dans PDF.js.
- `npm audit` signale **8 vulnérabilités** (1 critique, 3 élevées, 4 modérées). Avec `--omit=dev`, il en signale encore **6** (1 critique, 2 élevées, 3 modérées).
- Un mot de passe administrateur en clair a été repéré dans l’historique Git, mais pas dans la version courante. Sa valeur n’est volontairement pas reproduite ici.
- Les métadonnées SEO du dépôt désignent `sdbsnx.vercel.app`, pas `ida-cours.site`. Le domaine personnalisé répond, redirige vers `www.ida-cours.site`, et la page finale servie lors du contrôle conserve encore un canonical vers le domaine Vercel.
- Le site public conserve des données locales et un nouveau panneau Supabase est en cours d’intégration sur la branche `feature/admin-supabase`. Il utilise l’authentification Supabase et les tables éditoriales décrites dans `docs/ADMIN.md`. Le schéma de production et l’application réelle des politiques RLS restent à vérifier.
- Les droits sur les PDF, logos institutionnels, images et vidéos référencées ne sont pas documentés dans le dépôt.
- **Mise à jour de domaine (2 novembre 2026) :** le domaine demandé est désormais `sdbsnx.site`, acheté auprès de LWS et déployé sur Vercel. Les références canoniques, SEO et sitemap du dépôt ont été alignées sur `https://sdbsnx.site`. La configuration DNS LWS, le rattachement du domaine dans Vercel, les redirections HTTPS et la propriété Search Console doivent encore être confirmés après déploiement.

## CRITIQUE

### C-01 — Dépendance `tar` vulnérable dans l’arbre d’installation

- **Références :** `package-lock.json:758-778` (`@mapbox/node-pre-gyp` dépend de `tar`), `package-lock.json:2573-2590` (`tar` 6.2.1).
- **Constat :** `npm audit` classe `tar` comme vulnérabilité critique, notamment pour des scénarios de traversée de liens et d’écriture de fichiers lors de l’extraction d’archives. Le paquet est présent comme dépendance optionnelle indirecte de `canvas` et `@mapbox/node-pre-gyp`.
- **Portée :** le risque concerne d’abord l’installation ou le traitement d’archives dans l’environnement qui installe les dépendances ; le dépôt ne montre pas que l’application traite elle-même des archives fournies par les visiteurs.
- **Correction proposée :** mettre à jour la chaîne dépendante vers une version corrigée, contrôler l’arbre (`npm ls tar`) et relancer `npm audit` après changement. Ne pas supprimer arbitrairement `canvas` ou ignorer l’alerte sans vérifier les usages et les builds Vercel.

## ÉLEVÉ

### E-01 — Identifiant d’administration en clair dans l’historique Git

- **Références :** historique uniquement, `src/components/DocumentAdmin.jsx:15-16` dans le commit `2a2a183` (également retrouvé dans des commits ultérieurs). Ce fichier et ces déclarations ne sont pas présents dans l’arbre courant.
- **Constat :** la recherche de l’historique trouve des déclarations d’identifiants administrateur en clair. Aucune valeur n’est reproduite dans ce rapport. Aucun fichier `.env` n’est actuellement suivi par Git ; `.gitignore:16-18` exclut `.env` et `.env.*` sauf `.env.example`.
- **Risque :** supprimer un secret du dernier commit ne l’efface pas de l’historique public, des clones ou des caches. La réutilisation éventuelle du mot de passe ailleurs augmenterait l’impact.
- **Correction proposée :** révoquer ou renouveler tout identifiant encore actif ou réutilisé ; considérer les valeurs historiques comme compromises. Si la suppression de l’historique est souhaitée, elle doit faire l’objet d’une opération séparée et coordonnée avec les clones et le dépôt distant. Ne jamais republier les valeurs dans un rapport ou un commit.

### E-02 — PDF.js ancien et vulnérabilités de dépendances élevées

- **Références :** `package.json:15,24` (`pdfjs-dist` `^3.11.174`, Vite `^5.4.11`), `src/components/PdfViewerModal.jsx:25,118-121` (worker CDN et ouverture du document), `package-lock.json:2229-2233,2675-2687` (versions verrouillées de PDF.js et Vite), `package-lock.json:758-778` (`@mapbox/node-pre-gyp`).
- **Constat :** `npm audit` signale une vulnérabilité élevée de PDF.js permettant l’exécution de JavaScript à l’ouverture d’un PDF malveillant. Le lecteur accepte des PDF référencés par l’application et les ouvre avec PDF.js.
- **Correction proposée :** mettre à jour vers une version corrigée compatible, verrouiller le worker et les fichiers associés sur la même version, puis tester des PDF représentatifs. Réexaminer aussi les autres alertes élevées de l’arbre, notamment Vite et `@mapbox/node-pre-gyp`, selon leur présence dans les environnements de build.

### E-03 — Utilisation institutionnelle présentée comme partenariat ou tutelle

- **Références :** `src/data/formateursData.js:9,21-25,37-41`; logos utilisés notamment dans `src/views/HomeView.jsx:81-109`.
- **Constat :** des badges et libellés présentent Grafikart comme « Partenaire Pédagogique » et l’UNCHK comme « Tutelle Universitaire ». Le contexte fourni pour ce projet indique qu’il est indépendant et sans affiliation officielle.
- **Risque :** l’interface peut laisser croire à une approbation, une tutelle ou un partenariat qui n’est pas établi par le dépôt.
- **Correction proposée :** remplacer ces termes par des formulations factuelles telles que « Ressource externe » ou « Lien utile », et afficher clairement l’indépendance du projet. N’utiliser des marques/logos comme partenaires qu’après autorisation explicite.

## MODÉRÉ

### M-01 — Canonical, sitemap et liens sociaux utilisent le mauvais domaine

- **Références :** `index.html:16,25,28,36,39,65-78`; `src/context/AppContext.jsx:5,240-258`; `scripts/generate-sitemap.js:7-8,46,53,76`; `public/robots.txt:5`; `public/sitemap.xml:4`.
- **Constat :** les canonical, Open Graph, Twitter, données structurées, sitemap et robots.txt du dépôt pointent par défaut vers `https://sdbsnx.vercel.app/`, alors que le domaine annoncé est `ida-cours.site`. Une requête HTTP effectuée pendant l’audit a constaté une redirection de `ida-cours.site` vers `www.ida-cours.site`; la page finale testée renvoyait encore un canonical vers `sdbsnx.vercel.app`.
- **Correction proposée :** choisir une seule origine canonique (avec ou sans `www`), puis l’utiliser de façon cohérente dans `index.html`, `SITE_ORIGIN`, la variable `SITE_URL`, le sitemap et `robots.txt`. Vérifier ensuite les redirections Vercel, les URL de sitemap et les propriétés Search Console.
- **Suivi Phase 1-2 :** les métadonnées, l’origine canonique et le sitemap ont d’abord été alignés sur `https://ida-cours.site`.
- **Mise à jour du 2 novembre 2026 :** ces références ont été migrées vers `https://sdbsnx.site`. Vérifier que la variable `SITE_URL` de Vercel, si elle existe, vaut également `https://sdbsnx.site`; confirmer le domaine personnalisé, le DNS, le HTTPS et la propriété Search Console après déploiement.

### M-02 — Rendu initial dépendant de JavaScript et poids important sur mobile

- **Références :** `index.html:102-103`; scripts de build dans `package.json:8`; sortie Vercel `vercel.json:5`.
- **Constat :** le HTML initial ne contient qu’un conteneur `#root` vide et le module React ; les titres et contenus de l’application sont ajoutés côté client. Le build observé produit un bundle JavaScript initial d’environ **1 136,97 kB** (269,67 kB gzip), au-dessus du seuil d’avertissement Vite de 500 kB.
- **Impact :** exploration et affichage initial potentiellement retardés pour les moteurs de recherche et les connexions mobiles lentes.
- **Correction proposée :** étudier le découpage du bundle (notamment le lecteur PDF) et, si les pages doivent être indexées avec leur contenu, un pré-rendu ou un rendu serveur compatible avec le déploiement existant. Mesurer les Core Web Vitals avant et après.

### M-03 — Formulaire de discussion sans limites et stockage uniquement local

- **Références :** `src/views/ForumCommentsView.jsx:15,51-68,132,169`.
- **Constat :** la validation vérifie seulement que le nom et le message ne sont pas vides ; aucune limite de longueur n’est visible sur les champs. Les commentaires sont lus et écrits dans le `localStorage` du navigateur.
- **Impact :** les messages ne sont pas partagés entre visiteurs, peuvent disparaître avec les données du navigateur et une saisie volumineuse peut saturer le stockage local. Il s’agit d’un forum local, pas d’un service de publication partagé.
- **Correction proposée :** expliciter cette portée dans l’interface ou, si un forum partagé est requis, concevoir un stockage distant avec validation et contrôles d’accès adaptés. Dans les deux cas, définir des longueurs maximales et traiter les erreurs de stockage.

### M-04 — Politiques Supabase présentes dans le dépôt, mais état de production inconnu

- **Références :** `src/lib/supabase.js:1-3`; `supabase/schema.sql:24-25,48-70,96-113`; `supabase/README.md:1-7`.
- **Constat initial (Phase 0) :** le module exportait un client nul et aucune utilisation active de Supabase n’avait été trouvée. Le schéma décrivait seulement l’ancienne administration documentaire, et le README contenait des instructions Netlify obsolètes.
- **Limite de vérification :** le dépôt ne permet pas de confirmer si ce SQL a été appliqué à un projet distant, si des données subsistent ou quelles clés sont configurées dans un tableau de bord.
- **Suivi du 2 novembre 2026 :** un nouveau client Supabase et des routes `/connexion` et `/admin` ont été ajoutés ; le client est initialisé à la demande depuis `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`. Le README Supabase a été réécrit pour distinguer l’ancien schéma documentaire du nouveau panneau. Ce code ne modifie pas la base distante. Le nouveau panneau attend les tables décrites dans `docs/ADMIN.md` ; les politiques réelles, les rôles et les opérations restent à valider sur un projet de test.
- **Action restante :** confirmer manuellement le schéma et les politiques du projet Supabase avant de déployer le panneau. Soumettre toute évolution de base comme migration SQL relisible, sans modifier directement la production.

### M-05 — Déclarations juridiques et de disponibilité non étayées

- **Références :** `src/views/LegalModal.jsx:22,30,70`.
- **Constat :** les mentions affichent une localisation précise (« Dakar, Pikine, Dalifort ») et promettent une infrastructure à haute disponibilité ainsi qu’un accès 24 h/24 et 7 j/7. Le dépôt ne fournit pas de justificatif pour ces affirmations.
- **Correction proposée :** vérifier chaque information avant publication. Pour les données juridiques non confirmées, utiliser `[À COMPLÉTER]` ou retirer l’affirmation, sans inventer d’adresse, de statut, de RCCM ou de NINEA.

### M-06 — Directive CSP permissive et protections déclarées comme métadonnées

- **Références :** `index.html:94-98`; absence d’en-têtes de sécurité dans `vercel.json`.
- **Constat :** la CSP autorise `'unsafe-inline'` et `'unsafe-eval'` pour les scripts et autorise largement les ressources HTTPS. `X-Frame-Options` était déclaré via une balise meta, qui n’est pas un mécanisme fiable pour imposer cet en-tête. Le build signale également l’usage d’`eval` par le bundle PDF.js.
- **Correction proposée :** configurer les en-têtes HTTP au niveau de l’hébergement, puis resserrer la CSP après inventaire des scripts, polices, iframes et CDN nécessaires. Tester chaque directive en mode rapport avant application stricte.
- **Suivi Phase 1-2 :** `vercel.json` configure désormais `X-Content-Type-Options`, `X-Frame-Options` et `Referrer-Policy` comme en-têtes HTTP, et les déclarations meta inopérantes ont été retirées. La CSP permissive et l’usage d’`eval` dans PDF.js restent à traiter séparément.

### M-07 — Ouvertures externes sans isolation de l’onglet

- **Références :** `src/components/PdfViewerModal.jsx:244,624,864`; `src/components/VideoPlayerModal.jsx:145,155`; `src/views/VideosView.jsx:112,119,308`; `src/views/FormateursView.jsx:68,78,120`; `src/components/Footer.jsx:141`.
- **Constat :** plusieurs appels `window.open(..., '_blank')` ne demandent pas `noopener,noreferrer`. Les destinations actuellement visibles sont des URL statiques ou des URL tirées de données de contenu, ce qui réduit le risque d’injection mais laisse une possibilité de tabnabbing si une destination change.
- **Correction proposée :** ajouter `noopener,noreferrer` à toutes les ouvertures externes ou préférer des liens `<a target="_blank" rel="noopener noreferrer">`. Valider les domaines autorisés si les URL deviennent éditables.

### M-08 — Ancien code HTML contient un sink XSS, mais n’est pas dans le build Vite actuel

- **Références :** `main.js:63`; entrée de build actuelle dans `index.html:103` et sortie Vercel déclarée dans `vercel.json:5`.
- **Constat :** l’ancien script insère directement une valeur de commentaire issue du `localStorage` dans `innerHTML`, sans échappement. `main.js` n’est pas chargé par l’`index.html` actuel et n’est pas copié dans la sortie Vite observée ; ce constat ne démontre donc pas une XSS exploitable sur le site actuellement généré.
- **Correction proposée :** supprimer ce code historique lors d’une phase ultérieure, ou remplacer l’insertion HTML par des nœuds texte avant toute remise en service de l’ancienne page.

## Inventaire des ressources tierces et droits

Le dépôt ne contient pas de registre de licences, d’autorisations de reproduction ou de provenance pour ces ressources. « Non documentée » signifie que l’audit n’a trouvé aucune preuve dans le dépôt, et non qu’une autorisation n’existe pas.

| Fichier / ressource | Source constatée | Licence ou autorisation connue dans le dépôt | Décision proposée |
|---|---|---|---|
| `LICENCE 1/**`, `LICENCE 2/**`, `COURS LICENCE 3 SEMESTRE 5/**` ; copiés vers `dist/courses/L1`, `L2`, `L3` par `scripts/copy-course-assets.js:8-31` | Documents locaux du dépôt, copiés automatiquement au build (746 fichiers copiés lors du build audité) | Aucune licence ou autorisation globale identifiée ; auteur et conditions à vérifier fichier par fichier | Conserver en publication uniquement après vérification des droits ; sinon remplacer par un lien vers la source officielle ou retirer la copie publique. |
| `src/data/videosData.js` (URL YouTube, miniatures `img.youtube.com`, intégrations `youtube-nocookie.com`) | YouTube et créateurs cités, notamment Grafikart | Aucun accord de republication ni registre de licence dans le dépôt ; l’hébergement sur YouTube ne prouve pas une autorisation de télécharger ou republier ailleurs | Garder les liens/lecteurs officiels avec attribution ; ne pas télécharger ni héberger les vidéos localement sans autorisation. Vérifier les miniatures et les règles de confidentialité liées aux embeds. |
| `public/unchk-uvs-logo.png` et `public/force-n-logo.png`, utilisés notamment dans `src/views/HomeView.jsx:95-109` | Marques/logos institutionnels intégrés localement | Autorisation d’usage et provenance non documentées | Remplacer temporairement par des liens textuels si l’usage de marque n’est pas autorisé ; conserver les logos seulement après vérification. |
| `public/sdbsnx-logo.png`, `public/logo.png` | Identité visuelle SDBSNX du site | Le dépôt ne précise pas l’auteur ni les droits, même si le logo semble être celui du projet | Confirmer que le projet en détient les droits et conserver la source originale si disponible. |
| Polices chargées depuis `fonts.googleapis.com` dans `index.html:57-58` | Google Fonts (Outfit, Plus Jakarta Sans, JetBrains Mono) | Les fichiers de licence ne sont pas archivés dans le dépôt | Vérifier les licences des familles utilisées et les consigner ; envisager l’hébergement local si nécessaire pour la confidentialité et les performances. |
| PDF.js worker et CMaps servis depuis `cdnjs.cloudflare.com` dans `src/components/PdfViewerModal.jsx:25,120` | CDN cdnjs / projet PDF.js | La licence du paquet est renseignée dans le lockfile ; la version chargée à distance doit rester cohérente avec celle du paquet | Épingler la même version, documenter la licence et, si possible, servir les fichiers depuis le build pour réduire la dépendance au CDN. |

## Vérifications effectuées

- **Git :** `git status` initial propre avant création de `refonte/phase0-audit` ; statut contrôlé à nouveau sur cette branche. Recherche de l’historique Git pour les déclarations `ADMIN_PASSWORD`, sans recopier les valeurs.
- **Dépendances :** `npm audit` : 8 vulnérabilités (1 critique, 3 élevées, 4 modérées). `npm audit --omit=dev` : 6 (1 critique, 2 élevées, 3 modérées).
- **Build :** `npm run build` réussi ; 1 894 modules transformés, ressources de cours copiées, sitemap de 421 URL généré. Avertissements Vite sur `eval` de PDF.js et sur le chunk JavaScript supérieur à 500 kB.
- **Tests et lint :** aucun script de test ou de lint défini dans `package.json` ; `npm run` ne liste que `dev`, `build` et `preview`.
- **XSS et liens :** aucune occurrence de `dangerouslySetInnerHTML` trouvée dans `src/`. Un `innerHTML` a été trouvé dans le script historique `main.js`, hors du build courant. Plusieurs ouvertures `window.open` n’incluent pas `noopener,noreferrer`.
- **Supabase :** le SQL versionné et le panneau ajoutés au dépôt ont été inspectés ; aucun accès au dashboard ou à la base de production n’a été effectué. Les tests UI utilisent des réponses Supabase simulées.
- **Domaine :** `ida-cours.site` répond et redirige vers `www.ida-cours.site`. Les métadonnées du HTML retourné lors du contrôle pointaient encore vers `sdbsnx.vercel.app`.
- **Mise à jour après le changement de domaine :** `sdbsnx.site` est la nouvelle origine canonique configurée dans le dépôt. Aucun contrôle du DNS LWS ni de la configuration Vercel distante n’a été réalisé dans cette phase.

## Actions manuelles recommandées

1. Renouveler tout secret historique susceptible d’être encore actif ou réutilisé ; vérifier les variables Vercel sans les partager.
2. Mettre à jour les dépendances vulnérables et vérifier que le build Vercel utilise le lockfile corrigé.
3. Vérifier les droits des PDF, logos, images et vidéos avant de maintenir leur publication.
4. Confirmer l’origine canonique du domaine, les redirections, les propriétés Search Console et le sitemap effectivement publié.
5. Vérifier dans le dashboard Supabase le schéma attendu par le panneau et contrôler les politiques RLS avant de l’activer auprès des utilisateurs.
6. Faire valider les mentions légales et retirer toute adresse ou promesse de disponibilité non confirmée.

## Limites et risques restants

- Aucun accès aux dashboards Vercel, Supabase ou Google Search Console n’a été utilisé ; configuration distante, DNS, en-têtes HTTP et état réel de la base restent à confirmer par le propriétaire.
- L’existence d’autorisations de contenu en dehors du dépôt ne peut pas être déduite de l’audit.
- `npm audit` décrit l’arbre de dépendances résolu au moment du contrôle ; les résultats peuvent changer avec les avis de sécurité et les versions publiés.
- Aucun correctif de code, SQL de migration ou changement de production n’a été appliqué pendant cette phase.
