# Registre des autorisations et ressources externes

**État du registre :** aucune autorisation écrite (contrat, e-mail d’accord, licence ou autorisation de marque) n’a été trouvée dans le dépôt au 2 novembre 2026. Ce registre ne nie pas l’existence éventuelle d’accords conservés hors du dépôt. Aucun accord ne doit être présenté comme acquis avant vérification d’une preuve écrite.

| Ressource | Provenance connue | Preuve écrite dans le dépôt | Traitement appliqué |
|---|---|---|---|
| Tutoriels vidéo Grafikart | Liens YouTube et site Grafikart listés dans `src/data/videosData.js` | Aucune pièce d’accord identifiée. L’exemple d’accord mentionné dans la demande n’est pas une copie de l’accord et ne permet pas d’en confirmer les termes. | Conserver uniquement les liens vers les pages officielles. Les miniatures distantes et lecteurs intégrés ont été retirés. Vérifier tout accord éventuellement détenu hors dépôt avant de revendiquer un partenariat ou de réintégrer un logo, une miniature ou un lecteur. |
| UN-CHK / ex-UVS | Site officiel et chaîne YouTube référencés dans l’application | Aucune autorisation de marque ou de logo identifiée. | Les liens textuels vers les sources officielles restent accessibles à la suite d’un clic. Les logos et formulations de partenariat/tutelle ont été retirés de l’interface. |
| FORCE-N | Site officiel référencé dans l’application | Aucune autorisation de marque ou de logo identifiée. | Le logo et les affirmations de partenariat/certification propres au site ont été retirés. Un lien textuel vers la source officielle est conservé. |
| Supports de cours locaux dans `LICENCE 1/`, `LICENCE 2/`, `COURS LICENCE 3 SEMESTRE 5/` et copie locale `public/courses/` | Fichiers présents localement ; la provenance et les titulaires varient et ne sont pas établis par un registre | Aucune autorisation de diffusion identifiée. | Les originaux ne sont ni effacés ni déplacés. Après la copie automatique de Vite, `scripts/copy-course-assets.js` retire uniquement `dist/courses/` du dossier généré ; les liens internes vers ces fichiers sont désactivés dans l’interface jusqu’à validation des droits. |
| `public/web-plat.jpg` | Image locale associée à une entrée de bibliothèque | Aucune licence ou autorisation identifiée. | Image conservée hors de `public/` et lien de téléchargement retiré tant que sa provenance et ses droits ne sont pas confirmés. |
| PDF.js | Paquet open source déclaré dans `package.json` et verrouillé dans `package-lock.json` | Licence du paquet présente dans les métadonnées npm installées ; vérifier/archiver le fichier de licence dans la livraison si requis. | Le worker et les cartes de caractères sont servis localement depuis le paquet installé, au lieu du CDN tiers. |
| Polices Outfit, Plus Jakarta Sans et JetBrains Mono | Google Fonts chargé depuis `index.html` et `src/styles/index.css` | Aucune attribution ou copie locale de licence archivée dans le dépôt. | Les chargements distants ont été supprimés ; la feuille de style utilise les polices système. |

## Accords à documenter

Si une autorisation Grafikart ou une autre autorisation écrite existe hors du dépôt, ajouter une référence vérifiable (date, parties, périmètre, durée, territoire, supports autorisés, attribution requise et emplacement sécurisé de la preuve) après vérification par le titulaire. Ne pas ajouter de secret, adresse privée ou pièce confidentielle à Git. Le fait de lier une page officielle ne constitue pas une autorisation de reproduire son contenu, sa marque ou ses visuels.

Avant de réactiver la publication des supports de cours, documenter pour chaque ensemble concerné le titulaire, la source, la licence ou l’autorisation, les conditions d’attribution et la portée de la diffusion en ligne.
