# Administration SDBSNX

## Accès

- Site public : `https://sdbsnx.site`
- Connexion : `https://sdbsnx.site/connexion`
- Administration : `https://sdbsnx.site/admin`

Une authentification est requise avant d’accéder aux pages du site. Il n’y a pas d’inscription depuis le site : les comptes sont créés dans le nouveau projet Supabase. La connexion accepte un mot de passe ou un lien magique par e-mail. Pour administrer le site, le compte doit aussi avoir un rôle `admin` ou `editor` dans `user_roles`.

## Rôles

| Rôle | Permissions de l’interface |
|---|---|
| `student` | Aucun accès au panneau d’administration. |
| `editor` | Consulter, créer, modifier et publier des cours, ressources, éléments de bibliothèque et annonces ; pas de suppression ni d’accès aux fonctions réservées à l’administration. |
| `admin` | Toutes les permissions d’éditeur, suppression, consultation des utilisateurs et du journal d’audit, changement du rôle des autres utilisateurs. Un administrateur ne peut pas changer son propre rôle. |

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

Les utilisateurs et mots de passe de l’ancien projet Supabase ne sont pas transférés au nouveau projet. Dans **le nouveau projet → Authentication → Users**, créez l’utilisateur avec l’adresse souhaitée et définissez son mot de passe, puis copiez son UUID. Dans **SQL Editor**, attribuez-lui le rôle :

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

Dans Supabase Auth, vérifiez l’URL du site et ajoutez `https://sdbsnx.site/connexion` aux URL de redirection autorisées pour les liens magiques. En production, ajoutez aussi l’URL de connexion effective si le domaine ou le protocole change.

Vérifications locales : `npm run build` passe ; `npm run test:e2e -- --workers=1` passe (4 scénarios, incluant la redirection des visiteurs non connectés et les mesures responsive aux largeurs 360, 390, 768, 1024 et 1440 px, en thèmes clair et sombre). Il n’existe pas de script lint dans `package.json`. Les tests E2E simulent Supabase et ne remplacent pas une validation des permissions réelles. L’administration et son CSS sont chargés à la demande ; l’ancienne présentation des documents locaux reste indépendante et conservée.

## Limites de vérification

Le verrou de navigation est une protection d’interface, pas une barrière pour les fichiers statiques. Les données privées doivent aussi être protégées par RLS ; ne placez pas de contenu confidentiel dans le bundle public ou dans des buckets publics. Le build local et l’interface peuvent être vérifiés sans modifier Supabase. Les opérations réelles nécessitent un compte de test autorisé et le schéma/RLS du projet correspondant au tableau ci-dessus. Ne testez pas les créations, changements de rôle ou suppressions sur des données de production. Utilisez un projet de test et vérifiez les politiques avec un compte `student`, un compte `editor` et un compte `admin`.

Les résultats de Lighthouse, l’upload Storage et les opérations Auth/RLS ne sont pas déclarés comme validés tant que ces tests n’ont pas été exécutés sur un environnement de test Supabase. `npm audit` signale encore des vulnérabilités : au moins un avis critique sur `tar`, un avis élevé sur `pdfjs-dist` et des avis modérés transitifs ; aucune mise à niveau majeure forcée n’a été appliquée.
