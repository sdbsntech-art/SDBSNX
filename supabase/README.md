# Configuration de l'administration des documents

L'administration utilise Supabase Auth, Postgres avec Row Level Security et le bucket public `sdbsn-documents`. Le mot de passe n'est stocké ni dans le code ni dans la base de documents.

1. Créez un projet Supabase et exécutez [`schema.sql`](./schema.sql) dans **SQL Editor**.
2. Dans **Authentication > Users**, créez l'utilisateur administrateur avec l'adresse e-mail souhaitée et un nouveau mot de passe. Désactivez les inscriptions publiques si elles ne sont pas nécessaires.
3. Récupérez l'UUID de cet utilisateur dans **Authentication > Users**, puis exécutez dans SQL Editor :

   ```sql
   insert into public.document_admins (user_id)
   values ('UUID_DE_L_UTILISATEUR_ADMIN')
   on conflict (user_id) do nothing;
   ```

4. Copiez `.env.example` vers `.env.local`, puis renseignez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` depuis **Project Settings > API**. La clé `anon`/publishable est conçue pour être utilisée par le navigateur ; les règles RLS du schéma protègent les opérations d'administration. N'utilisez jamais la clé `service_role` dans l'application.
5. Pour le déploiement, ajoutez ces deux variables dans les paramètres d'environnement du site Netlify et relancez un déploiement. Netlify utilise `npm run build`, Node.js 22 et publie le dossier `dist`. Le script de build y recopie les cours L1, L2 et L3 puis génère le sitemap des rubriques, niveaux de licence et PDF publiés. Les chemins des rubriques sont réécrits vers l'application afin qu'ils fonctionnent aussi en accès direct. Si le domaine public change, définissez la variable `SITE_URL` (par exemple `https://exemple.sn`) et modifiez `SITE_ORIGIN` dans `src/context/AppContext.jsx` pour que les URL canoniques utilisent le même domaine.
6. Après le déploiement, ajoutez le site dans Google Search Console, vérifiez-en la propriété, puis envoyez `https://ida-cours.netlify.app/sitemap.xml` (ou l'URL correspondant à votre domaine). L'envoi du sitemap facilite l'exploration, mais ne garantit ni l'indexation ni une position particulière dans les résultats.
7. Le raccourci Admin a été retiré du site. L'authentification et les règles Supabase restent configurées, mais l'interface d'administration n'est plus accessible depuis le pied de page.

Les fichiers acceptés sont PDF, DOC/DOCX, PPT/PPTX et ZIP, jusqu'à 30 Mo. Les visiteurs peuvent consulter les fichiers ; seuls les comptes ajoutés à `document_admins` peuvent les ajouter ou les supprimer.
