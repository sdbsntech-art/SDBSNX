# Configuration Supabase

Le dépôt contient deux fonctionnalités distinctes :

1. La gestion documentaire historique locale, qui lit les documents du navigateur. Les tables/bucket décrits dans `schema.sql` correspondent à une ancienne proposition Supabase documentaire.
2. Le nouveau panneau de gestion `/admin`, conçu pour les tables et rôles Supabase listés dans [`docs/ADMIN.md`](../docs/ADMIN.md).

Ne supprimez ni les tables existantes ni les fichiers historiques pour activer le nouveau panneau. Le fichier `schema.sql` n’est pas une migration du nouveau modèle et ne doit pas être exécuté pour le créer. Aucune base distante n’est modifiée par le code de ce dépôt.

Pour le nouveau panneau, vérifiez que le projet Supabase possède déjà les tables, les politiques RLS, les fonctions et le bucket `library` décrits dans `docs/ADMIN.md`. Les corrections de schéma éventuelles doivent être préparées comme migrations et appliquées par le propriétaire après relecture.

Dans `.env` ou `.env.local`, configurez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` avec l’URL du nouveau projet et sa clé `publishable`. Dans Vercel, remplacez les anciennes valeurs de ces variables dans les paramètres du projet puis redéployez. Une clé `service_role` ou toute clé « secret » ne doit jamais être envoyée au navigateur.

Pour l’ancien schéma documentaire, consultez `schema.sql` avant de l’utiliser ; il ne décrit pas le nouveau panneau et ses noms de bucket/limites diffèrent.
