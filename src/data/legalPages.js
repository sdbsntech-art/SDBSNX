export const LEGAL_PAGES = {
  about: {
    path: '/a-propos',
    title: 'À propos',
    description: 'Présentation de SDBSNX et de la plateforme IDA Cours.',
    sections: [
      {
        heading: 'Un projet indépendant',
        paragraphs: [
          "Cette plateforme est un projet indépendant développé et administré par SDBSNX. Elle n'est ni affiliée, ni officiellement représentante de l'Université Numérique Cheikh Hamidou Kane (UN-CHK), de FORCE-N ou de Grafikart. Les noms et marques mentionnés appartiennent à leurs propriétaires respectifs.",
          'SDBSNX met à disposition des outils d’apprentissage et des liens vers des ressources externes. La présence d’un lien ne signifie ni partenariat, ni validation, ni certification par son éditeur.'
        ]
      },
      {
        heading: 'Notre objectif',
        paragraphs: [
          'IDA Cours aide les apprenants à organiser leurs révisions et à découvrir des ressources en informatique, développement, cybersécurité et entrepreneuriat.'
        ]
      }
    ]
  },
  legal: {
    path: '/mentions-legales',
    title: 'Mentions légales',
    description: 'Informations sur l’éditeur, l’hébergement et le contact de SDBSNX.',
    sections: [
      {
        heading: 'Éditeur',
        paragraphs: [
          'Nom du projet : SDBSNX — IDA Cours.',
          'Éditeur ou personne responsable : Seydou Bakhayokho.',
          'Statut juridique : non communiqué par l’éditeur et à confirmer avant publication définitive.',
          'Adresse postale : non communiquée. Contact : sdbsntech@gmail.com.'
        ]
      },
      {
        heading: 'Hébergement',
        paragraphs: [
          'Le déploiement de la plateforme est réalisé sur Vercel. Le domaine est géré auprès de LWS. Les entités contractantes, les services éventuellement hébergés chez chaque prestataire, les coordonnées contractuelles et les régions de traitement restent à confirmer.'
        ]
      },
      {
        heading: 'Indépendance',
        paragraphs: [
          'SDBSNX / IDA Cours est un projet indépendant et ne représente officiellement aucune université, programme, entreprise ou organisme cité sur le site.'
        ]
      }
    ]
  },
  privacy: {
    path: '/confidentialite',
    title: 'Confidentialité',
    description: 'Données locales, finalités, durées et moyens de contact.',
    sections: [
      {
        heading: 'Données utilisées',
        paragraphs: [
          'Sans compte utilisateur, certaines fonctions enregistrent dans le stockage local de votre navigateur votre thème, votre progression, vos favoris, vos notes de vidéos, vos éléments marqués comme vus, votre score d’exercices et vos commentaires locaux. Ces éléments ne sont pas synchronisés avec les autres visiteurs.',
          'Une ancienne fonction locale de gestion documentaire utilise aussi la clé sdbsnx_local_documents. Les documents qu’elle contient, s’ils existent sur votre appareil, restent locaux et ne sont pas effacés par le bouton de suppression ci-dessous.',
          'Les personnes autorisées à se connecter à l’administration transmettent leur adresse e-mail et leurs données de compte à Supabase Auth. Le navigateur conserve la session d’authentification dans son stockage local. Les profils, rôles, contenus publiés et journaux d’audit sont enregistrés dans le projet Supabase configuré par l’éditeur, selon les permissions RLS. La durée de conservation et la région du projet restent à confirmer.',
          'Lorsqu’une page est demandée, l’hébergeur peut traiter des données techniques de requête (par exemple adresse IP, date, chemin demandé et informations de navigateur). Les champs réellement journalisés et leur durée de conservation dépendent de la configuration et des conditions de l’hébergeur et doivent être confirmés.'
        ]
      },
      {
        heading: 'Finalités et bases légales à confirmer',
        paragraphs: [
          'Le stockage local sert à conserver les préférences et la progression demandées par l’utilisateur sur son appareil. Les journaux techniques peuvent servir au fonctionnement, à la sécurité et au diagnostic du service. Les bases légales applicables à ces traitements restent à qualifier et à valider par un juriste.',
          'Le site renvoie vers des services tiers tels que YouTube uniquement par des liens déclenchés par l’utilisateur. Après avoir quitté le site, ces services appliquent leurs propres politiques et peuvent traiter des données selon leurs réglages.'
        ]
      },
      {
        heading: 'Sous-traitants et services tiers',
        paragraphs: [
          'Déploiement : Vercel est la cible de déploiement configurée dans le dépôt ; le domaine est géré chez LWS. Les rôles exacts de chaque prestataire, entités contractantes, régions de traitement et durées des journaux restent à vérifier.',
          'Supabase : service utilisé pour l’authentification des comptes d’administration et, lorsque configuré, la lecture et la gestion des cours, ressources, annonces, éléments de bibliothèque, profils et journaux d’audit. Le propriétaire du projet, la région de traitement, les paramètres contractuels, les durées et les politiques de suppression doivent être confirmés.',
          'Les vidéos ne sont pas intégrées dans la page : un clic ouvre le site YouTube dans un nouvel onglet. Aucun outil d’analytique ou pixel publicitaire n’a été identifié dans le code examiné.'
        ]
      },
      {
        heading: 'Durée et suppression',
        paragraphs: [
          'Les données enregistrées localement restent dans le navigateur jusqu’à leur suppression par l’utilisateur ou par le navigateur. Les durées de conservation des journaux de Vercel et des éventuels services LWS utilisés restent à vérifier auprès des prestataires.',
          'Vous pouvez supprimer les préférences, notes, favoris, progression, score et commentaires locaux avec le bouton ci-dessous. Ce bouton ne supprime ni une session Supabase, ni les données enregistrées dans le projet Supabase ; déconnectez-vous de l’administration et adressez toute demande relative au compte ou aux données côté serveur à sdbsntech@gmail.com. Pour supprimer aussi les documents locaux éventuels, une ancienne inscription de service worker ou les données en cache du navigateur, effacez les données du site dans les réglages de votre navigateur. Les durées de conservation des données côté Supabase et des journaux d’hébergement restent à confirmer.'
        ]
      },
      {
        heading: 'Droits et référence légale',
        paragraphs: [
          'Cette notice mentionne la loi sénégalaise n° 2008-12 relative à la protection des données à caractère personnel et la Commission de Protection des Données Personnelles (CDP). Cette référence ne constitue pas une déclaration de conformité. Les droits applicables, leur formulation, les formalités nécessaires et les modalités de saisine de la CDP doivent être vérifiés avant publication définitive.'
        ]
      }
    ]
  },
  cookies: {
    path: '/cookies',
    title: 'Cookies et stockage local',
    description: 'Inventaire des cookies, du stockage local et des ressources externes.',
    sections: [
      {
        heading: 'Cookies et traceurs',
        paragraphs: [
          'Le code de l’application ne crée ni ne lit de cookie avec document.cookie. Aucun outil d’analytique, pixel publicitaire ou traceur tiers de mesure d’audience n’a été identifié dans le code examiné. Les éventuels cookies techniques transmis par l’hébergeur restent à confirmer auprès de celui-ci. Il n’y a donc pas de bandeau de consentement actif pour des traceurs non essentiels.'
        ]
      },
      {
        heading: 'Stockage sur votre appareil',
        paragraphs: [
          'Le site utilise localStorage pour les préférences de thème, la progression, les favoris, les notes, les vidéos marquées comme vues, les scores d’exercices et les commentaires enregistrés dans votre navigateur. Ce stockage n’est pas un cookie et n’est pas transmis automatiquement au serveur.',
          'Sur les pages de connexion et d’administration, Supabase Auth conserve la session de l’utilisateur connecté dans le stockage local du navigateur afin de maintenir la connexion. Utilisez le bouton de déconnexion et effacez les données du site sur un appareil partagé. Ce stockage ne passe pas par document.cookie.',
          'Le code de cette version n’enregistre pas de service worker et ne garantit donc pas l’accès hors ligne. Une inscription ou un cache issu d’une version antérieure peut toutefois subsister dans le navigateur ; vous pouvez effacer les données du site depuis ses réglages.'
        ]
      },
      {
        heading: 'Liens vers des services externes',
        paragraphs: [
          'Les vidéos sont proposées sous forme de liens vers YouTube et ne sont pas chargées dans une iframe. Si vous ouvrez un lien, le service externe peut utiliser ses propres cookies ou traceurs selon ses règles. Les ressources et polices distantes non nécessaires ont été retirées de cette version du site.'
        ]
      }
    ]
  },
  terms: {
    path: '/cgu',
    title: 'Conditions générales d’utilisation',
    description: 'Règles d’utilisation de la plateforme indépendante IDA Cours.',
    sections: [
      {
        heading: 'Objet et accès',
        paragraphs: [
          'IDA Cours est un service indépendant destiné à l’apprentissage et à la consultation de ressources. L’accès est fourni sans garantie de disponibilité continue ; des interruptions ou changements peuvent survenir.'
        ]
      },
      {
        heading: 'Usage des ressources',
        paragraphs: [
          'Les textes et fonctionnalités propres à SDBSNX peuvent être utilisés pour consulter le service. Les contenus tiers restent soumis aux droits et conditions de leurs auteurs ou éditeurs. Un lien vers une ressource ne confère aucun droit de la reproduire, télécharger ou redistribuer.'
        ]
      },
      {
        heading: 'Responsabilité et évolution',
        paragraphs: [
          'Les ressources sont proposées à des fins d’information et d’apprentissage. Leur disponibilité, leur exactitude et leur adéquation doivent être vérifiées auprès de leur source. Les présentes conditions devront être relues et complétées avant toute affirmation juridique définitive.'
        ]
      }
    ]
  },
  intellectualProperty: {
    path: '/propriete-intellectuelle',
    title: 'Propriété intellectuelle',
    description: 'Droits sur les contenus SDBSNX et les ressources tierces référencées.',
    sections: [
      {
        heading: 'Contenus tiers',
        paragraphs: [
          'Les noms, marques, vidéos, documents et autres contenus de tiers restent la propriété de leurs ayants droit. Le site privilégie les liens vers les sources officielles et ne revendique aucun droit sur ces contenus.',
          'Les supports de cours locaux dont l’autorisation écrite de diffusion n’est pas documentée ne sont pas inclus dans la version déployée pendant la vérification des droits. Les fichiers sources sont conservés dans le dépôt et ne sont pas supprimés.'
        ]
      },
      {
        heading: 'Demande de retrait ou signalement',
        paragraphs: [
          'Pour signaler un contenu ou demander son retrait, écrivez à sdbsntech@gmail.com en précisant l’URL concernée, le contenu, le titulaire des droits et, si possible, les justificatifs pertinents. La demande sera examinée avant toute action.'
        ]
      }
    ]
  },
  contact: {
    path: '/contact',
    title: 'Contact',
    description: 'Contacter l’équipe SDBSNX au sujet du site, des données ou des contenus.',
    sections: [
      {
        heading: 'Écrire à SDBSNX',
        paragraphs: [
          'Pour une question sur le service, une demande relative aux données personnelles ou un signalement de droits, contactez : sdbsntech@gmail.com.',
          'Pour faciliter le traitement d’une demande relative à un contenu, indiquez l’adresse de la page concernée et décrivez précisément votre demande. N’envoyez pas de mot de passe ni d’autre information sensible.'
        ]
      }
    ]
  }
};
