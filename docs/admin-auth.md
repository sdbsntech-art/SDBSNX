# Configurer l’accès administrateur

L’identifiant, le mot de passe et la clé de signature sont lus uniquement par les fonctions serveur Vercel. Ne leur ajoutez jamais le préfixe `VITE_` : les variables Vite sont intégrées au JavaScript envoyé au navigateur.

## Déploiement Vercel

Dans le projet Vercel, ouvrez **Settings → Environment Variables** et ajoutez :

- `ADMIN_EMAIL` : l’adresse administrateur
- `ADMIN_PASSWORD` : un nouveau mot de passe fort
- `ADMIN_SESSION_SECRET` : une clé aléatoire d’au moins 32 caractères

Vous pouvez générer la clé de session sur votre ordinateur avec :

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Enregistrez les variables pour les environnements souhaités puis redéployez le site. Ces valeurs ne doivent pas être commitées dans Git. Le fichier `.env.example` documente leurs noms ; le fichier `.env` local est ignoré par Git.

Les anciennes informations d’accès ayant été présentes dans le code côté navigateur, remplacez impérativement l’ancien mot de passe par un nouveau avant le déploiement.

## Développement local

Les routes `/api/admin/*` sont des fonctions Vercel. Pour les tester avec le site en local, liez le dossier au projet Vercel, renseignez les variables d’environnement locales, puis lancez `vercel dev` au lieu du serveur Vite seul.

Les documents ajoutés depuis l’interface restent enregistrés dans le navigateur utilisé ; cette authentification ne synchronise pas les documents entre appareils.
