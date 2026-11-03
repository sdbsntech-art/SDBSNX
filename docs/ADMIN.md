# Administration SDBSNX

## Accès

- Site public : `https://sdbsnx.site`
- Connexion : `https://sdbsnx.site/connexion`
- Administration : `https://sdbsnx.site/admin`

Une authentification est requise avant d’accéder aux pages du site. Après connexion, les utilisateurs arrivent sur l’accueil et peuvent utiliser le menu de cours, révisions et ressources. L’inscription est disponible par e-mail/mot de passe et par Google OAuth; les liens magiques restent disponibles pour la connexion. La déconnexion se trouve en bas du site.

## Rôles

| Rôle | Permissions de l’interface |
|---|---|
| `student` | Aucun accès au panneau d’administration. |
| `student` ou compte sans rôle | Accès au contenu du site après connexion; aucun accès à `/admin`. |
| `editor` | Aucun accès au panneau; les opérations d’édition sont désactivées dans l’interface actuelle. |
| `admin` | Seul rôle pouvant accéder au panneau et à ses fonctions d’administration. |

Le contrôle de rôle dans le navigateur sert à guider l’interface ; la sécurité repose sur les politiques RLS de Supabase. Ne désactivez pas RLS pour contourner une erreur d’accès.

## Modèle Supabase utilisé par le nouveau panneau

Le panneau s’attend aux tables déjà préparées dans le projet Supabase :

- `profiles` (`id`, `email`, `full_name`, `track`, `created_at`)
- `user_roles` (`user_id`, `role`)
- `progress` (`user_id`, `resource_id`, `completed`, `completed_at`)
- `audit_logs` (`user_id`, `action`, `details`, `created_at`)
- `courses` (`title`, `description`, `level`, `published`, `created_by`, `created_at`)
- `resources` (`course_id`, `title`, `type`, `url`, `content`, `position`, `published`, `created_at`)
- `library_items` (`title`, `author`, `description`, `category`, `file_path`, `external_url`, `published`, `created_by`, `created_at`)
- `announcements` (`title`, `content`, `published`, `created_by`, `created_at`)
- Bucket Storage `library`, public, limite 20 Mo, PDF/EPUB/PNG/JPEG/WebP.

Le panneau ne crée pas ces tables et ne change pas la base distante. Les rôles, lectures, modifications et suppressions sont soumis aux politiques RLS configurées dans le projet. Si le schéma réel diffère, vérifier le schéma et préparer une migration SQL à relire avant tout changement.

### Créer le compte administrateur dans le nouveau projet

Les utilisateurs et mots de passe de l’ancien projet Supabase ne sont pas transférés au nouveau projet. Les utilisateurs peuvent s’inscrire depuis `/connexion`; l’administrateur doit être créé dans **le nouveau projet → Authentication → Users**, puis son UUID reçoit le rôle `admin` dans `user_roles` :

```sql
insert into public.user_roles (user_id, role)
values ('UUID_DU_COMPTE', 'admin')
on conflict (user_id) do update
set role = excluded.role;
```

Cette opération doit être exécutée par le propriétaire dans le dashboard avec les permissions adaptées. Ne communiquez jamais le mot de passe ou une clé secrète dans le code ou la conversation.

### Ajouter un éditeur

Dans **Supabase → Authentication → Users**, créez ou repérez le compte de l’éditeur et copiez son UUID. Dans **SQL Editor**, exécutez cette requête en remplaçant le placeholder par l’UUID exact :

```sql
insert into public.user_roles (user_id, role)
values ('UUID_DU_COMPTE', 'editor')
on conflict (user_id) do update
set role = excluded.role;
```

Confirmez que les contraintes et politiques RLS de votre projet autorisent cette écriture administrative. Ne mettez jamais de mot de passe ou de clé secrète dans cette requête, le code ou Git.

## Environnement et déploiement

Variables frontend requises (clé publique uniquement) :

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Pour le développement local, renseignez-les dans `.env` ou `.env.local`, ignoré par Git. Dans Vercel, définissez la nouvelle URL et la nouvelle clé dans **Project → Settings → Environment Variables** pour les environnements utilisés, puis redéployez. `VITE_SUPABASE_ANON_KEY` doit être une clé `publishable` du nouveau projet. Le client refuse les URL avec `/rest/v1` et les clés d’un autre format. N’utilisez jamais `service_role` ou une clé `secret` côté navigateur.

Dans Supabase Auth, activez Google dans **Authentication → Providers → Google**, puis renseignez les identifiants OAuth fournis par Google Cloud. Ajoutez l’URL de callback affichée par Supabase comme URI de redirection autorisée dans Google Cloud. Dans **Authentication → URL Configuration**, réglez le Site URL sur le domaine canonique et autorisez les redirections vers `/` et `/connexion`, ainsi que les origines de développement nécessaires. La configuration Google côté Supabase n’est pas effectuée par ce dépôt.

Vérifications locales : `npm run build` passe ; `npm run test:e2e -- --workers=1` passe (7 scénarios, incluant la redirection des visiteurs non connectés, l’inscription par e-mail, le parcours Google simulé, la connexion étudiant et les mesures responsive aux largeurs 360, 390, 768, 1024 et 1440 px, en thèmes clair et sombre). Il n’existe pas de script lint dans `package.json`. Les tests E2E simulent Supabase et ne remplacent pas une validation des permissions réelles. L’administration et son CSS sont chargés à la demande ; l’ancienne présentation des documents locaux reste indépendante et conservée.

## Limites de vérification

Le verrou de navigation est une protection d’interface, pas une barrière pour les fichiers statiques. Les données privées doivent aussi être protégées par RLS ; ne placez pas de contenu confidentiel dans le bundle public ou dans des buckets publics. Le build local et l’interface peuvent être vérifiés sans modifier Supabase. Les opérations réelles nécessitent un compte de test autorisé et le schéma/RLS du projet correspondant au tableau ci-dessus. Ne testez pas les créations, changements de rôle ou suppressions sur des données de production. Utilisez un projet de test et vérifiez les politiques avec un compte `student`, un compte `editor` et un compte `admin`.

Les résultats de Lighthouse, l’upload Storage et les opérations Auth/RLS ne sont pas déclarés comme validés tant que ces tests n’ont pas été exécutés sur un environnement de test Supabase. `npm audit` signale encore des vulnérabilités : au moins un avis critique sur `tar`, un avis élevé sur `pdfjs-dist` et des avis modérés transitifs ; aucune mise à niveau majeure forcée n’a été appliquée.
